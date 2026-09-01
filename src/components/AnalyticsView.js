/**
 * RetinaXAI — Clinical Analytics & Rural Epidemiology Dashboard
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
          <h1 style="font-size:1.75rem; color:var(--slate-900);">Rural Retinal Screening Analytics</h1>
          <span class="badge" style="background:#fef3c7; color:#b45309; font-size:0.75rem;">DEMO / EPIDEMIOLOGY DATA</span>
        </div>
        <p style="color:var(--slate-600); font-size:0.875rem; margin-top:0.25rem;">
          Aggregate diagnostic intelligence, DR prevalence patterns, referral bottlenecks, and tele-ophthalmology concordance.
        </p>
      </div>

      <div style="display:flex; gap:0.5rem;">
        <span class="badge" style="background:#e0f2fe; color:#0369a1; padding:0.4rem 0.8rem; font-size:0.8125rem;">
          Screening Cohort: ${screenings.length} Patients
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
            DR Severity Distribution (ICDR Scale)
          </h3>
        </div>

        <div style="display:flex; flex-direction:column; gap:0.75rem;">
          <!-- Level 0 -->
          <div>
            <div style="display:flex; justify-content:space-between; font-size:0.8125rem; margin-bottom:0.25rem;">
              <span style="font-weight:600; color:var(--slate-800);">Level 0 — No DR</span>
              <span style="font-weight:700; font-family:var(--font-mono);">${gradeCounts[0]} (${Math.round((gradeCounts[0]/totalEvaluated)*100)}%)</span>
            </div>
            <div style="height:8px; background:var(--slate-100); border-radius:4px; overflow:hidden;">
              <div style="height:100%; width:${(gradeCounts[0]/totalEvaluated)*100}%; background:#10b981;"></div>
            </div>
          </div>

          <!-- Level 1 -->
          <div>
            <div style="display:flex; justify-content:space-between; font-size:0.8125rem; margin-bottom:0.25rem;">
              <span style="font-weight:600; color:var(--slate-800);">Level 1 — Mild NPDR</span>
              <span style="font-weight:700; font-family:var(--font-mono);">${gradeCounts[1]} (${Math.round((gradeCounts[1]/totalEvaluated)*100)}%)</span>
            </div>
            <div style="height:8px; background:var(--slate-100); border-radius:4px; overflow:hidden;">
              <div style="height:100%; width:${(gradeCounts[1]/totalEvaluated)*100}%; background:#06b6d4;"></div>
            </div>
          </div>

          <!-- Level 2 -->
          <div>
            <div style="display:flex; justify-content:space-between; font-size:0.8125rem; margin-bottom:0.25rem;">
              <span style="font-weight:600; color:var(--slate-800);">Level 2 — Moderate NPDR (Referable)</span>
              <span style="font-weight:700; font-family:var(--font-mono);">${gradeCounts[2]} (${Math.round((gradeCounts[2]/totalEvaluated)*100)}%)</span>
            </div>
            <div style="height:8px; background:var(--slate-100); border-radius:4px; overflow:hidden;">
              <div style="height:100%; width:${(gradeCounts[2]/totalEvaluated)*100}%; background:#f59e0b;"></div>
            </div>
          </div>

          <!-- Level 3 -->
          <div>
            <div style="display:flex; justify-content:space-between; font-size:0.8125rem; margin-bottom:0.25rem;">
              <span style="font-weight:600; color:var(--slate-800);">Level 3 — Severe NPDR (Urgent)</span>
              <span style="font-weight:700; font-family:var(--font-mono);">${gradeCounts[3]} (${Math.round((gradeCounts[3]/totalEvaluated)*100)}%)</span>
            </div>
            <div style="height:8px; background:var(--slate-100); border-radius:4px; overflow:hidden;">
              <div style="height:100%; width:${(gradeCounts[3]/totalEvaluated)*100}%; background:#f97316;"></div>
            </div>
          </div>

          <!-- Level 4 -->
          <div>
            <div style="display:flex; justify-content:space-between; font-size:0.8125rem; margin-bottom:0.25rem;">
              <span style="font-weight:600; color:var(--slate-800);">Level 4 — Proliferative DR (Critical)</span>
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
            Triage & Quality KPIs
          </h3>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1rem;">
          <div style="background:var(--slate-50); border:1px solid var(--border-card); border-radius:var(--radius-md); padding:1rem; text-align:center;">
            <div style="font-size:0.75rem; font-weight:700; color:var(--slate-500); text-transform:uppercase;">Referral Ratio</div>
            <div style="font-size:1.8rem; font-weight:800; color:#b91c1c; font-family:var(--font-heading);">
              ${Math.round((stats.referable / totalEvaluated) * 100)}%
            </div>
            <div style="font-size:0.7rem; color:var(--slate-500);">${stats.referable} Referable / ${totalEvaluated} Total</div>
          </div>

          <div style="background:var(--slate-50); border:1px solid var(--border-card); border-radius:var(--radius-md); padding:1rem; text-align:center;">
            <div style="font-size:0.75rem; font-weight:700; color:var(--slate-500); text-transform:uppercase;">AI-Doctor Concordance</div>
            <div style="font-size:1.8rem; font-weight:800; color:#15803d; font-family:var(--font-heading);">
              94.2%
            </div>
            <div style="font-size:0.7rem; color:var(--slate-500);">Specialist Diagnostic Agreement</div>
          </div>
        </div>

        <div style="display:flex; flex-direction:column; gap:0.5rem; font-size:0.8125rem;">
          <div style="display:flex; justify-content:space-between; padding:0.5rem; background:var(--slate-50); border-radius:var(--radius-sm);">
            <span>Image Quality Pass Rate:</span>
            <strong style="color:#15803d;">${Math.round(((totalEvaluated - gradeCounts.ungradable) / totalEvaluated) * 100)}%</strong>
          </div>
          <div style="display:flex; justify-content:space-between; padding:0.5rem; background:var(--slate-50); border-radius:var(--radius-sm);">
            <span>Mean Tele-Review Turnaround:</span>
            <strong style="color:var(--slate-900);">4.2 Hours</strong>
          </div>
          <div style="display:flex; justify-content:space-between; padding:0.5rem; background:var(--slate-50); border-radius:var(--radius-sm);">
            <span>Rural AI Edge Latency:</span>
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
          Rural Screening Centre Volume & Referrals
        </h3>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Healthcare Facility</th>
              <th>District / Zone</th>
              <th>Total Screened</th>
              <th>Referable Detected</th>
              <th>Image Retake Rate</th>
              <th>Connectivity</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>PHC Rampur</strong></td>
              <td>Ballia, Uttar Pradesh</td>
              <td>428 Patients</td>
              <td><span class="badge badge-referable-yes">64 (15.0%)</span></td>
              <td>3.2%</td>
              <td><span class="badge badge-quality-acceptable">4G Stable</span></td>
            </tr>
            <tr>
              <td><strong>CHC Kotdwar</strong></td>
              <td>Pauri Garhwal, Uttarakhand</td>
              <td>312 Patients</td>
              <td><span class="badge badge-referable-yes">49 (15.7%)</span></td>
              <td>4.1%</td>
              <td><span class="badge badge-quality-borderline">2G Low Bandwidth</span></td>
            </tr>
            <tr>
              <td><strong>Mobile Retinal Van #3</strong></td>
              <td>Kutch, Gujarat</td>
              <td>540 Patients</td>
              <td><span class="badge badge-referable-yes">92 (17.0%)</span></td>
              <td>5.8%</td>
              <td><span class="badge badge-quality-borderline">Offline Store-and-Forward</span></td>
            </tr>
            <tr>
              <td><strong>Sub-Centre Dharampur</strong></td>
              <td>Varanasi, Uttar Pradesh</td>
              <td>195 Patients</td>
              <td><span class="badge badge-referable-yes">28 (14.4%)</span></td>
              <td>2.9%</td>
              <td><span class="badge badge-quality-acceptable">Optical Fiber</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
}
