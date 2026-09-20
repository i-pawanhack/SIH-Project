/**
 * Drish Kalyan — Footer / Safety Banner Component
 */

export function renderSafetyBanner(container) {
  container.innerHTML = `
    <footer class="app-footer" style="background-color: var(--slate-900); color: var(--slate-300); padding: 3rem 2rem; font-size: 0.85rem; border-top: 1px solid var(--slate-800); width: 100%;">
      <div style="max-width: 1200px; margin: 0 auto; display: flex; flex-direction: column; gap: 2rem;">
        
        <!-- Top Section -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 2rem;">
          
          <!-- Left Column -->
          <div style="flex: 1; min-width: 300px;">
            <h2 style="color: white; font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem; letter-spacing: 0.05em;">TEAM SYNAPSE</h2>
            <p style="color: var(--slate-400); font-size: 0.95rem; margin-bottom: 1rem;">Explainable AI for Diabetic Retinopathy Screening in Rural India</p>
            <p style="font-family: var(--font-mono); color: var(--primary-400); font-weight: 600;">SIH 2026 &bull; SIH26038</p>
          </div>

          <!-- Right Column -->
          <div style="display: flex; gap: 2rem; flex-wrap: wrap;">
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
              <a href="#" id="footer-terms-btn" style="color: var(--slate-300); text-decoration: none; transition: color 0.2s;">Terms & Conditions</a>
              <a href="#" id="footer-privacy-btn" style="color: var(--slate-300); text-decoration: none; transition: color 0.2s;">Privacy Policy</a>
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
              <a href="#" id="footer-access-btn" style="color: var(--slate-300); text-decoration: none; transition: color 0.2s;">Accessibility</a>
              <a href="#" id="footer-contact-btn" style="color: var(--slate-300); text-decoration: none; transition: color 0.2s;">Contact Us</a>
            </div>
          </div>
        </div>

        <hr style="border: none; border-top: 1px solid var(--slate-800); margin: 0;">

        <!-- Bottom Section -->
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
            <div style="font-weight: 500; color: white;">AI-Assisted Screening & Triage Research Prototype</div>
            <div>&copy; 2026 Team Synapse</div>
          </div>
          
          <div style="background-color: rgba(239, 68, 68, 0.1); border-left: 3px solid #ef4444; padding: 1rem; border-radius: 0 4px 4px 0;">
            <strong style="color: #fca5a5; display: block; margin-bottom: 0.25rem;">Medical Disclaimer:</strong>
            <span style="color: var(--slate-300); line-height: 1.5;">AI-generated results are intended for screening and decision support only and must not replace evaluation by a qualified ophthalmologist.</span>
          </div>
        </div>

      </div>
    </footer>
  `;

  // Attach modal openers to reuse the modals existing in LoginView
  const attachModal = (btnId, modalId) => {
    const btn = container.querySelector('#' + btnId);
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const modal = document.getElementById(modalId);
        if (modal) {
          // Move modal out of any hidden containers (like the login view) to the document body
          if (modal.parentElement !== document.body) {
            document.body.appendChild(modal);
          }
          modal.style.display = 'flex';
          setTimeout(() => modal.classList.add('active'), 10);
        }
      });
    }
  };

  attachModal('footer-terms-btn', 'terms-modal');
  attachModal('footer-privacy-btn', 'privacy-modal');
  attachModal('footer-access-btn', 'access-modal');
  attachModal('footer-contact-btn', 'contact-modal');
}
