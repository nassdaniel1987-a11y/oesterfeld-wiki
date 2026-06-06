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
      <header class="wiki-chat__head" title="Ziehen zum Verschieben · Doppelklick: zurücksetzen">
        <div><strong>Frag das Wiki</strong><span>Antworten nur aus dem Wiki</span></div>
        <button class="wiki-chat__close" aria-label="Schließen">&times;</button>
      </header>
      <span class="wiki-chat__resize wiki-chat__resize--n" aria-hidden="true"></span>
      <span class="wiki-chat__resize wiki-chat__resize--w" aria-hidden="true"></span>
      <span class="wiki-chat__resize wiki-chat__resize--nw" aria-hidden="true"></span>
      <span class="wiki-chat__resize wiki-chat__resize--ne" aria-hidden="true"></span>
      <span class="wiki-chat__resize wiki-chat__resize--sw" aria-hidden="true"></span>
      <div class="wiki-chat__messages" role="log" aria-live="polite"></div>
      <form class="wiki-chat__form">
        <textarea class="wiki-chat__input" rows="1" placeholder="Frage stellen…" aria-label="Frage"></textarea>
        <button type="submit" class="wiki-chat__send" aria-label="Senden">
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M3 20.5 21 12 3 3.5 3 10l12 2-12 2z"/></svg>
        </button>
      </form>
    </section>`
  document.body.appendChild(root)

  // Quartz nutzt SPA-Navigation (micromorph) und entfernt dabei dieses dynamisch
  // angehängte Overlay. Nach jeder Navigation wieder einhängen.
  const ensureMounted = () => {
    if (!document.body.contains(root)) document.body.appendChild(root)
  }
  document.addEventListener("nav", ensureMounted)

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

  // --- Verschieben & Größe ändern ----------------------------------------
  // Position & Größe sind absolut über right/bottom/width/height. Werte in
  // sessionStorage, damit sie SPA-Navigation überleben.
  const GEOM_KEY = "wikiChatGeometry_v1"
  const MIN_W = 320
  const MIN_H = 360
  const isMobile = () => window.matchMedia("(max-width: 480px)").matches

  const applyGeometry = (g) => {
    if (!g || isMobile()) return
    if (typeof g.right === "number") panel.style.right = g.right + "px"
    if (typeof g.bottom === "number") panel.style.bottom = g.bottom + "px"
    if (typeof g.width === "number") panel.style.width = g.width + "px"
    if (typeof g.height === "number") panel.style.height = g.height + "px"
  }
  const resetGeometry = () => {
    panel.style.right = ""
    panel.style.bottom = ""
    panel.style.width = ""
    panel.style.height = ""
    try {
      sessionStorage.removeItem(GEOM_KEY)
    } catch {}
  }
  const saveGeometry = () => {
    if (isMobile()) return
    try {
      const r = panel.getBoundingClientRect()
      sessionStorage.setItem(
        GEOM_KEY,
        JSON.stringify({
          right: window.innerWidth - r.right,
          bottom: window.innerHeight - r.bottom,
          width: r.width,
          height: r.height,
        }),
      )
    } catch {}
  }
  try {
    applyGeometry(JSON.parse(sessionStorage.getItem(GEOM_KEY) || "null"))
  } catch {}

  // Drag am Header (außer auf dem Schließen-Button)
  const head = root.querySelector(".wiki-chat__head")
  head.addEventListener("pointerdown", (e) => {
    if (isMobile()) return
    if (e.target.closest("button")) return
    const r = panel.getBoundingClientRect()
    const startX = e.clientX
    const startY = e.clientY
    const startRight = window.innerWidth - r.right
    const startBottom = window.innerHeight - r.bottom
    head.setPointerCapture(e.pointerId)
    head.classList.add("wiki-chat__head--dragging")

    const onMove = (ev) => {
      const dx = ev.clientX - startX
      const dy = ev.clientY - startY
      const maxRight = window.innerWidth - r.width - 4
      const maxBottom = window.innerHeight - r.height - 4
      panel.style.right = Math.min(maxRight, Math.max(4, startRight - dx)) + "px"
      panel.style.bottom = Math.min(maxBottom, Math.max(4, startBottom - dy)) + "px"
    }
    const onUp = () => {
      head.classList.remove("wiki-chat__head--dragging")
      head.removeEventListener("pointermove", onMove)
      head.removeEventListener("pointerup", onUp)
      saveGeometry()
    }
    head.addEventListener("pointermove", onMove)
    head.addEventListener("pointerup", onUp)
  })
  head.addEventListener("dblclick", (e) => {
    if (e.target.closest("button")) return
    resetGeometry()
  })

  // Resize-Anfasser an N / W / NW / NE / SW
  const resizeDirs = {
    n: { top: true },
    w: { left: true },
    nw: { top: true, left: true },
    ne: { top: true, right: true },
    sw: { bottom: true, left: true },
  }
  root.querySelectorAll(".wiki-chat__resize").forEach((handle) => {
    const dir = [...handle.classList]
      .find((c) => c.startsWith("wiki-chat__resize--"))
      .split("--")[1]
    const sides = resizeDirs[dir]
    handle.addEventListener("pointerdown", (e) => {
      if (isMobile()) return
      e.preventDefault()
      const r = panel.getBoundingClientRect()
      const startX = e.clientX
      const startY = e.clientY
      const startW = r.width
      const startH = r.height
      const startRight = window.innerWidth - r.right
      const startBottom = window.innerHeight - r.bottom
      handle.setPointerCapture(e.pointerId)

      const onMove = (ev) => {
        const dx = ev.clientX - startX
        const dy = ev.clientY - startY
        if (sides.left) {
          const w = Math.max(MIN_W, Math.min(window.innerWidth - 8, startW - dx))
          panel.style.width = w + "px"
        }
        if (sides.right) {
          const w = Math.max(MIN_W, Math.min(window.innerWidth - startRight - 4, startW + dx))
          panel.style.width = w + "px"
        }
        if (sides.top) {
          const h = Math.max(MIN_H, Math.min(window.innerHeight - 8, startH - dy))
          panel.style.height = h + "px"
        }
        if (sides.bottom) {
          const h = Math.max(MIN_H, Math.min(window.innerHeight - startBottom - 4, startH + dy))
          panel.style.height = h + "px"
        }
      }
      const onUp = () => {
        handle.removeEventListener("pointermove", onMove)
        handle.removeEventListener("pointerup", onUp)
        saveGeometry()
      }
      handle.addEventListener("pointermove", onMove)
      handle.addEventListener("pointerup", onUp)
    })
  })
})()
