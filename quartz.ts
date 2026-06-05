import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import * as ExternalPlugin from "./.quartz/plugins"
import type { ExplorerOptions } from "./.quartz/plugins/explorer/dist"

type ExplorerNode = Parameters<NonNullable<ExplorerOptions["filterFn"]>>[0]

ExternalPlugin.Explorer({
  order: ["filter", "map", "sort"],
  filterFn: (node: ExplorerNode) =>
    !new Set(["tags", "meta", "Clippings", "raw", "Claude", "refactor", "danke"]).has(
      node.slugSegment ?? "",
    ),
  mapFn: (node: ExplorerNode) => {
    const slugSegment = node.slugSegment ?? ""
    const folderNames: Record<string, string> = {
      "01_Rahmenkonzepte_und_Steuerung": "Rahmen & Steuerung",
      "02_Leitprinzipien": "Leitprinzipien",
      "03_Bildungsfelder": "Bildungsfelder",
      "04_Qualitaet_Ganztagsschule": "Qualität im Ganztag",
      "05_Paedagogische_Methoden": "Methoden",
      "06_Paedagogische_Fachbegriffe": "Fachbegriffe",
      "07_Vorlagen_und_Praxis": "Vorlagen & Praxis",
    }
    const pageNames: Record<string, string> = {
      Aesthetische_Bildung: "Ästhetische Bildung",
      Angebotsstruktur: "Angebotsstruktur",
      Bewegung_Spiel_und_Sport_im_Ganztag: "Bewegung, Spiel & Sport",
      Bildung_fuer_nachhaltige_Entwicklung: "Bildung für nachhaltige Entwicklung",
      Checkliste_Raumgestaltung: "Checkliste Raumgestaltung",
      Demokratie_und_Schulklima: "Demokratie & Schulklima",
      Emotion_und_Motivation: "Emotion & Motivation",
      Forschung_Ganztag_2024_2026: "Forschung 2024-2026",
      Forschendes_Lernen_im_Ganztag: "Forschendes Lernen im Ganztag",
      Glossar_und_Schnellzugriff: "Glossar & Schnellzugriff",
      Koerper_und_Lebensweise: "Körper & Lebensweise",
      Kooperation_und_Personal: "Kooperation & Personal",
      Kultur_Werte_und_Religion: "Kultur, Werte & Religion",
      Lernzeiten_und_Kompetenzentwicklung: "Lernzeiten & Kompetenzentwicklung",
      Methode_Dialogisches_Lesen: "Dialogisches Lesen",
      Methode_Feedbackkultur: "Feedbackkultur",
      Methode_Forschendes_Lernen: "Forschendes Lernen",
      Methode_Mikrotransitionen: "Mikrotransitionen",
      Methode_Projektarbeit: "Projektarbeit",
      Methode_Scaffolding: "Scaffolding",
      Orientierungsplan_BaWue: "Orientierungsplan BW",
      Praxis_Angebot_planen: "Praxis: Angebot planen",
      Praxis_Elterngespraech_vorbereiten: "Praxis: Elterngespräch",
      Praxis_Kinder_beteiligen: "Praxis: Kinder beteiligen",
      Praxis_Lernzeit_gestalten: "Praxis: Lernzeit gestalten",
      Praxis_Raum_reflektieren: "Praxis: Raum reflektieren",
      Praxispfade: "Praxispfade",
      Qualitaetsentwicklung_und_Werkstattordner: "Qualitätsentwicklung",
      Qualitaetsrahmen_Ganztagsschule_BW: "Qualitätsrahmen BW",
      Quellen_und_Rechtsstand: "Quellen & Rechtsstand",
      Quellenbibliothek: "Quellenbibliothek",
      Rahmenkonzept_Ganztag_Stuttgart: "Rahmenkonzept Ganztag Stuttgart",
      Raster_Werkstattordner: "Raster Werkstattordner",
      Raum_als_dritter_Erzieher: "Raum als dritter Erzieher",
      Raumkonzept_und_Lernumgebung: "Raumkonzept & Lernumgebung",
      Rechtsanspruch_Ganztagsbetreuung_2026: "Rechtsanspruch Ganztag 2026",
      Resilienzfoerderung: "Resilienzförderung",
      Soziale_Entwicklung: "Soziale Entwicklung",
      Sprache_und_Kommunikation: "Sprache & Kommunikation",
      Steuerung_und_Schulleitung: "Steuerung & Schulleitung",
      Traegerprofil_Einstein_2_0: "Trägerprofil Einstein 2.0",
      "Trägerprofil_Einstein_2_0": "Trägerprofil Einstein 2.0",
      Uebergaenge_und_Zusammenarbeit: "Übergänge & Zusammenarbeit",
      Vorlage_Angebotsplanung: "Vorlage Angebotsplanung",
      Vorlage_Elterngespraech: "Vorlage Elterngespräch",
      Vorlage_Kinderkonferenz: "Vorlage Kinderkonferenz",
      Vorlage_Team_Fallbesprechung: "Vorlage Team-Fallbesprechung",
      Vorlagen_und_Downloads: "Vorlagen & Downloads",
      Wahrnehmen_und_Denken: "Wahrnehmen & Denken",
      Zeit_und_Rhythmisierung: "Zeit & Rhythmisierung",
      Zirkulaerer_Prozess: "Zirkulärer Prozess",
    }

    if (node.isFolder && folderNames[slugSegment]) {
      node.displayName = folderNames[slugSegment]
      return node
    }

    if (!node.isFolder) {
      node.displayName =
        pageNames[slugSegment] ??
        (node.displayName ?? slugSegment)
          .replace(/^Methode_/, "")
          .replace(/^Praxis_/, "Praxis: ")
          .replace(/^Vorlage_/, "Vorlage ")
          .replaceAll("_und_", " & ")
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
