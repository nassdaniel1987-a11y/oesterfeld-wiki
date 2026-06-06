// Erzeugt den Embedding-Index für den Wiki-Chatbot.
//
// Liest die von Quartz erzeugte public/static/contentIndex.json (bereits
// HTML-bereinigt und um Drafts/Private gefiltert), zerlegt jede Seite in
// Chunks, holt für jeden Chunk ein Gemini-Embedding und schreibt das Ergebnis
// nach quartz/static/wiki-chat-index.json.
//
// WICHTIG: Der erzeugte Index wird ins Repo committet. Existiert er bereits,
// überspringt dieser Schritt das (kontingentierte) Einbetten komplett – Deploys
// rufen dann nie die Embedding-API auf. Neu erzeugen: Datei löschen oder mit
// FORCE_CHAT_INDEX=1 starten. Lokal aufrufbar via `npm run build-chat-index`.

import { readFile, writeFile } from "node:fs/promises"
import { existsSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, "..")
const CONTENT_INDEX = join(ROOT, "public", "static", "contentIndex.json")
// In quartz/static, damit die Datei ins Repo committet und vom Static-Emitter
// nach public/static/ ausgeliefert wird.
const OUTPUT = join(ROOT, "quartz", "static", "wiki-chat-index.json")

const EMBEDDING_MODEL = "gemini-embedding-001"
const EMBED_DIM = 768
const EMBEDDING_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${EMBEDDING_MODEL}:batchEmbedContents`

// Größere Chunks (~seitenweise) halten die Gesamtzahl der Embeddings klein,
// damit eine einmalige Generierung unter den Gratis-Limits bleibt.
const MAX_CHUNK_CHARS = 5000
const CHUNK_OVERLAP_CHARS = 300
const MIN_PAGE_CHARS = 120
// Jeder Inhalt zählt einzeln gegen das Pro-Minute-Limit (100). Kleine Batches +
// Drosselung halten uns darunter.
const BATCH_SIZE = 40
const REQUESTS_PER_MINUTE = 90
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const API_KEY = process.env.GEMINI_API_KEY

const isExcludedSlug = (slug) =>
  slug.startsWith("tags/") || slug === "index" || slug.endsWith("/index")

// Normalisiert Whitespace; behält Absatzgrenzen als doppelte Zeilenumbrüche.
const cleanText = (text) =>
  text
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]*\n[ \t]*/g, "\n")
    .trim()

// Erster sinnvoller Absatz als Anzeige-Titel (H1 der Seite), Fallback: Dateiname.
const deriveTitle = (content, fallback) => {
  const firstLine = content
    .split("\n")
    .map((l) => l.trim())
    .find((l) => l.length > 0)
  if (firstLine && firstLine.length <= 120) return firstLine
  return fallback.replace(/_/g, " ")
}

// Zerlegt Text in überlappende Chunks an Absatzgrenzen, ohne MAX_CHUNK_CHARS
// stark zu überschreiten.
const chunkText = (text) => {
  const paragraphs = text
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean)
  const chunks = []
  let current = ""

  const flush = () => {
    const trimmed = current.trim()
    if (trimmed) chunks.push(trimmed)
    current = ""
  }

  for (const para of paragraphs) {
    if (para.length > MAX_CHUNK_CHARS) {
      // Sehr langer Absatz: hart in Stücke schneiden.
      flush()
      for (let i = 0; i < para.length; i += MAX_CHUNK_CHARS - CHUNK_OVERLAP_CHARS) {
        chunks.push(para.slice(i, i + MAX_CHUNK_CHARS))
      }
      continue
    }
    if (current.length + para.length + 2 > MAX_CHUNK_CHARS) {
      flush()
    }
    current = current ? `${current}\n\n${para}` : para
  }
  flush()
  return chunks
}

const buildChunks = (contentIndex) => {
  const chunks = []
  for (const [slug, entry] of Object.entries(contentIndex)) {
    if (isExcludedSlug(slug)) continue
    const content = cleanText(entry.content ?? "")
    if (content.length < MIN_PAGE_CHARS) continue

    const title = deriveTitle(content, entry.title ?? slug)
    const url = `/${slug}`
    for (const text of chunkText(content)) {
      // Titel als Kontext voranstellen, damit das Embedding die Seite "kennt".
      chunks.push({ text, embedText: `${title}\n\n${text}`, title, url, slug })
    }
  }
  return chunks
}

const embedBatch = async (texts, attempt = 0) => {
  const body = {
    requests: texts.map((text) => ({
      model: `models/${EMBEDDING_MODEL}`,
      content: { parts: [{ text }] },
      taskType: "RETRIEVAL_DOCUMENT",
      outputDimensionality: EMBED_DIM,
    })),
  }
  const res = await fetch(`${EMBEDDING_ENDPOINT}?key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })

  if (res.status === 429 && attempt < 8) {
    const detail = await res.text()
    const match = detail.match(/retry in ([\d.]+)s/i) || detail.match(/"retryDelay":\s*"(\d+)s"/i)
    const waitSec = Math.ceil(parseFloat(match?.[1] ?? "60")) + 2
    console.log(`[chat-index] Rate-Limit (429) – warte ${waitSec}s und versuche erneut …`)
    await sleep(waitSec * 1000)
    return embedBatch(texts, attempt + 1)
  }
  if (!res.ok) {
    throw new Error(`Embedding-Request fehlgeschlagen: ${res.status} ${await res.text()}`)
  }
  const data = await res.json()
  return data.embeddings.map((e) => e.values)
}

