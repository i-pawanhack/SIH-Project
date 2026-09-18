const fs = require('fs');

const patchFile = (filePath, replacements) => {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    replacements.forEach(([regex, replacer]) => {
        content = content.replace(regex, replacer);
    });
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Patched', filePath);
};

const componentsDir = 'c:\\Users\\ASUS\\Desktop\\SIH Final\\src\\components';

// 1. DashboardView.js
patchFile(`${componentsDir}\\DashboardView.js`, [
    // Date: 19 Sept 2026 -> toLocaleDateString
    [/\.toLocaleDateString\('en-GB'/g, '.toLocaleDateString(window.getLanguage() === "hi" ? "hi-IN" : "en-GB"'],
    
    // Ages and genders: e.g. `${c.patient?.age || '--'}y (${c.patient?.gender || '--'})`
    [/\$\{c\.patient\?\.age \|\| '--'\}y \(\$\{c\.patient\?\.gender \|\| '--'\}\)/g, '${window.tData(c.patient?.age + "y")} (${window.tData(c.patient?.gender)})'],
    
    // Centres: e.g. `${c.patient?.centre ? c.patient.centre.split('—')[0] : '--'}`
    [/\$\{c\.patient\?\.centre \? c\.patient\.centre\.split\('—'\)\[0\] : '--'\}/g, '${window.tData(c.patient?.centre ? c.patient.centre.split("—")[0].trim() : "--")}']
]);

// 2. ScreeningHistoryView.js
patchFile(`${componentsDir}\\ScreeningHistoryView.js`, [
    [/\.toLocaleDateString\('en-GB'/g, '.toLocaleDateString(window.getLanguage() === "hi" ? "hi-IN" : "en-GB"'],
    [/\$\{c\.patient\?\.age \|\| '--'\}y \(\$\{c\.patient\?\.gender \|\| '--'\}\)/g, '${window.tData(c.patient?.age + "y")} (${window.tData(c.patient?.gender)})'],
    [/\$\{c\.patient\?\.centre \? c\.patient\.centre\.split\('—'\)\[0\] : '--'\}/g, '${window.tData(c.patient?.centre ? c.patient.centre.split("—")[0].trim() : "--")}']
]);

// 3. RuralModeView.js
patchFile(`${componentsDir}\\RuralModeView.js`, [
    // Centre in sync queue
    [/\$\{c\.patient\?\.centre \? c\.patient\.centre\.split\('—'\)\[0\] : '--'\}/g, '${window.tData(c.patient?.centre ? c.patient.centre.split("—")[0].trim() : "--")}'],
    // 240 KB (Standard)
    [/240 KB \(Standard\)/g, '${window.tData("240 KB (Standard)")}']
]);

// 4. AnalyticsView.js
patchFile(`${componentsDir}\\AnalyticsView.js`, [
    // Table has hardcoded HTML rows like:
    // <td>PHC Rampur</td>
    // <td>Ballia, Uttar Pradesh</td>
    // <td>428 Patients</td>
    // <td>64 (15.0%)</td>
    // <td>4G Stable</td>
    [/>PHC Rampur</g, '>${window.tData("PHC Rampur")}<'],
    [/>Ballia, Uttar Pradesh</g, '>${window.getLanguage() === "hi" ? "बलिया, उत्तर प्रदेश" : "Ballia, Uttar Pradesh"}<'],
    [/>428 Patients</g, '>${window.tData("428 Patients")}<'],
    [/>4G Stable</g, '>${window.tData("4G Stable")}<'],
    
    [/>CHC Kotdwar</g, '>${window.tData("CHC Kotdwar")}<'],
    [/>Pauri Garhwal, Uttarakhand</g, '>${window.getLanguage() === "hi" ? "पौड़ी गढ़वाल, उत्तराखंड" : "Pauri Garhwal, Uttarakhand"}<'],
    [/>312 Patients</g, '>${window.tData("312 Patients")}<'],
    [/>2G Low Bandwidth</g, '>${window.tData("2G Low Bandwidth")}<'],
    
    [/>Mobile Retinal Van #3</g, '>${window.tData("Mobile Retinal Van #3")}<'],
    [/>Kutch, Gujarat</g, '>${window.getLanguage() === "hi" ? "कच्छ, गुजरात" : "Kutch, Gujarat"}<'],
    [/>540 Patients</g, '>${window.tData("540 Patients")}<'],
    [/>Offline Store-and-Forward</g, '>${window.tData("Offline Store-and-Forward")}<'],
    
    [/>Sub-Centre Dharampur</g, '>${window.tData("Sub-Centre Dharampur")}<'],
    [/>Varanasi, Uttar Pradesh</g, '>${window.getLanguage() === "hi" ? "वाराणसी, उत्तर प्रदेश" : "Varanasi, Uttar Pradesh"}<'],
    [/>195 Patients</g, '>${window.tData("195 Patients")}<'],
    [/>Optical Fiber</g, '>${window.tData("Optical Fiber")}<'],
]);

// 5. DoctorReviewView.js
patchFile(`${componentsDir}\\DoctorReviewView.js`, [
    [/\$\{c\.patient\?\.age \|\| '--'\}y/g, '${window.tData((c.patient?.age || "--") + "y")}'],
    [/\$\{c\.patient\?\.gender \|\| '--'\}/g, '${window.tData(c.patient?.gender || "--")}'],
    [/\$\{c\.patient\?\.diabetesDuration \|\| '--'\}/g, '${window.tData(c.patient?.diabetesDuration || "--")}'],
    [/\$\{c\.patient\?\.centre \? c\.patient\.centre\.split\('—'\)\[0\] : '--'\}/g, '${window.tData(c.patient?.centre ? c.patient.centre.split("—")[0].trim() : "--")}']
]);

