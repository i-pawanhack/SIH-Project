/**
 * Drish Kalyan — Clinical Analytics & Rural Epidemiology Dashboard
 * Visualizes DR stage distributions, referral ratios, image quality, and doctor concordance.
 */

import { StorageService } from '../services/storageService.js';

export function renderAnalyticsView(container) {
  const stats = StorageService.getStats();
  const screenings = StorageService.getScreenings();

  // Compute DR Grade Distribution Counts
  const gradeCounts = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, ungradable: 0 };
  screenings.forEach(c => {
    if (c.isUngradable || c.imageQuality?.overall === 'UNGRADABLE') {
      gradeCounts.ungradable++;
    } else {
      gradeCounts[c.stage] = (gradeCounts[c.stage] || 0) + 1;
    }
  });

  const totalEvaluated = Math.max(1, screenings.length);

  container.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
      <div>
        <div style="display:flex; align-items:center; gap:0.5rem;">
          <h1 style="font-size:1.75rem; color:var(--slate-900);" data-i18n="aly.title">${window.t('aly.title')}</h1>
          <span class="badge" style="background:#fef3c7; color:#b45309; font-size:0.75rem;" data-i18n="aly.badge">${window.t('aly.badge')}</span>
        </div>
        <p style="color:var(--slate-600); font-size:0.875rem; margin-top:0.25rem;" data-i18n="aly.desc">
          ${window.t('aly.desc')}
        </p>
      </div>

      <div style="display:flex; gap:0.5rem;">
        <span class="badge" style="background:#e0f2fe; color:#0369a1; padding:0.4rem 0.8rem; font-size:0.8125rem;">
          <span data-i18n="aly.cohort">${window.t('aly.cohort')}</span> ${screenings.length} <span data-i18n="aly.patients">${window.t('aly.patients')}</span>
        </span>
      </div>
    </div>

    <!-- Analytics Top Grid -->
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:1.5rem; margin-bottom:1.5rem;">
      
      <!-- DR Severity Distribution Card -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">
            <i data-lucide="pie-chart" style="width:20px;height:20px; color:var(--primary-600);"></i>
            <span data-i18n="aly.distTitle">${window.t('aly.distTitle')}</span>
          </h3>
        </div>

        <div style="display:flex; flex-direction:column; gap:0.75rem;">
          <!-- Level 0 -->
          <div>
            <div style="display:flex; justify-content:space-between; font-size:0.8125rem; margin-bottom:0.25rem;">
              <span style="font-weight:600; color:var(--slate-800);" data-i18n="aly.l0">${window.t('aly.l0')}</span>
              <span style="font-weight:700; font-family:var(--font-mono);">${gradeCounts[0]} (${Math.round((gradeCounts[0]/totalEvaluated)*100)}%)</span>
            </div>
            <div style="height:8px; background:var(--slate-100); border-radius:4px; overflow:hidden;">
              <div style="height:100%; width:${(gradeCounts[0]/totalEvaluated)*100}%; background:#10b981;"></div>
            </div>
          </div>

          <!-- Level 1 -->
          <div>
            <div style="display:flex; justify-content:space-between; font-size:0.8125rem; margin-bottom:0.25rem;">
              <span style="font-weight:600; color:var(--slate-800);" data-i18n="aly.l1">${window.t('aly.l1')}</span>
              <span style="font-weight:700; font-family:var(--font-mono);">${gradeCounts[1]} (${Math.round((gradeCounts[1]/totalEvaluated)*100)}%)</span>
            </div>
            <div style="height:8px; background:var(--slate-100); border-radius:4px; overflow:hidden;">
              <div style="height:100%; width:${(gradeCounts[1]/totalEvaluated)*100}%; background:#06b6d4;"></div>
            </div>
          </div>

          <!-- Level 2 -->
          <div>
            <div style="display:flex; justify-content:space-between; font-size:0.8125rem; margin-bottom:0.25rem;">
              <span style="font-weight:600; color:var(--slate-800);" data-i18n="aly.l2">${window.t('aly.l2')}</span>
              <span style="font-weight:700; font-family:var(--font-mono);">${gradeCounts[2]} (${Math.round((gradeCounts[2]/totalEvaluated)*100)}%)</span>
            </div>
            <div style="height:8px; background:var(--slate-100); border-radius:4px; overflow:hidden;">
              <div style="height:100%; width:${(gradeCounts[2]/totalEvaluated)*100}%; background:#f59e0b;"></div>
            </div>
          </div>

          <!-- Level 3 -->
          <div>
            <div style="display:flex; justify-content:space-between; font-size:0.8125rem; margin-bottom:0.25rem;">
              <span style="font-weight:600; color:var(--slate-800);" data-i18n="aly.l3">${window.t('aly.l3')}</span>
              <span style="font-weight:700; font-family:var(--font-mono);">${gradeCounts[3]} (${Math.round((gradeCounts[3]/totalEvaluated)*100)}%)</span>
            </div>
            <div style="height:8px; background:var(--slate-100); border-radius:4px; overflow:hidden;">
              <div style="height:100%; width:${(gradeCounts[3]/totalEvaluated)*100}%; background:#f97316;"></div>
            </div>
          </div>

          <!-- Level 4 -->
          <div>
            <div style="display:flex; justify-content:space-between; font-size:0.8125rem; margin-bottom:0.25rem;">
              <span style="font-weight:600; color:var(--slate-800);" data-i18n="aly.l4">${window.t('aly.l4')}</span>
              <span style="font-weight:700; font-family:var(--font-mono);">${gradeCounts[4]} (${Math.round((gradeCounts[4]/totalEvaluated)*100)}%)</span>
            </div>
            <div style="height:8px; background:var(--slate-100); border-radius:4px; overflow:hidden;">
              <div style="height:100%; width:${(gradeCounts[4]/totalEvaluated)*100}%; background:#ef4444;"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Referral & Quality Breakdown Card -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">
            <i data-lucide="git-merge" style="width:20px;height:20px; color:var(--primary-600);"></i>
            <span data-i18n="aly.kpiTitle">${window.t('aly.kpiTitle')}</span>
          </h3>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1rem;">
          <div style="background:var(--slate-50); border:1px solid var(--border-card); border-radius:var(--radius-md); padding:1rem; text-align:center;">
            <div style="font-size:0.75rem; font-weight:700; color:var(--slate-500); text-transform:uppercase;" data-i18n="aly.kpiRefRatio">${window.t('aly.kpiRefRatio')}</div>
            <div style="font-size:1.8rem; font-weight:800; color:#b91c1c; font-family:var(--font-heading);">
              ${Math.round((stats.referable / totalEvaluated) * 100)}%
            </div>
            <div style="font-size:0.7rem; color:var(--slate-500);">
              ${stats.referable} <span data-i18n="aly.kpiRefSub">${window.t('aly.kpiRefSub')}</span> ${totalEvaluated} <span data-i18n="aly.kpiTotal">${window.t('aly.kpiTotal')}</span>
            </div>
          </div>

          <div style="background:var(--slate-50); border:1px solid var(--border-card); border-radius:var(--radius-md); padding:1rem; text-align:center;">
            <div style="font-size:0.75rem; font-weight:700; color:var(--slate-500); text-transform:uppercase;" data-i18n="aly.kpiAiDoc">${window.t('aly.kpiAiDoc')}</div>
            <div style="font-size:1.8rem; font-weight:800; color:#15803d; font-family:var(--font-heading);">
              94.2%
            </div>
            <div style="font-size:0.7rem; color:var(--slate-500);" data-i18n="aly.kpiAiDocSub">${window.t('aly.kpiAiDocSub')}</div>
          </div>
        </div>

        <div style="display:flex; flex-direction:column; gap:0.5rem; font-size:0.8125rem;">
          <div style="display:flex; justify-content:space-between; padding:0.5rem; background:var(--slate-50); border-radius:var(--radius-sm);">
            <span data-i18n="aly.kpiImgPass">${window.t('aly.kpiImgPass')}</span>
            <strong style="color:#15803d;">${Math.round(((totalEvaluated - gradeCounts.ungradable) / totalEvaluated) * 100)}%</strong>
          </div>
          <div style="display:flex; justify-content:space-between; padding:0.5rem; background:var(--slate-50); border-radius:var(--radius-sm);">
            <span data-i18n="aly.kpiTurnaround">${window.t('aly.kpiTurnaround')}</span>
            <strong style="color:var(--slate-900);">4.2 Hours</strong>
          </div>
          <div style="display:flex; justify-content:space-between; padding:0.5rem; background:var(--slate-50); border-radius:var(--radius-sm);">
            <span data-i18n="aly.kpiLatency">${window.t('aly.kpiLatency')}</span>
            <strong style="color:var(--slate-900); font-family:var(--font-mono);">142 ms / image</strong>
          </div>
        </div>
      </div>

    </div>

    <!-- Facility Throughput Comparison -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">
          <i data-lucide="building-2" style="width:20px;height:20px; color:var(--primary-600);"></i>
          <span data-i18n="aly.tableTitle">${window.t('aly.tableTitle')}</span>
        </h3>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th data-i18n="aly.thFacility">${window.t('aly.thFacility')}</th>
              <th data-i18n="aly.thDistrict">${window.t('aly.thDistrict')}</th>
              <th data-i18n="aly.thTotal">${window.t('aly.thTotal')}</th>
              <th data-i18n="aly.thReferable">${window.t('aly.thReferable')}</th>
              <th data-i18n="aly.thRetake">${window.t('aly.thRetake')}</th>
              <th data-i18n="aly.thConn">${window.t('aly.thConn')}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>${window.tData("PHC Rampur")}</strong></td>
              <td>${window.getLanguage() === "hi" ? "बलिया, उत्तर प्रदेश" : "Ballia, Uttar Pradesh"}</td>
              <td>${window.tData("428 Patients")}</td>
              <td><span class="badge badge-referable-yes">64 (15.0%)</span></td>
              <td>3.2%</td>
              <td><span class="badge badge-quality-acceptable">${window.tData("4G Stable")}</span></td>
            </tr>
            <tr>
              <td><strong>${window.tData("CHC Kotdwar")}</strong></td>
              <td>${window.getLanguage() === "hi" ? "पौड़ी गढ़वाल, उत्तराखंड" : "Pauri Garhwal, Uttarakhand"}</td>
              <td>${window.tData("312 Patients")}</td>
              <td><span class="badge badge-referable-yes">49 (15.7%)</span></td>
              <td>4.1%</td>
              <td><span class="badge badge-quality-borderline">${window.tData("2G Low Bandwidth")}</span></td>
            </tr>
            <tr>
              <td><strong>${window.tData("Mobile Retinal Van #3")}</strong></td>
              <td>${window.getLanguage() === "hi" ? "कच्छ, गुजरात" : "Kutch, Gujarat"}</td>
              <td>${window.tData("540 Patients")}</td>
              <td><span class="badge badge-referable-yes">92 (17.0%)</span></td>
              <td>5.8%</td>
              <td><span class="badge badge-quality-borderline">${window.tData("Offline Store-and-Forward")}</span></td>
            </tr>
            <tr>
              <td><strong>${window.tData("Sub-Centre Dharampur")}</strong></td>
              <td>${window.getLanguage() === "hi" ? "वाराणसी, उत्तर प्रदेश" : "Varanasi, Uttar Pradesh"}</td>
              <td>${window.tData("195 Patients")}</td>
              <td><span class="badge badge-referable-yes">28 (14.4%)</span></td>
              <td>2.9%</td>
              <td><span class="badge badge-quality-acceptable">${window.tData("Optical Fiber")}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
}