const main = async () => {
  if (existsSync(OUTPUT) && !process.env.FORCE_CHAT_INDEX) {
    console.log(`[chat-index] Index bereits vorhanden (${OUTPUT}) – überspringe Embedding.`)
    return
  }
  if (!API_KEY) {
    console.warn(
      "[chat-index] WARN: GEMINI_API_KEY fehlt – Index wird nicht erzeugt, Build läuft weiter.",
    )
    return
  }
  const contentIndex = JSON.parse(await readFile(CONTENT_INDEX, "utf8"))
  const chunks = buildChunks(contentIndex)
  console.log(
    `[chat-index] ${chunks.length} Chunks aus ${Object.keys(contentIndex).length} Index-Einträgen`,
  )

  const records = []
  let windowStart = Date.now()
  let sentInWindow = 0
  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE)

    // Pro-Minute-Limit proaktiv einhalten (jeder Chunk = eine Anfrage).
    if (sentInWindow + batch.length > REQUESTS_PER_MINUTE) {
      const wait = Math.max(0, 60000 - (Date.now() - windowStart))
      if (wait > 0) {
        console.log(`[chat-index] Drossel: warte ${Math.ceil(wait / 1000)}s (Pro-Minute-Limit) …`)
        await sleep(wait)
      }
      windowStart = Date.now()
      sentInWindow = 0
    }

    const embeddings = await embedBatch(batch.map((c) => c.embedText))
    sentInWindow += batch.length
    batch.forEach((c, j) => {
      records.push({
        text: c.text,
        title: c.title,
        url: c.url,
        slug: c.slug,
        embedding: embeddings[j],
      })
    })
    console.log(
      `[chat-index] eingebettet: ${Math.min(i + BATCH_SIZE, chunks.length)}/${chunks.length}`,
    )
  }

  const output = {
    model: EMBEDDING_MODEL,
    generatedAt: new Date().toISOString(),
    chunks: records,
  }
  await writeFile(OUTPUT, JSON.stringify(output))
  console.log(`[chat-index] geschrieben: ${OUTPUT} (${records.length} Chunks)`)
}

main().catch((err) => {
  // Den Deploy nicht abbrechen – ohne Index funktioniert nur der Chat (noch) nicht.
  console.warn(
    "[chat-index] WARN: Index konnte nicht erzeugt werden, Build läuft weiter:",
    err?.message ?? err,
  )
  process.exit(0)
})
