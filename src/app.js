/**
 * Drish Kalyan — Root Application Controller & Router
 * Central orchestrator connecting all views, state services, and event pipelines.
 */

import { i18n } from './services/i18n.js';
import { StorageService } from './services/storageService.js';
import { renderSafetyBanner } from './components/SafetyBanner.js';
import { renderNavbar } from './components/Navbar.js';
import { renderDashboardView } from './components/DashboardView.js';
import { renderScreeningWizard } from './components/ScreeningWizard.js';
import { renderScreeningHistoryView } from './components/ScreeningHistoryView.js';
import { renderDoctorReviewView } from './components/DoctorReviewView.js';
import { renderAnalyticsView } from './components/AnalyticsView.js';
import { renderRuralModeView } from './components/RuralModeView.js';
import { renderCapacitySimulator } from './components/CapacitySimulator.js';
import { renderDatasetsView } from './components/DatasetsView.js';
import { openReportModal } from './components/ReportModal.js';
import { renderLoginView } from './components/LoginView.js';

if (!window.t) window.t = (key) => key;
if (!window.getLanguage) window.getLanguage = () => 'en';
if (!window.setLanguage) window.setLanguage = () => {};

class DrishKalyanApp {
  constructor() {
    this.currentView = 'login';
    this.isAuthenticated = false;
    this.init();
  }

  init() {
    // Initialize Local Database & Seed Data
    StorageService.initialize();

    // Render Global Safety Banner & Navbar
    this.renderHeader();

    // Render Initial View
    this.navigateTo(this.currentView);

    // Setup Window Resize / Lucide Hook
    if (document.readyState === 'loading') {
      window.addEventListener('DOMContentLoaded', () => {
        if (window.lucide) window.lucide.createIcons();
      });
    } else {
      if (window.lucide) window.lucide.createIcons();
    }

    // Listen for language changes to re-render header and views dynamically
    window.addEventListener('languageChanged', () => {
      document.documentElement.lang = window.getLanguage();
      this.renderHeader();

      // If Report Modal is currently open, re-render it in the new language
      const modalRoot = document.getElementById('modal-root');
      if (modalRoot && !modalRoot.classList.contains('hidden') && this.activeReportCase) {
        openReportModal(this.activeReportCase, () => {
          this.activeReportCase = null;
        });
      }

      // Re-render current active view
      if (this.currentView === 'login') {
        const loginContainer = document.getElementById('view-login');
        if (loginContainer) {
          renderLoginView(loginContainer, () => {
            this.isAuthenticated = true;
            this.showToast(window.getLanguage() === 'hi' ? 'प्रमाणीकरण सफल रहा' : 'Authentication Successful');
            this.navigateTo('dashboard');
          });
        }
      } else if (this.currentView !== 'new-screening') {
        // new-screening handles its own internal re-render via its own listener to preserve form inputs
        this.navigateTo(this.currentView, true);
      }
    });
  }

  renderHeader() {
    const bannerRoot = document.getElementById('safety-banner-root');
    const navRoot = document.getElementById('navbar-root');

    if (this.currentView === 'login') {
      if (bannerRoot) bannerRoot.style.display = 'none';
      if (navRoot) navRoot.style.display = 'none';
      return;
    } else {
      if (bannerRoot) bannerRoot.style.display = 'block';
      if (navRoot) navRoot.style.display = 'block';
    }

    if (bannerRoot) renderSafetyBanner(bannerRoot);
    if (navRoot) {
      renderNavbar(
        navRoot,
        this.currentView,
        (view) => this.navigateTo(view),
        (isDemo) => this.showToast(`Demo Mode ${isDemo ? 'Enabled' : 'Disabled'}`)
      );
    }
  }

  navigateTo(viewName) {
    this.currentView = viewName;
    this.renderHeader();

    // Hide all view containers
    const views = document.querySelectorAll('.app-view');
    views.forEach(v => v.classList.remove('active'));

    const targetContainer = document.getElementById(`view-${viewName}`);
    if (targetContainer) {
      targetContainer.classList.add('active');

      if (viewName === 'login') {
        renderLoginView(
          targetContainer,
          () => {
            this.isAuthenticated = true;
            this.showToast('Authentication Successful');
            this.navigateTo('dashboard');
          }
        );
      } else if (viewName === 'dashboard') {
        renderDashboardView(
          targetContainer,
          (v) => this.navigateTo(v),
          (caseObj) => this.showReport(caseObj)
        );
      } else if (viewName === 'new-screening') {
        renderScreeningWizard(
          targetContainer,
          (completedCase) => {
            this.showToast(`Case ${completedCase.id} successfully processed!`);
            this.navigateTo('doctor-review');
          },
          (caseObj) => this.showReport(caseObj)
        );
      } else if (viewName === 'screening-history') {
        renderScreeningHistoryView(
          targetContainer,
          (caseObj) => this.showReport(caseObj)
        );
      } else if (viewName === 'doctor-review') {
        renderDoctorReviewView(
          targetContainer,
          (caseObj) => this.showReport(caseObj)
        );
      } else if (viewName === 'analytics') {
        renderAnalyticsView(targetContainer);
      } else if (viewName === 'rural-mode') {
        renderRuralModeView(targetContainer);
      } else if (viewName === 'capacity-simulation') {
        renderCapacitySimulator(targetContainer);
      } else if (viewName === 'datasets') {
        renderDatasetsView(targetContainer);
      }
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Refresh Icons
    if (window.lucide) {
      setTimeout(() => window.lucide.createIcons(), 50);
    }
  }

  showReport(screeningCase) {
    this.activeReportCase = screeningCase;
    openReportModal(screeningCase, () => {
      this.activeReportCase = null;
    });
  }

  showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <i data-lucide="check-circle-2" style="width:18px;height:18px; color:#10b981;"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    if (window.lucide) window.lucide.createIcons();

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease-out';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
}

// Instantiate App
window.drishKalyan = new DrishKalyanApp();
