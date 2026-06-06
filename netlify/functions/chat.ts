// RAG-Chat-Endpoint für das GTS Wiki – mit Cloudflare Workers AI.
//
// Lädt den beim Build erzeugten Embedding-Index, sucht zur Nutzerfrage die
// relevantesten Wiki-Auszüge (Cosine-Similarity) und lässt ein Llama-Modell
// AUSSCHLIESSLICH auf deren Basis antworten. Die KI-Anbindung ist hier
// gekapselt – ein Anbieterwechsel betrifft nur diese Datei.

const EMBEDDING_MODEL = "@cf/baai/bge-m3"
const GENERATION_MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast"

const TOP_K = 6
const MAX_CONTEXT_CHUNKS = 10
const MAX_QUESTION_CHARS = 1000
const MAX_MESSAGES = 20
const MAX_HISTORY_FOR_PROMPT = 6

// Formulierungen, die sich auf die gerade geöffnete Seite beziehen.
const PAGE_INTENT_PATTERNS = [
  "diese seite",
  "dieser seite",
  "die seite",
  "auf der seite",
  "das hier",
  "hier auf",
  "dieser artikel",
  "diesen artikel",
  "der artikel",
  "diesen text",
  "der text",
  "worum geht es hier",
  "was steht hier",
  "fasse",
  "fass mir",
  "fass das",
  "zusammenfass",
  "zusammenfassung",
  "das wichtigste",
  "kernpunkte",
]

type ChatMessage = { role: "user" | "assistant"; content: string }
type IndexChunk = { text: string; title: string; url: string; slug: string; embedding: number[] }
type WikiIndex = { model: string; chunks: IndexChunk[] }
type Source = { title: string; url: string }

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  })

const getEnv = (name: string) => {
  const netlifyEnv = (
    globalThis as { Netlify?: { env?: { get?: (key: string) => string | undefined } } }
  ).Netlify
  return netlifyEnv?.env?.get?.(name) ?? process.env[name]
}

const cfRun = async (accountId: string, token: string, model: string, input: unknown) => {
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(input),
    },
  )
  if (!res.ok) {
    throw new Error(`Cloudflare AI (${model}) fehlgeschlagen: ${res.status} ${await res.text()}`)
  }
  return res.json()
}

// Index einmal pro Cold Start laden und im Modul-Scope cachen.
let indexCache: WikiIndex | null = null
const loadIndex = async (origin: string): Promise<WikiIndex> => {
  if (indexCache) return indexCache
  const res = await fetch(`${origin}/static/wiki-chat-index.json`)
  if (!res.ok) {
    throw new Error(`Index konnte nicht geladen werden: ${res.status}`)
  }
  indexCache = (await res.json()) as WikiIndex
  return indexCache
}

const cosine = (a: number[], b: number[]) => {
  let dot = 0
  let na = 0
  let nb = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    na += a[i] * a[i]
    nb += b[i] * b[i]
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) || 1)
}

const embedQuestion = async (
  accountId: string,
  token: string,
  question: string,
): Promise<number[]> => {
  const data = await cfRun(accountId, token, EMBEDDING_MODEL, { text: [question] })
  const vector = data?.result?.data?.[0]
  if (!Array.isArray(vector)) {
    throw new Error("Embedding-Antwort enthielt keinen Vektor")
  }
  return vector as number[]
}

const retrieve = (index: WikiIndex, queryEmbedding: number[]) => {
  const scored = index.chunks.map((chunk) => ({
    chunk,
    score: cosine(queryEmbedding, chunk.embedding),
  }))
  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, TOP_K).map((s) => s.chunk)
}

const buildSystemPrompt = (chunks: IndexChunk[], currentPageTitle?: string) => {
  const context = chunks
    .map((c, i) => `[Quelle ${i + 1}: ${c.title} (${c.url})]\n${c.text}`)
    .join("\n\n---\n\n")
  const pageHint = currentPageTitle
    ? `\n- Der Nutzer liest gerade die Seite "${currentPageTitle}". Bei Formulierungen wie "diese Seite", "das hier" oder "fasse zusammen" beziehe dich auf diese Seite.`
    : ""
  return `Du bist der Assistent des "GTS Wiki Österfeld", einer pädagogischen Wissensdatenbank zur Ganztagsschule.

Beantworte die Frage AUSSCHLIESSLICH auf Basis der folgenden Wiki-Auszüge. Regeln:
- Nutze nur Informationen aus den Auszügen. Erfinde nichts und greife nicht auf Allgemeinwissen zurück.
- Wenn die Auszüge die Frage nicht beantworten, sage genau: "Dazu finde ich im Wiki nichts." und schlage ggf. ein verwandtes Thema vor, das in den Auszügen vorkommt.
- Antworte auf Deutsch, klar und praxisnah, in kurzen Absätzen oder Stichpunkten.
- Verweise im Text auf die genutzten Seiten per Titel.${pageHint}

Wiki-Auszüge:
${context}`
}

