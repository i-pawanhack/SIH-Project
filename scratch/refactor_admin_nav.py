import re
import sys

# 1. Update Navbar.js
navbar_path = 'src/components/Navbar.js'
with open(navbar_path, 'r', encoding='utf-8') as f:
    nav_content = f.read()

# Inject isAdmin and currentPHC
old_phc_logic = '''  const logins = StorageService.getLogins();
  const currentPHC = logins.length > 0 ? logins[logins.length - 1].phcId : 'PHC-001';'''

new_phc_logic = '''  const isAdmin = StorageService.isAdminLoggedIn();
  const logins = StorageService.getLogins();
  const currentPHC = isAdmin ? 'System Admin' : (logins.length > 0 ? logins[logins.length - 1].phcId : 'PHC-001');'''

nav_content = nav_content.replace(old_phc_logic, new_phc_logic)

# Replace nav-links block
old_nav_links = '''        <!-- Navigation Links -->
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
        </ul>'''

new_nav_links = '''        <!-- Navigation Links -->
        <ul class="nav-links">
          ${isAdmin ? `
            <li>
              <a class="nav-item ${currentView === 'admin-dashboard' ? 'active' : ''}" data-view="admin-dashboard">
                <i data-lucide="shield" style="width:16px;height:16px;"></i>
                <span>Control Panel</span>
              </a>
            </li>
          ` : `
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
          `}
        </ul>'''

nav_content = nav_content.replace(old_nav_links, new_nav_links)

# Hide CTA button for Admin
old_cta = '''          <!-- New Screening CTA Button -->
          <button class="btn-new-screening-cta" id="nav-new-screening-cta">
            <i data-lucide="scan" style="width:16px;height:16px;"></i>
            <span data-i18n="nav.newScreening">${window.t('nav.newScreening')}</span>
          </button>'''

new_cta = '''          <!-- New Screening CTA Button -->
          ${isAdmin ? '' : `
          <button class="btn-new-screening-cta" id="nav-new-screening-cta">
            <i data-lucide="scan" style="width:16px;height:16px;"></i>
            <span data-i18n="nav.newScreening">${window.t('nav.newScreening')}</span>
          </button>
          `}'''

nav_content = nav_content.replace(old_cta, new_cta)

with open(navbar_path, 'w', encoding='utf-8') as f:
    f.write(nav_content)


# 2. Update AdminDashboardView.js
admin_path = 'src/components/AdminDashboardView.js'
with open(admin_path, 'r', encoding='utf-8') as f:
    admin_content = f.read()

# Replace innerHTML layout
old_layout_pattern = re.compile(r'<style>.*?</style>\s*<div class="admin-layout">.*?</div>\s*`;', re.DOTALL)
new_layout = '''<style>
        .admin-tabs { display: flex; border-bottom: 1px solid var(--border-gray); margin-bottom: 20px; gap: 24px; overflow-x: auto; white-space: nowrap; padding-bottom: 8px;}
        .admin-tab { padding: 10px 4px; border-bottom: 2px solid transparent; color: var(--slate-500); cursor: pointer; font-weight: 500; font-size: 0.9rem; display: flex; align-items: center; gap: 6px; transition: 0.2s;}
        .admin-tab:hover { color: var(--slate-800); }
        .admin-tab.active { border-bottom-color: var(--primary-600); color: var(--primary-600); }
      </style>

      <div style="margin-bottom: 24px; padding-top: 16px;">
        <h1 style="font-size:1.75rem; color:var(--slate-900); font-weight: 700; margin: 0 0 8px 0;">Admin Control Panel</h1>
        <p style="color:var(--slate-500); margin:0;">Manage platform settings, users, and system health.</p>
      </div>

      <div class="admin-tabs" id="admin-nav-container"></div>
      
      <div id="admin-content-root"></div>
    `;'''

admin_content = old_layout_pattern.sub(new_layout, admin_content)

# Update Javascript classes for nav
admin_content = admin_content.replace("el.className = 'admin-nav-item';", "el.className = 'admin-tab';")
admin_content = admin_content.replace(".admin-nav-item", ".admin-tab")

# Fix the duplicate tabs ID in some tab renders
admin_content = admin_content.replace('<div class="admin-tabs">', '<div class="admin-tabs" style="margin-bottom: 20px; border-bottom: 1px solid var(--border-gray);">')

with open(admin_path, 'w', encoding='utf-8') as f:
    f.write(admin_content)

print("Both files updated successfully.")
