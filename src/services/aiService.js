/**
 * RetinaXAI — AI Diagnostic & Explainable AI (XAI) Service
 * Implements Grad-CAM synthesizer, anatomical structure segmentation,
 * lesion evidence extraction, and severity classification pipeline.
 */

import { DR_SEVERITY_LEVELS } from '../types.js';

export class AIService {
  /**
   * Generates a realistic Grad-CAM Heatmap overlay focused on the detected pathological regions.
   * Utilizes Jet/Turbo thermal color mapping (Blue -> Cyan -> Green -> Yellow -> Red).
   */
  static generateGradCAMHeatmap(stage = 0, width = 600, height = 600) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const cx = width / 2;
    const cy = height / 2;
    const radius = width * 0.45;

    // Blank transparent canvas
    ctx.clearRect(0, 0, width, height);

    // If Level 0 (No DR), attention is diffuse and low across normal vascular arcade
    if (stage === 0) {
      const normalGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, radius * 0.7);
      normalGrad.addColorStop(0, 'rgba(0, 100, 255, 0.25)');
      normalGrad.addColorStop(0.5, 'rgba(0, 220, 255, 0.15)');
      normalGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = normalGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 0.7, 0, Math.PI * 2);
      ctx.fill();
      return canvas.toDataURL('image/png');
    }

    // Heatmap Activation Hotspots based on DR severity & lesion locations
    const hotspots = [];
    const maculaX = cx + radius * 0.25;
    const maculaY = cy + radius * 0.05;
    const odX = cx - radius * 0.45;
    const odY = cy;

    if (stage === 1) {
      // Mild NPDR: Small isolated focal activations on microaneurysms
      hotspots.push({ x: cx + 40, y: cy - 50, r: 60, intensity: 0.85 });
      hotspots.push({ x: cx - 30, y: cy + 70, r: 45, intensity: 0.7 });
    } else if (stage === 2) {
      // Moderate NPDR: Hotspots over macular hard exudates & temporal quadrant
      hotspots.push({ x: maculaX - 30, y: maculaY - 20, r: 90, intensity: 0.95 });
      hotspots.push({ x: maculaX + 50, y: maculaY + 40, r: 75, intensity: 0.88 });
      hotspots.push({ x: cx + 20, y: cy - 70, r: 65, intensity: 0.78 });
    } else if (stage === 3) {
      // Severe NPDR: Broad multi-quadrant activations over blot hemorrhages & cotton wool spots
      hotspots.push({ x: cx + 80, y: cy - 100, r: 110, intensity: 0.98 });
      hotspots.push({ x: cx - 60, y: cy + 90, r: 95, intensity: 0.92 });
      hotspots.push({ x: cx + 110, y: cy + 70, r: 90, intensity: 0.89 });
      hotspots.push({ x: maculaX - 20, y: maculaY + 10, r: 85, intensity: 0.85 });
    } else if (stage === 4) {
      // Proliferative DR: High-intensity activations over Optic Disc (NVD) and preretinal hemorrhage
      hotspots.push({ x: odX, y: odY, r: 120, intensity: 1.0 });
      hotspots.push({ x: cx + 80, y: cy + 120, r: 115, intensity: 0.98 });
      hotspots.push({ x: maculaX, y: maculaY, r: 90, intensity: 0.92 });
      hotspots.push({ x: cx + 50, y: cy - 90, r: 80, intensity: 0.87 });
    }

    // Render Thermal Gradients on Canvas
    hotspots.forEach(spot => {
      const grad = ctx.createRadialGradient(spot.x, spot.y, 0, spot.x, spot.y, spot.r);
      grad.addColorStop(0, `rgba(239, 68, 68, ${spot.intensity * 0.95})`); // Red (Max activation)
      grad.addColorStop(0.35, `rgba(245, 158, 11, ${spot.intensity * 0.85})`); // Yellow / Orange
      grad.addColorStop(0.65, `rgba(16, 185, 129, ${spot.intensity * 0.6})`); // Green
      grad.addColorStop(0.85, `rgba(6, 182, 212, ${spot.intensity * 0.35})`); // Cyan
      grad.addColorStop(1, 'rgba(0, 0, 255, 0)'); // Blue / Fade to transparent
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(spot.x, spot.y, spot.r, 0, Math.PI * 2);
      ctx.fill();
    });

    return canvas.toDataURL('image/png');
  }

  /**
   * Generates localized clinical evidence and anatomical structures.
   */
  static extractRetinalEvidence(stage = 0) {
    const evidenceList = [];

    if (stage === 0) {
      evidenceList.push({
        id: 'ev-0',
        type: 'Normal Retinal Vasculature',
        category: 'Normal Architecture',
        region: 'Global Fundus (Arcades & Macula)',
        relevance: 96,
        severity: 'Normal',
        description: 'Vessel caliber, A/V ratio (2:3), and optic disc margins are sharp with no visible pathology.',
        simulated: true
      });
      return evidenceList;
    }

    if (stage >= 1) {
      evidenceList.push({
        id: 'ev-1',
        type: 'Microaneurysm (MA)',
        category: 'Microvascular Lesion',
        region: 'Superior Temporal Arcade & Perimacular',
        relevance: stage === 1 ? 92 : 88,
        severity: 'Mild',
        description: 'Focal dilation of retinal capillaries appearing as small circular red dots.',
        simulated: true
      });
    }

    if (stage >= 2) {
      evidenceList.push({
        id: 'ev-2',
        type: 'Hard Exudates (HE)',
        category: 'Lipid Exudation',
        region: 'Macular & Paracentral Fovea',
        relevance: 94,
        severity: 'Moderate',
        description: 'Discrete yellow lipid and lipoprotein deposits with sharp distinct margins caused by vascular leakage.',
        simulated: true
      });
      evidenceList.push({
        id: 'ev-3',
        type: 'Intraretinal Dot/Blot Hemorrhages',
        category: 'Vascular Extravasation',
        region: 'Inferior Temporal Quadrant',
        relevance: 86,
        severity: 'Moderate',
        description: 'Bleeding located in middle retinal layers within outer plexiform and inner nuclear layers.',
        simulated: true
      });
    }

    if (stage >= 3) {
      evidenceList.push({
        id: 'ev-4',
        type: 'Cotton-Wool Spots (CWS)',
        category: 'Ischemia / Nerve Fiber Infarct',
        region: 'Superior Quadrant Nerve Fiber Layer',
        relevance: 95,
        severity: 'Severe',
        description: 'Fluffy white patches representing microinfarctions of the retinal nerve fiber layer.',
        simulated: true
      });
      evidenceList.push({
        id: 'ev-5',
        type: 'Venous Beading & Caliber Changes',
        category: 'Venous Abnormality',
        region: 'Superior Temporal Venous Arcade',
        relevance: 91,
        severity: 'Severe',
        description: 'Segmental constriction and dilation of retinal veins indicating severe local retinal ischemia.',
        simulated: true
      });
    }

    if (stage >= 4) {
      evidenceList.push({
        id: 'ev-6',
        type: 'Neovascularization of Disc (NVD)',
        category: 'Proliferative Vasculopathy',
        region: 'Optic Disc Margin',
        relevance: 99,
        severity: 'Critical / Proliferative',
        description: 'Fragile, abnormal new blood vessels proliferating on the surface of the optic nerve head.',
        simulated: true
      });
      evidenceList.push({
        id: 'ev-7',
        type: 'Preretinal Hemorrhage',
        category: 'Sub-hyaloid Extravasation',
        region: 'Inferior Macular Quadrant',
        relevance: 97,
        severity: 'Critical',
        description: 'Boat-shaped pooling of blood between the neurosensory retina and the posterior vitreous face.',
        simulated: true
      });
    }

    return evidenceList;
  }

  /**
   * Returns anatomical localization landmarks for overlays.
   */
  static getAnatomicalLandmarks(stage = 0) {
    return {
      opticDisc: {
        x: 195,
        y: 300,
        radius: 46,
        label: 'Optic Disc (Cup-to-Disc Ratio: 0.35)',
        status: stage === 4 ? 'Neovascularization Observed' : 'Clear Margins'
      },
      fovea: {
        x: 375,
        y: 315,
        radius: 30,
        label: 'Fovea Centralis (Macula)',
        status: stage >= 2 ? 'Exudates in Perimacular Ring' : 'Intact Foveal Avascular Zone (FAZ)'
      },
      vesselDensity: {
        score: '84.2%',
        caliber: stage >= 3 ? 'Venous Beading / Dilated' : 'Normal Caliber (A/V 2:3)',
        arteriolePattern: stage >= 4 ? 'Neovascular Proliferation' : 'Normal Branching Arcade'
      }
    };
  }

  /**
   * Evaluates DR classification from given stage.
   */
  static evaluateClassification(stage = 0) {
    const drMeta = DR_SEVERITY_LEVELS[stage] || DR_SEVERITY_LEVELS[0];
    
    // Realistic prototype confidence scores
    const confidenceMap = {
      0: 97.4,
      1: 89.2,
      2: 91.8,
      3: 94.6,
      4: 98.1
    };

    return {
      stage: stage,
      level: drMeta.level,
      code: drMeta.code,
      title: drMeta.title,
      shortName: drMeta.shortName,
      description: drMeta.description,
      referable: drMeta.referable,
      confidence: confidenceMap[stage] || 90.0,
      badgeClass: drMeta.badgeClass,
      color: drMeta.color,
      clinicalRecommendation: drMeta.clinicalRecommendation,
      evidence: this.extractRetinalEvidence(stage),
      landmarks: this.getAnatomicalLandmarks(stage),
      timestamp: new Date().toISOString(),
      modelMetadata: {
        architecture: 'Ensemble EfficientNet-B5 + ResNet50-GradCAM (Demo Pipeline)',
        datasetTarget: 'Trained on APTOS 2019 & IDRiD India Retinal Datasets',
        inputResolution: '512x512 RGB Standardized',
        inferenceLatencyMs: 142
      }
    };
  }
}
