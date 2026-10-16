import React from 'react';
import { X, Clock, AlertCircle, CheckCircle2, User, FileText, ArrowRight, Bell, ShieldAlert } from 'lucide-react';
import { Encounter, Patient, DiagnosticTest, Department } from '../types/hospital';

interface PatientJourneyDrawerProps {
  encounter: Encounter | null;
  patient: Patient | null;
  department: Department | null;
  tests: DiagnosticTest[];
  onClose: () => void;
  onExpeditePatient: (encounterId: string) => void;
}

export const PatientJourneyDrawer: React.FC<PatientJourneyDrawerProps> = ({
  encounter,
  patient,
  department,
  tests,
  onClose,
  onExpeditePatient
}) => {
  if (!encounter) return null;

  const associatedTests = tests.filter(t => t.encounter_id === encounter.encounter_id);
  const zScore = encounter.dwell_time_z_score ?? 2.1;

  // Stages calculation
  const arrival = new Date(encounter.arrival_time);
  const triage = encounter.triage_time ? new Date(encounter.triage_time) : null;
  const serviceStart = encounter.service_start_time ? new Date(encounter.service_start_time) : null;
  const discharge = encounter.discharge_time ? new Date(encounter.discharge_time) : null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold bg-slate-900 text-white px-2 py-0.5 rounded">
                {encounter.encounter_id}
              </span>
              <span className="text-xs text-slate-500 font-mono">Patient: {encounter.patient_id}</span>
              {encounter.is_forgotten_patient && (
                <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  Forgotten Patient Flagged
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1">
              Patient Journey & Transition Tracker
            </h2>
            <p className="text-xs text-slate-500">
              Department: <strong className="text-slate-800">{department?.department_name || encounter.department_id}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Patient Demographics & Clinical Profile */}
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/70">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5 flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-slate-600" />
              <span>Clinical Profile & Baseline Risk</span>
            </h3>
            <div className="grid grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">Age & Gender</span>
                <span className="font-semibold text-slate-900 font-mono">{patient?.age || '52'} y/o · {patient?.gender || 'M'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">ESI Acuity</span>
                <span className={`font-semibold font-mono ${encounter.acuity <= 2 ? 'text-rose-600' : 'text-slate-900'}`}>
                  Level {encounter.acuity} {encounter.acuity === 1 ? '(Critical)' : encounter.acuity === 2 ? '(Emergent)' : '(Urgent)'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Risk Tier</span>
                <span className="font-semibold text-slate-900">{patient?.risk_tier || 'High'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Chronic Cond.</span>
                <span className="font-semibold text-slate-900 font-mono">{patient?.chronic_conditions_count || '2'}</span>
              </div>
            </div>
          </div>

          {/* Dwell Anomaly Warning */}
          {encounter.is_forgotten_patient && (
            <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>Statistical Dwell Anomaly (Z-Score: +{zScore}σ)</span>
              </div>
              <p className="text-xs text-rose-900 leading-relaxed font-medium">
                {encounter.forgotten_reason || `Patient transition dwell time (${encounter.wait_time_minutes} mins) exceeds 2 standard deviations for ${department?.department_name || 'department'}. High risk of clinical stagnation.`}
              </p>
              <div className="pt-1 flex items-center justify-between text-[11px] text-rose-700">
                <span>Total Elapsed Wait: <strong className="font-mono font-bold">{encounter.wait_time_minutes} mins</strong></span>
                <span>Dept SLA Target: <strong className="font-mono font-bold">{department?.sla_wait_mins || 30} mins</strong></span>
              </div>
            </div>
          )}

          {/* 4-Stage Patient Journey Timeline */}
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-slate-600" />
              <span>Stage-by-Stage Transition Timeline</span>
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {/* Stage 1 */}
              <div className="relative">
                <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-teal-600 border-2 border-white shadow-xs" />
                <div className="text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">Stage 1: Arrival & Intake</span>
                    <span className="font-mono text-slate-500 text-[11px]">{arrival.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-slate-600 mt-0.5 text-[11px]">
                    Patient checked in at intake kiosk and registered with initial ESI {encounter.acuity}.
                  </p>
                </div>
              </div>

              {/* Stage 2 */}
              <div className="relative">
                <div className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 border-white shadow-xs ${triage ? 'bg-teal-600' : 'bg-slate-300'}`} />
                <div className="text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">Stage 2: Triage Assessment</span>
                    <span className="font-mono text-slate-500 text-[11px]">
                      {triage ? triage.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Pending'}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-0.5 text-[11px]">
                    Vitals logged, nurse initial assessment performed.
                  </p>
                </div>
              </div>

              {/* Stage 3 */}
              <div className="relative">
                <div className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 border-white shadow-xs ${encounter.is_forgotten_patient ? 'bg-rose-600 animate-pulse' : 'bg-teal-600'}`} />
                <div className="text-xs">
                  <div className="flex items-center justify-between">
                    <span className={`font-bold flex items-center gap-1.5 ${encounter.is_forgotten_patient ? 'text-rose-700' : 'text-slate-900'}`}>
                      {encounter.is_forgotten_patient && <span className="text-xs">🚨</span>}
                      <span>Stage 3: Consultation & Diagnostics</span>
                      {encounter.is_forgotten_patient && (
                        <span className="text-[10px] font-extrabold text-white bg-rose-600 px-1.5 py-0.5 rounded shadow-2xs">
                          Time Wasted Danger
                        </span>
                      )}
                    </span>
                    <span className="font-mono text-slate-500 text-[11px]">
                      {serviceStart ? serviceStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Awaiting Physician'}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-0.5 text-[11px]">
                    {associatedTests.length > 0
                      ? `${associatedTests.length} diagnostic test(s) ordered (${associatedTests.map(t => t.test_type).join(', ')}).`
                      : 'Clinical examination and orders pending.'}
                  </p>
                  {encounter.is_forgotten_patient && (
                    <div className="mt-2 p-2 bg-rose-50 border border-rose-200 rounded text-[11px] text-rose-900 font-medium">
                      ⚠️ Stagnation Alert: Excess idle delay of <strong>~{Math.max(25, encounter.wait_time_minutes - 30)} minutes</strong> accumulated in this stage prior to clinical intervention.
                    </div>
                  )}
                </div>
              </div>

              {/* Stage 4 */}
              <div className="relative">
                <div className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 border-white shadow-xs ${discharge ? 'bg-teal-600' : 'bg-slate-300'}`} />
                <div className="text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">Stage 4: Final Disposition</span>
                    <span className="font-mono text-slate-500 text-[11px]">
                      {discharge ? discharge.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : encounter.disposition}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-0.5 text-[11px]">
                    {encounter.disposition === 'Pending' ? 'Awaiting test completion and physician sign-off.' : `Disposition completed: ${encounter.disposition}.`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Diagnostic Tests Table if any */}
          {associatedTests.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
                Ordered Diagnostic Tests ({associatedTests.length})
              </h3>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-3 font-semibold">Test Name</th>
                      <th className="py-2 px-3 font-semibold">Turnaround</th>
                      <th className="py-2 px-3 font-semibold">SLA Target</th>
                      <th className="py-2 px-3 font-semibold text-right">DLI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {associatedTests.map(t => (
                      <tr key={t.test_id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-medium text-slate-900">{t.test_type}</td>
                        <td className="py-2.5 px-3 font-mono tabular-nums text-slate-700">{t.turnaround_minutes}m</td>
                        <td className="py-2.5 px-3 font-mono tabular-nums text-slate-500">{t.sla_target_minutes}m</td>
                        <td className={`py-2.5 px-3 font-mono font-bold tabular-nums text-right ${t.dli > 1.2 ? 'text-rose-600' : 'text-teal-700'}`}>
                          {t.dli}x
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Close View
          </button>
          <button
            onClick={() => {
              onExpeditePatient(encounter.encounter_id);
              onClose();
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Expedite & Notify Attending</span>
          </button>
        </div>
      </div>
    </div>
  );
};
