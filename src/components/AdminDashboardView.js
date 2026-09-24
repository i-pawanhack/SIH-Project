/**
 * Drish Kalyan — Admin Dashboard View
 */

export function renderAdminDashboardView(container, onNavigate) {
  import('../services/storageService.js').then(({ StorageService }) => {
    if (!StorageService.isAdminLoggedIn()) {
      onNavigate('login');
      return;
    }

    container.innerHTML = `
      <style>
        /* Force Fullscreen Admin View by overriding parent container styles */
        body { margin: 0; padding: 0; overflow: hidden; }
        .main-content-wrapper { 
          max-width: none !important; 
          margin: 0 !important; 
          padding: 0 !important; 
          height: 100vh;
        }
        #navbar-root { display: none !important; }
        #safety-banner-root { display: none !important; }
        #view-admin-dashboard { padding: 0 !important; height: 100%; width: 100%; }
        
        /* New Aesthetics based on image */
        :root {
          --sidebar-bg: #094943;
          --sidebar-active: #13776a;
          --bg-dashboard: #f4f7fb;
          --card-border: #e8eef3;
          --text-main: #1e293b;
          --text-muted: #64748b;
          --green-trend: #10b981;
          --red-trend: #ef4444;
          --blue-accent: #3b82f6;
          --orange-accent: #f59e0b;
        }

        .admin-layout { 
          display: flex; 
          height: 100vh; 
          background: var(--bg-dashboard); 
          font-family: 'Inter', sans-serif; 
          color: var(--text-main);
        }
        
        /* Sidebar Styling */
        .admin-sidebar { 
          width: 260px; 
          background: var(--sidebar-bg); 
          color: white; 
          display: flex; 
          flex-direction: column; 
          flex-shrink: 0; 
        }
        .admin-sidebar-header { 
          padding: 24px 20px 10px; 
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .admin-sidebar-header .logo-eye {
          width: 40px; height: 40px;
          background: rgba(255,255,255,0.1);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
        }
        .admin-sidebar-header-text h2 {
          margin: 0; font-size: 1.15rem; font-weight: 700; font-family: 'Outfit', sans-serif;
          letter-spacing: 0.5px;
        }
        .admin-sidebar-header-text p {
          margin: 0; font-size: 0.55rem; color: rgba(255,255,255,0.7);
          text-transform: uppercase; letter-spacing: 0.5px;
        }

        .admin-nav { 
          flex: 1; 
          overflow-y: auto; 
          padding: 10px 0 20px; 
        }
        .admin-nav::-webkit-scrollbar { width: 4px; }
        .admin-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); }
        
        .nav-category {
          font-size: 0.65rem;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          margin: 18px 20px 8px;
          font-weight: 600;
          letter-spacing: 0.05em;
        }

        .admin-nav-item { 
          padding: 10px 20px; 
          margin: 2px 12px;
          display: flex; 
          align-items: center; 
          gap: 12px; 
          color: rgba(255,255,255,0.8); 
          cursor: pointer; 
          border-radius: 8px;
          font-size: 0.8rem; 
          transition: 0.2s; 
          font-weight: 500;
        }
        .admin-nav-item:hover { 
          background: rgba(255,255,255,0.05); 
          color: white; 
        }
        .admin-nav-item.active { 
          background: var(--sidebar-active); 
          color: white; 
        }
        .nav-badge {
          background: #ef4444; color: white; border-radius: 50%; width: 18px; height: 18px;
          display: flex; align-items: center; justify-content: center; font-size: 0.65rem; font-weight: bold;
          margin-left: auto;
        }
        
        .sidebar-footer {
          padding: 20px;
          text-align: center;
          font-size: 0.7rem;
          color: rgba(255,255,255,0.6);
          border-top: 1px solid rgba(255,255,255,0.1);
          position: relative;
          overflow: hidden;
        }
        .sidebar-village-graphic {
          width: 100%;
          height: 40px;
          opacity: 0.4;
          margin-bottom: 12px;
        }

        /* Main Content Styling */
        .admin-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
        
        .admin-header { 
          height: 70px; 
          background: white; 
          border-bottom: 1px solid var(--card-border); 
          display: flex; 
          align-items: center; 
          justify-content: space-between; 
          padding: 0 24px; 
          flex-shrink: 0; 
        }
        
        .header-greeting { display: flex; align-items: center; gap: 12px; }
        .header-greeting-icon { color: #f59e0b; }
        .header-greeting-text h3 { margin: 0; font-size: 1.1rem; color: var(--text-main); font-weight: 600; }
        .header-greeting-text p { margin: 0; font-size: 0.75rem; color: var(--text-muted); }

        .header-stats {
          display: flex; gap: 16px; font-size: 0.75rem; font-weight: 500; align-items: center;
        }
        .stat-badge {
          display: flex; align-items: center; gap: 6px; color: var(--text-muted);
          background: var(--bg-dashboard); padding: 4px 10px; border-radius: 20px;
          border: 1px solid var(--card-border);
        }
        .dot { width: 6px; height: 6px; border-radius: 50%; }
        .dot.green { background: #10b981; }
        .dot.orange { background: #f59e0b; }
        
        .header-profile { display: flex; align-items: center; gap: 16px; margin-left: 20px; }
        .notification-icon { position: relative; color: var(--text-muted); cursor: pointer; }
        .notification-icon .badge { position: absolute; top: -2px; right: -2px; background: #ef4444; width: 8px; height: 8px; border-radius: 50%; border: 2px solid white; }
        .profile-info { display: flex; align-items: center; gap: 10px; text-align: right; border-left: 1px solid var(--card-border); padding-left: 16px; }
        .profile-info .avatar { width: 36px; height: 36px; background: #334155; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; }
        .profile-info .details h4 { margin: 0; font-size: 0.85rem; }
        .profile-info .details p { margin: 0; font-size: 0.7rem; color: var(--text-muted); }

        .admin-content-area { 
          flex: 1; 
          overflow-y: auto; 
          padding: 24px; 
        }
        
        /* Grid Layouts */
        .dash-grid-kpi {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          gap: 16px;
          margin-bottom: 20px;
        }
        
        .dash-card {
          background: white;
          border-radius: 12px;
          border: 1px solid var(--card-border);
          box-shadow: 0 1px 2px rgba(0,0,0,0.03);
          padding: 16px;
          display: flex; flex-direction: column;
        }
        .kpi-card { position: relative; overflow: hidden; padding: 14px 16px; }
        .kpi-card .kpi-header { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; font-size: 0.75rem; color: var(--text-muted); font-weight: 500; }
        .kpi-icon-box {
          width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center;
        }
        .kpi-card h3 { margin: 0; font-size: 1.3rem; font-weight: 700; color: var(--text-main); }
        .kpi-trend { font-size: 0.65rem; font-weight: 600; display: flex; align-items: center; gap: 4px; margin-top: 6px; }
        .trend-up { color: var(--green-trend); }
        .trend-down { color: var(--red-trend); }
        .trend-text { color: var(--text-muted); font-weight: 400; }

        .dash-grid-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }

        .dash-grid-row-3 {
          display: grid;
          grid-template-columns: 1.5fr 1.2fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }
        
        .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .card-title { font-size: 0.95rem; font-weight: 600; display: flex; align-items: center; gap: 8px; margin: 0; color: var(--text-main); }
        .card-action { font-size: 0.75rem; color: var(--blue-accent); font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 4px; }
        
        /* Specific components */
        .overview-flow { display: flex; align-items: center; justify-content: space-between; background: #f8fafc; border-radius: 40px; padding: 12px 24px; margin-bottom: 20px; border: 1px solid var(--card-border); }
        .flow-step { display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .flow-icon { width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .flow-value { font-size: 1.15rem; font-weight: 700; }
        .flow-label { font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
        .flow-arrow { color: #cbd5e1; }
        
        .overview-timeline { display: flex; justify-content: space-between; font-size: 0.65rem; color: var(--text-muted); font-weight: 600; padding: 0 10px; position: relative; }
        .overview-timeline::before { content: ''; position: absolute; left: 30px; right: 30px; top: 6px; height: 2px; background: var(--card-border); z-index: 0; }
        .timeline-step { background: white; padding: 0 8px; z-index: 1; }

        .alert-item { display: flex; gap: 12px; margin-bottom: 10px; padding: 10px; border-radius: 8px; background: #fafafa; border: 1px solid var(--card-border); align-items: flex-start; }
        .alert-item.red { background: #fef2f2; border-color: #fee2e2; }
        .alert-item.orange { background: #fffbeb; border-color: #fef3c7; }
        .alert-item.blue { background: #eff6ff; border-color: #dbeafe; }
        .alert-icon { width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; flex-shrink: 0; }
        .alert-content { flex: 1; }
        .alert-title { font-size: 0.75rem; font-weight: 600; margin-bottom: 2px; color: var(--text-main); }
        .alert-desc { font-size: 0.65rem; color: var(--text-muted); }
        .alert-time { font-size: 0.65rem; color: var(--text-muted); white-space: nowrap; }

        .monitor-chart { display: flex; justify-content: center; margin: 16px 0; position: relative; }
        .monitor-chart-circle { width: 130px; height: 130px; border-radius: 50%; border: 12px solid #10b981; border-right-color: #f1f5f9; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .monitor-stats { display: flex; justify-content: space-between; border-top: 1px solid var(--card-border); padding-top: 12px; margin-top: auto; }
        .monitor-stat { text-align: center; }
        .monitor-stat-val { font-size: 0.9rem; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 4px; }
        .monitor-stat-label { font-size: 0.65rem; color: var(--text-muted); }

        .admin-table { width: 100%; border-collapse: collapse; font-size: 0.75rem; }
        .admin-table th { text-align: left; padding: 10px; border-bottom: 1px solid var(--card-border); color: var(--text-muted); font-weight: 600; }
        .admin-table td { padding: 10px; border-bottom: 1px solid var(--card-border); color: var(--text-main); }
        .admin-table tr:last-child td { border-bottom: none; }
        .status-pill { padding: 4px 8px; border-radius: 20px; font-size: 0.65rem; font-weight: 600; display: inline-flex; align-items: center; gap: 4px; }
        .status-pill.active { color: #166534; }
        .status-pill.pending { color: #b45309; }
        .status-pill.attention { color: #ef4444; }
        
        .map-container { display: flex; gap: 20px; align-items: center; flex:1; }
        .map-visual { flex: 1; text-align: center; display:flex; justify-content:center; }
        .map-legend { width: 140px; display: flex; flex-direction: column; gap: 12px; }
        .legend-item { display: flex; align-items: center; gap: 8px; font-size: 0.65rem; color: var(--text-muted); }
        .legend-dot { width: 8px; height: 8px; border-radius: 50%; }
        
        .district-card { background: #0f766e; color: white; padding: 12px; border-radius: 8px; margin-top: 16px; display:flex; align-items:center; justify-content:space-between; cursor:pointer;}
        .district-title { font-size: 0.75rem; font-weight: 600; margin-bottom: 0;}
        .district-stats { display: flex; flex-direction:column; gap:4px; font-size:0.65rem; color: rgba(255,255,255,0.8); }
        
        .progress-bar-bg { height: 6px; background: #e2e8f0; border-radius: 3px; overflow: hidden; margin-top: 6px; }
        .progress-bar-fill { height: 100%; background: #10b981; }
      </style>

      <div class="admin-layout">
        <!-- Sidebar -->
        <aside class="admin-sidebar">
          <div class="admin-sidebar-header">
            <div class="logo-eye">
              <i data-lucide="eye" style="width:24px;height:24px;color:white;"></i>
            </div>
            <div class="admin-sidebar-header-text">
              <h2>DRISHTI KALYAN</h2>
              <p>Healthier Eyes &bull; Stronger Rural India</p>
            </div>
          </div>
          <nav class="admin-nav" id="admin-nav-container"></nav>
          
          <div class="sidebar-footer">
            <svg class="sidebar-village-graphic" viewBox="0 0 100 40" preserveAspectRatio="none">
              <!-- Simple village vector shapes -->
              <path d="M10,40 L10,25 L15,15 L20,25 L20,40 Z" fill="rgba(255,255,255,0.2)"/>
              <path d="M40,40 L40,25 L48,10 L56,25 L56,40 Z" fill="rgba(255,255,255,0.3)"/>
              <circle cx="85" cy="20" r="10" fill="rgba(255,255,255,0.1)"/>
              <path d="M85,30 L85,40" stroke="rgba(255,255,255,0.1)" stroke-width="2"/>
              <path d="M0,40 L100,40" stroke="rgba(255,255,255,0.4)" stroke-width="1"/>
            </svg>
            Better Vision | Brighter Future
          </div>
        </aside>
        
        <!-- Main Area -->
        <main class="admin-main">
          <header class="admin-header">
            <div class="header-greeting">
              <i data-lucide="sun" class="header-greeting-icon" style="width:24px;height:24px;"></i>
              <div class="header-greeting-text">
                <h3>Good Morning, Admin</h3>
                <p>Here's what's happening with your rural screening network today.</p>
              </div>
            </div>
            
            <div style="display:flex; align-items:center;">
              <div class="header-stats">
                <div style="color:var(--text-muted); font-size:0.7rem; font-weight:600;">System Status</div>
                <div class="stat-badge"><div class="dot green"></div> All Systems Operational</div>
                <div class="stat-badge" style="background:transparent; border:none; padding:0; gap:4px;"><i data-lucide="cpu" style="width:12px;height:12px;color:#10b981;"></i> <span style="color:#10b981;">AI Engine Online</span></div>
                <div class="stat-badge" style="background:transparent; border:none; padding:0; gap:4px;"><i data-lucide="database" style="width:12px;height:12px;color:#10b981;"></i> <span style="color:#10b981;">Database Online</span></div>
                <div class="stat-badge" style="background:transparent; border:none; padding:0; gap:4px;"><i data-lucide="wifi" style="width:12px;height:12px;color:#10b981;"></i> <span style="color:#10b981;">PHC Sync Online</span></div>
                <div class="stat-badge"><div class="dot orange"></div> 3 Devices Offline</div>
              </div>
              
              <div class="header-profile">
                <div class="notification-icon">
                  <i data-lucide="bell" style="width:20px;height:20px;"></i>
                  <div class="badge"></div>
                </div>
                <div class="profile-info">
                  <div class="avatar">A</div>
                  <div class="details">
                    <h4>Admin</h4>
                    <p>Super Admin <i data-lucide="chevron-down" style="width:12px;height:12px;vertical-align:middle;"></i></p>
                  </div>
                </div>
              </div>
            </div>
          </header>
          
          <div class="admin-content-area" id="admin-content-root"></div>
        </main>
      </div>
    `;

    const navConfig = [
      { id: 'dashboard', icon: 'home', label: 'Dashboard', isTop: true },
      { id: 'analytics', icon: 'bar-chart-2', label: 'Analytics & Reports', isTop: true },
      
      { category: 'HEALTHCARE' },
      { id: 'patients', icon: 'users', label: 'Patient Management' },
      { id: 'screenings', icon: 'scan-eye', label: 'Screening Management' },
      { id: 'phc', icon: 'building', label: 'PHC Management' },
      { id: 'doctors', icon: 'stethoscope', label: 'Doctor Management' },
      
      { category: 'AI' },
      { id: 'ai-model', icon: 'cpu', label: 'AI Model Management' },
      { id: 'ai-perf', icon: 'activity', label: 'AI Performance' },
      { id: 'ai-xai', icon: 'flask-conical', label: 'Explainability / XAI' },
      
      { category: 'SYSTEM' },
      { id: 'users', icon: 'users-2', label: 'User Management' },
      { id: 'notifications', icon: 'bell', label: 'Notifications', badge: 3 },
      { id: 'monitoring', icon: 'activity-square', label: 'System Monitoring' },
      { id: 'security', icon: 'shield', label: 'Security' },
      { id: 'backup', icon: 'cloud-download', label: 'Backup & Recovery' },
      
      { category: 'CONTENT' },
      { id: 'website', icon: 'layout', label: 'Website Management' },
      { id: 'content', icon: 'file-text', label: 'Content / Blog' },
      { id: 'media', icon: 'image', label: 'Media / Assets' },
      { id: 'logout', icon: 'log-out', label: 'Logout', isAction: true, style: 'display:none;' }
    ];

    const navContainer = container.querySelector('#admin-nav-container');
    navConfig.forEach(item => {
      if (item.category) {
        const cat = document.createElement('div');
        cat.className = 'nav-category';
        cat.textContent = item.category;
        navContainer.appendChild(cat);
        return;
      }

      const el = document.createElement('div');
      el.className = 'admin-nav-item';
      if (item.style) el.style = item.style;
      el.dataset.id = item.id;
      
      let badgeHtml = item.badge ? `<div class="nav-badge">${item.badge}</div>` : '';
      el.innerHTML = `<i data-lucide="${item.icon}" style="width:16px;height:16px;"></i> <span>${item.label}</span> ${badgeHtml}`;
      
      el.addEventListener('click', () => {
        if (item.isAction) {
          if (item.id === 'logout') {
            StorageService.logoutAdmin();
            onNavigate('login');
          }
          return;
        }
        switchTab(item.id);
      });
      navContainer.appendChild(el);
    });

    if (window.lucide) window.lucide.createIcons();

    function switchTab(tabId) {
      navContainer.querySelectorAll('.admin-nav-item').forEach(el => el.classList.remove('active'));
      const activeNav = navContainer.querySelector(`.admin-nav-item[data-id="${tabId}"]`);
      if (activeNav) activeNav.classList.add('active');

      const root = document.getElementById('admin-content-root');
      root.innerHTML = '';
      
      if (tabId === 'dashboard') {
        renderDenseDashboard(root);
      } else {
        root.innerHTML = `
          <div class="dash-card" style="height: 400px; align-items:center; justify-content:center;">
            <i data-lucide="layout-template" style="width:48px;height:48px;color:#cbd5e1;margin-bottom:16px;"></i>
            <h3 style="margin:0;color:var(--text-muted);">${tabId} view coming soon</h3>
          </div>
        `;
      }
      
      if (window.lucide) window.lucide.createIcons();
    }

    function renderDenseDashboard(root) {
      const kpis = [
        { title: 'Total Patients', value: '18,429', trend: '12%', trendUp: true, icon: 'users', bg: '#e0f2fe', color: '#0ea5e9' },
        { title: 'Total Screenings', value: '15,672', trend: '18%', trendUp: true, icon: 'scan-eye', bg: '#ccfbf1', color: '#14b8a6' },
        { title: 'Positive DR Cases', value: '1,284', trend: '9%', trendUp: true, icon: 'activity', bg: '#fee2e2', color: '#ef4444' },
        { title: 'High-Risk Cases', value: '684', trend: '14%', trendUp: true, icon: 'alert-triangle', bg: '#ffedd5', color: '#f97316' },
        { title: 'Active PHCs', value: '126', trend: '6%', trendUp: true, icon: 'building', bg: '#dcfce7', color: '#10b981' },
        { title: 'Active Doctors', value: '248', trend: '8%', trendUp: true, icon: 'stethoscope', bg: '#dbeafe', color: '#3b82f6' },
        { title: 'AI Model Accuracy', value: '94.8%', trend: '0.6%', trendUp: true, icon: 'cpu', bg: '#e0e7ff', color: '#6366f1' },
        { title: 'Pending Reviews', value: '137', trend: '21%', trendUp: false, icon: 'clock', bg: '#ffe4e6', color: '#f43f5e' }
      ];

      const kpiHtml = kpis.map(k => `
        <div class="dash-card kpi-card">
          <div class="kpi-header">
            <div class="kpi-icon-box" style="background:${k.bg}; color:${k.color};">
              <i data-lucide="${k.icon}" style="width:16px;height:16px;"></i>
            </div>
            ${k.title}
          </div>
          <h3>${k.value}</h3>
          <div class="kpi-trend ${k.trendUp ? 'trend-up' : 'trend-down'}">
            <i data-lucide="${k.trendUp ? 'arrow-up' : 'arrow-down'}" style="width:10px;height:10px;"></i> ${k.trend} 
            <span class="trend-text">vs last week</span>
          </div>
        </div>
      `).join('');

      root.innerHTML = `
        <div class="dash-grid-kpi">${kpiHtml}</div>
        
        <div class="dash-grid-row-2">
          <!-- Today's Screening Overview -->
          <div class="dash-card">
            <div class="card-header">
              <h3 class="card-title"><i data-lucide="calendar" style="width:16px;height:16px;"></i> Today's Screening Overview</h3>
              <div class="card-action" style="color:var(--text-muted);"><i data-lucide="calendar-days" style="width:14px;height:14px;"></i> 24 Sep 2025</div>
            </div>
            <div class="overview-flow">
              <div class="flow-step">
                <div class="flow-icon" style="background:#f0fdf4; color:#16a34a;"><i data-lucide="users"></i></div>
                <div class="flow-value">2,846</div>
                <div class="flow-label">Screened</div>
              </div>
              <i data-lucide="arrow-right" class="flow-arrow"></i>
              <div class="flow-step">
                <div class="flow-icon" style="background:#f5f3ff; color:#7c3aed;"><i data-lucide="brain"></i></div>
                <div class="flow-value">184</div>
                <div class="flow-label">AI Flagged</div>
              </div>
              <i data-lucide="arrow-right" class="flow-arrow"></i>
              <div class="flow-step">
                <div class="flow-icon" style="background:#ecfdf5; color:#059669;"><i data-lucide="file-text"></i></div>
                <div class="flow-value">37</div>
                <div class="flow-label">Referrals</div>
              </div>
            </div>
            <div class="overview-timeline">
              <div class="timeline-step">Screening</div>
              <div class="timeline-step">AI Analysis</div>
              <div class="timeline-step">Doctor Review</div>
              <div class="timeline-step">Referral</div>
            </div>
          </div>
          
          <!-- Admin Alert Center -->
          <div class="dash-card">
            <div class="card-header">
              <h3 class="card-title"><i data-lucide="bell-ring" style="color:#ef4444; width:16px;height:16px;"></i> Admin Alert Center <div class="nav-badge" style="display:inline-flex;position:relative;margin:0 0 0 4px;width:16px;height:16px;font-size:10px;">3</div></h3>
              <div class="card-action">View All</div>
            </div>
            <div style="overflow-y:auto; flex:1; max-height:200px;">
              <div class="alert-item red">
                <div class="alert-icon" style="background:#fecaca; color:#b91c1c;"><i data-lucide="alert-triangle" style="width:12px;height:12px;"></i></div>
                <div class="alert-content">
                  <div class="alert-title">12 High-risk cases awaiting review</div>
                  <div class="alert-desc">Require immediate attention from doctors.</div>
                </div>
                <div class="alert-time">2h ago</div>
              </div>
              <div class="alert-item orange">
                <div class="alert-icon" style="background:#fde68a; color:#b45309;"><i data-lucide="wifi-off" style="width:12px;height:12px;"></i></div>
                <div class="alert-content">
                  <div class="alert-title">8 PHCs haven't synced data today</div>
                  <div class="alert-desc">Check internet connectivity / device status.</div>
                </div>
                <div class="alert-time">4h ago</div>
              </div>
              <div class="alert-item orange">
                <div class="alert-icon" style="background:#fde68a; color:#b45309;"><i data-lucide="image-off" style="width:12px;height:12px;"></i></div>
                <div class="alert-content">
                  <div class="alert-title">24 images failed quality check</div>
                  <div class="alert-desc">Retake images or verify device settings.</div>
                </div>
                <div class="alert-time">5h ago</div>
              </div>
              <div class="alert-item blue" style="margin-bottom:0;">
                <div class="alert-icon" style="background:#bfdbfe; color:#1d4ed8;"><i data-lucide="cpu" style="width:12px;height:12px;"></i></div>
                <div class="alert-content">
                  <div class="alert-title">AI model requires review for 3 unusual cases</div>
                  <div class="alert-desc">Predictions need manual verification.</div>
                </div>
                <div class="alert-time">6h ago</div>
              </div>
            </div>
          </div>
          
          <!-- AI Model Monitoring -->
          <div class="dash-card">
            <div class="card-header">
              <h3 class="card-title"><i data-lucide="crosshair" style="width:16px;height:16px;"></i> AI Model Monitoring</h3>
              <div class="card-action">View Analytics <i data-lucide="arrow-right" style="width:12px;height:12px;"></i></div>
            </div>
            <div class="monitor-chart">
              <div class="monitor-chart-circle">
                <div style="font-size:1.5rem; font-weight:700;">94.8%</div>
                <div style="font-size:0.65rem; color:var(--text-muted);">Accuracy</div>
              </div>
              
              <div style="position:absolute; right:10px; top:10px; display:flex; flex-direction:column; gap:20px;">
                <div>
                  <div style="font-size:0.65rem; color:var(--text-muted);">Images Processed</div>
                  <div style="font-weight:600; font-size:0.85rem;">18,429 <span style="font-size:0.6rem; color:#10b981; margin-left:6px;"><i data-lucide="arrow-up" style="width:8px;height:8px;"></i> 18%</span></div>
                </div>
                <div>
                  <div style="font-size:0.65rem; color:var(--text-muted);">Quality Rejection</div>
                  <div style="font-weight:600; font-size:0.85rem;">3.2% <span style="font-size:0.6rem; color:#ef4444; margin-left:6px;"><i data-lucide="arrow-down" style="width:8px;height:8px;"></i> 1.1%</span></div>
                </div>
              </div>
            </div>
            <div class="monitor-stats">
              <div class="monitor-stat" style="text-align:left;">
                <div class="monitor-stat-label"><i data-lucide="calendar" style="width:12px;height:12px;vertical-align:middle;margin-right:4px;"></i> Last Model Update</div>
                <div class="monitor-stat-val" style="justify-content:flex-start; font-size:0.8rem;">Today</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="dash-grid-row-3">
          <!-- PHC Performance -->
          <div class="dash-card" style="padding:0; overflow:hidden;">
            <div class="card-header" style="padding: 16px 16px 0;">
              <h3 class="card-title"><i data-lucide="building" style="width:16px;height:16px;"></i> PHC Performance</h3>
              <div class="card-action">View All PHCs <i data-lucide="arrow-right" style="width:12px;height:12px;"></i></div>
            </div>
            <div style="overflow-x:auto;">
              <table class="admin-table">
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
                  <tr>
                    <td>PHC Bithri</td><td>Bareilly</td><td>420</td><td>32</td><td>4</td>
                    <td><div class="status-pill active"><div class="dot green"></div> Active</div></td>
                  </tr>
                  <tr>
                    <td>PHC Aonla</td><td>Bareilly</td><td>318</td><td>27</td><td>12</td>
                    <td><div class="status-pill pending"><div class="dot orange"></div> Sync Pending</div></td>
                  </tr>
                  <tr>
                    <td>PHC Fatehganj</td><td>Shahjahanpur</td><td>186</td><td>19</td><td>18</td>
                    <td><div class="status-pill attention"><div class="dot" style="background:#ef4444;"></div> Needs Attention</div></td>
                  </tr>
                  <tr>
                    <td>PHC Tilhar</td><td>Shahjahanpur</td><td>264</td><td>21</td><td>6</td>
                    <td><div class="status-pill active"><div class="dot green"></div> Active</div></td>
                  </tr>
                  <tr>
                    <td>PHC Nanpara</td><td>Bahraich</td><td>142</td><td>11</td><td>9</td>
                    <td><div class="status-pill pending"><div class="dot orange"></div> Sync Pending</div></td>
                  </tr>
                  <tr>
                    <td>PHC Misrikh</td><td>Sitapur</td><td>308</td><td>25</td><td>14</td>
                    <td><div class="status-pill active"><div class="dot green"></div> Active</div></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <!-- Rural India PHC Coverage -->
          <div class="dash-card">
            <div class="card-header">
              <h3 class="card-title"><i data-lucide="map" style="width:16px;height:16px;"></i> Rural India PHC Coverage</h3>
            </div>
            <div class="map-container">
              <div class="map-visual">
                <!-- SVG map outline for India -->
                <svg viewBox="0 0 100 110" style="width:140px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.05));">
                  <path d="M40,0 L60,5 L80,20 L95,40 L100,60 L80,90 L60,110 L40,105 L20,90 L5,70 L0,50 L10,25 Z" fill="#bbf7d0" stroke="#22c55e" stroke-width="0.5" />
                  <circle cx="45" cy="30" r="2.5" fill="#10b981"/>
                  <circle cx="65" cy="40" r="2.5" fill="#f59e0b"/>
                  <circle cx="35" cy="60" r="2.5" fill="#10b981"/>
                  <circle cx="55" cy="70" r="2.5" fill="#ef4444"/>
                  <circle cx="75" cy="65" r="2.5" fill="#10b981"/>
                  <circle cx="40" cy="85" r="2.5" fill="#f59e0b"/>
                  <circle cx="20" cy="75" r="2.5" fill="#94a3b8"/>
                </svg>
              </div>
              <div class="map-legend">
                <div class="legend-item"><div class="legend-dot" style="background:#10b981;"></div> Active & Normal</div>
                <div class="legend-item"><div class="legend-dot" style="background:#f59e0b;"></div> Follow-up Required</div>
                <div class="legend-item"><div class="legend-dot" style="background:#ef4444;"></div> High-risk Cases</div>
                <div class="legend-item"><div class="legend-dot" style="background:#94a3b8;"></div> Offline / Sync Pending</div>
              </div>
            </div>
            
            <div class="district-card">
              <div>
                <div class="district-title">Bareilly District</div>
                <div class="district-stats">
                  <span>12 PHCs &bull; 486 Screenings</span>
                  <span>31 Suspected Cases &bull; 7 Referrals Pending</span>
                </div>
              </div>
              <div style="background:rgba(255,255,255,0.2); border-radius:20px; padding: 4px 10px; font-size:0.65rem;">
                View Details <i data-lucide="arrow-right" style="width:10px;height:10px;vertical-align:middle;"></i>
              </div>
            </div>
          </div>
          
          <!-- Right Stack -->
          <div style="display:flex; flex-direction:column; gap:20px;">
            <div class="dash-card" style="flex:1;">
              <div class="card-header">
                <h3 class="card-title"><i data-lucide="activity" style="width:16px;height:16px;"></i> Referral Priority</h3>
                <div class="card-action">View Referral Queue <i data-lucide="arrow-right" style="width:12px;height:12px;"></i></div>
              </div>
              <div style="display:flex; align-items:center; gap:20px; margin-top: 10px;">
                <div style="width:90px; height:90px; border-radius:50%; border:8px solid #facc15; border-top-color:#fb923c; border-right-color:#f87171; display:flex; flex-direction:column; align-items:center; justify-content:center;">
                  <div style="font-size:1.15rem; font-weight:700;">113</div>
                  <div style="font-size:0.5rem; color:var(--text-muted); text-align:center;">Total Pending</div>
                </div>
                <div style="flex:1; display:flex; flex-direction:column; gap:10px;">
                  <div style="display:flex; justify-content:space-between; font-size:0.7rem;"><span style="display:flex;align-items:center;gap:6px;"><div class="dot" style="background:#ef4444;"></div> Immediate</span> <strong>12</strong></div>
                  <div style="display:flex; justify-content:space-between; font-size:0.7rem;"><span style="display:flex;align-items:center;gap:6px;"><div class="dot" style="background:#f97316;"></div> Within 7 days</span> <strong>28</strong></div>
                  <div style="display:flex; justify-content:space-between; font-size:0.7rem;"><span style="display:flex;align-items:center;gap:6px;"><div class="dot" style="background:#eab308;"></div> Routine Follow-up</span> <strong>64</strong></div>
                </div>
              </div>
            </div>
            
            <div class="dash-card" style="flex:1;">
              <div class="card-header">
                <h3 class="card-title"><i data-lucide="pulse" style="width:16px;height:16px;"></i> System Health</h3>
              </div>
              <div style="display:flex; flex-direction:column; gap:12px;">
                <div>
                  <div style="display:flex; justify-content:space-between; font-size:0.65rem; font-weight:500;"><span>Server Load</span> <span style="color:#10b981;">32 %</span></div>
                  <div class="progress-bar-bg"><div class="progress-bar-fill" style="width:32%;"></div></div>
                </div>
                <div>
                  <div style="display:flex; justify-content:space-between; font-size:0.65rem; font-weight:500;"><span>Database Usage</span> <span style="color:#f59e0b;">68 %</span></div>
                  <div class="progress-bar-bg"><div class="progress-bar-fill" style="width:68%; background:#f59e0b;"></div></div>
                </div>
                <div>
                  <div style="display:flex; justify-content:space-between; font-size:0.65rem; font-weight:500;"><span>Storage Usage</span> <span style="color:#10b981;">41 %</span></div>
                  <div class="progress-bar-bg"><div class="progress-bar-fill" style="width:41%;"></div></div>
                </div>
              </div>
              <div class="card-action" style="margin-top:16px;">View System Monitoring <i data-lucide="arrow-right" style="width:12px;height:12px;"></i></div>
            </div>
          </div>
        </div>
        
        <div class="dash-grid-row-3" style="grid-template-columns: 1.5fr 1.2fr 1fr;">
          <!-- Screening Trend -->
          <div class="dash-card">
             <div class="card-header">
              <h3 class="card-title"><i data-lucide="line-chart" style="width:16px;height:16px;"></i> Screening Trend <span style="font-weight:400; font-size:0.65rem; color:var(--text-muted); margin-left:4px;">(Last 7 Days)</span></h3>
              <div style="display:flex; gap:12px; font-size:0.65rem; font-weight:500;">
                <span style="display:flex;align-items:center;gap:4px;"><div style="width:12px;height:2px;background:#10b981;"></div> Total Screenings</span>
                <span style="display:flex;align-items:center;gap:4px;"><div style="width:12px;height:2px;background:#ef4444;"></div> Positive Cases</span>
              </div>
            </div>
            <div style="height:150px; position:relative; display:flex; flex-direction:column; justify-content:flex-end;">
              <svg viewBox="0 0 100 40" preserveAspectRatio="none" style="width:100%; height:80%; overflow:visible;">
                <path d="M0,35 L16,30 L33,28 L50,22 L66,15 L83,18 L100,10" fill="none" stroke="#10b981" stroke-width="1.5" />
                <path d="M0,40 L16,40 L33,40 L50,40 L66,40 L83,40 L100,40 L100,10 L83,18 L66,15 L50,22 L33,28 L16,30 L0,35 Z" fill="rgba(16,185,129,0.1)" />
                <circle cx="0" cy="35" r="1.5" fill="#10b981"/><circle cx="16" cy="30" r="1.5" fill="#10b981"/><circle cx="33" cy="28" r="1.5" fill="#10b981"/><circle cx="50" cy="22" r="1.5" fill="#10b981"/><circle cx="66" cy="15" r="1.5" fill="#10b981"/><circle cx="83" cy="18" r="1.5" fill="#10b981"/><circle cx="100" cy="10" r="1.5" fill="#10b981"/>
                
                <path d="M0,38 L16,37 L33,37 L50,35 L66,32 L83,34 L100,30" fill="none" stroke="#ef4444" stroke-width="1" />
                <circle cx="0" cy="38" r="1" fill="#ef4444"/><circle cx="16" cy="37" r="1" fill="#ef4444"/><circle cx="33" cy="37" r="1" fill="#ef4444"/><circle cx="50" cy="35" r="1" fill="#ef4444"/><circle cx="66" cy="32" r="1" fill="#ef4444"/><circle cx="83" cy="34" r="1" fill="#ef4444"/><circle cx="100" cy="30" r="1" fill="#ef4444"/>
              </svg>
              <!-- Grid lines -->
              <div style="position:absolute; bottom:-15px; width:100%; display:flex; justify-content:space-between; font-size:0.55rem; color:var(--text-muted); border-top:1px solid var(--card-border); padding-top:4px;">
                <span>18 Sep</span><span>19 Sep</span><span>20 Sep</span><span>21 Sep</span><span>22 Sep</span><span>23 Sep</span><span>24 Sep</span>
              </div>
            </div>
          </div>
          
          <!-- DR Severity Distribution -->
          <div class="dash-card">
            <div class="card-header">
              <h3 class="card-title"><i data-lucide="pie-chart" style="width:16px;height:16px;"></i> DR Severity Distribution</h3>
            </div>
            <div style="display:flex; align-items:center; gap:16px; height: 100%;">
              <div style="width:100px; height:100px; border-radius:50%; border:12px solid #10b981; border-right-color:#3b82f6; border-bottom-color:#f59e0b; border-top-color:#ef4444; display:flex; flex-direction:column; align-items:center; justify-content:center; flex-shrink:0;">
                <div style="font-size:1.15rem; font-weight:700;">1,284</div>
                <div style="font-size:0.5rem; color:var(--text-muted); text-align:center;">Positive Cases</div>
              </div>
              <div style="flex:1; display:flex; flex-direction:column; gap:8px; font-size:0.65rem;">
                <div style="display:flex; justify-content:space-between;">
                  <span style="display:flex;align-items:center;gap:6px;"><div class="dot" style="background:#10b981;"></div> No DR</span> <strong>46.2%</strong>
                </div>
                <div style="display:flex; justify-content:space-between;">
                  <span style="display:flex;align-items:center;gap:6px;"><div class="dot" style="background:#3b82f6;"></div> Mild</span> <strong>28.5%</strong>
                </div>
                <div style="display:flex; justify-content:space-between;">
                  <span style="display:flex;align-items:center;gap:6px;"><div class="dot" style="background:#f59e0b;"></div> Moderate</span> <strong>16.7%</strong>
                </div>
                <div style="display:flex; justify-content:space-between;">
                  <span style="display:flex;align-items:center;gap:6px;"><div class="dot" style="background:#ef4444;"></div> Severe</span> <strong>6.3%</strong>
                </div>
                <div style="display:flex; justify-content:space-between;">
                  <span style="display:flex;align-items:center;gap:6px;"><div class="dot" style="background:#b91c1c;"></div> Proliferative</span> <strong>2.3%</strong>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Recent Activity -->
          <div class="dash-card">
            <div class="card-header">
              <h3 class="card-title"><i data-lucide="clock" style="width:16px;height:16px;"></i> Recent Activity</h3>
              <div class="card-action">View All <i data-lucide="arrow-right" style="width:12px;height:12px;"></i></div>
            </div>
            <div style="display:flex; flex-direction:column; gap:14px; margin-top:4px;">
              <div style="display:flex; align-items:center; gap:10px; font-size:0.65rem;">
                <div style="width:20px;height:20px;border-radius:50%;background:#dcfce7;color:#10b981;display:flex;align-items:center;justify-content:center;"><i data-lucide="user-plus" style="width:10px;height:10px;"></i></div>
                <div style="flex:1; color:var(--text-main);">New patient registered - ID 45872</div>
                <div style="color:var(--text-muted);font-size:0.6rem;">2 min ago</div>
              </div>
              <div style="display:flex; align-items:center; gap:10px; font-size:0.65rem;">
                <div style="width:20px;height:20px;border-radius:50%;background:#e0f2fe;color:#0ea5e9;display:flex;align-items:center;justify-content:center;"><i data-lucide="check-circle" style="width:10px;height:10px;"></i></div>
                <div style="flex:1; color:var(--text-main);">Screening completed - PHC Bithri</div>
                <div style="color:var(--text-muted);font-size:0.6rem;">5 min ago</div>
              </div>
              <div style="display:flex; align-items:center; gap:10px; font-size:0.65rem;">
                <div style="width:20px;height:20px;border-radius:50%;background:#fee2e2;color:#ef4444;display:flex;align-items:center;justify-content:center;"><i data-lucide="alert-triangle" style="width:10px;height:10px;"></i></div>
                <div style="flex:1; color:var(--text-main);">AI flagged - Moderate DR</div>
                <div style="color:var(--text-muted);font-size:0.6rem;">12 min ago</div>
              </div>
              <div style="display:flex; align-items:center; gap:10px; font-size:0.65rem;">
                <div style="width:20px;height:20px;border-radius:50%;background:#ffedd5;color:#f97316;display:flex;align-items:center;justify-content:center;"><i data-lucide="file-text" style="width:10px;height:10px;"></i></div>
                <div style="flex:1; color:var(--text-main);">Referral assigned - ID 45821</div>
                <div style="color:var(--text-muted);font-size:0.6rem;">18 min ago</div>
              </div>
              <div style="display:flex; align-items:center; gap:10px; font-size:0.65rem;">
                <div style="width:20px;height:20px;border-radius:50%;background:#ffe4e6;color:#f43f5e;display:flex;align-items:center;justify-content:center;"><i data-lucide="image-off" style="width:10px;height:10px;"></i></div>
                <div style="flex:1; color:var(--text-main);">Image quality issue - PHC Tilhar</div>
                <div style="color:var(--text-muted);font-size:0.6rem;">25 min ago</div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    switchTab('dashboard');
  });
}
