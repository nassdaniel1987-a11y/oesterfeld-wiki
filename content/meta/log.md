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
