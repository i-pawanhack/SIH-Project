const fs = require('fs');
const path = 'c:\\Users\\ASUS\\Desktop\\SIH Final\\src\\components\\ScreeningWizard.js';
let content = fs.readFileSync(path, 'utf8');

// Replace select options
content = content.replace(/>Newly Diagnosed</g, '>${window.t("wiz.s1.newlyDiagnosed")}<');
content = content.replace(/>1 - 5 Years</g, '>${window.t("wiz.s1.oneToFive")}<');
content = content.replace(/>6 - 10 Years</g, '>${window.t("wiz.s1.sixToTen")}<');
content = content.replace(/>11 - 20 Years</g, '>${window.t("wiz.s1.elevenToTwenty")}<');
content = content.replace(/>20 Years"/g, '>${window.t("wiz.s1.moreThanTwenty")}"');

// Wait, the select option syntax is <option value="Newly Diagnosed">Newly Diagnosed</option>
// Wait, the replacement above for >20 Years is flawed. Let's do it carefully.
content = content.replace(/<option value="Newly Diagnosed">Newly Diagnosed<\/option>/g, '<option value="Newly Diagnosed">${window.t("wiz.s1.newlyDiagnosed")}</option>');
content = content.replace(/<option value="1 - 5 Years">1 - 5 Years<\/option>/g, '<option value="1 - 5 Years">${window.t("wiz.s1.oneToFive")}</option>');
content = content.replace(/<option value="6 - 10 Years">6 - 10 Years<\/option>/g, '<option value="6 - 10 Years">${window.t("wiz.s1.sixToTen")}</option>');
content = content.replace(/<option value="11 - 20 Years">11 - 20 Years<\/option>/g, '<option value="11 - 20 Years">${window.t("wiz.s1.elevenToTwenty")}</option>');
content = content.replace(/<option value="> 20 Years"([^>]*)>> 20 Years<\/option>/g, '<option value="> 20 Years"$1>${window.t("wiz.s1.moreThanTwenty")}</option>');

// Select option defaults
content = content.replace(/>Select Gender\.\.\.</g, '>${window.t("wiz.s1.genderSelect")}<');
content = content.replace(/>Select Duration\.\.\.</g, '>${window.t("wiz.s1.durationSelect")}<');
content = content.replace(/>Select Status\.\.\.</g, '>${window.t("wiz.s1.statusSelect")}<');

// Type 1, Type 2 etc.
content = content.replace(/>Type 2 Diabetes</g, '>${window.t("wiz.s1.type2")}<');
content = content.replace(/>Type 1 Diabetes</g, '>${window.t("wiz.s1.type1")}<');
content = content.replace(/>Gestational Diabetes</g, '>${window.t("wiz.s1.gestational")}<');
content = content.replace(/>Pre-diabetic</g, '>${window.t("wiz.s1.prediabetic")}<');

// Eye Detected
content = content.replace(/'Eye Detected - Capturing\.\.\.'/g, 'window.t("wiz.s2.capturing")');

// Breadcrumb
content = content.replace(/Upload \-&gt; Quality Check \-&gt; Enhancement \-&gt; AI Pipeline/g, '${window.t("wiz.s2.uploadBreadcrumb")}');

// Write back
fs.writeFileSync(path, content, 'utf8');
console.log('Patched ScreeningWizard.js');
