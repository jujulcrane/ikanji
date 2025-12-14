const fs = require('fs');
const path = require('path');

// Read the lesson 3 vocab file
const vocabContent = fs.readFileSync(
  path.join(__dirname, 'lesson_3_vocab.txt'),
  'utf-8'
);

// Parse it
const lines = vocabContent.split('\n');
let csvContent = 'LESSON_NAME,Quartet lesson 3 vocab\nPRACTICE_SENTENCES\njapanese,english\n';

for (const line of lines) {
  if (!line.trim() || line.includes('第3課') || line.includes('読み物')) {
    continue;
  }

  const match = line.match(/^\d+\.\s*(.+?)\s{2,}(.+)$/);
  if (match) {
    const kanji = match[1].trim();
    const furiganaAndDef = match[2].trim();
    // Escape any commas in the text by wrapping in quotes if needed
    const kanjiEscaped = kanji.includes(',') ? '"' + kanji + '"' : kanji;
    const furiganaEscaped = furiganaAndDef.includes(',')
      ? '"' + furiganaAndDef + '"'
      : furiganaAndDef;
    csvContent += kanjiEscaped + ',' + furiganaEscaped + '\n';
  }
}

const outputPath = path.join(__dirname, 'quartet_lesson3_template.csv');
fs.writeFileSync(outputPath, csvContent);
console.log('CSV template created successfully!');
console.log('Output file:', outputPath);
console.log('\nFirst 10 lines:');
console.log(csvContent.split('\n').slice(0, 10).join('\n'));
console.log(`\nTotal practice sentences: ${csvContent.split('\n').length - 4}`);
