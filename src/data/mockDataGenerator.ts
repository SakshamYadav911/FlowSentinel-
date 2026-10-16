import {
  Department,
  Patient,
  Encounter,
  DiagnosticTest,
  PriorityActionItem,
  FeatureAttribution,
  DatasetStats,
  AcuityLevel
} from '../types/hospital';

// 12 Hospital Departments matching competition structure
export const INITIAL_DEPARTMENTS: Department[] = [
  {
    department_id: 'DEP-01',
    department_name: 'Emergency & Acute Triage',
    short_code: 'ED-TRIAGE',
    category: 'Emergency',
    bed_capacity: 35,
    current_occupancy: 34,
    physician_staff: 6,
    nurse_staff: 14,
    target_turnaround_mins: 45,
    sla_wait_mins: 30,
    load_ratio: 0.97,
    bottleneck_status: 'Critical',
    active_waitlist_count: 28,
    median_wait_time_mins: 68
  },
  {
    department_id: 'DEP-02',
    department_name: 'Radiology & Advanced Imaging',
    short_code: 'RAD-IMG',
    category: 'Diagnostic',
    bed_capacity: 12,
    current_occupancy: 12,
    physician_staff: 4,
    nurse_staff: 8,
    target_turnaround_mins: 50,
    sla_wait_mins: 40,
    load_ratio: 1.0,
    bottleneck_status: 'Critical',
    active_waitlist_count: 21,
    median_wait_time_mins: 84
  },
  {
    department_id: 'DEP-03',
    department_name: 'Clinical Pathology & Central Lab',
    short_code: 'PATH-LAB',
    category: 'Diagnostic',
    bed_capacity: 20,
    current_occupancy: 17,
    physician_staff: 3,
    nurse_staff: 9,
    target_turnaround_mins: 35,
    sla_wait_mins: 30,
    load_ratio: 0.85,
    bottleneck_status: 'Warning',
    active_waitlist_count: 16,
    median_wait_time_mins: 48
  },
  {
    department_id: 'DEP-04',
    department_name: 'Internal Medicine Consult',
    short_code: 'MED-CONSULT',
    category: 'Inpatient',
    bed_capacity: 45,
    current_occupancy: 41,
    physician_staff: 8,
    nurse_staff: 18,
    target_turnaround_mins: 120,
    sla_wait_mins: 60,
    load_ratio: 0.91,
    bottleneck_status: 'Critical',
    active_waitlist_count: 19,
    median_wait_time_mins: 76
  },
  {
    department_id: 'DEP-05',
    department_name: 'Cardiology & Chest Pain Center',
    short_code: 'CARDIO-CPC',
    category: 'Specialty',
    bed_capacity: 24,
    current_occupancy: 20,
    physician_staff: 5,
    nurse_staff: 11,
    target_turnaround_mins: 60,
    sla_wait_mins: 25,
    load_ratio: 0.83,
    bottleneck_status: 'Warning',
    active_waitlist_count: 12,
    median_wait_time_mins: 42
  },
  {
    department_id: 'DEP-06',
    department_name: 'Trauma & Orthopedic Surgery',
    short_code: 'TRAUMA-ORTHO',
    category: 'Surgical',
    bed_capacity: 22,
    current_occupancy: 15,
    physician_staff: 4,
    nurse_staff: 10,
    target_turnaround_mins: 90,
    sla_wait_mins: 45,
    load_ratio: 0.68,
    bottleneck_status: 'Nominal',
    active_waitlist_count: 7,
    median_wait_time_mins: 34
  },
  {
    department_id: 'DEP-07',
    department_name: 'General Surgery & Pre-Op',
    short_code: 'SURG-PREOP',
    category: 'Surgical',
    bed_capacity: 18,
    current_occupancy: 14,
    physician_staff: 5,
    nurse_staff: 12,
    target_turnaround_mins: 110,
    sla_wait_mins: 50,
    load_ratio: 0.77,
    bottleneck_status: 'Nominal',
    active_waitlist_count: 8,
    median_wait_time_mins: 39
  },
  {
    department_id: 'DEP-08',
    department_name: 'Neurology & Stroke Unit',
    short_code: 'NEURO-SU',
    category: 'Specialty',
    bed_capacity: 16,
    current_occupancy: 13,
    physician_staff: 3,
    nurse_staff: 8,
    target_turnaround_mins: 55,
    sla_wait_mins: 20,
    load_ratio: 0.81,
    bottleneck_status: 'Warning',
    active_waitlist_count: 6,
    median_wait_time_mins: 32
  },
  {
    department_id: 'DEP-09',
    department_name: 'Pediatric Emergency Care',
    short_code: 'PEDS-ED',
    category: 'Emergency',
    bed_capacity: 20,
    current_occupancy: 12,
    physician_staff: 4,
    nurse_staff: 9,
    target_turnaround_mins: 40,
    sla_wait_mins: 25,
    load_ratio: 0.60,
    bottleneck_status: 'Nominal',
    active_waitlist_count: 5,
    median_wait_time_mins: 22
  },
  {
    department_id: 'DEP-10',
    department_name: 'Intensive Care Unit (ICU)',
    short_code: 'ICU-CRIT',
    category: 'Inpatient',
    bed_capacity: 18,
    current_occupancy: 17,
    physician_staff: 4,
    nurse_staff: 16,
    target_turnaround_mins: 240,
    sla_wait_mins: 15,
    load_ratio: 0.94,
    bottleneck_status: 'Critical',
    active_waitlist_count: 9,
    median_wait_time_mins: 55
  },
  {
    department_id: 'DEP-11',
    department_name: 'Inpatient Step-Down & Telemetry',
    short_code: 'STEP-DOWN',
    category: 'Inpatient',
    bed_capacity: 30,
    current_occupancy: 22,
    physician_staff: 4,
    nurse_staff: 10,
    target_turnaround_mins: 180,
    sla_wait_mins: 60,
    load_ratio: 0.73,
    bottleneck_status: 'Nominal',
    active_waitlist_count: 7,
    median_wait_time_mins: 38
  },
  {
    department_id: 'DEP-12',
    department_name: 'Observation & Discharge Lounge',
    short_code: 'DISCH-LOUNGE',
    category: 'Discharge',
    bed_capacity: 25,
    current_occupancy: 23,
    physician_staff: 2,
    nurse_staff: 6,
    target_turnaround_mins: 60,
    sla_wait_mins: 30,
    load_ratio: 0.92,
    bottleneck_status: 'Critical',
    active_waitlist_count: 14,
    median_wait_time_mins: 62
  }
];

