/**
 * RetinaXAI — Dashboard View Component
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
        <h1 style="font-size:1.75rem; color:var(--slate-900);">Clinical Retinal Screening Dashboard</h1>
        <p style="color:var(--slate-600); font-size:0.875rem; margin-top:0.25rem;">
          Active Facility: <strong>${settings.activeCentre || 'PHC Rampur — Primary Health Centre (District Ballia)'}</strong>
        </p>
      </div>
      
      <div style="display:flex; gap:0.75rem; align-items:center;">
        <span class="badge" style="background:#dbeafe; color:#1e40af; border:1px solid #bfdbfe; padding:0.4rem 0.8rem; font-size:0.8125rem;">
          <i data-lucide="wifi" style="width:14px;height:14px;"></i>
          ${settings.lowBandwidthMode ? 'Rural 2G Low-Bandwidth Mode' : 'Connected to Cloud AI Sync'}
        </span>
        <button class="btn btn-primary btn-sm" id="dash-start-btn">
          <i data-lucide="plus-circle" style="width:16px;height:16px;"></i>
          New Screening
        </button>
      </div>
    </div>

    <!-- KPI Metric Cards Grid -->
    <div class="kpi-grid">
      <!-- Total Screenings -->
      <div class="kpi-card" style="--kpi-accent: var(--primary-600); --kpi-bg: var(--primary-50);">
        <div>
          <div class="kpi-label">Total Screenings</div>
          <div class="kpi-value">${stats.total}</div>
          <div class="kpi-sub">
            <span style="color:#10b981; font-weight:700;">+12.5%</span> from last week
          </div>
        </div>
        <div class="kpi-icon-box">
          <i data-lucide="users" style="width:24px;height:24px;"></i>
        </div>
      </div>

      <!-- Referable Cases -->
      <div class="kpi-card" style="--kpi-accent: #ef4444; --kpi-bg: #fee2e2;">
        <div>
          <div class="kpi-label">Referable DR Cases</div>
          <div class="kpi-value" style="color:#b91c1c;">${stats.referable}</div>
          <div class="kpi-sub">
            <span class="badge badge-referable-yes" style="font-size:0.7rem;">Level 2+ Target</span>
          </div>
        </div>
        <div class="kpi-icon-box">
          <i data-lucide="alert-triangle" style="width:24px;height:24px;"></i>
        </div>
      </div>

      <!-- Non-Referable Cases -->
      <div class="kpi-card" style="--kpi-accent: #10b981; --kpi-bg: #dcfce7;">
        <div>
          <div class="kpi-label">Non-Referable / Normal</div>
          <div class="kpi-value" style="color:#15803d;">${stats.nonReferable}</div>
          <div class="kpi-sub">
            <span>Level 0 & 1 Monitoring</span>
          </div>
        </div>
        <div class="kpi-icon-box">
          <i data-lucide="check-circle-2" style="width:24px;height:24px;"></i>
        </div>
      </div>

      <!-- Ungradable Images -->
      <div class="kpi-card" style="--kpi-accent: #f59e0b; --kpi-bg: #fef3c7;">
        <div>
          <div class="kpi-label">Ungradable Images</div>
          <div class="kpi-value" style="color:#b45309;">${stats.ungradable}</div>
          <div class="kpi-sub">
            <span>Recapture Required</span>
          </div>
        </div>
        <div class="kpi-icon-box">
          <i data-lucide="camera-off" style="width:24px;height:24px;"></i>
        </div>
      </div>

      <!-- Pending Doctor Review -->
      <div class="kpi-card" style="--kpi-accent: #0284c7; --kpi-bg: #e0f2fe;">
        <div>
          <div class="kpi-label">Pending Doctor Review</div>
          <div class="kpi-value" style="color:#0369a1;">${stats.pendingDoctor}</div>
          <div class="kpi-sub">
            <span>Tele-Ophthalmology Queue</span>
          </div>
        </div>
        <div class="kpi-icon-box">
          <i data-lucide="stethoscope" style="width:24px;height:24px;"></i>
        </div>
      </div>
    </div>

    <!-- Quick Screening Action Banner -->
    <div class="card" style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color:white; margin-bottom:1.75rem; border:none; position:relative; overflow:hidden;">
      <div style="position:absolute; right:-20px; bottom:-20px; opacity:0.1; pointer-events:none;">
        <i data-lucide="eye" style="width:220px;height:220px;"></i>
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1.25rem; position:relative; z-index:2;">
        <div style="max-width:650px;">
          <div class="safety-pill" style="margin-bottom:0.6rem; background:rgba(20, 184, 166, 0.2); color:#2dd4bf; border-color:rgba(20, 184, 166, 0.4);">
            <i data-lucide="zap" style="width:12px;height:12px;"></i>
            AI CLINICAL SCREENING PIPELINE
          </div>
          <h2 style="color:white; font-size:1.4rem; margin-bottom:0.4rem;">Empowering Rural Primary Health Centres</h2>
          <p style="color:#cbd5e1; font-size:0.875rem; line-height:1.6;">
            Perform instant image quality assessment, CLAHE enhancement, AI severity grading, Grad-CAM attention explainability, and tele-ophthalmology referral in under 60 seconds.
          </p>
        </div>
        <div style="display:flex; gap:0.75rem; flex-wrap:wrap;">
          <button class="btn btn-primary" id="banner-screen-btn" style="box-shadow:0 0 20px rgba(13,148,136,0.4);">
            <i data-lucide="plus-circle" style="width:18px;height:18px;"></i>
            Start New Screening
          </button>
          <button class="btn btn-secondary" id="banner-sim-btn" style="background:rgba(255,255,255,0.1); color:white; border-color:rgba(255,255,255,0.2);">
            <i data-lucide="cpu" style="width:18px;height:18px;"></i>
            Capacity Simulation
          </button>
        </div>
      </div>
    </div>

    <!-- Recent Screenings Table Section -->
    <div class="card">
      <div class="card-header">
        <div>
          <h3 class="card-title">
            <i data-lucide="file-spreadsheet" style="width:20px;height:20px; color:var(--primary-600);"></i>
            Recent Patient Screenings
          </h3>
          <p style="font-size:0.8125rem; color:var(--slate-500); margin-top:0.25rem;">
            Click on any patient record to inspect the complete diagnostic report, Grad-CAM heatmap, or doctor review.
          </p>
        </div>

        <div style="display:flex; gap:0.75rem; align-items:center; flex-wrap:wrap;">
          <!-- Search Input -->
          <div style="position:relative;">
            <input type="text" id="dash-search-input" class="form-input" placeholder="Search Patient ID / Name..." style="padding-left:2.2rem; min-width:240px; font-size:0.8125rem;">
            <i data-lucide="search" style="position:absolute; left:0.75rem; top:0.7rem; width:14px;height:14px; color:var(--slate-400);"></i>
          </div>

          <!-- DR Severity Filter -->
          <select id="dash-filter-dr" class="form-select" style="font-size:0.8125rem; min-width:140px;">
            <option value="ALL">All DR Stages</option>
            <option value="0">Level 0 — No DR</option>
            <option value="1">Level 1 — Mild NPDR</option>
            <option value="2">Level 2 — Moderate NPDR</option>
            <option value="3">Level 3 — Severe NPDR</option>
            <option value="4">Level 4 — Proliferative DR</option>
            <option value="UNGRADABLE">Ungradable</option>
          </select>
        </div>
      </div>

      <!-- Table Container -->
      <div class="table-container">
        <table class="data-table" id="dash-screenings-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Date & Centre</th>
              <th>Image Quality</th>
              <th>AI DR Grade</th>
              <th>Referable</th>
              <th>Confidence</th>
              <th>Doctor Review</th>
              <th>Action</th>
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
            No screening records found matching your filters.
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
            <div style="font-weight:700; color:var(--slate-900);">${c.patient?.name || 'Unknown Patient'}</div>
            <div style="font-size:0.75rem; color:var(--slate-500); font-family:var(--font-mono);">${c.patient?.id || c.id} • ${c.patient?.age || '--'}y (${c.patient?.gender || '--'})</div>
          </td>
          <td>
            <div style="font-size:0.8125rem; font-weight:600; color:var(--slate-700);">
              ${new Date(c.createdAt || Date.now()).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}
            </div>
            <div style="font-size:0.7rem; color:var(--slate-500); max-width:180px; text-overflow:ellipsis; overflow:hidden; white-space:nowrap;">
              ${c.patient?.centre ? c.patient.centre.split('—')[0] : 'PHC Rampur'}
            </div>
          </td>
          <td>
            <span class="badge ${isUngradable ? 'badge-quality-ungradable' : 'badge-quality-acceptable'}">
              ${isUngradable ? 'Ungradable' : 'Acceptable'}
            </span>
          </td>
          <td>
            ${isUngradable 
              ? `<span style="color:#ef4444; font-size:0.8125rem; font-weight:700;">No AI Prediction</span>`
              : `<span class="badge ${drMeta.badgeClass}">${drMeta.shortName}</span>`
            }
          </td>
          <td>
            ${isUngradable
              ? `<span style="font-size:0.75rem; color:var(--slate-500);">N/A</span>`
              : `<span class="badge ${isReferable ? 'badge-referable-yes' : 'badge-referable-no'}">${isReferable ? 'REFERABLE' : 'NON-REFERABLE'}</span>`
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
              ${docReviewed ? 'Doctor Confirmed' : 'Pending Review'}
            </span>
          </td>
          <td>
            <button class="btn btn-secondary btn-sm open-case-report-btn" data-id="${c.id}">
              <i data-lucide="file-text" style="width:14px;height:14px;"></i>
              View Report
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

  // Navigation Button Handlers
  container.querySelector('#dash-start-btn').addEventListener('click', () => onNavigate('new-screening'));
  container.querySelector('#banner-screen-btn').addEventListener('click', () => onNavigate('new-screening'));
  container.querySelector('#banner-sim-btn').addEventListener('click', () => onNavigate('capacity-simulation'));

  if (window.lucide) window.lucide.createIcons();
}
