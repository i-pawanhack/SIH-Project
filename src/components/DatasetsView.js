/**
 * RetinaXAI — Datasets & Real AI Model Integration Architecture Component
 * Documents supported benchmark datasets and modular Python/MATLAB/PyTorch API endpoints.
 */

export function renderDatasetsView(container) {
  container.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
      <div>
        <h1 style="font-size:1.75rem; color:var(--slate-900);">AI Model Architecture & Dataset Compatibility</h1>
        <p style="color:var(--slate-600); font-size:0.875rem; margin-top:0.25rem;">
          Production-ready modular service contracts for connecting PyTorch, TensorFlow, or MATLAB Deep Learning backends.
        </p>
      </div>

      <div style="display:flex; gap:0.5rem;">
        <span class="badge" style="background:#dcfce7; color:#15803d; padding:0.4rem 0.8rem; font-size:0.8125rem;">
          REST / WebSocket Interface Ready
        </span>
      </div>
    </div>

    <!-- Supported Medical Datasets Grid -->
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1.25rem; margin-bottom:1.75rem;">
      
      <!-- APTOS 2019 -->
      <div class="card">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.5rem;">
          <h3 style="font-size:1rem; color:var(--slate-900);">APTOS 2019 Blindness Detection</h3>
          <span class="badge" style="background:#e0f2fe; color:#0369a1; font-size:0.7rem;">Classification</span>
        </div>
        <div style="font-size:0.8125rem; color:var(--slate-600); line-height:1.5;">
          3,662 clinical fundus images graded on the 5-point International Clinical Diabetic Retinopathy (ICDR) scale (Levels 0–4).
        </div>
        <div style="margin-top:0.75rem; font-size:0.75rem; color:var(--slate-500);">
          <strong>Role in RetinaXAI:</strong> Global multi-class severity feature extraction and classification head.
        </div>
      </div>

      <!-- IDRiD -->
      <div class="card">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.5rem;">
          <h3 style="font-size:1rem; color:var(--slate-900);">IDRiD (Indian Retinal Dataset)</h3>
          <span class="badge" style="background:#fef3c7; color:#b45309; font-size:0.7rem;">Lesion Segmentation</span>
        </div>
        <div style="font-size:0.8125rem; color:var(--slate-600); line-height:1.5;">
          516 retinal images acquired from eye clinics in India with pixel-level ground truth for microaneurysms, hemorrhages, hard and soft exudates.
        </div>
        <div style="margin-top:0.75rem; font-size:0.75rem; color:var(--slate-500);">
          <strong>Role in RetinaXAI:</strong> Specialized Indian demographic adaptation & lesion localization explainability.
        </div>
      </div>

      <!-- DRIVE -->
      <div class="card">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.5rem;">
          <h3 style="font-size:1rem; color:var(--slate-900);">DRIVE Retinal Vessel Dataset</h3>
          <span class="badge" style="background:#dcfce7; color:#15803d; font-size:0.7rem;">Vessel Arcades</span>
        </div>
        <div style="font-size:0.8125rem; color:var(--slate-600); line-height:1.5;">
          40 calibrated fundus images with manual pixel segmentations of retinal blood vessels, arterioles, and venules.
        </div>
        <div style="margin-top:0.75rem; font-size:0.75rem; color:var(--slate-500);">
          <strong>Role in RetinaXAI:</strong> Retinal vasculature calibration, caliber tracking, and quality assurance.
        </div>
      </div>

      <!-- Messidor-2 -->
      <div class="card">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.5rem;">
          <h3 style="font-size:1rem; color:var(--slate-900);">Messidor-2 Clinical Validation</h3>
          <span class="badge" style="background:#f1f5f9; color:#475569; font-size:0.7rem;">Validation</span>
        </div>
        <div style="font-size:0.8125rem; color:var(--slate-600); line-height:1.5;">
          1,748 macula-centered fundus examinations utilized for external generalization benchmarking.
        </div>
        <div style="margin-top:0.75rem; font-size:0.75rem; color:var(--slate-500);">
          <strong>Role in RetinaXAI:</strong> Cross-camera and multi-site generalization testing without overfitting.
        </div>
      </div>

    </div>

    <!-- Modular Backend API Integration Specifications -->
    <div class="card" style="margin-bottom:1.5rem;">
      <div class="card-header">
        <h3 class="card-title">
          <i data-lucide="code" style="width:20px;height:20px; color:var(--primary-600);"></i>
          Modular AI Backend Integration Interface
        </h3>
        <span class="badge" style="background:#f1f5f9; color:#334155; font-family:var(--font-mono);">src/services/aiService.js</span>
      </div>

      <p style="font-size:0.8125rem; color:var(--slate-600); margin-bottom:1rem;">
        The frontend is engineered with complete modular isolation. To replace the prototype engine with a live PyTorch / FastAPI / MATLAB service, simply point the API client to your backend server:
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
