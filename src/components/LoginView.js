export function renderLoginView(container, onLoginSuccess) {
  container.innerHTML = `
    <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100vh; display: flex; z-index: 50; background: linear-gradient(135deg, #f0f5ff 0%, #ffffff 100%); font-family: 'Inter', sans-serif;">
      
      <!-- Left side (60%) Content -->
      <div style="width: 60%; height: 100%; display: flex; flex-direction: column; padding: 60px 80px; position: relative; box-sizing: border-box;">
        
        <!-- Badge -->
        <div style="display: inline-flex; align-items: center; gap: 8px; background: #e0e7ff; color: #4338ca; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 600; width: fit-content; margin-bottom: 24px;">
          <i data-lucide="sparkles" style="width: 14px; height: 14px;"></i> AI Powered Screening
        </div>
        
        <!-- Headlines -->
        <h1 style="font-size: 42px; font-weight: 800; color: #1e3a8a; line-height: 1.2; margin: 0 0 16px 0;">
          Explainable AI for<br>
          <span style="color: #3b82f6;">Diabetic Retinopathy</span><br>
          Screening
        </h1>
        <p style="font-size: 18px; color: #64748b; margin: 0 0 40px 0; max-width: 500px; line-height: 1.5;">
          Early detection. Clearer decisions.<br>
          Better eye health for a healthier tomorrow.
        </p>

        <!-- Features Grid -->
        <div style="display: flex; gap: 32px; margin-bottom: 40px;">
          <!-- Feature 1 -->
          <div>
            <div style="width: 48px; height: 48px; border-radius: 50%; background: #eff6ff; display: flex; align-items: center; justify-content: center; margin-bottom: 12px; color: #2563eb;">
              <i data-lucide="eye" style="width: 24px; height: 24px;"></i>
            </div>
            <h3 style="font-size: 16px; font-weight: 700; color: #0f172a; margin: 0 0 8px 0;">AI-Powered</h3>
            <p style="font-size: 14px; color: #64748b; margin: 0; line-height: 1.4; max-width: 160px;">Detects DR from retinal images</p>
          </div>
          <!-- Feature 2 -->
          <div>
            <div style="width: 48px; height: 48px; border-radius: 50%; background: #f5f3ff; display: flex; align-items: center; justify-content: center; margin-bottom: 12px; color: #7c3aed;">
              <i data-lucide="shield-check" style="width: 24px; height: 24px;"></i>
            </div>
            <h3 style="font-size: 16px; font-weight: 700; color: #0f172a; margin: 0 0 8px 0;">Explainable</h3>
            <p style="font-size: 14px; color: #64748b; margin: 0; line-height: 1.4; max-width: 160px;">Shows reason behind predictions</p>
          </div>
          <!-- Feature 3 -->
          <div>
            <div style="width: 48px; height: 48px; border-radius: 50%; background: #ecfdf5; display: flex; align-items: center; justify-content: center; margin-bottom: 12px; color: #059669;">
              <i data-lucide="users" style="width: 24px; height: 24px;"></i>
            </div>
            <h3 style="font-size: 16px; font-weight: 700; color: #0f172a; margin: 0 0 8px 0;">Accessible</h3>
            <p style="font-size: 14px; color: #64748b; margin: 0; line-height: 1.4; max-width: 160px;">Bringing quality screening to rural India</p>
          </div>
        </div>

        <!-- Slogan at Bottom Left -->
        <div style="margin-top: auto; padding-bottom: 20px; font-family: 'Homemade Apple', cursive, 'Inter', sans-serif; color: #1e3a8a; font-size: 26px; transform: rotate(-5deg); font-style: italic; opacity: 0.9;">
          Healthy Eyes<br>Healthy Lives
        </div>
      </div>
      
      <!-- Right side (40%) Login Form -->
      <div style="width: 40%; height: 100%; display: flex; align-items: center; justify-content: center; position: relative;">
        <!-- Floating shapes background -->
        <div style="position: absolute; right: 0; bottom: 0; width: 100%; height: 50%; background: radial-gradient(circle at bottom right, rgba(59,130,246,0.1), transparent 70%);"></div>

        <!-- Login Card -->
        <div class="login-container" style="max-width: 420px; width: 100%; padding: 48px 40px; background: #ffffff; border-radius: 16px; box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0,0,0,0.02); z-index: 10; margin-right: 40px;">
          
          <div style="text-align: center; margin-bottom: 32px; display: flex; align-items: center; justify-content: center; gap: 12px;">
            <img src="src/logo.jpeg" alt="RetinaXAI Logo" style="height: 48px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h2 style="font-size: 24px; font-weight: 700; color: #0f172a; margin: 0;">RetinaXAI Portal</h2>
          </div>
          <p style="text-align: center; color: #64748b; font-size: 15px; margin-bottom: 32px;" id="login-subtitle">Sign in to your PHC account to continue</p>

          <form id="login-form" style="display: flex; flex-direction: column; gap: 24px;">
            <div>
              <label style="display: block; font-size: 14px; font-weight: 600; color: #334155; margin-bottom: 8px;">PHC ID</label>
              <div style="position: relative;">
                <i data-lucide="user" style="position: absolute; left: 14px; top: 14px; width: 18px; height: 18px; color: #94a3b8;"></i>
                <input type="text" id="phc-id" required style="width: 100%; padding: 12px 16px 12px 42px; border: 1.5px solid #e2e8f0; border-radius: 10px; outline: none; transition: all 0.2s; font-size: 15px; box-sizing: border-box;" placeholder="Enter your PHC ID" onfocus="this.style.borderColor='#3b82f6'; this.style.boxShadow='0 0 0 3px rgba(59, 130, 246, 0.1)';" onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none';">
              </div>
            </div>
            
            <div>
              <label style="display: block; font-size: 14px; font-weight: 600; color: #334155; margin-bottom: 8px;">Password</label>
              <div style="position: relative;">
                <i data-lucide="lock" style="position: absolute; left: 14px; top: 14px; width: 18px; height: 18px; color: #94a3b8;"></i>
                <input type="password" id="phc-password" required style="width: 100%; padding: 12px 16px 12px 42px; border: 1.5px solid #e2e8f0; border-radius: 10px; outline: none; transition: all 0.2s; font-size: 15px; box-sizing: border-box;" placeholder="Enter your password" onfocus="this.style.borderColor='#3b82f6'; this.style.boxShadow='0 0 0 3px rgba(59, 130, 246, 0.1)';" onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none';">
              </div>
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <input type="checkbox" id="remember-me" style="width: 16px; height: 16px; accent-color: #3b82f6; cursor: pointer; border-radius: 4px; border: 1px solid #cbd5e1;">
                <label for="remember-me" style="font-size: 14px; color: #64748b; cursor: pointer;">Remember me</label>
              </div>
              <a href="#" style="font-size: 14px; color: #3b82f6; text-decoration: none; font-weight: 500;">Forgot password?</a>
            </div>

            <div id="login-error" style="color: #ef4444; font-size: 14px; display: none; font-weight: 500; text-align: center;"></div>
            
            <button type="submit" id="submit-btn" style="width: 100%; padding: 14px; background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%); color: white; border: none; border-radius: 10px; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.2s; margin-top: 8px; display: flex; justify-content: center; align-items: center; gap: 8px; box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4);" onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 6px 20px rgba(59, 130, 246, 0.5)';" onmouseout="this.style.transform='none'; this.style.boxShadow='0 4px 14px rgba(59, 130, 246, 0.4)';">
              Sign In <i data-lucide="arrow-right" style="width: 18px; height: 18px;"></i>
            </button>
          </form>
        </div>
      </div>
    </div>
  `;

  if (window.lucide) {
    window.lucide.createIcons();
  }

  const form = document.getElementById('login-form');
  const phcIdInput = document.getElementById('phc-id');
  const passwordInput = document.getElementById('phc-password');
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
