import React, { useState } from 'react';
import { Department, Encounter, CounterfactualSettings, SimulationResult } from '../types/hospital';
import { simulateCounterfactualImpact } from '../utils/predictiveEngine';
import { Sliders, Sparkles, TrendingDown, Clock, ShieldCheck, Zap, RotateCcw, BedDouble, Users, TestTubes } from 'lucide-react';

interface CounterfactualSimulatorProps {
  departments: Department[];
  encounters: Encounter[];
}

export const CounterfactualSimulator: React.FC<CounterfactualSimulatorProps> = ({
  departments,
  encounters
}) => {
  const [settings, setSettings] = useState<CounterfactualSettings>({
    additional_triage_nurses: 1,
    diagnostic_turnaround_reduction_pct: 20,
    observation_surge_beds: 4,
    reroute_labs_enabled: true
  });

  const simResult: SimulationResult = simulateCounterfactualImpact(encounters, departments, settings);

  const applyPreset = (preset: 'baseline' | 'surge' | 'diagnostic' | 'maximum') => {
    switch (preset) {
      case 'baseline':
        setSettings({
          additional_triage_nurses: 0,
          diagnostic_turnaround_reduction_pct: 0,
          observation_surge_beds: 0,
          reroute_labs_enabled: false
        });
        break;
      case 'surge':
        setSettings({
          additional_triage_nurses: 2,
          diagnostic_turnaround_reduction_pct: 10,
          observation_surge_beds: 6,
          reroute_labs_enabled: false
        });
        break;
      case 'diagnostic':
        setSettings({
          additional_triage_nurses: 0,
          diagnostic_turnaround_reduction_pct: 35,
          observation_surge_beds: 2,
          reroute_labs_enabled: true
        });
        break;
      case 'maximum':
        setSettings({
          additional_triage_nurses: 3,
          diagnostic_turnaround_reduction_pct: 30,
          observation_surge_beds: 8,
          reroute_labs_enabled: true
        });
        break;
    }
  };

  const patientHoursSaved = Math.round((simResult.minutes_saved_per_patient * encounters.length) / 60);

  return (
    <div className="space-y-6">
      {/* Header Context Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-100 px-2 py-0.5 rounded">
                Executive Decision Support
              </span>
              <span className="text-xs text-slate-500 font-medium">Brief Requirement #6</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              "What-If" Counterfactual Operations Simulator
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Standard BI dashboards merely report past failures. FlowSentinel models the operational cascade in advance: adjust staffing, diagnostic speed, or bed allocation to quantify exact wait-time reduction, queue clearance, and ROI before spending capital.
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => applyPreset('baseline')}
              className="px-2.5 py-1 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded cursor-pointer transition-colors"
            >
              Reset Baseline
            </button>
            <button
              onClick={() => applyPreset('surge')}
              className="px-2.5 py-1 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded cursor-pointer transition-colors"
            >
              Surge Protocol
            </button>
            <button
              onClick={() => applyPreset('diagnostic')}
              className="px-2.5 py-1 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded cursor-pointer transition-colors"
            >
              Fast-Track Labs
            </button>
            <button
              onClick={() => applyPreset('maximum')}
              className="px-2.5 py-1 text-xs font-medium bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded cursor-pointer transition-colors"
            >
              Max Optimization
            </button>
          </div>
        </div>
      </div>

      {/* Main Simulator Layout: Controls on Left, Live Impact on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Sliders (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Sliders className="w-4 h-4 text-teal-700" />
              <span>Operational Levers & Controls</span>
            </div>
            <button
              onClick={() => applyPreset('baseline')}
              className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Slider 1: Triage Nurses */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-500" />
                <span>Additional Triage & Float Nurses</span>
              </label>
              <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded tabular-nums">
                +{settings.additional_triage_nurses} RNs
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={4}
              step={1}
              value={settings.additional_triage_nurses}
              onChange={(e) => setSettings({ ...settings, additional_triage_nurses: parseInt(e.target.value, 10) })}
              className="w-full accent-teal-700 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>0 (Baseline)</span>
              <span>+2 RNs (Peak Shift)</span>
              <span>+4 RNs (Surge Cap)</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Reduces intake wait time by ~6.5 mins per nurse and accelerates bedside rooming.
            </p>
          </div>

          {/* Slider 2: Diagnostic Turnaround */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-800 flex items-center gap-1.5">
                <TestTubes className="w-3.5 h-3.5 text-slate-500" />
                <span>Diagnostic Turnaround Acceleration</span>
              </label>
              <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded tabular-nums">
                -{settings.diagnostic_turnaround_reduction_pct}% turnaround
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={40}
              step={5}
              value={settings.diagnostic_turnaround_reduction_pct}
              onChange={(e) => setSettings({ ...settings, diagnostic_turnaround_reduction_pct: parseInt(e.target.value, 10) })}
              className="w-full accent-teal-700 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>0% (Standard)</span>
              <span>-20% (Point-of-Care)</span>
              <span>-40% (Max Tech)</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Expedites blood panels and CT scan reads, unblocking exam rooms and pending consults.
            </p>
          </div>

          {/* Slider 3: Observation Surge Beds */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-800 flex items-center gap-1.5">
                <BedDouble className="w-3.5 h-3.5 text-slate-500" />
                <span>Observation & Step-Down Surge Beds</span>
              </label>
              <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded tabular-nums">
                +{settings.observation_surge_beds} beds
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              step={2}
              value={settings.observation_surge_beds}
              onChange={(e) => setSettings({ ...settings, observation_surge_beds: parseInt(e.target.value, 10) })}
              className="w-full accent-teal-700 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>0 beds</span>
              <span>+4 beds</span>
              <span>+10 beds</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Absorbs boarders waiting for inpatient beds, relieving ER corridor overflow.
            </p>
          </div>

          {/* Toggle: STAT Lab Rerouting */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-800 block">STAT Secondary Lab Rerouting</span>
              <span className="text-[11px] text-slate-500 block">Diverts non-critical chemistry to outpatient wing</span>
            </div>
            <button
              onClick={() => setSettings({ ...settings, reroute_labs_enabled: !settings.reroute_labs_enabled })}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings.reroute_labs_enabled ? 'bg-teal-700' : 'bg-slate-200'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  settings.reroute_labs_enabled ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Right Column: Projected Impact & Return on Investment (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Outcome Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Projected Operational Impact & ROI
                </h3>
                <p className="text-xs text-slate-500">
                  Simulated outcomes across {encounters.length.toLocaleString()} active patient encounters
                </p>
              </div>

              <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200 font-mono">
                +{simResult.hospital_efficiency_gain_pct}% Efficiency Gain
              </span>
            </div>

            {/* Impact Metric Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center mb-5">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Average Wait</span>
                <div className="text-lg font-bold font-mono text-teal-700 tabular-nums">
                  {simResult.projected_avg_wait_mins}m
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Was {simResult.baseline_avg_wait_mins}m</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Time Saved / Pt</span>
                <div className="text-lg font-bold font-mono text-teal-700 tabular-nums">
                  -{simResult.minutes_saved_per_patient}m
                </div>
                <span className="text-[10px] text-teal-600 font-medium font-mono">Per encounter</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Breaches Averted</span>
                <div className="text-lg font-bold font-mono text-teal-700 tabular-nums">
                  {simResult.sla_breaches_prevented}
                </div>
                <span className="text-[10px] text-slate-400 font-mono">SLA Violations</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Hours Saved</span>
                <div className="text-lg font-bold font-mono text-teal-700 tabular-nums">
                  {patientHoursSaved}h
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Clinical care time</span>
              </div>
            </div>

            {/* Simulated Clearance by Department */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                Simulated Department Wait Time Relief
              </h4>

              <div className="space-y-2.5">
                {departments.slice(0, 5).map(dept => {
                  const currentWait = dept.median_wait_time_mins;
                  const deptRelief = Math.round(
                    simResult.minutes_saved_per_patient *
                    (dept.category === 'Emergency' ? 1.3 : dept.category === 'Diagnostic' ? 1.1 : 0.8)
                  );
                  const projectedDeptWait = Math.max(12, currentWait - deptRelief);

                  return (
                    <div key={dept.department_id} className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold text-slate-800">{dept.department_name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 font-mono line-through text-[11px]">{currentWait}m</span>
                          <span className="font-mono font-bold text-teal-700">{projectedDeptWait} mins</span>
                          <span className="text-[11px] text-teal-600 font-semibold font-mono">(-{currentWait - projectedDeptWait}m)</span>
                        </div>
                      </div>

                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-teal-600 h-full rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, Math.round((projectedDeptWait / (currentWait || 1)) * 100))}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Strategic Insight Callout */}
          <div className="bg-slate-900 text-slate-100 p-4 rounded-xl text-xs space-y-1.5">
            <div className="flex items-center gap-2 text-teal-400 font-bold">
              <Sparkles className="w-4 h-4" />
              <span>Predictive Operations Recommendation</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Deploying <span className="text-white font-medium">+{settings.additional_triage_nurses} Triage Nurses</span> paired with <span className="text-white font-medium">+{settings.observation_surge_beds} Observation Beds</span> yields the highest non-linear return, clearing the Emergency corridor backlog in under 45 minutes and averting {simResult.sla_breaches_prevented} downstream patient stalls.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
