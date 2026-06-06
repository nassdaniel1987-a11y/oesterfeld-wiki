// Erzeugt den Embedding-Index für den Wiki-Chatbot mit Cloudflare Workers AI.
//
// Liest die von Quartz erzeugte public/static/contentIndex.json (bereits
// HTML-bereinigt und um Drafts/Private gefiltert), zerlegt jede Seite in Chunks,
// holt Embeddings (@cf/baai/bge-m3) und schreibt public/static/wiki-chat-index.json.
//
// Läuft im Netlify-Build NACH `quartz build`. Benötigt CF_ACCOUNT_ID und
// CF_API_TOKEN. Cloudflares Gratis-Kontingent ist großzügig genug, um bei jedem
// Deploy neu einzubetten – kein Vorbauen/Committen nötig. Fehler brechen den
// Deploy nicht ab (dann antwortet nur der Chat nicht).

import { readFile, writeFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, "..")
const CONTENT_INDEX = join(ROOT, "public", "static", "contentIndex.json")
const OUTPUT = join(ROOT, "public", "static", "wiki-chat-index.json")

const EMBEDDING_MODEL = "@cf/baai/bge-m3"
const ACCOUNT_ID = process.env.CF_ACCOUNT_ID
const API_TOKEN = process.env.CF_API_TOKEN

const MAX_CHUNK_CHARS = 1800
const CHUNK_OVERLAP_CHARS = 200
const MIN_PAGE_CHARS = 120
const BATCH_SIZE = 50
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const isExcludedSlug = (slug) =>
  slug.startsWith("tags/") || slug === "index" || slug.endsWith("/index")

const cleanText = (text) =>
  text
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]*\n[ \t]*/g, "\n")
    .trim()

const deriveTitle = (content, fallback) => {
  const firstLine = content
    .split("\n")
    .map((l) => l.trim())
    .find((l) => l.length > 0)
  if (firstLine && firstLine.length <= 120) return firstLine
  return fallback.replace(/_/g, " ")
}

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
      chunks.push({ text, embedText: `${title}\n\n${text}`, title, url, slug })
    }
  }
  return chunks
}

const embedBatch = async (texts, attempt = 0) => {
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/${EMBEDDING_MODEL}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: texts }),
    },
  )

  if (!res.ok) {
    if (res.status === 429 && attempt < 5) {
      console.log("[chat-index] Cloudflare 429 – warte 15s und versuche erneut …")
      await sleep(15000)
      return embedBatch(texts, attempt + 1)
    }
    throw new Error(`Embedding-Request fehlgeschlagen: ${res.status} ${await res.text()}`)
  }

  const json = await res.json()
  const vectors = json?.result?.data
  if (!Array.isArray(vectors)) {
    throw new Error(`Unerwartete Embedding-Antwort: ${JSON.stringify(json).slice(0, 300)}`)
  }
  return vectors
}

const main = async () => {
  if (!ACCOUNT_ID || !API_TOKEN) {
    console.warn(
      "[chat-index] WARN: CF_ACCOUNT_ID/CF_API_TOKEN fehlen – Index wird nicht erzeugt, Build läuft weiter.",
    )
    return
  }

  const contentIndex = JSON.parse(await readFile(CONTENT_INDEX, "utf8"))
  const chunks = buildChunks(contentIndex)
  console.log(
    `[chat-index] ${chunks.length} Chunks aus ${Object.keys(contentIndex).length} Index-Einträgen`,
  )

  const records = []
  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE)
    const embeddings = await embedBatch(batch.map((c) => c.embedText))
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
  console.warn(
    "[chat-index] WARN: Index konnte nicht erzeugt werden, Build läuft weiter:",
    err?.message ?? err,
  )
  process.exit(0)
})