// Helper to generate a deterministically seeded set of synthetic data
export function generateSyntheticHospitalData(): {
  patients: Patient[];
  departments: Department[];
  encounters: Encounter[];
  diagnosticTests: DiagnosticTest[];
  priorityActions: PriorityActionItem[];
  stats: DatasetStats;
} {
  const departments = [...INITIAL_DEPARTMENTS];
  const now = new Date();

  // 1. Generate 2,000 Patient Profiles
  const patients: Patient[] = [];
  const riskTiers: Array<Patient['risk_tier']> = ['Low', 'Moderate', 'High', 'Critical'];
  const genders: Array<Patient['gender']> = ['M', 'F', 'Other'];
  const insurancePlans = ['Commercial HMO', 'Medicare Advantage', 'Medicaid State', 'PPO Choice', 'Self-Pay'];

  for (let i = 1; i <= 2000; i++) {
    const padId = String(i).padStart(4, '0');
    const age = 18 + Math.floor(pseudoRandom(i * 13) * 75);
    const chronicCount = age > 65 ? Math.floor(pseudoRandom(i * 29) * 4) + 1 : Math.floor(pseudoRandom(i * 17) * 3);
    const riskTier =
      chronicCount >= 3 || age > 75
        ? 'Critical'
        : chronicCount >= 2
        ? 'High'
        : chronicCount === 1
        ? 'Moderate'
        : 'Low';

    patients.push({
      patient_id: `P-${padId}`,
      age,
      gender: genders[Math.floor(pseudoRandom(i * 7) * 3)],
      chronic_conditions_count: chronicCount,
      risk_tier: riskTier,
      insurance_type: insurancePlans[Math.floor(pseudoRandom(i * 11) * 5)]
    });
  }

  // 2. Generate 8,000 Encounters across 7 days
  const encounters: Encounter[] = [];
  const statuses: Encounter['status'][] = [
    'completed',
    'completed',
    'completed',
    'in_consultation',
    'pending_diagnostic',
    'waiting',
    'in_triage',
    'admitted'
  ];

  // Mean & standard deviation of wait times for z-score detection
  const baseMeanWait = 44;
  const baseStdWait = 22;

  for (let i = 1; i <= 8000; i++) {
    const encId = `ENC-${String(i).padStart(5, '0')}`;
    const patientIndex = Math.floor(pseudoRandom(i * 31) * 2000);
    const patient = patients[patientIndex];
    const dept = departments[Math.floor(pseudoRandom(i * 19) * departments.length)];

    // Arrival within last 7 days (or last few hours for active encounters)
    const hoursAgo = Math.floor(pseudoRandom(i * 53) * 168);
    const arrivalDate = new Date(now.getTime() - hoursAgo * 3600 * 1000 - Math.floor(pseudoRandom(i * 101) * 3600 * 1000));
    
    // Acuity 1 to 5 (ESI)
    const acuitySeed = pseudoRandom(i * 47);
    const acuity: AcuityLevel =
      acuitySeed < 0.05 ? 1 : acuitySeed < 0.22 ? 2 : acuitySeed < 0.65 ? 3 : acuitySeed < 0.9 ? 4 : 5;

    // Wait time correlated with department load ratio & acuity
    const baselineWait = dept.median_wait_time_mins * (0.6 + pseudoRandom(i * 71) * 0.9);
    const acuityAdjustment = (6 - acuity) * 4; // High acuity waited less in triage, or prolonged in care
    const calculatedWait = Math.max(8, Math.round(baselineWait + (dept.load_ratio > 0.85 ? 25 : 0) - acuityAdjustment));

    const durationMins = Math.round(dept.target_turnaround_mins * (0.8 + pseudoRandom(i * 89) * 0.8));

    // Calculate dates
    const triageDate = new Date(arrivalDate.getTime() + Math.min(calculatedWait * 60 * 1000 * 0.35, 30 * 60 * 1000));
    const serviceStartDate = new Date(arrivalDate.getTime() + calculatedWait * 60 * 1000);
    const serviceEndDate = new Date(serviceStartDate.getTime() + durationMins * 60 * 1000);
    const dischargeDate = new Date(serviceEndDate.getTime() + 20 * 60 * 1000);

    const isRecent = hoursAgo < 12;
    const assignedStatus = isRecent
      ? statuses[Math.floor(pseudoRandom(i * 97) * statuses.length)]
      : 'completed';

    const zScore = Number(((calculatedWait - baseMeanWait) / baseStdWait).toFixed(2));
    
    // Forgotten patient detection rule:
    // Exceeds 2 sigma (zScore > 2.0) OR pending diagnostic for > 60m OR in waiting status for > 75m
    const isForgotten = (zScore > 2.1 && assignedStatus !== 'completed') || 
      (assignedStatus === 'pending_diagnostic' && calculatedWait > 65) ||
      (assignedStatus === 'waiting' && calculatedWait > 80);

    let forgottenReason = undefined;
    if (isForgotten) {
      if (assignedStatus === 'pending_diagnostic') {
        forgottenReason = 'Diagnostic turnaround exceeded SLA (+52m); Physician unnotified of ready results';
      } else if (dept.department_id === 'DEP-02') {
        forgottenReason = 'Radiology queue overflow; patient stranded in corridor waiting bay for 94 mins';
      } else if (assignedStatus === 'waiting') {
        forgottenReason = 'Triage completed 88m ago; no consult assigned due to high-acuity resuscitation divert';
      } else {
        forgottenReason = `Elapsed dwell time (${calculatedWait}m) exceeds 2 standard deviations (Z=${zScore})`;
      }
    }

    const predictedDelayProb = Number((Math.min(0.96, Math.max(0.08, (dept.load_ratio * 0.6) + (calculatedWait / 150) + (acuity <= 2 ? 0.2 : 0)))).toFixed(2));

    encounters.push({
      encounter_id: encId,
      patient_id: patient.patient_id,
      department_id: dept.department_id,
      arrival_time: arrivalDate.toISOString(),
      triage_time: triageDate.toISOString(),
      service_start_time: serviceStartDate.toISOString(),
      service_end_time: assignedStatus === 'completed' ? serviceEndDate.toISOString() : undefined,
      discharge_time: assignedStatus === 'completed' ? dischargeDate.toISOString() : undefined,
      acuity,
      wait_time_minutes: calculatedWait,
      service_duration_minutes: durationMins,
      status: assignedStatus,
      disposition: assignedStatus === 'completed' ? (acuity <= 2 ? 'Admitted' : 'Discharged') : 'Pending',
      predicted_delay_probability: predictedDelayProb,
      is_forgotten_patient: isForgotten,
      forgotten_reason: forgottenReason,
      dwell_time_z_score: zScore
    });
  }

  // 3. Generate 5,000 Diagnostic Tests linked to encounters
  const diagnosticTests: DiagnosticTest[] = [];
  const testTypes: Array<DiagnosticTest['test_type']> = [
    'CT Scan',
    'MRI Scan',
    'Full Blood Panel (CBC)',
    'Troponin / Cardiac',
    'Ultrasound',
    'Chest X-Ray',
    'Urinalysis',
    'Metabolic Panel'
  ];

  const testSLAs: Record<DiagnosticTest['test_type'], number> = {
    'Full Blood Panel (CBC)': 35,
    'Troponin / Cardiac': 30,
    'Urinalysis': 25,
    'Metabolic Panel': 35,
    'Chest X-Ray': 40,
    'Ultrasound': 50,
    'CT Scan': 60,
    'MRI Scan': 90
  };

  for (let i = 1; i <= 5000; i++) {
    const testId = `TEST-${String(i).padStart(5, '0')}`;
    const encIndex = Math.floor(pseudoRandom(i * 41) * encounters.length);
    const enc = encounters[encIndex];
    const testType = testTypes[Math.floor(pseudoRandom(i * 23) * testTypes.length)];
    const sla = testSLAs[testType];

    const orderTime = new Date(new Date(enc.arrival_time).getTime() + 25 * 60 * 1000);
    
    // Add realistic delay distribution: Imaging tests suffer 40% more congestion
    const congestionFactor = (testType === 'CT Scan' || testType === 'Ultrasound') ? 1.45 : 1.05;
    const turnaround = Math.round(sla * congestionFactor * (0.65 + pseudoRandom(i * 67) * 0.9));
    const dli = Number((turnaround / sla).toFixed(2));
    const isDelayed = dli > 1.25;

    const resultTime = new Date(orderTime.getTime() + turnaround * 60 * 1000);

    diagnosticTests.push({
      test_id: testId,
      encounter_id: enc.encounter_id,
      test_type: testType,
      department_id: (testType === 'CT Scan' || testType === 'MRI Scan' || testType === 'Chest X-Ray' || testType === 'Ultrasound') ? 'DEP-02' : 'DEP-03',
      order_time: orderTime.toISOString(),
      start_time: new Date(orderTime.getTime() + 10 * 60 * 1000).toISOString(),
      result_time: resultTime.toISOString(),
      turnaround_minutes: turnaround,
      sla_target_minutes: sla,
      dli,
      is_delayed: isDelayed,
      status: 'Completed'
    });
  }

  // 4. Generate "What should we investigate first?" Action Priority Queue
  // Ranked by: Priority Score = Predicted Delay (mins) * Volume of Affected Patients * Acuity Factor
  const priorityActions: PriorityActionItem[] = [
    {
      id: 'ACT-01',
      rank: 1,
      department_id: 'DEP-02',
      department_name: 'Radiology & Advanced Imaging',
      priority_score: 1848, // 84m * 22 patients * 1.0
      predicted_delay_mins: 84,
      affected_patient_count: 22,
      acuity_factor: 1.0,
      title: 'CT Scan & Ultrasound Queue Saturation',
      diagnosis_summary: 'Turnaround is 178% of SLA. 22 patients actively backed up in transition awaiting consult interpretation.',
      recommended_action: 'Dispatch secondary imaging technician to CT Unit 2 and reroute 5 ultrasound orders to outpatient overflow wing.',
      action_type: 'lab_reroute',
      confidence_score: 0.94,
      primary_driver: 'Staffing Deficit (+34m) & Multi-Slice Scanner Bottleneck (+28m)',
      status: 'Pending'
    },
    {
      id: 'ACT-02',
      rank: 2,
      department_id: 'DEP-01',
      department_name: 'Emergency & Acute Triage',
      priority_score: 1632, // 68m * 24 patients * 1.0
      predicted_delay_mins: 68,
      affected_patient_count: 24,
      acuity_factor: 1.0,
      title: 'ESI-2/3 Triage-to-Consult Cascade Delay',
      diagnosis_summary: 'Intake velocity is 3.8 patients/hr above capacity. Dwell time between triage completion and rooming is 52m.',
      recommended_action: 'Activate Rapid Assessment & Float Nurse to initialize bedside workups before physical bed assignment.',
      action_type: 'triage_surge',
      confidence_score: 0.91,
      primary_driver: 'Arrival Wave (+31m) & Inpatient Bed Hold (+24m)',
      status: 'Pending'
    },
    {
      id: 'ACT-03',
      rank: 3,
      department_id: 'DEP-12',
      department_name: 'Observation & Discharge Lounge',
      priority_score: 1116, // 62m * 18 patients * 1.0
      predicted_delay_mins: 62,
      affected_patient_count: 18,
      acuity_factor: 0.85,
      title: 'Discharge Order Signature Stagnation',
      diagnosis_summary: '14 patients are medically cleared but occupying acute observation beds pending pharmacy prescription reconciliation.',
      recommended_action: 'Expedite discharge nurse signature queue and authorize bedside meds courier delivery.',
      action_type: 'bed_discharge',
      confidence_score: 0.88,
      primary_driver: 'Pharmacy Verification Lag (+36m) & Transport Delay (+18m)',
      status: 'Pending'
    },
    {
      id: 'ACT-04',
      rank: 4,
      department_id: 'DEP-04',
      department_name: 'Internal Medicine Consult',
      priority_score: 1064, // 76m * 14 patients * 1.0
      predicted_delay_mins: 76,
      affected_patient_count: 14,
      acuity_factor: 0.95,
      title: 'Specialty Attending Sign-Off Backlog',
      diagnosis_summary: 'Consult requests pending over 75 minutes. 8 patients awaiting final disposition order.',
      recommended_action: 'Reallocate 2 float hospitalists to cross-cover acute floor admissions for the next 90 minutes.',
      action_type: 'staff_reallocation',
      confidence_score: 0.86,
      primary_driver: 'Simultaneous Admission Surge (+42m)',
      status: 'Pending'
    },
    {
      id: 'ACT-05',
      rank: 5,
      department_id: 'DEP-03',
      department_name: 'Clinical Pathology & Central Lab',
      priority_score: 720, // 48m * 15 patients * 1.0
      predicted_delay_mins: 48,
      affected_patient_count: 15,
      acuity_factor: 0.8,
      title: 'Troponin & Stat Chemistry Centrifuge Delay',
      diagnosis_summary: 'STAT batching queue length exceeded threshold. Cardiac marker turnaround at 145% of SLA.',
      recommended_action: 'Prioritize stat cardiac centrifuge line and switch routine wellness panels to deferred batching.',
      action_type: 'lab_reroute',
      confidence_score: 0.89,
      primary_driver: 'Centrifuge Maintenance Slot (+22m)',
      status: 'Pending'
    }
  ];

  const activeEncounters = encounters.filter(e => e.status !== 'completed').length;
  const forgottenCount = encounters.filter(e => e.is_forgotten_patient).length;
  const avgWait = Math.round(encounters.reduce((acc, curr) => acc + curr.wait_time_minutes, 0) / encounters.length);
  const medianDLI = Number((diagnosticTests.reduce((acc, curr) => acc + curr.dli, 0) / diagnosticTests.length).toFixed(2));

  const stats: DatasetStats = {
    patientCount: patients.length,
    encounterCount: encounters.length,
    departmentCount: departments.length,
    diagnosticCount: diagnosticTests.length,
    activeEncounters,
    forgottenPatientsCount: forgottenCount,
    avgWaitTimeMins: avgWait,
    medianDLI,
    isSynthetic: true,
    sourceFilename: 'FlowSentinel Standard Baseline (15,012 rows)'
  };

  return {
    patients,
    departments,
    encounters,
    diagnosticTests,
    priorityActions,
    stats
  };
}

