const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname);
const wikiDir = path.join(contentDir, 'wiki');

const mapping = {
  // 01
  'Konzept_Einstein_2_0': { folder: '01_Rahmenkonzepte_und_Steuerung', newName: 'Trägerprofil_Einstein_2_0' },
  'Struktur_Ganztag_Stuttgart': { folder: '01_Rahmenkonzepte_und_Steuerung', newName: 'Rahmenkonzept_Ganztag_Stuttgart' },
  'Struktur_Einrichtungskonzeption': { folder: '01_Rahmenkonzepte_und_Steuerung', newName: 'Leitfaden_Einrichtungskonzeption' },
  'Orientierungsplan_BaWue': { folder: '01_Rahmenkonzepte_und_Steuerung', newName: 'Orientierungsplan_BaWue' },
  'Qualitaetsentwicklung': { folder: '01_Rahmenkonzepte_und_Steuerung', newName: 'Qualitaetsentwicklung_und_Werkstattordner' },
  
  // 02
  'LP_Inklusion': { folder: '02_Leitprinzipien', newName: 'Inklusion' },
  'LP_Partizipation': { folder: '02_Leitprinzipien', newName: 'Partizipation' },
  'LP_BNE': { folder: '02_Leitprinzipien', newName: 'Bildung_fuer_nachhaltige_Entwicklung' },
  'LP_Kinderschutz_Kinderrechte': { folder: '02_Leitprinzipien', newName: 'Kinderschutz_und_Kinderrechte' },
  'Uebergaenge_Zusammenarbeit': { folder: '02_Leitprinzipien', newName: 'Uebergaenge_und_Zusammenarbeit' },

  // 03
  'BF_Sprache_Kommunikation': { folder: '03_Bildungsfelder', newName: 'Sprache_und_Kommunikation' },
  'BF_Koerper_Lebensweise': { folder: '03_Bildungsfelder', newName: 'Koerper_und_Lebensweise' },
  'BF_Wahrnehmen_Denken': { folder: '03_Bildungsfelder', newName: 'Wahrnehmen_und_Denken' },
  'BF_Emotion_Motivation': { folder: '03_Bildungsfelder', newName: 'Emotion_und_Motivation' },
  'BF_Soziale_Entwicklung': { folder: '03_Bildungsfelder', newName: 'Soziale_Entwicklung' },
  'BF_Kultur_Werte_Religion': { folder: '03_Bildungsfelder', newName: 'Kultur_Werte_und_Religion' },
  'BF_Aesthetische_Bildung': { folder: '03_Bildungsfelder', newName: 'Aesthetische_Bildung' },
  'BF_Medienbildung': { folder: '03_Bildungsfelder', newName: 'Medienbildung' },

  // 04
  'Konzept_Qualitaetsrahmen_GTS': { folder: '04_Qualitaet_Ganztagsschule', newName: 'Qualitaetsrahmen_Ganztagsschule_BW' },
  'GTS_Zeit_Rhythmisierung': { folder: '04_Qualitaet_Ganztagsschule', newName: 'Zeit_und_Rhythmisierung' },
  'GTS_Raumkonzept': { folder: '04_Qualitaet_Ganztagsschule', newName: 'Raumkonzept_und_Lernumgebung' },
  'GTS_Kompetenzentwicklung': { folder: '04_Qualitaet_Ganztagsschule', newName: 'Lernzeiten_und_Kompetenzentwicklung' },
  'GTS_Elternarbeit': { folder: '04_Qualitaet_Ganztagsschule', newName: 'Zusammenarbeit_mit_Eltern' },
  'GTS_Angebotsstruktur': { folder: '04_Qualitaet_Ganztagsschule', newName: 'Angebotsstruktur' },
  'GTS_Demokratie_Schulklima': { folder: '04_Qualitaet_Ganztagsschule', newName: 'Demokratie_und_Schulklima' },
  'GTS_Kooperation_Personal': { folder: '04_Qualitaet_Ganztagsschule', newName: 'Kooperation_und_Personal' },
  'GTS_Steuerung_Schulleitung': { folder: '04_Qualitaet_Ganztagsschule', newName: 'Steuerung_und_Schulleitung' },

  // 05
  'Konzept_Scaffolding': { folder: '05_Paedagogische_Methoden', newName: 'Methode_Scaffolding' },
  'Konzept_Dialogisches_Lesen': { folder: '05_Paedagogische_Methoden', newName: 'Methode_Dialogisches_Lesen' },
  'Konzept_Mikrotransitionen': { folder: '05_Paedagogische_Methoden', newName: 'Methode_Mikrotransitionen' }
};

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// 1. Create Folders
const foldersToCreate = [...new Set(Object.values(mapping).map(m => m.folder))];
foldersToCreate.forEach(folder => {
  const dirPath = path.join(contentDir, folder);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

// 2. Move files
if (fs.existsSync(wikiDir)) {
    const files = fs.readdirSync(wikiDir);
    files.forEach(file => {
      if (!file.endsWith('.md')) return;
      const baseName = file.replace('.md', '');
      const mapInfo = mapping[baseName];
      
      let targetPath;
      if (mapInfo) {
          targetPath = path.join(contentDir, mapInfo.folder, mapInfo.newName + '.md');
      } else {
          // If not in map, just move it to content directly or somewhere else?
          // Let's keep it in 01_Rahmenkonzepte_und_Steuerung if unknown or just root
          targetPath = path.join(contentDir, file);
      }
      const sourcePath = path.join(wikiDir, file);
      fs.renameSync(sourcePath, targetPath);
    });
}

// 3. Update Links
function getAllFiles(dirPath, arrayOfFiles) {
  files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];
  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      if (file !== '.obsidian' && file !== 'raw') {
        arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
      }
    } else {
      if (file.endsWith('.md')) {
        arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
  });
  return arrayOfFiles;
}

const allMdFiles = getAllFiles(contentDir);

allMdFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  Object.keys(mapping).forEach(oldName => {
    const newName = mapping[oldName].newName;
    // Replace [[old_name]] or [[old_name|text]] or [[wiki/old_name]]
    // Regex explanation:
    // \[\[               Match [[
    // (?:wiki\/)?        Optionally match wiki/
    // oldName            Match the exact old name
    // (\|.*?)?           Optionally match | and any text up to ]]
    // \]\]               Match ]]
    
    const regex = new RegExp('\\[\\[(?:wiki\\/)?' + escapeRegExp(oldName) + '(\\|.*?)?\\]\\]', 'g');
    content = content.replace(regex, '[[' + newName + '$1]]');
  });

  // Also replace [[index]] to [[meta/index]] if it points to the old wiki index, but we moved it to meta long ago.
  // Actually, we'll leave it as is.
  
  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated links in: ${file}`);
  }
});

console.log("Refactoring complete.");
