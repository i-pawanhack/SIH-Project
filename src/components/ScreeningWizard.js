/**
 * RetinaXAI — End-to-End Clinical Screening Wizard Component
 * Implements the full connected workflow:
 * Intake -> Upload -> Quality Check -> Enhancement -> AI Pipeline -> DR Result -> Grad-CAM -> Evidence -> Report/Tele-Review
 */

import { ImageProcessor } from '../services/imageProcessor.js';
import { AIService } from '../services/aiService.js';
import { StorageService } from '../services/storageService.js';
import { SCREENING_CENTRES, DR_SEVERITY_LEVELS } from '../types.js';

export function renderScreeningWizard(container, onCompleteScreening, onOpenReport) {
  // Wizard State
  let currentStep = 1; // 1: Patient, 2: Upload, 3: Quality, 4: Enhancement, 5: Pipeline, 6: Diagnostic Results
  let isUngradableCase = false;
  let selectedStage = 2; // Default Moderate NPDR for demo
  let rawImageDataUrl = null;
  let enhancedImageDataUrl = null;
  let gradCamDataUrl = null;
  let qualityResult = null;
  let aiDiagnosticResult = null;
  let heatmapOpacity = 0.65;
  let activeOverlayLayer = 'overlay'; // 'original', 'heatmap', 'overlay', 'structures'

  let patientData = {
    id: `PT-IND-${Math.floor(1000 + Math.random() * 9000)}`,
    name: 'Savitri Devi',
    age: 56,
    gender: 'Female',
    diabetesDuration: '9 Years',
    diabetesStatus: 'Type 2 Diabetes',
    centre: SCREENING_CENTRES[0],
    contact: '+91 98765 01234'
  };

  function updateView() {
    container.innerHTML = `
      <!-- Stepper Header -->
      <div class="wizard-stepper">
        <div class="wizard-step ${currentStep === 1 ? 'active' : (currentStep > 1 ? 'completed' : '')}">
          <div class="wizard-step-number">1</div>
          <span>Patient Intake</span>
        </div>
        <div class="wizard-connector"></div>

        <div class="wizard-step ${currentStep === 2 ? 'active' : (currentStep > 2 ? 'completed' : '')}">
          <div class="wizard-step-number">2</div>
          <span>Fundus Capture</span>
        </div>
        <div class="wizard-connector"></div>

        <div class="wizard-step ${currentStep === 3 ? 'active' : (currentStep > 3 ? 'completed' : '')}">
          <div class="wizard-step-number">3</div>
          <span>Quality Check</span>
        </div>
        <div class="wizard-connector"></div>

        <div class="wizard-step ${currentStep === 4 ? 'active' : (currentStep > 4 ? 'completed' : '')}">
          <div class="wizard-step-number">4</div>
          <span>Enhancement</span>
        </div>
        <div class="wizard-connector"></div>

        <div class="wizard-step ${currentStep === 5 ? 'active' : (currentStep > 5 ? 'completed' : '')}">
          <div class="wizard-step-number">5</div>
          <span>AI Analysis</span>
        </div>
        <div class="wizard-connector"></div>

        <div class="wizard-step ${currentStep === 6 ? 'active' : ''}">
          <div class="wizard-step-number">6</div>
          <span>Explainable Results</span>
        </div>
      </div>

      <!-- Step Body Content -->
      <div id="wizard-body-container"></div>
    `;

    const body = container.querySelector('#wizard-body-container');
    if (currentStep === 1) renderStep1(body);
    else if (currentStep === 2) renderStep2(body);
    else if (currentStep === 3) renderStep3(body);
    else if (currentStep === 4) renderStep4(body);
    else if (currentStep === 5) renderStep5(body);
    else if (currentStep === 6) renderStep6(body);

    if (window.lucide) window.lucide.createIcons();
  }

  // STEP 1: PATIENT REGISTRATION FORM & PRESET SELECTOR
  function renderStep1(target) {
    target.innerHTML = `
      <div class="card" style="max-width:850px; margin:0 auto;">
        <div class="card-header">
          <div>
            <h2 class="card-title">
              <i data-lucide="user-plus" style="width:22px;height:22px; color:var(--primary-600);"></i>
              Step 1: Patient Demographic & Clinical Intake
            </h2>
            <p style="font-size:0.8125rem; color:var(--slate-500); margin-top:0.25rem;">
              Enter patient details or select a pre-configured clinical case preset for demonstration.
            </p>
          </div>

          <!-- Quick Preset Demo Buttons -->
          <div style="display:flex; align-items:center; gap:0.4rem; flex-wrap:wrap;">
            <span style="font-size:0.75rem; font-weight:700; color:var(--slate-500);">PRESETS:</span>
            <button class="btn btn-secondary btn-sm preset-btn" data-stage="0" data-ungradable="false">Level 0</button>
            <button class="btn btn-secondary btn-sm preset-btn" data-stage="1" data-ungradable="false">Level 1</button>
            <button class="btn btn-secondary btn-sm preset-btn" data-stage="2" data-ungradable="false" style="border-color:var(--primary-500); background:var(--primary-50); color:var(--primary-800); font-weight:700;">Level 2 (Referable)</button>
            <button class="btn btn-secondary btn-sm preset-btn" data-stage="3" data-ungradable="false">Level 3</button>
            <button class="btn btn-secondary btn-sm preset-btn" data-stage="4" data-ungradable="false">Level 4 (PDR)</button>
            <button class="btn btn-secondary btn-sm preset-btn" data-stage="2" data-ungradable="true" style="color:#b91c1c;">Ungradable</button>
          </div>
        </div>

        <form id="patient-form" class="form-grid" style="margin-bottom:1.75rem;">
          <div class="form-group">
            <label class="form-label">Patient ID</label>
            <input type="text" id="p-id" class="form-input" value="${patientData.id}" required>
          </div>

          <div class="form-group">
            <label class="form-label">Full Patient Name</label>
            <input type="text" id="p-name" class="form-input" value="${patientData.name}" required>
          </div>

          <div class="form-group">
            <label class="form-label">Age (Years)</label>
            <input type="number" id="p-age" class="form-input" value="${patientData.age}" min="1" max="120" required>
          </div>

          <div class="form-group">
            <label class="form-label">Biological Gender</label>
            <select id="p-gender" class="form-select">
              <option value="Female" ${patientData.gender === 'Female' ? 'selected' : ''}>Female</option>
              <option value="Male" ${patientData.gender === 'Male' ? 'selected' : ''}>Male</option>
              <option value="Other" ${patientData.gender === 'Other' ? 'selected' : ''}>Other</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Known Diabetes Duration</label>
            <select id="p-duration" class="form-select">
              <option value="Newly Diagnosed (< 1 yr)">Newly Diagnosed (< 1 yr)</option>
              <option value="1 - 5 Years">1 - 5 Years</option>
              <option value="6 - 10 Years" selected>6 - 10 Years</option>
              <option value="11 - 20 Years">11 - 20 Years</option>
              <option value="> 20 Years">> 20 Years</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Diabetes Clinical Status</label>
            <select id="p-status" class="form-select">
              <option value="Type 2 Diabetes" selected>Type 2 Diabetes</option>
              <option value="Type 1 Diabetes">Type 1 Diabetes</option>
              <option value="Gestational Diabetes">Gestational Diabetes</option>
              <option value="Pre-diabetic">Pre-diabetic</option>
            </select>
          </div>

          <div class="form-group" style="grid-column:1 / -1;">
            <label class="form-label">Rural Screening Centre</label>
            <select id="p-centre" class="form-select">
              ${SCREENING_CENTRES.map(c => `<option value="${c}" ${patientData.centre === c ? 'selected' : ''}>${c}</option>`).join('')}
            </select>
          </div>
        </form>

        <div style="display:flex; justify-content:flex-end; gap:0.75rem; border-top:1px solid var(--border-card); padding-top:1.25rem;">
          <button type="button" class="btn btn-primary btn-lg" id="step1-next-btn">
            Proceed to Retinal Image Capture
            <i data-lucide="arrow-right" style="width:18px;height:18px;"></i>
          </button>
        </div>
      </div>
    `;

    // Handle Presets
    target.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedStage = parseInt(btn.getAttribute('data-stage'), 10);
        isUngradableCase = btn.getAttribute('data-ungradable') === 'true';

        target.querySelectorAll('.preset-btn').forEach(b => {
          b.style.borderColor = 'var(--border-card)';
          b.style.background = 'white';
          b.style.fontWeight = '500';
        });
        btn.style.borderColor = 'var(--primary-600)';
        btn.style.background = 'var(--primary-50)';
        btn.style.fontWeight = '700';
      });
    });

    target.querySelector('#step1-next-btn').addEventListener('click', () => {
      patientData.id = target.querySelector('#p-id').value;
      patientData.name = target.querySelector('#p-name').value;
      patientData.age = target.querySelector('#p-age').value;
      patientData.gender = target.querySelector('#p-gender').value;
      patientData.diabetesDuration = target.querySelector('#p-duration').value;
      patientData.diabetesStatus = target.querySelector('#p-status').value;
      patientData.centre = target.querySelector('#p-centre').value;

      currentStep = 2;
      updateView();
    });
  }

  // STEP 2: IMAGE UPLOAD & FUNDUS CAMERA CAPTURE
  function renderStep2(target) {
    if (!rawImageDataUrl) {
      rawImageDataUrl = ImageProcessor.generateFundusImage(selectedStage, isUngradableCase);
    }

    target.innerHTML = `
      <div class="card" style="max-width:850px; margin:0 auto;">
        <div class="card-header">
          <div>
            <h2 class="card-title">
              <i data-lucide="camera" style="width:22px;height:22px; color:var(--primary-600);"></i>
              Step 2: Retinal Fundus Image Acquisition
            </h2>
            <p style="font-size:0.8125rem; color:var(--slate-500); margin-top:0.25rem;">
              Capture image using connected portable fundus camera or upload standard macular-centered fundus photograph (.JPG, .JPEG, .PNG).
            </p>
          </div>
          <span class="badge" style="background:#e0f2fe; color:#0369a1;">
            Patient: ${patientData.name} (${patientData.id})
          </span>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:1.5rem; margin-bottom:1.5rem;">
          <!-- Dropzone & File Picker -->
          <div>
            <div class="upload-dropzone" id="fundus-dropzone">
              <div class="upload-icon-circle">
                <i data-lucide="upload-cloud" style="width:32px;height:32px;"></i>
              </div>
              <div>
                <div style="font-weight:700; color:var(--slate-900); font-size:1rem; margin-bottom:0.25rem;">
                  Drag & Drop Retinal Image Here
                </div>
                <div style="font-size:0.8125rem; color:var(--slate-500);">
                  Supports standard 45° macular and optic disc fields
                </div>
              </div>

              <input type="file" id="fundus-file-input" accept="image/jpeg,image/png,image/jpg" style="display:none;">
              <button type="button" class="btn btn-secondary btn-sm" id="browse-files-btn">
                <i data-lucide="folder-open" style="width:14px;height:14px;"></i>
                Browse Local Files
              </button>
            </div>

            <!-- Live Camera Button -->
            <div style="margin-top:1rem; display:flex; gap:0.5rem;">
              <button class="btn btn-secondary" id="camera-capture-btn" style="flex:1;">
                <i data-lucide="camera" style="width:16px;height:16px;"></i>
                Connect USB Fundus Camera
              </button>
              <button class="btn btn-secondary" id="regen-preset-btn" title="Reload Stage Preset">
                <i data-lucide="refresh-cw" style="width:16px;height:16px;"></i>
                Preset
              </button>
            </div>
          </div>

          <!-- Live Image Preview Card -->
          <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; background:var(--slate-900); border-radius:var(--radius-xl); padding:1rem; position:relative;">
            <div style="position:relative; width:280px; height:280px; border-radius:var(--radius-lg); overflow:hidden; border:2px solid rgba(255,255,255,0.2);">
              <img id="preview-fundus-img" src="${rawImageDataUrl}" alt="Fundus Preview" style="width:100%; height:100%; object-fit:contain; background:#000;">
              ${isUngradableCase ? `
                <div style="position:absolute; top:10px; left:10px; background:rgba(239,68,68,0.9); color:white; font-size:0.75rem; font-weight:700; padding:0.25rem 0.6rem; border-radius:var(--radius-full);">
                  <i data-lucide="alert-triangle" style="width:12px;height:12px; display:inline-block; vertical-align:middle;"></i>
                  Simulated Blurry / Artifact Image
                </div>
              ` : ''}
            </div>
            <div style="color:var(--slate-300); font-size:0.75rem; margin-top:0.75rem; text-align:center;">
              Fundus Photograph Preview (512x512 RGB Standardized)
            </div>
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-card); padding-top:1.25rem;">
          <button class="btn btn-secondary" id="step2-prev-btn">
            <i data-lucide="arrow-left" style="width:16px;height:16px;"></i>
            Back
          </button>
          <button class="btn btn-primary btn-lg" id="step2-start-screening-btn">
            <i data-lucide="play-circle" style="width:20px;height:20px;"></i>
            START SCREENING PIPELINE
          </button>
        </div>
      </div>
    `;

    // Dropzone & File Handling
    const dropzone = target.querySelector('#fundus-dropzone');
    const fileInput = target.querySelector('#fundus-file-input');
    const browseBtn = target.querySelector('#browse-files-btn');
    const previewImg = target.querySelector('#preview-fundus-img');

    browseBtn.addEventListener('click', () => fileInput.click());
    dropzone.addEventListener('click', (e) => {
      if (e.target !== browseBtn) fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          rawImageDataUrl = evt.target.result;
          isUngradableCase = false;
          previewImg.src = rawImageDataUrl;
        };
        reader.readAsDataURL(file);
      }
    });

    // Camera Capture Simulation
    target.querySelector('#camera-capture-btn').addEventListener('click', () => {
      alert('Fundus Camera Connected: Capturing 45° Posterior Pole Macular Field...');
      rawImageDataUrl = ImageProcessor.generateFundusImage(selectedStage, isUngradableCase);
      previewImg.src = rawImageDataUrl;
    });

    target.querySelector('#regen-preset-btn').addEventListener('click', () => {
      rawImageDataUrl = ImageProcessor.generateFundusImage(selectedStage, isUngradableCase);
      previewImg.src = rawImageDataUrl;
    });

    target.querySelector('#step2-prev-btn').addEventListener('click', () => {
      currentStep = 1;
      updateView();
    });

    target.querySelector('#step2-start-screening-btn').addEventListener('click', () => {
      qualityResult = ImageProcessor.assessImageQuality(isUngradableCase);
      currentStep = 3;
      updateView();
    });
  }

  // STEP 3: IMAGE QUALITY ASSESSMENT
  function renderStep3(target) {
    const isUngradable = qualityResult.overall === 'UNGRADABLE';

    target.innerHTML = `
      <div class="card" style="max-width:900px; margin:0 auto;">
        <div class="card-header">
          <div>
            <h2 class="card-title">
              <i data-lucide="shield-check" style="width:22px;height:22px; color:var(--primary-600);"></i>
              Step 3: Retinal Image Quality Assessment
            </h2>
            <p style="font-size:0.8125rem; color:var(--slate-500); margin-top:0.25rem;">
              Evaluating optical focus, illumination uniformity, field of view coverage, and obscuring artifacts.
            </p>
          </div>
          <span class="badge ${isUngradable ? 'badge-quality-ungradable' : 'badge-quality-acceptable'}" style="font-size:0.875rem; padding:0.4rem 0.8rem;">
            IMAGE QUALITY: ${qualityResult.overall}
          </span>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:1.5rem; margin-bottom:1.5rem;">
          <!-- Left: Image View -->
          <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; background:#020617; border-radius:var(--radius-xl); padding:1rem;">
            <div style="width:280px; height:280px; border-radius:var(--radius-lg); overflow:hidden;">
              <img src="${rawImageDataUrl}" alt="Fundus Quality Scan" style="width:100%; height:100%; object-fit:contain;">
            </div>
            <div style="color:var(--slate-400); font-size:0.75rem; margin-top:0.5rem;">
              Quality Score: <strong>${qualityResult.overallScore} / 100</strong>
            </div>
          </div>

          <!-- Right: Multi-Factor Quality Indicators -->
          <div>
            <h4 style="font-size:0.9375rem; color:var(--slate-800); margin-bottom:0.75rem;">Quality Indicators:</h4>

            <div style="display:flex; flex-direction:column; gap:0.75rem;">
              <!-- Focus -->
              <div style="display:flex; justify-content:space-between; align-items:center; padding:0.6rem 0.85rem; background:var(--slate-50); border-radius:var(--radius-md); border:1px solid var(--border-subtle);">
                <div>
                  <div style="font-weight:700; font-size:0.8125rem; color:var(--slate-800);">Optical Focus / Sharpness</div>
                  <div style="font-size:0.75rem; color:var(--slate-500);">${qualityResult.focus.label}</div>
                </div>
                <span class="badge ${qualityResult.focus.status === 'Good' ? 'badge-quality-acceptable' : 'badge-quality-ungradable'}">
                  ${qualityResult.focus.status}
                </span>
              </div>

              <!-- Illumination -->
              <div style="display:flex; justify-content:space-between; align-items:center; padding:0.6rem 0.85rem; background:var(--slate-50); border-radius:var(--radius-md); border:1px solid var(--border-subtle);">
                <div>
                  <div style="font-weight:700; font-size:0.8125rem; color:var(--slate-800);">Illumination & Dynamic Range</div>
                  <div style="font-size:0.75rem; color:var(--slate-500);">${qualityResult.illumination.label}</div>
                </div>
                <span class="badge ${qualityResult.illumination.status === 'Good' ? 'badge-quality-acceptable' : 'badge-quality-ungradable'}">
                  ${qualityResult.illumination.status}
                </span>
              </div>

              <!-- Field of View -->
              <div style="display:flex; justify-content:space-between; align-items:center; padding:0.6rem 0.85rem; background:var(--slate-50); border-radius:var(--radius-md); border:1px solid var(--border-subtle);">
                <div>
                  <div style="font-weight:700; font-size:0.8125rem; color:var(--slate-800);">Field of View (FOV) Coverage</div>
                  <div style="font-size:0.75rem; color:var(--slate-500);">${qualityResult.fieldOfView.label}</div>
                </div>
                <span class="badge badge-quality-acceptable">
                  ${qualityResult.fieldOfView.status}
                </span>
              </div>

              <!-- Retinal Visibility -->
              <div style="display:flex; justify-content:space-between; align-items:center; padding:0.6rem 0.85rem; background:var(--slate-50); border-radius:var(--radius-md); border:1px solid var(--border-subtle);">
                <div>
                  <div style="font-weight:700; font-size:0.8125rem; color:var(--slate-800);">Retinal Landmark Visibility</div>
                  <div style="font-size:0.75rem; color:var(--slate-500);">${qualityResult.retinalVisibility.label}</div>
                </div>
                <span class="badge ${qualityResult.retinalVisibility.status === 'Good' ? 'badge-quality-acceptable' : 'badge-quality-ungradable'}">
                  ${qualityResult.retinalVisibility.status}
                </span>
              </div>

              <!-- Artifacts -->
              <div style="display:flex; justify-content:space-between; align-items:center; padding:0.6rem 0.85rem; background:var(--slate-50); border-radius:var(--radius-md); border:1px solid var(--border-subtle);">
                <div>
                  <div style="font-weight:700; font-size:0.8125rem; color:var(--slate-800);">Artifacts / Reflections</div>
                  <div style="font-size:0.75rem; color:var(--slate-500);">${qualityResult.artifacts.label}</div>
                </div>
                <span class="badge ${qualityResult.artifacts.status === 'Good' ? 'badge-quality-acceptable' : 'badge-quality-ungradable'}">
                  ${qualityResult.artifacts.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        ${isUngradable ? `
          <!-- UNGRADABLE ALERT BOX -->
          <div style="background:#fee2e2; border:1px solid #fca5a5; border-radius:var(--radius-lg); padding:1.25rem; margin-bottom:1.5rem;">
            <div style="display:flex; gap:0.75rem; align-items:flex-start;">
              <i data-lucide="alert-octagon" style="width:24px;height:24px; color:#b91c1c; flex-shrink:0; margin-top:2px;"></i>
              <div>
                <h4 style="color:#991b1b; font-size:1rem; margin-bottom:0.25rem;">IMAGE QUALITY: UNGRADABLE</h4>
                <p style="color:#7f1d1d; font-size:0.8125rem; margin-bottom:0.5rem;">
                  The AI screening system cannot generate a diabetic retinopathy prediction on this image because retinal microvasculature is obscured.
                </p>
                <div style="font-size:0.8125rem; font-weight:700; color:#991b1b;">Problems Detected:</div>
                <ul style="margin-left:1.25rem; color:#7f1d1d; font-size:0.8125rem; margin-top:0.25rem;">
                  ${qualityResult.problems.map(p => `<li>${p}</li>`).join('')}
                </ul>
                <div style="margin-top:0.75rem; font-size:0.8125rem; color:#991b1b;">
                  <strong>Recommendation:</strong> ${qualityResult.recommendation}
                </div>
              </div>
            </div>
          </div>
        ` : `
          <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:var(--radius-lg); padding:1rem; margin-bottom:1.5rem; display:flex; gap:0.75rem; align-items:center;">
            <i data-lucide="check-circle" style="width:20px;height:20px; color:#15803d;"></i>
            <span style="color:#166534; font-size:0.875rem;">
              <strong>Quality Check Passed:</strong> Retinal vessels, optic disc margins, and macular lutea are adequately resolved for diagnostic AI feature extraction.
            </span>
          </div>
        `}

        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-card); padding-top:1.25rem;">
          <button class="btn btn-secondary" id="step3-prev-btn">
            <i data-lucide="arrow-left" style="width:16px;height:16px;"></i>
            Recapture Image
          </button>

          ${isUngradable ? `
            <button class="btn btn-danger" id="step3-save-ungradable-btn">
              <i data-lucide="save" style="width:16px;height:16px;"></i>
              Log Ungradable Case & Request Recapture
            </button>
          ` : `
            <button class="btn btn-primary btn-lg" id="step3-next-btn">
              Proceed to Image Enhancement
              <i data-lucide="arrow-right" style="width:18px;height:18px;"></i>
            </button>
          `}
        </div>
      </div>
    `;

    target.querySelector('#step3-prev-btn').addEventListener('click', () => {
      currentStep = 2;
      updateView();
    });

    if (isUngradable) {
      target.querySelector('#step3-save-ungradable-btn').addEventListener('click', () => {
        const ungradableRecord = {
          id: `CASE-2026-${Math.floor(100 + Math.random() * 900)}`,
          patient: patientData,
          stage: 2,
          isUngradable: true,
          imageQuality: qualityResult,
          aiResult: null,
          rawImage: rawImageDataUrl,
          createdAt: new Date().toISOString(),
          doctorReview: {
            status: 'Pending',
            doctorGrade: 'UNGRADABLE',
            notes: 'Recapture requested due to blur.'
          }
        };
        StorageService.saveScreening(ungradableRecord);
        onCompleteScreening(ungradableRecord);
      });
    } else {
      target.querySelector('#step3-next-btn').addEventListener('click', async () => {
        enhancedImageDataUrl = await ImageProcessor.enhanceImage(rawImageDataUrl);
        currentStep = 4;
        updateView();
      });
    }
  }

  // STEP 4: IMAGE ENHANCEMENT (CLAHE / CONTRAST)
  function renderStep4(target) {
    let activeEnhanceView = 'enhanced'; // 'original', 'enhanced', 'comparison'

    target.innerHTML = `
      <div class="card" style="max-width:920px; margin:0 auto;">
        <div class="card-header">
          <div>
            <h2 class="card-title">
              <i data-lucide="sparkles" style="width:22px;height:22px; color:var(--primary-600);"></i>
              Step 4: Retinal Image Preprocessing & Enhancement
            </h2>
            <p style="font-size:0.8125rem; color:var(--slate-500); margin-top:0.25rem;">
              Applying Contrast-Limited Adaptive Histogram Equalization (CLAHE) and green-channel illumination normalization.
            </p>
          </div>

          <div style="display:flex; gap:0.4rem;">
            <button class="btn btn-secondary btn-sm enhance-toggle-btn" data-view="original">Original</button>
            <button class="btn btn-primary btn-sm enhance-toggle-btn" data-view="enhanced">Enhanced (CLAHE)</button>
            <button class="btn btn-secondary btn-sm enhance-toggle-btn" data-view="comparison">Side-by-Side</button>
          </div>
        </div>

        <!-- Visual Display Area -->
        <div id="enhance-visual-container" style="background:#020617; border-radius:var(--radius-xl); padding:1.5rem; margin-bottom:1.5rem; display:flex; justify-content:center; align-items:center; min-height:340px;">
          <!-- Injected dynamically -->
        </div>

        <!-- Processing Status Badges -->
        <div style="background:var(--slate-50); border:1px solid var(--border-card); border-radius:var(--radius-lg); padding:1rem; margin-bottom:1.5rem;">
          <div style="font-size:0.8125rem; font-weight:700; color:var(--slate-700); margin-bottom:0.5rem;">
            Preprocessing Pipeline Execution:
          </div>
          <div style="display:flex; flex-wrap:wrap; gap:0.75rem;">
            <span class="badge badge-quality-acceptable"><i data-lucide="check" style="width:12px;height:12px;"></i> Blur Assessment (Passed)</span>
            <span class="badge badge-quality-acceptable"><i data-lucide="check" style="width:12px;height:12px;"></i> Illumination Correction</span>
            <span class="badge badge-quality-acceptable"><i data-lucide="check" style="width:12px;height:12px;"></i> Green-Channel Contrast Boost</span>
            <span class="badge badge-quality-acceptable"><i data-lucide="check" style="width:12px;height:12px;"></i> CLAHE Equalization</span>
            <span class="badge badge-quality-acceptable"><i data-lucide="check" style="width:12px;height:12px;"></i> Noise Filtering</span>
          </div>
          <div style="font-size:0.75rem; color:var(--slate-500); margin-top:0.6rem; font-style:italic;">
            Prototype enhancement representation: Enhances microvascular contrast for downstream feature attribution.
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-card); padding-top:1.25rem;">
          <button class="btn btn-secondary" id="step4-prev-btn">
            <i data-lucide="arrow-left" style="width:16px;height:16px;"></i>
            Back
          </button>
          <button class="btn btn-primary btn-lg" id="step4-next-btn">
            <i data-lucide="cpu" style="width:18px;height:18px;"></i>
            Run AI Retinal Analysis
          </button>
        </div>
      </div>
    `;

    const visualContainer = target.querySelector('#enhance-visual-container');

    function updateEnhanceDisplay() {
      if (activeEnhanceView === 'original') {
        visualContainer.innerHTML = `
          <div style="text-align:center;">
            <div style="width:300px; height:300px; border-radius:var(--radius-lg); overflow:hidden; margin:0 auto 0.5rem;">
              <img src="${rawImageDataUrl}" style="width:100%; height:100%; object-fit:contain;">
            </div>
            <div style="color:var(--slate-400); font-size:0.75rem;">Original Raw Fundus Capture</div>
          </div>
        `;
      } else if (activeEnhanceView === 'enhanced') {
        visualContainer.innerHTML = `
          <div style="text-align:center;">
            <div style="width:300px; height:300px; border-radius:var(--radius-lg); overflow:hidden; margin:0 auto 0.5rem; border:2px solid var(--primary-500);">
              <img src="${enhancedImageDataUrl}" style="width:100%; height:100%; object-fit:contain;">
            </div>
            <div style="color:var(--primary-300); font-size:0.75rem; font-weight:700;">CLAHE Enhanced Image (Enhanced Capillaries & Exudates)</div>
          </div>
        `;
      } else {
        visualContainer.innerHTML = `
          <div style="display:flex; gap:1.5rem; justify-content:center; flex-wrap:wrap;">
            <div style="text-align:center;">
              <div style="width:240px; height:240px; border-radius:var(--radius-lg); overflow:hidden; margin-bottom:0.5rem;">
                <img src="${rawImageDataUrl}" style="width:100%; height:100%; object-fit:contain;">
              </div>
              <div style="color:var(--slate-400); font-size:0.75rem;">Original Image</div>
            </div>
            <div style="text-align:center;">
              <div style="width:240px; height:240px; border-radius:var(--radius-lg); overflow:hidden; margin-bottom:0.5rem; border:2px solid var(--primary-500);">
                <img src="${enhancedImageDataUrl}" style="width:100%; height:100%; object-fit:contain;">
              </div>
              <div style="color:var(--primary-300); font-size:0.75rem; font-weight:700;">CLAHE Enhanced</div>
            </div>
          </div>
        `;
      }
    }

    updateEnhanceDisplay();

    target.querySelectorAll('.enhance-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeEnhanceView = btn.getAttribute('data-view');
        target.querySelectorAll('.enhance-toggle-btn').forEach(b => {
          b.className = 'btn btn-secondary btn-sm enhance-toggle-btn';
        });
        btn.className = 'btn btn-primary btn-sm enhance-toggle-btn';
        updateEnhanceDisplay();
      });
    });

    target.querySelector('#step4-prev-btn').addEventListener('click', () => {
      currentStep = 3;
      updateView();
    });

    target.querySelector('#step4-next-btn').addEventListener('click', () => {
      currentStep = 5;
      updateView();
    });
  }

  // STEP 5: ANIMATED AI RETINAL ANALYSIS PIPELINE
  function renderStep5(target) {
    target.innerHTML = `
      <div class="card" style="max-width:750px; margin:0 auto; text-align:center; padding:2.5rem 1.5rem;">
        <div style="width:64px; height:64px; border-radius:var(--radius-full); background:var(--primary-50); color:var(--primary-600); display:flex; align-items:center; justify-content:center; margin:0 auto 1.25rem;">
          <i data-lucide="cpu" style="width:32px;height:32px;" class="animate-spin"></i>
        </div>

        <h2 style="font-size:1.5rem; color:var(--slate-900); margin-bottom:0.5rem;">
          Executing AI Retinal Diagnostic Pipeline
        </h2>
        <p style="font-size:0.875rem; color:var(--slate-600); max-width:500px; margin:0 auto 2rem;">
          Extracting spatial convolutional feature maps, segmenting vascular arcades, detecting lesion candidates, and generating Grad-CAM heatmaps.
        </p>

        <!-- Pipeline Stage Indicators -->
        <div style="max-width:520px; margin:0 auto; display:flex; flex-direction:column; gap:0.75rem; text-align:left;">
          <div class="pipe-item" id="p-step-1" style="display:flex; align-items:center; gap:0.75rem; padding:0.6rem 0.85rem; border-radius:var(--radius-md); background:var(--slate-50);">
            <i data-lucide="loader-2" class="animate-spin" style="width:16px;height:16px; color:var(--primary-600);"></i>
            <span style="font-size:0.8125rem; font-weight:600;">1. Standardizing Image Quality & Alignment</span>
          </div>

          <div class="pipe-item" id="p-step-2" style="display:flex; align-items:center; gap:0.75rem; padding:0.6rem 0.85rem; border-radius:var(--radius-md); background:var(--slate-50); opacity:0.5;">
            <i data-lucide="circle" style="width:16px;height:16px; color:var(--slate-400);"></i>
            <span style="font-size:0.8125rem; font-weight:600;">2. Localizing Optic Disc & Foveal Avascular Zone</span>
          </div>

          <div class="pipe-item" id="p-step-3" style="display:flex; align-items:center; gap:0.75rem; padding:0.6rem 0.85rem; border-radius:var(--radius-md); background:var(--slate-50); opacity:0.5;">
            <i data-lucide="circle" style="width:16px;height:16px; color:var(--slate-400);"></i>
            <span style="font-size:0.8125rem; font-weight:600;">3. Retinal Lesion Detection (Microaneurysms & Exudates)</span>
          </div>

          <div class="pipe-item" id="p-step-4" style="display:flex; align-items:center; gap:0.75rem; padding:0.6rem 0.85rem; border-radius:var(--radius-md); background:var(--slate-50); opacity:0.5;">
            <i data-lucide="circle" style="width:16px;height:16px; color:var(--slate-400);"></i>
            <span style="font-size:0.8125rem; font-weight:600;">4. ICDR Severity Classification & Referable Scoring</span>
          </div>

          <div class="pipe-item" id="p-step-5" style="display:flex; align-items:center; gap:0.75rem; padding:0.6rem 0.85rem; border-radius:var(--radius-md); background:var(--slate-50); opacity:0.5;">
            <i data-lucide="circle" style="width:16px;height:16px; color:var(--slate-400);"></i>
            <span style="font-size:0.8125rem; font-weight:600;">5. Synthesizing Grad-CAM Spatial Explainability Heatmap</span>
          </div>
        </div>
      </div>
    `;

    // Progressive Pipeline Animation
    const s1 = target.querySelector('#p-step-1');
    const s2 = target.querySelector('#p-step-2');
    const s3 = target.querySelector('#p-step-3');
    const s4 = target.querySelector('#p-step-4');
    const s5 = target.querySelector('#p-step-5');

    setTimeout(() => {
      s1.innerHTML = `<i data-lucide="check-circle-2" style="width:16px;height:16px; color:#10b981;"></i> <span style="font-size:0.8125rem; font-weight:700; color:#15803d;">1. Standardizing Image Quality (Completed)</span>`;
      s2.style.opacity = '1';
      s2.innerHTML = `<i data-lucide="loader-2" class="animate-spin" style="width:16px;height:16px; color:var(--primary-600);"></i> <span style="font-size:0.8125rem; font-weight:600;">2. Localizing Optic Disc & Fovea...</span>`;
      if (window.lucide) window.lucide.createIcons();
    }, 450);

    setTimeout(() => {
      s2.innerHTML = `<i data-lucide="check-circle-2" style="width:16px;height:16px; color:#10b981;"></i> <span style="font-size:0.8125rem; font-weight:700; color:#15803d;">2. Retinal Landmarks Segmented</span>`;
      s3.style.opacity = '1';
      s3.innerHTML = `<i data-lucide="loader-2" class="animate-spin" style="width:16px;height:16px; color:var(--primary-600);"></i> <span style="font-size:0.8125rem; font-weight:600;">3. Detecting Lesions & Hemorrhages...</span>`;
      if (window.lucide) window.lucide.createIcons();
    }, 900);

    setTimeout(() => {
      s3.innerHTML = `<i data-lucide="check-circle-2" style="width:16px;height:16px; color:#10b981;"></i> <span style="font-size:0.8125rem; font-weight:700; color:#15803d;">3. Lesions Candidate Regions Extracted</span>`;
      s4.style.opacity = '1';
      s4.innerHTML = `<i data-lucide="loader-2" class="animate-spin" style="width:16px;height:16px; color:var(--primary-600);"></i> <span style="font-size:0.8125rem; font-weight:600;">4. Computing ICDR Severity Scale...</span>`;
      if (window.lucide) window.lucide.createIcons();
    }, 1350);

    setTimeout(() => {
      s4.innerHTML = `<i data-lucide="check-circle-2" style="width:16px;height:16px; color:#10b981;"></i> <span style="font-size:0.8125rem; font-weight:700; color:#15803d;">4. DR Severity Classified</span>`;
      s5.style.opacity = '1';
      s5.innerHTML = `<i data-lucide="loader-2" class="animate-spin" style="width:16px;height:16px; color:var(--primary-600);"></i> <span style="font-size:0.8125rem; font-weight:600;">5. Synthesizing Grad-CAM Heatmap...</span>`;
      if (window.lucide) window.lucide.createIcons();
    }, 1750);

    setTimeout(() => {
      aiDiagnosticResult = AIService.evaluateClassification(selectedStage);
      gradCamDataUrl = AIService.generateGradCAMHeatmap(selectedStage);

      // Trigger Confetti for completing analysis
      if (window.confetti) {
        window.confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
      }

      currentStep = 6;
      updateView();
    }, 2200);
  }

  // STEP 6: EXPLAINABLE AI, GRAD-CAM VIEWER, EVIDENCE & ACTIONS
  function renderStep6(target) {
    const isReferable = aiDiagnosticResult.referable;
    const drMeta = DR_SEVERITY_LEVELS[aiDiagnosticResult.level];

    target.innerHTML = `
      <div style="display:grid; grid-template-columns:1fr; gap:1.5rem; max-width:1200px; margin:0 auto;">
        
        <!-- TOP SUMMARY CARD -->
        <div class="card" style="background:linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color:white; border:none;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:1rem;">
            <div>
              <div class="safety-pill" style="background:rgba(20,184,166,0.25); color:#2dd4bf; border-color:rgba(20,184,166,0.4); margin-bottom:0.5rem;">
                AI SCREENING RESULT COMPLETED
              </div>
              <h1 style="font-size:1.75rem; color:white; margin-bottom:0.25rem;">
                ${drMeta.title}
              </h1>
              <div style="color:#94a3b8; font-size:0.875rem;">
                Patient: <strong>${patientData.name}</strong> • ${patientData.id} • ${patientData.age}y (${patientData.gender}) • Centre: ${patientData.centre.split('—')[0]}
              </div>
            </div>

            <!-- Referral Status Banner -->
            <div style="text-align:right;">
              <div style="font-size:0.75rem; color:#94a3b8; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.25rem;">
                Referral Status
              </div>
              <span class="badge ${isReferable ? 'badge-referable-yes' : 'badge-referable-no'}" style="font-size:1.1rem; padding:0.4rem 1rem;">
                ${isReferable ? 'REFERABLE TO SPECIALIST' : 'NON-REFERABLE'}
              </span>
            </div>
          </div>
        </div>

        <!-- MAIN 2-COLUMN DIAGNOSTIC & EXPLAINABILITY INTERFACE -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(420px, 1fr)); gap:1.5rem;">
          
          <!-- LEFT: INTERACTIVE GRAD-CAM HEATMAP VIEWER -->
          <div class="card" style="display:flex; flex-direction:column;">
            <div class="card-header">
              <div>
                <h3 class="card-title">
                  <i data-lucide="layers" style="width:20px;height:20px; color:var(--primary-600);"></i>
                  Explainable AI (Grad-CAM Attention)
                </h3>
                <p style="font-size:0.75rem; color:var(--slate-500);">
                  Spatial gradient-weighted class activation mapping identifying decision evidence.
                </p>
              </div>

              <!-- Layer View Modes -->
              <div style="display:flex; gap:0.3rem;">
                <button class="btn btn-secondary btn-sm overlay-mode-btn" data-layer="original">Original</button>
                <button class="btn btn-secondary btn-sm overlay-mode-btn" data-layer="heatmap">Heatmap</button>
                <button class="btn btn-primary btn-sm overlay-mode-btn" data-layer="overlay">Overlay</button>
                <button class="btn btn-secondary btn-sm overlay-mode-btn" data-layer="structures">Structures</button>
              </div>
            </div>

            <!-- Fundus Canvas Viewport -->
            <div class="fundus-viewport-container" id="gradcam-viewport">
              <img id="layer-fundus-base" src="${enhancedImageDataUrl || rawImageDataUrl}" class="fundus-canvas-layer" alt="Base Fundus">
              <img id="layer-gradcam-heat" src="${gradCamDataUrl}" class="fundus-canvas-layer" alt="Grad-CAM Layer" style="opacity:${heatmapOpacity}; mix-blend-mode:screen;">
              
              <!-- SVG Anatomical Overlay Layer -->
              <svg id="layer-svg-structures" class="fundus-overlay-svg" viewBox="0 0 600 600" style="display:none;">
                <!-- Optic Disc Landmark -->
                <circle cx="${aiDiagnosticResult.landmarks.opticDisc.x}" cy="${aiDiagnosticResult.landmarks.opticDisc.y}" r="${aiDiagnosticResult.landmarks.opticDisc.radius}" stroke="#38bdf8" stroke-width="2.5" stroke-dasharray="4,4" fill="rgba(56, 189, 248, 0.15)" />
                <text x="${aiDiagnosticResult.landmarks.opticDisc.x - 35}" y="${aiDiagnosticResult.landmarks.opticDisc.y - 50}" fill="#38bdf8" font-size="12" font-weight="bold">Optic Disc</text>

                <!-- Fovea Landmark -->
                <circle cx="${aiDiagnosticResult.landmarks.fovea.x}" cy="${aiDiagnosticResult.landmarks.fovea.y}" r="${aiDiagnosticResult.landmarks.fovea.radius}" stroke="#facc15" stroke-width="2" stroke-dasharray="3,3" fill="rgba(250, 204, 21, 0.15)" />
                <text x="${aiDiagnosticResult.landmarks.fovea.x - 20}" y="${aiDiagnosticResult.landmarks.fovea.y - 35}" fill="#facc15" font-size="12" font-weight="bold">Fovea</text>
              </svg>
            </div>

            <!-- Heatmap Opacity & Controls Bar -->
            <div class="gradcam-controls-bar">
              <div class="slider-container">
                <i data-lucide="sliders" style="width:16px;height:16px; color:var(--primary-400);"></i>
                <span style="font-size:0.8125rem; font-weight:600;">Heatmap Opacity:</span>
                <input type="range" id="heatmap-opacity-slider" class="slider-input" min="0" max="1" step="0.05" value="${heatmapOpacity}">
                <span id="opacity-val-label" style="font-size:0.8125rem; font-family:var(--font-mono); width:36px;">${Math.round(heatmapOpacity * 100)}%</span>
              </div>
            </div>

            <div style="margin-top:0.75rem; font-size:0.75rem; color:var(--slate-500); line-height:1.4;">
              <strong>Explainability Note:</strong> Grad-CAM highlights retinal regions that contributed most strongly to the model's severity classification. It is decision-support visualization and does not by itself confirm isolated micro-lesions.
            </div>
          </div>

          <!-- RIGHT: SEVERITY, CONFIDENCE & CLINICAL EVIDENCE -->
          <div style="display:flex; flex-direction:column; gap:1.25rem;">
            
            <!-- Severity & Confidence Card -->
            <div class="card">
              <div class="card-header" style="margin-bottom:0.75rem;">
                <h3 class="card-title">
                  <i data-lucide="activity" style="width:20px;height:20px; color:var(--primary-600);"></i>
                  Diagnostic Classification
                </h3>
                <span class="badge ${drMeta.badgeClass}" style="font-size:0.8125rem;">
                  ${drMeta.shortName}
                </span>
              </div>

              <div style="display:flex; align-items:center; justify-content:space-between; background:var(--slate-50); padding:1rem; border-radius:var(--radius-md); border:1px solid var(--border-card); margin-bottom:1rem;">
                <div>
                  <div style="font-size:0.75rem; font-weight:700; color:var(--slate-500); text-transform:uppercase;">AI Model Confidence</div>
                  <div style="font-size:2.2rem; font-weight:800; font-family:var(--font-heading); color:var(--slate-900);">
                    ${aiDiagnosticResult.confidence}%
                  </div>
                  <div style="font-size:0.7rem; color:var(--slate-500);">Prototype Softmax Calibration</div>
                </div>
                <div style="text-align:right; max-width:220px;">
                  <div style="font-size:0.75rem; font-weight:700; color:var(--slate-500); text-transform:uppercase;">Clinical Scale</div>
                  <div style="font-size:0.875rem; font-weight:700; color:var(--slate-800);">${drMeta.title}</div>
                  <div style="font-size:0.75rem; color:var(--slate-500);">${drMeta.description}</div>
                </div>
              </div>

              <!-- Recommendation Block -->
              <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:var(--radius-md); padding:0.85rem;">
                <div style="display:flex; gap:0.5rem; align-items:flex-start;">
                  <i data-lucide="info" style="width:18px;height:18px; color:#1d4ed8; flex-shrink:0; margin-top:1px;"></i>
                  <div>
                    <div style="font-size:0.8125rem; font-weight:700; color:#1e40af;">Clinical Recommendation:</div>
                    <div style="font-size:0.8125rem; color:#1e3a8a; margin-top:0.15rem;">
                      ${drMeta.clinicalRecommendation}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Clinical Evidence Breakdown -->
            <div class="card" style="flex:1;">
              <div class="card-header" style="margin-bottom:0.75rem;">
                <h3 class="card-title">
                  <i data-lucide="microscope" style="width:20px;height:20px; color:var(--primary-600);"></i>
                  Localized Retinal Evidence
                </h3>
                <span class="badge" style="background:#f1f5f9; color:#475569; font-size:0.7rem;">Demo Evidence</span>
              </div>

              <div style="display:flex; flex-direction:column; gap:0.6rem;">
                ${aiDiagnosticResult.evidence.map(ev => `
                  <div style="padding:0.75rem; background:var(--slate-50); border:1px solid var(--border-subtle); border-radius:var(--radius-md);">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.25rem;">
                      <span style="font-weight:700; font-size:0.8125rem; color:var(--slate-900);">${ev.type}</span>
                      <span class="badge" style="background:#e0f2fe; color:#0369a1; font-size:0.6875rem;">Attribution: ${ev.relevance}%</span>
                    </div>
                    <div style="font-size:0.75rem; color:var(--slate-600);">
                      <strong>Region:</strong> ${ev.region}
                    </div>
                    <div style="font-size:0.75rem; color:var(--slate-500); margin-top:0.15rem;">
                      ${ev.description}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

          </div>
        </div>

        <!-- BOTTOM ACTION BUTTONS -->
        <div class="card" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
          <button class="btn btn-secondary" id="step6-restart-btn">
            <i data-lucide="rotate-ccw" style="width:16px;height:16px;"></i>
            New Screening
          </button>

          <div style="display:flex; gap:0.75rem; flex-wrap:wrap;">
            <button class="btn btn-secondary" id="step6-view-report-btn">
              <i data-lucide="printer" style="width:16px;height:16px;"></i>
              View & Print Full Report
            </button>
            <button class="btn btn-primary btn-lg" id="step6-send-doctor-btn">
              <i data-lucide="send" style="width:18px;height:18px;"></i>
              Send to Ophthalmologist Tele-Review
            </button>
          </div>
        </div>

      </div>
    `;

    // Connect Grad-CAM Layer Controls
    const layerFundus = target.querySelector('#layer-fundus-base');
    const layerGradcam = target.querySelector('#layer-gradcam-heat');
    const layerSvg = target.querySelector('#layer-svg-structures');
    const slider = target.querySelector('#heatmap-opacity-slider');
    const opacityLabel = target.querySelector('#opacity-val-label');

    slider.addEventListener('input', (e) => {
      heatmapOpacity = parseFloat(e.target.value);
      layerGradcam.style.opacity = heatmapOpacity;
      opacityLabel.textContent = `${Math.round(heatmapOpacity * 100)}%`;
    });

    target.querySelectorAll('.overlay-mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-layer');
        target.querySelectorAll('.overlay-mode-btn').forEach(b => b.className = 'btn btn-secondary btn-sm overlay-mode-btn');
        btn.className = 'btn btn-primary btn-sm overlay-mode-btn';

        if (mode === 'original') {
          layerGradcam.style.display = 'none';
          layerSvg.style.display = 'none';
        } else if (mode === 'heatmap') {
          layerGradcam.style.display = 'block';
          layerGradcam.style.opacity = '1';
          layerSvg.style.display = 'none';
        } else if (mode === 'overlay') {
          layerGradcam.style.display = 'block';
          layerGradcam.style.opacity = heatmapOpacity;
          layerSvg.style.display = 'none';
        } else if (mode === 'structures') {
          layerGradcam.style.display = 'none';
          layerSvg.style.display = 'block';
        }
      });
    });

    // Create Complete Saved Screening Record
    const screeningRecord = {
      id: `CASE-2026-${Math.floor(100 + Math.random() * 900)}`,
      patient: patientData,
      stage: selectedStage,
      isUngradable: false,
      imageQuality: qualityResult,
      aiResult: aiDiagnosticResult,
      rawImage: rawImageDataUrl,
      enhancedImage: enhancedImageDataUrl,
      gradCamImage: gradCamDataUrl,
      createdAt: new Date().toISOString(),
      doctorReview: {
        status: 'Pending',
        doctorGrade: null,
        notes: ''
      }
    };

    // Save record to local store
    StorageService.saveScreening(screeningRecord);

    target.querySelector('#step6-restart-btn').addEventListener('click', () => {
      currentStep = 1;
      rawImageDataUrl = null;
      enhancedImageDataUrl = null;
      gradCamDataUrl = null;
      updateView();
    });

    target.querySelector('#step6-view-report-btn').addEventListener('click', () => {
      onOpenReport(screeningRecord);
    });

    target.querySelector('#step6-send-doctor-btn').addEventListener('click', () => {
      alert(`Case ${screeningRecord.id} successfully queued for Tele-Ophthalmology review!`);
      onCompleteScreening(screeningRecord);
    });
  }

  // Initial render
  updateView();
}