const normalizeSlug = (pageUrl?: string) => {
  if (!pageUrl) return ""
  try {
    const path = pageUrl.startsWith("http") ? new URL(pageUrl).pathname : pageUrl
    return decodeURIComponent(path)
      .replace(/^\/+|\/+$/g, "")
      .toLowerCase()
  } catch {
    return ""
  }
}

const wantsCurrentPage = (question: string) => {
  const lower = question.toLowerCase()
  return PAGE_INTENT_PATTERNS.some((p) => lower.includes(p))
}

const generateAnswer = async (
  accountId: string,
  token: string,
  systemPrompt: string,
  history: ChatMessage[],
) => {
  const messages = [
    { role: "system", content: systemPrompt },
    ...history.slice(-MAX_HISTORY_FOR_PROMPT).map((m) => ({ role: m.role, content: m.content })),
  ]
  const data = await cfRun(accountId, token, GENERATION_MODEL, {
    messages,
    temperature: 0.2,
    max_tokens: 1024,
  })
  return (data?.result?.response ?? "").trim()
}

const dedupeSources = (chunks: IndexChunk[]): Source[] => {
  const seen = new Set<string>()
  const sources: Source[] = []
  for (const c of chunks) {
    if (seen.has(c.url)) continue
    seen.add(c.url)
    sources.push({ title: c.title, url: c.url })
  }
  return sources
}

export default async (req: Request) => {
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405)
  }

  const accountId = getEnv("CF_ACCOUNT_ID")
  const token = getEnv("CF_API_TOKEN")
  if (!accountId || !token) {
    return json({ error: "Chatbot ist nicht konfiguriert." }, 500)
  }

  let payload: { messages?: ChatMessage[]; pageUrl?: string }
  try {
    payload = await req.json()
  } catch {
    return json({ error: "Ungültige Anfrage." }, 400)
  }

  const messages = Array.isArray(payload.messages) ? payload.messages : []
  if (messages.length === 0 || messages.length > MAX_MESSAGES) {
    return json({ error: "Ungültige Anfrage." }, 400)
  }

  const lastUser = [...messages].reverse().find((m) => m.role === "user")
  const question = (lastUser?.content ?? "").trim()
  if (!question) {
    return json({ error: "Bitte stelle eine Frage." }, 400)
  }
  if (question.length > MAX_QUESTION_CHARS) {
    return json({ error: "Die Frage ist zu lang." }, 413)
  }

  try {
    const origin = new URL(req.url).origin
    const index = await loadIndex(origin)
    const queryEmbedding = await embedQuestion(accountId, token, question)
    const simChunks = retrieve(index, queryEmbedding)

    // Bezieht sich die Frage auf die gerade geöffnete Seite? Dann deren Chunks
    // priorisieren und mit der Ähnlichkeitssuche auffüllen.
    const pageSlug = normalizeSlug(payload.pageUrl)
    const pageChunks = pageSlug ? index.chunks.filter((c) => c.slug === pageSlug) : []
    const usePage = pageChunks.length > 0 && wantsCurrentPage(question)

    let contextChunks = simChunks
    if (usePage) {
      const merged = [...pageChunks]
      for (const c of simChunks) {
        if (merged.length >= MAX_CONTEXT_CHUNKS) break
        if (!merged.includes(c)) merged.push(c)
      }
      contextChunks = merged.slice(0, MAX_CONTEXT_CHUNKS)
    }

    const systemPrompt = buildSystemPrompt(contextChunks, usePage ? pageChunks[0].title : undefined)
    const answer = await generateAnswer(accountId, token, systemPrompt, messages)

    const isMiss = answer.startsWith("Dazu finde ich im Wiki nichts")
    return json({ answer, sources: isMiss ? [] : dedupeSources(contextChunks) })
  } catch (error) {
    console.error(error)
    const detail = error instanceof Error ? error.message : String(error)
    return json({ error: `Serverfehler: ${detail}` }, 500)
  }
}

export const config = {
  path: "/api/chat",
}
