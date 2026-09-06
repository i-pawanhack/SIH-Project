/**
 * RetinaXAI — Safety Banner Component
 */

export function renderSafetyBanner(container) {
  container.innerHTML = `
    <div class="safety-banner">
      <div class="safety-banner-content">
        <span style="display:flex; align-items:center; gap: 0.35rem;">
          <i data-lucide="shield-alert" style="width:14px;height:14px;"></i>
          <strong>AI DECISION SUPPORT SYSTEM</strong>
        </span>
        <span>
          <strong>Clinical Disclaimer:</strong> RetinaXAI is an AI-assisted screening prototype designed for decision-support in rural India. It is not a substitute for professional medical diagnosis. Final clinical assessment and referral decisions must be made by a qualified ophthalmologist.
        </span>
      </div>
    </div>
  `;
}
