import fs from "node:fs"
import path from "node:path"

const outDir = path.resolve("content/07_Vorlagen_und_Praxis/downloads")
fs.mkdirSync(outDir, { recursive: true })

const templates = [
  {
    file: "Vorlage_Angebotsplanung",
    title: "Vorlage: Angebotsplanung im Ganztag",
    subtitle: "Planung, Durchführung und Reflexion eines pädagogischen Angebots",
    sections: [
      ["Grunddaten", ["Angebot: ______________________________", "Datum / Zeitraum: ______________________________", "Verantwortlich: ______________________________", "Beteiligte Kinder / Gruppe: ______________________________", "Ort: ______________________________"]],
      ["Anlass und Ziel", ["Beobachtung / Interesse der Kinder:", "____________________________________________________________", "Kinderfrage / Forschungsfrage:", "____________________________________________________________", "Pädagogisches Ziel:", "____________________________________________________________", "Bezug zu Wiki-Seiten: Projektarbeit, Forschendes Lernen, Forschendes Lernen im Ganztag, Partizipation, Angebotsstruktur"]],
      ["Ablauf", ["Einstieg: _________________________________________________", "Durchführung: _____________________________________________", "Abschluss: ________________________________________________", "Material: _________________________________________________", "Zuständigkeiten: __________________________________________"]],
      ["Beteiligung der Kinder", ["[ ] Kinder konnten Thema oder Fragestellung mitbestimmen.", "[ ] Kinder konnten Material, Vorgehen oder Rollen mitbestimmen.", "[ ] Ergebnisse werden sichtbar gemacht.", "[ ] Bei Forschungsangeboten: Vermutungen, Beobachtungen und offene Fragen der Kinder wurden dokumentiert."]],
      ["Reflexion", ["Was hat gut funktioniert?", "____________________________________________________________", "Wo brauchten Kinder Unterstützung?", "____________________________________________________________", "Welche Kinderfrage oder welches Thema sollte weiterverfolgt werden?", "____________________________________________________________", "Was verändern wir beim nächsten Mal?", "____________________________________________________________"]],
    ],
  },
  {
    file: "Vorlage_Elterngespraech",
    title: "Vorlage: Elterngespräch",
    subtitle: "Wertschätzende Gesprächsvorbereitung, Vereinbarung und Nachbereitung",
    sections: [
      ["Grunddaten", ["Datum: ______________________________", "Kind: ______________________________", "Teilnehmende: ______________________________", "Anlass: Entwicklung / Lernzeit / Verhalten / Übergang / Sonstiges"]],
      ["Vorbereitung", ["Beobachtungen aus dem Alltag:", "____________________________________________________________", "Rückmeldungen aus dem Team:", "____________________________________________________________", "Stärken des Kindes:", "____________________________________________________________", "Klärungsbedarf:", "____________________________________________________________"]],
      ["Gesprächsverlauf", ["1. Wertschätzender Einstieg: ______________________________", "2. Beobachtungen der Einrichtung / Schule: ________________", "3. Perspektive der Eltern: ________________________________", "4. Gemeinsames Ziel: ______________________________________", "5. Vereinbarung: __________________________________________"]],
      ["Vereinbarungen", ["Nächste Schritte: _________________________________________", "Wer macht was bis wann? __________________________________", "Nächster Kontakt / Termin: _______________________________"]],
      ["Nachbereitung", ["[ ] Relevante Informationen im Team geteilt.", "[ ] Vereinbarungen dokumentiert.", "[ ] Bezug zu Elternarbeit oder Übergängen geprüft."]],
    ],
  },
  {
    file: "Vorlage_Team_Fallbesprechung",
    title: "Vorlage: Team-Fallbesprechung",
    subtitle: "Struktur für Anliegenklärung, Beobachtung und Handlungsschritte",
    sections: [
      ["Grunddaten", ["Datum: ______________________________", "Fall / Thema: ______________________________", "Moderation: ______________________________", "Teilnehmende: ______________________________"]],
      ["1. Anliegen klären", ["Konkrete Fragestellung:", "____________________________________________________________", "Was soll am Ende klarer oder entschieden sein?", "____________________________________________________________"]],
      ["2. Beobachtungen sammeln", ["Was wurde konkret beobachtet?", "____________________________________________________________", "In welchen Situationen tritt das Thema auf?", "____________________________________________________________", "Welche Ressourcen und Stärken sind sichtbar?", "____________________________________________________________"]],
      ["3. Pädagogisch einordnen", ["Mögliche Bezüge: Emotion & Motivation, Soziale Entwicklung, Resilienzförderung, Kinderschutz, Kooperation & Personal"]],
      ["4. Handlungsschritte vereinbaren", ["Nächster kleiner Schritt: _________________________________", "Verantwortlich: ___________________________________________", "Zeitraum: _________________________________________________", "Woran erkennen wir Wirkung? ______________________________"]],
      ["5. Reflexionstermin", ["Termin zur Überprüfung: __________________________________", "Dokumentation im Werkstattordner nötig? Ja / Nein"]],
    ],
  },
  {
    file: "Vorlage_Kinderkonferenz",
    title: "Vorlage: Kinderkonferenz-Protokoll",
    subtitle: "Beteiligung sichtbar machen und Beschlüsse nachverfolgen",
    sections: [
      ["Grunddaten", ["Datum: ______________________________", "Uhrzeit: ______________________________", "Ort: ______________________________", "Moderation: ______________________________", "Protokoll: ______________________________", "Anwesende Kinder: ______________________________"]],
      ["1. Rückblick", ["Welche Beschlüsse der letzten Konferenz wurden umgesetzt?", "____________________________________________________________", "Was hat funktioniert? _____________________________________"]],
      ["2. Anliegen der Kinder", ["Thema A: _________________________________________________", "Problem / Idee: ___________________________________________", "Vorschläge der Kinder: ___________________________________", "Beschluss / Abstimmung: _________________________________", "Wer kümmert sich darum? _________________________________"]],
      ["3. Informationen der Erwachsenen", ["Info 1: ___________________________________________________", "Info 2: ___________________________________________________"]],
      ["4. Abschluss", ["Nächste Kinderkonferenz am: ______________________________", "Abschluss-Ritual: _________________________________________"]],
    ],
  },
  {
    file: "Raster_Werkstattordner",
    title: "Raster: Der Stuttgarter Werkstattordner",
    subtitle: "PDCA-Raster für Qualitätsentwicklung im Alltag",
    sections: [
      ["Rahmendaten", ["Pädagogisches Thema: ______________________________", "Datum des Starts: ______________________________", "Verantwortliche Fachkräfte: ______________________________", "Bezug zum Orientierungsplan / Wiki: ______________________"]],
      ["P - Plan", ["Beobachtung / Ist-Zustand:", "____________________________________________________________", "Unsere Hypothese:", "____________________________________________________________", "Unser Ziel:", "____________________________________________________________", "Was brauchen wir dafür?", "____________________________________________________________"]],
      ["D - Do", ["Datum der Umsetzung: ______________________________", "Erste Schritte:", "____________________________________________________________", "Kommunikation an Kinder / Team / Eltern:", "____________________________________________________________"]],
      ["C - Check", ["Datum der Reflexion: ______________________________", "Erkenntnisse:", "____________________________________________________________", "Stimmen der Kinder:", "____________________________________________________________", "Probleme / Hindernisse:", "____________________________________________________________"]],
      ["A - Act", ["[ ] Standardisieren", "[ ] Anpassen und neuen Zyklus starten", "[ ] Verwerfen", "Neue feste Regelung:", "____________________________________________________________"]],
    ],
  },
  {
    file: "Checkliste_Raumgestaltung",
    title: "Checkliste: Raumgestaltung",
    subtitle: "Der Raum als dritter Erzieher",
    sections: [
      ["1. Aufforderungscharakter & Material", ["[ ] Materialien sind auf Augenhöhe der Kinder erreichbar.", "[ ] Material ist übersichtlich sortiert und beschriftet.", "[ ] Es gibt echtes Alltags- und Naturmaterial.", "[ ] Es ist sofort erkennbar, was man in diesem Raum tun kann."]],
      ["2. Struktur & Orientierung", ["[ ] Es gibt klare Zonen für Spiel, Ruhe, Bewegung oder Arbeit.", "[ ] Laufwege stören Spiel- und Arbeitszonen möglichst wenig.", "[ ] Es gibt einen Rückzugsort, der wirklich geschützt ist."]],
      ["3. Ästhetik & Wertschätzung", ["[ ] Wände und Dekoration wirken ruhig und nicht überladen.", "[ ] Werke der Kinder werden wertschätzend präsentiert.", "[ ] Licht, Pflanzen und Materialien schaffen eine angenehme Atmosphäre."]],
      ["4. Flexibilität", ["[ ] Kinder können Möbel oder Material selbstständig nutzen.", "[ ] Der Raum kann an aktuelle Interessen angepasst werden.", "[ ] Beobachtungen aus dem Alltag führen zu konkreten Raumveränderungen."]],
      ["Reflexion", ["Welche Veränderung probieren wir als nächstes aus?", "____________________________________________________________", "Wann prüfen wir die Wirkung?", "____________________________________________________________"]],
    ],
  },
]

