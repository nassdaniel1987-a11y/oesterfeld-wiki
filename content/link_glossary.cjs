const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname);

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];
  files.forEach(function(file) {
    if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
      if (file !== '.obsidian' && file !== 'raw') {
        arrayOfFiles = getAllFiles(path.join(dirPath, file), arrayOfFiles);
      }
    } else {
      if (file.endsWith('.md')) {
        arrayOfFiles.push(path.join(dirPath, file));
      }
    }
  });
  return arrayOfFiles;
}

const allMdFiles = getAllFiles(contentDir);

allMdFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Don't replace inside the glossary files themselves
  if (file.includes('06_Paedagogische_Fachbegriffe')) return;

  // Adultismus
  content = content.replace(/\b(Adultismus)\b/g, '[[Adultismus]]');
  
  // Zirkulärer Prozess
  content = content.replace(/\b(zirkulären Prozess|zirkuläre Prozess|zirkulärer Prozess)\b/gi, '[[Zirkulaerer_Prozess|$1]]');
  
  // Raum als dritter Erzieher
  content = content.replace(/\b(Raum als dritter Erzieher|dritter Erzieher)\b/gi, '[[Raum_als_dritter_Erzieher|$1]]');
  
  // Ko-Konstruktion
  content = content.replace(/\b(ko-konstruktiv|ko-konstruktive|ko-konstruktiven|Ko-Konstrukteure|Ko-Konstruktion)\b/gi, '[[Ko-Konstruktion|$1]]');

  // Avoid nested brackets if we accidentally double-linked
  content = content.replace(/\[\[\[\[/g, '[[').replace(/\]\]\]\]/g, ']]');

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Linked terms in: ${file}`);
  }
});

console.log("Linking complete.");
