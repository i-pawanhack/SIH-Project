export function renderLoginView(container, onLoginSuccess) {
  container.innerHTML = `
    <div class="login-container" style="max-width: 400px; margin: 80px auto; padding: 24px; background: white; border-radius: 12px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
      <div style="text-align: center; margin-bottom: 32px;">
        <img src="src/logo.jpeg" alt="RetinaXAI Logo" style="height: 64px; margin-bottom: 16px; border-radius: 12px;">
        <h2 style="font-size: 24px; font-weight: 600; color: #1e293b;">RetinaXAI Portal</h2>
        <p style="color: #64748b; margin-top: 8px;" id="login-subtitle">Sign in to your PHC account</p>
      </div>

      <form id="login-form" style="display: flex; flex-direction: column; gap: 16px;">
        <div>
          <label style="display: block; font-size: 14px; font-weight: 500; color: #334155; margin-bottom: 6px;">PHC ID</label>
          <input type="text" id="phc-id" required style="width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 8px; outline: none; transition: border-color 0.2s;" placeholder="e.g. PHC-12345">
        </div>
        <div>
          <label style="display: block; font-size: 14px; font-weight: 500; color: #334155; margin-bottom: 6px;">Password</label>
          <input type="password" id="phc-password" required style="width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 8px; outline: none; transition: border-color 0.2s;" placeholder="••••••••">
        </div>
        <div id="login-error" style="color: #ef4444; font-size: 14px; display: none;"></div>
        
        <button type="submit" id="submit-btn" style="width: 100%; padding: 12px; background: #0ea5e9; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: background-color 0.2s; margin-top: 8px;">
          Sign In
        </button>
      </form>
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
