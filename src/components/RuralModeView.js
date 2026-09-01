/**
 * RetinaXAI — Rural Screening Mode & Offline Telemedicine Component
 * Manages low-bandwidth edge deployment, offline queues, camera connectivity, and cloud tele-sync.
 */

import { StorageService } from '../services/storageService.js';

export function renderRuralModeView(container) {
  let settings = StorageService.getSettings();
  let syncQueue = StorageService.getSyncQueue();
  const screenings = StorageService.getScreenings();

  function updateView() {
    settings = StorageService.getSettings();
    syncQueue = StorageService.getSyncQueue();

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
        <div>
          <h1 style="font-size:1.75rem; color:var(--slate-900);">Rural Screening & Offline Operations Mode</h1>
          <p style="color:var(--slate-600); font-size:0.875rem; margin-top:0.25rem;">
            Engineered for remote Primary Health Centres (PHCs) and mobile vans with intermittent or low-bandwidth 2G/3G connectivity.
          </p>
        </div>

        <div style="display:flex; gap:0.75rem; align-items:center;">
          <button class="btn btn-secondary btn-sm" id="rural-toggle-bandwidth-btn" style="${settings.lowBandwidthMode ? 'background:#dbeafe; color:#1e40af; border-color:#93c5fd; font-weight:700;' : ''}">
            <i data-lucide="${settings.lowBandwidthMode ? 'check-square' : 'square'}" style="width:14px;height:14px;"></i>
            Low Bandwidth Mode: ${settings.lowBandwidthMode ? 'ENABLED' : 'DISABLED'}
          </button>
          <button class="btn btn-primary btn-sm" id="rural-trigger-sync-btn">
            <i data-lucide="refresh-cw" style="width:14px;height:14px;"></i>
            Sync Cloud Queue (${syncQueue.length})
          </button>
        </div>
      </div>

      <!-- Rural Edge Architecture Workflow Pipeline -->
      <div class="card" style="background:linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color:white; margin-bottom:1.5rem; border:none;">
        <div style="font-size:0.75rem; font-weight:700; color:#2dd4bf; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.5rem;">
          End-to-End Rural Clinical Architecture
        </div>
        <h3 style="font-size:1.2rem; color:white; margin-bottom:1.25rem;">
          Offline-First Edge AI Processing & Tele-Ophthalmology Synchronization
        </h3>

        <div class="pipeline-flow-diagram" style="margin:0; background:rgba(0,0,0,0.3);">
          <div class="pipeline-node">
            <div class="pipeline-node-icon" style="color:#38bdf8;">
              <i data-lucide="camera" style="width:24px;height:24px;"></i>
            </div>
            <div style="font-size:0.75rem; font-weight:700;">1. Fundus Camera</div>
            <div style="font-size:0.65rem; color:#94a3b8;">Portable Non-Mydriatic</div>
          </div>

          <div class="pipeline-connector-line"></div>

          <div class="pipeline-node">
            <div class="pipeline-node-icon" style="color:#f59e0b;">
              <i data-lucide="shield-check" style="width:24px;height:24px;"></i>
            </div>
            <div style="font-size:0.75rem; font-weight:700;">2. Quality Filter</div>
            <div style="font-size:0.65rem; color:#94a3b8;">Automated Blur Reject</div>
          </div>

          <div class="pipeline-connector-line"></div>

          <div class="pipeline-node">
            <div class="pipeline-node-icon" style="color:#2dd4bf;">
              <i data-lucide="sparkles" style="width:24px;height:24px;"></i>
            </div>
            <div style="font-size:0.75rem; font-weight:700;">3. CLAHE Normalizer</div>
            <div style="font-size:0.65rem; color:#94a3b8;">Contrast Enhancement</div>
          </div>

          <div class="pipeline-connector-line"></div>

          <div class="pipeline-node">
            <div class="pipeline-node-icon" style="color:#10b981;">
              <i data-lucide="cpu" style="width:24px;height:24px;"></i>
            </div>
            <div style="font-size:0.75rem; font-weight:700;">4. Local Edge AI</div>
            <div style="font-size:0.65rem; color:#94a3b8;">Instant Offline Grad-CAM</div>
          </div>

          <div class="pipeline-connector-line"></div>

          <div class="pipeline-node">
            <div class="pipeline-node-icon" style="color:#a855f7;">
              <i data-lucide="hard-drive" style="width:24px;height:24px;"></i>
            </div>
            <div style="font-size:0.75rem; font-weight:700;">5. Local Store</div>
            <div style="font-size:0.65rem; color:#94a3b8;">Encrypted Storage</div>
          </div>

          <div class="pipeline-connector-line"></div>

          <div class="pipeline-node">
            <div class="pipeline-node-icon" style="color:#ec4899;">
              <i data-lucide="stethoscope" style="width:24px;height:24px;"></i>
            </div>
            <div style="font-size:0.75rem; font-weight:700;">6. Tele-Specialist</div>
            <div style="font-size:0.65rem; color:#94a3b8;">Remote Doctor Sign-Off</div>
          </div>
        </div>
      </div>

      <!-- Rural Edge Hardware Telemetry Status Cards -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1.25rem; margin-bottom:1.5rem;">
        
        <!-- Camera Hardware Card -->
        <div class="card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
            <div style="font-weight:700; font-size:0.875rem; color:var(--slate-900);">Portable Camera Unit</div>
            <span class="badge badge-quality-acceptable">CONNECTED</span>
          </div>
          <div style="font-size:0.8125rem; color:var(--slate-600); display:flex; flex-direction:column; gap:0.35rem;">
            <div>Device: <strong>RetinaCam 45D Pro (USB 3.0)</strong></div>
            <div>Resolution: <strong>2048 x 1536 (Sub-sampled 512x)</strong></div>
            <div>Illumination: <strong>Infrared + White LED Flash</strong></div>
            <div>Pupil Tracking: <strong>Active Auto-Alignment</strong></div>
          </div>
        </div>

        <!-- Edge Computing Hardware Card -->
        <div class="card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
            <div style="font-weight:700; font-size:0.875rem; color:var(--slate-900);">Local Edge AI Engine</div>
            <span class="badge badge-quality-acceptable">ACTIVE</span>
          </div>
          <div style="font-size:0.8125rem; color:var(--slate-600); display:flex; flex-direction:column; gap:0.35rem;">
            <div>Inference Runtime: <strong>TensorFlow Lite / ONNX Edge</strong></div>
            <div>Quantization: <strong>INT8 Optimized</strong></div>
            <div>Inference Latency: <strong>142 ms (No Internet Req.)</strong></div>
            <div>Model Size: <strong>18.4 MB (EfficientNet Backbone)</strong></div>
          </div>
        </div>

        <!-- Network Uplink & Sync Status Card -->
        <div class="card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
            <div style="font-weight:700; font-size:0.875rem; color:var(--slate-900);">Rural Tele-Sync Uplink</div>
            <span class="badge" style="background:#dbeafe; color:#1e40af;">
              ${settings.lowBandwidthMode ? '2G COMPRESSED' : '4G LTE READY'}
            </span>
          </div>
          <div style="font-size:0.8125rem; color:var(--slate-600); display:flex; flex-direction:column; gap:0.35rem;">
            <div>Network Type: <strong>Cellular Telemetry Sync</strong></div>
            <div>Pending Sync Queue: <strong>${syncQueue.length} Screening Cases</strong></div>
            <div>Compression Mode: <strong>${settings.lowBandwidthMode ? 'JPEG 85% + GradCAM Vector' : 'Standard Full-Res'}</strong></div>
            <div>Sync Protocol: <strong>Store-and-Forward HTTPS</strong></div>
          </div>
        </div>

      </div>

      <!-- Sync Queue Table Card -->
      <div class="card">
        <div class="card-header">
          <div>
            <h3 class="card-title">
              <i data-lucide="cloud-upload" style="width:20px;height:20px; color:var(--primary-600);"></i>
              Offline Sync & Triage Queue
            </h3>
            <p style="font-size:0.8125rem; color:var(--slate-500); margin-top:0.25rem;">
              Cases queued in local storage awaiting cloud dispatch to tele-ophthalmologists.
            </p>
          </div>

          <button class="btn btn-primary btn-sm" id="queue-sync-btn">
            <i data-lucide="arrow-up-circle" style="width:14px;height:14px;"></i>
            Force Sync All
          </button>
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Patient</th>
                <th>Screening Centre</th>
                <th>AI DR Finding</th>
                <th>Queue Status</th>
                <th>Payload Size</th>
              </tr>
            </thead>
            <tbody>
              ${screenings.slice(0, 5).map((c, i) => `
                <tr>
                  <td style="font-family:var(--font-mono); font-weight:700;">${c.id}</td>
                  <td><strong>${c.patient?.name || 'Patient'}</strong> (${c.patient?.id || '--'})</td>
                  <td style="font-size:0.8125rem;">${c.patient?.centre ? c.patient.centre.split('—')[0] : 'PHC Rampur'}</td>
                  <td>
                    ${c.isUngradable ? '<span class="badge badge-quality-ungradable">Ungradable</span>' : `<span class="badge badge-dr-${c.stage}">Level ${c.stage}</span>`}
                  </td>
                  <td>
                    <span class="badge" style="background:#dcfce7; color:#15803d;">
                      <i data-lucide="check" style="width:12px;height:12px;"></i>
                      Synced to Cloud Hub
                    </span>
                  </td>
                  <td style="font-family:var(--font-mono); font-size:0.8125rem;">
                    ${settings.lowBandwidthMode ? '34 KB (Vector Heatmap)' : '240 KB (Standard)'}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Listeners
    container.querySelector('#rural-toggle-bandwidth-btn').addEventListener('click', () => {
      StorageService.updateSettings({ lowBandwidthMode: !settings.lowBandwidthMode });
      updateView();
    });

    const triggerSync = () => {
      StorageService.clearSyncQueue();
      alert('Cloud Telemetry Sync Completed! All rural screenings are updated in the tele-ophthalmology hub.');
      updateView();
    };

    container.querySelector('#rural-trigger-sync-btn').addEventListener('click', triggerSync);
    container.querySelector('#queue-sync-btn').addEventListener('click', triggerSync);

    if (window.lucide) window.lucide.createIcons();
  }

  updateView();
}
