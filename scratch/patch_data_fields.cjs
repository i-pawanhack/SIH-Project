const fs = require('fs');

const i18nPath = 'c:\\Users\\ASUS\\Desktop\\SIH Final\\src\\services\\i18n.js';
let i18nContent = fs.readFileSync(i18nPath, 'utf8');

const helper = `
window.tData = function(value) {
    if(!value) return '--';
    const valStr = String(value);
    const map = {
        'Type 2 Diabetes': 'wiz.s1.type2',
        'Type 1 Diabetes': 'wiz.s1.type1',
        'Gestational Diabetes': 'wiz.s1.gestational',
        'Pre-diabetic': 'wiz.s1.prediabetic',
        'Newly Diagnosed': 'wiz.s1.newlyDiagnosed',
        '1 - 5 Years': 'wiz.s1.oneToFive',
        '6 - 10 Years': 'wiz.s1.sixToTen',
        '11 - 20 Years': 'wiz.s1.elevenToTwenty',
        '> 20 Years': 'wiz.s1.moreThanTwenty',
        'Male': 'wiz.s1.male',
        'Female': 'wiz.s1.female',
        'Other': 'wiz.s1.other'
    };
    if (map[valStr]) return window.t(map[valStr]);
    return valStr;
};
`;

if (!i18nContent.includes('window.tData')) {
    i18nContent += helper;
    fs.writeFileSync(i18nPath, i18nContent, 'utf8');
}

const patchFile = (filePath, replacements) => {
    let content = fs.readFileSync(filePath, 'utf8');
    replacements.forEach(([regex, replacer]) => {
        content = content.replace(regex, replacer);
    });
    fs.writeFileSync(filePath, content, 'utf8');
};

const componentsDir = 'c:\\Users\\ASUS\\Desktop\\SIH Final\\src\\components';

// ReportModal
patchFile(`${componentsDir}\\ReportModal.js`, [
    [/\$\{patient\.gender \|\| '--'\}/g, '${window.tData(patient.gender)}'],
    [/\$\{patient\.diabetesStatus \|\| '--'\}/g, '${window.tData(patient.diabetesStatus)}'],
    [/\$\{patient\.diabetesDuration \|\| '--'\}/g, '${window.tData(patient.diabetesDuration)}']
]);

// ScreeningWizard
patchFile(`${componentsDir}\\ScreeningWizard.js`, [
    [/\$\{patientData\.gender\}/g, '${window.tData(patientData.gender)}'],
    [/\$\{patientData\.diabetesStatus\}/g, '${window.tData(patientData.diabetesStatus)}'],
    [/\$\{patientData\.diabetesDuration\}/g, '${window.tData(patientData.diabetesDuration)}']
]);

console.log('Added window.tData and patched components');
