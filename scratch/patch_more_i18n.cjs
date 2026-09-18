const fs = require('fs');

const i18nPath = 'c:\\Users\\ASUS\\Desktop\\SIH Final\\src\\services\\i18n.js';
let content = fs.readFileSync(i18nPath, 'utf8');

const enhancedHelper = `
window.tData = function(value) {
    if(!value) return '--';
    let valStr = String(value);
    
    // Direct matches
    const map = {
        'Type 2 Diabetes': 'wiz.s1.type2',
        'Type 1 Diabetes': 'wiz.s1.type1',
        'Gestational Diabetes': 'wiz.s1.gestational',
        'Pre-diabetic': 'wiz.s1.prediabetic',
        'Newly Diagnosed': 'wiz.s1.newlyDiagnosed',
        'Newly Diagnosed (< 1 yr)': 'wiz.s1.newlyDiagnosed1yr',
        '1 - 5 Years': 'wiz.s1.oneToFive',
        '6 - 10 Years': 'wiz.s1.sixToTen',
        '11 - 20 Years': 'wiz.s1.elevenToTwenty',
        '> 20 Years': 'wiz.s1.moreThanTwenty',
        'Male': 'wiz.s1.male',
        'Female': 'wiz.s1.female',
        'Other': 'wiz.s1.other',
        'PHC Rampur': 'centre.phcRampur',
        'PHC Rampur — Primary Health Centre (District Ballia)': 'centre.phcRampurFull',
        'CHC Kotdwar': 'centre.chcKotdwar',
        'CHC Kotdwar — Community Health Centre (Pauri Garhwal)': 'centre.chcKotdwarFull',
        'Mobile Retinal Van #3': 'centre.mobileVan3',
        'Mobile Retinal Van #3 — Remote Outreach Vehicle (Kutch)': 'centre.mobileVan3Full',
        'Sub-Centre Dharampur': 'centre.subDharampur',
        'Sub-Centre Dharampur — Rural Outreach Post (Varanasi)': 'centre.subDharampurFull',
        'PHC Sunderbans': 'centre.phcSunderbans',
        'PHC Sunderbans — Delta Outpost Clinic (South 24 Parganas)': 'centre.phcSunderbansFull',
        '4G Stable': 'rural.net.4g',
        '2G Low Bandwidth': 'rural.net.2g',
        'Offline Store-and-Forward': 'rural.net.offline',
        'Optical Fiber': 'rural.net.fiber'
    };
    
    if (map[valStr]) return window.t(map[valStr]);

    // If it is Hindi mode, translate "Years", "y", "Patients", "KB (Standard)"
    if (window.getLanguage() === 'hi') {
        valStr = valStr.replace(/Years/g, 'वर्ष');
        valStr = valStr.replace(/yr/g, 'वर्ष');
        valStr = valStr.replace(/y/g, 'व'); // e.g. 18y -> 18व
        valStr = valStr.replace(/Patients/g, 'मरीज़');
        valStr = valStr.replace(/KB \\(Standard\\)/g, 'केबी (मानक)');
        
        // Also handle "Male" and "Female" if they are inside strings like "(Male)"
        valStr = valStr.replace(/Male/g, window.t('wiz.s1.male') || 'पुरुष');
        valStr = valStr.replace(/Female/g, window.t('wiz.s1.female') || 'महिला');
    }
    
    return valStr;
};
`;

content = content.replace(/window\.tData = function\(value\) \{[\s\S]*?return valStr;\n\};\n/, enhancedHelper);

// Add missing keys to English block
const enNewKeys = `
    "wiz.s1.newlyDiagnosed1yr": "Newly Diagnosed (< 1 yr)",
    "centre.phcRampur": "PHC Rampur",
    "centre.phcRampurFull": "PHC Rampur — Primary Health Centre (District Ballia)",
    "centre.chcKotdwar": "CHC Kotdwar",
    "centre.chcKotdwarFull": "CHC Kotdwar — Community Health Centre (Pauri Garhwal)",
    "centre.mobileVan3": "Mobile Retinal Van #3",
    "centre.mobileVan3Full": "Mobile Retinal Van #3 — Remote Outreach Vehicle (Kutch)",
    "centre.subDharampur": "Sub-Centre Dharampur",
    "centre.subDharampurFull": "Sub-Centre Dharampur — Rural Outreach Post (Varanasi)",
    "centre.phcSunderbans": "PHC Sunderbans",
    "centre.phcSunderbansFull": "PHC Sunderbans — Delta Outpost Clinic (South 24 Parganas)",
    "rural.net.4g": "4G Stable",
    "rural.net.2g": "2G Low Bandwidth",
    "rural.net.offline": "Offline Store-and-Forward",
    "rural.net.fiber": "Optical Fiber",
`;

// Add missing keys to Hindi block
const hiNewKeys = `
    "wiz.s1.newlyDiagnosed1yr": "नया निदान (< 1 वर्ष)",
    "centre.phcRampur": "पीएचसी रामपुर",
    "centre.phcRampurFull": "पीएचसी रामपुर — प्राथमिक स्वास्थ्य केंद्र (जिला बलिया)",
    "centre.chcKotdwar": "सीएचसी कोटद्वार",
    "centre.chcKotdwarFull": "सीएचसी कोटद्वार — सामुदायिक स्वास्थ्य केंद्र (पौड़ी गढ़वाल)",
    "centre.mobileVan3": "मोबाइल रेटिनल वैन #3",
    "centre.mobileVan3Full": "मोबाइल रेटिनल वैन #3 — दूरस्थ आउटरीच वाहन (कच्छ)",
    "centre.subDharampur": "उप-केंद्र धरमपुर",
    "centre.subDharampurFull": "उप-केंद्र धरमपुर — ग्रामीण आउटरीच पोस्ट (वाराणसी)",
    "centre.phcSunderbans": "पीएचसी सुंदरवन",
    "centre.phcSunderbansFull": "पीएचसी सुंदरवन — डेल्टा आउटपोस्ट क्लिनिक (दक्षिण 24 परगना)",
    "rural.net.4g": "4G स्थिर",
    "rural.net.2g": "2G कम बैंडविड्थ",
    "rural.net.offline": "ऑफ़लाइन स्टोर-एंड-फॉरवर्ड",
    "rural.net.fiber": "ऑप्टिकल फाइबर",
`;

content = content.replace(/"wiz\.s1\.newlyDiagnosed": "Newly Diagnosed",/, '"wiz.s1.newlyDiagnosed": "Newly Diagnosed",' + '\n' + enNewKeys);
content = content.replace(/"wiz\.s1\.newlyDiagnosed": "नया निदान",/, '"wiz.s1.newlyDiagnosed": "नया निदान",' + '\n' + hiNewKeys);

fs.writeFileSync(i18nPath, content, 'utf8');
console.log('Patched i18n.js with enhanced window.tData and new keys');
