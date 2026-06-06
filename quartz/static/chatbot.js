// Schwebendes Chat-Widget "Frag das Wiki".
// Selbst-mountend und idempotent: hängt ein fixiertes Overlay an <body>, das
// die SPA-Navigation von Quartz übersteht (das <head>-Skript läuft nur einmal).
;(() => {
  if (window.__wikiChatMounted) return
  window.__wikiChatMounted = true

  const STORAGE_KEY = "wikiChatHistory_v2"
  const STARTERS = [
    "Wie plane ich ein Angebot?",
    "Was ist forschendes Lernen?",
    "Was sagt der Qualitätsrahmen zu Räumen?",
  ]

  /** @type {{role: "user"|"assistant", content: string, sources?: {title:string,url:string}[]}[]} */
  let history = []
  try {
    history = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "[]")
  } catch {
    history = []
  }

  const saveHistory = () => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(-20)))
    } catch {
      /* sessionStorage evtl. nicht verfügbar */
    }
  }

  const escapeHtml = (s) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

  // Sehr kleiner, sicherer Markdown-Renderer (Eingabe wird zuerst escaped).
  const renderMarkdown = (text) => {
    const inline = (s) =>
      escapeHtml(s)
        .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
        .replace(/\*([^*]+)\*/g, "<em>$1</em>")
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, t, u) =>
          /^(https?:\/\/|\/)/.test(u) ? `<a href="${u}">${t}</a>` : t,
        )

    const blocks = text.split(/\n{2,}/)
    let html = ""
    for (const block of blocks) {
      const lines = block.split("\n")
      const isList = lines.every((l) => /^\s*[-*]\s+/.test(l))
      const isOrdered = lines.every((l) => /^\s*\d+\.\s+/.test(l))
      if (isList) {
        html +=
          "<ul>" +
          lines.map((l) => `<li>${inline(l.replace(/^\s*[-*]\s+/, ""))}</li>`).join("") +
          "</ul>"
      } else if (isOrdered) {
        html +=
          "<ol>" +
          lines.map((l) => `<li>${inline(l.replace(/^\s*\d+\.\s+/, ""))}</li>`).join("") +
          "</ol>"
      } else {
        html += `<p>${lines.map(inline).join("<br>")}</p>`
      }
    }
    return html
  }

  // --- DOM aufbauen -------------------------------------------------------
  const root = document.createElement("div")
  root.className = "wiki-chat"
  root.innerHTML = `
    <button class="wiki-chat__toggle" aria-label="Wiki-Assistent öffnen" aria-expanded="false">
      <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path fill="currentColor" d="M12 3C6.5 3 2 6.6 2 11c0 2.4 1.3 4.6 3.5 6.1-.1 1-.5 2.3-1.4 3.4-.2.2 0 .6.3.5 1.9-.4 3.4-1.2 4.4-1.9 1 .2 2.1.4 3.2.4 5.5 0 10-3.6 10-8s-4.5-8-10-8Z"/></svg>
    </button>
    <section class="wiki-chat__panel" hidden aria-label="Wiki-Assistent">
      <header class="wiki-chat__head">
        <div><strong>Frag das Wiki</strong><span>Antworten nur aus dem Wiki</span></div>
        <button class="wiki-chat__close" aria-label="Schließen">&times;</button>
      </header>
      <div class="wiki-chat__messages" role="log" aria-live="polite"></div>
      <form class="wiki-chat__form">
        <textarea class="wiki-chat__input" rows="1" placeholder="Frage stellen…" aria-label="Frage"></textarea>
        <button type="submit" class="wiki-chat__send" aria-label="Senden">
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M3 20.5 21 12 3 3.5 3 10l12 2-12 2z"/></svg>
        </button>
      </form>
    </section>`
  document.body.appendChild(root)

  const toggle = root.querySelector(".wiki-chat__toggle")
  const panel = root.querySelector(".wiki-chat__panel")
  const closeBtn = root.querySelector(".wiki-chat__close")
  const messagesEl = root.querySelector(".wiki-chat__messages")
  const form = root.querySelector(".wiki-chat__form")
  const input = root.querySelector(".wiki-chat__input")
  const sendBtn = root.querySelector(".wiki-chat__send")

  // --- Rendern ------------------------------------------------------------
  const sourcesHtml = (sources) =>
    sources && sources.length
      ? `<div class="wiki-chat__sources">${sources
          .map((s) => `<a class="wiki-chat__chip" href="${s.url}">${escapeHtml(s.title)}</a>`)
          .join("")}</div>`
      : ""

  const renderMessages = () => {
    const intro = `
      <div class="wiki-chat__intro">
        <p>Hallo! Ich beantworte Fragen <strong>nur auf Basis der Wiki-Inhalte</strong> – immer mit Quellenangabe. Frag nach einem Thema, oder schreib auf einer Seite „fasse das zusammen".</p>
        ${
          history.length === 0
            ? `<div class="wiki-chat__starters">${STARTERS.map(
                (q) => `<button type="button" class="wiki-chat__starter">${escapeHtml(q)}</button>`,
              ).join("")}</div>`
            : ""
        }
      </div>`

    const msgs = history
      .map((m) =>
        m.role === "user"
          ? `<div class="wiki-chat__msg wiki-chat__msg--user">${escapeHtml(m.content)}</div>`
          : `<div class="wiki-chat__msg wiki-chat__msg--bot">${renderMarkdown(m.content)}${sourcesHtml(m.sources)}</div>`,
      )
      .join("")

    messagesEl.innerHTML = intro + msgs
    messagesEl.querySelectorAll(".wiki-chat__starter").forEach((b) =>
      b.addEventListener("click", () => {
        input.value = b.textContent
        send()
      }),
    )
    messagesEl.scrollTop = messagesEl.scrollHeight
  }

  const setLoading = (loading) => {
    sendBtn.disabled = loading
    if (loading) {
      const el = document.createElement("div")
      el.className = "wiki-chat__msg wiki-chat__msg--bot wiki-chat__typing"
      el.innerHTML = "<span></span><span></span><span></span>"
      messagesEl.appendChild(el)
      messagesEl.scrollTop = messagesEl.scrollHeight
    } else {
      messagesEl.querySelector(".wiki-chat__typing")?.remove()
    }
  }

  // --- Senden -------------------------------------------------------------
  let busy = false
  const send = async () => {
    const text = input.value.trim()
    if (!text || busy) return
    busy = true
    input.value = ""
    input.style.height = "auto"
    history.push({ role: "user", content: text })
    renderMessages()
    saveHistory()
    setLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.map((m) => ({ role: m.role, content: m.content })),
          pageUrl: location.pathname,
        }),
      })
      const data = await res.json().catch(() => ({}))
      setLoading(false)
      if (!res.ok) throw new Error(data.error || "Fehler")
      history.push({ role: "assistant", content: data.answer || "", sources: data.sources || [] })
    } catch (err) {
      setLoading(false)
      history.push({
        role: "assistant",
        content:
          "⚠️ " + (err.message || "Das hat leider nicht geklappt. Bitte versuche es erneut."),
      })
    } finally {
      busy = false
      renderMessages()
      saveHistory()
    }
  }

  // --- Events -------------------------------------------------------------
  const openPanel = () => {
    panel.hidden = false
    toggle.setAttribute("aria-expanded", "true")
    root.classList.add("wiki-chat--open")
    input.focus()
    renderMessages()
  }
  const closePanel = () => {
    panel.hidden = true
    toggle.setAttribute("aria-expanded", "false")
    root.classList.remove("wiki-chat--open")
  }

  toggle.addEventListener("click", () => (panel.hidden ? openPanel() : closePanel()))
  closeBtn.addEventListener("click", closePanel)
  form.addEventListener("submit", (e) => {
    e.preventDefault()
    send()
  })
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  })
  input.addEventListener("input", () => {
    input.style.height = "auto"
    input.style.height = Math.min(input.scrollHeight, 120) + "px"
  })
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !panel.hidden) closePanel()
  })
})()
