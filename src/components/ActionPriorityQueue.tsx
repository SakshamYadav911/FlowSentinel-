import React, { useState } from 'react';
import { PriorityActionItem } from '../types/hospital';
import { CheckCircle2, Zap, ArrowRight, ShieldCheck, AlertCircle, Clock, Users, Check } from 'lucide-react';

interface ActionPriorityQueueProps {
  actions: PriorityActionItem[];
  onApplyAction: (actionId: string) => void;
  onOpenExplainability: (deptId: string, deptName: string, predictedDelay: number) => void;
}

export const ActionPriorityQueue: React.FC<ActionPriorityQueueProps> = ({
  actions,
  onApplyAction,
  onOpenExplainability
}) => {
  const [filterType, setFilterType] = useState<string>('all');

  const filtered = actions.filter(a => {
    if (filterType === 'pending') return a.status === 'Pending';
    if (filterType === 'applied') return a.status === 'Applied';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Context Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-100 px-2 py-0.5 rounded">
                Operational Prioritization Engine
              </span>
              <span className="text-xs text-slate-500 font-medium">Brief Requirement #5</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              "What Should We Investigate First?" Action Queue
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Hospital managers are inundated with dozens of alarms. Rather than showing an unranked list of delays, FlowSentinel mathematically ranks high-yield interventions using:
              <span className="font-mono font-semibold text-slate-900 ml-1">
                Priority Score = Predicted Delay (mins) × Affected Patient Census × Acuity Factor
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                filterType === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Actions ({actions.length})
            </button>
            <button
              onClick={() => setFilterType('pending')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                filterType === 'pending' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Pending ({actions.filter(a => a.status === 'Pending').length})
            </button>
            <button
              onClick={() => setFilterType('applied')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                filterType === 'applied' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Applied ({actions.filter(a => a.status === 'Applied').length})
            </button>
          </div>
        </div>
      </div>

      {/* Action Cards Queue */}
      <div className="space-y-4">
        {filtered.map((item) => {
          const isApplied = item.status === 'Applied';

          return (
            <div
              key={item.id}
              className={`bg-white border rounded-xl p-5 shadow-xs transition-all ${
                isApplied
                  ? 'border-teal-200 bg-teal-50/20 opacity-80'
                  : item.rank === 1
                  ? 'border-rose-300 ring-2 ring-rose-100'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                {/* Left zone: Rank & Main Diagnostic */}
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-sm shrink-0 shadow-2xs ${
                      isApplied
                        ? 'bg-teal-100 text-teal-800'
                        : item.rank === 1
                        ? 'bg-rose-600 text-white'
                        : item.rank === 2
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-800 text-white'
                    }`}
                  >
                    #{item.rank}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500">{item.department_id}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-xs font-semibold text-slate-700">{item.department_name}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-xs text-teal-700 font-semibold font-mono">
                        {Math.round(item.confidence_score * 100)}% Confidence
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                      {item.diagnosis_summary}
                    </p>

                    {/* Highlighted 1-Sentence Recommended Operational Action */}
                    <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1">
                        <ShieldCheck className="w-4 h-4 text-teal-600" />
                        <span>Recommended Operational Intervention:</span>
                      </div>
                      <p className="text-slate-700 font-medium">
                        {item.recommended_action}
                      </p>
                      <div className="text-[11px] text-slate-400 mt-1">
                        Primary root driver: <strong className="text-slate-600">{item.primary_driver}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right zone: Metric impact & action buttons */}
                <div className="lg:w-72 shrink-0 flex flex-col justify-between space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Priority Score</span>
                      <span className="font-mono font-bold text-base text-rose-700 tabular-nums">
                        {item.priority_score.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Predicted Delay</span>
                      <span className="font-mono font-bold text-slate-900 tabular-nums">
                        {item.predicted_delay_mins} mins
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Affected Patients</span>
                      <span className="font-mono font-bold text-slate-900 tabular-nums">
                        {item.affected_patient_count} active
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex flex-col gap-2">
                    {isApplied ? (
                      <div className="flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-teal-800 bg-teal-100 rounded-lg">
                        <Check className="w-4 h-4" />
                        <span>Recommendation Applied</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => onApplyAction(item.id)}
                        className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shadow-xs"
                      >
                        <Zap className="w-3.5 h-3.5 text-teal-300" />
                        <span>Apply Recommendation</span>
                      </button>
                    )}

                    <button
                      onClick={() => onOpenExplainability(item.department_id, item.department_name, item.predicted_delay_mins)}
                      className="w-full text-center py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-white rounded transition-colors cursor-pointer"
                    >
                      View SHAP Attribution Waterfall
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
