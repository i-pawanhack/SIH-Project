export function renderLoginView(container, onLoginSuccess) {
  const isHi = window.getLanguage() === 'hi';
  container.innerHTML = `
    <style>
      #view-login {
        transform: none !important;
        animation: none !important;
      }
      /* Premium Healthcare Color Palette */
      :root {
        --deep-navy: var(--primary-800, #115e59);
        --med-teal: var(--primary-600, #0d9488);
        --bright-cyan: var(--primary-400, #2dd4bf);
        --soft-mint: var(--primary-50, #f0fdfa);
        --pure-white: #FFFFFF;
        --light-blue: var(--slate-50, #f8fafc);
        --text-gray: var(--slate-600, #475569);
        --border-gray: var(--slate-200, #e2e8f0);
      }

      * { box-sizing: border-box; }

      .login-wrapper {
        position: fixed;
        inset: 0;
        display: flex;
        flex-direction: column;
        font-family: 'Inter', sans-serif;
        background-color: var(--light-blue);
        overflow: hidden;
      }

      /* Animations */
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .fade-in-up {
        opacity: 0;
        animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      @keyframes scaleIn {
        from { opacity: 0; transform: scale(0.97); }
        to { opacity: 1; transform: scale(1); }
      }
      .fade-in-scale {
        opacity: 0;
        animation: scaleIn 0.5s ease-out forwards;
      }
      @keyframes subtleFloat {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-8px); }
      }
      .floating-img {
        animation: subtleFloat 6s ease-in-out infinite;
      }
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      /* Top Header */
      .top-header {
        height: 72px;
        background: var(--pure-white);
        padding: 0 32px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-shadow: 0 2px 10px rgba(8, 43, 73, 0.05);
        z-index: 100;
        flex-shrink: 0;
      }
      .header-brand {
        display: flex;
        align-items: center;
        gap: 16px;
      }
      .logo-icon {
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, var(--med-teal), var(--bright-cyan));
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        box-shadow: 0 4px 12px rgba(0, 169, 157, 0.2);
      }
      .header-titles {
        display: flex;
        flex-direction: column;
      }
      .header-title-main {
        font-family: 'Inter', 'Noto Sans Devanagari', sans-serif;
        font-size: 42px;
        font-weight: 800;
        color: var(--deep-navy);
        line-height: 1.1;
        text-align: center;
      }
      .header-title-main span:last-child {
        color: var(--med-teal);
      }
      .header-subtitle {
        font-size: 12px;
        color: var(--text-gray);
        font-weight: 500;
      }
      .header-right {
        display: flex;
        align-items: center;
        gap: 24px;
      }
      .badge {
        display: flex;
        align-items: center;
        gap: 6px;
        background: var(--soft-mint);
        color: var(--deep-navy);
        padding: 6px 14px;
        border-radius: 20px;
        font-size: 13px;
        font-weight: 700;
        border: 1px solid rgba(0, 169, 157, 0.2);
      }
      .lang-wrapper {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .lang-selector {
        border: none;
        background: transparent;
        font-family: 'Inter', sans-serif;
        font-size: 14px;
        font-weight: 600;
        color: var(--text-gray);
        cursor: pointer;
        outline: none;
      }

      /* Main Content */
      .main-content {
        flex: 1;
        display: flex;
        height: calc(100vh - 120px);
      }

      /* Left Section */
      .left-section {
        flex: 0 0 58%;
        position: relative;
        background: linear-gradient(135deg, var(--deep-navy), var(--primary-700, #0f766e));
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
      .left-section::before {
        content: "";
        position: absolute;
        top: 40px;
        right: 40px;
        width: 120px;
        height: 120px;
        background-image: radial-gradient(rgba(255, 255, 255, 0.15) 2px, transparent 2px);
        background-size: 16px 16px;
        pointer-events: none;
        z-index: 1;
      }
      .left-section::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 20%;
        width: 800px;
        height: 800px;
        background: radial-gradient(circle, rgba(45,212,191,0.15) 0%, transparent 60%);
        transform: translate(-50%, -50%);
        pointer-events: none;
        z-index: 0;
      }
      
      .hero-content {
        flex: 1;
        display: flex;
        align-items: center;
        padding: 0 40px;
        gap: 40px;
        padding-bottom: 120px; /* space for wave */
      }
      .hud-wrapper {
        position: relative;
        flex-shrink: 0;
        width: 45vmin;
        height: 45vmin;
        max-width: 480px;
        max-height: 480px;
        margin-left: -15%;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2;
      }
      .hud-wrapper::before {
        content: "";
        position: absolute;
        top: -8%; left: -8%; right: -8%; bottom: -8%;
        border-radius: 50%;
        border: 4px solid rgba(45,212,191,0.8);
        border-right-color: transparent;
        border-left-color: transparent;
        box-shadow: 0 0 15px rgba(45,212,191,0.5), inset 0 0 15px rgba(45,212,191,0.5);
        animation: spin 15s linear infinite;
        pointer-events: none;
      }
      .hud-wrapper::after {
        content: "";
        position: absolute;
        top: -15%; left: -15%; right: -15%; bottom: -15%;
        border-radius: 50%;
        border: 2px dashed rgba(45,212,191,0.4);
        animation: spin 25s linear infinite reverse;
        pointer-events: none;
      }
      .hero-image-wrapper {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        box-shadow: 0 20px 50px rgba(0,0,0,0.5);
        border: 6px solid var(--bright-cyan);
        overflow: hidden;
        background: #000;
        position: relative;
        z-index: 2;
      }
      .hero-image-wrapper::after {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: 50%;
        box-shadow: inset 0 0 30px rgba(45,212,191,0.8);
        pointer-events: none;
      }
      .hero-image-wrapper img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0.9;
        transform: scale(1.35);
        filter: hue-rotate(-160deg) saturate(2) brightness(0.9) contrast(1.2);
      }
      .hero-text {
        flex: 1;
        color: white;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      .hero-text h1 {
        font-family: 'Roboto Slab', 'Noto Sans Devanagari', serif;
        font-size: 80px;
        font-weight: 700;
        line-height: 1.1;
        margin: 0 0 16px 0;
        color: var(--soft-mint);
        display: inline-block;
      }
      .hero-text p {
        font-size: 20px;
        font-weight: bold;
        font-style: italic;
        line-height: 1.5;
        color: rgba(255,255,255,0.85);
        margin: 0;
        text-align: center;
      }

      /* Features & Wave */
      .features-container {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        background: var(--pure-white);
        padding: 24px 40px 40px 40px;
        z-index: 10;
      }
      .features-wave {
        position: absolute;
        bottom: 100%;
        left: 0;
        width: 100%;
        height: 150px;
        pointer-events: none;
      }
      .features-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 20px;
        max-width: 800px;
        margin: 0 auto;
      }
      .feature-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
      }
      .feature-icon {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: var(--soft-mint);
        color: var(--med-teal);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 12px;
        transition: transform 0.3s ease;
      }
      .feature-item:hover .feature-icon {
        transform: scale(1.1);
      }
      .feature-item h4 {
        font-size: 14px;
        font-weight: 700;
        color: var(--deep-navy);
        margin: 0 0 4px 0;
      }
      .feature-item p {
        font-size: 12px;
        color: var(--text-gray);
        line-height: 1.4;
        margin: 0;
      }

      /* Right Section (Login) */
      .right-section {
        flex: 1;
        background: var(--light-blue);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 32px;
        position: relative;
      }
      .login-card {
        width: 100%;
        max-width: 420px;
        background: var(--pure-white);
        border-radius: 16px;
        padding: 48px 40px;
        box-shadow: 0 12px 32px rgba(8, 43, 73, 0.08);
      }
      .login-card h2 {
        font-family: 'Outfit', sans-serif;
        font-size: 28px;
        font-weight: 700;
        color: var(--deep-navy);
        margin: 0 0 8px 0;
      }
      .login-prompt {
        font-size: 14px;
        color: var(--text-gray);
        margin: 0 0 32px 0;
      }

      .input-wrapper {
        position: relative;
        margin-bottom: 20px;
      }
      .input-wrapper input {
        width: 100%;
        padding: 14px 14px 14px 44px;
        border: 1.5px solid var(--border-gray);
        border-radius: 8px;
        font-size: 15px;
        color: var(--deep-navy);
        transition: all 0.2s;
        background: #FAFAFA;
      }
      .input-wrapper input:focus {
        border-color: var(--med-teal);
        background: var(--pure-white);
        box-shadow: 0 0 0 4px rgba(0, 169, 157, 0.1);
        outline: none;
      }
      .input-wrapper input::placeholder {
        color: #94A3B8;
      }
      .leading-icon {
        position: absolute;
        left: 14px;
        top: 50%;
        transform: translateY(-50%);
        color: #94A3B8;
        transition: color 0.2s;
        pointer-events: none;
      }
      .input-wrapper input:focus + .leading-icon,
      .input-wrapper input:focus ~ .leading-icon {
        color: var(--med-teal);
      }
      
      .trailing-icon-btn {
        position: absolute;
        right: 14px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        color: #94A3B8;
        cursor: pointer;
        padding: 4px;
        display: flex;
        transition: color 0.2s;
      }
      .trailing-icon-btn:hover {
        color: var(--deep-navy);
      }

      .error-msg {
        color: #ef4444;
        font-size: 13px;
        font-weight: 500;
        margin-bottom: 16px;
        display: none;
        background: #fef2f2;
        padding: 10px;
        border-radius: 6px;
        border: 1px solid #fecaca;
      }

      .submit-btn {
        width: 100%;
        padding: 14px;
        background: var(--med-teal);
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }
      .submit-btn:hover:not(:disabled) {
        background: #00968b;
        transform: translateY(-1px);
        box-shadow: 0 6px 16px rgba(0, 169, 157, 0.25);
      }
      .submit-btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }

      .card-links {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 24px;
        font-size: 14px;
      }
      .forgot-link {
        color: var(--text-gray);
        text-decoration: none;
        font-weight: 500;
        transition: color 0.2s;
      }
      .forgot-link:hover {
        color: var(--med-teal);
      }
      .register-text {
        color: var(--text-gray);
      }
      .register-text a {
        color: var(--med-teal);
        font-weight: 600;
        text-decoration: none;
      }
      .register-text a:hover {
        text-decoration: underline;
      }

      .card-divider {
        height: 1px;
        background: var(--border-gray);
        margin: 32px 0;
      }

      .help-section {
        display: flex;
        align-items: center;
        gap: 16px;
      }
      .help-icon {
        color: var(--deep-navy);
      }
      .help-title {
        font-weight: 700;
        color: var(--deep-navy);
        font-size: 14px;
        margin-bottom: 2px;
      }
      .help-desc {
        font-size: 13px;
        color: var(--text-gray);
      }

      /* Footer */
      .bottom-footer {
        height: 48px;
        background: var(--deep-navy);
        color: rgba(255, 255, 255, 0.8);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 32px;
        font-size: 13px;
        flex-shrink: 0;
        z-index: 100;
      }
      .footer-right {
        display: flex;
        gap: 24px;
      }
      .footer-right span {
        cursor: pointer;
        transition: color 0.2s;
      }
      .footer-right span:hover {
        color: var(--pure-white);
      }

      /* Accessibility Modal */
      .access-modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(15, 23, 42, 0.7);
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        backdrop-filter: blur(4px);
        opacity: 0;
        transition: opacity 0.3s;
      }
      .access-modal-overlay.active {
        display: flex;
        opacity: 1;
      }
      .access-modal-content {
        background: white;
        width: 90%;
        max-width: 640px;
        max-height: 85vh;
        border-radius: 16px;
        box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        transform: translateY(20px);
        transition: transform 0.3s;
      }
      .access-modal-overlay.active .access-modal-content {
        transform: translateY(0);
      }
      .access-modal-header {
        padding: 24px;
        border-bottom: 1px solid var(--border-gray);
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: var(--pure-white);
      }
      .access-modal-header h3 {
        margin: 0;
        color: var(--deep-navy);
        font-size: 20px;
        font-family: 'Outfit', sans-serif;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .access-modal-close {
        background: none;
        border: none;
        cursor: pointer;
        color: var(--text-gray);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 4px;
        border-radius: 6px;
      }
      .access-modal-close:hover {
        background: var(--light-blue);
        color: #ef4444;
      }
      .access-modal-body {
        padding: 24px;
        overflow-y: auto;
        color: var(--text-gray);
        font-size: 14.5px;
        line-height: 1.6;
      }
      .access-modal-body h4 {
        color: var(--med-teal);
        font-size: 16px;
        margin: 24px 0 8px 0;
        font-weight: 700;
      }
      .access-modal-body h4:first-child {
        margin-top: 0;
      }
      .access-modal-body ul {
        padding-left: 20px;
        margin-bottom: 16px;
      }
      .access-modal-body li {
        margin-bottom: 6px;
      }

      /* Responsive */
      @media (max-width: 1024px) {
        .left-section { flex: 0 0 50%; }
        .hero-text h1 { font-size: 36px; }
        .features-grid { gap: 12px; }
      }
      @media (max-width: 768px) {
        .login-wrapper { overflow: auto; display: block; }
        .top-header { position: sticky; top: 0; padding: 0 16px; }
        .badge { display: none; }
        .main-content { flex-direction: column; height: auto; }
        .left-section { flex: none; width: 100%; height: auto; padding-top: 40px; }
        .hero-content { padding: 0 24px 32px 24px; flex-direction: column; text-align: center; }
        .hero-image-wrapper { margin-left: 0; width: 100%; height: 100%; }
        .hud-wrapper { margin-left: 0; width: 240px; height: 240px; margin-bottom: 32px; }
        .features-container { position: relative; padding: 32px 24px; }
        .features-wave { display: none; }
        .features-grid { grid-template-columns: repeat(2, 1fr); gap: 24px; }
        .right-section { padding: 40px 24px; }
        .login-card { padding: 32px 24px; }
        .bottom-footer { flex-direction: column; gap: 12px; height: auto; padding: 24px; text-align: center; }
      }
    </style>

    <div class="login-wrapper">
      
      <!-- HEADER -->
      <header class="top-header">
        <div class="header-brand">
          <img src="src/logo.jpeg" alt="Drish Kalyan Logo" style="width: 48px; height: 48px; object-fit: cover; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 169, 157, 0.2);">
          <div class="header-titles">
            <div class="header-title-main" style="text-align: center;">
              <span data-i18n="app.title">${window.t('app.title')}</span> 
            </div>
            <div class="header-subtitle" data-i18n="login.subtitle">${window.t('login.subtitle')}</div>
          </div>
        </div>
        <div class="header-right">
          <div class="badge">
            <i data-lucide="sparkles" style="width:14px;height:14px"></i>
            <span data-i18n="login.badge">${window.t('login.badge')}</span>
          </div>
          <div class="lang-wrapper">
            <i data-lucide="globe" style="width:16px;height:16px;color:var(--text-gray);"></i>
            <button class="lang-selector" id="login-lang-btn" style="display:flex; align-items:center; gap:4px; cursor:pointer;">
              ${window.getLanguage() === 'en' ? 'हिन्दी' : 'English'}
            </button>
          </div>
        </div>
      </header>

      <!-- MAIN -->
      <main class="main-content">
        
        <!-- LEFT SECTION -->
        <div class="left-section">
          <div class="hero-content">
            <div class="hud-wrapper floating-img">
              <div class="hero-image-wrapper">
                <img src="src/teal_glowing_eye.jpg" alt="AI Glowing Eye" onerror="this.src='assets/retinal_hud.jpg'">
              </div>
            </div>
            <div class="hero-text fade-in-up">
              <h1 id="hero-typing-title"></h1>
              <p id="hero-typing-subtitle"></p>
            </div>
          </div>

          <div class="features-container">
            <svg class="features-wave" viewBox="0 0 1440 250" preserveAspectRatio="none">
              <path fill="rgba(255,255,255,0.15)" d="M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,165.3C672,160,768,96,864,74.7C960,53,1056,75,1152,90.7C1248,107,1344,117,1392,122.7L1440,128L1440,250L1392,250C1344,250,1248,250,1152,250C1056,250,960,250,864,250C768,250,672,250,576,250C480,250,384,250,288,250C192,250,96,250,48,250L0,250Z"></path>
              <path fill="rgba(255,255,255,0.3)" d="M0,224L48,197.3C96,171,192,117,288,112C384,107,480,149,576,165.3C672,181,768,171,864,149.3C960,128,1056,96,1152,96C1248,96,1344,128,1392,144L1440,160L1440,250L1392,250C1344,250,1248,250,1152,250C1056,250,960,250,864,250C768,250,672,250,576,250C480,250,384,250,288,250C192,250,96,250,48,250L0,250Z"></path>
              <path fill="var(--pure-white)" d="M0,128L48,144C96,160,192,192,288,192C384,192,480,160,576,133.3C672,107,768,85,864,96C960,107,1056,149,1152,160C1248,171,1344,149,1392,138.7L1440,128L1440,250L1392,250C1344,250,1248,250,1152,250C1056,250,960,250,864,250C768,250,672,250,576,250C480,250,384,250,288,250C192,250,96,250,48,250L0,250Z"></path>
            </svg>
            <div class="features-grid">
              
              <div class="feature-item fade-in-up" style="animation-delay: 0.1s">
                <div class="feature-icon"><i data-lucide="eye" style="width:24px;height:24px"></i></div>
                <h4 data-i18n="login.info1.title">${window.t('login.info1.title')}</h4>
                <p data-i18n="login.info1.desc">${window.t('login.info1.desc')}</p>
              </div>
              
              <div class="feature-item fade-in-up" style="animation-delay: 0.2s">
                <div class="feature-icon"><i data-lucide="user-plus" style="width:24px;height:24px"></i></div>
                <h4 data-i18n="login.info2.title">${window.t('login.info2.title')}</h4>
                <p data-i18n="login.info2.desc">${window.t('login.info2.desc')}</p>
              </div>
              
              <div class="feature-item fade-in-up" style="animation-delay: 0.3s">
                <div class="feature-icon"><i data-lucide="shield-check" style="width:24px;height:24px"></i></div>
                <h4 data-i18n="login.info3.title">${window.t('login.info3.title')}</h4>
                <p data-i18n="login.info3.desc">${window.t('login.info3.desc')}</p>
              </div>
              
              <div class="feature-item fade-in-up" style="animation-delay: 0.4s">
                <div class="feature-icon"><i data-lucide="users" style="width:24px;height:24px"></i></div>
                <h4 data-i18n="login.info4.title">${window.t('login.info4.title')}</h4>
                <p data-i18n="login.info4.desc">${window.t('login.info4.desc')}</p>
              </div>

            </div>
          </div>
        </div>

        <!-- RIGHT SECTION -->
        <div class="right-section">
          <div class="login-card fade-in-scale">
            
            <h2 data-i18n="login.welcome">${window.t('login.welcome')}</h2>
            <p class="login-prompt" data-i18n="login.prompt">${window.t('login.prompt')}</p>
            
            <form id="login-form">
              <div class="input-wrapper">
                <i data-lucide="building" class="leading-icon" style="width:18px;height:18px"></i>
                <input type="text" id="phc-id" data-i18n="login.phcIdPlaceholder" placeholder="${window.t('login.phcIdPlaceholder')}" required autocomplete="username">
              </div>
              
              <div class="input-wrapper">
                <i data-lucide="lock" class="leading-icon" style="width:18px;height:18px"></i>
                <input type="password" id="password" data-i18n="login.passwordPlaceholder" placeholder="${window.t('login.passwordPlaceholder')}" required autocomplete="current-password">
                <button type="button" class="trailing-icon-btn" id="toggle-password" aria-label="Toggle password visibility">
                  <i data-lucide="eye" style="width:18px;height:18px"></i>
                </button>
              </div>

              <div id="login-error" class="error-msg"></div>

              <button type="submit" class="submit-btn" id="login-submit-btn">
                <span data-i18n="login.signIn">${window.t('login.signIn')}</span>
              </button>
              
              <div class="card-links">
                <a href="#" class="forgot-link" data-i18n="login.forgotPassword">${window.t('login.forgotPassword')}</a>
              </div>
            </form>

            <div class="card-divider"></div>
            
            <div class="help-section">
              <div class="help-icon"><i data-lucide="headset" style="width:28px;height:28px"></i></div>
              <div>
                <div class="help-title" data-i18n="login.security.title">${window.t('login.security.title')}</div>
                <div class="help-desc" data-i18n="login.security.desc">${window.t('login.security.desc')}</div>
              </div>
            </div>
            
          </div>
        </div>

      </main>

      <!-- FOOTER -->
      <footer class="bottom-footer">
        <div data-i18n="login.footer.left">${window.t('login.footer.left')}</div>
        <div class="footer-right">
          <span data-i18n="login.terms" id="login-terms-btn" style="cursor: pointer; transition: color 0.2s;" onmouseover="this.style.color='var(--pure-white)'" onmouseout="this.style.color='rgba(255, 255, 255, 0.8)'">${window.t('login.terms')}</span>
          <span data-i18n="login.privacy" id="login-privacy-btn" style="cursor: pointer; transition: color 0.2s;" onmouseover="this.style.color='var(--pure-white)'" onmouseout="this.style.color='rgba(255, 255, 255, 0.8)'">${window.t('login.privacy')}</span>
          <span data-i18n="login.accessibility" id="login-accessibility-btn" style="cursor: pointer; transition: color 0.2s;" onmouseover="this.style.color='var(--pure-white)'" onmouseout="this.style.color='rgba(255, 255, 255, 0.8)'">${window.t('login.accessibility')}</span>
          <span data-i18n="login.contact" id="login-contact-btn" style="cursor: pointer; transition: color 0.2s;" onmouseover="this.style.color='var(--pure-white)'" onmouseout="this.style.color='rgba(255, 255, 255, 0.8)'">${window.t('login.contact')}</span>
        </div>
      </footer>
      
      <!-- Accessibility Modal -->
      <div class="access-modal-overlay" id="access-modal">
        <div class="access-modal-content">
          <div class="access-modal-header">
            <h3><i data-lucide="accessibility" style="width:20px;height:20px;"></i> ${isHi ? 'व्यापक स्वास्थ्य सेवा पहुँच के लिए डिज़ाइन किया गया एआई' : 'Healthcare AI Designed for Wider Access'}</h3>
            <button class="access-modal-close" id="access-modal-close">
              <i data-lucide="x" style="width:20px;height:20px;"></i>
            </button>
          </div>
          <div class="access-modal-body">
            ${isHi ? `
              <p>हमारा उद्देश्य एआई-सहायता प्राप्त रेटिनल स्क्रीनिंग को उन परिवेशों में सुगम और व्यावहारिक बनाना है जहां विशेषज्ञ स्वास्थ्य संसाधन सीमित हो सकते हैं।</p>
              <h4>1. सरल उपयोगकर्ता इंटरफ़ेस</h4>
              <p>प्लेटफ़ॉर्म प्रदान करता है:</p>
              <ul>
                <li>स्पष्ट नेविगेशन।</li>
                <li>सरल शब्दावली।</li>
                <li>बड़े और पढ़ने में आसान परिणाम क्षेत्र।</li>
                <li>संरचित स्क्रीनिंग जानकारी।</li>
                <li>स्पष्ट कार्रवाई सिफारिशें।</li>
              </ul>
              <h4>2. स्वास्थ्य कार्यकर्ताओं के अनुकूल</h4>
              <p>सिस्टम इस प्रकार तैयार किया गया है कि स्क्रीनिंग वर्कफ़्लो समझने के लिए जटिल गणितीय समझ की आवश्यकता नहीं है। इंटरफ़ेस स्पष्ट संचार करता है:<br><strong>छवि गुणवत्ता &rarr; डीआर परिणाम &rarr; साक्ष्य &rarr; आत्मविश्वास &rarr; ट्राइएज</strong></p>
              <h4>3. स्पष्ट ट्राइएज स्थितियां</h4>
              <p>महत्वपूर्ण स्थितियां स्पष्ट रूप से दृश्यमान हैं: <strong>स्वचालित स्क्रीनिंग, मानव समीक्षा, पुनर्प्राप्ति आवश्यक</strong>।</p>
              <h4>4. व्याख्यात्मक एआई (Explainable AI)</h4>
              <p>केवल एआई परिणाम देने के बजाय, प्लेटफ़ॉर्म घाव के स्थान, फीचर योगदान और रेटिना संरचना साक्ष्य प्रस्तुत करता है।</p>
              <h4>5. ग्रामीण स्वास्थ्य संदर्भ</h4>
              <p>यह वास्तुकला संसाधन-सीमित वातावरण को ध्यान में रखकर बनाई गई है, जिसमें कम बैंडविड्थ और ऑफलाइन क्षमताएं शामिल हैं।</p>
            ` : `
              <p>Our objective is to make AI-assisted retinal screening understandable and usable in environments where specialist healthcare resources may be limited.</p>
              <h4>1. Simple User Interface</h4>
              <p>The platform should provide: clear navigation, simple terminology, large readable result areas, structured screening information, and clear action recommendations.</p>
              <h4>2. Healthcare Worker Friendly</h4>
              <p>The system is designed so that users do not need to understand the underlying AI mathematics to understand the screening workflow.</p>
              <h4>3. Clear Triage States</h4>
              <p>Important system states should be visually and textually identifiable: <strong>AUTO_SCREEN, HUMAN_REVIEW, RECAPTURE_REQUIRED</strong>.</p>
              <h4>4. Explainable AI</h4>
              <p>Instead of presenting only an AI-generated class, the platform provides supporting computational evidence such as lesion locations and retinal structure information.</p>
              <h4>5. Rural Healthcare Context</h4>
              <p>The architecture is designed with resource-constrained environments in mind.</p>
            `}
          </div>
        </div>
      </div>

      <!-- Terms Modal -->
      <div class="access-modal-overlay" id="terms-modal">
        <div class="access-modal-content">
          <div class="access-modal-header">
            <h3><i data-lucide="file-text" style="width:20px;height:20px;"></i> ${isHi ? "नियम और शर्तें" : "Terms and Conditions"}</h3>
            <button class="access-modal-close" id="terms-modal-close">
              <i data-lucide="x" style="width:20px;height:20px;"></i>
            </button>
          </div>
          <div class="access-modal-body">
            
            <h4>1. About the Platform</h4>
            <p>This platform is an AI-assisted Diabetic Retinopathy (DR) screening and triage research prototype developed under SIH26038 – Explainable AI for Diabetic Retinopathy Screening in Rural India.</p>
            <p>The platform uses retinal image processing, computer vision, machine learning, explainable AI, uncertainty estimation, and automated reporting to assist healthcare screening workflows.</p>
            
            <h4>2. Intended Purpose</h4>
            <p>The platform is intended to:</p>
            <ul>
              <li>Assess retinal/fundus image quality.</li>
              <li>Enhance retinal images for computational analysis.</li>
              <li>Analyse retinal structures.</li>
              <li>Detect potential retinal lesions.</li>
              <li>Estimate DR severity from Grade 0 to Grade 4.</li>
              <li>Provide explainable evidence associated with an AI prediction.</li>
              <li>Provide confidence and uncertainty information.</li>
              <li>Generate a structured screening report.</li>
              <li>Support screening triage and referral workflows.</li>
            </ul>

            <h4>3. Medical Disclaimer</h4>
            <p>The platform does not provide a final medical diagnosis.</p>
            <p>AI-generated results are intended only as decision-support information and must not replace examination, diagnosis, or treatment decisions made by a qualified ophthalmologist or other appropriate healthcare professional.</p>

            <h4>4. Image Quality Assessment</h4>
            <p>Every submitted image may undergo an image-quality assessment before DR analysis.</p>
            <p>If an image is considered insufficient or ungradable, the platform may return:<br><strong>RECAPTURE_REQUIRED</strong></p>
            <p>In such cases, the system should not be interpreted as having diagnosed the patient.</p>

            <h4>5. AI Screening & Triage</h4>
            <p>The platform may assign a workflow status such as:</p>
            <ul>
              <li><strong>AUTO_SCREEN</strong> — suitable for automated screening workflow under the configured system criteria.</li>
              <li><strong>HUMAN_REVIEW</strong> — requires review by an appropriately qualified healthcare professional.</li>
              <li><strong>RECAPTURE_REQUIRED</strong> — image quality is insufficient for reliable analysis.</li>
            </ul>
            <p>These statuses represent system workflow decisions, not independent medical diagnoses.</p>

            <h4>6. DR Severity</h4>
            <p>The system is designed to work with five DR severity categories:</p>
            <ul>
              <li>Grade 0 — No DR</li>
              <li>Grade 1 — Mild DR</li>
              <li>Grade 2 — Moderate DR</li>
              <li>Grade 3 — Severe DR</li>
              <li>Grade 4 — Proliferative DR</li>
            </ul>
            <p>The predicted grade should always be interpreted together with the system's confidence, uncertainty, image quality, and explainability information.</p>

            <h4>7. Explainability</h4>
            <p>The platform may provide:</p>
            <ul>
              <li>Feature contribution information.</li>
              <li>Lesion-grounded evidence.</li>
              <li>Retinal structure information.</li>
              <li>Optic-disc/fovea annotations.</li>
              <li>Evidence visualizations.</li>
            </ul>
            <p>These visualizations explain aspects of the model's computational reasoning; they do not constitute clinical proof of disease.</p>

            <h4>8. Uncertainty & Human Review</h4>
            <p>The platform incorporates confidence, prediction margin, novelty/uncertainty indicators, and image-quality information.</p>
            <p>Cases exceeding configured review criteria may be routed to:<br><strong>HUMAN_REVIEW</strong></p>
            <p>A human reviewer should make the final clinical assessment.</p>

            <h4>9. User Responsibilities</h4>
            <p>Users are responsible for:</p>
            <ul>
              <li>Providing appropriate retinal images.</li>
              <li>Using compatible imaging equipment.</li>
              <li>Ensuring images correspond to the correct screening case.</li>
              <li>Following image recapture instructions.</li>
              <li>Protecting patient information.</li>
              <li>Referring appropriate cases to qualified healthcare professionals.</li>
            </ul>

            <h4>10. No Guarantee of Clinical Accuracy</h4>
            <p>System performance can vary depending on:</p>
            <ul>
              <li>Image quality.</li>
              <li>Camera/device characteristics.</li>
              <li>Patient population.</li>
              <li>Disease distribution.</li>
              <li>Imaging conditions.</li>
              <li>Dataset/domain differences.</li>
            </ul>
            <p>The current prototype has not undergone external clinical validation and should not be treated as clinically validated software.</p>

            <h4>11. Research Prototype</h4>
            <p>This software has been developed for research, demonstration, and SIH purposes.</p>
            <p>It has not been approved or cleared by clinical regulatory authorities such as CDSCO, US FDA, or CE-Mark.</p>

            <h4>12. Emergency Situations</h4>
            <p>This platform is not intended for emergency medical decision-making.</p>
            <p>For urgent vision-related symptoms or medical emergencies, users should seek appropriate professional medical care.</p>

            <h4>13. Changes to the Platform</h4>
            <p>Features, algorithms, datasets, thresholds, interfaces, and workflows may be modified as part of future research and development.</p>

            <h4>14. Acceptance</h4>
            <p>By using this platform, users acknowledge that they understand its research and decision-support purpose and agree to use its outputs responsibly.</p>
          </div>
        </div>
      </div>

      <!-- Privacy Policy Modal -->
      <div class="access-modal-overlay" id="privacy-modal">
        <div class="access-modal-content">
          <div class="access-modal-header">
            <h3><i data-lucide="shield" style="width:20px;height:20px;"></i> ${isHi ? "गोपनीयता नीति" : "Privacy Policy"}</h3>
            <button class="access-modal-close" id="privacy-modal-close">
              <i data-lucide="x" style="width:20px;height:20px;"></i>
            </button>
          </div>
          <div class="access-modal-body">

            <h4>1. Purpose</h4>
            <p>This Privacy Policy explains how information may be handled when using the AI-assisted retinal screening platform.</p>

            <h4>2. Information That May Be Processed</h4>
            <p>Depending on deployment configuration, the system may process:</p>
            <ul>
              <li>Fundus/retinal images.</li>
              <li>Patient or case identifiers.</li>
              <li>Screening metadata.</li>
              <li>Image-quality results.</li>
              <li>DR prediction.</li>
              <li>Lesion findings.</li>
              <li>Retinal structure information.</li>
              <li>Confidence scores.</li>
              <li>Uncertainty indicators.</li>
              <li>Explainability information.</li>
              <li>Triage/referral status.</li>
              <li>Generated screening reports.</li>
            </ul>

            <h4>3. Retinal Images Are Sensitive Information</h4>
            <p>Retinal images can contain sensitive healthcare information and should be handled accordingly.</p>
            <p>Users and deployment administrators should ensure that images are collected, transmitted, stored, and accessed according to applicable institutional policies and laws.</p>

            <h4>4. Data Minimization</h4>
            <p>Only information necessary for the intended screening workflow should be collected.</p>
            <p>Avoid unnecessarily collecting:</p>
            <ul>
              <li>Personal identifiers.</li>
              <li>Contact information.</li>
              <li>Government identification numbers.</li>
              <li>Unrelated medical information.</li>
            </ul>

            <h4>5. Use of Data</h4>
            <p>Information processed by the platform may be used for:</p>
            <ul>
              <li>Retinal image analysis.</li>
              <li>DR screening.</li>
              <li>Lesion analysis.</li>
              <li>Explainable prediction.</li>
              <li>Uncertainty assessment.</li>
              <li>Screening report generation.</li>
              <li>Human-review workflows.</li>
              <li>System testing and research, where appropriately authorized.</li>
            </ul>

            <h4>6. Data Storage</h4>
            <p>Storage depends on the specific deployment configuration.</p>
            <p>The platform documentation should not be interpreted as guaranteeing permanent storage, automatic deletion, or zero-storage processing unless that behaviour is actually implemented in the deployed system.</p>

            <h4>7. Data Security</h4>
            <p>Deployment administrators should implement appropriate safeguards, including:</p>
            <ul>
              <li>Authentication.</li>
              <li>Role-based access.</li>
              <li>Secure communication.</li>
              <li>Controlled database access.</li>
              <li>Secure image storage.</li>
              <li>Access logging where applicable.</li>
              <li>Protection against unauthorized downloads.</li>
            </ul>

            <h4>8. Patient Identification</h4>
            <p>Patient-identifiable information should not be unnecessarily displayed in:</p>
            <ul>
              <li>Public URLs.</li>
              <li>Screenshots.</li>
              <li>Logs.</li>
              <li>Demonstration videos.</li>
              <li>Public repositories.</li>
              <li>Publicly shared reports.</li>
            </ul>

            <h4>9. Third-Party Services</h4>
            <p>If the deployed version uses external cloud services, APIs, storage providers, or healthcare systems, their respective privacy policies and data-processing terms may also apply.</p>

            <h4>10. Research & Dataset Data</h4>
            <p>Public research datasets used during development may have their own licenses, terms of use, and restrictions. Dataset-specific requirements must be followed separately.</p>

            <h4>11. User Responsibility</h4>
            <p>Organizations deploying the platform are responsible for determining:</p>
            <ul>
              <li>What patient information is collected.</li>
              <li>Where it is stored.</li>
              <li>Who can access it.</li>
              <li>How long it is retained.</li>
              <li>When it is deleted.</li>
              <li>Which healthcare/privacy regulations apply to their deployment.</li>
            </ul>

            <h4>12. Privacy by Design</h4>
            <p>The platform is intended to support a workflow where sensitive patient information is minimized and access is restricted to authorized users.</p>
          </div>
        </div>
      </div>

      <!-- Contact Modal -->
      <div class="access-modal-overlay" id="contact-modal">
        <div class="access-modal-content">
          <div class="access-modal-header">
            <h3><i data-lucide="mail" style="width:20px;height:20px;"></i> ${isHi ? "संपर्क करें" : "Contact Us"}</h3>
            <button class="access-modal-close" id="contact-modal-close">
              <i data-lucide="x" style="width:20px;height:20px;"></i>
            </button>
          </div>
          <div class="access-modal-body">
            <p><strong>Contact Team Synapse</strong></p>
            <p>Explainable AI for Diabetic Retinopathy Screening in Rural India</p>
            <p><strong>TEAM SYNAPSE</strong><br>SIH 2026 | SIH26038</p>
            <p>We welcome technical discussions, academic collaboration, research discussions, and opportunities related to AI-assisted retinal screening.</p>
            <h4>Project Information</h4>
            <ul>
              <li><strong>Problem Statement:</strong> Explainable AI for Diabetic Retinopathy Screening in Rural India</li>
              <li><strong>Problem Statement ID:</strong> SIH26038</li>
              <li><strong>Team:</strong> TEAM SYNAPSE</li>
              <li><strong>Team Lead:</strong> Ayush Bhalla</li>
              <li><strong>Platform:</strong> AI-Assisted Retinal Screening & Triage Prototype</li>
            </ul>

            <h4>Contact</h4>
            <ul>
              <li><strong>Email:</strong> [official team/project email]</li>
              <li><strong>GitHub:</strong> [project GitHub link]</li>
              <li><strong>LinkedIn:</strong> [team/project LinkedIn link]</li>
            </ul>

            <h4>Medical Queries</h4>
            <p>For medical diagnosis, treatment, or patient-specific medical advice, please consult a qualified ophthalmologist or appropriate healthcare professional. The platform is not a substitute for professional medical care.</p>
          </div>
        </div>
      </div>
    </div>
  `;

  if (window.lucide) {
    window.lucide.createIcons();
  }

  const titleEl = container.querySelector('#hero-typing-title');
  const subtitleEl = container.querySelector('#hero-typing-subtitle');
  
  if (titleEl && subtitleEl) {
    if (window._typingInterval) clearInterval(window._typingInterval);
    window._typewriterActive = (window._typewriterActive || 0) + 1;
    const currentRun = window._typewriterActive;
    
    const sequences = [
      { title: "DRISH KALYAN", subtitle: "Har Nazar, Hamari Zimmedari" },
      { title: "दृश कल्याण", subtitle: "हर नज़र, हमारी ज़िम्मेदारी" }
    ];
    
    let seqIndex = 0;
    
    async function runTypeWriter() {
      while(window._typewriterActive === currentRun) {
        const current = sequences[seqIndex];
        
        titleEl.textContent = '';
        subtitleEl.textContent = '';
        
        // 1. Type Title
        titleEl.style.borderRight = '4px solid var(--soft-mint)';
        titleEl.style.paddingRight = '8px';
        subtitleEl.style.borderRight = 'none';
        
        for (let i = 0; i <= current.title.length; i++) {
          if (window._typewriterActive !== currentRun) return;
          titleEl.textContent = current.title.substring(0, i);
          await new Promise(r => setTimeout(r, 100));
        }
        
        // 2. Type Subtitle
        titleEl.style.borderRight = 'none';
        titleEl.style.paddingRight = '0';
        subtitleEl.style.borderRight = '3px solid rgba(255,255,255,0.85)';
        subtitleEl.style.paddingRight = '6px';
        
        for (let i = 0; i <= current.subtitle.length; i++) {
          if (window._typewriterActive !== currentRun) return;
          subtitleEl.textContent = current.subtitle.substring(0, i);
          await new Promise(r => setTimeout(r, 50));
        }
        
        // 3. Pause
        subtitleEl.style.borderRight = 'none';
        subtitleEl.style.paddingRight = '0';
        await new Promise(r => setTimeout(r, 3000));
        if (window._typewriterActive !== currentRun) return;
        
        // 4. Erase Subtitle
        subtitleEl.style.borderRight = '3px solid rgba(255,255,255,0.85)';
        subtitleEl.style.paddingRight = '6px';
        for (let i = current.subtitle.length; i >= 0; i--) {
          if (window._typewriterActive !== currentRun) return;
          subtitleEl.textContent = current.subtitle.substring(0, i);
          await new Promise(r => setTimeout(r, 30));
        }
        
        // 5. Erase Title
        subtitleEl.style.borderRight = 'none';
        subtitleEl.style.paddingRight = '0';
        titleEl.style.borderRight = '4px solid var(--soft-mint)';
        titleEl.style.paddingRight = '8px';
        
        for (let i = current.title.length; i >= 0; i--) {
          if (window._typewriterActive !== currentRun) return;
          titleEl.textContent = current.title.substring(0, i);
          await new Promise(r => setTimeout(r, 40));
        }
        
        // 6. Next sequence
        seqIndex = (seqIndex + 1) % sequences.length;
        
        titleEl.style.borderRight = 'none';
        titleEl.style.paddingRight = '0';
        await new Promise(r => setTimeout(r, 500));
      }
    }
    
    runTypeWriter();
  }

  const langBtn = document.getElementById('login-lang-btn');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      const newLang = window.getLanguage() === 'en' ? 'hi' : 'en';
      window.setLanguage(newLang);
      langBtn.textContent = newLang === 'en' ? 'हिन्दी' : 'English';
    });
  }

  const toggleBtn = document.getElementById('toggle-password');
  const passwordInput = document.getElementById('password');


  // Re-render on language change
  const onLangChange = () => {
    renderLoginView(container, onLoginSuccess);
  };
  window.addEventListener('languageChanged', onLangChange, { once: true });

  if (toggleBtn && passwordInput) {
    toggleBtn.addEventListener('click', () => {
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.innerHTML = '<i data-lucide="eye-off" style="width:18px;height:18px"></i>';
      } else {
        passwordInput.type = 'password';
        toggleBtn.innerHTML = '<i data-lucide="eye" style="width:18px;height:18px"></i>';
      }
      if (window.lucide) window.lucide.createIcons();
    });
  }

  const form = document.getElementById('login-form');
  const phcIdInput = document.getElementById('phc-id');
  const errorDiv = document.getElementById('login-error');
  const submitBtn = document.getElementById('login-submit-btn');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    errorDiv.style.display = 'none';
    
    // Loading state
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i data-lucide="loader-2" class="spin" style="width:18px;height:18px;animation: spin 1s linear infinite;"></i>';
    submitBtn.disabled = true;
    if (window.lucide) window.lucide.createIcons();
    
    const phcId = phcIdInput.value.trim();
    const password = passwordInput.value;

    import('../services/storageService.js').then(({ StorageService }) => {
      // Simulate slight network delay for better UX
      setTimeout(() => {
        const adminResult = StorageService.verifyAdminLogin(phcId, password);
        if (adminResult.success) {
          onLoginSuccess('admin');
        } else {
          const result = StorageService.verifyLogin(phcId, password);
          if (result.success) {
            onLoginSuccess('phc');
          } else {
            errorDiv.textContent = result.message;
            errorDiv.style.display = 'block';
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
          }
        }
      }, 500);
    });
  });

  const setupModal = (btnId, modalId, closeBtnId) => {
    const btn = document.getElementById(btnId);
    const modal = document.getElementById(modalId);
    const closeBtn = document.getElementById(closeBtnId);

    if (btn && modal && closeBtn) {
      btn.addEventListener('click', () => {
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('active'), 10);
      });

      closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        setTimeout(() => modal.style.display = 'none', 300);
      });

      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
          setTimeout(() => modal.style.display = 'none', 300);
        }
      });
    }
  };

  setupModal('login-accessibility-btn', 'access-modal', 'access-modal-close');
  setupModal('login-terms-btn', 'terms-modal', 'terms-modal-close');
  setupModal('login-privacy-btn', 'privacy-modal', 'privacy-modal-close');
  setupModal('login-contact-btn', 'contact-modal', 'contact-modal-close');
}