// SHAP Feature Attribution generator for explainability drawer
export function getSHAPWaterfallForDepartment(deptId: string): FeatureAttribution[] {
  switch (deptId) {
    case 'DEP-02': // Radiology
      return [
        { feature_name: 'Staffing Deficit (Techs on Shift)', impact_minutes: 32, percentage_contribution: 38, category: 'Staffing' },
        { feature_name: 'CT Scanner 2 Queue Depth (>18 pending)', impact_minutes: 26, percentage_contribution: 31, category: 'Diagnostic Backlog' },
        { feature_name: 'High-Acuity Stroke Protocol Priority Diverts', impact_minutes: 15, percentage_contribution: 18, category: 'Acuity Surge' },
        { feature_name: 'Patient Transport Transit Dwell Time', impact_minutes: 11, percentage_contribution: 13, category: 'Bed Scarcity' }
      ];
    case 'DEP-01': // ED Triage
      return [
        { feature_name: 'Arrival Velocity Spike (14:00-18:00 Peak)', impact_minutes: 28, percentage_contribution: 41, category: 'Temporal Factor' },
        { feature_name: 'Inpatient Bed Blockade (Cannot transfer admitted)', impact_minutes: 22, percentage_contribution: 32, category: 'Bed Scarcity' },
        { feature_name: 'Triage Nurse Caseload Exceeds Ratio 1:6', impact_minutes: 12, percentage_contribution: 18, category: 'Staffing' },
        { feature_name: 'Pending POC Lab Results', impact_minutes: 6, percentage_contribution: 9, category: 'Diagnostic Backlog' }
      ];
    case 'DEP-12': // Observation Lounge
      return [
        { feature_name: 'Inpatient Pharmacy Discharge Meds Lag', impact_minutes: 34, percentage_contribution: 55, category: 'Diagnostic Backlog' },
        { feature_name: 'Wheelchair / Non-Emergency Transport Hold', impact_minutes: 16, percentage_contribution: 26, category: 'Bed Scarcity' },
        { feature_name: 'Pending Attending Discharge Signature', impact_minutes: 12, percentage_contribution: 19, category: 'Staffing' }
      ];
    default:
      return [
        { feature_name: 'Active Patient Volume vs Capacity Ratio', impact_minutes: 22, percentage_contribution: 45, category: 'Bed Scarcity' },
        { feature_name: 'Diagnostic Result Turnaround Exceeding SLA', impact_minutes: 14, percentage_contribution: 29, category: 'Diagnostic Backlog' },
        { feature_name: 'Physician Shift Changeover Handoff Dwell', impact_minutes: 8, percentage_contribution: 16, category: 'Staffing' },
        { feature_name: 'Triage Acuity Clustering (ESI Tier 2-3)', impact_minutes: 5, percentage_contribution: 10, category: 'Acuity Surge' }
      ];
  }
}

// Pseudo random generator for reproducible mock data
function pseudoRandom(seed: number): number {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}
