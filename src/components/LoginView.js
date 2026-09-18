export function renderLoginView(container, onLoginSuccess) {
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
        font-family: 'Outfit', sans-serif;
        font-size: 24px;
        font-weight: 800;
        color: var(--deep-navy);
        line-height: 1.1;
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
      
      .hero-content {
        flex: 1;
        display: flex;
        align-items: center;
        padding: 0 40px;
        gap: 40px;
        padding-bottom: 120px; /* space for wave */
      }
      .hero-image-wrapper {
        flex-shrink: 0;
        width: 45vmin;
        height: 45vmin;
        max-width: 480px;
        max-height: 480px;
        border-radius: 50%;
        margin-left: -15%;
        box-shadow: 0 20px 50px rgba(0,0,0,0.4);
        border: 6px solid rgba(255,255,255,0.05);
        overflow: hidden;
        background: #000;
      }
      .hero-image-wrapper img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0.9;
        transform: scale(1.35);
      }
      .hero-text {
        flex: 1;
        color: white;
      }
      .hero-text h1 {
        font-family: 'Outfit', sans-serif;
        font-size: 46px;
        font-weight: 700;
        line-height: 1.2;
        margin: 0 0 16px 0;
        color: var(--soft-mint);
      }
      .hero-text p {
        font-size: 18px;
        line-height: 1.5;
        color: rgba(255,255,255,0.85);
        margin: 0;
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
        height: 80px;
        fill: var(--pure-white);
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
        .hero-image-wrapper { margin-left: 0; width: 240px; height: 240px; margin-bottom: 32px; }
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
          <div class="logo-icon"><i data-lucide="eye" style="width:22px;height:22px"></i></div>
          <div class="header-titles">
            <div class="header-title-main">
              <span data-i18n="login.title1">${window.t('login.title1')}</span> 
              <span data-i18n="login.title2">${window.t('login.title2')}</span>
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
            <select class="lang-selector" id="login-lang-select">
              <option value="en" ${window.getLanguage() === 'en' ? 'selected' : ''}>English</option>
              <option value="hi" ${window.getLanguage() === 'hi' ? 'selected' : ''}>हिन्दी</option>
            </select>
          </div>
        </div>
      </header>

      <!-- MAIN -->
      <main class="main-content">
        
        <!-- LEFT SECTION -->
        <div class="left-section">
          <div class="hero-content">
            <div class="hero-image-wrapper floating-img">
              <img src="src/teal_glowing_eye.jpg" alt="AI Glowing Eye" onerror="this.src='assets/retinal_hud.jpg'">
            </div>
            <div class="hero-text fade-in-up">
              <h1 data-i18n="login.info1.title">${window.t('login.info1.title')}</h1>
              <p data-i18n="login.info1.desc">${window.t('login.info1.desc')}</p>
            </div>
          </div>

          <div class="features-container">
            <svg class="features-wave" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,120 C480,0 960,120 1440,40 L1440,120 L0,120 Z"></path>
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
                <span class="register-text">New User? <a href="#">Register</a></span>
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
          <span>Terms &amp; Conditions</span>
          <span>Privacy Policy</span>
          <span>Accessibility</span>
          <span>Contact Us</span>
        </div>
      </footer>
      
    </div>
  `;

  if (window.lucide) {
    window.lucide.createIcons();
  }

  const langSelect = document.getElementById('login-lang-select');
  if (langSelect) {
    langSelect.addEventListener('change', (e) => {
      window.setLanguage(e.target.value);
    });
  }

  const toggleBtn = document.getElementById('toggle-password');
  const passwordInput = document.getElementById('password');

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
        const result = StorageService.verifyLogin(phcId, password);
        if (result.success) {
          onLoginSuccess();
        } else {
          errorDiv.textContent = result.message;
          errorDiv.style.display = 'block';
          submitBtn.innerHTML = originalBtnText;
          submitBtn.disabled = false;
        }
      }, 500);
    });
  });
}
