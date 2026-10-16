import React, { useState, useEffect } from 'react';
import {
  Encounter,
  Department,
  Patient,
  DiagnosticTest
} from '../types/hospital';
import {
  AlertTriangle,
  Flame,
  Clock,
  ArrowRight,
  ShieldAlert,
  Zap,
  CheckCircle2,
  Users,
  TestTubes,
  BedDouble,
  FileCheck,
  ChevronRight,
  Activity,
  AlertOctagon,
  Sparkles,
  Info,
  Play,
  Pause,
  RotateCcw,
  Languages,
  DoorOpen,
  Stethoscope,
  MessageSquare,
  LogOut,
  SlidersHorizontal
} from 'lucide-react';
import {
  SupportedLanguage,
  LANGUAGE_OPTIONS,
  TRANSLATIONS
} from '../utils/translations';

interface PatientJourneyFlowProps {
  encounters: Encounter[];
  departments: Department[];
  patients: Patient[];
  diagnosticTests: DiagnosticTest[];
  onSelectPatient: (encounter: Encounter) => void;
  onExpeditePatient: (encounterId: string) => void;
}

export const PatientJourneyFlow: React.FC<PatientJourneyFlowProps> = ({
  encounters,
  departments,
  patients,
  diagnosticTests,
  onSelectPatient,
  onExpeditePatient
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('en');
  const [selectedStageIndex, setSelectedStageIndex] = useState<number | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');

  // Walking patient simulation state
  const [walkerPositionPct, setWalkerPositionPct] = useState<number>(15); // 0 to 100%
  const [isWalking, setIsWalking] = useState<boolean>(true);

  const t = TRANSLATIONS[selectedLanguage];
  const patientMap = new Map<string, Patient>(patients.map(p => [p.patient_id, p]));
  const deptMap = new Map<string, Department>(departments.map(d => [d.department_id, d]));

  const forgottenEncounters = encounters.filter(e => e.is_forgotten_patient);
  const candidatePatientEncounters = forgottenEncounters.slice(0, 8);
  const tracedEncounter = selectedPatientId
    ? encounters.find(e => e.encounter_id === selectedPatientId || e.patient_id === selectedPatientId)
    : candidatePatientEncounters[0];
  const tracedPatient = tracedEncounter ? patientMap.get(tracedEncounter.patient_id) : null;
  const tracedDept = tracedEncounter ? deptMap.get(tracedEncounter.department_id) : null;

  // The 4 Primary Clinical Stages requested: Arrival, Triage, Consultation, Discharge
  const stages = [
    {
      id: 'arrival',
      stepNumber: 1,
      title: t.stageArrival,
      subtitle: t.stageArrivalSub,
      stageIcon: DoorOpen,
      themeColor: 'from-cyan-500 to-teal-500',
      badgeBg: 'bg-teal-50 border-teal-200 text-teal-800',
      borderRing: 'border-teal-200',
      cardBg: 'bg-teal-50/40',
      nominalMins: 15,
      actualAvgMins: 18,
      wastedMins: 3,
      zScore: 0.6,
      exceeds2Sigma: false,
      activeCensus: 28,
      pathPositionPct: 8,
      statusLabel: t.statusNominal,
      statusIcon: CheckCircle2,
      dangerReason: 'Patient arrival check-in and kiosk intake operate smoothly within baseline sigma bounds.'
    },
    {
      id: 'triage',
      stepNumber: 2,
      title: t.stageTriage,
      subtitle: t.stageTriageSub,
      stageIcon: Stethoscope,
      themeColor: 'from-blue-500 to-indigo-600',
      badgeBg: 'bg-blue-50 border-blue-200 text-blue-800',
      borderRing: 'border-blue-200',
      cardBg: 'bg-blue-50/50',
      nominalMins: 20,
      actualAvgMins: 34,
      wastedMins: 14,
      zScore: 1.4,
      exceeds2Sigma: false,
      activeCensus: 34,
      pathPositionPct: 36,
      statusLabel: t.statusWarning,
      statusIcon: Clock,
      dangerReason: 'Triage assessment queue experiencing mild caseload pressure during arrival velocity peaks.'
    },
    {
      id: 'consultation',
      stepNumber: 3,
      title: t.stageConsultation,
      subtitle: t.stageConsultationSub,
      stageIcon: MessageSquare,
      themeColor: 'from-rose-500 via-red-600 to-orange-500',
      badgeBg: 'bg-rose-100 border-rose-300 text-rose-900',
      borderRing: 'border-rose-400 ring-4 ring-rose-100',
      cardBg: 'bg-gradient-to-b from-rose-50/90 to-red-50/60',
      nominalMins: 30,
      actualAvgMins: 88,
      wastedMins: 58,
      zScore: 2.65, // EXCEEDS 2-SIGMA THRESHOLD!
      exceeds2Sigma: true,
      activeCensus: 49,
      pathPositionPct: 66,
      statusLabel: t.statusDanger,
      statusIcon: AlertTriangle,
      dangerReason: 'CRITICAL 2-SIGMA STALL: Test results completed 45-60m ago, but patients remain stranded in exam rooms with attending physicians unnotified.'
    },
    {
      id: 'discharge',
      stepNumber: 4,
      title: t.stageDischarge,
      subtitle: t.stageDischargeSub,
      stageIcon: LogOut,
      themeColor: 'from-emerald-500 to-teal-600',
      badgeBg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      borderRing: 'border-emerald-300',
      cardBg: 'bg-emerald-50/50',
      nominalMins: 25,
      actualAvgMins: 46,
      wastedMins: 21,
      zScore: 1.55,
      exceeds2Sigma: false,
      activeCensus: 23,
      pathPositionPct: 92,
      statusLabel: t.statusWarning,
      statusIcon: Clock,
      dangerReason: 'Discharge lounge holding medically cleared patients pending pharmacy delivery.'
    }
  ];

  // Walking simulation loop
  useEffect(() => {
    if (!isWalking) return;
    const interval = setInterval(() => {
      setWalkerPositionPct(prev => {
        if (prev >= 96) return 4;
        return prev + 1;
      });
    }, 140);
    return () => clearInterval(interval);
  }, [isWalking]);

  // Determine which stage the walking figure is currently nearest to
  const currentStageIndex =
    walkerPositionPct < 22 ? 0 : walkerPositionPct < 52 ? 1 : walkerPositionPct < 80 ? 2 : 3;
  const currentStage = stages[currentStageIndex];

  const totalNominal = stages.reduce((acc, s) => acc + s.nominalMins, 0);
  const totalActual = stages.reduce((acc, s) => acc + s.actualAvgMins, 0);
  const totalWasted = stages.reduce((acc, s) => acc + s.wastedMins, 0);
  const carePct = Math.round((totalNominal / totalActual) * 100);

  return (
    <div className="space-y-6">
      {/* Top Banner with Language Selector & Executive Pulse */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-xl border border-slate-800">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-400/20 text-teal-300 border border-teal-400/30">
                <Sparkles className="w-3.5 h-3.5 text-teal-300" />
                <span>Patient Walking Flow & 2σ Radar</span>
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="inline-flex items-center gap-1 text-xs text-rose-300 font-mono font-bold bg-rose-500/20 px-2 py-0.5 rounded border border-rose-500/30">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                <span>2-Sigma Stagnation Flagged in Consultation</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {t.journeyTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {t.journeySubtitle}
            </p>
          </div>

          {/* Right Header Area: Language Switcher & Walking Controls */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            {/* Indian Language Switcher */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-2.5 backdrop-blur-md flex items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Languages className="w-4 h-4 text-teal-400" />
                <span className="font-semibold">{t.language}:</span>
              </div>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value as SupportedLanguage)}
                className="bg-slate-900 text-teal-200 text-xs font-bold font-sans rounded-lg px-3 py-1.5 border border-slate-600 focus:outline-none focus:ring-1 focus:ring-teal-400 cursor-pointer"
              >
                {LANGUAGE_OPTIONS.map(opt => (
                  <option key={opt.code} value={opt.code} className="bg-slate-900 text-white">
                    {opt.nativeName} ({opt.name})
                  </option>
                ))}
              </select>
            </div>

            {/* Walking Controller */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-3 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsWalking(!isWalking)}
                  className="px-3 py-1.5 rounded-lg font-bold text-xs bg-teal-500 hover:bg-teal-400 text-slate-950 flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  {isWalking ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isWalking ? t.pauseWalk : t.startWalk}</span>
                </button>
                <button
                  onClick={() => {
                    setWalkerPositionPct(8);
                    setIsWalking(true);
                  }}
                  title={t.resetWalk}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-md transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">{t.currentlyAt}</span>
                <span className="font-bold text-xs text-white">
                  {currentStage.title}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Walking Track Visualizer with Walking Patient Avatar & Danger 2-Sigma Signals */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-700" />
              <span>Interactive Patient Journey Walking Path</span>
            </h2>
            <p className="text-xs text-slate-500">
              Watch the patient walk through Arrival, Triage, Consultation, and Discharge. The pulsing danger triangle illuminates when entering stages exceeding the statistical 2-sigma threshold.
            </p>
          </div>

          {/* Quick legend */}
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-teal-700 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
              <span>{t.statusNominal}</span>
            </span>
            <span className="flex items-center gap-1.5 text-amber-700 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>{t.statusWarning}</span>
            </span>
            <span className="flex items-center gap-1.5 text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping inline-block" />
              <span>{t.dangerThreshold}</span>
            </span>
          </div>
        </div>

        {/* Physical Pathway Track with Moving Patient Figure */}
        <div className="relative py-8 px-4 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-2xl overflow-hidden border border-slate-800 shadow-inner">
          {/* Subtle floor grid lines */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Walking Corridor Path Line */}
          <div className="relative h-3 bg-slate-950 rounded-full border border-slate-700 overflow-hidden mx-6">
            {/* Glowing gradient track */}
            <div
              className="h-full bg-gradient-to-r from-teal-400 via-blue-500 via-rose-500 to-emerald-400 transition-all duration-150"
              style={{ width: `${walkerPositionPct}%` }}
            />
          </div>

          {/* 4 Station Waypoint Markers along track */}
          <div className="relative mx-6 -mt-3.5 flex justify-between pointer-events-none">
            {stages.map((stage, idx) => {
              const StageIcon = stage.stageIcon;
              const isPast = walkerPositionPct >= stage.pathPositionPct;
              const isCurrent = currentStageIndex === idx;

              return (
                <div
                  key={stage.id}
                  className="flex flex-col items-center pointer-events-auto cursor-pointer"
                  onClick={() => {
                    setWalkerPositionPct(stage.pathPositionPct);
                    setSelectedStageIndex(idx);
                  }}
                >
                  {/* Waypoint circle */}
                  <div
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                      stage.exceeds2Sigma
                        ? 'bg-rose-600 border-amber-300 ring-4 ring-rose-500/40 shadow-[0_0_15px_rgba(239,68,68,0.8)]'
                        : isCurrent
                        ? 'bg-teal-400 border-white ring-4 ring-teal-400/40 text-slate-950 shadow-md'
                        : isPast
                        ? 'bg-slate-700 border-teal-400 text-teal-300'
                        : 'bg-slate-800 border-slate-600 text-slate-400'
                    }`}
                  >
                    {stage.exceeds2Sigma ? (
                      <AlertTriangle className="w-4 h-4 text-amber-200 animate-pulse" />
                    ) : (
                      <StageIcon className="w-4 h-4" />
                    )}
                  </div>

                  <span className={`text-[11px] font-bold mt-2 ${stage.exceeds2Sigma ? 'text-rose-400' : isCurrent ? 'text-teal-300' : 'text-slate-400'}`}>
                    {stage.title.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>

          {/* THE WALKING PATIENT FIGURE AVATAR */}
          <div
            className="absolute top-3.5 transition-all duration-150 pointer-events-none -translate-x-1/2 z-30"
            style={{ left: `calc(1.5rem + (100% - 3rem) * ${walkerPositionPct / 100})` }}
          >
            <div className="flex flex-col items-center">
              {/* Walking patient badge tooltip */}
              <div className="mb-1 bg-white text-slate-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-lg border border-slate-200 flex items-center gap-1 whitespace-nowrap animate-bounce">
                <span>🚶</span>
                <span className="font-mono">Patient</span>
                {currentStage.exceeds2Sigma && (
                  <span className="bg-rose-600 text-white px-1 rounded text-[9px] font-bold">
                    STALLED
                  </span>
                )}
              </div>

              {/* Animated Walking Human Silhouette */}
              <div
                className={`relative w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 ${
                  currentStage.exceeds2Sigma
                    ? 'bg-rose-600 border-amber-300 ring-4 ring-rose-500/50 shadow-[0_0_20px_rgba(239,68,68,1)]'
                    : 'bg-teal-500 border-white ring-4 ring-teal-400/30'
                }`}
              >
                {/* SVG Walking Character Icon with moving stride */}
                <svg
                  className={`w-6 h-6 text-white ${isWalking ? 'animate-pulse' : ''}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {/* Head */}
                  <circle cx="12" cy="4" r="2.2" fill="currentColor" />
                  {/* Torso */}
                  <path d="M12 7v6" />
                  {/* Arms */}
                  <path d={isWalking ? "M8 10l4-2 4 3" : "M9 11l3-2 3 2"} />
                  {/* Striding Legs */}
                  <path d={isWalking ? "M9 19l3-6 4 6" : "M10 18l2-5 2 5"} />
                </svg>

                {/* Stride Pulse Indicator */}
                <div className="absolute -inset-1 rounded-full border border-teal-300/40 animate-ping pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* 4 STAGE CARDS GRID (Arrival, Triage, Consultation, Discharge) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stages.map((stage, idx) => {
            const StageIcon = stage.stageIcon;
            const StatusIcon = stage.statusIcon;
            const isSelected = selectedStageIndex === idx;
            const isCurrentWalkerStage = currentStageIndex === idx;

            return (
              <div
                key={stage.id}
                onClick={() => {
                  setSelectedStageIndex(isSelected ? null : idx);
                  setWalkerPositionPct(stage.pathPositionPct);
                }}
                className={`relative rounded-2xl border p-5 transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'ring-2 ring-slate-900 shadow-md bg-white border-slate-900'
                    : stage.exceeds2Sigma
                    ? 'border-rose-400 ring-2 ring-rose-200 bg-gradient-to-b from-rose-50 to-red-50/70 hover:shadow-lg'
                    : isCurrentWalkerStage
                    ? 'border-teal-400 ring-2 ring-teal-100 bg-teal-50/40 hover:shadow-md'
                    : 'border-slate-200 bg-slate-50/70 hover:border-slate-300 hover:bg-white'
                }`}
              >
                {/* PULSING DANGER TRIANGLE ICON IF EXCEEDING 2-SIGMA THRESHOLD */}
                {stage.exceeds2Sigma && (
                  <div className="absolute -top-3.5 right-4 z-20">
                    <div className="relative flex items-center gap-1.5 bg-gradient-to-r from-rose-600 to-red-700 text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-lg border border-amber-300 animate-pulse">
                      {/* Pulsing Danger Triangle Icon */}
                      <AlertTriangle className="w-4 h-4 text-amber-300 drop-shadow-[0_0_8px_rgba(245,158,11,0.9)] animate-bounce" />
                      <span>{t.dangerThreshold}</span>
                      <span className="font-mono text-amber-200">({stage.zScore}σ)</span>
                      {/* Pulse Ping Effect */}
                      <span className="absolute -inset-0.5 rounded-full bg-rose-500 opacity-60 animate-ping pointer-events-none" />
                    </div>
                  </div>
                )}

                <div>
                  {/* Top Header Strip with Vibrant Color-Coded Status Icons */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      0{stage.stepNumber}
                    </span>

                    {/* VIBRANT COLOR-CODED STATUS ICON */}
                    <div
                      className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border shadow-2xs ${
                        stage.exceeds2Sigma
                          ? 'bg-rose-600 text-white border-rose-700 shadow-rose-200'
                          : stage.statusLabel === t.statusWarning
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      }`}
                    >
                      <StatusIcon
                        className={`w-3.5 h-3.5 ${
                          stage.exceeds2Sigma
                            ? 'text-amber-200 animate-pulse'
                            : stage.statusLabel === t.statusWarning
                            ? 'text-amber-700'
                            : 'text-emerald-700'
                        }`}
                      />
                      <span>{stage.statusLabel}</span>
                    </div>
                  </div>

                  {/* Stage Icon & Title */}
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stage.themeColor} text-white flex items-center justify-center shrink-0 shadow-xs`}
                    >
                      <StageIcon className="w-5 h-5" />
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900 leading-tight">
                        {stage.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {stage.subtitle}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Duration & Statistical Sigma Metrics */}
                <div className="pt-3 border-t border-slate-200/80 space-y-2 mt-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">Avg Dwell Time:</span>
                    <span className="font-mono font-bold text-slate-900 tabular-nums text-sm">
                      {stage.actualAvgMins} mins
                    </span>
                  </div>

                  {/* Wasted time vs SLA */}
                  <div
                    className={`flex items-center justify-between text-[11px] font-semibold px-2 py-1 rounded border ${
                      stage.exceeds2Sigma
                        ? 'bg-rose-100 text-rose-900 border-rose-300'
                        : stage.wastedMins > 5
                        ? 'bg-amber-50 text-amber-900 border-amber-200'
                        : 'bg-teal-50 text-teal-900 border-teal-200'
                    }`}
                  >
                    <span className="flex items-center gap-1 font-bold">
                      {stage.exceeds2Sigma ? (
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                      ) : (
                        <Flame className="w-3.5 h-3.5 text-amber-600" />
                      )}
                      <span>{t.wastedTime}:</span>
                    </span>
                    <span className="font-mono font-bold tabular-nums">
                      +{stage.wastedMins} mins
                    </span>
                  </div>

                  {/* Sigma z-score display */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5 font-mono">
                    <span>Statistical Deviation:</span>
                    <span className={`font-bold ${stage.exceeds2Sigma ? 'text-rose-600 text-xs' : 'text-slate-700'}`}>
                      Z = +{stage.zScore}σ
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>{t.activeCensus}:</span>
                    <span className="font-semibold text-slate-800">{stage.activeCensus} patients</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Stage Detail Drawer / Deep-Dive */}
        {selectedStageIndex !== null && (
          <div className="p-4 rounded-xl bg-slate-900 text-white animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-teal-400">
                    STAGE 0{stages[selectedStageIndex].stepNumber} INSPECTION
                  </span>
                  <span className="text-slate-500">·</span>
                  <span className="text-xs font-bold text-white">{stages[selectedStageIndex].title}</span>
                  {stages[selectedStageIndex].exceeds2Sigma && (
                    <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 animate-pulse">
                      <AlertTriangle className="w-3 h-3 text-amber-200" />
                      <span>{t.dangerThreshold} (+{stages[selectedStageIndex].zScore}σ)</span>
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                  {stages[selectedStageIndex].dangerReason}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <div className="text-xs text-slate-400">{t.wastedTime}</div>
                  <div className="text-lg font-mono font-bold text-rose-400 tabular-nums">
                    +{stages[selectedStageIndex].wastedMins} mins / patient
                  </div>
                </div>
                <button
                  onClick={() => setSelectedStageIndex(null)}
                  className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg cursor-pointer transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Individual Patient Journey Tracer with Danger 2σ Callout */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-100 px-2 py-0.5 rounded">
                Individual Journey Tracer
              </span>
              <span className="text-xs text-slate-500 font-medium">{t.tracePatient}</span>
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Forgotten Patient Individual Journey Inspection
            </h2>
            <p className="text-xs text-slate-500">
              Select any patient flagged by the 2-sigma anomaly detector to trace their steps from Arrival to Discharge.
            </p>
          </div>

          {/* Quick Patient Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium shrink-0">{t.tracePatient}</span>
            <select
              value={tracedEncounter?.encounter_id || ''}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 font-mono font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
            >
              {candidatePatientEncounters.map(e => (
                <option key={e.encounter_id} value={e.encounter_id}>
                  {e.encounter_id} ({e.patient_id}) - {e.wait_time_minutes}m Wait (ESI {e.acuity})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Traced Patient Stepper */}
        {tracedEncounter && (
          <div className="bg-gradient-to-br from-slate-50 to-teal-50/30 border border-slate-200 rounded-xl p-5 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-mono font-bold text-sm shadow-xs">
                  {tracedEncounter.patient_id.replace('P-', '')}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-slate-900">{tracedEncounter.encounter_id}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-xs text-slate-600 font-medium">
                      Patient {tracedEncounter.patient_id} ({tracedPatient?.age || 54}y · {tracedPatient?.gender || 'M'})
                    </span>
                    <span className="font-mono text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                      ESI {tracedEncounter.acuity}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Department: <strong className="text-slate-800">{tracedDept?.department_name || tracedEncounter.department_id}</strong>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSelectPatient(tracedEncounter)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer shadow-2xs"
                >
                  View Full Medical Chart
                </button>
                <button
                  onClick={() => onExpeditePatient(tracedEncounter.encounter_id)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5 text-teal-300" />
                  <span>{t.expediteCare}</span>
                </button>
              </div>
            </div>

            {/* Stepper Grid (Arrival, Triage, Consultation [2-Sigma Danger], Discharge) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Step 1: Arrival */}
              <div className="p-3.5 bg-white rounded-xl border border-slate-200">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-teal-950 flex items-center gap-1.5">
                    <DoorOpen className="w-3.5 h-3.5 text-teal-600" />
                    <span>{t.stageArrival}</span>
                  </span>
                  <span className="font-mono text-teal-700 font-bold">18m</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Checked in at intake; vitals entered into electronic record.
                </div>
              </div>

              {/* Step 2: Triage */}
              <div className="p-3.5 bg-white rounded-xl border border-slate-200">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-blue-950 flex items-center gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5 text-blue-600" />
                    <span>{t.stageTriage}</span>
                  </span>
                  <span className="font-mono text-blue-700 font-bold">25m</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Initial nurse evaluation completed; ESI acuity assigned.
                </div>
              </div>

              {/* Step 3: Consultation (2-SIGMA DANGER CHOKEPOINT) */}
              <div className="p-3.5 bg-rose-50 rounded-xl border-2 border-rose-400 ring-4 ring-rose-100 relative">
                <div className="absolute -top-3 right-3 bg-rose-600 text-white font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-md animate-pulse">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-200 animate-bounce" />
                  <span>{t.dangerAlert}</span>
                </div>

                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-rose-950 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-rose-600" />
                    <span>{t.stageConsultation}</span>
                  </span>
                  <span className="font-mono text-rose-700 font-extrabold">
                    +{tracedEncounter.wait_time_minutes}m (Z=+2.4σ)
                  </span>
                </div>
                <div className="text-[11px] text-rose-950 font-medium leading-relaxed">
                  {tracedEncounter.forgotten_reason || 'Diagnostic results unacknowledged. Patient stranded in consultation queue exceeding 2 standard deviations.'}
                </div>
              </div>

              {/* Step 4: Discharge */}
              <div className="p-3.5 bg-white/70 rounded-xl border border-dashed border-slate-300 opacity-70">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-500 flex items-center gap-1.5">
                    <LogOut className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t.stageDischarge}</span>
                  </span>
                  <span className="font-mono text-slate-400">Blocked</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Awaiting consultation review to authorize bed admission or home discharge.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
