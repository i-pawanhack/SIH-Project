/**
 * Drish Kalyan — Rural Screening Mode & Offline Telemedicine Component
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
          <h1 style="font-size:1.75rem; color:var(--slate-900);" data-i18n="rural.title">${window.t('rural.title')}</h1>
          <p style="color:var(--slate-600); font-size:0.875rem; margin-top:0.25rem;" data-i18n="rural.desc">
            ${window.t('rural.desc')}
          </p>
        </div>

        <div style="display:flex; gap:0.75rem; align-items:center;">
          <button class="btn btn-secondary btn-sm" id="rural-toggle-bandwidth-btn" style="${settings.lowBandwidthMode ? 'background:#dbeafe; color:#1e40af; border-color:#93c5fd; font-weight:700;' : ''}">
            <i data-lucide="${settings.lowBandwidthMode ? 'check-square' : 'square'}" style="width:14px;height:14px;"></i>
            ${settings.lowBandwidthMode ? '<span data-i18n="rural.lowBandwidthOn">' + window.t('rural.lowBandwidthOn') + '</span>' : '<span data-i18n="rural.lowBandwidthOff">' + window.t('rural.lowBandwidthOff') + '</span>'}
          </button>
          <button class="btn btn-primary btn-sm" id="rural-trigger-sync-btn">
            <i data-lucide="refresh-cw" style="width:14px;height:14px;"></i>
            <span data-i18n="rural.syncQueue">${window.t('rural.syncQueue')}</span> (${syncQueue.length})
          </button>
        </div>
      </div>

      <!-- Rural Edge Architecture Workflow Pipeline -->
      <div class="card" style="background:linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color:white; margin-bottom:1.5rem; border:none;">
        <div style="font-size:0.75rem; font-weight:700; color:#2dd4bf; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.5rem;" data-i18n="rural.architecture">
          ${window.t('rural.architecture')}
        </div>
        <h3 style="font-size:1.2rem; color:white; margin-bottom:1.25rem;" data-i18n="rural.archSubtitle">
          ${window.t('rural.archSubtitle')}
        </h3>

        <div class="pipeline-flow-diagram" style="margin:0; background:rgba(0,0,0,0.3);">
          <div class="pipeline-node">
            <div class="pipeline-node-icon" style="color:#38bdf8;">
              <i data-lucide="camera" style="width:24px;height:24px;"></i>
            </div>
            <div style="font-size:0.75rem; font-weight:700;" data-i18n="rural.n1.title">${window.t('rural.n1.title')}</div>
            <div style="font-size:0.65rem; color:#94a3b8;" data-i18n="rural.n1.desc">${window.t('rural.n1.desc')}</div>
          </div>

          <div class="pipeline-connector-line"></div>

          <div class="pipeline-node">
            <div class="pipeline-node-icon" style="color:#f59e0b;">
              <i data-lucide="shield-check" style="width:24px;height:24px;"></i>
            </div>
            <div style="font-size:0.75rem; font-weight:700;" data-i18n="rural.n2.title">${window.t('rural.n2.title')}</div>
            <div style="font-size:0.65rem; color:#94a3b8;" data-i18n="rural.n2.desc">${window.t('rural.n2.desc')}</div>
          </div>

          <div class="pipeline-connector-line"></div>

          <div class="pipeline-node">
            <div class="pipeline-node-icon" style="color:#2dd4bf;">
              <i data-lucide="sparkles" style="width:24px;height:24px;"></i>
            </div>
            <div style="font-size:0.75rem; font-weight:700;" data-i18n="rural.n3.title">${window.t('rural.n3.title')}</div>
            <div style="font-size:0.65rem; color:#94a3b8;" data-i18n="rural.n3.desc">${window.t('rural.n3.desc')}</div>
          </div>

          <div class="pipeline-connector-line"></div>

          <div class="pipeline-node">
            <div class="pipeline-node-icon" style="color:#10b981;">
              <i data-lucide="cpu" style="width:24px;height:24px;"></i>
            </div>
            <div style="font-size:0.75rem; font-weight:700;" data-i18n="rural.n4.title">${window.t('rural.n4.title')}</div>
            <div style="font-size:0.65rem; color:#94a3b8;" data-i18n="rural.n4.desc">${window.t('rural.n4.desc')}</div>
          </div>

          <div class="pipeline-connector-line"></div>

          <div class="pipeline-node">
            <div class="pipeline-node-icon" style="color:#a855f7;">
              <i data-lucide="hard-drive" style="width:24px;height:24px;"></i>
            </div>
            <div style="font-size:0.75rem; font-weight:700;" data-i18n="rural.n5.title">${window.t('rural.n5.title')}</div>
            <div style="font-size:0.65rem; color:#94a3b8;" data-i18n="rural.n5.desc">${window.t('rural.n5.desc')}</div>
          </div>

          <div class="pipeline-connector-line"></div>

          <div class="pipeline-node">
            <div class="pipeline-node-icon" style="color:#ec4899;">
              <i data-lucide="stethoscope" style="width:24px;height:24px;"></i>
            </div>
            <div style="font-size:0.75rem; font-weight:700;" data-i18n="rural.n6.title">${window.t('rural.n6.title')}</div>
            <div style="font-size:0.65rem; color:#94a3b8;" data-i18n="rural.n6.desc">${window.t('rural.n6.desc')}</div>
          </div>
        </div>
      </div>

      <!-- Rural Edge Hardware Telemetry Status Cards -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1.25rem; margin-bottom:1.5rem;">
        
        <!-- Camera Hardware Card -->
        <div class="card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
            <div style="font-weight:700; font-size:0.875rem; color:var(--slate-900);" data-i18n="rural.card1.title">${window.t('rural.card1.title')}</div>
            <span class="badge badge-quality-acceptable" data-i18n="rural.card1.status">${window.t('rural.card1.status')}</span>
          </div>
          <div style="font-size:0.8125rem; color:var(--slate-600); display:flex; flex-direction:column; gap:0.35rem;">
            <div><span data-i18n="rural.lblDevice">${window.t('rural.lblDevice')}</span> <strong>${window.t("rural.specs.camera")}</strong></div>
            <div><span data-i18n="rural.lblResolution">${window.t('rural.lblResolution')}</span> <strong>${window.t("rural.specs.res")}</strong></div>
            <div><span data-i18n="rural.lblIllum">${window.t('rural.lblIllum')}</span> <strong>${window.t("rural.specs.illum")}</strong></div>
            <div><span data-i18n="rural.lblPupil">${window.t('rural.lblPupil')}</span> <strong>${window.t("rural.specs.pupil")}</strong></div>
          </div>
        </div>

        <!-- Edge Computing Hardware Card -->
        <div class="card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
            <div style="font-weight:700; font-size:0.875rem; color:var(--slate-900);" data-i18n="rural.card2.title">${window.t('rural.card2.title')}</div>
            <span class="badge badge-quality-acceptable" data-i18n="rural.card2.status">${window.t('rural.card2.status')}</span>
          </div>
          <div style="font-size:0.8125rem; color:var(--slate-600); display:flex; flex-direction:column; gap:0.35rem;">
            <div><span data-i18n="rural.lblRuntime">${window.t('rural.lblRuntime')}</span> <strong>${window.t("rural.specs.model")}</strong></div>
            <div><span data-i18n="rural.lblQuant">${window.t('rural.lblQuant')}</span> <strong>${window.t("rural.specs.quant")}</strong></div>
            <div><span data-i18n="rural.lblLatency">${window.t('rural.lblLatency')}</span> <strong>${window.tData("142 ms")} <span data-i18n="rural.noInternet">(${window.t('rural.noInternet')})</span></strong></div>
            <div><span data-i18n="rural.lblModelSize">${window.t('rural.lblModelSize')}</span> <strong>${window.t("rural.specs.size")}</strong></div>
          </div>
        </div>

        <!-- Network Uplink & Sync Status Card -->
        <div class="card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
            <div style="font-weight:700; font-size:0.875rem; color:var(--slate-900);" data-i18n="rural.card3.title">${window.t('rural.card3.title')}</div>
            <span class="badge" style="background:#dbeafe; color:#1e40af;">
              ${settings.lowBandwidthMode ? window.tData('2G Compressed') : window.tData('4G Stable')}
            </span>
          </div>
          <div style="font-size:0.8125rem; color:var(--slate-600); display:flex; flex-direction:column; gap:0.35rem;">
            <div><span data-i18n="rural.lblNetwork">${window.t('rural.lblNetwork')}</span> <strong>${window.t("rural.specs.telemetry")}</strong></div>
            <div><span data-i18n="rural.lblPendingQueue">${window.t('rural.lblPendingQueue')}</span> <strong>${syncQueue.length} <span data-i18n="rural.cases">${window.t('rural.cases')}</span></strong></div>
            <div><span data-i18n="rural.lblComp">${window.t('rural.lblComp')}</span> <strong>${settings.lowBandwidthMode ? window.tData('JPEG 85% + GradCAM Vector') : window.tData('Standard Full-Res')}</strong></div>
            <div><span data-i18n="rural.lblProtocol">${window.t('rural.lblProtocol')}</span> <strong>${window.t("rural.specs.https")}</strong></div>
          </div>
        </div>

      </div>

      <!-- Sync Queue Table Card -->
      <div class="card">
        <div class="card-header">
          <div>
            <h3 class="card-title">
              <i data-lucide="cloud-upload" style="width:20px;height:20px; color:var(--primary-600);"></i>
              <span data-i18n="rural.queueTitle">${window.t('rural.queueTitle')}</span>
            </h3>
            <p style="font-size:0.8125rem; color:var(--slate-500); margin-top:0.25rem;" data-i18n="rural.queueDesc">
              ${window.t('rural.queueDesc')}
            </p>
          </div>

          <button class="btn btn-primary btn-sm" id="queue-sync-btn">
            <i data-lucide="arrow-up-circle" style="width:14px;height:14px;"></i>
            <span data-i18n="rural.forceSync">${window.t('rural.forceSync')}</span>
          </button>
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th data-i18n="rural.thCaseId">${window.t('rural.thCaseId')}</th>
                <th data-i18n="rural.thPatient">${window.t('rural.thPatient')}</th>
                <th data-i18n="rural.thCentre">${window.t('rural.thCentre')}</th>
                <th data-i18n="rural.thAiFinding">${window.t('rural.thAiFinding')}</th>
                <th data-i18n="rural.thQueueStatus">${window.t('rural.thQueueStatus')}</th>
                <th data-i18n="rural.thPayloadSize">${window.t('rural.thPayloadSize')}</th>
              </tr>
            </thead>
            <tbody>
              ${screenings.slice(0, 5).map((c, i) => `
                <tr>
                  <td style="font-family:var(--font-mono); font-weight:700;">${window.tData(c.id)}</td>
                  <td><strong>${window.tData(c.patient?.name || '') || window.t('doc.patient')}</strong> (${window.tData(c.patient?.id || '--')})</td>
                  <td style="font-size:0.8125rem;">${window.tData(c.patient?.centre ? c.patient.centre.split('—')[0] : 'PHC Rampur')}</td>
                  <td>
                    ${c.isUngradable ? `<span class="badge badge-quality-ungradable" data-i18n="hist.ungradable">${window.t('hist.ungradable')}</span>` : `<span class="badge badge-dr-${c.stage}">${window.t("dash.l" + c.stage + "_short")}</span>`}
                  </td>
                  <td>
                    <span class="badge" style="background:#dcfce7; color:#15803d;">
                      <i data-lucide="check" style="width:12px;height:12px;"></i>
                      <span data-i18n="rural.synced">${window.t('rural.synced')}</span>
                    </span>
                  </td>
                  <td style="font-family:var(--font-mono); font-size:0.8125rem;">
                    ${settings.lowBandwidthMode ? window.tData('34 KB (Vector Heatmap)') : window.tData('240 KB (Standard)')}
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
      alert(window.t('rural.alert'));
      updateView();
    };

    container.querySelector('#rural-trigger-sync-btn').addEventListener('click', triggerSync);
    container.querySelector('#queue-sync-btn').addEventListener('click', triggerSync);

    const onLangChange = () => {
      updateView();
    };
    window.addEventListener('languageChanged', onLangChange, { once: true });

    if (window.lucide) window.lucide.createIcons();
  }

  updateView();
}
