/**
 * RetinaXAI — Type Definitions & Constants
 * SIH26038: Explainable AI for Diabetic Retinopathy Screening in Rural India
 */

export const DR_SEVERITY_LEVELS = {
  0: {
    level: 0,
    code: 'LEVEL_0',
    title: 'No Apparent DR',
    shortName: 'Level 0 — No DR',
    description: 'No microaneurysms, hemorrhages, or retinal lesions observed. Normal fundus appearance.',
    referable: false,
    color: 'var(--dr-level-0)',
    badgeClass: 'badge-dr-0',
    clinicalRecommendation: 'Routine annual diabetic eye screening recommended. Maintain glycemic control.'
  },
  1: {
    level: 1,
    code: 'LEVEL_1',
    title: 'Mild Non-Proliferative DR (NPDR)',
    shortName: 'Level 1 — Mild NPDR',
    description: 'Microaneurysms only. Earliest clinically detectable stage of diabetic retinopathy.',
    referable: false,
    color: 'var(--dr-level-1)',
    badgeClass: 'badge-dr-1',
    clinicalRecommendation: 'Repeat retinal screening in 6 to 12 months. Advise strict blood glucose and blood pressure monitoring.'
  },
  2: {
    level: 2,
    code: 'LEVEL_2',
    title: 'Moderate Non-Proliferative DR (NPDR)',
    shortName: 'Level 2 — Moderate NPDR',
    description: 'More than just microaneurysms but less than severe NPDR. Hard exudates, cotton-wool spots, or minor blot hemorrhages present.',
    referable: true,
    color: 'var(--dr-level-2)',
    badgeClass: 'badge-dr-2',
    clinicalRecommendation: 'Referral to an ophthalmologist recommended within 2–4 weeks for comprehensive dilated examination.'
  },
  3: {
    level: 3,
    code: 'LEVEL_3',
    title: 'Severe Non-Proliferative DR (NPDR)',
    shortName: 'Level 3 — Severe NPDR',
    description: 'Meets 4-2-1 rule: severe intraretinal hemorrhages in 4 quadrants, venous beading in 2+ quadrants, or IRMA in 1+ quadrant.',
    referable: true,
    color: 'var(--dr-level-3)',
    badgeClass: 'badge-dr-3',
    clinicalRecommendation: 'Urgent ophthalmological referral within 1–2 weeks. High risk of progression to proliferative DR.'
  },
  4: {
    level: 4,
    code: 'LEVEL_4',
    title: 'Proliferative DR (PDR)',
    shortName: 'Level 4 — Proliferative DR',
    description: 'Neovascularization on the optic disc (NVD) or elsewhere (NVE), and/or preretinal or vitreous hemorrhage.',
    referable: true,
    color: 'var(--dr-level-4)',
    badgeClass: 'badge-dr-4',
    clinicalRecommendation: 'High-priority urgent referral to a vitreoretinal specialist within 24–48 hours for consideration of panretinal photocoagulation or anti-VEGF therapy.'
  }
};

export const QUALITY_STATUS = {
  ACCEPTABLE: 'ACCEPTABLE',
  BORDERLINE: 'BORDERLINE',
  UNGRADABLE: 'UNGRADABLE'
};

export const SCREENING_CENTRES = [
  'PHC Rampur — Primary Health Centre (District Ballia)',
  'CHC Kotdwar — Community Health Centre (Pauri Garhwal)',
  'Mobile Retinal Van #3 — Kutch Rural Outreach',
  'Sub-Centre Dharampur — Primary Clinic (Varanasi)',
  'PHC Sunderbans — Delta Medical Station',
  'Tele-Ophthalmology Hub — AIIMS Outreach'
];
