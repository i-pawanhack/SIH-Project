const fs = require('fs');

const path = 'c:\\Users\\ASUS\\Desktop\\SIH Final\\src\\data\\sampleCases.js';
const content = fs.readFileSync(path, 'utf8');

// Just extracting a few things to see exactly what they are
console.log(content.substring(0, 1500));
