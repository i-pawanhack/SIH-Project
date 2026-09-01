/**
 * RetinaXAI — Ophthalmologist Tele-Review Portal Component
 * Allows certified eye specialists to review AI predictions, inspect Grad-CAM heatmaps,
 * modify DR severity grades, record clinical notes, and sign off on referrals.
 */

import { StorageService } from '../services/storageService.js';
import { DR_SEVERITY_LEVELS } from '../types.js';

export function renderDoctorReviewView(container, onOpenReport) {
  let screenings = StorageService.getScreenings();
  let selectedCaseId = screenings.length > 0 ? screenings[0].id : null;
  let activeFilter = 'PENDING'; // 'ALL', 'PENDING', 'REFERABLE'

  function updateView() {
    screenings = StorageService.getScreenings();
    const currentCase = screenings.find(c => c.id === selectedCaseId) || screenings[0] || null;

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
        <div>
          <h1 style="font-size:1.75rem; color:var(--slate-900);">Ophthalmologist Tele-Review Portal</h1>
          <p style="color:var(--slate-600); font-size:0.875rem; margin-top:0.25rem;">
            Clinical decision support interface for certified eye specialists. Specialist sign-off holds legal and diagnostic precedence over AI predictions.
          </p>
        </div>

        <div style="display:flex; gap:0.5rem;">
          <button class="btn btn-secondary btn-sm filter-tab ${activeFilter === 'PENDING' ? 'btn-primary' : ''}" data-filter="PENDING">
            Pending Queue
          </button>
          <button class="btn btn-secondary btn-sm filter-tab ${activeFilter === 'REFERABLE' ? 'btn-primary' : ''}" data-filter="REFERABLE">
            Urgent Referrals
          </button>
          <button class="btn btn-secondary btn-sm filter-tab ${activeFilter === 'ALL' ? 'btn-primary' : ''}" data-filter="ALL">
            All Cases (${screenings.length})
          </button>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:340px 1fr; gap:1.5rem; align-items:start;">
        
        <!-- LEFT: CASE INBOX LIST -->
        <div class="card" style="padding:1rem;">
          <div style="font-size:0.8125rem; font-weight:700; color:var(--slate-700); margin-bottom:0.75rem; display:flex; justify-content:space-between; align-items:center;">
            <span>Tele-Review Queue</span>
            <span class="badge" style="background:#e0f2fe; color:#0369a1;">${screenings.length} Cases</span>
          </div>

          <div style="display:flex; flex-direction:column; gap:0.5rem; max-height:650px; overflow-y:auto; padding-right:0.25rem;">
            ${renderInboxCards()}
          </div>
        </div>

        <!-- RIGHT: CASE INSPECTION & OVERRIDE WORKSPACE -->
        <div id="doctor-workspace">
          ${currentCase ? renderWorkspace(currentCase) : `
            <div class="card" style="text-align:center; padding:3rem; color:var(--slate-500);">
              <i data-lucide="inbox" style="width:48px;height:48px; margin:0 auto 1rem; opacity:0.3;"></i>
              Select a patient case from the queue to start clinical review.
            </div>
          `}
        </div>

      </div>
    `;

    // Attach Listeners
    container.querySelectorAll('.filter-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        activeFilter = tab.getAttribute('data-filter');
        updateView();
      });
    });

    container.querySelectorAll('.inbox-case-item').forEach(item => {
      item.addEventListener('click', () => {
        selectedCaseId = item.getAttribute('data-id');
        updateView();
      });
    });

    if (currentCase) {
      attachWorkspaceListeners(currentCase);
    }

    if (window.lucide) window.lucide.createIcons();
  }

  function renderInboxCards() {
    const filtered = screenings.filter(c => {
      if (activeFilter === 'PENDING') return c.doctorReview?.status !== 'Reviewed';
      if (activeFilter === 'REFERABLE') return c.aiResult?.referable || c.stage >= 2;
      return true;
    });

    if (filtered.length === 0) {
      return `
        <div style="text-align:center; padding:2rem 1rem; color:var(--slate-400); font-size:0.8125rem;">
          No cases found in this filter category.
        </div>
      `;
    }

    return filtered.map(c => {
      const isSelected = c.id === selectedCaseId;
      const isUngradable = c.isUngradable || c.imageQuality?.overall === 'UNGRADABLE';
      const drMeta = !isUngradable ? (DR_SEVERITY_LEVELS[c.stage] || DR_SEVERITY_LEVELS[0]) : null;
      const isReviewed = c.doctorReview?.status === 'Reviewed';

      return `
        <div class="inbox-case-item" data-id="${c.id}" style="padding:0.75rem; border-radius:var(--radius-md); border:1px solid ${isSelected ? 'var(--primary-600)' : 'var(--border-card)'}; background:${isSelected ? 'var(--primary-50)' : 'white'}; cursor:pointer; transition:all var(--transition-fast);">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.25rem;">
            <span style="font-weight:700; font-size:0.875rem; color:var(--slate-900);">${c.patient?.name || 'Patient'}</span>
            <span class="badge" style="font-size:0.6875rem; background:${isReviewed ? '#dcfce7' : '#fef3c7'}; color:${isReviewed ? '#15803d' : '#b45309'};">
              ${isReviewed ? 'Reviewed' : 'Pending'}
            </span>
          </div>
          <div style="font-size:0.75rem; color:var(--slate-500); font-family:var(--font-mono); margin-bottom:0.4rem;">
            ${c.patient?.id || c.id} • ${c.patient?.age || '--'}y
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            ${isUngradable 
              ? `<span class="badge badge-quality-ungradable" style="font-size:0.7rem;">Ungradable</span>` 
              : `<span class="badge ${drMeta.badgeClass}" style="font-size:0.7rem;">${drMeta.shortName}</span>`
            }
            <span style="font-size:0.7rem; color:var(--slate-500);">
              ${new Date(c.createdAt || Date.now()).toLocaleDateString('en-IN', { day:'2-digit', month:'short' })}
            </span>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderWorkspace(c) {
    const isUngradable = c.isUngradable || c.imageQuality?.overall === 'UNGRADABLE';
    const drMeta = !isUngradable ? (DR_SEVERITY_LEVELS[c.stage] || DR_SEVERITY_LEVELS[0]) : null;
    const docReview = c.doctorReview || {};
    const isDoctorReviewed = docReview.status === 'Reviewed';

    return `
      <div style="display:flex; flex-direction:column; gap:1.25rem;">
        
        <!-- Case Header -->
        <div class="card" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
          <div>
            <div style="display:flex; align-items:center; gap:0.5rem;">
              <h2 style="font-size:1.3rem; color:var(--slate-900);">${c.patient?.name || 'Patient'}</h2>
              <span class="badge" style="background:var(--slate-100); color:var(--slate-700); font-family:var(--font-mono);">${c.patient?.id || c.id}</span>
            </div>
            <div style="font-size:0.8125rem; color:var(--slate-500); margin-top:0.2rem;">
              Age: ${c.patient?.age || '--'}y • Gender: ${c.patient?.gender || '--'} • Duration: ${c.patient?.diabetesDuration || '--'} • Facility: ${c.patient?.centre || 'PHC'}
            </div>
          </div>

          <div style="display:flex; gap:0.5rem;">
            <button class="btn btn-secondary btn-sm" id="doc-view-full-report-btn">
              <i data-lucide="file-text" style="width:14px;height:14px;"></i>
              View Official Report
            </button>
          </div>
        </div>

        <!-- Visual Inspection Comparison -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">
              <i data-lucide="eye" style="width:20px;height:20px; color:var(--primary-600);"></i>
              Diagnostic Fundus & Grad-CAM Inspection
            </h3>
            <div style="display:flex; gap:0.3rem;">
              <button class="btn btn-primary btn-sm doc-img-mode" data-mode="original">Original</button>
              <button class="btn btn-secondary btn-sm doc-img-mode" data-mode="gradcam">Grad-CAM Overlay</button>
            </div>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1.5rem; align-items:center;">
            <div style="background:#020617; border-radius:var(--radius-xl); padding:1rem; text-align:center;">
              <div style="position:relative; width:280px; height:280px; margin:0 auto; border-radius:var(--radius-lg); overflow:hidden;">
                <img id="doc-fundus-img" src="${c.rawImage}" style="width:100%; height:100%; object-fit:contain;">
                ${c.gradCamImage ? `
                  <img id="doc-gradcam-img" src="${c.gradCamImage}" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:contain; opacity:0; mix-blend-mode:screen; transition:opacity 0.2s;">
                ` : ''}
              </div>
            </div>

            <!-- AI Summary Side -->
            <div>
              <div style="font-size:0.8125rem; font-weight:700; color:var(--slate-500); text-transform:uppercase; margin-bottom:0.4rem;">
                AI Screening Output
              </div>
              <div style="background:var(--slate-50); border:1px solid var(--border-card); border-radius:var(--radius-md); padding:1rem; margin-bottom:1rem;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
                  <span style="font-weight:700; color:var(--slate-900); font-size:1.1rem;">
                    ${isUngradable ? 'UNGADABLE IMAGE' : drMeta.title}
                  </span>
                  ${!isUngradable ? `
                    <span class="badge ${drMeta.badgeClass}">${drMeta.shortName}</span>
                  ` : ''}
                </div>
                <div style="font-size:0.8125rem; color:var(--slate-600);">
                  ${isUngradable ? 'Defocus / blur obscured retinal microvasculature.' : drMeta.description}
                </div>
                ${!isUngradable ? `
                  <div style="margin-top:0.5rem; font-size:0.75rem; color:var(--slate-500);">
                    Model Confidence: <strong>${c.aiResult?.confidence || '91.8'}%</strong> • Referable: <strong>${c.aiResult?.referable ? 'YES' : 'NO'}</strong>
                  </div>
                ` : ''}
              </div>

              <div style="font-size:0.75rem; color:var(--slate-500); font-style:italic;">
                Notice: AI prediction is non-binding decision-support. Select doctor final grading below.
              </div>
            </div>
          </div>
        </div>

        <!-- DOCTOR CLINICAL DECISION FORM -->
        <div class="card" style="border:2px solid var(--primary-600);">
          <div class="card-header">
            <h3 class="card-title" style="color:var(--primary-800);">
              <i data-lucide="stethoscope" style="width:20px;height:20px; color:var(--primary-600);"></i>
              Ophthalmologist Final Clinical Assessment
            </h3>
            ${isDoctorReviewed ? `
              <span class="badge" style="background:#dcfce7; color:#15803d; font-size:0.8125rem;">
                <i data-lucide="check-check" style="width:14px;height:14px;"></i>
                Signed by ${docReview.reviewedBy || 'Specialist'}
              </span>
            ` : `
              <span class="badge" style="background:#fef3c7; color:#b45309; font-size:0.8125rem;">
                Pending Sign-Off
              </span>
            `}
          </div>

          <form id="doc-review-form" style="display:flex; flex-direction:column; gap:1.25rem;">
            
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:1rem;">
              <!-- Doctor DR Grade Override -->
              <div class="form-group">
                <label class="form-label">Doctor Confirmed DR Grade</label>
                <select id="doc-dr-grade" class="form-select" style="font-weight:700;">
                  <option value="0" ${docReview.doctorGrade === 0 || (!isDoctorReviewed && c.stage === 0) ? 'selected' : ''}>Level 0 — No Apparent DR</option>
                  <option value="1" ${docReview.doctorGrade === 1 || (!isDoctorReviewed && c.stage === 1) ? 'selected' : ''}>Level 1 — Mild NPDR</option>
                  <option value="2" ${docReview.doctorGrade === 2 || (!isDoctorReviewed && c.stage === 2) ? 'selected' : ''}>Level 2 — Moderate NPDR</option>
                  <option value="3" ${docReview.doctorGrade === 3 || (!isDoctorReviewed && c.stage === 3) ? 'selected' : ''}>Level 3 — Severe NPDR</option>
                  <option value="4" ${docReview.doctorGrade === 4 || (!isDoctorReviewed && c.stage === 4) ? 'selected' : ''}>Level 4 — Proliferative DR</option>
                  <option value="UNGRADABLE" ${docReview.doctorGrade === 'UNGRADABLE' || isUngradable ? 'selected' : ''}>Mark as UNGRADABLE (Recapture)</option>
                </select>
              </div>

              <!-- Refer Patient Checkbox -->
              <div class="form-group" style="justify-content:center;">
                <label class="form-label">Tertiary Referral Action</label>
                <label style="display:flex; align-items:center; gap:0.5rem; font-size:0.875rem; font-weight:600; color:var(--slate-800); cursor:pointer;">
                  <input type="checkbox" id="doc-refer-check" ${(docReview.referPatient !== false && (c.stage >= 2 || docReview.doctorGrade >= 2)) ? 'checked' : ''} style="width:18px;height:18px; accent-color:var(--primary-600);">
                  Refer Patient to District Hospital / Vitreoretinal OPD
                </label>
              </div>
            </div>

            <!-- Clinical Notes Field -->
            <div class="form-group">
              <label class="form-label">Specialist Clinical Notes & Referral Instructions</label>
              <textarea id="doc-notes-text" class="form-textarea" rows="3" placeholder="Enter findings, recommended follow-up interval, or OCT/fluorescein angiography instructions...">${docReview.notes || (c.stage >= 2 ? 'Patient has moderate to severe diabetic retinopathy findings. Recommend comprehensive slit lamp biomicroscopy and macular OCT.' : 'No urgent pathology detected. Maintain regular HbA1c control and repeat retinal screening in 12 months.')}</textarea>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-card); padding-top:1rem;">
              <div style="font-size:0.75rem; color:var(--slate-500);">
                Signing as: <strong>Dr. Ananya Sen, MS (Ophthalmology) — AIIMS Tele-Ophthalmology Network</strong>
              </div>

              <button type="submit" class="btn btn-primary btn-lg" id="doc-submit-btn">
                <i data-lucide="check-circle-2" style="width:18px;height:18px;"></i>
                Sign & Submit Final Clinical Decision
              </button>
            </div>

          </form>
        </div>

      </div>
    `;
  }

  function attachWorkspaceListeners(c) {
    const reportBtn = container.querySelector('#doc-view-full-report-btn');
    if (reportBtn) {
      reportBtn.addEventListener('click', () => onOpenReport(c));
    }

    // GradCAM Toggle Buttons
    const gradcamImg = container.querySelector('#doc-gradcam-img');
    container.querySelectorAll('.doc-img-mode').forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-mode');
        container.querySelectorAll('.doc-img-mode').forEach(b => b.className = 'btn btn-secondary btn-sm doc-img-mode');
        btn.className = 'btn btn-primary btn-sm doc-img-mode';
        if (gradcamImg) {
          gradcamImg.style.opacity = mode === 'gradcam' ? '0.75' : '0';
        }
      });
    });

    // Review Form Submit
    const form = container.querySelector('#doc-review-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const gradeVal = container.querySelector('#doc-dr-grade').value;
        const referVal = container.querySelector('#doc-refer-check').checked;
        const notesVal = container.querySelector('#doc-notes-text').value;

        const updatedReview = {
          status: 'Reviewed',
          reviewedBy: 'Dr. Ananya Sen, MS (AIIMS Tele-Ophthalmology)',
          reviewedAt: new Date().toISOString(),
          doctorGrade: gradeVal === 'UNGRADABLE' ? 'UNGRADABLE' : parseInt(gradeVal, 10),
          referPatient: referVal,
          notes: notesVal
        };

        StorageService.updateDoctorReview(c.id, updatedReview);
        alert(`Clinical review for Case ${c.id} successfully recorded and synced!`);
        updateView();
      });
    }
  }

  updateView();
}
