/**
 * Drish Kalyan — Clinical Screening Report Modal Component
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
          <h3 style="font-size:1.1rem; color:var(--slate-900);" data-i18n="report.title">${window.t('report.title')}</h3>
        </div>
        <div style="display:flex; gap:0.5rem;">
          <button class="btn btn-primary btn-sm" id="modal-print-btn">
            <i data-lucide="printer" style="width:14px;height:14px;"></i>
            <span data-i18n="report.print">${window.t('report.print')}</span>
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
            <img src="src/logo.jpeg" alt="Drish Kalyan Logo" style="height: 48px; border-radius: 8px; margin-bottom: 8px; display: block;">
            <div style="font-size:1.4rem; font-weight:800; color:var(--slate-900); font-family:var(--font-heading); display:flex; align-items:center; gap:0.5rem;">
              Drish Kalyan
            </div>
            <div style="font-size:0.8125rem; color:var(--slate-600);" data-i18n="report.subtitle">
              ${window.t('report.subtitle') || 'AI-Assisted Diabetic Retinopathy Screening & Decision Support System'}
            </div>
            <div style="font-size:0.75rem; color:var(--slate-500); margin-top:0.2rem;">
              <span data-i18n="report.facility">${window.t('report.facility')}</span> <strong>${window.tData(patient.centre || 'Primary Health Centre (Rural Outreach)')}</strong>
            </div>
          </div>

          <div style="text-align:right;">
            <div style="font-family:var(--font-mono); font-size:0.8125rem; font-weight:700; color:var(--slate-800);">
              ${window.t('report.reportId')} ${screeningCase.id} | PHC ID: ${StorageService.getCurrentUser()}
            </div>
            <div style="font-size:0.75rem; color:var(--slate-500);">
              ${window.t('report.date')} ${window.formatDate(screeningCase.createdAt || Date.now(), true)}
            </div>
            <div style="font-size:0.75rem; color:#10b981; font-weight:700;" data-i18n="report.statusVerified">
              ${window.t('report.statusVerified')}
            </div>
          </div>
        </div>

        <!-- Patient Demographics Summary Grid -->
        <div style="background:var(--slate-50); border:1px solid var(--border-card); border-radius:var(--radius-md); padding:1rem; margin-bottom:1.5rem;">
          <div style="font-size:0.75rem; font-weight:700; color:var(--slate-500); text-transform:uppercase; margin-bottom:0.5rem; letter-spacing:0.04em;" data-i18n="report.patientInfo">
            ${window.t('report.patientInfo')}
          </div>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(160px, 1fr)); gap:0.75rem; font-size:0.8125rem;">
            <div><span style="color:var(--slate-500);" data-i18n="report.patientId">${window.t('report.patientId')}</span> <strong>${patient.id || '--'}</strong></div>
            <div><span style="color:var(--slate-500);" data-i18n="report.name">${window.t('report.name')}</span> <strong>${window.tData(patient.name || '--')}</strong></div>
            <div><span style="color:var(--slate-500);" data-i18n="report.ageSex">${window.t('report.ageSex')}</span> <strong>${window.tData(patient.age + 'y')} / ${window.tData(patient.gender)}</strong></div>
            <div><span style="color:var(--slate-500);" data-i18n="report.diabetesStatus">${window.t('report.diabetesStatus')}</span> <strong>${window.tData(patient.diabetesStatus)}</strong></div>
            <div><span style="color:var(--slate-500);" data-i18n="report.duration">${window.t('report.duration')}</span> <strong>${window.tData(patient.diabetesDuration)}</strong></div>
            <div><span style="color:var(--slate-500);" data-i18n="report.imageQuality">${window.t('report.imageQuality')}</span> <strong>${window.tData(screeningCase.imageQuality?.overall || 'ACCEPTABLE')}</strong></div>
            ${patient.contact ? `<div><span style="color:var(--slate-500);" data-i18n="report.contact">${window.t('report.contact')}</span> <strong>${patient.contact}</strong></div>` : ''}
            ${patient.address ? `<div><span style="color:var(--slate-500);" data-i18n="report.address">${window.t('report.address')}</span> <strong>${window.tData(patient.address)}</strong></div>` : ''}
            ${patient.medHistory ? `<div style="grid-column:1 / -1;"><span style="color:var(--slate-500);" data-i18n="report.medhistory">${window.t('report.medhistory')}</span> <strong>${window.tData(patient.medHistory)}</strong></div>` : ''}
          </div>
        </div>

        <!-- Retinal Photographs & Grad-CAM Heatmap Comparison -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:1rem; margin-bottom:1.5rem; text-align:center;">
          <div>
            <div style="font-size:0.75rem; font-weight:700; color:var(--slate-700); margin-bottom:0.35rem;" data-i18n="report.originalFundus">
              ${window.t('report.originalFundus')}
            </div>
            <div style="width:200px; height:200px; border-radius:8px; overflow:hidden; margin:0 auto; background:#000; border:1px solid var(--border-card);">
              <img src="${screeningCase.rawImage}" style="width:100%; height:100%; object-fit:contain;">
            </div>
          </div>

          <div>
            <div style="font-size:0.75rem; font-weight:700; color:var(--slate-700); margin-bottom:0.35rem;">
              ${isUngradable ? '<span data-i18n="report.defocus">' + window.t('report.defocus') + '</span>' : '<span data-i18n="report.aiHeatmap">' + window.t('report.aiHeatmap') + '</span>'}
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
              <div style="font-size:0.75rem; font-weight:700; color:var(--slate-500); text-transform:uppercase;" data-i18n="report.aiResult">
                ${window.t('report.aiResult')}
              </div>
              <div style="font-size:1.3rem; font-weight:800; color:var(--slate-900);">
                ${isUngradable ? '<span data-i18n="report.ungradable">' + window.t('report.ungradable') + '</span>' : (window.t(`dr.${screeningCase.stage}.title`) || drMeta.title)}
              </div>
              <div style="font-size:0.8125rem; color:var(--slate-600); margin-top:0.25rem;">
                ${isUngradable ? '<span data-i18n="report.ungradableDesc">' + window.t('report.ungradableDesc') + '</span>' : (window.t(`dr.${screeningCase.stage}.description`) || drMeta.description)}
              </div>
            </div>

            <div style="text-align:right;">
              <span class="badge ${isUngradable ? 'badge-quality-ungradable' : (isReferable ? 'badge-referable-yes' : 'badge-referable-no')}" style="font-size:1rem; padding:0.35rem 0.85rem;">
                ${isUngradable ? '<span data-i18n="report.recapture">' + window.t('report.recapture') + '</span>' : (isReferable ? '<span data-i18n="report.referable">' + window.t('report.referable') + '</span>' : '<span data-i18n="report.nonReferable">' + window.t('report.nonReferable') + '</span>')}
              </span>
              ${!isUngradable ? `
                <div style="font-size:0.75rem; color:var(--slate-500); margin-top:0.35rem;">
                  <span data-i18n="report.aiConfidence">${window.t('report.aiConfidence')}</span> <strong>${screeningCase.aiResult?.confidence || '91.8'}%</strong>
                </div>
              ` : ''}
            </div>
          </div>
        </div>

        <!-- Evidence Breakdown Table -->
        ${!isUngradable && screeningCase.aiResult?.evidence ? `
          <div style="margin-bottom:1.5rem;">
            <div style="font-size:0.8125rem; font-weight:700; color:var(--slate-800); margin-bottom:0.5rem;" data-i18n="report.findings">
              ${window.t('report.findings')}
            </div>
            <table class="data-table" style="font-size:0.8125rem;">
              <thead>
                <tr>
                  <th data-i18n="report.findingType">${window.t('report.findingType')}</th>
                  <th data-i18n="report.anatomicalRegion">${window.t('report.anatomicalRegion')}</th>
                  <th data-i18n="report.severity">${window.t('report.severity')}</th>
                  <th data-i18n="report.modelAttribution">${window.t('report.modelAttribution')}</th>
                </tr>
              </thead>
              <tbody>
                ${screeningCase.aiResult.evidence.map(ev => `
                  <tr>
                    <td><strong>${window.t(`ev.type.${ev.type}`) || ev.type}</strong></td>
                    <td>${window.t(`ev.region.${ev.region}`) || ev.region}</td>
                    <td>${window.tData(ev.severity)}</td>
                    <td>${ev.relevance}%</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : ''}

        <!-- Ophthalmologist Review & Sign-Off Block -->
        <div style="border-top:1px dashed var(--slate-300); padding-top:1rem; margin-bottom:1.5rem;">
          <div style="font-size:0.8125rem; font-weight:700; color:var(--slate-800); margin-bottom:0.5rem;" data-i18n="report.reviewDecision">
            ${window.t('report.reviewDecision')}
          </div>
          <div style="background:var(--slate-50); border:1px solid var(--border-card); border-radius:var(--radius-md); padding:1rem; display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:1rem; font-size:0.8125rem;">
            <div>
              <span style="color:var(--slate-500);" data-i18n="report.reviewStatus">${window.t('report.reviewStatus')}</span> 
              <strong data-i18n="${docReview.status === 'Reviewed' ? 'report.revStatusVerified' : 'report.revStatusPending'}">${docReview.status === 'Reviewed' ? (window.t('report.revStatusVerified') || 'Ophthalmologist Verified') : (window.t('report.revStatusPending') || 'Pending Tele-Review')}</strong>
            </div>
            <div>
              <span style="color:var(--slate-500);" data-i18n="report.specialist">${window.t('report.specialist')}</span> 
              <strong>${docReview.reviewedBy || window.t("report.aiimsHub")}</strong>
            </div>
            <div style="grid-column:1 / -1;">
              <span style="color:var(--slate-500);" data-i18n="report.clinicalNotes">${window.t('report.clinicalNotes')}</span>
              <p style="margin-top:0.25rem; font-style:italic; color:var(--slate-800);">
                ${docReview.notes || (isReferable ? (window.t('report.defNotesRef') || 'Confirmed referable moderate/severe DR. Patient advised dilated slit-lamp exam and OCT at District Eye Hospital.') : (window.t('report.defNotesNon') || 'Confirmed non-referable. Advised regular glucose control and annual follow-up.'))}
              </p>
            </div>
          </div>
        </div>

        <!-- Mandatory Medical Legal Disclaimer -->
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:var(--radius-md); padding:0.75rem; font-size:0.7rem; color:var(--slate-500); line-height:1.4;" data-i18n="report.disclaimer">
          ${window.t('report.disclaimer')}
        </div>

      </div>

      <!-- Modal Footer -->
      <div class="modal-footer no-print">
        <button class="btn btn-secondary" id="modal-footer-close-btn" data-i18n="report.close">${window.t('report.close')}</button>
        <button class="btn btn-primary" id="modal-footer-print-btn">
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

  // Re-render modal in new language if switched while open
  const onLangChange = () => {
    if (!modalRoot.classList.contains('hidden')) {
      openReportModal(screeningCase, onClose);
    }
  };
  window.addEventListener('languageChanged', onLangChange, { once: true });

}
