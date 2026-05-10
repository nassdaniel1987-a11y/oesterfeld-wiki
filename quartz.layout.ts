import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

const WikiExplorer = () =>
  Component.Explorer({
    folderDefaultState: "collapsed",
    folderClickBehavior: "collapse",
    useSavedState: true,
    order: ["filter", "map", "sort"],
    filterFn: (node) => {
      const hidden = new Set(["tags", "meta", "Clippings", "raw", "Claude", "refactor"])
      return !hidden.has(node.slugSegment)
    },
    mapFn: (node) => {
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

      if (node.isFolder && folderNames[node.slugSegment]) {
        node.displayName = folderNames[node.slugSegment]
        return
      }

      if (!node.isFolder) {
        node.displayName =
          pageNames[node.slugSegment] ??
          node.displayName
            .replace(/^Methode_/, "")
            .replace(/^Praxis_/, "Praxis: ")
            .replace(/^Vorlage_/, "Vorlage ")
            .replaceAll("_und_", " & ")
            .replaceAll("_", " ")
      }
    },
    sortFn: (a, b) => {
      if ((!a.isFolder && !b.isFolder) || (a.isFolder && b.isFolder)) {
        return a.displayName.localeCompare(b.displayName, undefined, {
          numeric: true,
          sensitivity: "base",
        })
      }

      return !a.isFolder && b.isFolder ? 1 : -1
    },
  })

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {},
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    WikiExplorer(),
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    WikiExplorer(),
  ],
  right: [],
}
