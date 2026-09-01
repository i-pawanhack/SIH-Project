/**
 * RetinaXAI — Pre-Loaded Sample Cases
 * High-fidelity presets for quick testing and SIH Judge demonstrations.
 */

import { ImageProcessor } from '../services/imageProcessor.js';
import { AIService } from '../services/aiService.js';

export const SAMPLE_CASES = [
  {
    id: 'CASE-2026-001',
    patient: {
      id: 'PT-IND-8941',
      name: 'Rameshwar Sharma',
      age: 54,
      gender: 'Male',
      diabetesDuration: '6 Years',
      diabetesStatus: 'Type 2 Diabetes',
      centre: 'PHC Rampur — Primary Health Centre (District Ballia)',
      contact: '+91 98765 43210'
    },
    stage: 0,
    isUngradable: false,
    imageQuality: ImageProcessor.assessImageQuality(false),
    aiResult: AIService.evaluateClassification(0),
    doctorReview: {
      status: 'Reviewed',
      reviewedBy: 'Dr. Ananya Sen (Ophthalmologist, AIIMS)',
      reviewedAt: '2026-08-28T10:15:00Z',
      doctorGrade: 0,
      overrideReason: 'Agreed with AI. Normal fundus with healthy macula.',
      referPatient: false,
      notes: 'Advised routine annual dilated fundus screening. Patient glycemic control stable (HbA1c 6.8%).'
    }
  },
  {
    id: 'CASE-2026-002',
    patient: {
      id: 'PT-IND-7320',
      name: 'Sunita Devi',
      age: 49,
      gender: 'Female',
      diabetesDuration: '8 Years',
      diabetesStatus: 'Type 2 Diabetes',
      centre: 'CHC Kotdwar — Community Health Centre (Pauri Garhwal)',
      contact: '+91 94123 78901'
    },
    stage: 1,
    isUngradable: false,
    imageQuality: ImageProcessor.assessImageQuality(false),
    aiResult: AIService.evaluateClassification(1),
    doctorReview: {
      status: 'Reviewed',
      reviewedBy: 'Dr. Vivek Saxena (Vitreoretinal Specialist)',
      reviewedAt: '2026-08-29T14:30:00Z',
      doctorGrade: 1,
      overrideReason: 'Agreed with AI. Few isolated microaneurysms noted in superior arcade.',
      referPatient: false,
      notes: 'Repeat screening in 6 months. Instructed ASHA worker to follow up on blood pressure medications.'
    }
  },
  {
    id: 'CASE-2026-003',
    patient: {
      id: 'PT-IND-5512',
      name: 'Mohammad Tariq',
      age: 61,
      gender: 'Male',
      diabetesDuration: '14 Years',
      diabetesStatus: 'Type 2 Diabetes',
      centre: 'Mobile Retinal Van #3 — Kutch Rural Outreach',
      contact: '+91 97234 56789'
    },
    stage: 2,
    isUngradable: false,
    imageQuality: ImageProcessor.assessImageQuality(false),
    aiResult: AIService.evaluateClassification(2),
    doctorReview: {
      status: 'Pending',
      reviewedBy: null,
      reviewedAt: null,
      doctorGrade: null,
      overrideReason: '',
      referPatient: true,
      notes: ''
    }
  },
  {
    id: 'CASE-2026-004',
    patient: {
      id: 'PT-IND-4109',
      name: 'Kamla Bai',
      age: 67,
      gender: 'Female',
      diabetesDuration: '18 Years',
      diabetesStatus: 'Type 2 Diabetes',
      centre: 'Sub-Centre Dharampur — Primary Clinic (Varanasi)',
      contact: '+91 98390 12345'
    },
    stage: 3,
    isUngradable: false,
    imageQuality: ImageProcessor.assessImageQuality(false),
    aiResult: AIService.evaluateClassification(3),
    doctorReview: {
      status: 'Reviewed',
      reviewedBy: 'Dr. Ananya Sen (Ophthalmologist, AIIMS)',
      reviewedAt: '2026-08-30T16:45:00Z',
      doctorGrade: 3,
      overrideReason: 'Confirmed Severe NPDR. Extensive blot hemorrhages in all 4 quadrants and cotton wool spots.',
      referPatient: true,
      notes: 'Urgent tele-referral scheduled to District Hospital Eye OPD for Optical Coherence Tomography (OCT) and fluorescein angiography.'
    }
  },
  {
    id: 'CASE-2026-005',
    patient: {
      id: 'PT-IND-9983',
      name: 'Gurdeep Singh',
      age: 58,
      gender: 'Male',
      diabetesDuration: '22 Years',
      diabetesStatus: 'Type 1 Diabetes',
      centre: 'PHC Rampur — Primary Health Centre (District Ballia)',
      contact: '+91 98140 98765'
    },
    stage: 4,
    isUngradable: false,
    imageQuality: ImageProcessor.assessImageQuality(false),
    aiResult: AIService.evaluateClassification(4),
    doctorReview: {
      status: 'Reviewed',
      reviewedBy: 'Dr. Vivek Saxena (Vitreoretinal Specialist)',
      reviewedAt: '2026-08-31T11:20:00Z',
      doctorGrade: 4,
      overrideReason: 'High-risk Proliferative DR confirmed. Disc neovascularization (NVD) fronds present.',
      referPatient: true,
      notes: 'Emergency tertiary referral initiated. Candidate for immediate Panretinal Photocoagulation (PRP) laser therapy.'
    }
  },
  {
    id: 'CASE-2026-006',
    patient: {
      id: 'PT-IND-1044',
      name: 'Parvati Devi',
      age: 72,
      gender: 'Female',
      diabetesDuration: '11 Years',
      diabetesStatus: 'Type 2 Diabetes',
      centre: 'PHC Sunderbans — Delta Medical Station',
      contact: '+91 98300 54321'
    },
    stage: 2,
    isUngradable: true,
    imageQuality: ImageProcessor.assessImageQuality(true),
    aiResult: null, // No prediction for ungradable images
    doctorReview: {
      status: 'Reviewed',
      reviewedBy: 'Dr. Ananya Sen (Ophthalmologist, AIIMS)',
      reviewedAt: '2026-08-31T09:10:00Z',
      doctorGrade: 'UNGRADABLE',
      overrideReason: 'Image ungradable due to media opacity / severe camera defocus blur.',
      referPatient: false,
      notes: 'Requested field worker to perform pupil dilation and recapture image. If cataract obscures fundus, refer for cataract evaluation.'
    }
  }
];
