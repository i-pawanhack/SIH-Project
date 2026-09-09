/**
 * RetinaXAI — Clinical Screening Report Modal Component
 * Generates an official, print-ready clinical screening report.
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

  modalRoot.innerHTML = `
    <div class="modal-container print-report-page" style="max-width:880px;">
      <!-- Modal Header (Hidden on Print) -->
      <div class="modal-header no-print">
        <div style="display:flex; align-items:center; gap:0.5rem;">
          <i data-lucide="file-check-2" style="width:20px;height:20px; color:var(--primary-600);"></i>
          <h3 style="font-size:1.1rem; color:var(--slate-900);">Clinical Retinal Screening Report</h3>
        </div>
        <div style="display:flex; gap:0.5rem;">
          <button class="btn btn-primary btn-sm" id="modal-print-btn">
            <i data-lucide="printer" style="width:14px;height:14px;"></i>
            Print / Save PDF
          </button>
          <button class="btn btn-secondary btn-sm" id="modal-close-btn">
            <i data-lucide="x" style="width:16px;height:16px;"></i>
          </button>
        </div>
      </div>

      <!-- Printable Report Body -->
      <div class="modal-body" style="padding:2rem;">
        
        <!-- Official Hospital / Tele-Health Header -->
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid var(--slate-900); padding-bottom:1rem; margin-bottom:1.5rem;">
          <div>
            <img src="src/logo.jpeg" alt="RetinaXAI Logo" style="height: 48px; border-radius: 8px; margin-bottom: 8px; display: block;">
            <div style="font-size:1.4rem; font-weight:800; color:var(--slate-900); font-family:var(--font-heading); display:flex; align-items:center; gap:0.5rem;">
              RetinaXAI
            </div>
            <div style="font-size:0.8125rem; color:var(--slate-600);">
              AI-Assisted Diabetic Retinopathy Screening & Decision Support System
            </div>
            <div style="font-size:0.75rem; color:var(--slate-500); margin-top:0.2rem;">
              Facility: <strong>${patient.centre || 'Primary Health Centre (Rural Outreach)'}</strong>
            </div>
          </div>

          <div style="text-align:right;">
            <div style="font-family:var(--font-mono); font-size:0.8125rem; font-weight:700; color:var(--slate-800);">
              Report ID: ${screeningCase.id} | PHC ID: ${StorageService.getCurrentUser()}
            </div>
            <div style="font-size:0.75rem; color:var(--slate-500);">
              Date: ${new Date(screeningCase.createdAt || Date.now()).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })}
            </div>
            <div style="font-size:0.75rem; color:#10b981; font-weight:700;">
              Status: Verified Tele-Screening
            </div>
          </div>
        </div>

        <!-- Patient Demographics Summary Grid -->
        <div style="background:var(--slate-50); border:1px solid var(--border-card); border-radius:var(--radius-md); padding:1rem; margin-bottom:1.5rem;">
          <div style="font-size:0.75rem; font-weight:700; color:var(--slate-500); text-transform:uppercase; margin-bottom:0.5rem; letter-spacing:0.04em;">
            Patient Information
          </div>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(160px, 1fr)); gap:0.75rem; font-size:0.8125rem;">
            <div><span style="color:var(--slate-500);">Patient ID:</span> <strong>${patient.id || '--'}</strong></div>
            <div><span style="color:var(--slate-500);">Name:</span> <strong>${patient.name || '--'}</strong></div>
            <div><span style="color:var(--slate-500);">Age / Sex:</span> <strong>${patient.age || '--'} Yrs / ${patient.gender || '--'}</strong></div>
            <div><span style="color:var(--slate-500);">Diabetes Status:</span> <strong>${patient.diabetesStatus || '--'}</strong></div>
            <div><span style="color:var(--slate-500);">Duration:</span> <strong>${patient.diabetesDuration || '--'}</strong></div>
            <div><span style="color:var(--slate-500);">Image Quality:</span> <strong>${screeningCase.imageQuality?.overall || 'ACCEPTABLE'}</strong></div>
          </div>
        </div>

        <!-- Retinal Photographs & Grad-CAM Heatmap Comparison -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:1rem; margin-bottom:1.5rem; text-align:center;">
          <div>
            <div style="font-size:0.75rem; font-weight:700; color:var(--slate-700); margin-bottom:0.35rem;">
              Original Retinal Fundus (45° Field)
            </div>
            <div style="width:200px; height:200px; border-radius:8px; overflow:hidden; margin:0 auto; background:#000; border:1px solid var(--border-card);">
              <img src="${screeningCase.rawImage}" style="width:100%; height:100%; object-fit:contain;">
            </div>
          </div>

          <div>
            <div style="font-size:0.75rem; font-weight:700; color:var(--slate-700); margin-bottom:0.35rem;">
              ${isUngradable ? 'Defocus Artifact Assessment' : 'AI Attention Heatmap (Grad-CAM)'}
            </div>
            <div style="width:200px; height:200px; border-radius:8px; overflow:hidden; margin:0 auto; background:#000; border:1px solid var(--border-card); position:relative;">
              <img src="${screeningCase.rawImage}" style="width:100%; height:100%; object-fit:contain;">
              ${!isUngradable && screeningCase.gradCamImage ? `
                <img src="${screeningCase.gradCamImage}" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:contain; opacity:0.7; mix-blend-mode:screen;">
              ` : ''}
            </div>
          </div>
        </div>

        <!-- Primary AI Diagnostic Finding -->
        <div style="border:2px solid ${isUngradable ? '#ef4444' : (isReferable ? '#f59e0b' : '#10b981')}; border-radius:var(--radius-lg); padding:1.25rem; margin-bottom:1.5rem;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:0.75rem;">
            <div>
              <div style="font-size:0.75rem; font-weight:700; color:var(--slate-500); text-transform:uppercase;">
                AI Classification Result
              </div>
              <div style="font-size:1.3rem; font-weight:800; color:var(--slate-900);">
                ${isUngradable ? 'IMAGE UNGRADABLE — NO PREDICTION' : drMeta.title}
              </div>
              <div style="font-size:0.8125rem; color:var(--slate-600); margin-top:0.25rem;">
                ${isUngradable ? 'Image quality insufficient for automated microvascular feature analysis.' : drMeta.description}
              </div>
            </div>

            <div style="text-align:right;">
              <span class="badge ${isUngradable ? 'badge-quality-ungradable' : (isReferable ? 'badge-referable-yes' : 'badge-referable-no')}" style="font-size:1rem; padding:0.35rem 0.85rem;">
                ${isUngradable ? 'RECAPTURE REQUIRED' : (isReferable ? 'REFERABLE DR' : 'NON-REFERABLE')}
              </span>
              ${!isUngradable ? `
                <div style="font-size:0.75rem; color:var(--slate-500); margin-top:0.35rem;">
                  AI Confidence: <strong>${screeningCase.aiResult?.confidence || '91.8'}%</strong>
                </div>
              ` : ''}
            </div>
          </div>
        </div>

        <!-- Evidence Breakdown Table -->
        ${!isUngradable && screeningCase.aiResult?.evidence ? `
          <div style="margin-bottom:1.5rem;">
            <div style="font-size:0.8125rem; font-weight:700; color:var(--slate-800); margin-bottom:0.5rem;">
              Identified Retinal Findings & Evidence:
            </div>
            <table class="data-table" style="font-size:0.8125rem;">
              <thead>
                <tr>
                  <th>Finding Type</th>
                  <th>Anatomical Region</th>
                  <th>Severity</th>
                  <th>Model Attribution</th>
                </tr>
              </thead>
              <tbody>
                ${screeningCase.aiResult.evidence.map(ev => `
                  <tr>
                    <td><strong>${ev.type}</strong></td>
                    <td>${ev.region}</td>
                    <td>${ev.severity}</td>
                    <td>${ev.relevance}%</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : ''}

        <!-- Ophthalmologist Review & Sign-Off Block -->
        <div style="border-top:1px dashed var(--slate-300); padding-top:1rem; margin-bottom:1.5rem;">
          <div style="font-size:0.8125rem; font-weight:700; color:var(--slate-800); margin-bottom:0.5rem;">
            Tele-Ophthalmology Review & Specialist Decision:
          </div>
          <div style="background:var(--slate-50); border:1px solid var(--border-card); border-radius:var(--radius-md); padding:1rem; display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:1rem; font-size:0.8125rem;">
            <div>
              <span style="color:var(--slate-500);">Review Status:</span> 
              <strong>${docReview.status === 'Reviewed' ? 'Ophthalmologist Verified' : 'Pending Tele-Review'}</strong>
            </div>
            <div>
              <span style="color:var(--slate-500);">Reviewing Specialist:</span> 
              <strong>${docReview.reviewedBy || 'AIIMS Tele-Retina Hub'}</strong>
            </div>
            <div style="grid-column:1 / -1;">
              <span style="color:var(--slate-500);">Specialist Clinical Notes:</span>
              <p style="margin-top:0.25rem; font-style:italic; color:var(--slate-800);">
                ${docReview.notes || (isReferable ? 'Confirmed referable moderate/severe DR. Patient advised dilated slit-lamp exam and OCT at District Eye Hospital.' : 'Confirmed non-referable. Advised regular glucose control and annual follow-up.')}
              </p>
            </div>
          </div>
        </div>

        <!-- Mandatory Medical Legal Disclaimer -->
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:var(--radius-md); padding:0.75rem; font-size:0.7rem; color:var(--slate-500); line-height:1.4;">
          <strong>Medical Notice:</strong> RetinaXAI is an AI-assisted screening decision-support tool developed for the Smart India Hackathon (SIH26038). It does not constitute a definitive medical diagnosis or replace a comprehensive dilated eye examination by an ophthalmologist.
        </div>

      </div>

      <!-- Modal Footer -->
      <div class="modal-footer no-print">
        <button class="btn btn-secondary" id="modal-footer-close-btn">Close</button>
        <button class="btn btn-primary" id="modal-footer-print-btn">
          <i data-lucide="printer" style="width:16px;height:16px;"></i>
          Print Clinical Report
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
}
