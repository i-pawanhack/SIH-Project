const fs = require('fs');

const componentsDir = 'c:\\Users\\ASUS\\Desktop\\SIH Final\\src\\components';
const filesToPatch = [
    'DashboardView.js',
    'ScreeningHistoryView.js',
    'RuralModeView.js',
    'ReportModal.js',
    'AnalyticsView.js'
];

filesToPatch.forEach(file => {
    const filePath = `${componentsDir}\\${file}`;
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace `Level ${c.stage}` with `${window.t('dash.l' + c.stage + '_short')}`
    content = content.replace(/Level \$\{([^\}]+)\}/g, '${window.t("dash.l" + $1 + "_short")}');

    // Replace AIIMS Tele-Retina Hub
    content = content.replace(/'AIIMS Tele-Retina Hub'/g, 'window.t("report.aiimsHub")');
    content = content.replace(/>AIIMS Tele-Retina Hub</g, '>${window.t("report.aiimsHub")}<');

    // For RuralModeView, technical specs
    if (file === 'RuralModeView.js') {
        content = content.replace(/>RetinaCam 45D Pro \(USB 3\.0\)</g, '>${window.t("rural.specs.camera")}<');
        content = content.replace(/>2048 x 1536 \(Sub-sampled 512x\)</g, '>${window.t("rural.specs.res")}<');
        content = content.replace(/>Infrared \+ White LED Flash</g, '>${window.t("rural.specs.illum")}<');
        content = content.replace(/>Active Auto-Alignment</g, '>${window.t("rural.specs.pupil")}<');
        content = content.replace(/>TensorFlow Lite \/ ONNX Edge</g, '>${window.t("rural.specs.model")}<');
        content = content.replace(/>INT8 Optimized</g, '>${window.t("rural.specs.quant")}<');
        content = content.replace(/>142 ms</g, '>${window.t("rural.specs.runtime")}<');
        content = content.replace(/>18\.4 MB \(EfficientNet Backbone\)</g, '>${window.t("rural.specs.size")}<');
        content = content.replace(/>Cellular Telemetry Sync</g, '>${window.t("rural.specs.telemetry")}<');
        content = content.replace(/>Store-and-Forward HTTPS</g, '>${window.t("rural.specs.https")}<');
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Patched ${file}`);
});
