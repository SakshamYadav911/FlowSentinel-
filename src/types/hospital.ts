/**
 * Type definitions for FlowSentinel - Hospital Patient Flow & Bottleneck Prediction
 */

export interface Patient {
  patient_id: string;
  age: number;
  gender: 'M' | 'F' | 'Other';
  chronic_conditions_count: number;
  risk_tier: 'Low' | 'Moderate' | 'High' | 'Critical';
  insurance_type?: string;
}

export interface Department {
  department_id: string;
  department_name: string;
  short_code: string;
  category: 'Emergency' | 'Inpatient' | 'Diagnostic' | 'Surgical' | 'Specialty' | 'Discharge';
  bed_capacity: number;
  current_occupancy: number;
  physician_staff: number;
  nurse_staff: number;
  target_turnaround_mins: number;
  sla_wait_mins: number;
  load_ratio: number; // occupancy / capacity
  bottleneck_status: 'Nominal' | 'Warning' | 'Critical';
  active_waitlist_count: number;
  median_wait_time_mins: number;
}

export type EncounterStatus = 'waiting' | 'in_triage' | 'in_consultation' | 'pending_diagnostic' | 'admitted' | 'discharged' | 'completed';
export type AcuityLevel = 1 | 2 | 3 | 4 | 5; // 1 = Resuscitation, 5 = Non-urgent

export interface Encounter {
  encounter_id: string;
  patient_id: string;
  department_id: string;
  arrival_time: string; // ISO string
  triage_time?: string;
  service_start_time?: string;
  service_end_time?: string;
  discharge_time?: string;
  acuity: AcuityLevel;
  wait_time_minutes: number;
  service_duration_minutes: number;
  status: EncounterStatus;
  disposition: 'Discharged' | 'Admitted' | 'Transferred' | 'Pending';
  predicted_delay_probability?: number;
  is_forgotten_patient?: boolean;
  forgotten_reason?: string;
  dwell_time_z_score?: number;
}

export interface DiagnosticTest {
  test_id: string;
  encounter_id: string;
  test_type: 'CT Scan' | 'MRI Scan' | 'Full Blood Panel (CBC)' | 'Troponin / Cardiac' | 'Ultrasound' | 'Chest X-Ray' | 'Urinalysis' | 'Metabolic Panel';
  department_id: string;
  order_time: string;
  start_time?: string;
  result_time?: string;
  turnaround_minutes: number;
  sla_target_minutes: number;
  dli: number; // Diagnostic Latency Index = turnaround / SLA
  is_delayed: boolean;
  status: 'Completed' | 'In Progress' | 'Ordered';
}

export interface PriorityActionItem {
  id: string;
  rank: number;
  department_id: string;
  department_name: string;
  priority_score: number; // Predicted Delay * Volume * Acuity Factor
  predicted_delay_mins: number;
  affected_patient_count: number;
  acuity_factor: number;
  title: string;
  diagnosis_summary: string;
  recommended_action: string;
  action_type: 'staff_reallocation' | 'lab_reroute' | 'triage_surge' | 'bed_discharge';
  confidence_score: number; // 0.0 - 1.0
  primary_driver: string;
  status: 'Pending' | 'Applied' | 'Dismissed';
}

export interface FeatureAttribution {
  feature_name: string;
  impact_minutes: number; // positive = increased delay, negative = decreased delay
  percentage_contribution: number;
  category: 'Staffing' | 'Diagnostic Backlog' | 'Acuity Surge' | 'Bed Scarcity' | 'Temporal Factor';
}

export interface CounterfactualSettings {
  additional_triage_nurses: number; // e.g. 0 to 4
  diagnostic_turnaround_reduction_pct: number; // e.g. 0% to 40%
  observation_surge_beds: number; // e.g. 0 to 10
  reroute_labs_enabled: boolean;
}

export interface SimulationResult {
  baseline_avg_wait_mins: number;
  projected_avg_wait_mins: number;
  minutes_saved_per_patient: number;
  bottlenecks_averted_count: number;
  sla_breaches_prevented: number;
  hospital_efficiency_gain_pct: number;
}

export interface DatasetStats {
  patientCount: number;
  encounterCount: number;
  departmentCount: number;
  diagnosticCount: number;
  activeEncounters: number;
  forgottenPatientsCount: number;
  avgWaitTimeMins: number;
  medianDLI: number;
  isSynthetic: boolean;
  sourceFilename?: string;
}
