export function openProfileModal() {
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return;

  const credentials = {
    phcId: 'PHC-001',
    phcName: 'Primary Health Centre (District A)',
    doctorName: 'Dr. Sharma',
    specialization: 'Ophthalmologist / General Physician',
    licenseNumber: 'MCI-847291',
    contactInfo: '+91-9876543210',
    address: 'Plot No. 12, Rural Health Block, District A, State'
  };

  modalRoot.innerHTML = `
    <div class="modal-container" style="max-width:500px;">
      <div class="modal-header">
        <div style="display:flex; align-items:center; gap:0.5rem;">
          <i data-lucide="user-circle" style="width:24px;height:24px; color:var(--primary-600);"></i>
          <h3 style="font-size:1.25rem; color:var(--slate-900); font-weight: 600;">${window.tData('Profile Details')}</h3>
        </div>
        <button class="btn btn-secondary btn-sm" id="profile-close-btn" style="border: none; background: transparent; box-shadow: none;">
          <i data-lucide="x" style="width:20px;height:20px; color: var(--slate-500);"></i>
        </button>
      </div>

      <div class="modal-body" style="padding: 1.5rem;">
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-card); padding-bottom: 0.5rem;">
            <span style="color: var(--slate-500); font-size: 0.9rem;">${window.tData('PHC ID')}</span>
            <span style="color: var(--slate-900); font-weight: 500;">${window.tData(credentials.phcId)}</span>
          </div>

          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-card); padding-bottom: 0.5rem;">
            <span style="color: var(--slate-500); font-size: 0.9rem;">${window.tData('Facility Name')}</span>
            <span style="color: var(--slate-900); font-weight: 500;">${window.tData(credentials.phcName)}</span>
          </div>

          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-card); padding-bottom: 0.5rem;">
            <span style="color: var(--slate-500); font-size: 0.9rem;">${window.tData('Doctor Name')}</span>
            <span style="color: var(--slate-900); font-weight: 500;">${window.tData(credentials.doctorName)}</span>
          </div>

          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-card); padding-bottom: 0.5rem;">
            <span style="color: var(--slate-500); font-size: 0.9rem;">${window.tData('Specialization')}</span>
            <span style="color: var(--slate-900); font-weight: 500;">${window.tData(credentials.specialization)}</span>
          </div>

          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-card); padding-bottom: 0.5rem;">
            <span style="color: var(--slate-500); font-size: 0.9rem;">${window.tData('Medical License No.')}</span>
            <span style="color: var(--slate-900); font-weight: 500;">${window.tData(credentials.licenseNumber)}</span>
          </div>
          
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-card); padding-bottom: 0.5rem;">
            <span style="color: var(--slate-500); font-size: 0.9rem;">${window.tData('Contact Info')}</span>
            <span style="color: var(--slate-900); font-weight: 500;">${credentials.contactInfo}</span>
          </div>

          <div style="display: flex; justify-content: space-between; padding-bottom: 0.5rem;">
            <span style="color: var(--slate-500); font-size: 0.9rem;">${window.tData('Address')}</span>
            <span style="color: var(--slate-900); font-weight: 500; text-align: right; max-width: 60%;">${window.tData(credentials.address)}</span>
          </div>

        </div>
      </div>
    </div>
  `;

  modalRoot.classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons({ root: modalRoot });

  const closeBtn = modalRoot.querySelector('#profile-close-btn');
  const closeModal = () => {
    modalRoot.classList.add('hidden');
    modalRoot.innerHTML = '';
  };
  
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  
  // Close on outside click
  modalRoot.addEventListener('click', (e) => {
    if (e.target === modalRoot) {
      closeModal();
    }
  });
}
