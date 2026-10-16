import React, { useState } from 'react';
import { DiagnosticTest, Department } from '../types/hospital';
import { Activity, Clock, AlertTriangle, CheckCircle2, Search, ArrowUpRight, Filter } from 'lucide-react';

interface DiagnosticMonitorProps {
  tests: DiagnosticTest[];
  departments: Department[];
}

export const DiagnosticMonitor: React.FC<DiagnosticMonitorProps> = ({
  tests,
  departments
}) => {
  const [selectedType, setSelectedType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const testTypes = [
    'All',
    'CT Scan',
    'MRI Scan',
    'Full Blood Panel (CBC)',
    'Troponin / Cardiac',
    'Ultrasound',
    'Chest X-Ray',
    'Urinalysis'
  ];

  // Aggregate statistics by test type
  const typeAggregates = testTypes.filter(t => t !== 'All').map(typeName => {
    const matching = tests.filter(t => t.test_type === typeName);
    const count = matching.length;
    const avgTurnaround = count > 0 ? Math.round(matching.reduce((a, b) => a + b.turnaround_minutes, 0) / count) : 0;
    const sla = matching.length > 0 ? matching[0].sla_target_minutes : 40;
    const dli = count > 0 ? Number((matching.reduce((a, b) => a + b.dli, 0) / count).toFixed(2)) : 1.0;
    const delayedCount = matching.filter(t => t.is_delayed).length;

    return {
      type: typeName,
      count,
      avgTurnaround,
      sla,
      dli,
      delayedCount,
      delayedPct: count > 0 ? Math.round((delayedCount / count) * 100) : 0
    };
  });

  const filteredTests = tests.filter(t => {
    const matchType = selectedType === 'All' || t.test_type === selectedType;
    const matchSearch = t.test_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        t.encounter_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        t.test_type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchSearch;
  });

  const overallAvgDLI = tests.length > 0 ? Number((tests.reduce((a, b) => a + b.dli, 0) / tests.length).toFixed(2)) : 1.2;
  const delayedTotal = tests.filter(t => t.is_delayed).length;

  return (
    <div className="space-y-6">
      {/* Header Context Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-100 px-2 py-0.5 rounded">
                Diagnostic Latency Index (DLI)
              </span>
              <span className="text-xs text-slate-500 font-medium">Brief Requirement #4</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Diagnostic-Test Turnaround & Starvation Monitor
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Diagnostic tests are the invisible hospital choke point. When labs or imaging stall, physicians cannot complete consultations, creating severe "wait-in-place" backlog in exam rooms. DLI represents turnaround time normalized by SLA target (<strong className="text-slate-900">DLI &gt; 1.25x indicates systemic bottleneck</strong>).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
              <div className="text-xl font-bold font-mono text-slate-900 tabular-nums">{overallAvgDLI}x</div>
              <div className="text-[11px] text-slate-500 font-medium">Average DLI</div>
            </div>
            <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-center">
              <div className="text-xl font-bold font-mono text-rose-700 tabular-nums">{delayedTotal}</div>
              <div className="text-[11px] text-rose-800 font-semibold">Exceeding SLA Window</div>
            </div>
          </div>
        </div>
      </div>

      {/* Test Modality Matrix */}
      <div>
        <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
          Turnaround Performance by Test Modality
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {typeAggregates.map(mod => {
            const isSevere = mod.dli >= 1.4;
            const isElevated = mod.dli >= 1.15;

            return (
              <div
                key={mod.type}
                className={`bg-white border rounded-xl p-4 shadow-xs flex flex-col justify-between ${
                  isSevere
                    ? 'border-rose-300 ring-1 ring-rose-200'
                    : isElevated
                    ? 'border-amber-300 ring-1 ring-amber-100'
                    : 'border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-1 mb-2">
                    <h3 className="text-xs font-bold text-slate-900 leading-snug">
                      {mod.type}
                    </h3>
                    <span
                      className={`text-[11px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        isSevere
                          ? 'bg-rose-100 text-rose-800'
                          : isElevated
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-teal-100 text-teal-800'
                      }`}
                    >
                      {mod.dli}x DLI
                    </span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Turnaround:</span>
                      <span className="font-mono font-bold text-slate-900 tabular-nums">
                        {mod.avgTurnaround}m (SLA {mod.sla}m)
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>SLA Breaches:</span>
                      <span className={`font-mono font-semibold tabular-nums ${mod.delayedCount > 0 ? 'text-rose-600' : 'text-slate-500'}`}>
                        {mod.delayedCount} orders ({mod.delayedPct}%)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-400 font-mono">
                  Total Volume: {mod.count.toLocaleString()} completed
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter and Test Record Table */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Segmented controls */}
          <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg overflow-x-auto w-full sm:w-auto">
            {testTypes.slice(0, 5).map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  selectedType === type
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Test ID, Encounter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>
        </div>

        {/* Table of Tests */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase font-semibold text-[11px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Test Record</th>
                  <th className="py-3 px-4">Encounter ID</th>
                  <th className="py-3 px-4">Test Modality</th>
                  <th className="py-3 px-4">Order Timestamp</th>
                  <th className="py-3 px-4">Turnaround vs SLA</th>
                  <th className="py-3 px-4">DLI Ratio</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTests.slice(0, 40).map(test => {
                  const isSevere = test.dli > 1.25;

                  return (
                    <tr key={test.test_id} className="hover:bg-slate-50/70">
                      <td className="py-2.5 px-4 font-mono font-bold text-slate-900">{test.test_id}</td>
                      <td className="py-2.5 px-4 font-mono text-slate-700">{test.encounter_id}</td>
                      <td className="py-2.5 px-4 font-semibold text-slate-800">{test.test_type}</td>
                      <td className="py-2.5 px-4 font-mono text-slate-500">
                        {new Date(test.order_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-2.5 px-4">
                        <span className="font-mono font-bold text-slate-800 tabular-nums">{test.turnaround_minutes}m</span>
                        <span className="text-slate-400 font-mono text-[11px] ml-1">/ {test.sla_target_minutes}m</span>
                      </td>
                      <td className={`py-2.5 px-4 font-mono font-bold tabular-nums ${isSevere ? 'text-rose-600' : 'text-teal-700'}`}>
                        {test.dli}x
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                            test.is_delayed
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {test.is_delayed ? 'SLA Exceeded' : 'Nominal'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500">
            Showing top 40 of {filteredTests.length} diagnostic test records.
          </div>
        </div>
      </div>
    </div>
  );
};