function escapeXml(s) {
  return s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
}

function docxParagraph(text, style = "") {
  const pStyle = style ? `<w:pPr><w:pStyle w:val="${style}"/></w:pPr>` : ""
  return `<w:p>${pStyle}<w:r><w:t xml:space="preserve">${escapeXml(text)}</w:t></w:r></w:p>`
}

function makeDocumentXml(template) {
  const body = [
    docxParagraph(template.title, "Title"),
    docxParagraph(template.subtitle, "Subtitle"),
    ...template.sections.flatMap(([heading, lines]) => [
      docxParagraph(heading, "Heading1"),
      ...lines.map((line) => docxParagraph(line)),
    ]),
  ].join("")

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>${body}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134"/></w:sectPr></w:body>
</w:document>`
}

const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:rPr><w:rFonts w:ascii="Aptos" w:hAnsi="Aptos"/><w:sz w:val="22"/></w:rPr><w:pPr><w:spacing w:after="120"/></w:pPr></w:style>
  <w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:rPr><w:b/><w:sz w:val="36"/></w:rPr><w:pPr><w:spacing w:after="180"/></w:pPr></w:style>
  <w:style w:type="paragraph" w:styleId="Subtitle"><w:name w:val="Subtitle"/><w:rPr><w:i/><w:color w:val="666666"/><w:sz w:val="24"/></w:rPr><w:pPr><w:spacing w:after="260"/></w:pPr></w:style>
  <w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:rPr><w:b/><w:color w:val="7A5A00"/><w:sz w:val="26"/></w:rPr><w:pPr><w:spacing w:before="220" w:after="100"/></w:pPr></w:style>
</w:styles>`

function crc32(buf) {
  let c = ~0
  for (const b of buf) {
    c ^= b
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1))
  }
  return ~c >>> 0
}

