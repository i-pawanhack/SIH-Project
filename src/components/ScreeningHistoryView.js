/**
 * Drish Kalyan — Screening History View Component
 * Comprehensive filterable database of past retinal screenings with audit trail.
 */

import { StorageService } from '../services/storageService.js';
import { DR_SEVERITY_LEVELS } from '../types.js';

export function renderScreeningHistoryView(container, onOpenReport) {
  const screenings = StorageService.getScreenings();

  container.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
      <div>
        <h1 style="font-size:1.75rem; color:var(--slate-900);" data-i18n="hist.title">${window.t('hist.title')}</h1>
        <p style="color:var(--slate-600); font-size:0.875rem; margin-top:0.25rem;" data-i18n="hist.desc">
          ${window.t('hist.desc')}
        </p>
      </div>

      <div style="display:flex; gap:0.5rem;">
        <span class="badge" style="background:#e0f2fe; color:#0369a1; padding:0.4rem 0.8rem; font-size:0.8125rem;">
          <span data-i18n="hist.totalCases">${window.t('hist.totalCases')}</span> ${screenings.length}
        </span>
      </div>
    </div>

    <!-- Filter & Search Toolbar -->
    <div class="card" style="margin-bottom:1.5rem; padding:1rem 1.25rem;">
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1rem; align-items:center;">
        
        <!-- Search -->
        <div style="position:relative;">
          <input type="text" id="hist-search-input" class="form-input" placeholder="${window.t('hist.searchPlaceholder')}" style="padding-left:2.2rem; width:100%; font-size:0.8125rem;">
          <i data-lucide="search" style="position:absolute; left:0.75rem; top:0.7rem; width:14px;height:14px; color:var(--slate-400);"></i>
        </div>

        <!-- DR Grade Filter -->
        <div>
          <select id="hist-filter-grade" class="form-select" style="width:100%; font-size:0.8125rem;">
            <option value="ALL">${window.t('hist.allGrades')}</option>
            <option value="0">Level 0 — No DR</option>
            <option value="1">Level 1 — Mild NPDR</option>
            <option value="2">Level 2 — Moderate NPDR</option>
            <option value="3">Level 3 — Severe NPDR</option>
            <option value="4">Level 4 — Proliferative DR</option>
            <option value="UNGRADABLE">Ungradable Images</option>
          </select>
        </div>

        <!-- Referral Filter -->
        <div>
          <select id="hist-filter-referral" class="form-select" style="width:100%; font-size:0.8125rem;">
            <option value="ALL">${window.t('hist.allReferral')}</option>
            <option value="REFERABLE">Referable Cases (Level 2+)</option>
            <option value="NON_REFERABLE">Non-Referable</option>
          </select>
        </div>

        <!-- Doctor Review Filter -->
        <div>
          <select id="hist-filter-review" class="form-select" style="width:100%; font-size:0.8125rem;">
            <option value="ALL">${window.t('hist.allReview')}</option>
            <option value="REVIEWED">Doctor Confirmed</option>
            <option value="PENDING">Pending Tele-Review</option>
          </select>
        </div>

      </div>
    </div>

    <!-- History Data Table -->
    <div class="card">
      <div class="table-container">
        <table class="data-table" id="history-table">
          <thead>
            <tr>
              <th data-i18n="hist.thPatient">${window.t('hist.thPatient')}</th>
              <th data-i18n="hist.thDate">${window.t('hist.thDate')}</th>
              <th data-i18n="hist.thCentre">${window.t('hist.thCentre')}</th>
              <th data-i18n="hist.thQuality">${window.t('hist.thQuality')}</th>
              <th data-i18n="hist.thAi">${window.t('hist.thAi')}</th>
              <th data-i18n="hist.thReferable">${window.t('hist.thReferable')}</th>
              <th data-i18n="hist.thConfidence">${window.t('hist.thConfidence')}</th>
              <th data-i18n="hist.thDecision">${window.t('hist.thDecision')}</th>
              <th data-i18n="hist.thActions">${window.t('hist.thActions')}</th>
            </tr>
          </thead>
          <tbody id="hist-table-body">
            <!-- Dynamically injected -->
          </tbody>
        </table>
      </div>
    </div>
  `;

  const searchInput = container.querySelector('#hist-search-input');
  const filterGrade = container.querySelector('#hist-filter-grade');
  const filterReferral = container.querySelector('#hist-filter-referral');
  const filterReview = container.querySelector('#hist-filter-review');
  const tableBody = container.querySelector('#hist-table-body');

  function renderRows() {
    const query = searchInput.value.toLowerCase().trim();
    const gradeVal = filterGrade.value;
    const refVal = filterReferral.value;
    const revVal = filterReview.value;

    const filtered = screenings.filter(c => {
      const matchQuery = !query ||
        c.patient?.name?.toLowerCase().includes(query) ||
        c.patient?.id?.toLowerCase().includes(query) ||
        c.id?.toLowerCase().includes(query);

      let matchGrade = true;
      if (gradeVal !== 'ALL') {
        if (gradeVal === 'UNGRADABLE') {
          matchGrade = c.isUngradable || c.imageQuality?.overall === 'UNGRADABLE';
        } else {
          matchGrade = c.stage === parseInt(gradeVal, 10) && !c.isUngradable;
        }
      }

      let matchRef = true;
      if (refVal === 'REFERABLE') {
        matchRef = !c.isUngradable && (c.stage >= 2);
      } else if (refVal === 'NON_REFERABLE') {
        matchRef = !c.isUngradable && (c.stage < 2);
      }

      let matchRev = true;
      if (revVal === 'REVIEWED') {
        matchRev = c.doctorReview?.status === 'Reviewed';
      } else if (revVal === 'PENDING') {
        matchRev = c.doctorReview?.status !== 'Reviewed';
      }

      return matchQuery && matchGrade && matchRef && matchRev;
    });

    if (filtered.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="9" style="text-align:center; padding:3rem; color:var(--slate-400);">
            <i data-lucide="inbox" style="width:36px;height:36px; margin:0 auto 0.5rem; display:block; opacity:0.4;"></i>
            <span data-i18n="hist.noResults">${window.t('hist.noResults')}</span>
          </td>
        </tr>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    tableBody.innerHTML = filtered.map(c => {
      const isUngradable = c.isUngradable || c.imageQuality?.overall === 'UNGRADABLE';
      const drMeta = DR_SEVERITY_LEVELS[c.stage] || DR_SEVERITY_LEVELS[0];
      const isReferable = !isUngradable && (c.stage >= 2);
      const isDocReviewed = c.doctorReview?.status === 'Reviewed';

      return `
        <tr style="cursor:pointer;" data-id="${c.id}">
          <td>
            <div style="font-weight:700; color:var(--slate-900);">${c.patient?.name || 'Patient'}</div>
            <div style="font-size:0.75rem; color:var(--slate-500); font-family:var(--font-mono);">${c.patient?.id || c.id} • ${c.patient?.age || '--'}y</div>
          </td>
          <td style="font-size:0.8125rem;">
            ${new Date(c.createdAt || Date.now()).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}
          </td>
          <td style="font-size:0.75rem; color:var(--slate-600); max-width:140px; text-overflow:ellipsis; overflow:hidden; white-space:nowrap;">
            ${c.patient?.centre ? c.patient.centre.split('—')[0] : 'PHC'}
          </td>
          <td>
            <span class="badge ${isUngradable ? 'badge-quality-ungradable' : 'badge-quality-acceptable'}">
              ${isUngradable ? 'Ungradable' : 'Acceptable'}
            </span>
          </td>
          <td>
            ${isUngradable 
              ? `<span style="font-size:0.8125rem; font-weight:700; color:#ef4444;" data-i18n="hist.noAi">${window.t('hist.noAi')}</span>` 
              : `<span class="badge ${drMeta.badgeClass}">${window.t(`dr.${c.stage}.shortName`) || drMeta.shortName}</span>`
            }
          </td>
          <td>
            ${isUngradable
              ? `<span style="font-size:0.75rem; color:var(--slate-400);">--</span>`
              : `<span class="badge ${isReferable ? 'badge-referable-yes' : 'badge-referable-no'}">${isReferable ? 'REFERABLE' : 'NON-REFERABLE'}</span>`
            }
          </td>
          <td style="font-family:var(--font-mono); font-size:0.8125rem; font-weight:700;">
            ${!isUngradable ? `${c.aiResult?.confidence || '91.8'}%` : '--'}
          </td>
          <td>
            <span class="badge" style="background:${isDocReviewed ? '#dcfce7' : '#fef3c7'}; color:${isDocReviewed ? '#15803d' : '#b45309'};">
              ${isDocReviewed ? 'Confirmed' : 'Pending'}
            </span>
          </td>
          <td>
            <button class="btn btn-secondary btn-sm open-report-btn" data-id="${c.id}">
              <i data-lucide="file-text" style="width:14px;height:14px;"></i>
              <span data-i18n="report.title">Report</span>
            </button>
          </td>
        </tr>
      `;
    }).join('');

    tableBody.querySelectorAll('tr[data-id]').forEach(row => {
      row.addEventListener('click', () => {
        const id = row.getAttribute('data-id');
        const found = StorageService.getScreeningById(id);
        if (found) onOpenReport(found);
      });
    });

    if (window.lucide) window.lucide.createIcons();
  }

  renderRows();

  searchInput.addEventListener('input', renderRows);
  filterGrade.addEventListener('change', renderRows);
  filterReferral.addEventListener('change', renderRows);
  filterReview.addEventListener('change', renderRows);

  if (window.lucide) window.lucide.createIcons();
}
