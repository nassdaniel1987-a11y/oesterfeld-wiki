// RAG-Chat-Endpoint für das GTS Wiki.
//
// Lädt den beim Build erzeugten Embedding-Index, sucht zur Nutzerfrage die
// relevantesten Wiki-Auszüge (Cosine-Similarity) und lässt Gemini Flash
// AUSSCHLIESSLICH auf deren Basis antworten. Die LLM-Anbindung ist hier
// gekapselt – ein späterer Wechsel des Anbieters betrifft nur diese Datei.

const GENERATION_MODEL = "gemini-2.0-flash"
const EMBEDDING_MODEL = "gemini-embedding-001"
const EMBED_DIM = 768
const GEN_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GENERATION_MODEL}:generateContent`
const EMBED_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${EMBEDDING_MODEL}:embedContent`

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

const embedQuestion = async (apiKey: string, question: string): Promise<number[]> => {
  const res = await fetch(`${EMBED_ENDPOINT}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: `models/${EMBEDDING_MODEL}`,
      content: { parts: [{ text: question }] },
      taskType: "RETRIEVAL_QUERY",
      outputDimensionality: EMBED_DIM,
    }),
  })
  if (!res.ok) {
    throw new Error(`Embedding fehlgeschlagen: ${res.status} ${await res.text()}`)
  }
  const data = await res.json()
  return data.embedding.values as number[]
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

const callGemini = async (apiKey: string, systemPrompt: string, history: ChatMessage[]) => {
  const contents = history.slice(-MAX_HISTORY_FOR_PROMPT).map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }))

  const res = await fetch(`${GEN_ENDPOINT}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents,
      generationConfig: { temperature: 0.2, maxOutputTokens: 1024 },
    }),
  })
  if (!res.ok) {
    throw new Error(`Gemini-Antwort fehlgeschlagen: ${res.status} ${await res.text()}`)
  }
  const data = await res.json()
  const text = data.candidates?.[0]?.content?.parts
    ?.map((p: { text?: string }) => p.text ?? "")
    .join("")
  return (text ?? "").trim()
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

  const apiKey = getEnv("GEMINI_API_KEY")
  if (!apiKey) {
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
    const queryEmbedding = await embedQuestion(apiKey, question)
    const simChunks = retrieve(index, queryEmbedding)

    // Bezieht sich die Frage auf die gerade geöffnete Seite? Dann deren Chunks
    // priorisieren und mit der Ähnlichkeitssuche auffüllen (robust gegen
    // Fehlinterpretation, falls doch ein Thema genannt wurde).
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
    const answer = await callGemini(apiKey, systemPrompt, messages)

    const isMiss = answer.startsWith("Dazu finde ich im Wiki nichts")
    return json({ answer, sources: isMiss ? [] : dedupeSources(contextChunks) })
  } catch (error) {
    console.error(error)
    return json({ error: "Es ist ein Fehler aufgetreten. Bitte versuche es erneut." }, 500)
  }
}

export const config = {
  path: "/api/chat",
}
