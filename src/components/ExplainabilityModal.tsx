import React from 'react';
import { X, TrendingUp, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';
import { FeatureAttribution } from '../types/hospital';
import { getSHAPWaterfallForDepartment } from '../data/mockDataGenerator';

interface ExplainabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  departmentId: string | null;
  departmentName: string | null;
  predictedDelayMins: number;
}

export const ExplainabilityModal: React.FC<ExplainabilityModalProps> = ({
  isOpen,
  onClose,
  departmentId,
  departmentName,
  predictedDelayMins
}) => {
  if (!isOpen || !departmentId) return null;

  const features: FeatureAttribution[] = getSHAPWaterfallForDepartment(departmentId);
  const baselineWait = Math.max(15, predictedDelayMins - features.reduce((acc, f) => acc + f.impact_minutes, 0));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                Root-Cause SHAP Explainability
              </h2>
              <span className="font-mono text-xs text-slate-500 font-semibold">{departmentId}</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Attribution waterfall for <span className="font-medium text-slate-800">{departmentName}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Summary KPI Strip */}
          <div className="grid grid-cols-3 gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-center">
            <div>
              <div className="text-[11px] text-slate-500 font-medium">Nominal Baseline</div>
              <div className="text-base font-bold font-mono text-slate-700 tabular-nums">{baselineWait}m</div>
            </div>
            <div>
              <div className="text-[11px] text-slate-500 font-medium">Attributed Delays</div>
              <div className="text-base font-bold font-mono text-rose-600 tabular-nums">
                +{features.reduce((a, b) => a + b.impact_minutes, 0)}m
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-500 font-medium">Predicted Wait Time</div>
              <div className="text-base font-bold font-mono text-slate-900 tabular-nums">{predictedDelayMins}m</div>
            </div>
          </div>

          {/* SHAP Waterfall Feature List */}
          <div>
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Dominant Contributing Signal
              </span>
              <span className="text-slate-500 font-medium">Impact on Wait Time</span>
            </div>

            <div className="space-y-3">
              {features.map((feat, idx) => {
                const isPositive = feat.impact_minutes > 0;
                return (
                  <div key={idx} className="p-3 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 font-mono text-[11px]">0{idx + 1}.</span>
                        <span className="font-semibold text-slate-900">{feat.feature_name}</span>
                      </div>
                      <span className="font-mono font-bold text-rose-600 tabular-nums text-xs">
                        {isPositive ? `+${feat.impact_minutes} min` : `${feat.impact_minutes} min`}
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-rose-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, feat.percentage_contribution * 2)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5">
                      <span>Category: <strong className="text-slate-700 font-medium">{feat.category}</strong></span>
                      <span className="font-mono text-slate-600 tabular-nums">{feat.percentage_contribution}% of excess delay</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Key Operational Recommendation */}
          <div className="bg-slate-900 text-slate-100 p-4 rounded-lg text-xs space-y-1.5">
            <div className="flex items-center gap-2 text-teal-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Recommended Counter-Intervention</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Addressing the top two drivers (<span className="text-white font-medium">{features[0]?.feature_name}</span> and <span className="text-white font-medium">{features[1]?.feature_name}</span>) will eliminate <span className="text-teal-300 font-mono font-bold">~{features.slice(0, 2).reduce((a, b) => a + b.impact_minutes, 0)} minutes</span> of queue dwell time and prevent downstream patient stranding.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
