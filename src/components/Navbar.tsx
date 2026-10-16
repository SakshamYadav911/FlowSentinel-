import React from 'react';
import { Activity, Upload, Database, RefreshCw } from 'lucide-react';
import { DatasetStats } from '../types/hospital';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenUploadModal: () => void;
  onResetData: () => void;
  stats: DatasetStats;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenUploadModal,
  onResetData,
  stats
}) => {
  const navItems = [
    { id: 'radar', label: 'Bottleneck Radar' },
    { id: 'journey', label: 'Patient Journey & Waste ⚠️' },
    { id: 'forgotten', label: `Forgotten Patients (${stats.forgottenPatientsCount})` },
    { id: 'priority', label: 'Action Priority Queue' },
    { id: 'diagnostic', label: 'Diagnostic Turnaround' },
    { id: 'simulator', label: 'What-If Simulator' },
    { id: 'ml', label: 'Time-Aware ML' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-base shadow-sm">
              <Activity className="w-5 h-5 text-teal-400" />
            </div>
            <button
              onClick={() => onSelectTab('radar')}
              className="text-left group cursor-pointer focus:outline-none"
            >
              <span className="text-lg font-bold tracking-tight text-slate-900 block group-hover:text-teal-700 transition-colors">
                FlowSentinel
              </span>
              <span className="text-xs text-slate-500 font-medium tracking-normal block">
                Hospital Flow & Bottleneck Command
              </span>
            </button>
          </div>

          {/* Zone 2: Concise single-line navigation links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(item => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-slate-100 text-slate-900'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action + helper actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onResetData}
              title="Reset to default benchmark dataset"
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenUploadModal}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap cursor-pointer shadow-sm"
            >
              <Upload className="w-3.5 h-3.5 text-teal-300" />
              <span>Load Zip / CSVs</span>
            </button>
          </div>
        </div>

        {/* Mobile / Compact Tab Row */}
        <div className="flex lg:hidden overflow-x-auto py-2 gap-2 border-t border-slate-100">
          {navItems.map(item => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
