// Regenerates js/fallback-data.js from data/content.json.
// Run from the project folder after editing content.json:  node tools/build-fallback.js
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(root, 'data/content.json'), 'utf8'));
fs.writeFileSync(path.join(root, 'js/fallback-data.js'),
  '/**\n * GENERATED from data/content.json; do not edit by hand.\n' +
  ' * Used only when the page is opened straight from disk (file://), where fetch() is blocked.\n' +
  ' * Regenerate after editing content.json:  node tools/build-fallback.js\n */\n' +
  'window.DEFAULT_CONTENT_FALLBACK = ' + JSON.stringify(data, null, 2) + ';\n');
console.log('js/fallback-data.js regenerated');
