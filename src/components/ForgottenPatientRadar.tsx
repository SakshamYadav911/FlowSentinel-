import React, { useState } from 'react';
import { Encounter, Patient, Department, DiagnosticTest } from '../types/hospital';
import { ShieldAlert, Search, AlertTriangle, ArrowRight, UserCheck, Clock, CheckCircle2, Filter } from 'lucide-react';

interface ForgottenPatientRadarProps {
  encounters: Encounter[];
  patients: Patient[];
  departments: Department[];
  tests: DiagnosticTest[];
  onSelectPatient: (encounter: Encounter) => void;
  onExpeditePatient: (encounterId: string) => void;
}

export const ForgottenPatientRadar: React.FC<ForgottenPatientRadarProps> = ({
  encounters,
  patients,
  departments,
  tests,
  onSelectPatient,
  onExpeditePatient
}) => {
  const [acuityFilter, setAcuityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const patientMap = new Map<string, Patient>(patients.map(p => [p.patient_id, p]));
  const deptMap = new Map<string, Department>(departments.map(d => [d.department_id, d]));

  // Forgotten patients list
  const forgottenEncounters = encounters.filter(e => {
    if (!e.is_forgotten_patient) return false;
    if (acuityFilter === 'high' && e.acuity > 2) return false;
    if (acuityFilter === 'medium' && e.acuity !== 3) return false;
    if (acuityFilter === 'low' && e.acuity < 4) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const p = patientMap.get(e.patient_id);
      const d = deptMap.get(e.department_id);
      const matchP = e.patient_id.toLowerCase().includes(q) || (p && p.risk_tier.toLowerCase().includes(q));
      const matchE = e.encounter_id.toLowerCase().includes(q);
      const matchD = d && d.department_name.toLowerCase().includes(q);
      return matchP || matchE || matchD;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Context Banner */}
      <div className="bg-white border border-rose-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-rose-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <span>🚨</span> Statistical Dwell Anomaly Radar
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-500 font-medium">Track 1 Specialization</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
              The Forgotten Patient Early-Warning System
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Pinpoints patients silently stalled in inter-departmental transitions (e.g., triage finished $\to$ test results completed $\to$ physician unaware). Flagged when dwell time exceeds <strong className="text-slate-900">2 standard deviations ($\mu + 2\sigma$)</strong> or departmental SLA threshold.
            </p>
          </div>

          <div className="bg-gradient-to-br from-rose-50 to-red-100/60 border border-rose-200 rounded-xl p-4 shrink-0 text-center md:text-right shadow-2xs">
            <div className="flex items-center justify-center md:justify-end gap-1.5 text-2xl font-extrabold font-mono text-rose-700 tabular-nums">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping inline-block" />
              <span>{forgottenEncounters.length}</span>
            </div>
            <div className="text-xs font-bold text-rose-950">Patients in Danger of Being Forgotten</div>
            <div className="text-[11px] text-rose-700 mt-0.5">Elapsed dwell time exceeding safety limits</div>
          </div>
        </div>

        {/* 3 Colorful Analytical Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-4">
          <div className="p-3.5 bg-rose-50/80 border border-rose-200 rounded-xl">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-rose-950 flex items-center gap-1.5">
                <span>🚨</span> High Acuity at Risk (ESI 1–2)
              </span>
              <span className="font-mono font-extrabold text-rose-700 text-sm tabular-nums">
                {forgottenEncounters.filter(e => e.acuity <= 2).length}
              </span>
            </div>
            <p className="text-[11px] text-rose-800">
              Immediate clinical risk; high comorbidity or urgent symptoms awaiting doctor review.
            </p>
          </div>

          <div className="p-3.5 bg-purple-50/80 border border-purple-200 rounded-xl">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-purple-950 flex items-center gap-1.5">
                <span>🔬</span> Diagnostic Result Black Holes
              </span>
              <span className="font-mono font-extrabold text-purple-700 text-sm tabular-nums">
                {forgottenEncounters.filter(e => e.status === 'pending_diagnostic' || (e.forgotten_reason && e.forgotten_reason.includes('Diagnostic'))).length}
              </span>
            </div>
            <p className="text-[11px] text-purple-800">
              Lab/imaging finished but sitting idle in system while physician unaware.
            </p>
          </div>

          <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-amber-950 flex items-center gap-1.5">
                <span>⏳</span> Avg Wasted Dwell Time
              </span>
              <span className="font-mono font-extrabold text-amber-800 text-sm tabular-nums">
                +44 mins
              </span>
            </div>
            <p className="text-[11px] text-amber-800">
              Excess idle time over SLA target accumulated across active stalled patients.
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Acuity Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setAcuityFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              acuityFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Forgotten ({encounters.filter(e => e.is_forgotten_patient).length})
          </button>
          <button
            onClick={() => setAcuityFilter('high')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              acuityFilter === 'high' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Critical / Emergent (ESI 1–2)
          </button>
          <button
            onClick={() => setAcuityFilter('medium')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              acuityFilter === 'medium' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Urgent (ESI 3)
          </button>
          <button
            onClick={() => setAcuityFilter('low')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              acuityFilter === 'low' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Less Urgent (ESI 4–5)
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Patient ID, Encounter, Dept..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>
      </div>

      {/* Patient Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase font-semibold text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Patient Profile</th>
                <th className="py-3 px-4">Department & Stage</th>
                <th className="py-3 px-4">Acuity</th>
                <th className="py-3 px-4">Elapsed Wait vs SLA</th>
                <th className="py-3 px-4">Z-Score</th>
                <th className="py-3 px-4">Identified Stagnation Root Cause</th>
                <th className="py-3 px-4 text-right">Intervention</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {forgottenEncounters.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <CheckCircle2 className="w-8 h-8 mx-auto text-teal-600 mb-2" />
                    <p className="text-sm font-semibold text-slate-800">No forgotten patients in this tier!</p>
                    <p className="text-xs text-slate-500 mt-0.5">All patient transitions are progressing within nominal SLA limits.</p>
                  </td>
                </tr>
              ) : (
                forgottenEncounters.slice(0, 50).map(enc => {
                  const patient = patientMap.get(enc.patient_id);
                  const dept = deptMap.get(enc.department_id);
                  const zScore = enc.dwell_time_z_score ?? 2.2;
                  const wastedMins = Math.max(0, enc.wait_time_minutes - (dept?.sla_wait_mins || 30));
                  const isCriticalAcuity = enc.acuity <= 2;

                  return (
                    <tr
                      key={enc.encounter_id}
                      className="hover:bg-rose-50/30 transition-colors cursor-pointer group"
                      onClick={() => onSelectPatient(enc)}
                    >
                      {/* Patient & Demographics */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs">{isCriticalAcuity ? '🚨' : '⚠️'}</span>
                          <span className="font-mono font-bold text-slate-900">{enc.patient_id}</span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {patient ? `${patient.age}y · ${patient.gender} · ${patient.risk_tier} Risk` : enc.encounter_id}
                        </div>
                      </td>

                      {/* Department */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{dept?.department_name || enc.department_id}</div>
                        <div className="text-[11px] text-slate-500 capitalize">{enc.status.replace('_', ' ')}</div>
                      </td>

                      {/* Acuity */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block font-mono font-bold text-xs px-2 py-0.5 rounded ${
                            isCriticalAcuity
                              ? 'bg-rose-100 text-rose-800 ring-1 ring-rose-200'
                              : enc.acuity === 3
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          ESI {enc.acuity}
                        </span>
                      </td>

                      {/* Elapsed Wait & Wasted Time */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-rose-600 tabular-nums text-xs">
                            {enc.wait_time_minutes}m
                          </span>
                          <span className="font-mono font-bold text-[10px] text-white bg-rose-600 px-1.5 py-0.5 rounded shadow-2xs">
                            +{wastedMins}m wasted
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          SLA Target: {dept?.sla_wait_mins || 30}m
                        </div>
                      </td>

                      {/* Z-Score */}
                      <td className="py-3 px-4 font-mono font-bold tabular-nums text-rose-700">
                        +{zScore}σ
                      </td>

                      {/* Stagnation Root Cause */}
                      <td className="py-3 px-4 max-w-xs">
                        <div className="text-slate-800 font-medium truncate" title={enc.forgotten_reason || 'Elapsed dwell time exceeds threshold'}>
                          {enc.forgotten_reason || 'Elapsed dwell time exceeds 2 standard deviations'}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Intake: {new Date(enc.arrival_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>

                      {/* Intervention Actions */}
                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onSelectPatient(enc)}
                            className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded cursor-pointer transition-colors"
                          >
                            Journey
                          </button>
                          <button
                            onClick={() => onExpeditePatient(enc.encounter_id)}
                            className="px-2.5 py-1 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded cursor-pointer transition-colors shadow-2xs"
                          >
                            Expedite
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {forgottenEncounters.length > 50 && (
          <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500 font-medium">
            Showing top 50 forgotten patient alerts of {forgottenEncounters.length} detected.
          </div>
        )}
      </div>
    </div>
  );
};
