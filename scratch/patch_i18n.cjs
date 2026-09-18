const fs = require('fs');

const path = 'c:\\Users\\ASUS\\Desktop\\SIH Final\\src\\services\\i18n.js';
let content = fs.readFileSync(path, 'utf8');

const enNewKeys = `
    "wiz.s1.newlyDiagnosed": "Newly Diagnosed",
    "wiz.s1.oneToFive": "1 - 5 Years",
    "wiz.s1.sixToTen": "6 - 10 Years",
    "wiz.s1.elevenToTwenty": "11 - 20 Years",
    "wiz.s1.moreThanTwenty": "> 20 Years",
    "wiz.s2.uploadBreadcrumb": "Upload -> Quality Check -> Enhancement -> AI Pipeline",
    "dash.l0_short": "Level 0",
    "dash.l1_short": "Level 1",
    "dash.l2_short": "Level 2",
    "dash.l3_short": "Level 3",
    "dash.l4_short": "Level 4",
    "report.aiimsHub": "AIIMS Tele-Retina Hub",
    "rural.specs.camera": "RetinaCam 45D Pro (USB 3.0)",
    "rural.specs.res": "2048 x 1536 (Sub-sampled 512x)",
    "rural.specs.illum": "Infrared + White LED Flash",
    "rural.specs.pupil": "Active Auto-Alignment",
    "rural.specs.model": "TensorFlow Lite / ONNX Edge",
    "rural.specs.quant": "INT8 Optimized",
    "rural.specs.runtime": "142 ms",
    "rural.specs.size": "18.4 MB (EfficientNet Backbone)",
    "rural.specs.telemetry": "Cellular Telemetry Sync",
    "rural.specs.https": "Store-and-Forward HTTPS",
    "wiz.s1.genderSelect": "Select Gender...",
    "wiz.s1.durationSelect": "Select Duration...",
    "wiz.s1.statusSelect": "Select Status..."
`;

const hiNewKeys = `
    "wiz.s1.newlyDiagnosed": "नया निदान",
    "wiz.s1.oneToFive": "1 - 5 वर्ष",
    "wiz.s1.sixToTen": "6 - 10 वर्ष",
    "wiz.s1.elevenToTwenty": "11 - 20 वर्ष",
    "wiz.s1.moreThanTwenty": "> 20 वर्ष",
    "wiz.s2.uploadBreadcrumb": "अपलोड -> गुणवत्ता जांच -> संवर्द्धन -> एआई पाइपलाइन",
    "dash.l0_short": "स्तर 0",
    "dash.l1_short": "स्तर 1",
    "dash.l2_short": "स्तर 2",
    "dash.l3_short": "स्तर 3",
    "dash.l4_short": "स्तर 4",
    "report.aiimsHub": "एम्स टेली-रेटिना हब",
    "rural.specs.camera": "रेटिनाकैम 45D प्रो (USB 3.0)",
    "rural.specs.res": "2048 x 1536 (सब-सैंपल 512x)",
    "rural.specs.illum": "इन्फ्रारेड + व्हाइट एलईडी फ्लैश",
    "rural.specs.pupil": "सक्रिय ऑटो-अलाइनमेंट",
    "rural.specs.model": "TensorFlow Lite / ONNX Edge",
    "rural.specs.quant": "INT8 अनुकूलित",
    "rural.specs.runtime": "142 ms",
    "rural.specs.size": "18.4 MB (EfficientNet बैकबोन)",
    "rural.specs.telemetry": "सेल्युलर टेलीमेट्री सिंक",
    "rural.specs.https": "स्टोर-एंड-फॉरवर्ड HTTPS",
    "wiz.s1.genderSelect": "लिंग चुनें...",
    "wiz.s1.durationSelect": "अवधि चुनें...",
    "wiz.s1.statusSelect": "स्थिति चुनें..."
`;

// Insert into English block (just before '  },\n  "hi": {')
content = content.replace(/  \},\n  "hi": \{/, enNewKeys + '\n  },\n  "hi": {');

// Insert into Hindi block (just before '};\n\nwindow.getLanguage')
content = content.replace(/  \}\n\};\n/, hiNewKeys + '\n  }\n};\n');

fs.writeFileSync(path, content, 'utf8');
console.log('Patched i18n.js');
