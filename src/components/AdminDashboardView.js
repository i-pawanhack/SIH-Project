/**
 * Drish Kalyan / Drishti Kalyan — Complete Executive Admin Control Panel
 * Full Screen Responsive Layout & Interactive India / District Zoom Map System
 */

export function renderAdminDashboardView(container, onNavigate) {
  import('../services/storageService.js').then(({ StorageService }) => {
    if (!StorageService.isAdminLoggedIn()) {
      onNavigate('login');
      return;
    }

    const adminSession = StorageService.getAdminSession();

    // State variable for map view ('india' vs 'district')
    let currentMapMode = 'india'; // 'india' or 'district'
    let selectedDistrict = 'Bareilly';

    // Main App Shell HTML & CSS
    container.innerHTML = `
      <style>
        #view-admin-dashboard { padding: 0 !important; margin: 0 !important; width: 100vw; height: 100vh; overflow: hidden; }
        * { box-sizing: border-box; }

        :root {
          --admin-sidebar-bg: #032b28;
          --admin-sidebar-hover: #074742;
          --admin-sidebar-active: #0b5c56;
          --admin-bg-light: #f4f7f6;
          --admin-card-bg: #ffffff;
          --admin-text-dark: #0f172a;
          --admin-text-muted: #64748b;
          --admin-border: #e2e8f0;
          --admin-primary: #0d9488;
          --admin-primary-dark: #0f766e;
          --admin-accent-green: #10b981;
          --admin-accent-amber: #f59e0b;
          --admin-accent-red: #ef4444;
          --admin-accent-purple: #8b5cf6;
          --admin-font: 'Inter', system-ui, -apple-system, sans-serif;
        }

        .dk-admin-layout {
          display: flex;
          width: 100vw;
          height: 100vh;
          background: var(--admin-bg-light);
          font-family: var(--admin-font);
          color: var(--admin-text-dark);
          overflow: hidden;
        }

        /* SIDEBAR STYLING */
        .dk-sidebar {
          width: 240px;
          background: var(--admin-sidebar-bg);
          color: #ffffff;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          user-select: none;
          box-shadow: 2px 0 10px rgba(0,0,0,0.15);
          z-index: 10;
        }

        .dk-sidebar-brand {
          padding: 16px 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .dk-brand-logo {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(16, 185, 129, 0.2);
          border: 1px solid #10b981;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6ee7b7;
          flex-shrink: 0;
        }

        .dk-brand-title {
          font-family: 'Outfit', sans-serif;
          font-weight: 700;
          font-size: 0.95rem;
          letter-spacing: 0.5px;
          color: #ffffff;
          line-height: 1.1;
        }

        .dk-brand-sub {
          font-size: 0.575rem;
          color: #6ee7b7;
          letter-spacing: 0.3px;
          text-transform: uppercase;
          margin-top: 2px;
        }

        .dk-sidebar-nav {
          flex: 1;
          overflow-y: auto;
          padding: 8px 8px;
        }

        .dk-sidebar-nav::-webkit-scrollbar {
          width: 4px;
        }
        .dk-sidebar-nav::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.15);
          border-radius: 4px;
        }

        .dk-nav-group {
          margin-top: 12px;
          margin-bottom: 4px;
          padding: 0 10px;
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 1px;
          color: rgba(255, 255, 255, 0.45);
          text-transform: uppercase;
        }

        .dk-nav-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 10px;
          margin-bottom: 2px;
          border-radius: 6px;
          color: rgba(255, 255, 255, 0.75);
          cursor: pointer;
          font-size: 0.8rem;
          font-weight: 500;
          transition: all 0.15s ease-in-out;
        }

        .dk-nav-item:hover {
          background: var(--admin-sidebar-hover);
          color: #ffffff;
        }

        .dk-nav-item.active {
          background: var(--admin-sidebar-active);
          color: #ffffff;
          font-weight: 600;
          box-shadow: inset 3px 0 0 #10b981;
        }

        .dk-nav-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .dk-nav-badge {
          background: #ef4444;
          color: white;
          font-size: 0.6rem;
          font-weight: 700;
          padding: 1px 5px;
          border-radius: 10px;
        }

        .dk-sidebar-footer {
          padding: 10px 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.4);
          text-align: center;
          background: rgba(0,0,0,0.15);
        }

        /* MAIN BODY AREA */
        .dk-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: #f1f5f9;
        }

        /* HEADER BAR */
        .dk-header {
          height: 54px;
          background: #ffffff;
          border-bottom: 1px solid var(--admin-border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          flex-shrink: 0;
          z-index: 5;
        }

        .dk-header-title {
          font-size: 1rem;
          font-weight: 700;
          color: var(--admin-text-dark);
          margin: 0;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .dk-header-sub {
          font-size: 0.7rem;
          color: var(--admin-text-muted);
        }

        .dk-header-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .dk-status-group {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #f8fafc;
          padding: 3px 8px;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          font-size: 0.675rem;
        }

        .dk-status-pill {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #334155;
          font-weight: 500;
        }

        .dk-status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .dot-green { background: #10b981; box-shadow: 0 0 5px rgba(16,185,129,0.4); }
        .dot-amber { background: #f59e0b; box-shadow: 0 0 5px rgba(245,158,11,0.4); }

        .dk-user-profile {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          padding: 3px 6px;
          border-radius: 6px;
          transition: 0.2s;
        }

        .dk-user-profile:hover {
          background: #f1f5f9;
        }

        .dk-user-avatar {
          width: 30px;
          height: 30px;
          background: #0f172a;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.75rem;
        }

        .dk-user-info {
          text-align: right;
          line-height: 1.1;
        }

        .dk-user-name {
          font-size: 0.775rem;
          font-weight: 600;
          color: var(--admin-text-dark);
        }

        .dk-user-role {
          font-size: 0.625rem;
          color: var(--admin-text-muted);
        }

        /* CONTENT ROOT (FULL SCREEN AUTO-FIT) */
        .dk-content-root {
          flex: 1;
          overflow-y: auto;
          padding: 12px 16px 20px 16px;
        }

        .dk-content-root::-webkit-scrollbar {
          width: 5px;
        }
        .dk-content-root::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }

        /* CARD STYLES */
        .dk-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 14px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.03);
          position: relative;
        }

        .dk-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .dk-card-title {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--admin-text-dark);
          margin: 0;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .dk-link {
          color: #0d9488;
          font-size: 0.725rem;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          transition: 0.2s;
        }

        .dk-link:hover {
          color: #0f766e;
          text-decoration: underline;
        }

        /* KPI STATS GRID (8 COLUMNS RESPONSIVE FULL FIT) */
        .dk-kpi-grid {
          display: grid;
          grid-template-columns: repeat(8, minmax(0, 1fr));
          gap: 8px;
          margin-bottom: 12px;
        }

        @media (max-width: 1300px) {
          .dk-kpi-grid { grid-template-columns: repeat(4, 1fr); }
        }
        @media (max-width: 800px) {
          .dk-kpi-grid { grid-template-columns: repeat(2, 1fr); }
        }

        .dk-kpi-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 10px 8px;
          cursor: pointer;
          transition: all 0.15s ease;
          position: relative;
          overflow: hidden;
        }

        .dk-kpi-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(0,0,0,0.06);
          border-color: #0d9488;
        }

        .dk-kpi-icon-wrap {
          width: 24px;
          height: 24px;
          border-radius: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 6px;
        }

        .dk-kpi-label {
          font-size: 0.65rem;
          color: var(--admin-text-muted);
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .dk-kpi-val {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--admin-text-dark);
          margin: 1px 0 2px 0;
          font-family: 'Outfit', sans-serif;
          line-height: 1;
        }

        .dk-kpi-trend {
          font-size: 0.6rem;
          font-weight: 600;
          white-space: nowrap;
        }

        .trend-up { color: #166534; }
        .trend-down { color: #991b1b; }

        /* MID GRID ROWS */
        .dk-row-3 {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 12px;
          margin-bottom: 12px;
        }

        @media (max-width: 1100px) {
          .dk-row-3 { grid-template-columns: 1fr; }
        }

        /* ALERT ITEMS */
        .dk-alert-box {
          padding: 8px 10px;
          border-radius: 5px;
          margin-bottom: 6px;
          display: flex;
          align-items: flex-start;
          gap: 8px;
          cursor: pointer;
          transition: 0.15s;
        }

        .dk-alert-box:hover {
          filter: brightness(0.96);
        }

        .alert-red { background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; }
        .alert-amber { background: #fffbeb; border: 1px solid #fde68a; color: #92400e; }

        .dk-alert-title {
          font-size: 0.725rem;
          font-weight: 700;
          margin-bottom: 1px;
        }

        .dk-alert-desc {
          font-size: 0.65rem;
          opacity: 0.85;
        }

        .dk-alert-time {
          font-size: 0.6rem;
          opacity: 0.7;
          margin-left: auto;
          white-space: nowrap;
        }

        /* TABLES */
        .dk-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.725rem;
        }

        .dk-table th {
          text-align: left;
          padding: 6px 8px;
          background: #f8fafc;
          color: var(--admin-text-muted);
          font-weight: 600;
          border-bottom: 1px solid #e2e8f0;
        }

        .dk-table td {
          padding: 7px 8px;
          border-bottom: 1px solid #f1f5f9;
          color: var(--admin-text-dark);
        }

        .dk-table tr {
          cursor: pointer;
          transition: 0.15s;
        }

        .dk-table tr:hover td {
          background: #f8fafc;
        }

        .dk-badge {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          padding: 2px 5px;
          border-radius: 4px;
          font-size: 0.625rem;
          font-weight: 600;
        }

        .badge-active { background: #dcfce7; color: #15803d; }
        .badge-pending { background: #fef3c7; color: #b45309; }
        .badge-attention { background: #fee2e2; color: #b91c1c; }

        /* MAP PIN PULSE */
        .map-pin-pulse {
          cursor: pointer;
          transition: transform 0.2s;
        }

        .map-pin-pulse:hover {
          transform: scale(1.4);
        }

        /* MODAL POPUP */
        .dk-modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s ease;
        }

        .dk-modal-overlay.active {
          opacity: 1;
          pointer-events: auto;
        }

        .dk-modal-card {
          background: white;
          border-radius: 8px;
          width: 90%;
          max-width: 520px;
          box-shadow: 0 20px 25px -5px rgba(0,0,0,0.2);
          overflow: hidden;
          animation: modalSlide 0.2s ease-out;
        }

        @keyframes modalSlide {
          from { transform: translateY(12px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .dk-modal-header {
          padding: 14px 18px;
          background: #0f172a;
          color: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .dk-modal-body {
          padding: 16px;
          max-height: 70vh;
          overflow-y: auto;
        }

        .dk-modal-footer {
          padding: 10px 16px;
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
          display: flex;
          justify-content: flex-end;
          gap: 8px;
        }

        .dk-btn {
          padding: 5px 12px;
          border-radius: 5px;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: 0.15s;
        }

        .dk-btn-primary { background: #0d9488; color: white; }
        .dk-btn-primary:hover { background: #0f766e; }
        .dk-btn-secondary { background: #e2e8f0; color: #334155; }
        .dk-btn-secondary:hover { background: #cbd5e1; }
      </style>

      <div class="dk-admin-layout">
        <!-- SIDEBAR -->
        <aside class="dk-sidebar">
          <div class="dk-sidebar-brand">
            <div class="dk-brand-logo">
              <i data-lucide="eye" style="width:18px;height:18px;"></i>
            </div>
            <div>
              <div class="dk-brand-title">DRISH KALYAN</div>
              <div class="dk-brand-sub">HEALTHIER EYES • STRONGER RURAL INDIA</div>
            </div>
          </div>

          <nav class="dk-sidebar-nav" id="dk-sidebar-nav"></nav>

          <div class="dk-sidebar-footer">
            Better Vision | Brighter Future
          </div>
        </aside>

        <!-- MAIN VIEW -->
        <main class="dk-main">
          <!-- HEADER -->
          <header class="dk-header">
            <div>
              <h1 class="dk-header-title">
                <span id="dk-greeting">☀️ Good Morning, ${adminSession?.name || 'Admin'}</span>
              </h1>
              <div class="dk-header-sub">Here's what's happening with your rural screening network today.</div>
            </div>

            <div class="dk-header-right">
              <div class="dk-status-group">
                <span style="font-weight:700; color:#64748b; margin-right:2px;">System Status</span>
                <span class="dk-status-pill"><span class="dk-status-dot dot-green"></span> All Systems Operational</span>
                <span class="dk-status-pill"><span class="dk-status-dot dot-green"></span> AI Engine Online</span>
                <span class="dk-status-pill"><span class="dk-status-dot dot-green"></span> Database Online</span>
                <span class="dk-status-pill"><span class="dk-status-dot dot-green"></span> PHC Sync Online</span>
                <span class="dk-status-pill"><span class="dk-status-dot dot-amber"></span> 3 Devices Offline</span>
              </div>

              <div class="dk-user-profile" id="dk-profile-trigger">
                <div class="dk-user-avatar">${(adminSession?.name || 'Admin').charAt(0).toUpperCase()}</div>
                <div class="dk-user-info">
                  <div class="dk-user-name">${adminSession?.name || 'Admin'}</div>
                  <div class="dk-user-role">Super Admin ▾</div>
                </div>
              </div>
            </div>
          </header>

          <!-- DYNAMIC CONTENT -->
          <div class="dk-content-root" id="dk-content-root"></div>
        </main>
      </div>

      <!-- INTERACTIVE MODAL DIALOG CONTAINER -->
      <div class="dk-modal-overlay" id="dk-modal-overlay">
        <div class="dk-modal-card">
          <div class="dk-modal-header">
            <h3 id="dk-modal-title" style="margin:0; font-size:0.95rem;">Detail View</h3>
            <button id="dk-modal-close" style="background:none; border:none; color:white; cursor:pointer;"><i data-lucide="x" style="width:16px;height:16px;"></i></button>
          </div>
          <div class="dk-modal-body" id="dk-modal-body"></div>
          <div class="dk-modal-footer">
            <button class="dk-btn dk-btn-secondary" id="dk-modal-cancel">Close</button>
            <button class="dk-btn dk-btn-primary" id="dk-modal-action">Execute Action</button>
          </div>
        </div>
      </div>
    `;

    // NAV CONFIGURATION MATRIX
    const navItems = [
      { section: 'MAIN' },
      { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
      { id: 'analytics', label: 'Analytics & Reports', icon: 'bar-chart-3' },
      { section: 'HEALTHCARE' },
      { id: 'patients', label: 'Patient Management', icon: 'users' },
      { id: 'screenings', label: 'Screening Management', icon: 'scan-eye' },
      { id: 'phcs', label: 'PHC Management', icon: 'building' },
      { id: 'doctors', label: 'Doctor Management', icon: 'stethoscope' },
      { section: 'AI' },
      { id: 'ai-model', label: 'AI Model Management', icon: 'brain-circuit' },
      { id: 'ai-perf', label: 'AI Performance', icon: 'activity' },
      { id: 'xai', label: 'Explainability / XAI', icon: 'eye' },
      { section: 'SYSTEM' },
      { id: 'users', label: 'User Management', icon: 'user-check' },
      { id: 'notifications', label: 'Notifications', icon: 'bell', badge: 3 },
      { id: 'monitoring', label: 'System Monitoring', icon: 'cpu' },
      { id: 'security', label: 'Security', icon: 'shield-check' },
      { id: 'backup', label: 'Backup & Recovery', icon: 'database' },
      { section: 'CONTENT' },
      { id: 'website', label: 'Website Management', icon: 'globe' },
      { id: 'content', label: 'Content / Blog', icon: 'file-text' }
    ];

    // Render Navigation Items
    const navContainer = container.querySelector('#dk-sidebar-nav');
    navItems.forEach(item => {
      if (item.section) {
        const secHeader = document.createElement('div');
        secHeader.className = 'dk-nav-group';
        secHeader.textContent = item.section;
        navContainer.appendChild(secHeader);
      } else {
        const navEl = document.createElement('div');
        navEl.className = `dk-nav-item ${item.id === 'dashboard' ? 'active' : ''}`;
        navEl.dataset.id = item.id;
        navEl.innerHTML = `
          <div class="dk-nav-left">
            <i data-lucide="${item.icon}" style="width:15px;height:15px;"></i>
            <span>${item.label}</span>
          </div>
          ${item.badge ? `<span class="dk-nav-badge">${item.badge}</span>` : ''}
        `;

        navEl.addEventListener('click', () => {
          switchTab(item.id);
        });
        navContainer.appendChild(navEl);
      }
    });

    if (window.lucide) window.lucide.createIcons();

    // MODAL HELPERS
    const modalOverlay = container.querySelector('#dk-modal-overlay');
    const modalTitle = container.querySelector('#dk-modal-title');
    const modalBody = container.querySelector('#dk-modal-body');
    const modalClose = container.querySelector('#dk-modal-close');
    const modalCancel = container.querySelector('#dk-modal-cancel');
    const modalAction = container.querySelector('#dk-modal-action');

    function openModal(title, htmlContent, actionLabel = 'Action', onAction = null) {
      modalTitle.textContent = title;
      modalBody.innerHTML = htmlContent;
      modalAction.textContent = actionLabel;
      modalOverlay.classList.add('active');

      const handleAction = () => {
        if (onAction) onAction();
        closeModal();
      };

      modalAction.onclick = handleAction;
    }

    function closeModal() {
      modalOverlay.classList.remove('active');
    }

    modalClose.onclick = closeModal;
    modalCancel.onclick = closeModal;
    modalOverlay.onclick = (e) => {
      if (e.target === modalOverlay) closeModal();
    };

    // User Profile Trigger
    container.querySelector('#dk-profile-trigger').addEventListener('click', () => {
      openModal(
        'Admin Account Settings',
        `
          <div style="display:flex; align-items:center; gap:14px; margin-bottom:14px;">
            <div style="width:44px; height:44px; background:#0f172a; color:white; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:1.1rem; font-weight:bold;">${(adminSession?.name || 'Admin').charAt(0).toUpperCase()}</div>
            <div>
              <h4 style="margin:0; font-size:0.95rem;">${adminSession?.name || 'Admin'}</h4>
              <div style="font-size:0.75rem; color:#64748b;">${adminSession?.email || 'admin@drishkalyan.in'}</div>
              <span class="dk-badge badge-active" style="margin-top:3px;">Super Administrator</span>
            </div>
          </div>
          <p style="font-size:0.8rem; color:#475569;">You are currently logged in with full administrative privileges over the Drish Kalyan screening network.</p>
        `,
        'Logout',
        () => {
          StorageService.logoutAdmin();
          onNavigate('login');
        }
      );
    });

    // TAB SWITCHER FUNCTION
    function switchTab(tabId) {
      navContainer.querySelectorAll('.dk-nav-item').forEach(el => el.classList.remove('active'));
      const activeNav = navContainer.querySelector(`.dk-nav-item[data-id="${tabId}"]`);
      if (activeNav) activeNav.classList.add('active');

      const contentRoot = container.querySelector('#dk-content-root');
      contentRoot.innerHTML = '';

      switch (tabId) {
        case 'dashboard': renderDashboardView(contentRoot); break;
        case 'analytics': renderAnalyticsView(contentRoot); break;
        case 'patients': renderPatientsView(contentRoot); break;
        case 'screenings': renderScreeningsView(contentRoot); break;
        case 'phcs': renderPHCsView(contentRoot); break;
        case 'doctors': renderDoctorsView(contentRoot); break;
        case 'ai-model': renderAIModelView(contentRoot); break;
        case 'ai-perf': renderAIPerformanceView(contentRoot); break;
        case 'xai': renderXAIView(contentRoot); break;
        case 'users': renderUsersView(contentRoot); break;
        case 'notifications': renderNotificationsView(contentRoot); break;
        case 'monitoring': renderMonitoringView(contentRoot); break;
        case 'security': renderSecurityView(contentRoot); break;
        case 'backup': renderBackupView(contentRoot); break;
        case 'website': renderWebsiteView(contentRoot); break;
        case 'content': renderContentView(contentRoot); break;
        default: renderDashboardView(contentRoot); break;
      }

      if (window.lucide) window.lucide.createIcons();
    }

    // MAIN DASHBOARD RENDERER
    function renderDashboardView(root) {
      root.innerHTML = `
        <!-- KPI METRICS (8 CARDS FIT FULL SCREEN) -->
        <div class="dk-kpi-grid">
          ${kpiCard('patients', 'users', 'Total Patients', '18,429', '↑ 12% vs last week', 'trend-up', '#e0f2fe', '#0284c7')}
          ${kpiCard('screenings', 'scan-eye', 'Total Screenings', '15,672', '↑ 18% vs last week', 'trend-up', '#dcfce7', '#16a34a')}
          ${kpiCard('positive', 'activity', 'Positive DR Cases', '1,284', '↑ 9% vs last week', 'trend-up', '#ffe4e6', '#e11d48')}
          ${kpiCard('highrisk', 'alert-triangle', 'High-Risk Cases', '684', '↑ 14% vs last week', 'trend-up', '#ffedd5', '#ea580c')}
          ${kpiCard('phcs', 'building', 'Active PHCs', '126', '↑ 6% vs last week', 'trend-up', '#dcfce7', '#16a34a')}
          ${kpiCard('doctors', 'stethoscope', 'Active Doctors', '248', '↑ 8% vs last week', 'trend-up', '#e0f2fe', '#0284c7')}
          ${kpiCard('accuracy', 'brain-circuit', 'AI Model Accuracy', '94.8%', '↑ 0.6% vs last week', 'trend-up', '#ccfbf1', '#0d9488')}
          ${kpiCard('pending', 'clock', 'Pending Reviews', '137', '↓ 21% vs last week', 'trend-down', '#fee2e2', '#dc2626')}
        </div>

        <!-- ROW 1 (3 COLUMNS) -->
        <div class="dk-row-3">
          <!-- TODAY SCREENING OVERVIEW -->
          <div class="dk-card">
            <div class="dk-card-header">
              <h3 class="dk-card-title"><i data-lucide="clipboard-list" style="width:15px;height:15px;color:#0d9488;"></i> Today's Screening Overview</h3>
              <select style="font-size:0.7rem; border:1px solid #cbd5e1; border-radius:4px; padding:2px 5px; background:#fff;" id="dk-date-filter">
                <option>📅 24 Sep 2025</option>
                <option>📅 23 Sep 2025</option>
                <option>📅 Last 7 Days</option>
              </select>
            </div>
            
            <div style="display:flex; align-items:center; justify-content:space-between; margin:14px 0;">
              <div style="text-align:center; flex:1;">
                <div style="width:38px; height:38px; background:#dcfce7; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 4px auto; color:#16a34a;">
                  <i data-lucide="users" style="width:18px;height:18px;"></i>
                </div>
                <div style="font-size:1.1rem; font-weight:800; color:#0f172a;">2,846</div>
                <div style="font-size:0.6rem; font-weight:700; color:#64748b; text-transform:uppercase;">SCREENED</div>
              </div>
              
              <i data-lucide="chevron-right" style="color:#cbd5e1; width:14px;"></i>

              <div style="text-align:center; flex:1;">
                <div style="width:38px; height:38px; background:#f3e8ff; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 4px auto; color:#9333ea;">
                  <i data-lucide="brain" style="width:18px;height:18px;"></i>
                </div>
                <div style="font-size:1.1rem; font-weight:800; color:#0f172a;">184</div>
                <div style="font-size:0.6rem; font-weight:700; color:#9333ea; text-transform:uppercase;">AI FLAGGED</div>
              </div>

              <i data-lucide="chevron-right" style="color:#cbd5e1; width:14px;"></i>

              <div style="text-align:center; flex:1;">
                <div style="width:38px; height:38px; background:#ccfbf1; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 4px auto; color:#0d9488;">
                  <i data-lucide="file-check-2" style="width:18px;height:18px;"></i>
                </div>
                <div style="font-size:1.1rem; font-weight:800; color:#0f172a;">37</div>
                <div style="font-size:0.6rem; font-weight:700; color:#0d9488; text-transform:uppercase;">REFERRALS</div>
              </div>
            </div>

            <div style="display:flex; justify-content:space-between; font-size:0.65rem; color:#94a3b8; border-top:1px border-dashed #e2e8f0; padding-top:6px;">
              <span>Screening</span>
              <span>AI Analysis</span>
              <span>Doctor Review</span>
              <span>Referral</span>
            </div>
          </div>

          <!-- ADMIN ALERT CENTER -->
          <div class="dk-card">
            <div class="dk-card-header">
              <h3 class="dk-card-title">
                <i data-lucide="bell" style="width:15px;height:15px;color:#ef4444;"></i> Admin Alert Center
                <span style="background:#ef4444; color:white; font-size:0.6rem; padding:1px 5px; border-radius:10px;">3</span>
              </h3>
              <span class="dk-link" id="dk-alert-view-all">View All ➔</span>
            </div>

            <div class="dk-alert-box alert-red" data-alert="highrisk">
              <i data-lucide="alert-triangle" style="width:16px;height:16px; flex-shrink:0;"></i>
              <div>
                <div class="dk-alert-title">12 High-risk cases awaiting review</div>
                <div class="dk-alert-desc">Require immediate attention from doctors.</div>
              </div>
              <span class="dk-alert-time">2h ago</span>
            </div>

            <div class="dk-alert-box alert-amber" data-alert="sync">
              <i data-lucide="wifi-off" style="width:16px;height:16px; flex-shrink:0;"></i>
              <div>
                <div class="dk-alert-title">8 PHCs haven't synced data today</div>
                <div class="dk-alert-desc">Check Internet connectivity / device status.</div>
              </div>
              <span class="dk-alert-time">4h ago</span>
            </div>

            <div class="dk-alert-box alert-amber" data-alert="quality">
              <i data-lucide="image-off" style="width:16px;height:16px; flex-shrink:0;"></i>
              <div>
                <div class="dk-alert-title">24 images failed quality check</div>
                <div class="dk-alert-desc">Retake images or verify device settings.</div>
              </div>
              <span class="dk-alert-time">5h ago</span>
            </div>
          </div>

          <!-- AI MODEL MONITORING -->
          <div class="dk-card">
            <div class="dk-card-header">
              <h3 class="dk-card-title"><i data-lucide="cpu" style="width:15px;height:15px;color:#0d9488;"></i> AI Model Monitoring</h3>
              <span class="dk-link" id="dk-ai-view-analytics">View Analytics ➔</span>
            </div>

            <div style="display:flex; align-items:center; gap:16px; margin:8px 0;">
              <div style="position:relative; width:85px; height:85px; flex-shrink:0;">
                <svg viewBox="0 0 100 100" style="width:100%; height:100%;">
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#e2e8f0" stroke-width="10"/>
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10b981" stroke-width="10" stroke-dasharray="238 251" stroke-dashoffset="0" stroke-linecap="round"/>
                </svg>
                <div style="position:absolute; top:0; left:0; right:0; bottom:0; display:flex; flex-direction:column; align-items:center; justify-content:center;">
                  <span style="font-size:0.95rem; font-weight:800; color:#0f172a;">94.8%</span>
                  <span style="font-size:0.55rem; color:#64748b;">Accuracy</span>
                </div>
              </div>

              <div style="flex:1; font-size:0.725rem;">
                <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                  <span style="color:#64748b;">Images Processed</span>
                  <strong style="color:#0f172a;">18,429 <span style="color:#16a34a; font-size:0.6rem;">↑ 18%</span></strong>
                </div>
                <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                  <span style="color:#64748b;">Quality Rejection</span>
                  <strong style="color:#0f172a;">3.2% <span style="color:#16a34a; font-size:0.6rem;">↓ 1.1%</span></strong>
                </div>
                <div style="font-size:0.65rem; color:#94a3b8; margin-top:6px;">
                  📅 Last Model Update: <strong style="color:#475569;">Today</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ROW 2 (3 COLUMNS: PHC PERFORMANCE, INTERACTIVE INDIA/DISTRICT ZOOM MAP, REFERRAL & SYSTEM HEALTH) -->
        <div class="dk-row-3">
          <!-- PHC PERFORMANCE -->
          <div class="dk-card" style="grid-column: span 1;">
            <div class="dk-card-header">
              <h3 class="dk-card-title"><i data-lucide="building" style="width:15px;height:15px;color:#0d9488;"></i> PHC Performance</h3>
              <span class="dk-link" id="dk-phc-view-all">View All PHCs ➔</span>
            </div>

            <table class="dk-table">
              <thead>
                <tr>
                  <th>PHC Name</th>
                  <th>District</th>
                  <th>Screenings</th>
                  <th>Positive</th>
                  <th>Pending</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr data-phc="Bithri" data-district="Bareilly">
                  <td><strong>PHC Bithri</strong></td>
                  <td>Bareilly</td>
                  <td>420</td>
                  <td>32</td>
                  <td>4</td>
                  <td><span class="dk-badge badge-active">● Active</span></td>
                </tr>
                <tr data-phc="Aonla" data-district="Bareilly">
                  <td><strong>PHC Aonla</strong></td>
                  <td>Bareilly</td>
                  <td>318</td>
                  <td>27</td>
                  <td>12</td>
                  <td><span class="dk-badge badge-pending">● Sync Pending</span></td>
                </tr>
                <tr data-phc="Fatehganj" data-district="Shahjahanpur">
                  <td><strong>PHC Fatehganj</strong></td>
                  <td>Shahjahanpur</td>
                  <td>186</td>
                  <td>19</td>
                  <td>18</td>
                  <td><span class="dk-badge badge-attention">● Needs Attention</span></td>
                </tr>
                <tr data-phc="Tilhar" data-district="Shahjahanpur">
                  <td><strong>PHC Tilhar</strong></td>
                  <td>Shahjahanpur</td>
                  <td>264</td>
                  <td>21</td>
                  <td>6</td>
                  <td><span class="dk-badge badge-active">● Active</span></td>
                </tr>
                <tr data-phc="Misrikh" data-district="Sitapur">
                  <td><strong>PHC Misrikh</strong></td>
                  <td>Sitapur</td>
                  <td>308</td>
                  <td>25</td>
                  <td>14</td>
                  <td><span class="dk-badge badge-active">● Active</span></td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- RURAL INDIA PHC COVERAGE (INTERACTIVE MAP WITH INDIA vs DISTRICT ZOOM MODE) -->
          <div class="dk-card" style="grid-column: span 1;" id="dk-map-container-card">
            <!-- Dynamic Map Rendered via JS below -->
          </div>

          <!-- REFERRAL PRIORITY & SYSTEM HEALTH -->
          <div style="display:flex; flex-direction:column; gap:12px;">
            <!-- REFERRAL PRIORITY -->
            <div class="dk-card" style="flex:1;">
              <div class="dk-card-header">
                <h3 class="dk-card-title"><i data-lucide="alert-circle" style="width:15px;height:15px;color:#ea580c;"></i> Referral Priority</h3>
                <span class="dk-link" id="dk-ref-view-queue">View Referral Queue ➔</span>
              </div>

              <div style="display:flex; align-items:center; justify-content:space-between;">
                <div style="position:relative; width:75px; height:75px;">
                  <svg viewBox="0 0 100 100" style="width:100%; height:100%;">
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#e2e8f0" stroke-width="10"/>
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#ef4444" stroke-width="10" stroke-dasharray="30 251" stroke-dashoffset="0"/>
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f97316" stroke-width="10" stroke-dasharray="60 251" stroke-dashoffset="-30"/>
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#eab308" stroke-width="10" stroke-dasharray="140 251" stroke-dashoffset="-90"/>
                  </svg>
                  <div style="position:absolute; top:0; left:0; right:0; bottom:0; display:flex; flex-direction:column; align-items:center; justify-content:center;">
                    <span style="font-size:0.9rem; font-weight:800; color:#0f172a;">113</span>
                    <span style="font-size:0.5rem; color:#64748b;">Total Pending</span>
                  </div>
                </div>

                <div style="font-size:0.7rem; display:flex; flex-direction:column; gap:5px;">
                  <div style="display:flex; justify-content:space-between; gap:14px;">
                    <span style="color:#ef4444; font-weight:600;">● Immediate</span>
                    <strong style="color:#0f172a;">12</strong>
                  </div>
                  <div style="display:flex; justify-content:space-between; gap:14px;">
                    <span style="color:#f97316; font-weight:600;">● Within 7 days</span>
                    <strong style="color:#0f172a;">28</strong>
                  </div>
                  <div style="display:flex; justify-content:space-between; gap:14px;">
                    <span style="color:#eab308; font-weight:600;">● Routine Follow-up</span>
                    <strong style="color:#0f172a;">64</strong>
                  </div>
                </div>
              </div>
            </div>

            <!-- SYSTEM HEALTH -->
            <div class="dk-card" style="flex:1;">
              <div class="dk-card-header">
                <h3 class="dk-card-title"><i data-lucide="activity" style="width:15px;height:15px;color:#0d9488;"></i> System Health</h3>
              </div>

              <div style="font-size:0.675rem; display:flex; flex-direction:column; gap:5px;">
                <div>
                  <div style="display:flex; justify-content:space-between; margin-bottom:2px;">
                    <span style="color:#64748b;">Server Load</span>
                    <strong style="color:#10b981;">32%</strong>
                  </div>
                  <div style="height:4px; background:#e2e8f0; border-radius:2px; overflow:hidden;">
                    <div style="width:32%; height:100%; background:#10b981;"></div>
                  </div>
                </div>

                <div>
                  <div style="display:flex; justify-content:space-between; margin-bottom:2px;">
                    <span style="color:#64748b;">Database Usage</span>
                    <strong style="color:#f59e0b;">68%</strong>
                  </div>
                  <div style="height:4px; background:#e2e8f0; border-radius:2px; overflow:hidden;">
                    <div style="width:68%; height:100%; background:#f59e0b;"></div>
                  </div>
                </div>

                <div>
                  <div style="display:flex; justify-content:space-between; margin-bottom:2px;">
                    <span style="color:#64748b;">Storage Usage</span>
                    <strong style="color:#10b981;">41%</strong>
                  </div>
                  <div style="height:4px; background:#e2e8f0; border-radius:2px; overflow:hidden;">
                    <div style="width:41%; height:100%; background:#10b981;"></div>
                  </div>
                </div>

                <div style="margin-top:2px;">
                  <span class="dk-link" id="dk-sys-view-monitoring">View System Monitoring ➔</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ROW 3 (TREND, SEVERITY & ACTIVITY) -->
        <div class="dk-row-3">
          <div class="dk-card" style="grid-column: span 1;">
            <div class="dk-card-header">
              <h3 class="dk-card-title"><i data-lucide="trending-up" style="width:15px;height:15px;color:#0d9488;"></i> Screening Trend <span style="font-weight:normal; font-size:0.7rem; color:#94a3b8;">(Last 7 Days)</span></h3>
            </div>
            <div style="height:130px; position:relative;">
              <svg viewBox="0 0 300 100" style="width:100%; height:100%;">
                <path d="M 0,80 Q 50,60 100,40 T 200,30 T 300,10" fill="none" stroke="#0d9488" stroke-width="2"/>
                <path d="M 0,90 Q 50,85 100,75 T 200,65 T 300,50" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="3 3"/>
              </svg>
              <div style="display:flex; justify-content:center; gap:14px; font-size:0.625rem; margin-top:2px;">
                <span><span style="color:#0d9488;">—</span> Total Screenings</span>
                <span><span style="color:#ef4444;">--</span> Positive Cases</span>
              </div>
            </div>
          </div>

          <div class="dk-card" style="grid-column: span 1;">
            <div class="dk-card-header">
              <h3 class="dk-card-title"><i data-lucide="pie-chart" style="width:15px;height:15px;color:#0d9488;"></i> DR Severity Distribution</h3>
            </div>
            <div style="height:130px; display:flex; align-items:center; justify-content:space-around;">
              <svg viewBox="0 0 100 100" style="width:85px; height:85px;">
                <circle cx="50" cy="50" r="35" fill="transparent" stroke="#0d9488" stroke-width="12" stroke-dasharray="140 220"/>
                <circle cx="50" cy="50" r="35" fill="transparent" stroke="#3b82f6" stroke-width="12" stroke-dasharray="40 220" stroke-dashoffset="-140"/>
                <circle cx="50" cy="50" r="35" fill="transparent" stroke="#f59e0b" stroke-width="12" stroke-dasharray="25 220" stroke-dashoffset="-180"/>
                <circle cx="50" cy="50" r="35" fill="transparent" stroke="#ef4444" stroke-width="12" stroke-dasharray="15 220" stroke-dashoffset="-205"/>
              </svg>
              <div style="font-size:0.65rem; display:flex; flex-direction:column; gap:3px;">
                <span><span style="color:#0d9488;">●</span> No DR (65%)</span>
                <span><span style="color:#3b82f6;">●</span> Mild (18%)</span>
                <span><span style="color:#f59e0b;">●</span> Moderate (10%)</span>
                <span><span style="color:#ef4444;">●</span> Severe/PDR (7%)</span>
              </div>
            </div>
          </div>

          <div class="dk-card" style="grid-column: span 1;">
            <div class="dk-card-header">
              <h3 class="dk-card-title"><i data-lucide="history" style="width:15px;height:15px;color:#0d9488;"></i> Recent Activity</h3>
              <span class="dk-link" id="dk-act-view-all">View All ➔</span>
            </div>
            <div style="font-size:0.675rem; display:flex; flex-direction:column; gap:6px;">
              <div style="display:flex; justify-content:space-between; border-bottom:1px solid #f1f5f9; padding-bottom:3px;">
                <span>Dr. Sharma validated PT-88A9</span>
                <span style="color:#94a3b8; font-size:0.6rem;">5m ago</span>
              </div>
              <div style="display:flex; justify-content:space-between; border-bottom:1px solid #f1f5f9; padding-bottom:3px;">
                <span>PHC Bithri completed 14 scans</span>
                <span style="color:#94a3b8; font-size:0.6rem;">12m ago</span>
              </div>
              <div style="display:flex; justify-content:space-between;">
                <span>Model v2.1 auto-backup completed</span>
                <span style="color:#94a3b8; font-size:0.6rem;">1h ago</span>
              </div>
            </div>
          </div>
        </div>
      `;

      // DISTRICT NETWORK DICTIONARY FOR DYNAMIC STATE / CITY MAP DATA
      const DISTRICT_DATA = {
        'Bareilly': { state: 'Uttar Pradesh', phcs: 12, screenings: '4,210', suspected: 31, pending: 7, status: 'Active', color: '#10b981' },
        'Lucknow': { state: 'Uttar Pradesh', phcs: 38, screenings: '6,182', suspected: 63, pending: 14, status: 'Active', color: '#10b981' },
        'Shahjahanpur': { state: 'Uttar Pradesh', phcs: 18, screenings: '3,045', suspected: 42, pending: 12, status: 'Needs Attention', color: '#ef4444' },
        'Varanasi': { state: 'Uttar Pradesh', phcs: 22, screenings: '2,810', suspected: 28, pending: 6, status: 'Active', color: '#10b981' },
        'Gorakhpur': { state: 'Uttar Pradesh', phcs: 24, screenings: '2,182', suspected: 35, pending: 9, status: 'Sync Pending', color: '#f59e0b' },
        'Sitapur': { state: 'Uttar Pradesh', phcs: 10, screenings: '1,890', suspected: 22, pending: 4, status: 'Active', color: '#10b981' },
        'Patna': { state: 'Bihar', phcs: 15, screenings: '2,450', suspected: 30, pending: 8, status: 'Active', color: '#10b981' },
        'Bhopal': { state: 'Madhya Pradesh', phcs: 10, screenings: '1,650', suspected: 18, pending: 3, status: 'Active', color: '#10b981' }
      };

      // FUNCTION TO DYNAMICALLY RENDER THE MAP (INDIA MAP vs DISTRICT POLYGON MAP)
      function updateMapComponent() {
        const mapCard = root.querySelector('#dk-map-container-card');
        if (!mapCard) return;

        const dData = DISTRICT_DATA[selectedDistrict] || DISTRICT_DATA['Bareilly'];

        if (currentMapMode === 'india') {
          // RENDER FULL INDIA MAP VIEW WITH CLICKABLE STATE / CITY PINS
          mapCard.innerHTML = `
            <div class="dk-card-header">
              <h3 class="dk-card-title">
                <i data-lucide="map-pin" style="width:15px;height:15px;color:#0d9488;"></i> Rural India PHC Coverage
                <span style="font-size:0.65rem; color:#64748b; font-weight:normal;">(National Map View)</span>
              </h3>
              <select id="dk-map-district-select" style="font-size:0.65rem; background:#f0fdfa; border:1px solid #99f6e4; padding:2px 6px; border-radius:4px; font-weight:600; color:#0f766e; cursor:pointer;">
                <option value="" disabled selected>Select District / State ▾</option>
                <option value="Bareilly">Bareilly (UP)</option>
                <option value="Lucknow">Lucknow (UP)</option>
                <option value="Shahjahanpur">Shahjahanpur (UP)</option>
                <option value="Varanasi">Varanasi (UP)</option>
                <option value="Gorakhpur">Gorakhpur (UP)</option>
                <option value="Sitapur">Sitapur (UP)</option>
                <option value="Patna">Patna (Bihar)</option>
                <option value="Bhopal">Bhopal (MP)</option>
              </select>
            </div>

            <div style="height:170px; background:#e6f4f1; border-radius:6px; position:relative; overflow:hidden; display:flex; align-items:center; justify-content:center; margin-bottom:8px;">
              <!-- HIGH ACCURACY SVG MAP OF INDIA -->
              <svg viewBox="0 0 320 280" style="width:100%; height:100%; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.08));">
                <!-- INDIA MAP VECTOR PATHS -->
                <g fill="#a7f3d0" stroke="#059669" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M 130 20 L 150 15 L 170 30 L 165 55 L 140 60 L 120 45 Z" />
                  <path d="M 120 45 L 140 60 L 165 55 L 180 75 L 210 70 L 250 85 L 280 80 L 290 100 L 260 110 L 220 100 L 190 115 L 170 145 L 140 180 L 130 210 L 120 230 L 115 190 L 90 160 L 75 140 L 70 110 L 95 90 L 110 70 Z" />
                  <path d="M 115 190 L 140 180 L 130 210 L 125 245 L 110 260 L 105 240 L 100 210 Z" />
                  <path d="M 220 100 L 260 110 L 275 125 L 260 140 L 230 135 L 210 120 Z" />
                </g>

                <!-- REGIONAL PHC PINS (CLICKABLE TO ZOOM TO DYNAMIC DISTRICT DATA) -->
                <!-- UP / Bareilly Pin -->
                <g class="map-pin-pulse" data-city="Bareilly" transform="translate(135, 90)">
                  <circle r="6" fill="#ef4444" opacity="0.3"/>
                  <circle r="4" fill="#ef4444" stroke="#ffffff" stroke-width="1.5"><title>Bareilly (12 PHCs • 4,210 Screenings)</title></circle>
                  <text x="7" y="3" font-size="7.5" font-weight="bold" fill="#065f46">Bareilly</text>
                </g>

                <!-- Lucknow Pin -->
                <g class="map-pin-pulse" data-city="Lucknow" transform="translate(150, 102)">
                  <circle r="4" fill="#10b981" stroke="#ffffff" stroke-width="1.5"><title>Lucknow (38 PHCs • 6,182 Screenings)</title></circle>
                  <text x="6" y="3" font-size="6.5" fill="#1e293b">Lucknow</text>
                </g>

                <!-- Shahjahanpur Pin -->
                <g class="map-pin-pulse" data-city="Shahjahanpur" transform="translate(142, 96)">
                  <circle r="3.5" fill="#ef4444" stroke="#ffffff" stroke-width="1"><title>Shahjahanpur (18 PHCs • 3,045 Screenings)</title></circle>
                </g>

                <!-- Varanasi Pin -->
                <g class="map-pin-pulse" data-city="Varanasi" transform="translate(172, 112)">
                  <circle r="4" fill="#10b981" stroke="#ffffff" stroke-width="1.5"><title>Varanasi (22 PHCs • 2,810 Screenings)</title></circle>
                  <text x="6" y="3" font-size="6.5" fill="#1e293b">Varanasi</text>
                </g>

                <!-- Gorakhpur Pin -->
                <g class="map-pin-pulse" data-city="Gorakhpur" transform="translate(178, 100)">
                  <circle r="3.5" fill="#f59e0b" stroke="#ffffff" stroke-width="1"><title>Gorakhpur (24 PHCs • 2,182 Screenings)</title></circle>
                </g>

                <!-- Bihar / Patna Pin -->
                <g class="map-pin-pulse" data-city="Patna" transform="translate(195, 115)">
                  <circle r="4" fill="#10b981" stroke="#ffffff" stroke-width="1.5"><title>Patna (15 PHCs • 2,450 Screenings)</title></circle>
                  <text x="6" y="3" font-size="6.5" fill="#1e293b">Patna</text>
                </g>

                <!-- MP / Bhopal Pin -->
                <g class="map-pin-pulse" data-city="Bhopal" transform="translate(125, 135)">
                  <circle r="4" fill="#10b981" stroke="#ffffff" stroke-width="1.5"><title>Bhopal (10 PHCs • 1,650 Screenings)</title></circle>
                  <text x="6" y="3" font-size="6.5" fill="#1e293b">Bhopal</text>
                </g>
              </svg>

              <!-- LEGEND OVERLAY -->
              <div style="position:absolute; top:6px; right:6px; background:rgba(255,255,255,0.92); backdrop-filter:blur(2px); padding:5px 8px; border-radius:4px; font-size:0.575rem; border:1px solid #cbd5e1; display:flex; flex-direction:column; gap:2px; box-shadow:0 2px 4px rgba(0,0,0,0.05);">
                <span><span style="color:#10b981;">●</span> Active & Normal</span>
                <span><span style="color:#f59e0b;">●</span> Follow-up Required</span>
                <span><span style="color:#ef4444;">●</span> High-risk Cases</span>
                <span><span style="color:#94a3b8;">●</span> Offline / Sync Pending</span>
              </div>
            </div>

            <!-- ALL INDIA BOTTOM CARD -->
            <div style="background:#042f2c; color:white; padding:8px 10px; border-radius:5px; display:flex; align-items:center; justify-content:space-between;">
              <div>
                <div style="font-size:0.775rem; font-weight:700;">Rural India PHC Network</div>
                <div style="font-size:0.65rem; color:#a7f3d0;">126 Active PHCs • 28 Districts • 18,429 Screenings</div>
                <div style="font-size:0.575rem; color:rgba(255,255,255,0.7);">Click any city pin or select from dropdown to view local district map</div>
              </div>
              <button class="dk-btn dk-btn-primary" id="dk-india-zoom-btn" style="font-size:0.65rem; padding:3px 8px; white-space:nowrap;">Zoom Bareilly ➔</button>
            </div>
          `;

          // Listeners for Pins & Selectors
          mapCard.querySelectorAll('.map-pin-pulse').forEach(pin => {
            pin.onclick = () => {
              selectedDistrict = pin.dataset.city || 'Bareilly';
              currentMapMode = 'district';
              updateMapComponent();
            };
          });

          const selectEl = mapCard.querySelector('#dk-map-district-select');
          if (selectEl) selectEl.onchange = (e) => {
            selectedDistrict = e.target.value;
            currentMapMode = 'district';
            updateMapComponent();
          };

          const zoomBtn = mapCard.querySelector('#dk-india-zoom-btn');
          if (zoomBtn) zoomBtn.onclick = () => {
            selectedDistrict = 'Bareilly';
            currentMapMode = 'district';
            updateMapComponent();
          };

        } else {
          // RENDER DYNAMIC DISTRICT POLYGON VIEW (MATCHING PIC 2 SCREENSHOT FOR SELECTED DISTRICT)
          mapCard.innerHTML = `
            <div class="dk-card-header">
              <h3 class="dk-card-title">
                <i data-lucide="map-pin" style="width:15px;height:15px;color:#0d9488;"></i> Rural India PHC Coverage
                <span style="font-size:0.65rem; color:#0d9488; font-weight:bold;">(${selectedDistrict} Local Zoom)</span>
              </h3>
              <div style="display:flex; gap:6px; align-items:center;">
                <select id="dk-district-switch" style="font-size:0.625rem; border:1px solid #cbd5e1; border-radius:4px; padding:2px 4px; background:#fff;">
                  ${Object.keys(DISTRICT_DATA).map(d => `<option value="${d}" ${d === selectedDistrict ? 'selected' : ''}>${d}</option>`).join('')}
                </select>
                <span class="dk-link" id="dk-back-to-india" style="font-size:0.65rem; background:#f1f5f9; border:1px solid #cbd5e1; padding:2px 6px; border-radius:4px; color:#475569;">← Back to India Map</span>
              </div>
            </div>

            <div style="height:170px; background:#e6f4f1; border-radius:6px; position:relative; overflow:hidden; display:flex; align-items:center; justify-content:center; margin-bottom:8px;">
              <!-- LOCAL DISTRICT POLYGON MAP SHAPE (EXACT MATCH TO PIC 2) -->
              <svg viewBox="0 0 300 150" style="width:90%; height:90%; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.06));">
                <path d="M 50,30 Q 150,10 240,40 T 260,110 T 160,140 T 40,110 Z" fill="#a7f3d0" stroke="#059669" stroke-width="2" opacity="0.6"/>
                
                <!-- DYNAMIC PHC DOTS INSIDE DISTRICT -->
                <circle cx="90" cy="50" r="5" fill="${dData.color}" class="map-pin-pulse"><title>PHC Centre 1 (${selectedDistrict})</title></circle>
                <circle cx="140" cy="70" r="5" fill="#f59e0b" class="map-pin-pulse"><title>PHC Centre 2 (${selectedDistrict})</title></circle>
                <circle cx="180" cy="60" r="5" fill="#ef4444" class="map-pin-pulse"><title>PHC Centre 3 (${selectedDistrict})</title></circle>
                <circle cx="110" cy="95" r="5" fill="#10b981" class="map-pin-pulse"><title>PHC Centre 4 (${selectedDistrict})</title></circle>
                <circle cx="210" cy="90" r="5" fill="#10b981" class="map-pin-pulse"><title>PHC Centre 5 (${selectedDistrict})</title></circle>
                <circle cx="160" cy="110" r="5" fill="#94a3b8" class="map-pin-pulse"><title>PHC Offline</title></circle>
              </svg>

              <!-- LEGEND OVERLAY (PIC 2 MATCH) -->
              <div style="position:absolute; top:8px; right:8px; background:rgba(255,255,255,0.92); backdrop-filter:blur(2px); padding:6px 10px; border-radius:5px; font-size:0.6rem; border:1px solid #cbd5e1; display:flex; flex-direction:column; gap:3px; box-shadow:0 2px 4px rgba(0,0,0,0.05);">
                <span><span style="color:#10b981;">●</span> Active & Normal</span>
                <span><span style="color:#f59e0b;">●</span> Follow-up Required</span>
                <span><span style="color:#ef4444;">●</span> High-risk Cases</span>
                <span><span style="color:#94a3b8;">●</span> Offline / Sync Pending</span>
              </div>
            </div>

            <!-- DYNAMIC DISTRICT BOTTOM CARD (EXACT MATCH TO PIC 2 WITH LIVE DATA) -->
            <div style="background:#042f2c; color:white; padding:8px 10px; border-radius:5px; display:flex; align-items:center; justify-content:space-between;">
              <div>
                <div style="font-size:0.8rem; font-weight:700;">${selectedDistrict} District <span style="font-size:0.65rem; color:#a7f3d0; font-weight:normal;">(${dData.state})</span></div>
                <div style="font-size:0.65rem; color:#a7f3d0;">${dData.phcs} PHCs • ${dData.screenings} Screenings</div>
                <div style="font-size:0.575rem; color:rgba(255,255,255,0.7);">${dData.suspected} Suspected Cases • ${dData.pending} Referrals Pending</div>
              </div>
              <button class="dk-btn dk-btn-primary" id="dk-district-details-btn" style="font-size:0.65rem; padding:3px 8px;">View Details ➔</button>
            </div>
          `;

          const switchSelect = mapCard.querySelector('#dk-district-switch');
          if (switchSelect) switchSelect.onchange = (e) => {
            selectedDistrict = e.target.value;
            updateMapComponent();
          };

          const backBtn = mapCard.querySelector('#dk-back-to-india');
          if (backBtn) backBtn.onclick = () => {
            currentMapMode = 'india';
            updateMapComponent();
          };

          const detailsBtn = mapCard.querySelector('#dk-district-details-btn');
          if (detailsBtn) detailsBtn.onclick = () => {
            openModal(
              `${selectedDistrict} District Network Details`,
              `
                <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:12px; margin-bottom:12px; font-size:0.8rem;">
                  <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                    <span>State Jurisdiction:</span> <strong>${dData.state}</strong>
                  </div>
                  <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                    <span>Active PHC Facilities:</span> <strong>${dData.phcs} PHCs</strong>
                  </div>
                  <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                    <span>Total Retinal Scans:</span> <strong>${dData.screenings}</strong>
                  </div>
                  <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                    <span>High-Risk DR Cases:</span> <strong style="color:#ef4444;">${dData.suspected} Cases</strong>
                  </div>
                  <div style="display:flex; justify-content:space-between;">
                    <span>Pending Specialist Review:</span> <strong style="color:#f59e0b;">${dData.pending} Cases</strong>
                  </div>
                </div>
                <h4 style="font-size:0.85rem; margin:10px 0 6px 0;">Primary Health Centres in ${selectedDistrict}:</h4>
                <div style="font-size:0.775rem; color:#334155;">
                  ${(dData.phcList || ['PHC Main', 'PHC Rural', 'PHC North']).map(p => `• ${p} (Fundus Camera Online)`).join('<br>')}
                </div>
              `,
              'Manage PHCs',
              () => switchTab('phcs')
            );
          };
        }

        if (window.lucide) window.lucide.createIcons();
      }

      // Initial map render
      updateMapComponent();

      // ATTACH CLICK HANDLERS FOR DASHBOARD ELEMENTS
      root.querySelectorAll('.dk-kpi-card').forEach(card => {
        card.addEventListener('click', () => {
          const type = card.dataset.kpi;
          if (type === 'patients') switchTab('patients');
          else if (type === 'screenings') switchTab('screenings');
          else if (type === 'positive' || type === 'highrisk') switchTab('screenings');
          else if (type === 'phcs') switchTab('phcs');
          else if (type === 'doctors') switchTab('doctors');
          else if (type === 'accuracy') switchTab('ai-model');
          else switchTab('screenings');
        });
      });

      root.querySelector('#dk-alert-view-all').onclick = () => switchTab('notifications');
      root.querySelector('#dk-ai-view-analytics').onclick = () => switchTab('analytics');
      root.querySelector('#dk-phc-view-all').onclick = () => switchTab('phcs');
      root.querySelector('#dk-ref-view-queue').onclick = () => switchTab('screenings');
      root.querySelector('#dk-sys-view-monitoring').onclick = () => switchTab('monitoring');
      root.querySelector('#dk-act-view-all').onclick = () => switchTab('notifications');

      // Alert Click Handlers
      root.querySelectorAll('.dk-alert-box').forEach(box => {
        box.addEventListener('click', () => {
          const alertType = box.dataset.alert;
          if (alertType === 'highrisk') {
            openModal(
              '⚠️ Urgent Alert: 12 High-Risk Cases Awaiting Review',
              `
                <div style="background:#fee2e2; border-left:4px solid #ef4444; padding:10px; border-radius:4px; margin-bottom:10px;">
                  <strong style="color:#991b1b;">Action Required:</strong> 12 patients with severe non-proliferative or proliferative DR are pending tele-doctor validation.
                </div>
                <ul style="font-size:0.8rem; color:#334155; padding-left:18px;">
                  <li>PHC Rampur: 4 Urgent Cases</li>
                  <li>PHC Fatehganj: 5 Urgent Cases</li>
                  <li>PHC Nanpara: 3 Urgent Cases</li>
                </ul>
              `,
              'Go to Screening Queue',
              () => switchTab('screenings')
            );
          } else if (alertType === 'sync') {
            openModal(
              '⚡ Network Alert: 8 PHCs Sync Pending',
              `
                <p style="font-size:0.8rem; color:#334155;">8 rural primary health centers have not synced data in the last 12 hours due to cellular network outages.</p>
                <div style="font-size:0.75rem; background:#f8fafc; padding:8px; border-radius:4px;">
                  Offline Sync Queue: <strong>142 Local Encrypted Records</strong>
                </div>
              `,
              'Inspect PHC Status',
              () => switchTab('phcs')
            );
          } else {
            openModal(
              '📷 Quality Control Alert: 24 Rejected Images',
              `
                <p style="font-size:0.8rem; color:#334155;">24 retinal scans failed automated illumination, blur, or lens occlusion quality thresholds.</p>
              `,
              'View AI Performance',
              () => switchTab('ai-perf')
            );
          }
        });
      });

      // PHC Row Click Handlers (TRIGGERS DISTRICT MAP ZOOM ON CLICK!)
      root.querySelectorAll('.dk-table tr[data-phc]').forEach(row => {
        row.addEventListener('click', () => {
          const phcName = row.dataset.phc;
          selectedDistrict = row.dataset.district || 'Bareilly';
          currentMapMode = 'district';
          updateMapComponent();

          openModal(
            `PHC Inspector — ${phcName}`,
            `
              <div style="display:flex; justify-content:space-between; margin-bottom:10px; font-size:0.8rem;">
                <div><strong>District:</strong> ${selectedDistrict} / UP</div>
                <div><strong>Status:</strong> Active</div>
              </div>
              <div style="background:#f1f5f9; padding:10px; border-radius:5px; font-size:0.75rem; color:#334155;">
                <div>Total Lifetime Screenings: <strong>1,420</strong></div>
                <div>Fundus Cameras Deployed: <strong>2 (Topcon TRC-NW400)</strong></div>
                <div>Assigned Ophthalmologist: <strong>Dr. R. Sharma (Bareilly Medical College)</strong></div>
              </div>
            `,
            'Open PHC Management',
            () => switchTab('phcs')
          );
        });
      });
    }

    // HELPER: KPI CARD BUILDER
    function kpiCard(type, icon, label, val, trend, trendClass, bg, color) {
      return `
        <div class="dk-kpi-card" data-kpi="${type}">
          <div class="dk-kpi-icon-wrap" style="background:${bg}; color:${color};">
            <i data-lucide="${icon}" style="width:14px;height:14px;"></i>
          </div>
          <div class="dk-kpi-label">${label}</div>
          <div class="dk-kpi-val">${val}</div>
          <div class="dk-kpi-trend ${trendClass}">${trend}</div>
        </div>
      `;
    }

    // SUB-VIEW RENDERERS FOR ALL OTHER TABS
    function renderAnalyticsView(root) {
      root.innerHTML = `
        <div class="dk-card">
          <div class="dk-card-header">
            <h3 class="dk-card-title"><i data-lucide="bar-chart-3"></i> Analytics & Detailed Performance Reports</h3>
            <div>
              <button class="dk-btn dk-btn-secondary">Export CSV</button>
              <button class="dk-btn dk-btn-primary">Generate PDF Report</button>
            </div>
          </div>
          <p style="font-size:0.8rem; color:#64748b;">Comprehensive clinical analytics across all 126 active PHCs and 248 tele-ophthalmologists.</p>
          <div style="height:300px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; display:flex; align-items:center; justify-content:center;">
            <div style="text-align:center; color:#64748b;">
              <i data-lucide="bar-chart-2" style="width:40px;height:40px; opacity:0.4; margin-bottom:8px;"></i>
              <div style="font-weight:700;">District-wise Positivity & Diagnostic Distribution</div>
              <div style="font-size:0.75rem;">Bareilly: 12.4% | Lucknow: 10.2% | Prayagraj: 14.1% | Varanasi: 11.8%</div>
            </div>
          </div>
        </div>
      `;
    }

    function renderPatientsView(root) {
      root.innerHTML = `
        <div class="dk-card">
          <div class="dk-card-header">
            <h3 class="dk-card-title"><i data-lucide="users"></i> Patient Directory & Electronic Health Records</h3>
            <input type="text" placeholder="Search Patient ID / Aadhaar / Name..." style="padding:4px 10px; border:1px solid #cbd5e1; border-radius:4px; font-size:0.75rem; width:240px;">
          </div>
          <table class="dk-table">
            <thead>
              <tr><th>Patient ID</th><th>Name / Age / Gender</th><th>PHC Centre</th><th>Screenings</th><th>DR Severity</th><th>Doctor Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              <tr><td>PT-2026-88A9</td><td>Ramesh Kumar (45/M)</td><td>PHC Bithri</td><td>2</td><td><span class="dk-badge badge-pending">Moderate NPDR</span></td><td>Pending Validation</td><td><button class="dk-btn dk-btn-secondary" style="font-size:0.65rem; padding:2px 6px;">View File</button></td></tr>
              <tr><td>PT-2026-11B4</td><td>Sunita Devi (62/F)</td><td>PHC Fatehganj</td><td>1</td><td><span class="dk-badge badge-attention">Severe NPDR</span></td><td>Referral Issued</td><td><button class="dk-btn dk-btn-secondary" style="font-size:0.65rem; padding:2px 6px;">View File</button></td></tr>
              <tr><td>PT-2026-99C2</td><td>Mohd. Arif (38/M)</td><td>PHC Tilhar</td><td>3</td><td><span class="dk-badge badge-active">No DR</span></td><td>Normal</td><td><button class="dk-btn dk-btn-secondary" style="font-size:0.65rem; padding:2px 6px;">View File</button></td></tr>
            </tbody>
          </table>
        </div>
      `;
    }

    function renderScreeningsView(root) {
      root.innerHTML = `
        <div class="dk-card">
          <div class="dk-card-header">
            <h3 class="dk-card-title"><i data-lucide="scan-eye"></i> Screening & Tele-Ophthalmology Queue</h3>
            <div style="display:flex; gap:6px;">
              <select style="padding:3px 6px; border:1px solid #cbd5e1; border-radius:4px; font-size:0.75rem;"><option>All DR Stages</option></select>
              <select style="padding:3px 6px; border:1px solid #cbd5e1; border-radius:4px; font-size:0.75rem;"><option>All PHCs</option></select>
            </div>
          </div>
          <table class="dk-table">
            <thead>
              <tr><th>Screening ID</th><th>Patient</th><th>Date</th><th>AI Prediction</th><th>Confidence</th><th>Grad-CAM Heatmap</th><th>Review Status</th></tr>
            </thead>
            <tbody>
              <tr><td>SC-00123</td><td>PT-2026-88A9</td><td>Today</td><td>Moderate NPDR</td><td>93.6%</td><td><span style="color:#0d9488; font-weight:600;">[View Heatmap]</span></td><td><span class="dk-badge badge-pending">Pending Doctor Review</span></td></tr>
              <tr><td>SC-00124</td><td>PT-2026-11B4</td><td>Today</td><td>Severe NPDR</td><td>98.2%</td><td><span style="color:#0d9488; font-weight:600;">[View Heatmap]</span></td><td><span class="dk-badge badge-attention">Urgent Referral</span></td></tr>
            </tbody>
          </table>
        </div>
      `;
    }

    function renderPHCsView(root) {
      root.innerHTML = `
        <div class="dk-card">
          <div class="dk-card-header">
            <h3 class="dk-card-title"><i data-lucide="building"></i> Primary Health Centres (PHC Network)</h3>
            <button class="dk-btn dk-btn-primary">+ Register New PHC</button>
          </div>
          <table class="dk-table">
            <thead>
              <tr><th>PHC Name</th><th>District</th><th>Operator Staff</th><th>Cameras</th><th>Sync Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              <tr><td>PHC Bithri</td><td>Bareilly</td><td>Aman V. (ANM)</td><td>Topcon TRC-NW400</td><td><span class="dk-badge badge-active">Online</span></td><td><button class="dk-btn dk-btn-secondary" style="font-size:0.65rem;">Manage</button></td></tr>
              <tr><td>PHC Aonla</td><td>Bareilly</td><td>Suresh K. (Technician)</td><td>Remidio FOP</td><td><span class="dk-badge badge-pending">Sync Pending</span></td><td><button class="dk-btn dk-btn-secondary" style="font-size:0.65rem;">Manage</button></td></tr>
            </tbody>
          </table>
        </div>
      `;
    }

    function renderDoctorsView(root) {
      let activeDocSubTab = 'workspace'; // 'workspace', 'roster', 'metrics'
      let selectedDocCaseId = 'PT-2026-88A9';
      let isHeatmapActive = false;

      const docCases = [
        {
          id: 'PT-2026-88A9',
          name: 'Ramesh Kumar',
          age: 45,
          gender: 'Male',
          phc: 'PHC Bithri (Bareilly)',
          aiStage: 2,
          aiTitle: 'Moderate NPDR',
          aiConf: '93.6%',
          status: 'Pending',
          evidence: 'Microaneurysms detected in nasal quadrant; focal hard exudates near macula.',
          img: 'src/teal_glowing_eye.jpg'
        },
        {
          id: 'PT-2026-11B4',
          name: 'Sunita Devi',
          age: 62,
          gender: 'Female',
          phc: 'PHC Fatehganj (Shahjahanpur)',
          aiStage: 3,
          aiTitle: 'Severe NPDR',
          aiConf: '98.2%',
          status: 'Urgent Referral',
          evidence: 'Multiple blot hemorrhages in >2 quadrants; cotton wool spots in temporal region.',
          img: 'src/glowing_eye.png'
        },
        {
          id: 'PT-2026-99C2',
          name: 'Mohd. Arif',
          age: 38,
          gender: 'Male',
          phc: 'PHC Tilhar (Shahjahanpur)',
          aiStage: 0,
          aiTitle: 'No DR',
          aiConf: '99.1%',
          status: 'Reviewed',
          evidence: 'Normal vascular arcade. Intact foveal reflex. No lesions detected.',
          img: 'src/teal_glowing_eye.jpg'
        },
        {
          id: 'PT-2026-44D1',
          name: 'Savitri Sharma',
          age: 54,
          gender: 'Female',
          phc: 'PHC Misrikh (Sitapur)',
          aiStage: 4,
          aiTitle: 'Proliferative DR',
          aiConf: '97.4%',
          status: 'Urgent Referral',
          evidence: 'Neovascularization at optic disc (NVD); preretinal hemorrhage suspected.',
          img: 'src/glowing_eye.png'
        }
      ];

      function updateDocPortal() {
        const curCase = docCases.find(c => c.id === selectedDocCaseId) || docCases[0];

        root.innerHTML = `
          <!-- DOCTOR PANEL HEADER & KPI ROW -->
          <div class="dk-card" style="margin-bottom:12px;">
            <div class="dk-card-header">
              <h3 class="dk-card-title">
                <i data-lucide="stethoscope" style="width:18px;height:18px;color:#0d9488;"></i> Tele-Ophthalmology & Specialist Review Portal
              </h3>
              <div style="display:flex; gap:8px;">
                <button class="dk-btn dk-btn-secondary" id="dk-doc-export-btn"><i data-lucide="download" style="width:13px;height:13px;"></i> Audit Log</button>
                <button class="dk-btn dk-btn-primary" id="dk-onboard-doc-btn">+ Onboard Specialist Doctor</button>
              </div>
            </div>

            <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:10px; margin-top:10px;">
              <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:10px;">
                <div style="font-size:0.65rem; color:#64748b; font-weight:600;">Onboarded Specialists</div>
                <div style="font-size:1.25rem; font-weight:800; color:#0f172a; margin:2px 0;">248 <span style="font-size:0.75rem; color:#16a34a; font-weight:600;">(184 Active)</span></div>
                <div style="font-size:0.6rem; color:#94a3b8;">Across 12 Medical Colleges</div>
              </div>
              
              <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:10px;">
                <div style="font-size:0.65rem; color:#64748b; font-weight:600;">Average Review SLA</div>
                <div style="font-size:1.25rem; font-weight:800; color:#0f172a; margin:2px 0;">12.4 mins</div>
                <div style="font-size:0.6rem; color:#16a34a; font-weight:600;">⚡ Target &lt; 30 mins achieved</div>
              </div>

              <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:10px;">
                <div style="font-size:0.65rem; color:#64748b; font-weight:600;">AI Agreement Rate</div>
                <div style="font-size:1.25rem; font-weight:800; color:#0f172a; margin:2px 0;">96.8%</div>
                <div style="font-size:0.6rem; color:#0d9488; font-weight:600;">High clinical concordance</div>
              </div>

              <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:10px;">
                <div style="font-size:0.65rem; color:#64748b; font-weight:600;">Pending Verification</div>
                <div style="font-size:1.25rem; font-weight:800; color:#ea580c; margin:2px 0;">12 Cases</div>
                <div style="font-size:0.6rem; color:#ef4444; font-weight:600;">5 Urgent Referrals</div>
              </div>
            </div>
          </div>

          <!-- SUB TABS NAV -->
          <div style="display:flex; border-bottom:1px solid #e2e8f0; margin-bottom:12px; gap:16px;">
            <div class="dk-subtab ${activeDocSubTab === 'workspace' ? 'active' : ''}" data-tab="workspace" style="padding:8px 4px; font-size:0.8rem; font-weight:600; cursor:pointer; color:${activeDocSubTab === 'workspace' ? '#0d9488' : '#64748b'}; border-bottom:${activeDocSubTab === 'workspace' ? '2px solid #0d9488' : 'none'};">
              📋 Live Tele-Review Workspace (12 Pending)
            </div>
            <div class="dk-subtab ${activeDocSubTab === 'roster' ? 'active' : ''}" data-tab="roster" style="padding:8px 4px; font-size:0.8rem; font-weight:600; cursor:pointer; color:${activeDocSubTab === 'roster' ? '#0d9488' : '#64748b'}; border-bottom:${activeDocSubTab === 'roster' ? '2px solid #0d9488' : 'none'};">
              👨‍⚕️ Specialist Roster & Performance
            </div>
          </div>

          <!-- DYNAMIC TAB CONTENT -->
          <div id="dk-doc-tab-content">
            ${activeDocSubTab === 'workspace' ? renderWorkspaceTab(curCase) : renderRosterTab()}
          </div>
        `;

        // Attach Subtab Listeners
        root.querySelectorAll('.dk-subtab').forEach(t => {
          t.onclick = () => {
            activeDocSubTab = t.dataset.tab;
            updateDocPortal();
          };
        });

        // Attach Case Selection Listeners
        root.querySelectorAll('.doc-case-card').forEach(c => {
          c.onclick = () => {
            selectedDocCaseId = c.dataset.id;
            updateDocPortal();
          };
        });

        // Attach Grad-CAM Toggle Listener
        const toggleGradCam = root.querySelector('#dk-toggle-gradcam-btn');
        if (toggleGradCam) {
          toggleGradCam.onclick = () => {
            isHeatmapActive = !isHeatmapActive;
            const heatmapOverlay = root.querySelector('#dk-heatmap-overlay');
            if (heatmapOverlay) {
              heatmapOverlay.style.opacity = isHeatmapActive ? '0.75' : '0';
            }
            toggleGradCam.textContent = isHeatmapActive ? '🔥 Hide Grad-CAM Heatmap' : '👁️ View Grad-CAM Heatmap';
          };
        }

        // Attach Form Submit Listener
        const docForm = root.querySelector('#dk-tele-review-form');
        if (docForm) {
          docForm.onsubmit = (e) => {
            e.preventDefault();
            openModal(
              '✅ Diagnostic Clinical Sign-off Issued',
              `
                <div style="text-align:center; padding:10px;">
                  <i data-lucide="check-circle-2" style="width:48px;height:48px; color:#10b981; margin-bottom:8px;"></i>
                  <h3 style="margin:0; font-size:1.1rem; color:#0f172a;">Tele-Report Successfully Signed!</h3>
                  <p style="font-size:0.8rem; color:#64748b; margin-top:4px;">
                    Signed by <strong>Dr. Admin / Specialist</strong> for Patient <strong>${curCase.name} (${curCase.id})</strong>.
                  </p>
                  <div style="background:#f1f5f9; padding:8px; border-radius:4px; font-size:0.75rem; text-align:left;">
                    • Final Severity Grade: <strong>${root.querySelector('#dk-final-grade').value}</strong><br>
                    • Referral Status: <strong>${root.querySelector('#dk-referral-check').checked ? 'Issued to Tertiary Eye Hospital' : 'No Referral Required'}</strong>
                  </div>
                </div>
              `,
              'Close Workspace',
              () => {
                curCase.status = 'Reviewed';
                updateDocPortal();
              }
            );
          };
        }

        // Attach Onboard Doctor Button Listener
        const onboardBtn = root.querySelector('#dk-onboard-doc-btn');
        if (onboardBtn) {
          onboardBtn.onclick = () => {
            openModal(
              '👨‍⚕️ Onboard Specialist Retina Ophthalmologist',
              `
                <div style="display:flex; flex-direction:column; gap:10px; font-size:0.8rem;">
                  <div>
                    <label style="font-weight:600; display:block; margin-bottom:4px;">Doctor Full Name</label>
                    <input type="text" placeholder="Dr. Ananya Gupta, MD" style="width:100%; padding:6px; border:1px solid #cbd5e1; border-radius:4px;">
                  </div>
                  <div>
                    <label style="font-weight:600; display:block; margin-bottom:4px;">Medical College / Tertiary Eye Institute</label>
                    <input type="text" placeholder="AIIMS New Delhi / Bareilly Medical College" style="width:100%; padding:6px; border:1px solid #cbd5e1; border-radius:4px;">
                  </div>
                  <div>
                    <label style="font-weight:600; display:block; margin-bottom:4px;">MCI / State Medical Council Registration No.</label>
                    <input type="text" placeholder="MCI-UP-88419" style="width:100%; padding:6px; border:1px solid #cbd5e1; border-radius:4px;">
                  </div>
                  <div>
                    <label style="font-weight:600; display:block; margin-bottom:4px;">Specialization</label>
                    <select style="width:100%; padding:6px; border:1px solid #cbd5e1; border-radius:4px;">
                      <option>Vitreoretinal Specialist</option>
                      <option>General Ophthalmologist</option>
                      <option>Cornea & Anterior Segment Specialist</option>
                    </select>
                  </div>
                </div>
              `,
              'Register & Send Credential Activation',
              () => updateDocPortal()
            );
          };
        }

        if (window.lucide) window.lucide.createIcons();
      }

      // RENDER WORKSPACE TAB
      function renderWorkspaceTab(curCase) {
        return `
          <div style="display:grid; grid-template-columns:300px 1fr; gap:12px;">
            <!-- LEFT: CASE QUEUE -->
            <div style="display:flex; flex-direction:column; gap:8px;">
              <div style="font-size:0.75rem; font-weight:700; color:#475569; display:flex; justify-content:space-between; align-items:center;">
                <span>Patient Tele-Queue</span>
                <span class="dk-badge badge-pending">12 Pending</span>
              </div>

              ${docCases.map(c => `
                <div class="doc-case-card" data-id="${c.id}" style="background:${c.id === curCase.id ? '#f0fdfa' : '#ffffff'}; border:1px solid ${c.id === curCase.id ? '#0d9488' : '#e2e8f0'}; border-radius:6px; padding:10px; cursor:pointer; transition:0.15s;">
                  <div style="display:flex; justify-content:space-between; margin-bottom:2px;">
                    <strong style="font-size:0.8rem; color:#0f172a;">${c.name}</strong>
                    <span class="dk-badge ${c.status === 'Reviewed' ? 'badge-active' : c.status === 'Urgent Referral' ? 'badge-attention' : 'badge-pending'}">${c.status}</span>
                  </div>
                  <div style="font-size:0.675rem; color:#64748b;">${c.id} • ${c.age}y / ${c.gender}</div>
                  <div style="font-size:0.65rem; color:#0d9488; font-weight:600; margin-top:4px;">AI: ${c.aiTitle} (${c.aiConf})</div>
                </div>
              `).join('')}
            </div>

            <!-- RIGHT: CLINICAL INSPECTION & SIGN-OFF WORKSPACE -->
            <div style="display:flex; flex-direction:column; gap:12px;">
              <!-- PATIENT & IMAGE INSPECTION CARD -->
              <div class="dk-card">
                <div class="dk-card-header">
                  <div>
                    <h4 style="margin:0; font-size:0.95rem; color:#0f172a;">${curCase.name} <span style="font-size:0.75rem; color:#64748b; font-weight:normal;">(${curCase.id} • ${curCase.age}y ${curCase.gender})</span></h4>
                    <div style="font-size:0.675rem; color:#64748b;">Origin PHC: <strong>${curCase.phc}</strong></div>
                  </div>
                  <button class="dk-btn dk-btn-secondary" id="dk-toggle-gradcam-btn" style="font-size:0.7rem;">
                    👁️ View Grad-CAM Heatmap
                  </button>
                </div>

                <div style="display:grid; grid-template-columns:220px 1fr; gap:14px; align-items:center; background:#020617; padding:12px; border-radius:6px; color:white;">
                  <div style="position:relative; width:200px; height:200px; margin:0 auto; overflow:hidden; border-radius:6px; background:#000;">
                    <img src="${curCase.img}" style="width:100%; height:100%; object-fit:cover;">
                    <div id="dk-heatmap-overlay" style="position:absolute; top:0; left:0; width:100%; height:100%; background:radial-gradient(circle at 55% 45%, rgba(239,68,68,0.85) 0%, rgba(245,158,11,0.6) 30%, rgba(16,185,129,0.3) 60%, transparent 80%); opacity:0; transition:opacity 0.2s; pointer-events:none;"></div>
                  </div>

                  <div style="font-size:0.775rem;">
                    <div style="font-size:0.675rem; color:#94a3b8; text-transform:uppercase; font-weight:700;">AI Deep Learning Inference</div>
                    <div style="font-size:1.1rem; font-weight:800; color:#38bdf8; margin:2px 0;">${curCase.aiTitle} <span style="font-size:0.75rem; color:#10b981;">(${curCase.aiConf} Conf.)</span></div>
                    <div style="background:rgba(255,255,255,0.08); padding:8px; border-radius:4px; margin-top:8px; font-size:0.725rem; color:#cbd5e1;">
                      <strong style="color:#f43f5e;">Identified Lesions & Evidence:</strong><br>
                      ${curCase.evidence}
                    </div>
                  </div>
                </div>
              </div>

              <!-- DOCTOR CLINICAL DECISION FORM -->
              <div class="dk-card" style="border:2px solid #0d9488;">
                <div class="dk-card-header">
                  <h4 style="margin:0; font-size:0.875rem; color:#0f766e; display:flex; align-items:center; gap:6px;">
                    <i data-lucide="file-signature" style="width:16px;height:16px;"></i> Tele-Ophthalmology Diagnostic Sign-off Form
                  </h4>
                  <span class="dk-badge badge-active">Doctor Validated</span>
                </div>

                <form id="dk-tele-review-form" style="display:flex; flex-direction:column; gap:10px; font-size:0.775rem;">
                  <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                    <div>
                      <label style="font-weight:700; display:block; margin-bottom:4px; color:#334155;">Final Confirmed DR Grade</label>
                      <select id="dk-final-grade" style="width:100%; padding:6px; border:1px solid #cbd5e1; border-radius:4px; font-weight:700; color:#0f172a;">
                        <option value="Stage 0: No DR" ${curCase.aiStage === 0 ? 'selected' : ''}>Stage 0: No Retinopathy (Normal)</option>
                        <option value="Stage 1: Mild NPDR" ${curCase.aiStage === 1 ? 'selected' : ''}>Stage 1: Mild Non-Proliferative DR</option>
                        <option value="Stage 2: Moderate NPDR" ${curCase.aiStage === 2 ? 'selected' : ''}>Stage 2: Moderate Non-Proliferative DR</option>
                        <option value="Stage 3: Severe NPDR" ${curCase.aiStage === 3 ? 'selected' : ''}>Stage 3: Severe Non-Proliferative DR</option>
                        <option value="Stage 4: Proliferative DR" ${curCase.aiStage === 4 ? 'selected' : ''}>Stage 4: Proliferative DR (High-Risk)</option>
                      </select>
                    </div>

                    <div>
                      <label style="font-weight:700; display:block; margin-bottom:4px; color:#334155;">Referral Action</label>
                      <div style="display:flex; align-items:center; gap:6px; margin-top:6px;">
                        <input type="checkbox" id="dk-referral-check" ${curCase.aiStage >= 2 ? 'checked' : ''}>
                        <label for="dk-referral-check" style="font-weight:600; color:#b91c1c;">Issue Referral to Tertiary Eye Hospital</label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label style="font-weight:700; display:block; margin-bottom:4px; color:#334155;">Clinical Notes & Advice for PHC Healthcare Worker</label>
                    <textarea id="dk-clinical-notes" rows="2" style="width:100%; padding:6px; border:1px solid #cbd5e1; border-radius:4px; font-family:inherit;" placeholder="Enter clinical instructions, blood sugar control advice, or follow-up duration...">${curCase.aiStage >= 2 ? 'Patient requires urgent anti-VEGF / laser consultation at Bareilly Medical College within 7 days. Maintain strict HbA1c control.' : 'Re-screen in 12 months. Routine glycemic monitoring advised.'}</textarea>
                  </div>

                  <div style="display:flex; justify-content:flex-end;">
                    <button type="submit" class="dk-btn dk-btn-primary" style="padding:6px 14px; font-size:0.8rem;">
                      Sign & Issue Tele-Ophthalmology Clinical Report ➔
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        `;
      }

      // RENDER ROSTER TAB
      function renderRosterTab() {
        return `
          <div class="dk-card">
            <div class="dk-card-header">
              <h3 class="dk-card-title"><i data-lucide="users"></i> Onboarded Tele-Ophthalmologist Roster</h3>
              <input type="text" placeholder="Search Doctor / Hospital..." style="padding:4px 8px; border:1px solid #cbd5e1; border-radius:4px; font-size:0.75rem; width:220px;">
            </div>
            <table class="dk-table">
              <thead>
                <tr>
                  <th>Doctor Name</th>
                  <th>Hospital / Medical College</th>
                  <th>Specialization</th>
                  <th>Reviews Completed</th>
                  <th>Avg Review SLA</th>
                  <th>Diagnostic Agreement</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Dr. Sanjeev Kohli</strong></td>
                  <td>Amritsar Eye Centre (Bareilly)</td>
                  <td>Vitreoretinal Specialist</td>
                  <td>1,420</td>
                  <td>14 mins</td>
                  <td>98.4%</td>
                  <td><span class="dk-badge badge-active">● Active</span></td>
                  <td><button class="dk-btn dk-btn-secondary" style="font-size:0.65rem;">View Profile</button></td>
                </tr>
                <tr>
                  <td><strong>Dr. Sudhir Srivastava</strong></td>
                  <td>Sun Eye Hospital and Laser Centre (Lucknow)</td>
                  <td>Ophthalmologist & Laser Specialist</td>
                  <td>980</td>
                  <td>18 mins</td>
                  <td>96.2%</td>
                  <td><span class="dk-badge badge-active">● Active</span></td>
                  <td><button class="dk-btn dk-btn-secondary" style="font-size:0.65rem;">View Profile</button></td>
                </tr>
                <tr>
                  <td><strong>Dr. Manmohan Lal Gupta</strong></td>
                  <td>Jagmohan Lal Eye & ENT Hospital (Shahjahanpur)</td>
                  <td>Ophthalmologist</td>
                  <td>1,150</td>
                  <td>11 mins</td>
                  <td>99.1%</td>
                  <td><span class="dk-badge badge-active">● Active</span></td>
                  <td><button class="dk-btn dk-btn-secondary" style="font-size:0.65rem;">View Profile</button></td>
                </tr>
                <tr>
                  <td><strong>Col. (Dr.) Madhu Bhadauria</strong></td>
                  <td>Sitapur Eye Hospital (Sitapur)</td>
                  <td>Ophthalmologist & Director</td>
                  <td>1,210</td>
                  <td>12 mins</td>
                  <td>97.9%</td>
                  <td><span class="dk-badge badge-active">● Active</span></td>
                  <td><button class="dk-btn dk-btn-secondary" style="font-size:0.65rem;">View Profile</button></td>
                </tr>
                <tr>
                  <td><strong>Dr. Praveen Kumar Chaturvedi</strong></td>
                  <td>Shree Hanumant Vision Care (Varanasi)</td>
                  <td>Retina Specialist</td>
                  <td>1,080</td>
                  <td>13 mins</td>
                  <td>98.7%</td>
                  <td><span class="dk-badge badge-active">● Active</span></td>
                  <td><button class="dk-btn dk-btn-secondary" style="font-size:0.65rem;">View Profile</button></td>
                </tr>
                <tr>
                  <td><strong>Dr. Rahul Agrawal</strong></td>
                  <td>Gorakhpur Eye Hospital (Gorakhpur)</td>
                  <td>Ophthalmologist</td>
                  <td>890</td>
                  <td>15 mins</td>
                  <td>96.5%</td>
                  <td><span class="dk-badge badge-active">● Active</span></td>
                  <td><button class="dk-btn dk-btn-secondary" style="font-size:0.65rem;">View Profile</button></td>
                </tr>
                <tr>
                  <td><strong>Dr. Rajneesh Sinha</strong></td>
                  <td>Sharp Sight Eye Hospital (Patna)</td>
                  <td>Vitreoretinal Surgeon</td>
                  <td>940</td>
                  <td>16 mins</td>
                  <td>97.3%</td>
                  <td><span class="dk-badge badge-active">● Active</span></td>
                  <td><button class="dk-btn dk-btn-secondary" style="font-size:0.65rem;">View Profile</button></td>
                </tr>
                <tr>
                  <td><strong>Dr. M. K. Ajwani</strong></td>
                  <td>Ajwani Eye Care (Bhopal)</td>
                  <td>Senior Eye Surgeon</td>
                  <td>780</td>
                  <td>17 mins</td>
                  <td>96.8%</td>
                  <td><span class="dk-badge badge-active">● Active</span></td>
                  <td><button class="dk-btn dk-btn-secondary" style="font-size:0.65rem;">View Profile</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        `;
      }

      // Initial render
      updateDocPortal();
    }

    function renderAIModelView(root) {
      root.innerHTML = `
        <div class="dk-card">
          <div class="dk-card-header">
            <h3 class="dk-card-title"><i data-lucide="brain-circuit"></i> AI Model Management & Versioning</h3>
            <span class="dk-badge badge-active">Model Online: DRISH-XAI v2.1</span>
          </div>
          <p style="font-size:0.8rem; color:#475569;">Core deep learning ensemble: EfficientNet-B4 + Grad-CAM Explainable Heatmap Generator.</p>
        </div>
      `;
    }

    function renderAIPerformanceView(root) {
      root.innerHTML = `
        <div class="dk-card">
          <div class="dk-card-header">
            <h3 class="dk-card-title"><i data-lucide="activity"></i> AI Diagnostic Accuracy Metrics</h3>
          </div>
          <p style="font-size:0.8rem; color:#475569;">Validation set AUC: 0.982 | Sensitivity: 92.5% | Specificity: 96.1%.</p>
        </div>
      `;
    }

    function renderXAIView(root) {
      root.innerHTML = `
        <div class="dk-card">
          <div class="dk-card-header">
            <h3 class="dk-card-title"><i data-lucide="eye"></i> Explainable AI (XAI) & Grad-CAM Heatmap Inspector</h3>
          </div>
          <p style="font-size:0.8rem; color:#475569;">Visual verification of microaneurysms, hemorrhages, and hard exudates localization.</p>
        </div>
      `;
    }

    function renderUsersView(root) {
      root.innerHTML = `
        <div class="dk-card">
          <div class="dk-card-header">
            <h3 class="dk-card-title"><i data-lucide="user-check"></i> User & Access Management</h3>
            <button class="dk-btn dk-btn-primary">+ Add User</button>
          </div>
        </div>
      `;
    }

    function renderNotificationsView(root) {
      root.innerHTML = `
        <div class="dk-card">
          <div class="dk-card-header">
            <h3 class="dk-card-title"><i data-lucide="bell"></i> System Notifications & Alerts</h3>
          </div>
        </div>
      `;
    }

    function renderMonitoringView(root) {
      root.innerHTML = `
        <div class="dk-card">
          <div class="dk-card-header">
            <h3 class="dk-card-title"><i data-lucide="cpu"></i> Infrastructure & Server Health Monitoring</h3>
          </div>
        </div>
      `;
    }

    function renderSecurityView(root) {
      root.innerHTML = `
        <div class="dk-card">
          <div class="dk-card-header">
            <h3 class="dk-card-title"><i data-lucide="shield-check"></i> Security & Audit Logs</h3>
          </div>
        </div>
      `;
    }

    function renderBackupView(root) {
      root.innerHTML = `
        <div class="dk-card">
          <div class="dk-card-header">
            <h3 class="dk-card-title"><i data-lucide="database"></i> Automated Cloud Backup & Recovery</h3>
          </div>
        </div>
      `;
    }

    function renderWebsiteView(root) {
      root.innerHTML = `
        <div class="dk-card">
          <div class="dk-card-header">
            <h3 class="dk-card-title"><i data-lucide="globe"></i> Public Portal & Content Management</h3>
          </div>
        </div>
      `;
    }

    function renderContentView(root) {
      root.innerHTML = `
        <div class="dk-card">
          <div class="dk-card-header">
            <h3 class="dk-card-title"><i data-lucide="file-text"></i> Articles & Public Awareness Blog</h3>
          </div>
        </div>
      `;
    }

    // Default Render
    switchTab('dashboard');
  });
}
