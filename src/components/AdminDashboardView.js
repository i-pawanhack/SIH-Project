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
        #view-admin-dashboard { padding: 0 !important; }
        .admin-layout { display: flex; height: 100vh; background: var(--light-blue); font-family: 'Inter', sans-serif; }
        .admin-sidebar { width: 260px; background: var(--deep-navy); color: white; display: flex; flex-direction: column; flex-shrink: 0; }
        .admin-sidebar-header { padding: 24px 20px; border-bottom: 1px solid rgba(255,255,255,0.1); }
        .admin-nav { flex: 1; overflow-y: auto; padding: 16px 0; }
        .admin-nav::-webkit-scrollbar { width: 6px; }
        .admin-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }
        .admin-nav-item { padding: 12px 24px; display: flex; align-items: center; gap: 12px; color: rgba(255,255,255,0.7); cursor: pointer; transition: 0.2s; font-size: 0.9rem; }
        .admin-nav-item:hover { background: rgba(255,255,255,0.05); color: white; }
        .admin-nav-item.active { background: rgba(255,255,255,0.1); color: white; border-left: 4px solid var(--bright-cyan); }
        
        .admin-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
        .admin-header { height: 64px; background: white; border-bottom: 1px solid var(--border-gray); display: flex; align-items: center; justify-content: space-between; padding: 0 24px; flex-shrink: 0; }
        .admin-content-area { flex: 1; overflow-y: auto; padding: 24px; }
        
        /* Utility styles for sub-views */
        .admin-card { background: white; border: 1px solid var(--border-gray); border-radius: 8px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); margin-bottom: 24px; }
        .admin-card-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-gray); padding-bottom: 16px; margin-bottom: 16px; }
        .admin-card-title { font-size: 1.1rem; font-weight: 600; color: var(--slate-800); margin: 0; display:flex; align-items:center; gap:8px;}
        
        .admin-grid { display: grid; gap: 20px; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }
        
        .admin-tabs { display: flex; border-bottom: 1px solid var(--border-gray); margin-bottom: 20px; gap: 24px; }
        .admin-tab { padding: 10px 4px; border-bottom: 2px solid transparent; color: var(--slate-500); cursor: pointer; font-weight: 500; }
        .admin-tab.active { border-bottom-color: var(--med-teal); color: var(--med-teal); }
        
        .admin-badge { padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 600; }
        .badge-green { background: #dcfce7; color: #166534; }
        .badge-yellow { background: #fef08a; color: #854d0e; }
        .badge-red { background: #fee2e2; color: #991b1b; }
        .badge-gray { background: #f1f5f9; color: #475569; }
        
        .admin-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
        .admin-table th { text-align: left; padding: 12px; border-bottom: 1px solid var(--border-gray); color: var(--slate-500); font-weight: 600; background: #f8fafc; }
        .admin-table td { padding: 12px; border-bottom: 1px solid var(--border-gray); color: var(--slate-700); }
        .admin-table tr:hover { background: #f8fafc; }
      </style>

      <div class="admin-layout">
        <aside class="admin-sidebar">
          <div class="admin-sidebar-header">
            <h2 style="margin:0; font-size: 1.25rem; color: var(--soft-mint); font-family: 'Outfit', sans-serif; letter-spacing: 0.5px;">DRISH KALYAN</h2>
            <div style="font-size: 0.75rem; color: rgba(255,255,255,0.7); margin-top: 4px; font-weight: 500;">${window.tData('ADMIN CONTROL PANEL')}</div>
          </div>
          <nav class="admin-nav" id="admin-nav-container"></nav>
        </aside>
        
        <main class="admin-main">
          <header class="admin-header">
            <div>
              <h3 id="admin-current-title" style="margin:0; color: var(--slate-800); font-weight: 600; font-size: 1.25rem;">${window.tData('Dashboard')}</h3>
            </div>
            <div style="display:flex; align-items:center; gap: 16px;">
              <div style="text-align: right; line-height: 1.2;">
                <div style="font-size: 0.875rem; font-weight: 600; color: var(--slate-800);">${window.tData('DRISH KALYAN Admin')}</div>
                <div style="font-size: 0.75rem; color: var(--slate-500);">admin@drishkalyan.in</div>
              </div>
              <div style="width: 36px; height: 36px; background: var(--teal-100); color: var(--teal-700); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">
                DK
              </div>
            </div>
          </header>
          
          <div class="admin-content-area" id="admin-content-root"></div>
        </main>
      </div>
    `;

    const navConfig = [
      { id: 'dashboard', icon: 'layout-dashboard', label: 'Dashboard' },
      { id: 'website', icon: 'globe', label: 'Website Management' },
      { id: 'users', icon: 'users', label: 'User Management' },
      { id: 'patients', icon: 'user-square-2', label: 'Patient Management' },
      { id: 'screenings', icon: 'scan-eye', label: 'Screening Management' },
      { id: 'ai', icon: 'brain-circuit', label: 'AI / Model Management' },
      { id: 'analytics', icon: 'bar-chart-3', label: 'Analytics & Reports' },
      { id: 'notifications', icon: 'bell', label: 'Notifications' },
      { id: 'media', icon: 'image', label: 'Media / Assets' },
      { id: 'content', icon: 'file-text', label: 'Content / Blog' },
      { id: 'monitoring', icon: 'activity', label: 'System Monitoring' },
      { id: 'security', icon: 'shield-check', label: 'Security' },
      { id: 'settings', icon: 'settings', label: 'Site Settings' },
      { id: 'backup', icon: 'database-backup', label: 'Backup & Recovery' },
      { id: 'logout', icon: 'log-out', label: 'Logout', isAction: true }
    ];

    const navContainer = container.querySelector('#admin-nav-container');
    navConfig.forEach(item => {
      const el = document.createElement('div');
      el.className = 'admin-nav-item';
      el.dataset.id = item.id;
      el.innerHTML = `<i data-lucide="${item.icon}" style="width:18px;height:18px;"></i> <span>${window.tData(item.label)}</span>`;
      
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

      const config = navConfig.find(n => n.id === tabId);
      if (config) document.getElementById('admin-current-title').textContent = window.tData(config.label);

      const root = document.getElementById('admin-content-root');
      
      // Clear previous content
      root.innerHTML = '';
      
      // Render Content
      switch(tabId) {
        case 'dashboard': renderTabDashboard(root); break;
        case 'website': renderTabWebsite(root); break;
        case 'users': renderTabUsers(root); break;
        case 'patients': renderTabPatients(root); break;
        case 'screenings': renderTabScreenings(root); break;
        case 'ai': renderTabAI(root); break;
        case 'analytics': renderTabAnalytics(root); break;
        case 'notifications': renderTabNotifications(root); break;
        case 'media': renderTabMedia(root); break;
        case 'content': renderTabContent(root); break;
        case 'monitoring': renderTabMonitoring(root); break;
        case 'security': renderTabSecurity(root); break;
        case 'settings': renderTabSettings(root); break;
        case 'backup': renderTabBackup(root); break;
      }
      
      if (window.lucide) window.lucide.createIcons();
    }

    const onLangChangeAdmin = () => {
      renderAdminDashboardView(container, onNavigate);
    };
    window.addEventListener('languageChanged', onLangChangeAdmin, { once: true });

    // --- Sub-View Render Functions --- //

    function renderTabDashboard(root) {
      root.innerHTML = `
        <div style="margin-bottom: 24px;">
          <h2 style="margin:0 0 8px 0; color: var(--slate-900);">${window.tData('Explainable AI-powered Diabetic Retinopathy Screening for Rural Healthcare')}</h2>
          <p style="margin:0; color: var(--slate-500);">${window.tData('Overview of platform activity, screening volume, and AI performance.')}</p>
        </div>
        
        <div class="admin-grid" style="margin-bottom: 24px;">
          ${kpiCard('Users', window.tData('Total Patients'), '12,846')}
          ${kpiCard('Scan-Eye', window.tData('Screenings Completed'), '18,429')}
          ${kpiCard('Alert-Triangle', window.tData('Positive DR Cases'), '2,184', 'badge-red')}
          ${kpiCard('Alert-Octagon', window.tData('High-Risk Cases'), '684', 'badge-red')}
          ${kpiCard('Building', window.tData('Active PHCs'), '126')}
          ${kpiCard('Stethoscope', window.tData('Active Doctors'), '84')}
          ${kpiCard('Brain-Circuit', window.tData('AI Model Accuracy'), '94.8%', 'badge-green')}
          ${kpiCard('Clock', window.tData('Pending Reviews'), '137', 'badge-yellow')}
        </div>

        <div class="admin-grid" style="grid-template-columns: 1fr 1fr; margin-bottom: 24px;">
          <div class="admin-card">
            <div class="admin-card-header">
              <h3 class="admin-card-title"><i data-lucide="trending-up"></i> ${window.tData('Screening Trend (Mock Data)')}</h3>
            </div>
            <div style="height: 250px; background: #f8fafc; border: 1px dashed var(--border-gray); display:flex; align-items:center; justify-content:center; color: var(--slate-400); border-radius: 4px;">
              ${window.tData('[ Line Chart Placeholder: Daily Screenings ]')}
            </div>
          </div>
          <div class="admin-card">
            <div class="admin-card-header">
              <h3 class="admin-card-title"><i data-lucide="pie-chart"></i> ${window.tData('DR Severity Distribution')}</h3>
            </div>
            <div style="height: 250px; background: #f8fafc; border: 1px dashed var(--border-gray); display:flex; align-items:center; justify-content:center; color: var(--slate-400); border-radius: 4px;">
              ${window.tData('[ Donut Chart Placeholder: No DR / Mild / Moderate / Severe / Proliferative ]')}
            </div>
          </div>
        </div>
        
        <div class="admin-card">
           <div class="admin-card-header">
             <h3 class="admin-card-title"><i data-lucide="map-pin"></i> ${window.tData('Rural Screening Coverage (Mock Data)')}</h3>
           </div>
           <table class="admin-table">
             <thead><tr><th>${window.tData('District')}</th><th>${window.tData('Active PHCs')}</th><th>${window.tData('Total Screenings')}</th><th>${window.tData('Positivity Rate')}</th></tr></thead>
             <tbody>
               <tr><td>${window.tData('Bareilly')}</td><td>24</td><td>4,210</td><td>12.4%</td></tr>
               <tr><td>${window.tData('Lucknow')}</td><td>38</td><td>6,182</td><td>10.2%</td></tr>
               <tr><td>${window.tData('Prayagraj')}</td><td>18</td><td>3,045</td><td>14.1%</td></tr>
               <tr><td>${window.tData('Varanasi')}</td><td>22</td><td>2,810</td><td>11.8%</td></tr>
               <tr><td>${window.tData('Gorakhpur')}</td><td>24</td><td>2,182</td><td>13.5%</td></tr>
             </tbody>
           </table>
        </div>
      `;
    }

    function renderTabWebsite(root) {
      root.innerHTML = `
        <div class="admin-tabs">
          <div class="admin-tab active">${window.tData('Homepage')}</div>
          <div class="admin-tab">${window.tData('About Us')}</div>
          <div class="admin-tab">${window.tData('Services')}</div>
          <div class="admin-tab">${window.tData('FAQs')}</div>
          <div class="admin-tab">${window.tData('Contact Info')}</div>
          <div class="admin-tab">${window.tData('Announcements')}</div>
        </div>
        <div class="admin-card">
          <h3 class="admin-card-title" style="margin-bottom:20px;">${window.tData('Manage Homepage')}</h3>
          <p style="color:var(--slate-500); margin-bottom: 20px;">${window.tData('Update hero sections, statistics, and call-to-action buttons here.')}</p>
          <div style="display:flex; flex-direction:column; gap:16px; max-width: 600px;">
             <div><label style="display:block;margin-bottom:8px;font-weight:600;font-size:0.875rem;">${window.tData('Hero Title')}</label><input type="text" class="form-input" value="DRISH KALYAN: Har Nazar, Hamari Zimmedari"></div>
             <div><label style="display:block;margin-bottom:8px;font-weight:600;font-size:0.875rem;">${window.tData('Hero Subtitle')}</label><textarea class="form-input" rows="3">Explainable AI-powered clinical decision support system for faster, accessible Diabetic Retinopathy screening in rural healthcare centres.</textarea></div>
             <button class="btn btn-primary" style="align-self: flex-start;">${window.tData('Save Changes')}</button>
          </div>
        </div>
      `;
    }

    function renderTabUsers(root) {
      root.innerHTML = `
        <div class="admin-tabs">
          <div class="admin-tab active">${window.tData('Admins')}</div>
          <div class="admin-tab">${window.tData('PHC Staff')}</div>
          <div class="admin-tab">${window.tData('Doctors')}</div>
        </div>
        <div class="admin-card">
           <div class="admin-card-header">
             <h3 class="admin-card-title">${window.tData('System Administrators')}</h3>
             <button class="btn btn-primary" style="font-size: 0.8rem; padding: 6px 12px;">${window.tData('+ Add Admin')}</button>
           </div>
           <table class="admin-table">
             <thead><tr><th>${window.tData('Name')}</th><th>${window.tData('Email')}</th><th>${window.tData('Role')}</th><th>${window.tData('Status')}</th><th>${window.tData('Last Login')}</th><th>${window.tData('Actions')}</th></tr></thead>
             <tbody>
               <tr><td>${window.tData('DRISH KALYAN Administrator')}</td><td>admin@drishkalyan.in</td><td>${window.tData('Super Admin')}</td><td><span class="admin-badge badge-green">${window.tData('Active')}</span></td><td>${window.tData('Just now')}</td><td><button class="btn btn-outline" style="padding:4px 8px;font-size:0.75rem;">${window.tData('Edit')}</button></td></tr>
             </tbody>
           </table>
        </div>
      `;
    }

    function renderTabPatients(root) {
      root.innerHTML = `
        <div class="admin-card">
           <div class="admin-card-header">
             <h3 class="admin-card-title">${window.tData('Patient Management')}</h3>
             <input type="text" class="form-input" placeholder="${window.tData('Search Patient ID...')}" style="width:250px;">
           </div>
           <table class="admin-table">
             <thead><tr><th>${window.tData('Patient ID')}</th><th>${window.tData('Age/Gender')}</th><th>${window.tData('Location (PHC)')}</th><th>${window.tData('Screenings')}</th><th>${window.tData('Risk Level')}</th><th>${window.tData('Doctor Status')}</th></tr></thead>
             <tbody>
               <tr><td>PT-2026-88A9</td><td>45 / M</td><td>${window.tData('PHC Rampur')}</td><td>2</td><td><span class="admin-badge badge-yellow">${window.tData('Moderate')}</span></td><td>${window.tData('Pending')}</td></tr>
               <tr><td>PT-2026-11B4</td><td>62 / F</td><td>${window.tData('PHC Varanasi Rural')}</td><td>1</td><td><span class="admin-badge badge-red">${window.tData('High')}</span></td><td>${window.tData('Reviewed')}</td></tr>
               <tr><td>PT-2026-99C2</td><td>38 / M</td><td>${window.tData('PHC Gorakhpur')}</td><td>3</td><td><span class="admin-badge badge-green">${window.tData('Low')}</span></td><td>-</td></tr>
             </tbody>
           </table>
        </div>
      `;
    }

    function renderTabScreenings(root) {
      root.innerHTML = `
        <div class="admin-card">
           <div class="admin-card-header">
             <h3 class="admin-card-title">${window.tData('Screening Management')}</h3>
             <div style="display:flex; gap:10px;">
               <select class="form-input" style="width:150px; padding: 6px;"><option>${window.tData('All PHCs')}</option></select>
               <select class="form-input" style="width:150px; padding: 6px;"><option>${window.tData('All DR Stages')}</option></select>
             </div>
           </div>
           <table class="admin-table">
             <thead><tr><th>${window.tData('Screening ID')}</th><th>${window.tData('Patient ID')}</th><th>${window.tData('Date')}</th><th>${window.tData('AI Prediction')}</th><th>${window.tData('Confidence')}</th><th>${window.tData('Review Status')}</th><th>${window.tData('Final Status')}</th></tr></thead>
             <tbody>
               <tr><td>SC-00123</td><td>PT-2026-88A9</td><td>${window.tData('Today')}</td><td>${window.tData('Moderate DR')}</td><td>93.6%</td><td>${window.tData('Pending')}</td><td><span class="admin-badge badge-yellow">${window.tData('Requires Review')}</span></td></tr>
               <tr><td>SC-00124</td><td>PT-2026-11B4</td><td>${window.tData('Today')}</td><td>${window.tData('Severe DR')}</td><td>98.2%</td><td>${window.tData('Reviewed')}</td><td><span class="admin-badge badge-red">${window.tData('Urgent Referral')}</span></td></tr>
               <tr><td>SC-00125</td><td>PT-2026-99C2</td><td>${window.tData('Yesterday')}</td><td>${window.tData('Normal')}</td><td>99.1%</td><td>-</td><td><span class="admin-badge badge-green">${window.tData('Normal')}</span></td></tr>
             </tbody>
           </table>
        </div>
      `;
    }

    function renderTabAI(root) {
      root.innerHTML = `
        <div class="admin-grid" style="grid-template-columns: 1fr 1fr; margin-bottom: 24px;">
          <div class="admin-card">
             <div class="admin-card-header">
               <h3 class="admin-card-title"><i data-lucide="cpu"></i> ${window.tData('Model Status')}</h3>
               <span class="admin-badge badge-green">${window.tData('Online')}</span>
             </div>
             <div style="display:flex; flex-direction:column; gap:12px; font-size: 0.9rem;">
               <div style="display:flex; justify-content:space-between;"><span>${window.tData('Current Model:')}</span> <strong>DRISH-XAI v2.1</strong></div>
               <div style="display:flex; justify-content:space-between;"><span>${window.tData('Last Updated:')}</span> <strong>Sep 10, 2026</strong></div>
               <div style="display:flex; justify-content:space-between;"><span>${window.tData('Accuracy:')}</span> <strong>94.8%</strong></div>
               <div style="display:flex; justify-content:space-between;"><span>${window.tData('Sensitivity:')}</span> <strong>92.5%</strong></div>
               <div style="display:flex; justify-content:space-between;"><span>${window.tData('Specificity:')}</span> <strong>96.1%</strong></div>
               <div style="display:flex; justify-content:space-between;"><span>${window.tData('AUC Score:')}</span> <strong>0.982</strong></div>
             </div>
          </div>
          
          <div class="admin-card">
             <div class="admin-card-header">
               <h3 class="admin-card-title"><i data-lucide="eye"></i> ${window.tData('Explainable AI Monitoring')}</h3>
             </div>
             <p style="font-size:0.875rem; color:var(--slate-500); margin-bottom:12px;">${window.tData('Active Explainability Techniques:')}</p>
             <div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:20px;">
               <span class="admin-badge badge-gray">${window.tData('Grad-CAM')}</span>
               <span class="admin-badge badge-gray">${window.tData('Heatmap Analysis')}</span>
               <span class="admin-badge badge-gray">${window.tData('Lesion Localization')}</span>
               <span class="admin-badge badge-gray">${window.tData('Confidence Score')}</span>
               <span class="admin-badge badge-gray">${window.tData('Feature Importance')}</span>
             </div>
             <div style="background:#f8fafc; padding:16px; border:1px solid var(--border-gray); border-radius:4px; font-size:0.875rem;">
               <strong style="color:var(--slate-800);">${window.tData('Sample Explainability Output:')}</strong><br>
               <span style="color:var(--slate-500);">${window.tData('Prediction:')}</span> ${window.tData('Moderate NPDR')} (93.6% Conf.)<br>
               <span style="color:var(--slate-500);">${window.tData('Affected Region:')}</span> ${window.tData('Retinal lesion detected (Hemorrhage)')}
             </div>
             <div style="margin-top: 12px; font-size: 0.75rem; color: var(--slate-400); font-style: italic;">
               ${window.tData('* AI screening results are intended to support clinical review and should not be considered a standalone medical diagnosis.')}
             </div>
          </div>
        </div>
      `;
    }

    function renderTabAnalytics(root) {
      root.innerHTML = `
        <div class="admin-card">
           <div class="admin-card-header">
             <h3 class="admin-card-title">${window.tData('Analytics & Reports')}</h3>
             <div style="display:flex; gap:10px;">
               <button class="btn btn-outline" style="padding: 6px 12px; font-size:0.8rem;">${window.tData('Export CSV')}</button>
               <button class="btn btn-outline" style="padding: 6px 12px; font-size:0.8rem;">${window.tData('Export PDF')}</button>
               <button class="btn btn-primary" style="padding: 6px 12px; font-size:0.8rem;">${window.tData('Generate Report')}</button>
             </div>
           </div>
           <div style="height: 400px; background: #f8fafc; border: 1px dashed var(--border-gray); display:flex; flex-direction:column; align-items:center; justify-content:center; color: var(--slate-400); border-radius: 4px;">
              <i data-lucide="bar-chart-2" style="width:48px;height:48px; margin-bottom:16px; opacity:0.5;"></i>
              <div>${window.tData('Comprehensive Analytics Dashboard Placeholder')}</div>
           </div>
        </div>
      `;
    }

    function renderTabNotifications(root) {
      root.innerHTML = `
        <div class="admin-card">
           <div class="admin-card-header">
             <h3 class="admin-card-title">${window.tData('Notifications Center')}</h3>
           </div>
           <div style="display:flex; flex-direction:column; gap:12px;">
             ${notificationRow('alert-triangle', window.tData('High-Risk Screening Detected at PHC Rampur'), window.tData('2 mins ago'), 'badge-red')}
             ${notificationRow('cpu', window.tData('Model DRISH-XAI v2.1 successfully deployed.'), window.tData('1 hour ago'), 'badge-green')}
             ${notificationRow('clock', window.tData('12 pending screenings exceed 24hr SLA for doctor review.'), window.tData('3 hours ago'), 'badge-yellow')}
             ${notificationRow('info', window.tData('System backup completed successfully.'), window.tData('1 day ago'), 'badge-gray')}
           </div>
        </div>
      `;
    }

    function renderTabMedia(root) {
      root.innerHTML = `
        <div class="admin-tabs">
          <div class="admin-tab active">${window.tData('Images')}</div>
          <div class="admin-tab">${window.tData('Videos')}</div>
          <div class="admin-tab">${window.tData('Documents')}</div>
        </div>
        <div class="admin-card">
           <div class="admin-card-header">
             <h3 class="admin-card-title">${window.tData('Media Library')}</h3>
             <button class="btn btn-primary" style="font-size: 0.8rem; padding: 6px 12px;"><i data-lucide="upload" style="width:14px;height:14px;margin-right:4px;"></i> ${window.tData('Upload Files')}</button>
           </div>
           <div class="admin-grid" style="grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));">
             <div style="aspect-ratio: 1; background: #f1f5f9; border-radius: 8px; display:flex; align-items:center; justify-content:center;"><i data-lucide="image" style="color:var(--slate-400);"></i></div>
             <div style="aspect-ratio: 1; background: #f1f5f9; border-radius: 8px; display:flex; align-items:center; justify-content:center;"><i data-lucide="image" style="color:var(--slate-400);"></i></div>
             <div style="aspect-ratio: 1; background: #f1f5f9; border-radius: 8px; display:flex; align-items:center; justify-content:center;"><i data-lucide="image" style="color:var(--slate-400);"></i></div>
             <div style="aspect-ratio: 1; background: #f1f5f9; border-radius: 8px; display:flex; align-items:center; justify-content:center;"><i data-lucide="image" style="color:var(--slate-400);"></i></div>
           </div>
        </div>
      `;
    }

    function renderTabContent(root) {
      root.innerHTML = `
        <div class="admin-card">
           <div class="admin-card-header">
             <h3 class="admin-card-title">${window.tData('Content / Blog Management')}</h3>
             <button class="btn btn-primary" style="font-size: 0.8rem; padding: 6px 12px;">${window.tData('+ Create Post')}</button>
           </div>
           <table class="admin-table">
             <thead><tr><th>${window.tData('Title')}</th><th>${window.tData('Category')}</th><th>${window.tData('Status')}</th><th>${window.tData('Date')}</th><th>${window.tData('Actions')}</th></tr></thead>
             <tbody>
               <tr><td>${window.tData('Understanding Explainable AI in DR Screening')}</td><td>${window.tData('Technology')}</td><td><span class="admin-badge badge-green">${window.tData('Published')}</span></td><td>Sep 12, 2026</td><td><button class="btn btn-outline" style="padding:4px 8px;font-size:0.75rem;">${window.tData('Edit')}</button></td></tr>
               <tr><td>${window.tData('Expanding Rural Healthcare Access')}</td><td>${window.tData('Impact')}</td><td><span class="admin-badge badge-yellow">${window.tData('Draft')}</span></td><td>-</td><td><button class="btn btn-outline" style="padding:4px 8px;font-size:0.75rem;">${window.tData('Edit')}</button></td></tr>
             </tbody>
           </table>
        </div>
      `;
    }

    function renderTabMonitoring(root) {
      root.innerHTML = `
        <div class="admin-grid" style="margin-bottom:24px;">
          <div class="admin-card" style="margin-bottom:0;">
             <h3 class="admin-card-title" style="margin-bottom:12px;">${window.tData('Server Status')}</h3>
             <div style="display:flex; justify-content:space-between; margin-bottom:8px;"><span>${window.tData('CPU Usage')}</span> <strong>32%</strong></div>
             <div style="display:flex; justify-content:space-between; margin-bottom:8px;"><span>${window.tData('Memory')}</span> <strong>12.4 / 32 GB</strong></div>
             <div style="display:flex; justify-content:space-between; margin-bottom:8px;"><span>${window.tData('Storage')}</span> <strong>${window.tData('48% Used')}</strong></div>
             <div style="display:flex; justify-content:space-between;"><span>${window.tData('Uptime')}</span> <strong>99.98% (45 ${window.tData('days')})</strong></div>
          </div>
          <div class="admin-card" style="margin-bottom:0;">
             <h3 class="admin-card-title" style="margin-bottom:12px;">${window.tData('API & Database')}</h3>
             <div style="display:flex; justify-content:space-between; margin-bottom:8px;"><span>${window.tData('API Availability')}</span> <span class="admin-badge badge-green">${window.tData('Online')}</span></div>
             <div style="display:flex; justify-content:space-between; margin-bottom:8px;"><span>${window.tData('Avg Response')}</span> <strong>124ms</strong></div>
             <div style="display:flex; justify-content:space-between; margin-bottom:8px;"><span>${window.tData('Database')}</span> <span class="admin-badge badge-green">${window.tData('Connected')}</span></div>
             <div style="display:flex; justify-content:space-between;"><span>${window.tData('Active Conns')}</span> <strong>34</strong></div>
          </div>
        </div>
        <div class="admin-card">
           <div class="admin-card-header">
             <h3 class="admin-card-title">${window.tData('Recent Error Logs')}</h3>
           </div>
           <table class="admin-table">
             <thead><tr><th>${window.tData('Timestamp')}</th><th>${window.tData('Service')}</th><th>${window.tData('Message')}</th><th>${window.tData('Severity')}</th></tr></thead>
             <tbody>
               <tr><td>2026-09-19 14:22</td><td>ImageProcessor</td><td>${window.tData('Failed to parse Dicom tag')}</td><td><span class="admin-badge badge-yellow">${window.tData('Warning')}</span></td></tr>
               <tr><td>2026-09-18 09:15</td><td>SyncService</td><td>${window.tData('Network timeout during batch upload')}</td><td><span class="admin-badge badge-red">${window.tData('Error')}</span></td></tr>
             </tbody>
           </table>
        </div>
      `;
    }

    function renderTabSecurity(root) {
      root.innerHTML = `
        <div class="admin-tabs">
          <div class="admin-tab active">${window.tData('Login Activity')}</div>
          <div class="admin-tab">${window.tData('Roles & Permissions')}</div>
          <div class="admin-tab">${window.tData('2FA Settings')}</div>
        </div>
        <div class="admin-card">
           <div class="admin-card-header">
             <h3 class="admin-card-title">${window.tData('Recent Login Activity')}</h3>
           </div>
           <table class="admin-table">
             <thead><tr><th>${window.tData('User')}</th><th>${window.tData('IP Address')}</th><th>${window.tData('Device')}</th><th>${window.tData('Timestamp')}</th><th>${window.tData('Status')}</th></tr></thead>
             <tbody>
               <tr><td>admin@drishkalyan.in</td><td>192.168.1.1</td><td>Windows - Chrome</td><td>${window.tData('Just now')}</td><td><span class="admin-badge badge-green">${window.tData('Success')}</span></td></tr>
               <tr><td>${window.tData('PHC-001')}</td><td>10.0.0.45</td><td>Android Tablet</td><td>${window.tData('2 hours ago')}</td><td><span class="admin-badge badge-green">${window.tData('Success')}</span></td></tr>
               <tr><td>unknown@test.com</td><td>145.22.x.x</td><td>Unknown</td><td>${window.tData('5 hours ago')}</td><td><span class="admin-badge badge-red">${window.tData('Failed')}</span></td></tr>
             </tbody>
           </table>
        </div>
      `;
    }

    function renderTabSettings(root) {
      root.innerHTML = `
        <div class="admin-tabs">
          <div class="admin-tab active">${window.tData('General')}</div>
          <div class="admin-tab">${window.tData('Email SMTP')}</div>
          <div class="admin-tab">${window.tData('Notifications')}</div>
          <div class="admin-tab">${window.tData('Maintenance')}</div>
        </div>
        <div class="admin-card">
          <h3 class="admin-card-title" style="margin-bottom:20px;">${window.tData('General Settings')}</h3>
          <div style="display:flex; flex-direction:column; gap:16px; max-width: 600px;">
             <div><label style="display:block;margin-bottom:8px;font-weight:600;font-size:0.875rem;">${window.tData('Platform Name')}</label><input type="text" class="form-input" value="DRISH KALYAN Admin"></div>
             <div><label style="display:block;margin-bottom:8px;font-weight:600;font-size:0.875rem;">${window.tData('Contact Email')}</label><input type="email" class="form-input" value="support@drishkalyan.in"></div>
             <div><label style="display:block;margin-bottom:8px;font-weight:600;font-size:0.875rem;">${window.tData('Timezone')}</label>
               <select class="form-input"><option>Asia/Kolkata (IST)</option></select>
             </div>
             <button class="btn btn-primary" style="align-self: flex-start;">${window.tData('Save Settings')}</button>
          </div>
        </div>
      `;
    }

    function renderTabBackup(root) {
      root.innerHTML = `
        <div class="admin-card">
           <div class="admin-card-header">
             <h3 class="admin-card-title">${window.tData('System Backup & Recovery')}</h3>
           </div>
           <div style="background: #f8fafc; padding: 20px; border: 1px solid var(--border-gray); border-radius: 8px; margin-bottom: 24px;">
             <h4 style="margin:0 0 12px 0; color: var(--slate-800);">${window.tData('Current Status')}</h4>
             <div style="display:flex; flex-direction:column; gap:8px; font-size:0.9rem;">
               <div><strong>${window.tData('Last Backup:')}</strong> 2026-09-19 02:00 IST</div>
               <div><strong>${window.tData('Backup Size:')}</strong> 4.2 GB</div>
               <div><strong>${window.tData('Next Scheduled:')}</strong> 2026-09-20 02:00 IST</div>
             </div>
           </div>
           <div style="display:flex; gap:16px;">
             <button class="btn btn-primary"><i data-lucide="database-backup" style="width:16px;height:16px;margin-right:6px;"></i> ${window.tData('Create Manual Backup')}</button>
             <button class="btn btn-outline"><i data-lucide="download" style="width:16px;height:16px;margin-right:6px;"></i> ${window.tData('Download Latest')}</button>
             <button class="btn btn-outline" style="color:#dc2626; border-color:#dc2626;"><i data-lucide="history" style="width:16px;height:16px;margin-right:6px;"></i> ${window.tData('Restore')}</button>
           </div>
        </div>
      `;
    }

    // --- Helpers ---
    function kpiCard(icon, title, value, badgeClass = 'badge-gray') {
      return `
        <div class="admin-card" style="padding:16px; margin-bottom:0;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
            <div style="color:var(--slate-500); font-weight:500; font-size:0.875rem;">${title}</div>
            <i data-lucide="${icon}" style="color:var(--med-teal); width:20px;height:20px;"></i>
          </div>
          <div style="font-size:1.75rem; font-weight:700; color:var(--slate-800); margin-bottom:4px;">${value}</div>
        </div>
      `;
    }

    function notificationRow(icon, message, time, badgeClass = 'badge-gray') {
      return `
        <div style="display:flex; align-items:center; gap:16px; padding:12px; background:#f8fafc; border:1px solid var(--border-gray); border-radius:6px;">
          <div class="admin-badge ${badgeClass}" style="width:32px;height:32px; display:flex; align-items:center; justify-content:center; padding:0; border-radius:50%;">
            <i data-lucide="${icon}" style="width:16px;height:16px;"></i>
          </div>
          <div style="flex:1;">
            <div style="font-size:0.9rem; color:var(--slate-800); font-weight:500;">${message}</div>
            <div style="font-size:0.75rem; color:var(--slate-500);">${time}</div>
          </div>
        </div>
      `;
    }

    // Trigger initial tab
    switchTab('dashboard');
  });
}
