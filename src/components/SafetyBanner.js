/**
 * Drish Kalyan — Safety Banner Component
 */

export function renderSafetyBanner(container) {
  container.innerHTML = `
    <div class="safety-banner">
      <div class="safety-banner-content">
        <span style="display:flex; align-items:center; gap: 0.35rem;">
          <i data-lucide="shield-alert" style="width:14px;height:14px;"></i>
          <strong data-i18n="safety.badge">${window.t('safety.badge')}</strong>
        </span>
        <span>
          <strong data-i18n="safety.disclaimer">${window.t('safety.disclaimer')}</strong>
          <span data-i18n="safety.text">${window.t('safety.text')}</span>
        </span>
      </div>
    </div>
  `;
}
