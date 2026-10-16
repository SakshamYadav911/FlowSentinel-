/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { BottleneckRadar } from './components/BottleneckRadar';
import { ForgottenPatientRadar } from './components/ForgottenPatientRadar';
import { ActionPriorityQueue } from './components/ActionPriorityQueue';
import { DiagnosticMonitor } from './components/DiagnosticMonitor';
import { CounterfactualSimulator } from './components/CounterfactualSimulator';
import { TimeAwareMLView } from './components/TimeAwareMLView';
import { PatientJourneyFlow } from './components/PatientJourneyFlow';
import { DataUploadModal } from './components/DataUploadModal';
import { ExplainabilityModal } from './components/ExplainabilityModal';
import { PatientJourneyDrawer } from './components/PatientJourneyDrawer';
import { generateSyntheticHospitalData } from './data/mockDataGenerator';
import { ParsedHospitalDataset } from './utils/dataParser';
import { Encounter, Department, Patient, DiagnosticTest, PriorityActionItem, DatasetStats } from './types/hospital';
import { CheckCircle2, ShieldAlert, Sparkles, FileArchive } from 'lucide-react';

export default function App() {
  // Initial state with benchmark hackathon dataset
  const [initialData] = useState(() => generateSyntheticHospitalData());

  const [patients, setPatients] = useState<Patient[]>(initialData.patients);
  const [departments, setDepartments] = useState<Department[]>(initialData.departments);
  const [encounters, setEncounters] = useState<Encounter[]>(initialData.encounters);
  const [diagnosticTests, setDiagnosticTests] = useState<DiagnosticTest[]>(initialData.diagnosticTests);
  const [priorityActions, setPriorityActions] = useState<PriorityActionItem[]>(initialData.priorityActions);
  const [stats, setStats] = useState<DatasetStats>(initialData.stats);

  const [currentTab, setCurrentTab] = useState<string>('radar');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Explainability Modal State
  const [explainModalState, setExplainModalState] = useState<{
    isOpen: boolean;
    departmentId: string | null;
    departmentName: string | null;
    predictedDelay: number;
  }>({
    isOpen: false,
    departmentId: null,
    departmentName: null,
    predictedDelay: 60
  });

  // Patient Journey Drawer State
  const [selectedEncounter, setSelectedEncounter] = useState<Encounter | null>(null);

  // Toast notification feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handler for loaded ZIP or CSV dataset
  const handleDatasetLoaded = (dataset: ParsedHospitalDataset) => {
    if (dataset.patients.length > 0) setPatients(dataset.patients);
    if (dataset.departments.length > 0) setDepartments(dataset.departments);
    if (dataset.encounters.length > 0) setEncounters(dataset.encounters);
    if (dataset.diagnosticTests.length > 0) setDiagnosticTests(dataset.diagnosticTests);
    if (dataset.priorityActions.length > 0) setPriorityActions(dataset.priorityActions);
    setStats(dataset.stats);
    showToast(`Successfully ingested dataset: ${dataset.stats.encounterCount.toLocaleString()} encounters loaded.`);
  };

  const handleResetData = () => {
    const fresh = generateSyntheticHospitalData();
    setPatients(fresh.patients);
    setDepartments(fresh.departments);
    setEncounters(fresh.encounters);
    setDiagnosticTests(fresh.diagnosticTests);
    setPriorityActions(fresh.priorityActions);
    setStats(fresh.stats);
    showToast('Reset to default Datathon benchmark dataset.');
  };

  // Handler for applying an operational priority action
  const handleApplyAction = (actionId: string) => {
    setPriorityActions(prev =>
      prev.map(a => (a.id === actionId ? { ...a, status: 'Applied' } : a))
    );
    const item = priorityActions.find(a => a.id === actionId);
    if (item) {
      // Simulate relief on that department
      setDepartments(prev =>
        prev.map(d =>
          d.department_id === item.department_id
            ? {
                ...d,
                bottleneck_status: d.bottleneck_status === 'Critical' ? 'Warning' : 'Nominal',
                median_wait_time_mins: Math.max(20, d.median_wait_time_mins - 24),
                load_ratio: Math.max(0.65, Number((d.load_ratio - 0.15).toFixed(2)))
              }
            : d
        )
      );
      showToast(`Applied intervention for ${item.department_name}: -24m predicted queue delay.`);
    }
  };

  // Handler for expediting a forgotten patient
  const handleExpeditePatient = (encounterId: string) => {
    setEncounters(prev =>
      prev.map(e =>
        e.encounter_id === encounterId
          ? {
              ...e,
              is_forgotten_patient: false,
              forgotten_reason: undefined,
              status: 'in_consultation'
            }
          : e
      )
    );
    setStats(prev => ({
      ...prev,
      forgottenPatientsCount: Math.max(0, prev.forgottenPatientsCount - 1)
    }));
    showToast(`Attending physician notified for Encounter ${encounterId}. Patient expedited to consultation.`);
  };

  const openExplainability = (deptId: string, deptName: string, predictedDelay: number) => {
    setExplainModalState({
      isOpen: true,
      departmentId: deptId,
      departmentName: deptName,
      predictedDelay
    });
  };

  const selectedPatient = selectedEncounter
    ? patients.find(p => p.patient_id === selectedEncounter.patient_id) || null
    : null;

  const selectedDepartment = selectedEncounter
    ? departments.find(d => d.department_id === selectedEncounter.department_id) || null
    : null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-teal-100 selection:text-teal-900">
      {/* Top Bar following Top Bar Contract */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
        onResetData={handleResetData}
        stats={stats}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2.5 animate-in slide-in-from-bottom-3 duration-200 border border-slate-700">
            <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Tab Content Routing */}
        {currentTab === 'radar' && (
          <BottleneckRadar
            departments={departments}
            onOpenExplainability={openExplainability}
            onNavigateToForgotten={() => setCurrentTab('forgotten')}
            onNavigateToJourney={() => setCurrentTab('journey')}
          />
        )}

        {currentTab === 'journey' && (
          <PatientJourneyFlow
            encounters={encounters}
            departments={departments}
            patients={patients}
            diagnosticTests={diagnosticTests}
            onSelectPatient={setSelectedEncounter}
            onExpeditePatient={handleExpeditePatient}
          />
        )}

        {currentTab === 'forgotten' && (
          <ForgottenPatientRadar
            encounters={encounters}
            patients={patients}
            departments={departments}
            tests={diagnosticTests}
            onSelectPatient={setSelectedEncounter}
            onExpeditePatient={handleExpeditePatient}
          />
        )}

        {currentTab === 'priority' && (
          <ActionPriorityQueue
            actions={priorityActions}
            onApplyAction={handleApplyAction}
            onOpenExplainability={openExplainability}
          />
        )}

        {currentTab === 'diagnostic' && (
          <DiagnosticMonitor
            tests={diagnosticTests}
            departments={departments}
          />
        )}

        {currentTab === 'simulator' && (
          <CounterfactualSimulator
            departments={departments}
            encounters={encounters}
          />
        )}

        {currentTab === 'ml' && (
          <TimeAwareMLView
            encounters={encounters}
            departments={departments}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">FlowSentinel</span>
            <span aria-hidden="true">·</span>
            <span>Datathon Track 1: Health — The Forgotten Patient</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Synthetic Educational Dataset</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-[11px] text-slate-600">
              {stats.encounterCount.toLocaleString()} Visits / {stats.diagnosticCount.toLocaleString()} Diagnostic Tests
            </span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <DataUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onDatasetLoaded={handleDatasetLoaded}
        currentStats={stats}
      />

      <ExplainabilityModal
        isOpen={explainModalState.isOpen}
        onClose={() => setExplainModalState(prev => ({ ...prev, isOpen: false }))}
        departmentId={explainModalState.departmentId}
        departmentName={explainModalState.departmentName}
        predictedDelayMins={explainModalState.predictedDelay}
      />

      <PatientJourneyDrawer
        encounter={selectedEncounter}
        patient={selectedPatient}
        department={selectedDepartment}
        tests={diagnosticTests}
        onClose={() => setSelectedEncounter(null)}
        onExpeditePatient={handleExpeditePatient}
      />
    </div>
  );
}
