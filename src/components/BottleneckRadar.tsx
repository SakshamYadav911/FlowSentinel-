import React, { useState } from 'react';
import { Department } from '../types/hospital';
import { AlertCircle, Clock, Users, ArrowUpRight, Search, Activity, ChevronRight, Zap } from 'lucide-react';

interface BottleneckRadarProps {
  departments: Department[];
  onOpenExplainability: (deptId: string, deptName: string, predictedDelay: number) => void;
  onNavigateToForgotten: () => void;
  onNavigateToJourney: () => void;
}

export const BottleneckRadar: React.FC<BottleneckRadarProps> = ({
  departments,
  onOpenExplainability,
  onNavigateToForgotten,
  onNavigateToJourney
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Emergency', 'Diagnostic', 'Inpatient', 'Surgical', 'Specialty', 'Discharge'];

  const filteredDepts = departments.filter(d => {
    const matchesCategory = selectedCategory === 'All' || d.category === selectedCategory;
    const matchesSearch = d.department_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.short_code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const criticalCount = departments.filter(d => d.bottleneck_status === 'Critical').length;
  const warningCount = departments.filter(d => d.bottleneck_status === 'Warning').length;
  const avgLoadRatio = Math.round((departments.reduce((acc, d) => acc + d.load_ratio, 0) / departments.length) * 100);

  return (
    <div className="space-y-6">
      {/* Top Banner & High-Level Pulse */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 bg-teal-100 px-2 py-0.5 rounded">
                Hospital Command Radar
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-500 font-medium">12 Monitored Units</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Department Bottleneck Radar & Chokepoint Map
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time capacity utilization, queue depth, and early cascade warning indicators.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onNavigateToJourney}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-teal-700 to-indigo-800 rounded-lg hover:from-teal-800 hover:to-indigo-900 transition-all shadow-xs cursor-pointer"
            >
              <Activity className="w-4 h-4 text-amber-300" />
              <span>Full Patient Journey & Time Waste Map ⚠️</span>
            </button>
            <div className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg shadow-2xs">
              <span className="font-mono tabular-nums font-bold text-sm">{criticalCount}</span>
              <span>Critical</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg shadow-2xs">
              <span className="font-mono tabular-nums font-bold text-sm">{warningCount}</span>
              <span>Elevated</span>
            </div>
          </div>
        </div>

        {/* Global Patient Flow Stages Bar with Danger Signals */}
        <div className="pt-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Global Patient Flow Transition Pipeline & Idle Time Leakage</span>
            </span>
            <button
              onClick={onNavigateToJourney}
              className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer"
            >
              <span>Explore interactive pipeline</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Stage 1 */}
            <div
              onClick={onNavigateToJourney}
              className="p-3.5 bg-gradient-to-br from-teal-50 to-emerald-50/40 border border-teal-200 rounded-xl hover:shadow-xs cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-teal-950">1. Arrival & Triage</span>
                <span className="text-[10px] font-bold text-teal-800 bg-teal-100 px-1.5 py-0.5 rounded">Nominal</span>
              </div>
              <div className="text-xs text-slate-600 mb-1">
                Active Queue: <strong className="font-mono text-slate-900 font-bold">28 patients</strong>
              </div>
              <div className="text-[11px] text-teal-800 font-medium flex items-center justify-between">
                <span>Dwell: <strong className="font-mono">18 mins</strong></span>
                <span className="text-teal-700 text-[10px]">On Target</span>
              </div>
            </div>

            {/* Stage 2 - Warning */}
            <div
              onClick={onNavigateToJourney}
              className="p-3.5 bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-300 rounded-xl hover:shadow-xs cursor-pointer transition-all relative overflow-hidden"
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-amber-950">2. Rooming & Consult</span>
                <span className="text-[10px] font-extrabold text-amber-900 bg-amber-200 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                  <span>⚠️</span> Chokepoint
                </span>
              </div>
              <div className="text-xs text-amber-900 mb-1">
                Active Queue: <strong className="font-mono text-amber-950 font-bold">41 patients</strong>
              </div>
              <div className="text-[11px] text-amber-900 font-medium flex items-center justify-between">
                <span>Dwell: <strong className="font-mono">68 mins</strong></span>
                <span className="font-mono font-bold text-amber-800 text-[10px] bg-amber-100 px-1 rounded">38m Wasted</span>
              </div>
            </div>

            {/* Stage 3 - Danger */}
            <div
              onClick={onNavigateToJourney}
              className="p-3.5 bg-gradient-to-br from-rose-50 to-red-50/60 border-2 border-rose-400 rounded-xl hover:shadow-xs cursor-pointer transition-all relative ring-2 ring-rose-100"
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-rose-950">3. Diagnostic Workup</span>
                <span className="text-[10px] font-extrabold text-white bg-rose-600 px-1.5 py-0.5 rounded flex items-center gap-0.5 animate-pulse">
                  <span>🚨</span> Danger
                </span>
              </div>
              <div className="text-xs text-rose-950 mb-1">
                Active Tests: <strong className="font-mono text-rose-950 font-bold">37 tests</strong>
              </div>
              <div className="text-[11px] text-rose-900 font-medium flex items-center justify-between">
                <span>DLI Index: <strong className="font-mono font-bold text-rose-700">1.78x</strong></span>
                <span className="font-mono font-bold text-rose-700 text-[10px] bg-rose-100 px-1 rounded">44m Wasted</span>
              </div>
            </div>

            {/* Stage 4 - Hold */}
            <div
              onClick={onNavigateToJourney}
              className="p-3.5 bg-gradient-to-br from-purple-50 to-indigo-50/50 border border-purple-300 rounded-xl hover:shadow-xs cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-purple-950">4. Bed & Discharge</span>
                <span className="text-[10px] font-extrabold text-purple-900 bg-purple-200 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                  <span>⚠️</span> Boarding Lag
                </span>
              </div>
              <div className="text-xs text-purple-950 mb-1">
                Active Lounge: <strong className="font-mono text-purple-950 font-bold">23 patients</strong>
              </div>
              <div className="text-[11px] text-purple-900 font-medium flex items-center justify-between">
                <span>Hold: <strong className="font-mono">54 mins</strong></span>
                <span className="font-mono font-bold text-purple-800 text-[10px] bg-purple-100 px-1 rounded">34m Wasted</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Category Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg overflow-x-auto w-full sm:w-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>
      </div>

      {/* 12-Department Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDepts.map(dept => {
          const isCritical = dept.bottleneck_status === 'Critical';
          const isWarning = dept.bottleneck_status === 'Warning';
          const loadPercent = Math.min(100, Math.round(dept.load_ratio * 100));

          const getCategoryBadgeClass = (cat: string) => {
            switch (cat) {
              case 'Emergency': return 'bg-rose-50 text-rose-700 border border-rose-200';
              case 'Diagnostic': return 'bg-purple-50 text-purple-700 border border-purple-200';
              case 'Inpatient': return 'bg-blue-50 text-blue-700 border border-blue-200';
              case 'Surgical': return 'bg-amber-50 text-amber-800 border border-amber-200';
              case 'Specialty': return 'bg-teal-50 text-teal-800 border border-teal-200';
              case 'Discharge': return 'bg-emerald-50 text-emerald-800 border border-emerald-200';
              default: return 'bg-slate-100 text-slate-700 border border-slate-200';
            }
          };

          return (
            <div
              key={dept.department_id}
              className={`bg-white border rounded-2xl p-5 shadow-xs transition-all flex flex-col justify-between ${
                isCritical
                  ? 'border-rose-400 ring-2 ring-rose-100 bg-gradient-to-b from-white to-rose-50/20'
                  : isWarning
                  ? 'border-amber-300 ring-1 ring-amber-100'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <div>
                {/* Card Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="font-mono text-[11px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        {dept.short_code}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getCategoryBadgeClass(dept.category)}`}>
                        {dept.category}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {dept.department_name}
                    </h3>
                  </div>

                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap flex items-center gap-1 ${
                      isCritical
                        ? 'bg-rose-600 text-white shadow-2xs animate-pulse'
                        : isWarning
                        ? 'bg-amber-100 text-amber-900 border border-amber-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {isCritical && <span>🚨</span>}
                    {isWarning && <span>⚠️</span>}
                    <span>{dept.bottleneck_status}</span>
                  </span>
                </div>

                {/* Capacity & Load Bar */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 font-medium">Capacity Utilization</span>
                    <span className="font-mono font-bold text-slate-900 tabular-nums">
                      {dept.current_occupancy} / {dept.bed_capacity} beds ({loadPercent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        loadPercent >= 90
                          ? 'bg-rose-500'
                          : loadPercent >= 80
                          ? 'bg-amber-500'
                          : 'bg-teal-600'
                      }`}
                      style={{ width: `${loadPercent}%` }}
                    />
                  </div>
                </div>

                {/* KPI Metrics Matrix */}
                <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-100 mb-4">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Median Wait Time</span>
                    <span className={`font-mono font-bold tabular-nums ${dept.median_wait_time_mins > dept.sla_wait_mins ? 'text-rose-600' : 'text-slate-800'}`}>
                      {dept.median_wait_time_mins} mins
                    </span>
                    <span className="text-[10px] text-slate-400 block">SLA: {dept.sla_wait_mins}m</span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[11px]">Active Waitlist</span>
                    <span className="font-mono font-bold text-slate-800 tabular-nums">
                      {dept.active_waitlist_count} patients
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      Staff: {dept.physician_staff} MD / {dept.nurse_staff} RN
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Card Actions */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <button
                  onClick={() => onOpenExplainability(dept.department_id, dept.department_name, dept.median_wait_time_mins)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900 py-1 cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>Explain Root Cause (SHAP)</span>
                </button>

                <button
                  onClick={onNavigateToForgotten}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:text-teal-900 py-1 cursor-pointer"
                >
                  <span>Patients</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
