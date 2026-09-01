/**
 * RetinaXAI — Digital Twin Rural Screening Capacity Simulator Component
 * Emulates the MATLAB / Simulink discrete-event queueing model for rural health scalability.
 */

export function renderCapacitySimulator(container) {
  // Simulation Input Parameters
  let params = {
    patientsPerDay: 120,
    cameras: 2,
    aiTimeSeconds: 3,
    doctors: 3,
    doctorReviewTimeMins: 3.5,
    bandwidthKbps: 512
  };

  function computeMetrics() {
    const workingHoursPerDay = 8;
    const workingMinutesPerDay = workingHoursPerDay * 60;
    const workingSecondsPerDay = workingMinutesPerDay * 60;

    // 1. Camera Acquisition Capacity (assuming ~4 mins per patient for capture & alignment)
    const cameraCaptureMins = 4;
    const maxCameraDaily = params.cameras * (workingMinutesPerDay / cameraCaptureMins);

    // 2. AI Processing Capacity
    const maxAiDaily = workingSecondsPerDay / params.aiTimeSeconds;

    // 3. Doctor Review Capacity
    const referableRatio = 0.20; // 20% referable cases require in-depth specialist review
    const nonReferableDoctorCheckTimeMins = 0.5; // Quick 30s check for normal cases
    const avgDoctorTimePerPatientMins = (referableRatio * params.doctorReviewTimeMins) + ((1 - referableRatio) * nonReferableDoctorCheckTimeMins);
    const maxDoctorDaily = (params.doctors * workingMinutesPerDay) / avgDoctorTimePerPatientMins;

    // 4. Daily Maximum System Throughput
    const dailyThroughput = Math.min(params.patientsPerDay, maxCameraDaily, maxAiDaily, maxDoctorDaily);
    const annualCapacity = Math.round(dailyThroughput * 300); // 300 operating days

    // 5. Total Doctor Workload Hours
    const totalDoctorMinutesNeeded = (dailyThroughput * avgDoctorTimePerPatientMins);
    const doctorWorkloadHoursPerDoc = (totalDoctorMinutesNeeded / params.doctors) / 60;

    // 6. Queue Backlog at end of 8-hr shift
    const queueBacklog = Math.max(0, Math.round(params.patientsPerDay - dailyThroughput));

    // 7. Bottleneck Identification
    let bottleneck = 'No Bottleneck (Optimal)';
    let bottleneckKey = 'none';

    const limits = [
      { key: 'camera', name: 'Fundus Camera Acquisition Limit', cap: maxCameraDaily },
      { key: 'ai', name: 'AI Edge Processing Latency', cap: maxAiDaily },
      { key: 'doctor', name: 'Tele-Ophthalmologist Review Capacity', cap: maxDoctorDaily }
    ];

    limits.sort((a, b) => a.cap - b.cap);

    if (limits[0].cap < params.patientsPerDay) {
      bottleneck = limits[0].name;
      bottleneckKey = limits[0].key;
    }

    return {
      dailyThroughput: Math.round(dailyThroughput),
      annualCapacity,
      doctorWorkloadHours: doctorWorkloadHoursPerDoc.toFixed(1),
      queueBacklog,
      bottleneck,
      bottleneckKey,
      maxCameraDaily: Math.round(maxCameraDaily),
      maxDoctorDaily: Math.round(maxDoctorDaily)
    };
  }

  function updateView() {
    const metrics = computeMetrics();

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
        <div>
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <h1 style="font-size:1.75rem; color:var(--slate-900);">Rural Capacity & Bottleneck Simulator</h1>
            <span class="badge" style="background:#e0f2fe; color:#0369a1; font-size:0.75rem;">MATLAB / SIMULINK DIGITAL TWIN</span>
          </div>
          <p style="color:var(--slate-600); font-size:0.875rem; margin-top:0.25rem;">
            Simulate rural healthcare throughput, doctor workloads, and queue dynamics to optimize screening camp logistics.
          </p>
        </div>

        <button class="btn btn-secondary btn-sm" id="sim-reset-btn">
          <i data-lucide="rotate-ccw" style="width:14px;height:14px;"></i>
          Reset Defaults
        </button>
      </div>

      <!-- VISUAL PROCESS PIPELINE WITH REAL-TIME BOTTLENECK HIGHLIGHTING -->
      <div class="card" style="background:linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color:white; margin-bottom:1.5rem; border:none;">
        <div style="font-size:0.75rem; font-weight:700; color:#2dd4bf; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.5rem;">
          Dynamic Screening Pipeline Flow
        </div>

        <div class="pipeline-flow-diagram" style="margin:0; background:rgba(0,0,0,0.3);">
          <!-- Step 1: Patient Queue -->
          <div class="pipeline-node">
            <div class="pipeline-node-icon" style="color:#38bdf8;">
              <i data-lucide="users" style="width:24px;height:24px;"></i>
            </div>
            <div style="font-size:0.75rem; font-weight:700;">Patients</div>
            <div style="font-size:0.65rem; color:#94a3b8;">${params.patientsPerDay} / day</div>
          </div>

          <div class="pipeline-connector-line"></div>

          <!-- Step 2: Cameras -->
          <div class="pipeline-node ${metrics.bottleneckKey === 'camera' ? 'bottleneck' : ''}">
            <div class="pipeline-node-icon" style="color:#f59e0b;">
              <i data-lucide="camera" style="width:24px;height:24px;"></i>
            </div>
            <div style="font-size:0.75rem; font-weight:700;">Cameras</div>
            <div style="font-size:0.65rem; color:#94a3b8;">Cap: ${metrics.maxCameraDaily} / day</div>
          </div>

          <div class="pipeline-connector-line"></div>

          <!-- Step 3: AI Inference -->
          <div class="pipeline-node ${metrics.bottleneckKey === 'ai' ? 'bottleneck' : ''}">
            <div class="pipeline-node-icon" style="color:#10b981;">
              <i data-lucide="cpu" style="width:24px;height:24px;"></i>
            </div>
            <div style="font-size:0.75rem; font-weight:700;">AI Edge Model</div>
            <div style="font-size:0.65rem; color:#94a3b8;">${params.aiTimeSeconds}s / image</div>
          </div>

          <div class="pipeline-connector-line"></div>

          <!-- Step 4: Doctor Tele-Review -->
          <div class="pipeline-node ${metrics.bottleneckKey === 'doctor' ? 'bottleneck' : ''}">
            <div class="pipeline-node-icon" style="color:#ec4899;">
              <i data-lucide="stethoscope" style="width:24px;height:24px;"></i>
            </div>
            <div style="font-size:0.75rem; font-weight:700;">Doctor Review</div>
            <div style="font-size:0.65rem; color:#94a3b8;">Cap: ${metrics.maxDoctorDaily} / day</div>
          </div>

          <div class="pipeline-connector-line"></div>

          <!-- Step 5: Final Referrals -->
          <div class="pipeline-node">
            <div class="pipeline-node-icon" style="color:#a855f7;">
              <i data-lucide="check-circle" style="width:24px;height:24px;"></i>
            </div>
            <div style="font-size:0.75rem; font-weight:700;">Triage Output</div>
            <div style="font-size:0.65rem; color:#94a3b8;">${metrics.dailyThroughput} Screened</div>
          </div>
        </div>
      </div>

      <!-- MAIN 2-COLUMN SIMULATOR GRID -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(360px, 1fr)); gap:1.5rem;">
        
        <!-- LEFT: INTERACTIVE SIMULATION PARAMETER SLIDERS -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">
              <i data-lucide="sliders" style="width:20px;height:20px; color:var(--primary-600);"></i>
              Operational Variables & Resource Allocations
            </h3>
          </div>

          <div style="display:flex; flex-direction:column; gap:1.25rem;">
            
            <!-- Patients Per Day Slider -->
            <div>
              <div style="display:flex; justify-content:space-between; font-size:0.8125rem; font-weight:700; color:var(--slate-800); margin-bottom:0.25rem;">
                <span>Camp Demand (Patients / Day)</span>
                <span style="font-family:var(--font-mono); color:var(--primary-700);">${params.patientsPerDay}</span>
              </div>
              <input type="range" class="slider-input sim-slider" data-param="patientsPerDay" min="20" max="400" step="10" value="${params.patientsPerDay}" style="width:100%;">
            </div>

            <!-- Number of Cameras -->
            <div>
              <div style="display:flex; justify-content:space-between; font-size:0.8125rem; font-weight:700; color:var(--slate-800); margin-bottom:0.25rem;">
                <span>Portable Fundus Cameras Deployed</span>
                <span style="font-family:var(--font-mono); color:var(--primary-700);">${params.cameras} Cameras</span>
              </div>
              <input type="range" class="slider-input sim-slider" data-param="cameras" min="1" max="8" step="1" value="${params.cameras}" style="width:100%;">
            </div>

            <!-- AI Processing Latency -->
            <div>
              <div style="display:flex; justify-content:space-between; font-size:0.8125rem; font-weight:700; color:var(--slate-800); margin-bottom:0.25rem;">
                <span>AI Edge Processing Time (seconds)</span>
                <span style="font-family:var(--font-mono); color:var(--primary-700);">${params.aiTimeSeconds} sec</span>
              </div>
              <input type="range" class="slider-input sim-slider" data-param="aiTimeSeconds" min="1" max="15" step="1" value="${params.aiTimeSeconds}" style="width:100%;">
            </div>

            <!-- Number of Tele-Ophthalmologists -->
            <div>
              <div style="display:flex; justify-content:space-between; font-size:0.8125rem; font-weight:700; color:var(--slate-800); margin-bottom:0.25rem;">
                <span>Available Tele-Ophthalmologists</span>
                <span style="font-family:var(--font-mono); color:var(--primary-700);">${params.doctors} Specialists</span>
              </div>
              <input type="range" class="slider-input sim-slider" data-param="doctors" min="1" max="10" step="1" value="${params.doctors}" style="width:100%;">
            </div>

            <!-- Doctor Review Speed -->
            <div>
              <div style="display:flex; justify-content:space-between; font-size:0.8125rem; font-weight:700; color:var(--slate-800); margin-bottom:0.25rem;">
                <span>Doctor Review Time (Referable Cases)</span>
                <span style="font-family:var(--font-mono); color:var(--primary-700);">${params.doctorReviewTimeMins} mins</span>
              </div>
              <input type="range" class="slider-input sim-slider" data-param="doctorReviewTimeMins" min="1" max="8" step="0.5" value="${params.doctorReviewTimeMins}" style="width:100%;">
            </div>

          </div>
        </div>

        <!-- RIGHT: SIMULATED PERFORMANCE OUTPUTS -->
        <div style="display:flex; flex-direction:column; gap:1.25rem;">
          
          <!-- Key Throughput Metrics -->
          <div class="card">
            <div class="card-header" style="margin-bottom:0.75rem;">
              <h3 class="card-title">
                <i data-lucide="gauge" style="width:20px;height:20px; color:var(--primary-600);"></i>
                Simulated Output Performance
              </h3>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1rem;">
              <!-- Daily Throughput -->
              <div style="background:var(--slate-50); border:1px solid var(--border-card); border-radius:var(--radius-md); padding:1rem; text-align:center;">
                <div style="font-size:0.75rem; font-weight:700; color:var(--slate-500); text-transform:uppercase;">Daily Throughput</div>
                <div style="font-size:2rem; font-weight:800; color:var(--slate-900); font-family:var(--font-heading);">
                  ${metrics.dailyThroughput}
                </div>
                <div style="font-size:0.7rem; color:var(--slate-500);">Patients Screened / 8hr Shift</div>
              </div>

              <!-- Annual Population Capacity -->
              <div style="background:var(--slate-50); border:1px solid var(--border-card); border-radius:var(--radius-md); padding:1rem; text-align:center;">
                <div style="font-size:0.75rem; font-weight:700; color:var(--slate-500); text-transform:uppercase;">Annual Rural Capacity</div>
                <div style="font-size:2rem; font-weight:800; color:var(--primary-700); font-family:var(--font-heading);">
                  ${metrics.annualCapacity.toLocaleString('en-IN')}
                </div>
                <div style="font-size:0.7rem; color:var(--slate-500);">Patients per Annum (300 Days)</div>
              </div>
            </div>

            <!-- Workload & Backlog -->
            <div style="display:flex; flex-direction:column; gap:0.5rem; font-size:0.8125rem;">
              <div style="display:flex; justify-content:space-between; padding:0.6rem; background:var(--slate-50); border-radius:var(--radius-sm); align-items:center;">
                <span style="color:var(--slate-700);">Doctor Workload per Specialist:</span>
                <strong style="color:${parseFloat(metrics.doctorWorkloadHours) > 7.0 ? '#dc2626' : '#15803d'}; font-size:0.9375rem;">
                  ${metrics.doctorWorkloadHours} Hours / Day
                </strong>
              </div>

              <div style="display:flex; justify-content:space-between; padding:0.6rem; background:var(--slate-50); border-radius:var(--radius-sm); align-items:center;">
                <span style="color:var(--slate-700);">Unserved Daily Queue Backlog:</span>
                <strong style="color:${metrics.queueBacklog > 0 ? '#dc2626' : '#15803d'}; font-size:0.9375rem;">
                  ${metrics.queueBacklog} Patients
                </strong>
              </div>
            </div>
          </div>

          <!-- Bottleneck Alert Card -->
          <div class="card" style="border-left:4px solid ${metrics.bottleneckKey !== 'none' ? '#ef4444' : '#10b981'};">
            <div style="display:flex; gap:0.75rem; align-items:flex-start;">
              <i data-lucide="${metrics.bottleneckKey !== 'none' ? 'alert-triangle' : 'check-circle-2'}" style="width:24px;height:24px; color:${metrics.bottleneckKey !== 'none' ? '#dc2626' : '#15803d'}; flex-shrink:0; margin-top:2px;"></i>
              <div>
                <div style="font-weight:700; font-size:0.9375rem; color:var(--slate-900);">
                  Identified Bottleneck: ${metrics.bottleneck}
                </div>
                <p style="font-size:0.8125rem; color:var(--slate-600); margin-top:0.25rem; line-height:1.5;">
                  ${metrics.bottleneckKey === 'camera' ? 'Camera acquisition throughput limits total daily throughput. Deploying additional portable cameras or shortening pupil alignment time will increase capacity.' : 
                    (metrics.bottleneckKey === 'doctor' ? 'Specialist tele-review capacity is saturated. Allocate additional tele-ophthalmologists or utilize AI auto-triage to pre-filter non-referable cases.' : 
                    'The screening camp setup is balanced and operating within optimal throughput parameters.')}
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    `;

    // Attach Sliders
    container.querySelectorAll('.sim-slider').forEach(slider => {
      slider.addEventListener('input', (e) => {
        const param = e.target.getAttribute('data-param');
        params[param] = parseFloat(e.target.value);
        updateView();
      });
    });

    container.querySelector('#sim-reset-btn').addEventListener('click', () => {
      params = {
        patientsPerDay: 120,
        cameras: 2,
        aiTimeSeconds: 3,
        doctors: 3,
        doctorReviewTimeMins: 3.5,
        bandwidthKbps: 512
      };
      updateView();
    });

    if (window.lucide) window.lucide.createIcons();
  }

  updateView();
}
