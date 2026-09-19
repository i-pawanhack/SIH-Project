/**
 * Drish Kalyan — Navbar Component
 */

import { StorageService } from '../services/storageService.js';
import { openProfileModal } from './ProfileModal.js';

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
            <img src="src/logo.jpeg" alt="Drish Kalyan Logo" style="width: 48px; height: 48px; object-fit: contain;">
          </div>
          <div class="brand-info">
            <div class="brand-title">
              ${window.t('app.title')}
            </div>
            <div class="brand-tagline" data-i18n="nav.tagline">${window.t('nav.tagline') || 'Explainable AI for Diabetic Retinopathy Screening'}</div>
          </div>
        </div>

        <!-- Navigation Links -->
        <ul class="nav-links">
          <li>
            <a class="nav-item ${currentView === 'dashboard' ? 'active' : ''}" data-view="dashboard">
              <i data-lucide="layout-dashboard" style="width:16px;height:16px;"></i>
              <span data-i18n="nav.dashboard">${window.t('nav.dashboard')}</span>
            </a>
          </li>
          <li>
            <a class="nav-item ${currentView === 'screening-history' ? 'active' : ''}" data-view="screening-history">
              <i data-lucide="history" style="width:16px;height:16px;"></i>
              <span data-i18n="nav.history">${window.t('nav.history')}</span>
            </a>
          </li>
          <li>
            <a class="nav-item ${currentView === 'doctor-review' ? 'active' : ''}" data-view="doctor-review">
              <i data-lucide="stethoscope" style="width:16px;height:16px;"></i>
              <span data-i18n="nav.doctorReview">${window.t('nav.doctorReview')}</span>
            </a>
          </li>
          <li>
            <a class="nav-item ${currentView === 'analytics' ? 'active' : ''}" data-view="analytics">
              <i data-lucide="bar-chart-3" style="width:16px;height:16px;"></i>
              <span data-i18n="nav.analytics">${window.t('nav.analytics')}</span>
            </a>
          </li>
          <li>
            <a class="nav-item ${currentView === 'rural-mode' ? 'active' : ''}" data-view="rural-mode">
              <i data-lucide="radio" style="width:16px;height:16px;"></i>
              <span data-i18n="nav.ruralMode">${window.t('nav.ruralMode')}</span>
            </a>
          </li>
        </ul>

        <!-- Right Controls -->
        <div class="nav-controls">
          <!-- New Screening CTA Button -->
          <button class="btn-new-screening-cta" id="nav-new-screening-cta">
            <i data-lucide="scan" style="width:16px;height:16px;"></i>
            <span data-i18n="nav.newScreening">${window.t('nav.newScreening')}</span>
          </button>

          <!-- Profile Section -->
          <div class="nav-profile-section" id="nav-profile-btn" style="display: flex; align-items: center; gap: 8px; margin-left: 16px; cursor: pointer; position: relative; user-select: none;">
            <div style="width: 36px; height: 36px; background: #e0f2fe; color: #0ea5e9; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
              <i data-lucide="user" style="width:18px;height:18px;"></i>
            </div>
            <div style="display: flex; flex-direction: column;">
              <span style="font-size: 14px; font-weight: 600; color: #1e293b; display: flex; align-items: center; gap: 4px;">
                ${currentPHC} <i data-lucide="chevron-down" style="width:14px;height:14px;color:#64748b;"></i>
              </span>
              <span style="font-size: 12px; color: #64748b;" data-i18n="nav.phcSubtitle">${window.t('nav.phcSubtitle') || 'Primary Health Centre'}</span>
            </div>
            
            <!-- Dropdown Menu -->
            <div class="profile-dropdown" id="profile-dropdown" style="display: none; position: absolute; top: 100%; right: 0; margin-top: 8px; background: white; border: 1px solid #e2e8f0; border-radius: 8px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); min-width: 160px; z-index: 50; overflow: hidden;">
              <div class="dropdown-item" id="btn-profile-edit" style="padding: 10px 16px; font-size: 14px; color: #334155; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: background 0.2s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='white'">
                <i data-lucide="user" style="width:14px;height:14px;"></i> <span data-i18n="nav.profile">${window.t('nav.profile') || 'Profile'}</span>
              </div>
              <div style="height: 1px; background: #e2e8f0; width: 100%;"></div>
              <div class="dropdown-item" id="btn-logout" style="padding: 10px 16px; font-size: 14px; color: #ef4444; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: background 0.2s;" onmouseover="this.style.background='#fef2f2'" onmouseout="this.style.background='white'">
                <i data-lucide="log-out" style="width:14px;height:14px;"></i> <span data-i18n="nav.logout">${window.t('nav.logout') || 'Logout'}</span>
              </div>
            </div>
          </div>
          
          <!-- Language Toggle -->
          <div class="lang-wrapper" style="margin-left: 16px; border-left: 1px solid #e2e8f0; padding-left: 16px; display: flex; align-items: center; gap: 6px;">
            <i data-lucide="globe" style="width:16px;height:16px;color:#64748b;"></i>
            <button id="nav-lang-btn" style="background:none; border:none; color:#64748b; font-size:14px; font-weight:500; cursor:pointer; font-family:inherit; padding:0;">
              ${window.getLanguage() === 'en' ? 'हिन्दी' : 'English'}
            </button>
          </div>
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

  // Profile Dropdown logic
  const profileBtn = container.querySelector('#nav-profile-btn');
  const profileDropdown = container.querySelector('#profile-dropdown');
  
  if (profileBtn && profileDropdown) {
    profileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      profileDropdown.style.display = profileDropdown.style.display === 'none' ? 'block' : 'none';
      // Re-initialize lucide icons inside dropdown if they are not already processed
      if (window.lucide) window.lucide.createIcons({ root: profileDropdown });
    });
    
    document.addEventListener('click', (e) => {
      if (!profileBtn.contains(e.target)) {
        profileDropdown.style.display = 'none';
      }
    });

    container.querySelector('#btn-profile-edit').addEventListener('click', (e) => {
      e.stopPropagation();
      profileDropdown.style.display = 'none';
      openProfileModal();
    });

    container.querySelector('#btn-logout').addEventListener('click', (e) => {
      e.stopPropagation();
      profileDropdown.style.display = 'none';
      StorageService.logout();
      window.location.reload();
    });
  }

  const navLangBtn = container.querySelector('#nav-lang-btn');
  if (navLangBtn) {
    navLangBtn.addEventListener('click', () => {
      const newLang = window.getLanguage() === 'en' ? 'hi' : 'en';
      window.setLanguage(newLang);
      navLangBtn.textContent = newLang === 'en' ? 'हिन्दी' : 'English';
    });
  }
}
