---
draft: true
title: Wiki Log
---
# Wiki Log

Dies ist das chronologische, reine Append-Only-Protokoll aller Aktionen, Ingest-Vorgänge und Aktualisierungen im Wiki.

## [2026-05-06] Initialisierung
- Ordnerstruktur (`/raw`, `/wiki`, `/meta`) im korrekten Workspace definiert.
- Steuerungsdateien (`Claude.md`, `index.md`, `log.md`) angelegt.
- LLM-Agent hat das Setup abgeschlossen und wartet auf erste Quellen.

## [2026-05-06] Ingest | Orientierungsplan für Bildung und Erziehung (BaWü)
- **Quelle:** `raw/2025-07-14-Orientierungsplan_für_Bildung_und_Erziehung_in_baden-württembergischen_Kin-dertageseinrichtungen_und_Kindertagespflege.pdf`
- **Aktionen:** 
  - Fundamentale Übersichtseite [Orientierungsplan Baden-Württemberg](file:///c:/Users/Nassd/OneDrive/Desktop/Öesterfeld/Österfeld/wiki/Orientierungsplan_BaWue.md) in `/wiki` erstellt.
  - Zentrale Säulen (Leitprinzipien, Bildungsfelder, PDCA-Qualitätskreislauf) extrahiert.
  - Index aktualisiert.

## [2026-05-06] Ingest | Detaillierung Orientierungsplan
- **Aktionen:** 
  - 4 separate Leitprinzip-Seiten in `/wiki` erstellt.
  - 8 separate Bildungsfelder-Seiten in `/wiki` erstellt.
  - 2 separate Struktur-Seiten (Übergänge, Qualität) in `/wiki` erstellt.
  - Zentrale Seite [Orientierungsplan Baden-Württemberg](file:///c:/Users/Nassd/OneDrive/Desktop/Öesterfeld/Österfeld/wiki/Orientierungsplan_BaWue.md) mit Querverweisen aktualisiert.
  - Kompletten [Wiki Index](file:///c:/Users/Nassd/OneDrive/Desktop/Öesterfeld/Österfeld/meta/index.md) mit 15 Einträgen generiert.

## [2026-05-06] Ingest & Refactoring | Clippings & Quervernetzung
- **Quelle:** 4 Markdown-Dateien im Ordner `Clippings/`
- **Aktionen:** 
  - 3 neue Konzeptseiten erstellt (`Konzept_Scaffolding.md`, `Konzept_Mikrotransitionen.md`, `Konzept_Dialogisches_Lesen.md`).
  - Alle 8 Bildungsfelder überarbeitet: Detailtiefe aus dem Orientierungsplan erhöht und Obsidian-Wikilinks (`[[...]]`) für den Graph View eingefügt.
  - Index und Log aktualisiert.

## [2026-05-06] Ingest | Qualitätsrahmen Ganztagsschule BW
- **Quelle:** `raw/190708_Qualitätsrahmen-Ganztagsschule_Kultusministerium_BW.pdf`
- **Aktionen:** 
  - Neue Seite [Qualitätsrahmen Ganztagsschule](file:///c:/Users/Nassd/OneDrive/Desktop/Öesterfeld/Österfeld/wiki/Konzept_Qualitaetsrahmen_GTS.md) erstellt.
  - Seite [Qualitätsentwicklung](file:///c:/Users/Nassd/OneDrive/Desktop/Öesterfeld/Österfeld/wiki/Qualitaetsentwicklung.md) um GTS-spezifischen PDCA-Zyklus ergänzt.
  - Den Rahmen in 8 modulare, tiefgehende GTS-Seiten (z.B. Zeit, Raum, Demokratie) aufgelöst.
  - Index aktualisiert.

## [2026-05-06] Ingest | Stuttgarter Konzepte (Einstein 2.0 & Rahmenkonzept)
- **Quelle:** `raw/2026 Trägerprofil.pdf` und `raw/rahmenkonzept-ausbau-grundschulen-zu-ganztagsschulen-2013-3.pdf`
- **Aktionen:** 
  - Neue Seite [Trägerprofil Einstein 2.0](file:///c:/Users/Nassd/OneDrive/Desktop/Öesterfeld/Österfeld/wiki/Konzept_Einstein_2_0.md) erstellt (7 Schwerpunkte).
  - Neue Seite [Struktur Ganztag Stuttgart](file:///c:/Users/Nassd/OneDrive/Desktop/Öesterfeld/Österfeld/wiki/Struktur_Ganztag_Stuttgart.md) erstellt (Rhythmisierung, Angebotsbausteine).
  - *Einweben:* Stuttgarter Vorgaben direkt in die jeweiligen Detailseiten (`LP_Inklusion`, `LP_Partizipation`, `GTS_Zeit`, `GTS_Kompetenzentwicklung`, `GTS_Elternarbeit`) injiziert.
  - Index aktualisiert.

## [2026-05-06] Ingest | Leitfaden Konzeptionsentwicklung
- **Quelle:** `raw/Leitfaden zur Konzeptionsentwicklung_2026.docx.pdf`
- **Aktionen:**
  - Neue Seite [Leitfaden Struktur](file:///c:/Users/Nassd/OneDrive/Desktop/Öesterfeld/Österfeld/wiki/Struktur_Einrichtungskonzeption.md) angelegt.
  - Den "Werkstattordner" als Methode im PDCA-Zyklus (`Qualitaetsentwicklung.md`) ergänzt.

## [2026-05-08] Ingest | Web-Recherche: Forschendes Lernen im Ganztag
- **Quelle:** Internet-Recherche (Stiftung Kinder forschen, forschendes-lernen.net, Siemens Stiftung)
- **Aktionen:**
  - Neue Seite [[Methode_Forschendes_Lernen|Forschendes Lernen]] in `05_Paedagogische_Methoden` erstellt (Forschungskreis, Praxistipps, Ganztags-Bezug).
  - Querverweise zu Ko-Konstruktion, Scaffolding, Partizipation, Rhythmisierung und Raumkonzept gesetzt.
  - Index aktualisiert.

## [2026-05-08] Ingest | Web-Recherche: Projektarbeit, Feedbackkultur, Resilienz, Bewegte Schule
- **Quelle:** Internet-Recherche (ganztaegig-lernen.de, IQES, Bildungsserver, ZSL BW, Schulpsychologie)
- **Aktionen:**
  - Neue Seite [[Methode_Projektarbeit|Projektarbeit]] in `05_Paedagogische_Methoden` erstellt (5-Phasen-Modell, Dokumentation).
  - Neue Seite [[Methode_Feedbackkultur|Feedbackkultur & LEG]] in `05_Paedagogische_Methoden` erstellt (LEG, Portfolio, Selbsteinschätzung).
  - Neue Seite [[Resilienzfoerderung|Resilienzförderung]] in `06_Paedagogische_Fachbegriffe` erstellt (Schutzfaktoren, Selbstwirksamkeit).
  - Neue Seite [[Bewegte_Schule|Bewegte Schule]] in `06_Paedagogische_Fachbegriffe` erstellt (Bewegungspausen, innere/äußere Rhythmisierung).
  - Index um neue Kategorie „Pädagogische Fachbegriffe" erweitert (inkl. bereits existierender Seiten).
  - Querverweise in alle neuen Seiten gesetzt.

## [2026-05-09] Ingest | Web-Recherche: Rechtsanspruch 2026 & KMK-Qualität im Ganztag
- **Quelle:** Kultusministerium Baden-Württemberg, BMBFSFJ, KMK-Empfehlungen zur pädagogischen Qualität im Ganztag.
- **Aktionen:**
  - Neue Seite [[Rechtsanspruch_Ganztagsbetreuung_2026|Rechtsanspruch Ganztagsbetreuung ab 2026]] in `01_Rahmenkonzepte_und_Steuerung` erstellt.
  - [[Qualitaetsrahmen_Ganztagsschule_BW|Qualitätsrahmen Ganztagsschule BW]] um die KMK-Empfehlungen von 2023 als bundesweiten Qualitätsimpuls ergänzt.
  - Querverweise zu Zeit/Rhythmisierung, Raumkonzept, Kooperation/Personal und Elternarbeit gesetzt.
  - Startseite und Wiki Index aktualisiert.

## [2026-05-09] UX | Startseite als Team-Dashboard
- **Aktionen:**
  - Startseite von einer Themenliste zu einem praxisorientierten Dashboard umgebaut.
  - Schnellzugriffe für Angebotplanung, Lernzeit, Raumreflexion, Kinderbeteiligung, Qualitätsarbeit und rechtliche Orientierung ergänzt.
  - Aktuell-wichtig-Bereich für Rechtsanspruch 2026 und Qualitätsrahmen eingefügt.
  - Themenbibliothek erhalten, aber weiter nach unten verlagert.
  - Dezente Styles für Überschriften, Listen und Callouts ergänzt.

## [2026-05-09] UX | Praxiswege, Vorlagen und Schnellzugriff
- **Aktionen:**
  - Fünf Praxis-Einstiegsseiten erstellt: Angebot planen, Lernzeit gestalten, Raum reflektieren, Kinder beteiligen, Elterngespräch vorbereiten.
  - Drei neue Vorlagen ergänzt: Angebotsplanung, Elterngespräch, Team-Fallbesprechung.
  - Öffentliche Seite [[Glossar_und_Schnellzugriff|Glossar & Schnellzugriff]] erstellt.
  - Startseite, Wiki Index und Styling um neue Praxiswege und Vorlagen erweitert.

## [2026-05-09] UX | Vorlagen-Downloads
- **Aktionen:**
  - Word- und PDF-Downloads für sechs zentrale Vorlagen erzeugt: Angebotsplanung, Elterngespräch, Team-Fallbesprechung, Kinderkonferenz, Werkstattordner und Raumgestaltung.
  - Download-Boxen auf allen Vorlagenseiten ergänzt.
  - Download-Tabelle im [[Glossar_und_Schnellzugriff|Glossar & Schnellzugriff]] und Hinweis auf der Startseite ergänzt.
  - Generator `scripts/generate-template-downloads.mjs` hinzugefügt, damit die Dateien reproduzierbar neu erzeugt werden können.

## [2026-05-09] UX | Navigation, Quellenstand und Glossar
- **Quelle:** Offizielle Seiten von Kultusministerium Baden-Württemberg, BMBFSFJ und KMK; lokale Rohquellen in `content/raw`.
- **Aktionen:**
  - Zentralen Hub [[Vorlagen_und_Downloads|Vorlagen & Downloads]] erstellt.
  - Neue Seite [[Praxispfade|Praxispfade]] als Einstieg über Alltagssituationen ergänzt.
  - Neue Seite [[Quellen_und_Rechtsstand|Quellen & Rechtsstand]] für Rechtsstand, Quellenqualität und verifizierte Online-Quellen erstellt.
  - Kurzfassungen auf zentralen Qualitätsseiten ergänzt.
  - Glossar um kurze Begriffserklärungen erweitert.
  - Download-Hinweise auf Vorlagenseiten vereinheitlicht und optisch über `custom.scss` verbessert.

## [2026-05-09] Ingest | Aktuelle Forschung, Quellenbibliothek und Explorer-UX
- **Quelle:** Springer Open Access, DJI, ifo Institut sowie lokale Rohquellen in `content/raw`.
- **Aktionen:**
  - Neue Überblicksseite [[Forschung_Ganztag_2024_2026|Forschung zum Ganztag 2024-2026]] erstellt.
  - Neue Fachseite [[Bewegung_Spiel_und_Sport_im_Ganztag|Bewegung, Spiel & Sport im Ganztag]] ergänzt.
  - [[Qualitaetsrahmen_Ganztagsschule_BW|Qualitätsrahmen]], [[Kooperation_und_Personal|Kooperation & Personal]], [[Rechtsanspruch_Ganztagsbetreuung_2026|Rechtsanspruch]], [[Angebotsstruktur]], [[Zeit_und_Rhythmisierung]] und [[Bewegte_Schule]] um aktuelle Forschungsimpulse erweitert.
  - Neue [[Quellenbibliothek|Quellenbibliothek]] mit Download-Links auf lokale Raw-PDFs erstellt.
  - Explorer-Darstellung geplant/umgesetzt: menschenlesbare Ordnernamen, kompaktere Anzeige und ruhigere Sidebar.

## [2026-05-09] UX | Einheitliche Seiteneinstiege
- **Aktionen:**
  - Öffentliche Wiki-Seiten ohne Einstieg um kurze Abstract-Callouts ergänzt.
  - Fach-, Konzept-, Leitprinzipien-, Bildungsfeld- und Methodenseiten mit `Kurzfassung` versehen.
  - Vorlagenseiten mit `Wann nutzen?` ergänzt, damit Zweck und Einsatzsituation sofort klar sind.
  - `Clippings`, `meta` und `Claude.md` unverändert gelassen.

## [2026-05-10] Ingest | Forschendes Lernen als Ganztags-Themenpfad
- **Quelle:** Stiftung Kinder forschen, Stiftung Lesen, BMBFSFJ, Gerbeshi/Ertl/Torrau 2024, Wittig 2025.
- **Aktionen:**
  - Neue Übersichtsseite [[Forschendes_Lernen_im_Ganztag|Forschendes Lernen im Ganztag]] erstellt.
  - [[Methode_Forschendes_Lernen|Forschendes Lernen]] um Quellen, Forschungskreis, Kinderperspektive, Lernbegleitung, Dokumentation und Inklusion vertieft.
  - Querverweise in Praxisplanung, Angebotsvorlage, Projektarbeit, Scaffolding, Ko-Konstruktion, Zeit, Raum, Angebotsstruktur, Lernzeiten, Partizipation, Adultismus, BNE, Medienbildung und Wahrnehmen/Denken ergänzt.
  - [[Forschung_Ganztag_2024_2026|Forschung zum Ganztag 2024-2026]] und [[Quellen_und_Rechtsstand|Quellen & Rechtsstand]] um MINT, forschendes Lernen und Kinderperspektive erweitert.
  - Startseite, Glossar, Praxispfade und Wiki Index aktualisiert.

## [2026-05-10] UX | Kachel-Dashboard, Themenpfade und Download-Karten
- **Aktionen:**
  - Startseite zu einem kachelbasierten Einstieg mit Direktstart und Themenpfaden umgebaut.
  - [[Vorlagen_und_Downloads|Vorlagen & Downloads]] und [[Quellenbibliothek]] von Tabellen auf Download-Karten umgestellt.
  - Zentrale Fachseiten mit kurzen `Nächster Schritt`-Boxen ergänzt.
  - [[Glossar_und_Schnellzugriff|Glossar & Schnellzugriff]], [[Praxispfade]] und [[Forschung_Ganztag_2024_2026|Forschung zum Ganztag 2024-2026]] stärker mit Themenpfaden vernetzt.
  - Explorer-Benennungen und Sidebar-CSS weiter beruhigt; neue Karten- und Praxisboxen in `custom.scss` ergänzt.

## [2026-06-10] Ingest | Hauskonzeption – Textblöcke
- **Quelle:** 11 finale Textblock-Vorlagen in `content/raw/Textblock_*_final.pdf`.
- **Aktionen:**
  - Neue Sektion `08_Hauskonzeption` mit Übersichtsseite [[08_Hauskonzeption/index|Hauskonzeption]] angelegt.
  - 11 Textblock-Seiten erstellt, Text jeweils 1:1 aus den Roh-PDFs übernommen (Sprachliche Bildung, Gut ankommen, Ausflüge, Kinderschutz, Beschwerdeverfahren, Qualität & Qualitätssicherung, Datenschutz & Aktenführung, Zusammenarbeit mit Familien / Schule / Träger / Team).
  - Jede Seite mit Quelle-Hinweis und einem `Kontext im Wiki`-Kasten (Querverweise auf bestehende Themen) versehen.
  - Ordner als Navigationspunkt „Hauskonzeption" in `quartz.ts` registriert, Anzeigenamen der Textblock-Seiten ergänzt.
  - Startseite (neue Themenraum-Kachel) und Wiki Index um die Sektion erweitert.
  - Hinweis: In `raw/` lagen zwei Dubletten (`Beschwerdemanagement_final (1)`, `Qualität sichern_final (1)`) – nur je ein Block erstellt.
