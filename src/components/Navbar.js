/**
 * RetinaXAI — Navbar Component
 */

import { StorageService } from '../services/storageService.js';

export function renderNavbar(container, currentView, onNavigate, onDemoToggle) {
  const stats = StorageService.getStats();
  const settings = StorageService.getSettings();
  const logins = StorageService.getLogins();
  const currentPHC = logins.length > 0 ? logins[logins.length - 1].phcId : 'PHC-001';

  container.innerHTML = `
    <nav class="navbar">
      <div class="navbar-container">
        <!-- Brand / Logo -->
        <div class="brand-wrapper" id="nav-brand-btn">
          <div class="brand-logo-icon" style="background: transparent; box-shadow: none;">
            <img src="src/logo.jpeg" alt="RetinaXAI Logo" style="width: 48px; height: 48px; object-fit: contain;">
          </div>
          <div class="brand-info">
            <div class="brand-title">
              RetinaXAI
            </div>
            <div class="brand-tagline">Explainable AI for Diabetic Retinopathy Screening</div>
          </div>
        </div>

        <!-- Navigation Links -->
        <ul class="nav-links">
          <li>
            <a class="nav-item ${currentView === 'dashboard' ? 'active' : ''}" data-view="dashboard">
              <i data-lucide="layout-dashboard" style="width:16px;height:16px;"></i>
              Dashboard
            </a>
          </li>
          <li>
            <a class="nav-item ${currentView === 'new-screening' ? 'active' : ''}" data-view="new-screening">
              <i data-lucide="plus-circle" style="width:16px;height:16px;"></i>
              New Screening
            </a>
          </li>
          <li>
            <a class="nav-item ${currentView === 'screening-history' ? 'active' : ''}" data-view="screening-history">
              <i data-lucide="history" style="width:16px;height:16px;"></i>
              History
              <span class="nav-badge-counter">${stats.total}</span>
            </a>
          </li>
          <li>
            <a class="nav-item ${currentView === 'doctor-review' ? 'active' : ''}" data-view="doctor-review">
              <i data-lucide="stethoscope" style="width:16px;height:16px;"></i>
              Doctor Review
              ${stats.pendingDoctor > 0 ? `<span class="nav-badge-counter" style="background:#f59e0b;">${stats.pendingDoctor}</span>` : ''}
            </a>
          </li>
          <li>
            <a class="nav-item ${currentView === 'analytics' ? 'active' : ''}" data-view="analytics">
              <i data-lucide="bar-chart-3" style="width:16px;height:16px;"></i>
              Analytics
            </a>
          </li>
          <li>
            <a class="nav-item ${currentView === 'rural-mode' ? 'active' : ''}" data-view="rural-mode">
              <i data-lucide="radio" style="width:16px;height:16px;"></i>
              Rural Mode
            </a>
          </li>
        </ul>

        <!-- Right Controls -->
        <div class="nav-controls">
          <!-- Profile Section -->
          <div class="nav-profile-section" style="display: flex; align-items: center; gap: 8px; margin-right: 16px;">
            <div style="width: 36px; height: 36px; background: #e0f2fe; color: #0ea5e9; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
              <i data-lucide="user" style="width:18px;height:18px;"></i>
            </div>
            <div style="display: flex; flex-direction: column;">
              <span style="font-size: 14px; font-weight: 600; color: #1e293b;">${currentPHC}</span>
              <span style="font-size: 12px; color: #64748b;">Primary Health Centre</span>
            </div>
          </div>

          <!-- New Screening CTA Button -->
          <button class="btn-new-screening-cta" id="nav-new-screening-cta">
            <i data-lucide="scan" style="width:16px;height:16px;"></i>
            <span>Screen Patient</span>
          </button>
        </div>
      </div>
    </nav>
  `;

  // Attach Event Listeners
  container.querySelector('#nav-brand-btn').addEventListener('click', () => onNavigate('dashboard'));
  container.querySelector('#nav-new-screening-cta').addEventListener('click', () => onNavigate('new-screening'));

  container.querySelectorAll('.nav-item').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetView = link.getAttribute('data-view');
      onNavigate(targetView);
    });
  });


}
