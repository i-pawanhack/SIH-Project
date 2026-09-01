# RetinaXAI — Explainable AI for Faster and Smarter Diabetic Retinopathy Screening

> **Smart India Hackathon (SIH26038)**  
> *“Explainable AI for Diabetic Retinopathy Screening in Rural India”*  
> **Core Theme:** *RetinaXAI — Detect. Explain. Validate. Refer. Scale.*

---

## 👁️ Overview & Core Purpose

**RetinaXAI** is a clinical-grade, AI-assisted decision-support and retinal screening web application engineered specifically for rural Indian Primary Health Centres (PHCs), Community Health Centres (CHCs), and mobile tele-ophthalmology outreach units.

Rather than positioning AI as a standalone diagnostic tool or replacement for specialists, RetinaXAI creates an **end-to-end connected clinical screening pipeline** that connects rural healthcare workers, automated image quality filters, CLAHE preprocessing, deep learning feature extraction, Grad-CAM explainability, and tele-ophthalmologists.

---

## 🚀 Key Hackathon Differentiator

The innovation is NOT merely *"AI classifies diabetic retinopathy."*  
The core value proposition is the **complete unbroken clinical workflow**:

```
Quality Check ➔ CLAHE Enhancement ➔ DR Detection ➔ Severity Grading (ICDR 0–4) ➔ Grad-CAM Heatmap ➔ Lesion Evidence ➔ Softmax Confidence ➔ Tele-Ophthalmologist Validation ➔ Rural Scalability
```

---

## 🌟 Key Application Features

### 1. 🏥 Executive Clinical Dashboard
- Real-time KPI statistics: Total Screenings, Referable Cases (Level 2+), Non-Referable Cases, Ungradable Captures, Pending Tele-Reviews.
- Filterable and searchable recent patient database.
- Facility status indicators (PHC Rampur, CHC Kotdwar, Mobile Van #3).

### 2. 📋 6-Step Clinical Screening Wizard
1. **Patient Intake:** Demographic registration, known diabetes duration, type (Type 1 / Type 2 / Gestational), and screening facility.
2. **Fundus Image Acquisition:** Drag-and-drop file upload (`.jpg`, `.jpeg`, `.png`), simulated USB portable camera capture, and preset loader.
3. **Image Quality Assessment:** 5-point automated quality filter (Optical Focus, Illumination Uniformity, Field of View 45°, Retinal Landmark Visibility, Artifact Glare). Clear ungradable alert with recapture recommendations.
4. **Image Enhancement:** Contrast-Limited Adaptive Histogram Equalization (CLAHE), green-channel luminance boost, and side-by-side comparison slider.
5. **AI Diagnostic Pipeline:** Animated multi-stage convolutional inference visualizing step-by-step feature extraction.
6. **ICDR Severity & Referability:** Grading on the 5-point International Clinical Diabetic Retinopathy scale (Level 0 No DR, Level 1 Mild NPDR, Level 2 Moderate NPDR, Level 3 Severe NPDR, Level 4 Proliferative DR) with binary Referable (Level 2+) triage.

### 3. 🔬 Explainable AI (Grad-CAM & Anatomical Landmarking)
- **Grad-CAM Heatmap Viewer:** Dynamic thermal colormap (Jet/Turbo) overlay with real-time opacity slider (0%–100%).
- **Multi-Layer Blending:** Toggle between Original Retina, Heatmap Only, Alpha Overlay, and Anatomical Structures.
- **Anatomical Overlays:** Optic Disc localization, Fovea centralis landmarking, and vessel caliber density analysis.
- **Clinical Evidence Panel:** Breakdown of identified microaneurysms, hard exudates, blot hemorrhages, cotton-wool spots, and disc neovascularization.

### 4. 🩺 Tele-Ophthalmologist Review Portal
- Certified eye specialist triage inbox with pending case filters.
- Side-by-side inspection of fundus photograph and Grad-CAM heatmap.
- **Specialist Final Authority:** Certified doctor can confirm or override AI DR grade, check tertiary referral, request recapture, record clinical notes, and digitally sign off.

### 5. 🖨️ Clinical Screening Report (Print/PDF Ready)
- Comprehensive clinical report featuring patient demographics, fundus photograph, Grad-CAM heatmap, lesion breakdown table, calibrated confidence, doctor sign-off block, and medical disclaimer.
- Formatted for `@media print` A4 printing and PDF export.

### 6. 🌐 Rural Offline & Low-Bandwidth Mode
- Offline-first storage with local IndexedDB/localStorage queuing.
- Low-Bandwidth Mode: High-efficiency JPEG compression and vector heatmap payloads for 2G/3G networks.
- Store-and-Forward cloud tele-sync engine with manual force-sync trigger.

### 7. ⚙️ MATLAB / Simulink Digital Twin Capacity Simulator
- Interactive parameter sliders: Patients/day, cameras deployed, AI inference time, tele-ophthalmologists on duty, doctor review speed.
- Dynamic computed metrics: Daily throughput, annual screening capacity, doctor daily workload hours, and unserved queue backlogs.
- Animated visual flow diagram identifying active system bottlenecks (Camera Acquisition Limit, AI Edge Latency, Specialist Review Throughput).

### 8. 📊 Clinical Analytics & Dataset Architecture
- DR severity distribution and referral ratio charts.
- Documented compatibility with benchmark retinal datasets: **APTOS 2019, IDRiD, DRIVE, Messidor-2**.
- Modular REST/WebSocket API specification for plugging in PyTorch / TensorFlow / MATLAB backends.

---

## 💻 How to Run Locally

### Option 1: Double-Click or Open Directly
Simply open `index.html` in any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari).

### Option 2: Python Development Server
Run the included python server script from your terminal:
```bash
python server.py
```
Then open: **`http://localhost:8080`**

---

## 🔒 Medical Safety & Regulatory Compliance

> **“RetinaXAI is an AI-assisted screening prototype. It is not a substitute for professional medical diagnosis. Final clinical assessment and referral decisions must be made by a qualified ophthalmologist.”**

- No pharmaceutical prescriptions or unsolicited treatments.
- Transparent demo labels on simulated evidence and prototype confidence metrics.
- Absolute diagnostic priority given to certified ophthalmologists.
