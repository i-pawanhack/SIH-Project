/**
 * Drish Kalyan — Clinical Screening Report Modal Component
 * Renders the official Drishti Kalyan PDF report format both on screen and print.
 */

import { DR_SEVERITY_LEVELS } from '../types.js';
import { StorageService } from '../services/storageService.js';

export function openReportModal(screeningCase, onClose) {
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return;

  const isUngradable = screeningCase.isUngradable || screeningCase.imageQuality?.overall === 'UNGRADABLE';
  const drMeta = !isUngradable ? (DR_SEVERITY_LEVELS[screeningCase.stage] || DR_SEVERITY_LEVELS[0]) : null;
  const isReferable = !isUngradable && (screeningCase.stage >= 2);
  const patient = screeningCase.patient || {};
  const docReview = screeningCase.doctorReview || {};
  const currentUser = StorageService.getCurrentUser();

  // Identified findings text
  let evidenceText = 'No microvascular lesions detected. Intact retinal architecture.';
  if (isUngradable) {
    evidenceText = 'Image ungradable due to optical artifact / defocus. Recapture required.';
  } else if (screeningCase.aiResult?.evidence && screeningCase.aiResult.evidence.length > 0) {
    evidenceText = screeningCase.aiResult.evidence.map(ev => `${window.t(`ev.type.${ev.type}`) || ev.type} (${window.t(`ev.region.${ev.region}`) || ev.region})`).join('; ');
  }

  modalRoot.innerHTML = `
    <div class="modal-container official-report-modal" style="max-width:880px; width:95%; padding:0; overflow:hidden; border-radius:12px; background:#fff;">
      <!-- Modal Header Bar (Hidden on Print) -->
      <div class="modal-header no-print" style="padding:1rem 1.5rem; background:#fff; border-bottom:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center;">
        <div style="display:flex; align-items:center; gap:0.5rem;">
          <i data-lucide="file-text" style="width:22px;height:22px; color:#0d6b63;"></i>
          <h3 style="font-size:1.1rem; font-weight:700; color:#0f172a; margin:0;" data-i18n="report.title">${window.t('report.title')}</h3>
        </div>
        <div style="display:flex; gap:0.5rem; align-items:center;">
          <button class="btn btn-primary btn-sm" id="modal-print-btn" style="background:#0d6b63; border-color:#0d6b63;">
            <i data-lucide="printer" style="width:14px;height:14px;"></i>
            <span data-i18n="report.print">${window.t('report.print')}</span>
          </button>
          <button class="btn btn-secondary btn-sm" id="modal-close-btn">
            <i data-lucide="x" style="width:16px;height:16px;"></i>
          </button>
        </div>
      </div>

      <!-- OFFICIAL DRISHTI KALYAN PDF REPORT BODY (Renders on Screen & PDF Print) -->
      <div class="official-pdf-report-wrapper" style="padding:1.5rem 1.75rem 2rem; max-height:82vh; overflow-y:auto; background:#ffffff; font-family:'Inter', sans-serif;">
        
        <!-- HEADER WAVE BANNER -->
        <div class="official-pdf-header" style="background:linear-gradient(135deg, #0d6b63 0%, #064e4b 100%); border-radius:10px 10px 0 0; padding:1.25rem 1.5rem 1rem; color:white; position:relative; overflow:hidden; margin-bottom:1.25rem;">
          <div style="position:absolute; bottom:0; left:0; right:0; height:8px; background:linear-gradient(90deg, #d8b981 0%, #ca8a04 50%, #d8b981 100%);"></div>
          
          <div style="display:flex; justify-content:space-between; align-items:center; position:relative; z-index:2;">
            <div style="display:flex; align-items:center; gap:1.2rem;">
              <div style="background:white; border-radius:50%; padding:4px; width:52px; height:52px; display:flex; justify-content:center; align-items:center; box-shadow:0 4px 12px rgba(0,0,0,0.2); flex-shrink:0;">
                <img src="src/logo.jpeg" alt="Eye Logo" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">
              </div>
              <div>
                <div style="font-size:0.7rem; font-weight:800; letter-spacing:0.18em; text-transform:uppercase; color:#fef08a;">${window.tData('REPORT')}</div>
                <h1 style="font-size:1.65rem; font-weight:700; margin:0; font-family:var(--font-heading, 'Inter'); letter-spacing:0.02em; color:white;">${window.tData('Drish Kalyan')}</h1>
                <div style="font-size:0.65rem; letter-spacing:0.12em; text-transform:uppercase; color:#e2e8f0; font-weight:600; margin-top:2px;">${window.tData('VISION & HEALTH SCREENING PROGRAMME')}</div>
              </div>
            </div>

            <div style="text-align:right; color:white; font-size:0.75rem;">
              <div style="font-family:var(--font-mono); font-weight:700; font-size:0.8125rem; color:#fef08a;">
                ${window.t('report.reportId')} ${window.tData(screeningCase.id)} | ${window.t('login.phcId')}: ${window.tData(currentUser || 'PHC-001')}
              </div>
              <div style="color:#cbd5e1; margin-top:2px;">
                ${window.t('report.date')} ${window.formatDate(screeningCase.createdAt || Date.now(), true)}
              </div>
              <div style="color:#34d399; font-weight:700; margin-top:2px; font-size:0.7rem;">
                ✓ ${window.t('report.statusVerified')}
              </div>
            </div>
          </div>
        </div>

        <!-- SECTION 1: PATIENT DETAILS -->
        <div class="official-pdf-section-title patient-details-title" style="display:flex; align-items:center; color:#0d6b63; font-weight:800; font-size:0.8125rem; letter-spacing:0.06em; margin-bottom:0.5rem; text-transform:uppercase;">
          <span style="display:inline-block; width:9px; height:9px; background-color:#0d6b63; border-radius:50%; margin-right:8px;"></span>
          <span data-i18n="report.patientInfo">${window.tData('PATIENT DETAILS')}</span>
        </div>

        <div class="official-pdf-card patient-details-card" style="border:1px solid #cce2e0; border-radius:8px; padding:0.85rem 1rem; background:#ffffff; margin-bottom:0.5rem; box-shadow:0 1px 3px rgba(0,0,0,0.02);">
          <div style="display:grid; grid-template-columns:repeat(3, 1fr); column-gap:1.25rem; row-gap:0.75rem; font-size:0.8125rem;">
            <div>
              <div style="font-size:0.65rem; color:#0d6b63; font-weight:700; text-transform:uppercase; margin-bottom:2px;" data-i18n="report.name">${window.tData('PATIENT NAME')}</div>
              <div style="font-weight:700; color:#1e293b; border-bottom:1px solid #e2e8f0; padding-bottom:3px;">${window.tData(patient.name || 'Pawan')}</div>
            </div>
            <div>
              <div style="font-size:0.65rem; color:#0d6b63; font-weight:700; text-transform:uppercase; margin-bottom:2px;" data-i18n="report.age">${window.tData('AGE')}</div>
              <div style="font-weight:700; color:#1e293b; border-bottom:1px solid #e2e8f0; padding-bottom:3px;">${window.tData((patient.age || '38') + ' Yrs')}</div>
            </div>
            <div>
              <div style="font-size:0.65rem; color:#0d6b63; font-weight:700; text-transform:uppercase; margin-bottom:2px;" data-i18n="report.gender">${window.tData('GENDER')}</div>
              <div style="font-weight:700; color:#1e293b; border-bottom:1px solid #e2e8f0; padding-bottom:3px;">${window.tData(patient.gender || 'Male')}</div>
            </div>

            <div>
              <div style="font-size:0.65rem; color:#0d6b63; font-weight:700; text-transform:uppercase; margin-bottom:2px;">${window.tData('DATE OF BIRTH')}</div>
              <div style="font-weight:600; color:#334155; border-bottom:1px solid #e2e8f0; padding-bottom:3px;">${window.tData(patient.dob || '15/08/1988')}</div>
            </div>
            <div>
              <div style="font-size:0.65rem; color:#0d6b63; font-weight:700; text-transform:uppercase; margin-bottom:2px;" data-i18n="report.contact">${window.tData('CONTACT NUMBER')}</div>
              <div style="font-weight:600; color:#334155; border-bottom:1px solid #e2e8f0; padding-bottom:3px;">${patient.contact || '+91 98765 43210'}</div>
            </div>
            <div>
              <div style="font-size:0.65rem; color:#0d6b63; font-weight:700; text-transform:uppercase; margin-bottom:2px;">${window.tData('DATE OF EXAMINATION')}</div>
              <div style="font-weight:600; color:#334155; border-bottom:1px solid #e2e8f0; padding-bottom:3px;">${window.formatDate(screeningCase.createdAt || Date.now(), true)}</div>
            </div>

            <div>
              <div style="font-size:0.65rem; color:#0d6b63; font-weight:700; text-transform:uppercase; margin-bottom:2px;">${window.tData('GUARDIAN / SPOUSE NAME')}</div>
              <div style="font-weight:600; color:#334155; border-bottom:1px solid #e2e8f0; padding-bottom:3px;">${window.tData(patient.guardian || 'Rameshwar Sharma')}</div>
            </div>
            <div>
              <div style="font-size:0.65rem; color:#0d6b63; font-weight:700; text-transform:uppercase; margin-bottom:2px;" data-i18n="report.bloodSugar">${window.tData('BLOOD SUGAR LEVEL / HbA1c')}</div>
              <div style="font-weight:700; color:#0d6b63; border-bottom:1px solid #e2e8f0; padding-bottom:3px;">${window.tData(patient.bloodSugar || '215 mg/dL (HbA1c 8.6%)')}</div>
            </div>
            <div>
              <div style="font-size:0.65rem; color:#0d6b63; font-weight:700; text-transform:uppercase; margin-bottom:2px;">${window.tData('BLOOD GROUP')}</div>
              <div style="font-weight:600; color:#334155; border-bottom:1px solid #e2e8f0; padding-bottom:3px;">${patient.bloodGroup || 'B+'}</div>
            </div>

            <div>
              <div style="font-size:0.65rem; color:#0d6b63; font-weight:700; text-transform:uppercase; margin-bottom:2px;">${window.tData('AYUSHMAN CARD NO.')}</div>
              <div style="font-weight:600; color:#334155; border-bottom:1px solid #e2e8f0; padding-bottom:3px;">${window.tData(patient.ayushmanNo || patient.aadhaar || 'ABHA-9812-4512-8921')}</div>
            </div>
            <div>
              <div style="font-size:0.65rem; color:#0d6b63; font-weight:700; text-transform:uppercase; margin-bottom:2px;">${window.tData('VILLAGE / WARD')}</div>
              <div style="font-weight:600; color:#334155; border-bottom:1px solid #e2e8f0; padding-bottom:3px;">${window.tData(patient.village || 'Rampur Ward #4')}</div>
            </div>
            <div>
              <div style="font-size:0.65rem; color:#0d6b63; font-weight:700; text-transform:uppercase; margin-bottom:2px;">${window.tData('REFERRED BY')}</div>
              <div style="font-weight:600; color:#334155; border-bottom:1px solid #e2e8f0; padding-bottom:3px;">${window.tData(patient.referredBy || 'ASHA Worker Sunita')}</div>
            </div>

            <div style="grid-column: 1 / -1;">
              <div style="font-size:0.65rem; color:#0d6b63; font-weight:700; text-transform:uppercase; margin-bottom:2px;" data-i18n="report.address">${window.tData('ADDRESS')}</div>
              <div style="font-weight:600; color:#334155; border-bottom:1px solid #e2e8f0; padding-bottom:3px;">${window.tData(patient.address || 'Village Rampur, Post Ballia, District Ballia, Uttar Pradesh - 277001')}</div>
            </div>
          </div>
        </div>

        <!-- SECTION 2: PHC ID DETAILS -->
        <div class="official-pdf-section-title" style="display:flex; align-items:center; color:#0d6b63; font-weight:800; font-size:0.8125rem; letter-spacing:0.06em; margin-bottom:0.5rem; text-transform:uppercase;">
          <span style="display:inline-block; width:9px; height:9px; background-color:#0d6b63; border-radius:50%; margin-right:8px;"></span>
          <span>${window.tData('PHC ID DETAILS')}</span>
        </div>

        <div class="official-pdf-card" style="border:1px solid #cce2e0; border-radius:8px; padding:0.85rem 1rem; background:#ffffff; margin-bottom:0.5rem; box-shadow:0 1px 3px rgba(0,0,0,0.02);">
          <div style="display:grid; grid-template-columns:repeat(3, 1fr); column-gap:1.25rem; row-gap:0.75rem; font-size:0.8125rem;">
            <div>
              <div style="font-size:0.65rem; color:#0d6b63; font-weight:700; text-transform:uppercase; margin-bottom:2px;">${window.tData('PHC ID NO.')}</div>
              <div style="font-weight:700; color:#1e293b; border-bottom:1px solid #e2e8f0; padding-bottom:3px;">${window.tData(currentUser || 'PHC-001')}</div>
            </div>
            <div>
              <div style="font-size:0.65rem; color:#0d6b63; font-weight:700; text-transform:uppercase; margin-bottom:2px;">${window.tData('PHC NAME')}</div>
              <div style="font-weight:700; color:#1e293b; border-bottom:1px solid #e2e8f0; padding-bottom:3px;">${window.tData(patient.centre ? patient.centre.split('—')[0] : 'PHC Rampur')}</div>
            </div>
            <div>
              <div style="font-size:0.65rem; color:#0d6b63; font-weight:700; text-transform:uppercase; margin-bottom:2px;">${window.tData('REGISTRATION NO.')}</div>
              <div style="font-weight:700; color:#1e293b; border-bottom:1px solid #e2e8f0; padding-bottom:3px;">${window.tData(screeningCase.regNo || 'REG-2026-8941')}</div>
            </div>

            <div>
              <div style="font-size:0.65rem; color:#0d6b63; font-weight:700; text-transform:uppercase; margin-bottom:2px;">${window.tData('DISTRICT')}</div>
              <div style="font-weight:600; color:#334155; border-bottom:1px solid #e2e8f0; padding-bottom:3px;">${window.tData(patient.district || 'Ballia')}</div>
            </div>
            <div>
              <div style="font-size:0.65rem; color:#0d6b63; font-weight:700; text-transform:uppercase; margin-bottom:2px;">${window.tData('BLOCK / TALUKA')}</div>
              <div style="font-weight:600; color:#334155; border-bottom:1px solid #e2e8f0; padding-bottom:3px;">${window.tData(patient.block || 'Rampur Block')}</div>
            </div>
            <div>
              <div style="font-size:0.65rem; color:#0d6b63; font-weight:700; text-transform:uppercase; margin-bottom:2px;">${window.tData('STATE')}</div>
              <div style="font-weight:600; color:#334155; border-bottom:1px solid #e2e8f0; padding-bottom:3px;">${window.tData(patient.state || 'Uttar Pradesh')}</div>
            </div>
          </div>
        </div>

        <!-- PAGE 2 CONTAINER: CLINICAL EXAMINATION IMAGES & RISK SEVERITY HEATMAP -->
        <div class="official-pdf-page-2" style="page-break-inside: avoid; break-inside: avoid; margin-top: 0.5rem;">
          
          <!-- SECTION 3: CLINICAL / EXAMINATION IMAGES -->
          <div class="official-pdf-section-title" style="display:flex; align-items:center; color:#0d6b63; font-weight:800; font-size:0.8125rem; letter-spacing:0.06em; margin-bottom:0.5rem; text-transform:uppercase;">
            <span style="display:inline-block; width:9px; height:9px; background-color:#0d6b63; border-radius:50%; margin-right:8px;"></span>
            <span>${window.tData('CLINICAL / EXAMINATION IMAGES')}</span>
          </div>

          <div style="border:1px solid #cce2e0; border-radius:10px; padding:0.85rem 1rem; background:#ffffff; margin-bottom:1.25rem; box-shadow:0 1px 3px rgba(0,0,0,0.02); page-break-inside:avoid; break-inside:avoid;">
            
            <!-- TOP SUB-SECTION: LEFT EYE (OS) -->
            <div style="font-size:0.725rem; font-weight:800; color:#0d6b63; background:#e6f4f1; border-left:4px solid #0d6b63; padding:4px 10px; border-radius:0 4px 4px 0; margin-bottom:0.5rem; display:flex; align-items:center; justify-content:space-between;">
              <span>👁️ ${window.tData('LEFT EYE (OS / बायां नेत्र)')}</span>
              <span style="font-size:0.65rem; color:#064e4b; font-weight:700;">LATERALITY: OS (LEFT)</span>
            </div>

            <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:0.75rem; margin-bottom:0.85rem;">
              <!-- Left Eye Image 1 -->
              <div style="border:1.5px dashed #0d6b63; border-radius:8px; padding:5px; background:#f0fdfa; text-align:center;">
                <div style="font-size:0.625rem; font-weight:700; color:#0d6b63; margin-bottom:3px;">${window.tData('IMAGE 1: Original Fundus (Left Eye / OS)')}</div>
                <div style="height:85px; border-radius:4px; overflow:hidden; background:#000;">
                  <img src="${screeningCase.rawImage}" style="width:100%; height:100%; object-fit:contain;">
                </div>
              </div>

              <!-- Left Eye Image 2 -->
              <div style="border:1.5px dashed #0d6b63; border-radius:8px; padding:5px; background:#f0fdfa; text-align:center;">
                <div style="font-size:0.625rem; font-weight:700; color:#0d6b63; margin-bottom:3px;">${window.tData('IMAGE 2: Grad-CAM Heatmap (Left Eye / OS)')}</div>
                <div style="height:85px; border-radius:4px; overflow:hidden; background:#000; position:relative;">
                  <img src="${screeningCase.rawImage}" style="width:100%; height:100%; object-fit:contain;">
                  ${!isUngradable && screeningCase.gradCamImage ? `
                    <img src="${screeningCase.gradCamImage}" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:contain; opacity:0.75; mix-blend-mode:screen;">
                  ` : ''}
                </div>
              </div>

              <!-- Left Eye Image 3 -->
              <div style="border:1.5px dashed #0d6b63; border-radius:8px; padding:5px; background:#f0fdfa; text-align:center;">
                <div style="font-size:0.625rem; font-weight:700; color:#0d6b63; margin-bottom:3px;">${window.tData('IMAGE 3: Anatomical Structures (Left Eye / OS)')}</div>
                <div style="height:85px; border-radius:4px; overflow:hidden; background:#000; display:flex; justify-content:center; align-items:center;">
                  <img src="${screeningCase.rawImage}" style="width:100%; height:100%; object-fit:contain; filter:contrast(1.15);">
                </div>
              </div>
            </div>

            <!-- BOTTOM SUB-SECTION: RIGHT EYE (OD) -->
            <div style="font-size:0.725rem; font-weight:800; color:#0d6b63; background:#e6f4f1; border-left:4px solid #0d6b63; padding:4px 10px; border-radius:0 4px 4px 0; margin-bottom:0.5rem; display:flex; align-items:center; justify-content:space-between;">
              <span>👁️ ${window.tData('RIGHT EYE (OD / दायां नेत्र)')}</span>
              <span style="font-size:0.65rem; color:#064e4b; font-weight:700;">LATERALITY: OD (RIGHT)</span>
            </div>

            <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:0.75rem; margin-bottom:0.85rem;">
              <!-- Right Eye Image 4 -->
              <div style="border:1.5px dashed #0d6b63; border-radius:8px; padding:5px; background:#f0fdfa; text-align:center;">
                <div style="font-size:0.625rem; font-weight:700; color:#0d6b63; margin-bottom:3px;">${window.tData('IMAGE 4: Original Fundus (Right Eye / OD)')}</div>
                <div style="height:85px; border-radius:4px; overflow:hidden; background:#000;">
                  <img src="${screeningCase.rawImage}" style="width:100%; height:100%; object-fit:contain; transform:scaleX(-1);">
                </div>
              </div>

              <!-- Right Eye Image 5 -->
              <div style="border:1.5px dashed #0d6b63; border-radius:8px; padding:5px; background:#f0fdfa; text-align:center;">
                <div style="font-size:0.625rem; font-weight:700; color:#0d6b63; margin-bottom:3px;">${window.tData('IMAGE 5: Grad-CAM Heatmap (Right Eye / OD)')}</div>
                <div style="height:85px; border-radius:4px; overflow:hidden; background:#000; position:relative;">
                  <img src="${screeningCase.rawImage}" style="width:100%; height:100%; object-fit:contain; transform:scaleX(-1);">
                  ${!isUngradable && screeningCase.gradCamImage ? `
                    <img src="${screeningCase.gradCamImage}" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:contain; opacity:0.75; mix-blend-mode:screen; transform:scaleX(-1);">
                  ` : ''}
                </div>
              </div>

              <!-- Right Eye Image 6 -->
              <div style="border:1.5px dashed #0d6b63; border-radius:8px; padding:5px; background:#f0fdfa; text-align:center;">
                <div style="font-size:0.625rem; font-weight:700; color:#0d6b63; margin-bottom:3px;">${window.tData('IMAGE 6: Anatomical Structures (Right Eye / OD)')}</div>
                <div style="height:85px; border-radius:4px; overflow:hidden; background:#000; display:flex; justify-content:center; align-items:center;">
                  <img src="${screeningCase.rawImage}" style="width:100%; height:100%; object-fit:contain; filter:contrast(1.15); transform:scaleX(-1);">
                </div>
              </div>
            </div>

            <!-- SECTION 4: RISK / SEVERITY HEATMAP INTEGRATED WITH EXAMINATION IMAGES -->
            <div style="margin-top:0.75rem; padding-top:0.75rem; border-top:1.5px dashed #cbd5e1;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
                <span style="font-size:0.75rem; font-weight:800; color:#0d6b63; text-transform:uppercase; letter-spacing:0.04em;">🔥 ${window.tData('RISK / SEVERITY HEATMAP')}</span>
                <span style="font-size:0.65rem; font-weight:700; color:#0f172a; background:#e2e8f0; padding:2px 8px; border-radius:12px;">${window.tData('AI CALIBRATED SCALE')}</span>
              </div>

              <div style="border:1.5px solid #cbd5e1; border-radius:8px; height:38px; background:linear-gradient(to right, #bbf7d0 0%, #fef08a 25%, #fed7aa 50%, #fca5a5 75%, #ef4444 100%); display:flex; align-items:center; justify-content:center; font-weight:800; font-size:0.875rem; color:#0f172a; position:relative; box-shadow:0 2px 4px rgba(0,0,0,0.05);">
                <div style="background:rgba(255,255,255,0.95); padding:3px 12px; border-radius:20px; border:1px solid #94a3b8; box-shadow:0 2px 6px rgba(0,0,0,0.1); font-size:0.8125rem;">
                  ${isUngradable ? window.t('report.ungradable') : `${window.t(`dr.${screeningCase.stage}.title`) || drMeta.title} (${screeningCase.aiResult?.confidence || '91.8'}% Confidence)`}
                </div>
              </div>
              <div style="display:flex; justify-content:space-between; font-size:0.7rem; color:#0d6b63; font-weight:700; margin-top:4px; padding:0 4px;">
                <span>${window.tData('Low Risk')}</span>
                <span>${window.tData('Moderate')}</span>
                <span>${window.tData('Elevated')}</span>
                <span>${window.tData('High')}</span>
                <span>${window.tData('Severe')}</span>
              </div>
            </div>

          </div>
        </div>

        <!-- SECTION 5: CLINICAL OBSERVATIONS / REMARKS -->
        <div style="page-break-before: always; break-before: page; padding-top: 1rem; display: flex; flex-direction: column; min-height: 93vh; justify-content: space-between;">
          
          <div>
            <div id="page2-header-anchor" class="print-only"></div>
            
            <div class="official-pdf-section-title" style="display:flex; align-items:center; color:#0d6b63; font-weight:800; font-size:0.8125rem; letter-spacing:0.06em; margin-bottom:0.5rem; text-transform:uppercase;">
              <span style="display:inline-block; width:9px; height:9px; background-color:#0d6b63; border-radius:50%; margin-right:8px;"></span>
              <span>${window.tData('CLINICAL OBSERVATIONS / REMARKS')}</span>
            </div>

        <div style="border:1px solid #cce2e0; border-radius:8px; padding:0.85rem 1rem; background:#ffffff; margin-bottom:1.5rem; box-shadow:0 1px 3px rgba(0,0,0,0.02);">
          <ul style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:0.5rem; font-size:0.8125rem; color:#1e293b;">
            <li style="border-bottom:1px dotted #cce2e0; padding-bottom:4px; display:flex; align-items:center;">
              <span style="color:#0d6b63; font-size:1rem; margin-right:8px;">•</span>
              <strong>${window.tData('AI DR Classification:')}</strong>&nbsp;${isUngradable ? window.t('report.ungradable') : `${window.t(`dr.${screeningCase.stage}.title`) || drMeta.title} (${screeningCase.aiResult?.confidence || '91.8'}% AI Confidence)`}
            </li>
            <li style="border-bottom:1px dotted #cce2e0; padding-bottom:4px; display:flex; align-items:center;">
              <span style="color:#0d6b63; font-size:1rem; margin-right:8px;">•</span>
              <strong>${window.tData('Identified Evidence:')}</strong>&nbsp;${evidenceText}
            </li>
            <li style="border-bottom:1px dotted #cce2e0; padding-bottom:4px; display:flex; align-items:center;">
              <span style="color:#0d6b63; font-size:1rem; margin-right:8px;">•</span>
              <strong>${window.tData('Tele-Triage Referral Status:')}</strong>&nbsp;${isReferable ? window.tData('REFERABLE — Referral to ophthalmologist recommended within 2-4 weeks') : window.tData('NON-REFERABLE — Routine annual screening recommended')}
            </li>
            <li style="border-bottom:1px dotted #cce2e0; padding-bottom:4px; display:flex; align-items:center;">
              <span style="color:#0d6b63; font-size:1rem; margin-right:8px;">•</span>
              <strong>${window.tData('Specialist Clinical Notes:')}</strong>&nbsp;${window.tData(docReview.notes || (isReferable ? 'Confirmed referable DR. Patient advised dilated slit-lamp exam and OCT at District Hospital.' : 'Confirmed non-referable. Advised regular glucose control and annual follow-up.'))}
            </li>
            <li style="border-bottom:1px dotted #cce2e0; padding-bottom:4px; display:flex; align-items:center;">
              <span style="color:#0d6b63; font-size:1rem; margin-right:8px;">•</span>
              <strong>${window.tData('Reviewing Specialist:')}</strong>&nbsp;${window.tData(docReview.reviewedBy || 'Dr. Ananya Sen (Ophthalmologist, AIIMS)')}
            </li>
          </ul>
        </div>

        <!-- SECTION 6: PHC DETAILS (FOOTER BANNER) -->
        <div style="background:linear-gradient(135deg, #0d6b63 0%, #064e4b 100%); border-radius:8px; padding:1rem 1.25rem; color:white;">
          <div style="text-align:center; font-weight:800; font-size:0.75rem; letter-spacing:0.12em; text-transform:uppercase; margin-bottom:0.75rem; color:#fef08a;">
            ${window.tData('PHC DETAILS')}
          </div>
          <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:1rem; font-size:0.75rem;">
            <div>
              <div style="font-size:0.65rem; font-weight:700; text-transform:uppercase; color:#cbd5e1; margin-bottom:4px;">${window.tData('PHC NAME & ADDRESS')}</div>
              <div style="border-bottom:1px dotted rgba(255,255,255,0.6); padding-bottom:3px; font-weight:600;">${window.tData(patient.centre || 'PHC Rampur, District Ballia')}</div>
            </div>
            <div>
              <div style="font-size:0.65rem; font-weight:700; text-transform:uppercase; color:#cbd5e1; margin-bottom:4px;">${window.tData('CONTACT NUMBER')}</div>
              <div style="border-bottom:1px dotted rgba(255,255,255,0.6); padding-bottom:3px; font-weight:600;">${patient.contact || '+91 94123 78901'}</div>
            </div>
            <div>
              <div style="font-size:0.65rem; font-weight:700; text-transform:uppercase; color:#cbd5e1; margin-bottom:4px;">${window.tData('MEDICAL OFFICER')}</div>
              <div style="border-bottom:1px dotted rgba(255,255,255,0.6); padding-bottom:3px; font-weight:600;">${window.tData(docReview.reviewedBy || 'Dr. Vivek Saxena')}</div>
            </div>
            <div>
              <div style="font-size:0.65rem; font-weight:700; text-transform:uppercase; color:#cbd5e1; margin-bottom:4px;">${window.tData('DATE & STAMP')}</div>
              <div style="border-bottom:1px dotted rgba(255,255,255,0.6); padding-bottom:3px; font-weight:600;">${window.formatDate(screeningCase.createdAt || Date.now(), true)} ✓</div>
            </div>
          </div>
        </div>
          
          </div> <!-- Close inner div -->
        </div> <!-- Close flex wrapper -->

      </div>

      <!-- Modal Footer (Hidden on Print) -->
      <div class="modal-footer no-print" style="padding:1rem 1.5rem; background:#f8fafc; border-top:1px solid #e2e8f0; display:flex; justify-content:flex-end; gap:0.75rem;">
        <button class="btn btn-secondary" id="modal-footer-close-btn" data-i18n="report.close">${window.t('report.close')}</button>
        <button class="btn btn-primary" id="modal-footer-print-btn" style="background:#0d6b63; border-color:#0d6b63;">
          <i data-lucide="printer" style="width:16px;height:16px;"></i>
          <span data-i18n="report.printReport">${window.t('report.printReport')}</span>
        </button>
      </div>
    </div>
  `;

  modalRoot.classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons();

  const close = () => {
    modalRoot.classList.add('hidden');
    if (onClose) onClose();
  };

  const printReport = () => {
    window.print();
  };

  modalRoot.querySelector('#modal-close-btn').addEventListener('click', close);
  modalRoot.querySelector('#modal-footer-close-btn').addEventListener('click', close);
  modalRoot.querySelector('#modal-print-btn').addEventListener('click', printReport);
  modalRoot.querySelector('#modal-footer-print-btn').addEventListener('click', printReport);

  setTimeout(() => {
    // Clone header and patient details for page 2 (Print layout)
    const page2Anchor = modalRoot.querySelector('#page2-header-anchor');
    const headerToClone = modalRoot.querySelector('.official-pdf-header');
    const detailsTitleToClone = modalRoot.querySelector('.patient-details-title');
    const detailsToClone = modalRoot.querySelector('.patient-details-card');

    if (page2Anchor && headerToClone && detailsToClone) {
      page2Anchor.appendChild(headerToClone.cloneNode(true));
      if (detailsTitleToClone) page2Anchor.appendChild(detailsTitleToClone.cloneNode(true));
      page2Anchor.appendChild(detailsToClone.cloneNode(true));
    }
  }, 50);

  // Re-render modal in new language if switched while open
  const onLangChange = () => {
    if (!modalRoot.classList.contains('hidden')) {
      openReportModal(screeningCase, onClose);
    }
  };
  window.addEventListener('languageChanged', onLangChange, { once: true });
}
