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
    id: '',
    name: '',
    age: '',
    gender: '',
    diabetesDuration: '',
    diabetesStatus: '',
    centre: '',
    contact: ''
  };

  function updateView() {
    container.innerHTML = `
      <!-- Stepper Header -->
      <div class="wizard-stepper">
        <div class="wizard-step ${currentStep === 1 ? 'active' : (currentStep > 1 ? 'completed' : '')}">
          <div class="wizard-step-number">1</div>
          <span data-i18n="wiz.step1">${window.t('wiz.step1')}</span>
        </div>
        <div class="wizard-connector"></div>

        <div class="wizard-step ${currentStep === 2 ? 'active' : (currentStep > 2 ? 'completed' : '')}">
          <div class="wizard-step-number">2</div>
          <span data-i18n="wiz.step2">${window.t('wiz.step2')}</span>
        </div>
        <div class="wizard-connector"></div>

        <div class="wizard-step ${currentStep === 3 ? 'active' : (currentStep > 3 ? 'completed' : '')}">
          <div class="wizard-step-number">3</div>
          <span data-i18n="wiz.step3">${window.t('wiz.step3')}</span>
        </div>
        <div class="wizard-connector"></div>

        <div class="wizard-step ${currentStep === 4 ? 'active' : (currentStep > 4 ? 'completed' : '')}">
          <div class="wizard-step-number">4</div>
          <span data-i18n="wiz.step4">${window.t('wiz.step4')}</span>
        </div>
        <div class="wizard-connector"></div>

        <div class="wizard-step ${currentStep === 5 ? 'active' : (currentStep > 5 ? 'completed' : '')}">
          <div class="wizard-step-number">5</div>
          <span data-i18n="wiz.step5">${window.t('wiz.step5')}</span>
        </div>
        <div class="wizard-connector"></div>

        <div class="wizard-step ${currentStep === 6 ? 'active' : ''}">
          <div class="wizard-step-number">6</div>
          <span data-i18n="wiz.step6">${window.t('wiz.step6')}</span>
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
              <span data-i18n="wiz.s1.title">${window.t('wiz.s1.title')}</span>
            </h2>
            <p style="font-size:0.8125rem; color:var(--slate-500); margin-top:0.25rem;" data-i18n="wiz.s1.desc">
              ${window.t('wiz.s1.desc')}
            </p>
          </div>

          <!-- Quick Preset Demo Buttons -->
          <div style="display:flex; align-items:center; gap:0.4rem; flex-wrap:wrap;">
            <span style="font-size:0.75rem; font-weight:700; color:var(--slate-500);" data-i18n="wiz.s1.presets">${window.t('wiz.s1.presets')}</span>
            <button class="btn btn-secondary btn-sm preset-btn" data-stage="0" data-ungradable="false">Level 0</button>
            <button class="btn btn-secondary btn-sm preset-btn" data-stage="1" data-ungradable="false">Level 1</button>
            <button class="btn btn-secondary btn-sm preset-btn" data-stage="2" data-ungradable="false" style="border-color:var(--primary-500); background:var(--primary-50); color:var(--primary-800); font-weight:700;">Level 2</button>
            <button class="btn btn-secondary btn-sm preset-btn" data-stage="3" data-ungradable="false">Level 3</button>
            <button class="btn btn-secondary btn-sm preset-btn" data-stage="4" data-ungradable="false">Level 4</button>
            <button class="btn btn-secondary btn-sm preset-btn" data-stage="2" data-ungradable="true" style="color:#b91c1c;">Ungradable</button>
          </div>
        </div>

        <form id="patient-form" class="form-grid" style="margin-bottom:1.75rem;">
          <div class="form-group">
            <label class="form-label" data-i18n="wiz.s1.pid">${window.t('wiz.s1.pid')}</label>
            <input type="text" id="p-id" class="form-input" value="${patientData.id}" required>
          </div>

          <div class="form-group">
            <label class="form-label" data-i18n="wiz.s1.pname">${window.t('wiz.s1.pname')}</label>
            <input type="text" id="p-name" class="form-input" value="${patientData.name}" required>
          </div>

          <div class="form-group">
            <label class="form-label" data-i18n="wiz.s1.page">${window.t('wiz.s1.page')}</label>
            <input type="number" id="p-age" class="form-input" value="${patientData.age}" min="1" max="120" required>
          </div>

          <div class="form-group">
            <label class="form-label" data-i18n="wiz.s1.pgender">${window.t('wiz.s1.pgender')}</label>
            <select id="p-gender" class="form-select">
              <option value="" disabled ${!patientData.gender ? 'selected' : ''}>${window.t('wiz.s1.selectGender')}</option>
              <option value="Female" ${patientData.gender === 'Female' ? 'selected' : ''}>Female</option>
              <option value="Male" ${patientData.gender === 'Male' ? 'selected' : ''}>Male</option>
              <option value="Other" ${patientData.gender === 'Other' ? 'selected' : ''}>Other</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label" data-i18n="wiz.s1.pduration">${window.t('wiz.s1.pduration')}</label>
            <select id="p-duration" class="form-select">
              <option value="" disabled ${!patientData.diabetesDuration ? 'selected' : ''}>${window.t('wiz.s1.selectDuration')}</option>
              <option value="Newly Diagnosed (< 1 yr)" ${patientData.diabetesDuration === 'Newly Diagnosed (< 1 yr)' ? 'selected' : ''}>Newly Diagnosed (< 1 yr)</option>
              <option value="1 - 5 Years" ${patientData.diabetesDuration === '1 - 5 Years' ? 'selected' : ''}>1 - 5 Years</option>
              <option value="6 - 10 Years" ${patientData.diabetesDuration === '6 - 10 Years' ? 'selected' : ''}>6 - 10 Years</option>
              <option value="11 - 20 Years" ${patientData.diabetesDuration === '11 - 20 Years' ? 'selected' : ''}>11 - 20 Years</option>
              <option value="> 20 Years" ${patientData.diabetesDuration === '> 20 Years' ? 'selected' : ''}>> 20 Years</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label" data-i18n="wiz.s1.pstatus">${window.t('wiz.s1.pstatus')}</label>
            <select id="p-status" class="form-select">
              <option value="" disabled ${!patientData.diabetesStatus ? 'selected' : ''}>${window.t('wiz.s1.selectStatus')}</option>
              <option value="Type 2 Diabetes" ${patientData.diabetesStatus === 'Type 2 Diabetes' ? 'selected' : ''}>Type 2 Diabetes</option>
              <option value="Type 1 Diabetes" ${patientData.diabetesStatus === 'Type 1 Diabetes' ? 'selected' : ''}>Type 1 Diabetes</option>
              <option value="Gestational Diabetes" ${patientData.diabetesStatus === 'Gestational Diabetes' ? 'selected' : ''}>Gestational Diabetes</option>
              <option value="Pre-diabetic" ${patientData.diabetesStatus === 'Pre-diabetic' ? 'selected' : ''}>Pre-diabetic</option>
            </select>
          </div>

          <div class="form-group" style="grid-column:1 / -1;">
            <label class="form-label" data-i18n="wiz.s1.pcentre">${window.t('wiz.s1.pcentre')}</label>
            <select id="p-centre" class="form-select">
              <option value="" disabled ${!patientData.centre ? 'selected' : ''}>${window.t('wiz.s1.selectCentre')}</option>
              ${SCREENING_CENTRES.map(c => `<option value="${c}" ${patientData.centre === c ? 'selected' : ''}>${c}</option>`).join('')}
            </select>
          </div>
        </form>

        <div style="display:flex; justify-content:flex-end; gap:0.75rem; border-top:1px solid var(--border-card); padding-top:1.25rem;">
          <button type="button" class="btn btn-primary btn-lg" id="step1-next-btn">
            <span data-i18n="wiz.s1.proceed">${window.t('wiz.s1.proceed')}</span>
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
      const id = target.querySelector('#p-id').value;
      const name = target.querySelector('#p-name').value;
      if (!id || !name) {
        alert("Please enter at least the Patient ID and Name before proceeding.");
        return;
      }
      
      patientData.id = id;
      patientData.name = name;
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
              <span data-i18n="wiz.s2.title">${window.t('wiz.s2.title')}</span>
            </h2>
            <p style="font-size:0.8125rem; color:var(--slate-500); margin-top:0.25rem;" data-i18n="wiz.s2.desc">
              ${window.t('wiz.s2.desc')}
            </p>
          </div>
          <span class="badge" style="background:#e0f2fe; color:#0369a1;">
            <span data-i18n="wiz.s2.patient">${window.t('wiz.s2.patient')}</span> ${patientData.name} (${patientData.id})
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
                <div style="font-weight:700; color:var(--slate-900); font-size:1rem; margin-bottom:0.25rem;" data-i18n="wiz.s2.drag">
                  ${window.t('wiz.s2.drag')}
                </div>
                <div style="font-size:0.8125rem; color:var(--slate-500);" data-i18n="wiz.s2.supports">
                  ${window.t('wiz.s2.supports')}
                </div>
              </div>

              <input type="file" id="fundus-file-input" accept="image/jpeg,image/png,image/jpg,image/tiff,image/tif" style="display:none;">
              <button type="button" class="btn btn-secondary btn-sm" id="browse-files-btn">
                <i data-lucide="folder-open" style="width:14px;height:14px;"></i>
                <span data-i18n="wiz.s2.browse">${window.t('wiz.s2.browse')}</span>
              </button>
            </div>

            <!-- Live Camera Button -->
            <div style="margin-top:1rem; display:flex; gap:0.5rem;">
              <button class="btn btn-secondary" id="camera-capture-btn" style="flex:1;">
                <i data-lucide="camera" style="width:16px;height:16px;"></i>
                <span data-i18n="wiz.s2.connect">${window.t('wiz.s2.connect')}</span>
              </button>
              <button class="btn btn-secondary" id="regen-preset-btn" title="Reload Stage Preset">
                <i data-lucide="refresh-cw" style="width:16px;height:16px;"></i>
                <span data-i18n="wiz.s2.preset">${window.t('wiz.s2.preset')}</span>
              </button>
            </div>
          </div>

          <!-- Live Image Preview Card -->
          <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; background:var(--slate-900); border-radius:var(--radius-xl); padding:1rem; position:relative;">
            <div style="position:relative; width:280px; height:280px; border-radius:var(--radius-lg); overflow:hidden; border:2px solid rgba(255,255,255,0.2);">
              <img id="preview-fundus-img" src="${rawImageDataUrl}" alt="Fundus Preview" style="width:100%; height:100%; object-fit:contain; background:#000;">
              <video id="camera-video" autoplay playsinline style="width:100%; height:100%; object-fit:cover; display:none; background:#000;"></video>
              <canvas id="camera-canvas" style="display:none;"></canvas>
              <div id="eye-tracking-overlay" style="display:none; position:absolute; border:2px dashed #10b981; border-radius:4px; box-shadow:0 0 15px rgba(16,185,129,0.5); pointer-events:none; z-index:10; box-sizing:border-box;"></div>
              <div id="auto-capture-toast" style="display:none; position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); background:rgba(16,185,129,0.9); color:white; padding:0.5rem 1rem; border-radius:2rem; font-weight:700; font-size:0.875rem; z-index:20; white-space:nowrap;">
                <i data-lucide="scan-eye" style="width:16px;height:16px; display:inline-block; vertical-align:middle; margin-right:4px;"></i>
                Eye Detected - Capturing...
              </div>
              ${isUngradableCase ? `
                <div style="position:absolute; top:10px; left:10px; background:rgba(239,68,68,0.9); color:white; font-size:0.75rem; font-weight:700; padding:0.25rem 0.6rem; border-radius:var(--radius-full);">
                  <i data-lucide="alert-triangle" style="width:12px;height:12px; display:inline-block; vertical-align:middle;"></i>
                  <span data-i18n="wiz.s2.simBlurry">${window.t('wiz.s2.simBlurry')}</span>
                </div>
              ` : ''}
            </div>
            <div style="color:var(--slate-300); font-size:0.75rem; margin-top:0.75rem; text-align:center;" data-i18n="wiz.s2.preview">
              ${window.t('wiz.s2.preview')}
            </div>
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-card); padding-top:1.25rem;">
          <button class="btn btn-secondary" id="step2-prev-btn">
            <i data-lucide="arrow-left" style="width:16px;height:16px;"></i>
            <span data-i18n="wiz.s2.back">${window.t('wiz.s2.back')}</span>
          </button>
          <button class="btn btn-primary btn-lg" id="step2-start-screening-btn">
            <i data-lucide="play-circle" style="width:20px;height:20px;"></i>
            <span data-i18n="wiz.s2.start">${window.t('wiz.s2.start')}</span>
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
        const processDataUrl = (dataUrl) => {
          const originalSrc = previewImg.src;
          const originalUrl = rawImageDataUrl;
          
          previewImg.onload = () => {
             previewImg.onload = null; // Remove handler to prevent loops
             
             rawImageDataUrl = dataUrl;
             isUngradableCase = false;
          };
          previewImg.src = dataUrl;
        };

        const isTiff = file.name.toLowerCase().endsWith('.tif') || file.name.toLowerCase().endsWith('.tiff') || file.type === 'image/tiff';

        if (isTiff) {
          const reader = new FileReader();
          reader.onload = (evt) => {
            if (window.UTIF) {
              try {
                const buffer = evt.target.result;
                const ifds = UTIF.decode(buffer);
                UTIF.decodeImage(buffer, ifds[0]);
                const rgba = UTIF.toRGBA8(ifds[0]);
                
                const canvas = document.createElement('canvas');
                canvas.width = ifds[0].width;
                canvas.height = ifds[0].height;
                const ctx = canvas.getContext('2d');
                const imgData = ctx.createImageData(canvas.width, canvas.height);
                imgData.data.set(rgba);
                ctx.putImageData(imgData, 0, 0);
                
                processDataUrl(canvas.toDataURL('image/jpeg'));
              } catch (err) {
                alert("Failed to parse TIFF image: " + err.message);
              }
            } else {
              alert("TIFF library not loaded.");
            }
          };
          reader.readAsArrayBuffer(file);
        } else {
          const reader = new FileReader();
          reader.onload = (evt) => {
            processDataUrl(evt.target.result);
          };
          reader.readAsDataURL(file);
        }
      }
    });

    // Camera Capture
    const cameraBtn = target.querySelector('#camera-capture-btn');
    const video = target.querySelector('#camera-video');
    const canvas = target.querySelector('#camera-canvas');
    const trackingOverlay = target.querySelector('#eye-tracking-overlay');
    const autoCaptureToast = target.querySelector('#auto-capture-toast');
    let videoStream = null;
    let eyeTrackerTask = null;
    let autoCaptureTimeout = null;
    let lastEyeRect = null;

    function captureImage(cropRect = null) {
      if (!videoStream) return;
      
      const ctx = canvas.getContext('2d');
      if (cropRect && video.videoWidth) {
        // Tight padding around the eye to show only the eye
        const paddingX = cropRect.width * 0.1;
        const paddingY = cropRect.height * 0.1;
        
        let sx = Math.max(0, cropRect.x - paddingX);
        let sy = Math.max(0, cropRect.y - paddingY);
        let sWidth = Math.min(video.videoWidth - sx, cropRect.width + (paddingX * 2));
        let sHeight = Math.min(video.videoHeight - sy, cropRect.height + (paddingY * 2));
        
        // Make it a square
        const size = Math.min(sWidth, sHeight);
        sx += (sWidth - size) / 2;
        sy += (sHeight - size) / 2;
        
        canvas.width = 512;
        canvas.height = 512;
        ctx.drawImage(video, sx, sy, size, size, 0, 0, 512, 512);
      } else {
        canvas.width = video.videoWidth || 512;
        canvas.height = video.videoHeight || 512;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }
      
      rawImageDataUrl = canvas.toDataURL('image/jpeg');
      isUngradableCase = false;
      
      stopCamera();
      video.style.display = 'none';
      if (trackingOverlay) trackingOverlay.style.display = 'none';
      
      previewImg.src = rawImageDataUrl;
      previewImg.style.display = 'block';
      cameraBtn.innerHTML = `<i data-lucide="camera" style="width:16px;height:16px;"></i> ${window.t('wiz.s2.connect')}`;

      if (cropRect && autoCaptureToast) {
        autoCaptureToast.innerHTML = '<i data-lucide="check-circle" style="width:16px;height:16px; display:inline-block; vertical-align:middle; margin-right:4px;"></i> Eye Captured!';
        autoCaptureToast.style.display = 'block';
        autoCaptureToast.style.background = 'rgba(16,185,129,0.9)';
        setTimeout(() => {
          autoCaptureToast.style.display = 'none';
        }, 3000);
      } else if (autoCaptureToast) {
        autoCaptureToast.style.display = 'none';
      }

      if (window.lucide) window.lucide.createIcons();
    }

    function stopCamera() {
      if (eyeTrackerTask) {
        eyeTrackerTask.stop();
        eyeTrackerTask = null;
      }
      if (autoCaptureTimeout) {
        clearTimeout(autoCaptureTimeout);
        autoCaptureTimeout = null;
      }
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        videoStream = null;
      }
    }

    cameraBtn.addEventListener('click', async () => {
      if (!videoStream) {
        try {
          videoStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
          video.srcObject = videoStream;
          previewImg.style.display = 'none';
          video.style.display = 'block';
          cameraBtn.innerHTML = `<i data-lucide="camera" style="width:16px;height:16px;"></i> \${window.t('wiz.s2.capture')}`;
          if (window.lucide) window.lucide.createIcons();

          // No tracking setup, directly allow manual capture
        } catch (err) {
          alert('Could not access camera: ' + err.message);
        }
      } else {
        // Manual capture fallback with validation bypassed
        captureImage(lastEyeRect);
      }
    });

    target.querySelector('#regen-preset-btn').addEventListener('click', () => {
      stopCamera();
      video.style.display = 'none';
      previewImg.style.display = 'block';
      cameraBtn.innerHTML = `<i data-lucide="camera" style="width:16px;height:16px;"></i> \${window.t('wiz.s2.connect')}`;
      if (window.lucide) window.lucide.createIcons();
      
      rawImageDataUrl = ImageProcessor.generateFundusImage(selectedStage, isUngradableCase);
      previewImg.src = rawImageDataUrl;
    });

    target.querySelector('#step2-prev-btn').addEventListener('click', () => {
      stopCamera();
      currentStep = 1;
      updateView();
    });

    target.querySelector('#step2-start-screening-btn').addEventListener('click', async () => {
      stopCamera();
      qualityResult = ImageProcessor.assessImageQuality(isUngradableCase);
      if (qualityResult.overall !== 'UNGRADABLE') {
        enhancedImageDataUrl = await ImageProcessor.enhanceImage(rawImageDataUrl);
        currentStep = 4;
      } else {
        currentStep = 3;
      }
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
              <span data-i18n="wiz.s3.title">${window.t('wiz.s3.title')}</span>
            </h2>
            <p style="font-size:0.8125rem; color:var(--slate-500); margin-top:0.25rem;" data-i18n="wiz.s3.desc">
              ${window.t('wiz.s3.desc')}
            </p>
          </div>
          <span class="badge ${isUngradable ? 'badge-quality-ungradable' : 'badge-quality-acceptable'}" style="font-size:0.875rem; padding:0.4rem 0.8rem;">
            <span data-i18n="wiz.s3.iq">${window.t('wiz.s3.iq')}</span> ${qualityResult.overall}
          </span>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:1.5rem; margin-bottom:1.5rem;">
          <!-- Left: Image View -->
          <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; background:#020617; border-radius:var(--radius-xl); padding:1rem;">
            <div style="width:280px; height:280px; border-radius:var(--radius-lg); overflow:hidden;">
              <img src="${rawImageDataUrl}" alt="Fundus Quality Scan" style="width:100%; height:100%; object-fit:contain;">
            </div>
            <div style="color:var(--slate-400); font-size:0.75rem; margin-top:0.5rem;">
              <span data-i18n="wiz.s3.score">${window.t('wiz.s3.score')}</span> <strong>${qualityResult.overallScore} / 100</strong>
            </div>
          </div>

          <!-- Right: Multi-Factor Quality Indicators -->
          <div>
            <h4 style="font-size:0.9375rem; color:var(--slate-800); margin-bottom:0.75rem;" data-i18n="wiz.s3.indicators">${window.t('wiz.s3.indicators')}</h4>

            <div style="display:flex; flex-direction:column; gap:0.75rem;">
              <!-- Focus -->
              <div style="display:flex; justify-content:space-between; align-items:center; padding:0.6rem 0.85rem; background:var(--slate-50); border-radius:var(--radius-md); border:1px solid var(--border-subtle);">
                <div>
                  <div style="font-weight:700; font-size:0.8125rem; color:var(--slate-800);" data-i18n="wiz.s3.focus">${window.t('wiz.s3.focus')}</div>
                  <div style="font-size:0.75rem; color:var(--slate-500);">${qualityResult.focus.label}</div>
                </div>
                <span class="badge ${qualityResult.focus.status === 'Good' ? 'badge-quality-acceptable' : 'badge-quality-ungradable'}">
                  ${qualityResult.focus.status}
                </span>
              </div>

              <!-- Illumination -->
              <div style="display:flex; justify-content:space-between; align-items:center; padding:0.6rem 0.85rem; background:var(--slate-50); border-radius:var(--radius-md); border:1px solid var(--border-subtle);">
                <div>
                  <div style="font-weight:700; font-size:0.8125rem; color:var(--slate-800);" data-i18n="wiz.s3.illumination">${window.t('wiz.s3.illumination')}</div>
                  <div style="font-size:0.75rem; color:var(--slate-500);">${qualityResult.illumination.label}</div>
                </div>
                <span class="badge ${qualityResult.illumination.status === 'Good' ? 'badge-quality-acceptable' : 'badge-quality-ungradable'}">
                  ${qualityResult.illumination.status}
                </span>
              </div>

              <!-- Field of View -->
              <div style="display:flex; justify-content:space-between; align-items:center; padding:0.6rem 0.85rem; background:var(--slate-50); border-radius:var(--radius-md); border:1px solid var(--border-subtle);">
                <div>
                  <div style="font-weight:700; font-size:0.8125rem; color:var(--slate-800);" data-i18n="wiz.s3.fov">${window.t('wiz.s3.fov')}</div>
                  <div style="font-size:0.75rem; color:var(--slate-500);">${qualityResult.fieldOfView.label}</div>
                </div>
                <span class="badge badge-quality-acceptable">
                  ${qualityResult.fieldOfView.status}
                </span>
              </div>

              <!-- Retinal Visibility -->
              <div style="display:flex; justify-content:space-between; align-items:center; padding:0.6rem 0.85rem; background:var(--slate-50); border-radius:var(--radius-md); border:1px solid var(--border-subtle);">
                <div>
                  <div style="font-weight:700; font-size:0.8125rem; color:var(--slate-800);" data-i18n="wiz.s3.visibility">${window.t('wiz.s3.visibility')}</div>
                  <div style="font-size:0.75rem; color:var(--slate-500);">${qualityResult.retinalVisibility.label}</div>
                </div>
                <span class="badge ${qualityResult.retinalVisibility.status === 'Good' ? 'badge-quality-acceptable' : 'badge-quality-ungradable'}">
                  ${qualityResult.retinalVisibility.status}
                </span>
              </div>

              <!-- Artifacts -->
              <div style="display:flex; justify-content:space-between; align-items:center; padding:0.6rem 0.85rem; background:var(--slate-50); border-radius:var(--radius-md); border:1px solid var(--border-subtle);">
                <div>
                  <div style="font-weight:700; font-size:0.8125rem; color:var(--slate-800);" data-i18n="wiz.s3.artifacts">${window.t('wiz.s3.artifacts')}</div>
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
                <h4 style="color:#991b1b; font-size:1rem; margin-bottom:0.25rem;" data-i18n="wiz.s3.ungradableTitle">${window.t('wiz.s3.ungradableTitle')}</h4>
                <p style="color:#7f1d1d; font-size:0.8125rem; margin-bottom:0.5rem;" data-i18n="wiz.s3.ungradableDesc">
                  ${window.t('wiz.s3.ungradableDesc')}
                </p>
                <div style="font-size:0.8125rem; font-weight:700; color:#991b1b;" data-i18n="wiz.s3.problems">${window.t('wiz.s3.problems')}</div>
                <ul style="margin-left:1.25rem; color:#7f1d1d; font-size:0.8125rem; margin-top:0.25rem;">
                  ${qualityResult.problems.map(p => `<li>${p}</li>`).join('')}
                </ul>
                <div style="margin-top:0.75rem; font-size:0.8125rem; color:#991b1b;">
                  <strong data-i18n="wiz.s3.rec">${window.t('wiz.s3.rec')}</strong> ${qualityResult.recommendation}
                </div>
              </div>
            </div>
          </div>
        ` : `
          <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:var(--radius-lg); padding:1rem; margin-bottom:1.5rem; display:flex; gap:0.75rem; align-items:center;">
            <i data-lucide="check-circle" style="width:20px;height:20px; color:#15803d;"></i>
            <span style="color:#166534; font-size:0.875rem;">
              <strong data-i18n="wiz.s3.passedTitle">${window.t('wiz.s3.passedTitle')}</strong> <span data-i18n="wiz.s3.passedDesc">${window.t('wiz.s3.passedDesc')}</span>
            </span>
          </div>
        `}

        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-card); padding-top:1.25rem;">
          <button class="btn btn-secondary" id="step3-prev-btn">
            <i data-lucide="arrow-left" style="width:16px;height:16px;"></i>
            <span data-i18n="wiz.s3.recapture">${window.t('wiz.s3.recapture')}</span>
          </button>

          ${isUngradable ? `
            <button class="btn btn-danger" id="step3-save-ungradable-btn">
              <i data-lucide="save" style="width:16px;height:16px;"></i>
              <span data-i18n="wiz.s3.logUngradable">${window.t('wiz.s3.logUngradable')}</span>
            </button>
          ` : `
            <button class="btn btn-primary btn-lg" id="step3-next-btn">
              <span data-i18n="wiz.s3.proceed">${window.t('wiz.s3.proceed')}</span>
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
              <i data-lucide="wand-2" style="width:22px;height:22px; color:var(--primary-600);"></i>
              <span data-i18n="wiz.s4.title">${window.t('wiz.s4.title')}</span>
            </h2>
            <p style="font-size:0.8125rem; color:var(--slate-500); margin-top:0.25rem;" data-i18n="wiz.s4.desc">
              ${window.t('wiz.s4.desc')}
            </p>
          </div>
          <div style="display:flex; gap:0.5rem; background:var(--slate-100); padding:0.35rem; border-radius:var(--radius-lg);">
            <button class="btn btn-primary btn-sm enhance-toggle-btn" data-view="enhanced"><span data-i18n="wiz.s4.enh">${window.t('wiz.s4.enh')}</span></button>
            <button class="btn btn-secondary btn-sm enhance-toggle-btn" data-view="original"><span data-i18n="wiz.s4.orig">${window.t('wiz.s4.orig')}</span></button>
            <button class="btn btn-secondary btn-sm enhance-toggle-btn" data-view="split"><span data-i18n="wiz.s4.side">${window.t('wiz.s4.side')}</span></button>
          </div>
        </div>

        <!-- Visual Display Area -->
        <div id="enhance-visual-container" style="background:#020617; border-radius:var(--radius-xl); padding:1.5rem; margin-bottom:1.5rem; display:flex; justify-content:center; align-items:center; min-height:340px; position:relative; overflow:hidden;">
          <!-- Injected dynamically -->
        </div>

        <!-- Process Details -->
        <div style="display:flex; flex-direction:column; gap:1rem;">
          <div class="card" style="flex:1;">
            <h4 style="font-size:0.9375rem; color:var(--slate-800); margin-bottom:1rem;" data-i18n="wiz.s4.pipeline">${window.t('wiz.s4.pipeline')}</h4>
            
            <div style="display:flex; flex-direction:column; gap:0.75rem; font-size:0.8125rem;">
              <div style="display:flex; align-items:center; gap:0.75rem;">
                <i data-lucide="check-circle-2" style="width:18px;height:18px; color:#10b981;"></i>
                <span style="color:var(--slate-700);" data-i18n="wiz.s4.blur">${window.t('wiz.s4.blur')}</span>
              </div>
              <div style="display:flex; align-items:center; gap:0.75rem;">
                <i data-lucide="check-circle-2" style="width:18px;height:18px; color:#10b981;"></i>
                <span style="color:var(--slate-700);" data-i18n="wiz.s4.illum">${window.t('wiz.s4.illum')}</span>
              </div>
              <div style="display:flex; align-items:center; gap:0.75rem;">
                <i data-lucide="check-circle-2" style="width:18px;height:18px; color:#10b981;"></i>
                <span style="color:var(--slate-700);" data-i18n="wiz.s4.green">${window.t('wiz.s4.green')}</span>
              </div>
              <div style="display:flex; align-items:center; gap:0.75rem;">
                <i data-lucide="check-circle-2" style="width:18px;height:18px; color:#10b981;"></i>
                <span style="color:var(--slate-700);" data-i18n="wiz.s4.clahe">${window.t('wiz.s4.clahe')}</span>
              </div>
              <div style="display:flex; align-items:center; gap:0.75rem;">
                <i data-lucide="check-circle-2" style="width:18px;height:18px; color:#10b981;"></i>
                <span style="color:var(--slate-700);" data-i18n="wiz.s4.noise">${window.t('wiz.s4.noise')}</span>
              </div>
            </div>

            <div style="margin-top:1.5rem; padding-top:1rem; border-top:1px solid var(--border-subtle); font-size:0.75rem; color:var(--slate-500); line-height:1.5;" data-i18n="wiz.s4.proto">
              ${window.t('wiz.s4.proto')}
            </div>
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-card); padding-top:1.25rem; margin-top:1.5rem;">
          <button class="btn btn-secondary" id="step4-prev-btn">
            <i data-lucide="arrow-left" style="width:16px;height:16px;"></i>
            <span data-i18n="wiz.s4.back">${window.t('wiz.s4.back')}</span>
          </button>
          <button class="btn btn-primary btn-lg" id="step4-next-btn">
            <i data-lucide="cpu" style="width:18px;height:18px;"></i>
            <span data-i18n="wiz.s4.runAI">${window.t('wiz.s4.runAI')}</span>
          </button>
        </div>
      </div>
    `;

    const viewerContainer = target.querySelector('#enhance-visual-container');
    let currentView = 'enhanced'; // 'enhanced', 'original', 'split'

    function updateEnhanceDisplay() {
      if (currentView === 'original') {
        viewerContainer.innerHTML = `
          <img src="${rawImageDataUrl}" style="width:100%; height:100%; object-fit:contain; border-radius:var(--radius-lg);">
          <div style="position:absolute; bottom:10px; left:10px; background:rgba(0,0,0,0.6); color:white; font-size:0.75rem; padding:0.25rem 0.6rem; border-radius:var(--radius-full);" data-i18n="wiz.s4.origLabel">${window.t('wiz.s4.origLabel')}</div>
        `;
      } else if (currentView === 'enhanced') {
        viewerContainer.innerHTML = `
          <img src="${enhancedImageDataUrl}" style="width:100%; height:100%; object-fit:contain; border-radius:var(--radius-lg);">
          <div style="position:absolute; bottom:10px; left:10px; background:rgba(14,165,233,0.9); color:white; font-size:0.75rem; font-weight:700; padding:0.25rem 0.6rem; border-radius:var(--radius-full);" data-i18n="wiz.s4.enhLabel">${window.t('wiz.s4.enhLabel')}</div>
        `;
      } else if (currentView === 'split') {
        viewerContainer.innerHTML = `
          <div style="display:flex; width:100%; height:100%; gap:2px; background:var(--slate-800);">
            <div style="flex:1; position:relative; overflow:hidden;">
              <img src="${rawImageDataUrl}" style="width:200%; height:100%; object-fit:contain; object-position:left center; border-radius:var(--radius-lg) 0 0 var(--radius-lg);">
              <div style="position:absolute; bottom:10px; left:10px; background:rgba(0,0,0,0.6); color:white; font-size:0.7rem; padding:0.2rem 0.5rem; border-radius:var(--radius-full);" data-i18n="wiz.s4.origImg">${window.t('wiz.s4.origImg')}</div>
            </div>
            <div style="flex:1; position:relative; overflow:hidden;">
              <img src="${enhancedImageDataUrl}" style="width:200%; height:100%; object-fit:contain; object-position:right center; border-radius:0 var(--radius-lg) var(--radius-lg) 0; transform:translateX(-50%);">
              <div style="position:absolute; bottom:10px; right:10px; background:rgba(14,165,233,0.9); color:white; font-size:0.7rem; font-weight:700; padding:0.2rem 0.5rem; border-radius:var(--radius-full);" data-i18n="wiz.s4.claheEnh">${window.t('wiz.s4.claheEnh')}</div>
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

        <h2 style="font-size:1.5rem; color:var(--slate-900); margin-bottom:0.5rem;" data-i18n="wiz.s5.title">
          ${window.t('wiz.s5.title')}
        </h2>
        <p style="font-size:0.875rem; color:var(--slate-600); max-width:500px; margin:0 auto 2rem;" data-i18n="wiz.s5.desc">
          ${window.t('wiz.s5.desc')}
        </p>

        <!-- Pipeline Stage Indicators -->
        <div style="max-width:520px; margin:0 auto; display:flex; flex-direction:column; gap:0.75rem; text-align:left;">
          <div class="pipe-item" id="p-step-1" style="display:flex; align-items:center; gap:0.75rem; padding:0.6rem 0.85rem; border-radius:var(--radius-md); background:var(--slate-50);">
            <i data-lucide="loader-2" class="animate-spin" style="width:16px;height:16px; color:var(--primary-600);"></i>
            <span style="font-size:0.8125rem; font-weight:600;" data-i18n="wiz.s5.st1">${window.t('wiz.s5.st1')}</span>
          </div>

          <div class="pipe-item" id="p-step-2" style="display:flex; align-items:center; gap:0.75rem; padding:0.6rem 0.85rem; border-radius:var(--radius-md); background:var(--slate-50); opacity:0.5;">
            <i data-lucide="circle" style="width:16px;height:16px; color:var(--slate-400);"></i>
            <span style="font-size:0.8125rem; font-weight:600;" data-i18n="wiz.s5.st2">${window.t('wiz.s5.st2')}</span>
          </div>

          <div class="pipe-item" id="p-step-3" style="display:flex; align-items:center; gap:0.75rem; padding:0.6rem 0.85rem; border-radius:var(--radius-md); background:var(--slate-50); opacity:0.5;">
            <i data-lucide="circle" style="width:16px;height:16px; color:var(--slate-400);"></i>
            <span style="font-size:0.8125rem; font-weight:600;" data-i18n="wiz.s5.st3">${window.t('wiz.s5.st3')}</span>
          </div>

          <div class="pipe-item" id="p-step-4" style="display:flex; align-items:center; gap:0.75rem; padding:0.6rem 0.85rem; border-radius:var(--radius-md); background:var(--slate-50); opacity:0.5;">
            <i data-lucide="circle" style="width:16px;height:16px; color:var(--slate-400);"></i>
            <span style="font-size:0.8125rem; font-weight:600;" data-i18n="wiz.s5.st4">${window.t('wiz.s5.st4')}</span>
          </div>

          <div class="pipe-item" id="p-step-5" style="display:flex; align-items:center; gap:0.75rem; padding:0.6rem 0.85rem; border-radius:var(--radius-md); background:var(--slate-50); opacity:0.5;">
            <i data-lucide="circle" style="width:16px;height:16px; color:var(--slate-400);"></i>
            <span style="font-size:0.8125rem; font-weight:600;" data-i18n="wiz.s5.st5">${window.t('wiz.s5.st5')}</span>
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
      s1.innerHTML = `<i data-lucide="check-circle-2" style="width:16px;height:16px; color:#10b981;"></i> <span style="font-size:0.8125rem; font-weight:700; color:#15803d;" data-i18n="wiz.s5.st1done">${window.t('wiz.s5.st1done')}</span>`;
      s2.style.opacity = '1';
      s2.innerHTML = `<i data-lucide="loader-2" class="animate-spin" style="width:16px;height:16px; color:var(--primary-600);"></i> <span style="font-size:0.8125rem; font-weight:600;" data-i18n="wiz.s5.st2prog">${window.t('wiz.s5.st2prog')}</span>`;
      if (window.lucide) window.lucide.createIcons();
    }, 450);

    setTimeout(() => {
      s2.innerHTML = `<i data-lucide="check-circle-2" style="width:16px;height:16px; color:#10b981;"></i> <span style="font-size:0.8125rem; font-weight:700; color:#15803d;" data-i18n="wiz.s5.st2done">${window.t('wiz.s5.st2done')}</span>`;
      s3.style.opacity = '1';
      s3.innerHTML = `<i data-lucide="loader-2" class="animate-spin" style="width:16px;height:16px; color:var(--primary-600);"></i> <span style="font-size:0.8125rem; font-weight:600;" data-i18n="wiz.s5.st3prog">${window.t('wiz.s5.st3prog')}</span>`;
      if (window.lucide) window.lucide.createIcons();
    }, 900);

    setTimeout(() => {
      s3.innerHTML = `<i data-lucide="check-circle-2" style="width:16px;height:16px; color:#10b981;"></i> <span style="font-size:0.8125rem; font-weight:700; color:#15803d;" data-i18n="wiz.s5.st3done">${window.t('wiz.s5.st3done')}</span>`;
      s4.style.opacity = '1';
      s4.innerHTML = `<i data-lucide="loader-2" class="animate-spin" style="width:16px;height:16px; color:var(--primary-600);"></i> <span style="font-size:0.8125rem; font-weight:600;" data-i18n="wiz.s5.st4prog">${window.t('wiz.s5.st4prog')}</span>`;
      if (window.lucide) window.lucide.createIcons();
    }, 1350);

    setTimeout(() => {
      s4.innerHTML = `<i data-lucide="check-circle-2" style="width:16px;height:16px; color:#10b981;"></i> <span style="font-size:0.8125rem; font-weight:700; color:#15803d;" data-i18n="wiz.s5.st4done">${window.t('wiz.s5.st4done')}</span>`;
      s5.style.opacity = '1';
      s5.innerHTML = `<i data-lucide="loader-2" class="animate-spin" style="width:16px;height:16px; color:var(--primary-600);"></i> <span style="font-size:0.8125rem; font-weight:600;" data-i18n="wiz.s5.st5prog">${window.t('wiz.s5.st5prog')}</span>`;
      if (window.lucide) window.lucide.createIcons();
    }, 1750);

    setTimeout(async () => {
      // Dynamically detect eye in the final image to position overlays correctly
      let eyeBox = null;
      if (window.tracking) {
        const img = new Image();
        img.src = enhancedImageDataUrl || rawImageDataUrl;
        await new Promise(resolve => {
           img.onload = () => {
             const tracker = new window.tracking.ObjectTracker('eye');
             tracker.setStepSize(1.7);
             
             // Must attach to DOM for tracking.js to process it properly in some versions,
             // or tracking.js can handle HTMLImageElement directly.
             const task = window.tracking.track(img, tracker);
             tracker.on('track', function(event) {
               task.stop();
               if (event.data.length > 0) {
                 const rect = event.data[0];
                 // Map to 600x600 coordinate space used by the UI overlays
                 const scaleX = 600 / img.width;
                 const scaleY = 600 / img.height;
                 eyeBox = {
                   x: rect.x * scaleX,
                   y: rect.y * scaleY,
                   width: rect.width * scaleX,
                   height: rect.height * scaleY
                 };
               }
               resolve();
             });
             
             // Fallback timeout in case tracking fails to fire
             setTimeout(resolve, 500);
           };
        });
      }

      aiDiagnosticResult = AIService.evaluateClassification(selectedStage, eyeBox);
      gradCamDataUrl = AIService.generateGradCAMHeatmap(selectedStage, 600, 600, eyeBox);

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
              <div class="safety-pill" style="background:rgba(20,184,166,0.25); color:#2dd4bf; border-color:rgba(20,184,166,0.4); margin-bottom:0.5rem;" data-i18n="wiz.s6.levelSubtitle">
                ${window.t('wiz.s6.levelSubtitle')}
              </div>
              <h1 style="font-size:1.75rem; color:white; margin-bottom:0.25rem;" data-i18n="dr.${aiDiagnosticResult.level}.title">
                ${window.t(`dr.${aiDiagnosticResult.level}.title`) || drMeta.title}
              </h1>
              <div style="color:#94a3b8; font-size:0.875rem;">
                <span data-i18n="wiz.s6.patient">${window.t('wiz.s6.patient')}</span> <strong>${patientData.name}</strong> • ${patientData.id} • ${patientData.age}y (${patientData.gender}) • <span data-i18n="wiz.s6.centre">${window.t('wiz.s6.centre')}</span> ${patientData.centre.split('—')[0]}
              </div>
            </div>

            <!-- Referral Status Banner -->
            <div style="text-align:right;">
              <div style="font-size:0.75rem; color:#94a3b8; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.25rem;" data-i18n="wiz.s6.refStatus">
                ${window.t('wiz.s6.refStatus')}
              </div>
              <span class="badge ${isReferable ? 'badge-referable-yes' : 'badge-referable-no'}" style="font-size:1.1rem; padding:0.4rem 1rem;">
                ${isReferable ? `<span data-i18n="wiz.s6.refYes">${window.t('wiz.s6.refYes')}</span>` : `<span data-i18n="wiz.s6.refNo">${window.t('wiz.s6.refNo')}</span>`}
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
                  <span data-i18n="wiz.s6.xaiTitle">${window.t('wiz.s6.xaiTitle')}</span>
                </h3>
                <p style="font-size:0.75rem; color:var(--slate-500);" data-i18n="wiz.s6.xaiDesc">
                  ${window.t('wiz.s6.xaiDesc')}
                </p>
              </div>

              <!-- Layer View Modes -->
              <div style="display:flex; gap:0.3rem;">
                <button class="btn btn-secondary btn-sm overlay-mode-btn" data-layer="original"><span data-i18n="wiz.s6.layerOrig">${window.t('wiz.s6.layerOrig')}</span></button>
                <button class="btn btn-secondary btn-sm overlay-mode-btn" data-layer="heatmap"><span data-i18n="wiz.s6.layerHeat">${window.t('wiz.s6.layerHeat')}</span></button>
                <button class="btn btn-primary btn-sm overlay-mode-btn" data-layer="overlay"><span data-i18n="wiz.s6.layerOver">${window.t('wiz.s6.layerOver')}</span></button>
                <button class="btn btn-secondary btn-sm overlay-mode-btn" data-layer="structures"><span data-i18n="wiz.s6.layerStruc">${window.t('wiz.s6.layerStruc')}</span></button>
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
                <text x="${aiDiagnosticResult.landmarks.opticDisc.x - 35}" y="${aiDiagnosticResult.landmarks.opticDisc.y - 50}" fill="#38bdf8" font-size="12" font-weight="bold" data-i18n="wiz.s6.opticDisc">${window.t('wiz.s6.opticDisc')}</text>

                <!-- Fovea Landmark -->
                <circle cx="${aiDiagnosticResult.landmarks.fovea.x}" cy="${aiDiagnosticResult.landmarks.fovea.y}" r="${aiDiagnosticResult.landmarks.fovea.radius}" stroke="#facc15" stroke-width="2" stroke-dasharray="3,3" fill="rgba(250, 204, 21, 0.15)" />
                <text x="${aiDiagnosticResult.landmarks.fovea.x - 20}" y="${aiDiagnosticResult.landmarks.fovea.y - 35}" fill="#facc15" font-size="12" font-weight="bold" data-i18n="wiz.s6.fovea">${window.t('wiz.s6.fovea')}</text>
              </svg>
            </div>

            <!-- Heatmap Opacity & Controls Bar -->
            <div class="gradcam-controls-bar">
              <div class="slider-container">
                <i data-lucide="sliders" style="width:16px;height:16px; color:var(--primary-400);"></i>
                <span style="font-size:0.8125rem; font-weight:600;" data-i18n="wiz.s6.opacity">${window.t('wiz.s6.opacity')}</span>
                <input type="range" id="heatmap-opacity-slider" class="slider-input" min="0" max="1" step="0.05" value="${heatmapOpacity}">
                <span id="opacity-val-label" style="font-size:0.8125rem; font-family:var(--font-mono); width:36px;">${Math.round(heatmapOpacity * 100)}%</span>
              </div>
            </div>

            <div style="margin-top:0.75rem; font-size:0.75rem; color:var(--slate-500); line-height:1.4;">
              <strong data-i18n="wiz.s6.xaiNote">${window.t('wiz.s6.xaiNote')}</strong> <span data-i18n="wiz.s6.xaiNoteDesc">${window.t('wiz.s6.xaiNoteDesc')}</span>
            </div>
          </div>

          <!-- RIGHT: SEVERITY, CONFIDENCE & CLINICAL EVIDENCE -->
          <div style="display:flex; flex-direction:column; gap:1.25rem;">
            
            <!-- Severity & Confidence Card -->
            <div class="card">
              <div class="card-header" style="margin-bottom:0.75rem;">
                <h3 class="card-title">
                  <i data-lucide="activity" style="width:20px;height:20px; color:var(--primary-600);"></i>
                  <span data-i18n="wiz.s6.diagClass">${window.t('wiz.s6.diagClass')}</span>
                </h3>
                <span class="badge ${drMeta.badgeClass}" style="font-size:0.8125rem;" data-i18n="dr.${aiDiagnosticResult.level}.shortName">
                  ${window.t(`dr.${aiDiagnosticResult.level}.shortName`) || drMeta.shortName}
                </span>
              </div>

              <div style="display:flex; align-items:center; justify-content:space-between; background:var(--slate-50); padding:1rem; border-radius:var(--radius-md); border:1px solid var(--border-card); margin-bottom:1rem;">
                <div>
                  <div style="font-size:0.75rem; font-weight:700; color:var(--slate-500); text-transform:uppercase;" data-i18n="wiz.s6.aiConf">${window.t('wiz.s6.aiConf')}</div>
                  <div style="font-size:2.2rem; font-weight:800; font-family:var(--font-heading); color:var(--slate-900);">
                    ${aiDiagnosticResult.confidence}%
                  </div>
                  <div style="font-size:0.7rem; color:var(--slate-500);" data-i18n="wiz.s6.protoSoft">${window.t('wiz.s6.protoSoft')}</div>
                </div>
                <div style="text-align:right; max-width:220px;">
                  <div style="font-size:0.75rem; font-weight:700; color:var(--slate-500); text-transform:uppercase;" data-i18n="wiz.s6.clinScale">${window.t('wiz.s6.clinScale')}</div>
                  <div style="font-size:0.875rem; font-weight:700; color:var(--slate-800);" data-i18n="dr.${aiDiagnosticResult.level}.title">${window.t(`dr.${aiDiagnosticResult.level}.title`) || drMeta.title}</div>
                  <div style="font-size:0.75rem; color:var(--slate-500);" data-i18n="dr.${aiDiagnosticResult.level}.description">${window.t(`dr.${aiDiagnosticResult.level}.description`) || drMeta.description}</div>
                </div>
              </div>

              <!-- Recommendation Block -->
              <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:var(--radius-md); padding:0.85rem;">
                <div style="display:flex; gap:0.5rem; align-items:flex-start;">
                  <i data-lucide="info" style="width:18px;height:18px; color:#1d4ed8; flex-shrink:0; margin-top:1px;"></i>
                  <div>
                    <div style="font-size:0.8125rem; font-weight:700; color:#1e40af;" data-i18n="wiz.s6.clinRec">${window.t('wiz.s6.clinRec')}</div>
                    <div style="font-size:0.8125rem; color:#1e3a8a; margin-top:0.15rem;" data-i18n="dr.${aiDiagnosticResult.level}.clinicalRecommendation">
                      ${window.t(`dr.${aiDiagnosticResult.level}.clinicalRecommendation`) || drMeta.clinicalRecommendation}
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
                  <span data-i18n="wiz.s6.localEv">${window.t('wiz.s6.localEv')}</span>
                </h3>
                <span class="badge" style="background:#f1f5f9; color:#475569; font-size:0.7rem;" data-i18n="wiz.s6.demoEv">${window.t('wiz.s6.demoEv')}</span>
              </div>

              <div style="display:flex; flex-direction:column; gap:0.6rem;">
                ${aiDiagnosticResult.evidence.map(ev => `
                  <div style="padding:0.75rem; background:var(--slate-50); border:1px solid var(--border-subtle); border-radius:var(--radius-md);">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.25rem;">
                      <span style="font-weight:700; font-size:0.8125rem; color:var(--slate-900);">${window.t(`ev.type.${ev.type}`) || ev.type}</span>
                      <span class="badge" style="background:#e0f2fe; color:#0369a1; font-size:0.6875rem;"><span data-i18n="wiz.s6.attribution">${window.t('wiz.s6.attribution')}</span> ${ev.relevance}%</span>
                    </div>
                    <div style="font-size:0.75rem; color:var(--slate-600);">
                      <strong data-i18n="wiz.s6.region">${window.t('wiz.s6.region')}</strong> ${window.t(`ev.region.${ev.region}`) || ev.region}
                    </div>
                    <div style="font-size:0.75rem; color:var(--slate-500); margin-top:0.15rem;">
                      ${window.t(`ev.desc.${ev.description}`) || ev.description}
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
            <span data-i18n="wiz.s6.newScreening">${window.t('wiz.s6.newScreening')}</span>
          </button>

          <div style="display:flex; gap:0.75rem; flex-wrap:wrap;">
            <button class="btn btn-secondary" id="step6-view-report-btn">
              <i data-lucide="printer" style="width:16px;height:16px;"></i>
              <span data-i18n="wiz.s6.printReport">${window.t('wiz.s6.printReport')}</span>
            </button>
            <button class="btn btn-primary btn-lg" id="step6-send-doctor-btn">
              <i data-lucide="send" style="width:18px;height:18px;"></i>
              <span data-i18n="wiz.s6.sendDoc">${window.t('wiz.s6.sendDoc')}</span>
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
      if (window.retinaXAI) {
        window.retinaXAI.showToast(`${window.t('wiz.s6.toastQueued')}`);
      }
      onCompleteScreening(screeningRecord);
    });
  }

  // Initial render
  updateView();
}
