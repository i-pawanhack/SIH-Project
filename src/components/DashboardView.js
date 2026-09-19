/**
 * Drish Kalyan — Dashboard View Component
 */

import { StorageService } from '../services/storageService.js';
import { DR_SEVERITY_LEVELS } from '../types.js';

export function renderDashboardView(container, onNavigate, onOpenReport) {
  const stats = StorageService.getStats();
  const screenings = StorageService.getScreenings();
  const settings = StorageService.getSettings();

  container.innerHTML = `
    <!-- Top Welcome Banner -->
    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
      <div>
        <h1 style="font-size:1.75rem; color:var(--slate-900);" data-i18n="dash.title">${window.t('dash.title')}</h1>
        <p style="color:var(--slate-600); font-size:0.875rem; margin-top:0.25rem;">
          <span data-i18n="dash.activeFacility">${window.t('dash.activeFacility')}</span>: <strong>${window.tData(settings.activeCentre || 'PHC Rampur — Primary Health Centre (District Ballia)')}</strong>
        </p>
      </div>
      
      <div style="display:flex; gap:0.75rem; align-items:center;">
      </div>
    </div>

    <!-- KPI Metric Cards Grid -->
    <div class="kpi-grid">
      <!-- Total Screenings -->
      <div class="kpi-card" style="--kpi-accent: var(--primary-600); --kpi-bg: var(--primary-50);">
        <div>
          <div class="kpi-label" data-i18n="dash.totalScreenings">${window.t('dash.totalScreenings')}</div>
          <div class="kpi-value">${stats.total}</div>
          <div class="kpi-sub">
            <span style="color:#10b981; font-weight:700;">+12.5%</span> <span data-i18n="dash.fromLastWeek">${window.t('dash.fromLastWeek')}</span>
          </div>
        </div>
        <div class="kpi-icon-box">
          <i data-lucide="users" style="width:24px;height:24px;"></i>
        </div>
      </div>

      <!-- Referable Cases -->
      <div class="kpi-card" style="--kpi-accent: #ef4444; --kpi-bg: #fee2e2;">
        <div>
          <div class="kpi-label" data-i18n="dash.referableCases">${window.t('dash.referableCases')}</div>
          <div class="kpi-value" style="color:#b91c1c;">${stats.referable}</div>
          <div class="kpi-sub">
            <span class="badge badge-referable-yes" style="font-size:0.7rem;" data-i18n="dash.targetL2">${window.t('dash.targetL2')}</span>
          </div>
        </div>
        <div class="kpi-icon-box">
          <i data-lucide="alert-triangle" style="width:24px;height:24px;"></i>
        </div>
      </div>

      <!-- Non-Referable Cases -->
      <div class="kpi-card" style="--kpi-accent: #10b981; --kpi-bg: #dcfce7;">
        <div>
          <div class="kpi-label" data-i18n="dash.nonReferableCases">${window.t('dash.nonReferableCases')}</div>
          <div class="kpi-value" style="color:#15803d;">${stats.nonReferable}</div>
          <div class="kpi-sub">
            <span data-i18n="dash.monitoring">${window.t('dash.monitoring')}</span>
          </div>
        </div>
        <div class="kpi-icon-box">
          <i data-lucide="check-circle-2" style="width:24px;height:24px;"></i>
        </div>
      </div>

      <!-- Ungradable Images -->
      <div class="kpi-card" style="--kpi-accent: #f59e0b; --kpi-bg: #fef3c7;">
        <div>
          <div class="kpi-label" data-i18n="dash.ungradableImages">${window.t('dash.ungradableImages')}</div>
          <div class="kpi-value" style="color:#b45309;">${stats.ungradable}</div>
          <div class="kpi-sub">
            <span data-i18n="dash.recapture">${window.t('dash.recapture')}</span>
          </div>
        </div>
        <div class="kpi-icon-box">
          <i data-lucide="camera-off" style="width:24px;height:24px;"></i>
        </div>
      </div>

      <!-- Pending Doctor Review -->
      <div class="kpi-card" style="--kpi-accent: #0284c7; --kpi-bg: #e0f2fe;">
        <div>
          <div class="kpi-label" data-i18n="dash.pendingDoctor">${window.t('dash.pendingDoctor')}</div>
          <div class="kpi-value" style="color:#0369a1;">${stats.pendingDoctor}</div>
          <div class="kpi-sub">
            <span data-i18n="dash.teleQueue">${window.t('dash.teleQueue')}</span>
          </div>
        </div>
        <div class="kpi-icon-box">
          <i data-lucide="stethoscope" style="width:24px;height:24px;"></i>
        </div>
      </div>
    </div>

    <!-- Recent Screenings Table Section -->
    <div class="card">
      <div class="card-header">
        <div>
          <h3 class="card-title">
            <i data-lucide="file-spreadsheet" style="width:20px;height:20px; color:var(--primary-600);"></i>
            <span data-i18n="dash.recentScreenings">${window.t('dash.recentScreenings')}</span>
          </h3>
          <p style="font-size:0.8125rem; color:var(--slate-500); margin-top:0.25rem;" data-i18n="dash.recentDesc">
            ${window.t('dash.recentDesc')}
          </p>
        </div>

        <div style="display:flex; gap:0.75rem; align-items:center; flex-wrap:wrap;">
          <!-- Search Input -->
          <div style="position:relative;">
            <input type="text" id="dash-search-input" class="form-input" data-i18n="dash.searchPlaceholder" placeholder="${window.t('dash.searchPlaceholder')}" style="padding-left:2.2rem; min-width:240px; font-size:0.8125rem;">
            <i data-lucide="search" style="position:absolute; left:0.75rem; top:0.7rem; width:14px;height:14px; color:var(--slate-400);"></i>
          </div>

          <!-- DR Severity Filter -->
          <select id="dash-filter-dr" class="form-select" style="font-size:0.8125rem; min-width:140px;">
            <option value="ALL" data-i18n="dash.allStages">${window.t('dash.allStages')}</option>
            <option value="0" data-i18n="dash.l0">${window.t('dash.l0')}</option>
            <option value="1" data-i18n="dash.l1">${window.t('dash.l1')}</option>
            <option value="2" data-i18n="dash.l2">${window.t('dash.l2')}</option>
            <option value="3" data-i18n="dash.l3">${window.t('dash.l3')}</option>
            <option value="4" data-i18n="dash.l4">${window.t('dash.l4')}</option>
            <option value="UNGRADABLE" data-i18n="dash.ungradable">${window.t('dash.ungradable')}</option>
          </select>
        </div>
      </div>

      <!-- Table Container -->
      <div class="table-container">
        <table class="data-table" id="dash-screenings-table">
          <thead>
            <tr>
              <th data-i18n="dash.th.patient">${window.t('dash.th.patient')}</th>
              <th data-i18n="dash.th.dateCentre">${window.t('dash.th.dateCentre')}</th>
              <th data-i18n="dash.th.quality">${window.t('dash.th.quality')}</th>
              <th data-i18n="dash.th.aiGrade">${window.t('dash.th.aiGrade')}</th>
              <th data-i18n="dash.th.referable">${window.t('dash.th.referable')}</th>
              <th data-i18n="dash.th.confidence">${window.t('dash.th.confidence')}</th>
              <th data-i18n="dash.th.docReview">${window.t('dash.th.docReview')}</th>
              <th data-i18n="dash.th.action">${window.t('dash.th.action')}</th>
            </tr>
          </thead>
          <tbody id="dash-table-body">
            <!-- Dynamically populated rows -->
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Render Table Rows Helper
  const tableBody = container.querySelector('#dash-table-body');
  const searchInput = container.querySelector('#dash-search-input');
  const filterDr = container.querySelector('#dash-filter-dr');

  function renderRows() {
    const query = searchInput.value.toLowerCase().trim();
    const drFilter = filterDr.value;

    const filtered = screenings.filter(item => {
      const matchQuery = !query || 
        item.patient?.name?.toLowerCase().includes(query) ||
        item.patient?.id?.toLowerCase().includes(query) ||
        item.id?.toLowerCase().includes(query);

      let matchDr = true;
      if (drFilter !== 'ALL') {
        if (drFilter === 'UNGRADABLE') {
          matchDr = item.isUngradable || item.imageQuality?.overall === 'UNGRADABLE';
        } else {
          matchDr = item.stage === parseInt(drFilter, 10) && !item.isUngradable;
        }
      }

      return matchQuery && matchDr;
    });

    if (filtered.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align:center; padding:2.5rem; color:var(--slate-500);">
            <i data-lucide="inbox" style="width:36px;height:36px; margin:0 auto 0.5rem; display:block; opacity:0.4;"></i>
            <span data-i18n="dash.noRecords">${window.t('dash.noRecords')}</span>
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
      const docReviewed = c.doctorReview?.status === 'Reviewed';

      return `
        <tr style="cursor:pointer;" data-case-id="${c.id}">
          <td>
            <div style="font-weight:700; color:var(--slate-900);">${window.tData(c.patient?.name || 'Unknown Patient')}</div>
            <div style="font-size:0.75rem; color:var(--slate-500); font-family:var(--font-mono);">${c.patient?.id || c.id} • ${window.tData(c.patient?.age + "y")} (${window.tData(c.patient?.gender)})</div>
          </td>
          <td>
            <div style="font-size:0.8125rem; font-weight:600; color:var(--slate-700);">
              ${window.formatDate(c.createdAt || Date.now())}
            </div>
            <div style="font-size:0.7rem; color:var(--slate-500); max-width:180px; text-overflow:ellipsis; overflow:hidden; white-space:nowrap;">
              ${window.tData(c.patient?.centre ? c.patient.centre.split('—')[0] : 'PHC Rampur')}
            </div>
          </td>
          <td>
            <span class="badge ${isUngradable ? 'badge-quality-ungradable' : 'badge-quality-acceptable'}" data-i18n="${isUngradable ? 'dash.quality.ungradable' : 'dash.quality.acceptable'}">
              ${isUngradable ? window.t('dash.quality.ungradable') : window.t('dash.quality.acceptable')}
            </span>
          </td>
          <td>
            ${isUngradable 
              ? `<span style="color:#ef4444; font-size:0.8125rem; font-weight:700;" data-i18n="hist.noAi">${window.t('hist.noAi')}</span>`
              : `<span class="badge ${drMeta.badgeClass}" data-i18n="dr.${c.stage}.shortName">${window.t(`dr.${c.stage}.shortName`) || drMeta.shortName}</span>`
            }
          </td>
          <td>
            ${isUngradable
              ? `<span style="font-size:0.75rem; color:var(--slate-500);">N/A</span>`
              : `<span class="badge ${isReferable ? 'badge-referable-yes' : 'badge-referable-no'}" data-i18n="${isReferable ? 'dash.ref.yes' : 'dash.ref.no'}">${isReferable ? window.t('dash.ref.yes') : window.t('dash.ref.no')}</span>`
            }
          </td>
          <td>
            ${isUngradable 
              ? `<span style="font-size:0.75rem; color:var(--slate-400);">--</span>`
              : `<span style="font-family:var(--font-mono); font-weight:700; color:var(--slate-800);">${c.aiResult?.confidence || '91.8'}%</span>`
            }
          </td>
          <td>
            <span class="badge" style="background:${docReviewed ? '#dcfce7' : '#fef3c7'}; color:${docReviewed ? '#15803d' : '#b45309'};">
              <i data-lucide="${docReviewed ? 'check-check' : 'clock'}" style="width:12px;height:12px;"></i>
              <span data-i18n="${docReviewed ? 'dash.doc.confirmed' : 'dash.doc.pending'}">${docReviewed ? window.t('dash.doc.confirmed') : window.t('dash.doc.pending')}</span>
            </span>
          </td>
          <td>
            <button class="btn btn-secondary btn-sm open-case-report-btn" data-id="${c.id}">
              <i data-lucide="file-text" style="width:14px;height:14px;"></i>
              <span data-i18n="dash.viewReport">${window.t('dash.viewReport')}</span>
            </button>
          </td>
        </tr>
      `;
    }).join('');

    // Attach Row Click & Button Listeners
    tableBody.querySelectorAll('tr[data-case-id]').forEach(row => {
      row.addEventListener('click', (e) => {
        const caseId = row.getAttribute('data-case-id');
        const clickedCase = StorageService.getScreeningById(caseId);
        if (clickedCase) onOpenReport(clickedCase);
      });
    });

    if (window.lucide) window.lucide.createIcons();
  }

  // Initial table render
  renderRows();

  // Search & Filter Listeners
  searchInput.addEventListener('input', renderRows);
  filterDr.addEventListener('change', renderRows);

  // Navigation Button Handlers (Removed New Screening button)

  if (window.lucide) window.lucide.createIcons();

  // Reactive re-render on language change
  const onLangChange = () => {
    renderDashboardView(container, onNavigate, onOpenReport);
  };
  window.addEventListener('languageChanged', onLangChange, { once: true });
}