function dosDateTime(date = new Date()) {
  const time = (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2)
  const dosDate = ((date.getFullYear() - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate()
  return { time, date: dosDate }
}

function zipStore(files) {
  const locals = []
  const centrals = []
  let offset = 0
  const dt = dosDateTime()
  for (const [name, text] of files) {
    const nameBuf = Buffer.from(name)
    const data = Buffer.from(text)
    const crc = crc32(data)
    const local = Buffer.alloc(30)
    local.writeUInt32LE(0x04034b50, 0)
    local.writeUInt16LE(20, 4)
    local.writeUInt16LE(0x0800, 6)
    local.writeUInt16LE(0, 8)
    local.writeUInt16LE(dt.time, 10)
    local.writeUInt16LE(dt.date, 12)
    local.writeUInt32LE(crc, 14)
    local.writeUInt32LE(data.length, 18)
    local.writeUInt32LE(data.length, 22)
    local.writeUInt16LE(nameBuf.length, 26)
    locals.push(local, nameBuf, data)

    const central = Buffer.alloc(46)
    central.writeUInt32LE(0x02014b50, 0)
    central.writeUInt16LE(20, 4)
    central.writeUInt16LE(20, 6)
    central.writeUInt16LE(0x0800, 8)
    central.writeUInt16LE(0, 10)
    central.writeUInt16LE(dt.time, 12)
    central.writeUInt16LE(dt.date, 14)
    central.writeUInt32LE(crc, 16)
    central.writeUInt32LE(data.length, 20)
    central.writeUInt32LE(data.length, 24)
    central.writeUInt16LE(nameBuf.length, 28)
    central.writeUInt32LE(offset, 42)
    centrals.push(central, nameBuf)
    offset += local.length + nameBuf.length + data.length
  }
  const centralSize = centrals.reduce((sum, b) => sum + b.length, 0)
  const end = Buffer.alloc(22)
  end.writeUInt32LE(0x06054b50, 0)
  end.writeUInt16LE(files.length, 8)
  end.writeUInt16LE(files.length, 10)
  end.writeUInt32LE(centralSize, 12)
  end.writeUInt32LE(offset, 16)
  return Buffer.concat([...locals, ...centrals, end])
}

function makeDocx(template) {
  return zipStore([
    ["[Content_Types].xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/></Types>`],
    ["_rels/.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`],
    ["word/_rels/document.xml.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`],
    ["word/styles.xml", stylesXml],
    ["word/document.xml", makeDocumentXml(template)],
  ])
}

function pdfEscape(s) {
  return s.replace(/[\\()]/g, "\\$&").replace(/[–—]/g, "-")
}

function wrapText(text, max = 92) {
  const words = text.split(/\s+/)
  const lines = []
  let line = ""
  for (const word of words) {
    if ((line + " " + word).trim().length > max) {
      if (line) lines.push(line)
      line = word
    } else {
      line = (line + " " + word).trim()
    }
  }
  if (line) lines.push(line)
  return lines
}

function makePdf(template) {
  const pages = []
  let ops = []
  let y = 800
  const newPage = () => {
    if (ops.length) pages.push(ops.join("\n"))
    ops = []
    y = 800
  }
  const text = (line, size = 11, bold = false) => {
    if (y < 60) newPage()
    ops.push(`BT /${bold ? "F2" : "F1"} ${size} Tf 50 ${y} Td (${pdfEscape(line)}) Tj ET`)
    y -= size + 7
  }
  text(template.title, 18, true)
  text(template.subtitle, 12)
  y -= 10
  for (const [heading, lines] of template.sections) {
    y -= 4
    text(heading, 13, true)
    for (const line of lines) {
      for (const wrapped of wrapText(line)) text(wrapped, 10)
      if (line.includes("____")) y -= 2
    }
  }
  newPage()

  const objects = []
  const add = (s) => objects.push(s)
  add("<< /Type /Catalog /Pages 2 0 R >>")
  add(`<< /Type /Pages /Kids [${pages.map((_, i) => `${3 + i * 2} 0 R`).join(" ")}] /Count ${pages.length} >>`)
  pages.forEach((content, i) => {
    const pageObj = 3 + i * 2
    const contentObj = pageObj + 1
    add(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 ${3 + pages.length * 2} 0 R /F2 ${4 + pages.length * 2} 0 R >> >> /Contents ${contentObj} 0 R >>`)
    const stream = Buffer.from(content, "latin1")
    add(`<< /Length ${stream.length} >>\nstream\n${content}\nendstream`)
  })
  add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>")
  add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>")

  const chunks = [Buffer.from("%PDF-1.4\n", "latin1")]
  const offsets = [0]
  objects.forEach((obj, i) => {
    offsets.push(chunks.reduce((sum, b) => sum + b.length, 0))
    chunks.push(Buffer.from(`${i + 1} 0 obj\n${obj}\nendobj\n`, "latin1"))
  })
  const xref = chunks.reduce((sum, b) => sum + b.length, 0)
  let table = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
  for (let i = 1; i < offsets.length; i++) table += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`
  table += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`
  chunks.push(Buffer.from(table, "latin1"))
  return Buffer.concat(chunks)
}

for (const template of templates) {
  fs.writeFileSync(path.join(outDir, `${template.file}.docx`), makeDocx(template))
  fs.writeFileSync(path.join(outDir, `${template.file}.pdf`), makePdf(template))
}

console.log(`Generated ${templates.length * 2} files in ${outDir}`)
