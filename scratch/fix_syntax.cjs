const fs = require('fs');
let c = fs.readFileSync('src/services/i18n.js', 'utf8');

c = c.replace(/("dash\.ungradable":\s*"[^"]+")\s*\n\s*("wiz\.s1\.newlyDiagnosed")/g, '$1,\n\n    $2');

fs.writeFileSync('src/services/i18n.js', c);
console.log('Fixed syntax in i18n.js');
