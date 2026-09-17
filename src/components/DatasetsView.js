/**
 * RetinaXAI — Datasets & Real AI Model Integration Architecture Component
 * Documents supported benchmark datasets and modular Python/MATLAB/PyTorch API endpoints.
 */

export function renderDatasetsView(container) {
  container.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
      <div>
        <h1 style="font-size:1.75rem; color:var(--slate-900);" data-i18n="data.title">${window.t('data.title')}</h1>
        <p style="color:var(--slate-600); font-size:0.875rem; margin-top:0.25rem;" data-i18n="data.desc">
          ${window.t('data.desc')}
        </p>
      </div>

      <div style="display:flex; gap:0.5rem;">
        <span class="badge" style="background:#dcfce7; color:#15803d; padding:0.4rem 0.8rem; font-size:0.8125rem;" data-i18n="data.readyBadge">
          ${window.t('data.readyBadge')}
        </span>
      </div>
    </div>

    <!-- Supported Medical Datasets Grid -->
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1.25rem; margin-bottom:1.75rem;">
      
      <!-- APTOS 2019 -->
      <div class="card">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.5rem;">
          <h3 style="font-size:1rem; color:var(--slate-900);" data-i18n="data.aptosTitle">${window.t('data.aptosTitle')}</h3>
          <span class="badge" style="background:#e0f2fe; color:#0369a1; font-size:0.7rem;" data-i18n="data.aptosBadge">${window.t('data.aptosBadge')}</span>
        </div>
        <div style="font-size:0.8125rem; color:var(--slate-600); line-height:1.5;" data-i18n="data.aptosDesc">
          ${window.t('data.aptosDesc')}
        </div>
        <div style="margin-top:0.75rem; font-size:0.75rem; color:var(--slate-500);">
          <strong data-i18n="data.role">${window.t('data.role')}</strong> <span data-i18n="data.aptosRole">${window.t('data.aptosRole')}</span>
        </div>
      </div>

      <!-- IDRiD -->
      <div class="card">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.5rem;">
          <h3 style="font-size:1rem; color:var(--slate-900);" data-i18n="data.idridTitle">${window.t('data.idridTitle')}</h3>
          <span class="badge" style="background:#fef3c7; color:#b45309; font-size:0.7rem;" data-i18n="data.idridBadge">${window.t('data.idridBadge')}</span>
        </div>
        <div style="font-size:0.8125rem; color:var(--slate-600); line-height:1.5;" data-i18n="data.idridDesc">
          ${window.t('data.idridDesc')}
        </div>
        <div style="margin-top:0.75rem; font-size:0.75rem; color:var(--slate-500);">
          <strong data-i18n="data.role">${window.t('data.role')}</strong> <span data-i18n="data.idridRole">${window.t('data.idridRole')}</span>
        </div>
      </div>

      <!-- DRIVE -->
      <div class="card">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.5rem;">
          <h3 style="font-size:1rem; color:var(--slate-900);" data-i18n="data.driveTitle">${window.t('data.driveTitle')}</h3>
          <span class="badge" style="background:#dcfce7; color:#15803d; font-size:0.7rem;" data-i18n="data.driveBadge">${window.t('data.driveBadge')}</span>
        </div>
        <div style="font-size:0.8125rem; color:var(--slate-600); line-height:1.5;" data-i18n="data.driveDesc">
          ${window.t('data.driveDesc')}
        </div>
        <div style="margin-top:0.75rem; font-size:0.75rem; color:var(--slate-500);">
          <strong data-i18n="data.role">${window.t('data.role')}</strong> <span data-i18n="data.driveRole">${window.t('data.driveRole')}</span>
        </div>
      </div>

      <!-- Messidor-2 -->
      <div class="card">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.5rem;">
          <h3 style="font-size:1rem; color:var(--slate-900);" data-i18n="data.messidorTitle">${window.t('data.messidorTitle')}</h3>
          <span class="badge" style="background:#f1f5f9; color:#475569; font-size:0.7rem;" data-i18n="data.messidorBadge">${window.t('data.messidorBadge')}</span>
        </div>
        <div style="font-size:0.8125rem; color:var(--slate-600); line-height:1.5;" data-i18n="data.messidorDesc">
          ${window.t('data.messidorDesc')}
        </div>
        <div style="margin-top:0.75rem; font-size:0.75rem; color:var(--slate-500);">
          <strong data-i18n="data.role">${window.t('data.role')}</strong> <span data-i18n="data.messidorRole">${window.t('data.messidorRole')}</span>
        </div>
      </div>

    </div>

    <!-- Modular Backend API Integration Specifications -->
    <div class="card" style="margin-bottom:1.5rem;">
      <div class="card-header">
        <h3 class="card-title">
          <i data-lucide="code" style="width:20px;height:20px; color:var(--primary-600);"></i>
          <span data-i18n="data.apiTitle">${window.t('data.apiTitle')}</span>
        </h3>
        <span class="badge" style="background:#f1f5f9; color:#334155; font-family:var(--font-mono);">src/services/aiService.js</span>
      </div>

      <p style="font-size:0.8125rem; color:var(--slate-600); margin-bottom:1rem;" data-i18n="data.apiDesc">
        ${window.t('data.apiDesc')}
      </p>

      <pre style="background:var(--slate-900); color:#38bdf8; padding:1.25rem; border-radius:var(--radius-md); font-family:var(--font-mono); font-size:0.8125rem; overflow-x:auto; line-height:1.6;">
// Modular Python/PyTorch API Service Endpoint Example
POST /api/v1/retinaxai/analyze
Content-Type: multipart/form-data

Payload:
  - image: [raw fundus image file]
  - patient_id: "PT-IND-8941"
  - return_gradcam: true
  - enhance_clahe: true

JSON Response:
{
  "status": "SUCCESS",
  "quality": {
    "status": "ACCEPTABLE",
    "score": 94.2,
    "focus": "Good",
    "illumination": "Good"
  },
  "prediction": {
    "dr_stage": 2,
    "dr_label": "Moderate NPDR",
    "referable": true,
    "confidence": 0.918
  },
  "explainability": {
    "gradcam_heatmap_url": "/static/heatmaps/cam_PT8941.png",
    "evidence_regions": [
      { "type": "Microaneurysm", "relevance": 0.88, "quadrant": "Superior Temporal" },
      { "type": "Hard Exudate", "relevance": 0.94, "quadrant": "Paracentral Fovea" }
    ]
  }
}
      </pre>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
}
