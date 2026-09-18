const fs = require('fs');
const path = require('path');

const componentsDir = 'c:\\Users\\ASUS\\Desktop\\SIH Final\\src\\components';
const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.js'));

const regexHTMLTags = />([^<]+)</g;
const windowTRegex = /\$\{window\.t\(/;

files.forEach(file => {
  const content = fs.readFileSync(path.join(componentsDir, file), 'utf-8');
  console.log(`\n--- Checking ${file} ---`);
  
  let match;
  while ((match = regexHTMLTags.exec(content)) !== null) {
    let text = match[1].trim();
    if (text.length > 1 && !text.includes('${window.t') && !text.match(/^[\d\.\%\:\-]+$/)) {
      // It's a text node that might not be localized
      console.log(`Line around match: ${text.substring(0, 50)}...`);
    }
  }
});
