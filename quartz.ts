import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import * as ExternalPlugin from "./.quartz/plugins"
import type { ExplorerOptions } from "./.quartz/plugins/explorer/dist"

type ExplorerNode = Parameters<NonNullable<ExplorerOptions["filterFn"]>>[0]

ExternalPlugin.Explorer({
  order: ["filter", "map", "sort"],
  filterFn: (node: ExplorerNode) =>
    !new Set(["tags", "meta", "clippings", "raw", "claude", "refactor", "danke"]).has(
      (node.slugSegment ?? "").toLowerCase(),
    ),
  mapFn: (node: ExplorerNode) => {
    const slugSegment = node.slugSegment ?? ""
    const normalizedSegment = slugSegment.toLowerCase()
    const folderNames: Record<string, string> = {
      "01_rahmenkonzepte_und_steuerung": "Rahmen & Steuerung",
      "02_leitprinzipien": "Leitprinzipien",
      "03_bildungsfelder": "Bildungsfelder",
      "04_qualitaet_ganztagsschule": "Qualität im Ganztag",
      "05_paedagogische_methoden": "Methoden",
      "06_paedagogische_fachbegriffe": "Fachbegriffe",
      "07_vorlagen_und_praxis": "Vorlagen & Praxis",
      "08_hauskonzeption": "Hauskonzeption",
    }
    const pageNames: Record<string, string> = {
      aesthetische_bildung: "Ästhetische Bildung",
      angebotsstruktur: "Angebotsstruktur",
      bewegung_spiel_und_sport_im_ganztag: "Bewegung, Spiel & Sport",
      bildung_fuer_nachhaltige_entwicklung: "Bildung für nachhaltige Entwicklung",
      checkliste_raumgestaltung: "Checkliste Raumgestaltung",
      demokratie_und_schulklima: "Demokratie & Schulklima",
      emotion_und_motivation: "Emotion & Motivation",
      forschung_ganztag_2024_2026: "Forschung 2024-2026",
      forschendes_lernen_im_ganztag: "Forschendes Lernen im Ganztag",
      glossar_und_schnellzugriff: "Glossar & Schnellzugriff",
      koerper_und_lebensweise: "Körper & Lebensweise",
      kooperation_und_personal: "Kooperation & Personal",
      kultur_werte_und_religion: "Kultur, Werte & Religion",
      lernzeiten_und_kompetenzentwicklung: "Lernzeiten & Kompetenzentwicklung",
      methode_dialogisches_lesen: "Dialogisches Lesen",
      methode_feedbackkultur: "Feedbackkultur",
      methode_forschendes_lernen: "Forschendes Lernen",
      methode_mikrotransitionen: "Mikrotransitionen",
      methode_projektarbeit: "Projektarbeit",
      methode_scaffolding: "Scaffolding",
      orientierungsplan_bawue: "Orientierungsplan BW",
      praxis_angebot_planen: "Praxis: Angebot planen",
      praxis_elterngespraech_vorbereiten: "Praxis: Elterngespräch",
      praxis_kinder_beteiligen: "Praxis: Kinder beteiligen",
      praxis_lernzeit_gestalten: "Praxis: Lernzeit gestalten",
      praxis_raum_reflektieren: "Praxis: Raum reflektieren",
      praxispfade: "Praxispfade",
      qualitaetsentwicklung_und_werkstattordner: "Qualitätsentwicklung",
      qualitaetsrahmen_ganztagsschule_bw: "Qualitätsrahmen BW",
      quellen_und_rechtsstand: "Quellen & Rechtsstand",
      quellenbibliothek: "Quellenbibliothek",
      rahmenkonzept_ganztag_stuttgart: "Rahmenkonzept Ganztag Stuttgart",
      raster_werkstattordner: "Raster Werkstattordner",
      raum_als_dritter_erzieher: "Raum als dritter Erzieher",
      raumkonzept_und_lernumgebung: "Raumkonzept & Lernumgebung",
      rechtsanspruch_ganztagsbetreuung_2026: "Rechtsanspruch Ganztag 2026",
      resilienzfoerderung: "Resilienzförderung",
      soziale_entwicklung: "Soziale Entwicklung",
      sprache_und_kommunikation: "Sprache & Kommunikation",
      steuerung_und_schulleitung: "Steuerung & Schulleitung",
      textblock_ausfluege_und_aktivitaeten: "Ausflüge & Aktivitäten",
      textblock_beschwerdeverfahren: "Beschwerdeverfahren",
      textblock_datenschutz_und_aktenfuehrung: "Datenschutz & Aktenführung",
      textblock_gut_ankommen: "Gut ankommen (Schulkind)",
      textblock_kinderschutz: "Kinderschutz",
      textblock_qualitaetssicherung: "Qualität & Qualitätssicherung",
      textblock_sprachliche_bildung: "Sprachliche Bildung",
      textblock_tagesstruktur: "Tagesstruktur (Schulkind)",
      textblock_zusammenarbeit_im_team: "Zusammenarbeit im Team",
      textblock_zusammenarbeit_mit_dem_traeger: "Zusammenarbeit mit dem Träger",
      textblock_zusammenarbeit_mit_familien: "Zusammenarbeit mit Familien",
      textblock_zusammenarbeit_mit_schule: "Zusammenarbeit mit Schule",
      traegerprofil_einstein_2_0: "Trägerprofil Einstein 2.0",
      uebergaenge_und_zusammenarbeit: "Übergänge & Zusammenarbeit",
      vorlage_angebotsplanung: "Vorlage Angebotsplanung",
      vorlage_elterngespraech: "Vorlage Elterngespräch",
      vorlage_kinderkonferenz: "Vorlage Kinderkonferenz",
      vorlage_team_fallbesprechung: "Vorlage Team-Fallbesprechung",
      vorlagen_und_downloads: "Vorlagen & Downloads",
      wahrnehmen_und_denken: "Wahrnehmen & Denken",
      zeit_und_rhythmisierung: "Zeit & Rhythmisierung",
      zirkulaerer_prozess: "Zirkulärer Prozess",
    }

    if (node.isFolder && folderNames[normalizedSegment]) {
      node.displayName = folderNames[normalizedSegment]
      return node
    }

    if (!node.isFolder) {
      node.displayName =
        pageNames[normalizedSegment] ??
        (node.displayName ?? slugSegment)
          .replace(/^Methode_/i, "")
          .replace(/^Praxis_/i, "Praxis: ")
          .replace(/^Vorlage_/i, "Vorlage ")
          .replaceAll(/_und_/gi, " & ")
          .replaceAll("_", " ")
    }

    return node
  },
  sortFn: (a: ExplorerNode, b: ExplorerNode) => {
    const aName = a.displayName ?? ""
    const bName = b.displayName ?? ""

    if ((!a.isFolder && !b.isFolder) || (a.isFolder && b.isFolder)) {
      return aName.localeCompare(bName, undefined, {
        numeric: true,
        sensitivity: "base",
      })
    }

    return !a.isFolder && b.isFolder ? 1 : -1
  },
} satisfies Partial<ExplorerOptions>)

const config = await loadQuartzConfig()
export default config
export const layout = await loadQuartzLayout()
