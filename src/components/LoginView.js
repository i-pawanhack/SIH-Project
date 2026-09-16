export function renderLoginView(container, onLoginSuccess) {
  container.innerHTML = `
    <style>
      /* Premium Healthcare Color Palette */
      :root {
        --deep-navy: #082B49;
        --med-teal: #00A99D;
        --bright-cyan: #24C6D8;
        --soft-mint: #DDF8F4;
        --pure-white: #FFFFFF;
        --light-blue: #F2FAFC;
        --text-gray: #475569;
        --border-gray: #E2E8F0;
      }

      /* Animations */
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      @keyframes pulse-glow {
        0%, 100% { box-shadow: 0 0 15px rgba(36, 198, 216, 0.2); }
        50% { box-shadow: 0 0 25px rgba(36, 198, 216, 0.6); }
      }
      @keyframes scan-line {
        0% { top: 0; opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { top: 100%; opacity: 0; }
      }
      @keyframes spin-slow {
        100% { transform: rotate(360deg); }
      }

      .glass-card {
        background: rgba(255, 255, 255, 0.7);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.5);
        box-shadow: 0 8px 32px rgba(8, 43, 73, 0.05);
      }

      /* Global Layout */
      .login-wrapper {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        display: flex;
        z-index: 50;
        font-family: 'Inter', sans-serif;
        background-color: var(--light-blue);
        overflow: hidden;
      }

      /* Background Pattern */
      .bg-pattern {
        position: absolute;
        inset: 0;
        background-image: 
          linear-gradient(rgba(0, 169, 157, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 169, 157, 0.03) 1px, transparent 1px);
        background-size: 30px 30px;
        z-index: -2;
      }

      /* Wave SVG */
      .bottom-wave {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 25vh;
        z-index: 0;
        pointer-events: none;
      }

      /* Left Section */
      .left-section {
        width: 58%;
        height: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
        padding: 40px 60px;
        z-index: 1;
      }

      /* Right Section */
      .right-section {
        width: 42%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        z-index: 2;
        background: radial-gradient(circle at top right, rgba(255,255,255,0.8), rgba(255,255,255,0.1));
      }

      /* Branding */
      .brand-header {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .logo-group {
        display: flex;
        align-items: center;
        gap: 12px;
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
        box-shadow: 0 4px 12px rgba(0, 169, 157, 0.3);
      }
      .brand-title {
        font-family: 'Outfit', sans-serif;
        font-size: 28px;
        font-weight: 800;
        color: var(--deep-navy);
        line-height: 1.1;
        letter-spacing: -0.5px;
      }
      .brand-title span {
        color: var(--med-teal);
      }
      .brand-subtitle {
        font-size: 15px;
        color: var(--text-gray);
        font-weight: 500;
        letter-spacing: 1px;
        text-transform: uppercase;
      }
      .badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: var(--soft-mint);
        color: var(--deep-navy);
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 700;
        width: fit-content;
        border: 1px solid rgba(0, 169, 157, 0.2);
      }

      /* Hero Visual Area */
      .hero-visual {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        margin-top: 20px;
      }
      .eye-container {
        position: relative;
        width: 420px;
        height: 420px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: pulse-glow 4s infinite;
        background: white;
      }
      
      .eye-image {
        width: 360px;
        height: 360px;
        border-radius: 50%;
        object-fit: cover;
        z-index: 2;
        box-shadow: inset 0 0 40px rgba(0,0,0,0.5);
      }
      
      .scanning-ring {
        position: absolute;
        width: 460px;
        height: 460px;
        border-radius: 50%;
        border: 2px dashed rgba(36, 198, 216, 0.4);
        animation: spin-slow 20s linear infinite;
        z-index: 1;
      }
      
      .scanning-ring-2 {
        position: absolute;
        width: 500px;
        height: 500px;
        border-radius: 50%;
        border: 1px solid rgba(0, 169, 157, 0.2);
        animation: spin-slow 35s linear infinite reverse;
        z-index: 1;
      }

      .scan-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background: var(--bright-cyan);
        box-shadow: 0 0 10px var(--bright-cyan);
        animation: scan-line 3s ease-in-out infinite;
        z-index: 3;
        border-radius: 50%;
      }

      /* Floating Info Cards */
      .info-card {
        position: absolute;
        padding: 12px 16px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 12px;
        width: 220px;
        animation: float 6s ease-in-out infinite;
        z-index: 10;
      }
      .info-card.top-left { top: 10%; left: 0; animation-delay: 0s; }
      .info-card.top-right { top: 25%; right: -20px; animation-delay: 1.5s; }
      .info-card.bottom-left { bottom: 25%; left: -20px; animation-delay: 3s; }
      .info-card.bottom-right { bottom: 10%; right: 0; animation-delay: 4.5s; }

      .info-icon {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        background: var(--soft-mint);
        color: var(--med-teal);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .info-text h4 {
        font-size: 12px;
        font-weight: 700;
        color: var(--deep-navy);
        margin: 0 0 2px 0;
      }
      .info-text p {
        font-size: 11px;
        color: var(--text-gray);
        margin: 0;
      }

      /* Footer Text */
      .bottom-text {
        position: absolute;
        bottom: 30px;
        width: calc(100% - 120px);
        display: flex;
        justify-content: space-between;
        align-items: center;
        z-index: 10;
      }
      .bottom-text-left {
        font-size: 13px;
        font-weight: 700;
        color: var(--deep-navy);
        letter-spacing: 2px;
        display: flex;
        gap: 16px;
      }
      .bottom-text-left span {
        color: var(--med-teal);
      }
      .bottom-text-right {
        font-size: 14px;
        font-weight: 600;
        color: var(--deep-navy);
      }

      /* Login Card */
      .login-card {
        width: 100%;
        max-width: 440px;
        background: var(--pure-white);
        border-radius: 24px;
        padding: 48px;
        box-shadow: 0 20px 40px rgba(8, 43, 73, 0.08), 0 0 0 1px rgba(0, 169, 157, 0.1);
        display: flex;
        flex-direction: column;
        gap: 32px;
        position: relative;
      }
      
      .login-card-header {
        text-align: center;
      }
      .login-card-header .hospital-icon {
        width: 48px;
        height: 48px;
        background: var(--soft-mint);
        color: var(--med-teal);
        border-radius: 12px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 16px;
      }
      .login-card-header h2 {
        font-family: 'Outfit', sans-serif;
        font-size: 28px;
        font-weight: 700;
        color: var(--deep-navy);
        margin: 0 0 8px 0;
      }
      .login-card-header p {
        font-size: 15px;
        color: var(--text-gray);
        margin: 0;
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .form-group label {
        font-size: 14px;
        font-weight: 600;
        color: var(--deep-navy);
      }
      .input-wrapper {
        position: relative;
        display: flex;
        align-items: center;
      }
      .input-wrapper i.leading-icon {
        position: absolute;
        left: 16px;
        color: var(--med-teal);
      }
      .input-wrapper input {
        width: 100%;
        padding: 14px 16px 14px 48px;
        border: 1.5px solid var(--border-gray);
        border-radius: 12px;
        font-size: 15px;
        color: var(--deep-navy);
        transition: all 0.2s ease;
        outline: none;
        background: #FAFAFA;
      }
      .input-wrapper input:focus {
        border-color: var(--med-teal);
        background: var(--pure-white);
        box-shadow: 0 0 0 4px rgba(0, 169, 157, 0.1);
      }
      .input-wrapper input::placeholder {
        color: #94A3B8;
      }
      
      .form-options {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .checkbox-group {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .checkbox-group input {
        width: 16px;
        height: 16px;
        accent-color: var(--med-teal);
        cursor: pointer;
      }
      .checkbox-group label {
        font-size: 14px;
        color: var(--text-gray);
        cursor: pointer;
      }
      .forgot-link {
        font-size: 14px;
        color: var(--med-teal);
        font-weight: 600;
        text-decoration: none;
      }
      
      .submit-btn {
        width: 100%;
        padding: 16px;
        background: linear-gradient(135deg, var(--med-teal), var(--bright-cyan));
        color: white;
        border: none;
        border-radius: 12px;
        font-size: 16px;
        font-weight: 700;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 8px;
        transition: all 0.3s ease;
        box-shadow: 0 8px 20px rgba(0, 169, 157, 0.3);
      }
      .submit-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 24px rgba(0, 169, 157, 0.4);
      }
      
      .auth-note {
        text-align: center;
        font-size: 13px;
        color: var(--text-gray);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
      }

      /* Security Footer */
      .security-footer {
        margin-top: 8px;
        padding-top: 24px;
        border-top: 1px solid var(--border-gray);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        text-align: center;
      }
      .security-title {
        font-size: 13px;
        font-weight: 700;
        color: var(--deep-navy);
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .security-desc {
        font-size: 12px;
        color: var(--text-gray);
        line-height: 1.5;
        max-width: 300px;
      }
      .security-icons {
        display: flex;
        gap: 16px;
        margin-top: 4px;
      }
      .security-icons div {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        font-size: 10px;
        font-weight: 600;
        color: var(--text-gray);
      }
      .security-icons i {
        color: var(--med-teal);
        width: 16px;
        height: 16px;
      }
      
      .error-msg {
        color: #ef4444;
        font-size: 14px;
        font-weight: 500;
        text-align: center;
        display: none;
        background: #fef2f2;
        padding: 10px;
        border-radius: 8px;
        border: 1px solid #fecaca;
      }
    </style>

    <div class="login-wrapper">
      <div class="bg-pattern"></div>
      
      <!-- Flowing Wave Background -->
      <svg class="bottom-wave" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path fill="rgba(0, 169, 157, 0.05)" fill-opacity="1" d="M0,256L48,229.3C96,203,192,149,288,154.7C384,160,480,224,576,218.7C672,213,768,139,864,128C960,117,1056,171,1152,197.3C1248,224,1344,224,1392,224L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        <path fill="rgba(36, 198, 216, 0.08)" fill-opacity="1" d="M0,128L48,154.7C96,181,192,235,288,240C384,245,480,203,576,170.7C672,139,768,117,864,122.7C960,128,1056,160,1152,165.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
      </svg>

      <!-- LEFT SECTION (58%) -->
      <div class="left-section">
        
        <div class="brand-header">
          <div class="logo-group">
            <div class="logo-icon">
              <i data-lucide="eye" style="width: 24px; height: 24px;"></i>
            </div>
            <div class="badge">
              <i data-lucide="sparkles" style="width: 12px; height: 12px;"></i>
              AI-POWERED RETINAL SCREENING
            </div>
          </div>
          <h1 class="brand-title">
            AI DIABETIC RETINOPATHY<br>
            <span>SCREENING</span>
          </h1>
          <div class="brand-subtitle">
            Earlier Insights &bull; Healthier Visions
          </div>
        </div>

        <div class="hero-visual">
          
          <!-- Glass Cards -->
          <div class="info-card glass-card top-left">
            <div class="info-icon"><i data-lucide="cpu" style="width: 18px; height: 18px;"></i></div>
            <div class="info-text">
              <h4>AI ANALYSIS</h4>
              <p>Retinal image processing</p>
            </div>
          </div>

          <div class="info-card glass-card top-right">
            <div class="info-icon"><i data-lucide="search" style="width: 18px; height: 18px;"></i></div>
            <div class="info-text">
              <h4>EARLY DETECTION</h4>
              <p>Identify diabetic changes</p>
            </div>
          </div>

          <div class="info-card glass-card bottom-left">
            <div class="info-icon"><i data-lucide="activity" style="width: 18px; height: 18px;"></i></div>
            <div class="info-text">
              <h4>RISK ASSESSMENT</h4>
              <p>Intelligent insights</p>
            </div>
          </div>

          <div class="info-card glass-card bottom-right">
            <div class="info-icon"><i data-lucide="shield-check" style="width: 18px; height: 18px;"></i></div>
            <div class="info-text">
              <h4>EXPLAINABLE AI</h4>
              <p>Clinician-friendly results</p>
            </div>
          </div>

          <!-- Main Eye/AI Visual -->
          <div class="eye-container">
            <div class="scanning-ring"></div>
            <div class="scanning-ring-2"></div>
            <img src="src/Loginpagephoto.jpeg" alt="Retina Fundus" class="eye-image" onerror="this.src='assets/retinal_hud.jpg'">
            <div class="scan-overlay"></div>
          </div>
        </div>

        <div class="bottom-text">
          <div class="bottom-text-left">
            PREVENT <span>•</span> DETECT <span>•</span> EXPLAIN <span>•</span> EMPOWER
          </div>
          <div class="bottom-text-right">
            Better Eye Care for a Brighter Tomorrow
          </div>
        </div>
      </div>

      <!-- RIGHT SECTION (42%) -->
      <div class="right-section">
        <div class="login-card">
          
          <div class="login-card-header">
            <div class="hospital-icon">
              <i data-lucide="building-2" style="width: 24px; height: 24px;"></i>
            </div>
            <h2>Welcome Back</h2>
            <p>Sign in to continue to your PHC Screening Portal</p>
          </div>

          <form id="login-form" style="display: flex; flex-direction: column; gap: 24px;">
            <div class="form-group">
              <label for="phc-id">PHC ID</label>
              <div class="input-wrapper">
                <i data-lucide="building" class="leading-icon" style="width: 18px; height: 18px;"></i>
                <input type="text" id="phc-id" placeholder="Enter your PHC ID" required autocomplete="username">
              </div>
            </div>

            <div class="form-group">
              <label for="password">Password</label>
              <div class="input-wrapper">
                <i data-lucide="lock" class="leading-icon" style="width: 18px; height: 18px;"></i>
                <input type="password" id="password" placeholder="Enter your password" required autocomplete="current-password">
              </div>
            </div>

            <div class="form-options">
              <div class="checkbox-group">
                <input type="checkbox" id="remember-me">
                <label for="remember-me">Remember me</label>
              </div>
              <a href="#" class="forgot-link">Forgot Password?</a>
            </div>

            <div id="login-error" class="error-msg"></div>

            <button type="submit" class="submit-btn">
              Sign In <i data-lucide="arrow-right" style="width: 18px; height: 18px;"></i>
            </button>
            
            <div class="auth-note">
              <i data-lucide="shield" style="width: 14px; height: 14px;"></i> Secure access for authorized PHC personnel
            </div>
          </form>

          <div class="security-footer">
            <div class="security-title">
              <i data-lucide="lock-keyhole" style="width: 14px; height: 14px;"></i> Secure Healthcare Access
            </div>
            <div class="security-desc">
              Your login and patient screening information are protected with secure encryption.
            </div>
            <div class="security-icons">
              <div>
                <i data-lucide="shield-check"></i>
                Secure Login
              </div>
              <div>
                <i data-lucide="file-key-2"></i>
                Data Privacy
              </div>
              <div>
                <i data-lucide="user-check"></i>
                Authorized Access
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  `;

  if (window.lucide) {
    window.lucide.createIcons();
  }

  const form = document.getElementById('login-form');
  const phcIdInput = document.getElementById('phc-id');
  const passwordInput = document.getElementById('password');
  const errorDiv = document.getElementById('login-error');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    errorDiv.style.display = 'none';
    
    const phcId = phcIdInput.value.trim();
    const password = passwordInput.value;

    import('../services/storageService.js').then(({ StorageService }) => {
      const result = StorageService.verifyLogin(phcId, password);
      if (result.success) {
        onLoginSuccess();
      } else {
        errorDiv.textContent = result.message;
        errorDiv.style.display = 'block';
      }
    });
  });
}
