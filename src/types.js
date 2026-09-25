/**
 * Drish Kalyan — Type Definitions & Constants
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
  'PHC Bareilly — Primary Health Centre (District Bareilly)',
  'CHC Nawabganj — Community Health Centre (District Bareilly)',
  'District Hospital Bareilly — Tele-Ophthalmology Hub (Bareilly)',
  '300 Bed Hospital Bareilly — Super Specialty Hub (District Bareilly)',
  'CHC Lucknow — Community Health Centre (District Lucknow)',
  'Sun Eye Hospital & Laser Centre — Tele-Hub (District Lucknow)',
  'PHC Tilhar — Primary Health Centre (District Shahjahanpur)',
  'Jagmohan Lal Eye Hospital — Tele-Hub (District Shahjahanpur)',
  'PHC Misrikh — Primary Health Centre (District Sitapur)',
  'Sitapur Eye Hospital — Tele-Ophthalmology Hub (District Sitapur)',
  'PHC Dharampur — Primary Health Centre (District Varanasi)',
  'Shree Hanumant Vision Care — Tele-Hub (District Varanasi)',
  'CHC Gorakhpur — Community Health Centre (District Gorakhpur)',
  'Gorakhpur Eye Hospital — Tele-Hub (District Gorakhpur)',
  'PHC Badaun — Primary Health Centre (District Badaun)',
  'District Hospital Badaun — Tele-Ophthalmology Hub (Badaun)',
  'PHC Pilibhit — Primary Health Centre (District Pilibhit)',
  'Pilibhit Eye Centre — Tele-Hub (District Pilibhit)',
  'PHC Hardoi — Primary Health Centre (District Hardoi)',
  'Hardoi Eye Centre — Tele-Hub (District Hardoi)',
  'PHC Patna — Primary Health Centre (District Patna)',
  'Sharp Sight Eye Hospital — Tele-Hub (District Patna)',
  'PHC Bhopal — Primary Health Centre (District Bhopal)',
  'Ajwani Eye Care — Tele-Hub (District Bhopal)'
];

export const DISTRICT_OPHTHALMOLOGISTS = {
  'Bareilly': {
    district: 'Bareilly',
    state: 'Uttar Pradesh',
    doctorName: 'Dr. Sanjeev Kohli',
    hospital: 'Amritsar Eye Centre',
    speciality: 'Vitreoretinal Specialist',
    mciNo: 'MCI-UP-48210',
    doctors: [
      { name: 'Dr. Sanjeev Kohli', hospital: 'Amritsar Eye Centre', speciality: 'Vitreoretinal Specialist', mciNo: 'MCI-UP-48210' },
      { name: 'Dr. Vasu Kumar Saxena', hospital: 'Dr. Vasu Eye Hospital', speciality: 'Eye Surgeon & Ophthalmologist', mciNo: 'MCI-UP-52190' },
      { name: 'Dr. Kapil Agarwal', hospital: 'EyNova Eye Hospital', speciality: 'Cataract & Refractive Specialist', mciNo: 'MCI-UP-58312' }
    ]
  },
  'Lucknow': {
    district: 'Lucknow',
    state: 'Uttar Pradesh',
    doctorName: 'Dr. Sudhir Srivastava',
    hospital: 'Sun Eye Hospital & Laser Centre',
    speciality: 'Ophthalmologist & Laser Specialist',
    mciNo: 'MCI-UP-55102',
    doctors: [
      { name: 'Dr. Sudhir Srivastava', hospital: 'Sun Eye Hospital & Laser Centre', speciality: 'Ophthalmologist & Laser Specialist', mciNo: 'MCI-UP-55102' },
      { name: 'Dr. Vinay Kumar Garg', hospital: 'Garg Ophthalmic Centre', speciality: 'Senior Eye Specialist', mciNo: 'MCI-UP-41920' }
    ]
  },
  'Shahjahanpur': {
    district: 'Shahjahanpur',
    state: 'Uttar Pradesh',
    doctorName: 'Dr. Manmohan Lal Gupta',
    hospital: 'Jagmohan Lal Eye & ENT Hospital',
    speciality: 'Ophthalmologist',
    mciNo: 'MCI-UP-39182',
    doctors: [
      { name: 'Dr. Manmohan Lal Gupta', hospital: 'Jagmohan Lal Eye & ENT Hospital', speciality: 'Ophthalmologist', mciNo: 'MCI-UP-39182' },
      { name: 'Dr. Rupesh Seth', hospital: 'Kunti Devi Eye Hospital', speciality: 'Eye Care Specialist', mciNo: 'MCI-UP-49821' }
    ]
  },
  'Sitapur': {
    district: 'Sitapur',
    state: 'Uttar Pradesh',
    doctorName: 'Col. (Dr.) Madhu Bhadauria',
    hospital: 'Sitapur Eye Hospital',
    speciality: 'Ophthalmologist & Director',
    mciNo: 'MCI-UP-61044',
    doctors: [
      { name: 'Col. (Dr.) Madhu Bhadauria', hospital: 'Sitapur Eye Hospital', speciality: 'Ophthalmologist & Director', mciNo: 'MCI-UP-61044' }
    ]
  },
  'Varanasi': {
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    doctorName: 'Dr. Praveen Kumar Chaturvedi',
    hospital: 'Shree Hanumant Vision Care',
    speciality: 'Retina Specialist',
    mciNo: 'MCI-UP-44910',
    doctors: [
      { name: 'Dr. Praveen Kumar Chaturvedi', hospital: 'Shree Hanumant Vision Care', speciality: 'Retina Specialist', mciNo: 'MCI-UP-44910' },
      { name: 'Dr. Priyanka Jain', hospital: 'Jain Netralaya', speciality: 'Ophthalmologist', mciNo: 'MCI-UP-53210' }
    ]
  },
  'Gorakhpur': {
    district: 'Gorakhpur',
    state: 'Uttar Pradesh',
    doctorName: 'Dr. Rahul Agrawal',
    hospital: 'Gorakhpur Eye Hospital',
    speciality: 'Ophthalmologist',
    mciNo: 'MCI-UP-51023',
    doctors: [
      { name: 'Dr. Rahul Agrawal', hospital: 'Gorakhpur Eye Hospital', speciality: 'Ophthalmologist', mciNo: 'MCI-UP-51023' },
      { name: 'Dr. B. N. Gupta', hospital: 'Gupta Eye Hospital', speciality: 'Eye Surgeon', mciNo: 'MCI-UP-38102' }
    ]
  },
  'Badaun': {
    district: 'Badaun',
    state: 'Uttar Pradesh',
    doctorName: 'Dr. Ashok Kumar',
    hospital: 'District Hospital / Eye Specialist',
    speciality: 'Senior Medical Officer / Eye Specialist',
    mciNo: 'MCI-UP-47120',
    doctors: [
      { name: 'Dr. Ashok Kumar', hospital: 'District Hospital / Eye Specialist', speciality: 'Senior Medical Officer / Eye Specialist', mciNo: 'MCI-UP-47120' },
      { name: 'Dr. Dileep Varshney', hospital: 'Varshney Eye Clinic', speciality: 'Eye Specialist', mciNo: 'MCI-UP-50291' }
    ]
  },
  'Pilibhit': {
    district: 'Pilibhit',
    state: 'Uttar Pradesh',
    doctorName: 'Dr. Dayanand Singh',
    hospital: 'Pilibhit Eye Centre',
    speciality: 'Ophthalmologist',
    mciNo: 'MCI-UP-43290',
    doctors: [
      { name: 'Dr. Dayanand Singh', hospital: 'Pilibhit Eye Centre', speciality: 'Ophthalmologist', mciNo: 'MCI-UP-43290' },
      { name: 'Dr. Vipin Sahani', hospital: 'Kaushalya Devi Eye Hospital', speciality: 'Eye Surgeon', mciNo: 'MCI-UP-57819' }
    ]
  },
  'Hardoi': {
    district: 'Hardoi',
    state: 'Uttar Pradesh',
    doctorName: 'Dr. Vinod Kumar Kashyap',
    hospital: 'Hardoi Eye Centre',
    speciality: 'Eye Specialist',
    mciNo: 'MCI-UP-46102',
    doctors: [
      { name: 'Dr. Vinod Kumar Kashyap', hospital: 'Hardoi Eye Centre', speciality: 'Eye Specialist', mciNo: 'MCI-UP-46102' },
      { name: 'Dr. Dilpreet Singh', hospital: 'Angel Eyes Institute of Ophthalmology / Eye Care', speciality: 'Retinal & Refractive Specialist', mciNo: 'MCI-UP-59012' }
    ]
  },
  'Patna': {
    district: 'Patna',
    state: 'Bihar',
    doctorName: 'Dr. Rajneesh Sinha',
    hospital: 'Sharp Sight Eye Hospital',
    speciality: 'Vitreoretinal Surgeon',
    mciNo: 'MCI-BR-38291',
    doctors: [
      { name: 'Dr. Rajneesh Sinha', hospital: 'Sharp Sight Eye Hospital', speciality: 'Vitreoretinal Surgeon', mciNo: 'MCI-BR-38291' }
    ]
  },
  'Bhopal': {
    district: 'Bhopal',
    state: 'Madhya Pradesh',
    doctorName: 'Dr. M. K. Ajwani',
    hospital: 'Ajwani Eye Care',
    speciality: 'Senior Eye Surgeon',
    mciNo: 'MCI-MP-29104',
    doctors: [
      { name: 'Dr. M. K. Ajwani', hospital: 'Ajwani Eye Care', speciality: 'Senior Eye Surgeon', mciNo: 'MCI-MP-29104' }
    ]
  }
};

