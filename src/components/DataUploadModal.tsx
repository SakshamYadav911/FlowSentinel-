import React, { useState, useRef } from 'react';
import { X, Upload, FileArchive, CheckCircle2, AlertCircle, FileText, Download, Copy, Check } from 'lucide-react';
import { parseHospitalZip, parseIndividualCsvs, ParsedHospitalDataset } from '../utils/dataParser';
import { DatasetStats } from '../types/hospital';

interface DataUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDatasetLoaded: (dataset: ParsedHospitalDataset) => void;
  currentStats: DatasetStats;
}

export const DataUploadModal: React.FC<DataUploadModalProps> = ({
  isOpen,
  onClose,
  onDatasetLoaded,
  currentStats
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsProcessing(true);
    setErrorMessage(null);
    setStatusMessage('Decompressing and parsing hospital dataset...');

    try {
      let result: ParsedHospitalDataset;
      const firstFile = files[0];

      if (firstFile.name.endsWith('.zip')) {
        setStatusMessage(`Decompressing ${firstFile.name} in browser...`);
        result = await parseHospitalZip(firstFile);
      } else {
        setStatusMessage(`Parsing ${files.length} CSV file(s)...`);
        result = await parseIndividualCsvs(Array.from(files));
      }

      setStatusMessage(`Successfully loaded ${result.stats.encounterCount} encounters and ${result.stats.patientCount} patients.`);
      setTimeout(() => {
        onDatasetLoaded(result);
        onClose();
        setIsProcessing(false);
        setStatusMessage(null);
      }, 600);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to parse ZIP or CSV dataset. Please check the file format.');
      setIsProcessing(false);
      setStatusMessage(null);
    }
  };

  const pythonSnippet = `import pandas as pd

for name in ['patients.csv', 'encounters.csv', 'departments.csv', 'diagnostic_tests.csv']:
    try:
        df = pd.read_csv(name)
        print(f"\\n{'='*20} {name} {'='*20}")
        print(f"Shape: {df.shape}")
        print(df.dtypes)
        print("\\nSample (First 2 rows):")
        print(df.head(2).to_dict(orient='records'))
    except Exception as e:
        print(f"Could not load {name}: {e}")`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pythonSnippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Load Hospital Dataset (.zip or .csv)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Processes raw ZIP or CSVs locally in-browser with zero token consumption.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Answer to user's question on ZIP files */}
          <div className="bg-teal-50/70 border border-teal-200 rounded-lg p-3.5 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
            <div className="text-xs text-teal-900 space-y-1">
              <p className="font-semibold">
                Yes, ZIP files are fully supported!
              </p>
              <p className="text-teal-800 leading-relaxed">
                You do not need to upload raw CSV rows into chat or burn millions of tokens. Drop your downloaded Datathon <span className="font-mono font-semibold">.zip</span> bundle here; our in-browser JSZip engine parses the 4 files instantly and links them via <span className="font-mono">patient_id</span>, <span className="font-mono">department_id</span>, and <span className="font-mono">encounter_id</span>.
              </p>
            </div>
          </div>

          {/* Drag & Drop Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              handleFiles(e.dataTransfer.files);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-teal-500 bg-teal-50/40'
                : 'border-slate-300 hover:border-slate-400 bg-slate-50/60'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".zip,.csv"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
            <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center mx-auto mb-3 shadow-xs">
              <FileArchive className="w-6 h-6 text-slate-700" />
            </div>
            <p className="text-sm font-semibold text-slate-900">
              Drop your Datathon <span className="text-teal-700 font-mono">.zip</span> file or CSVs here
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Accepts <span className="font-mono">patients.csv</span>, <span className="font-mono">encounters.csv</span>, <span className="font-mono">departments.csv</span>, and <span className="font-mono">diagnostic_tests.csv</span>
            </p>
            <div className="mt-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 shadow-2xs">
                <Upload className="w-3.5 h-3.5" />
                Browse Local Files
              </span>
            </div>
          </div>

          {/* Processing / Status States */}
          {statusMessage && (
            <div className="p-3 bg-slate-100 rounded-lg text-xs font-medium text-slate-800 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full border-2 border-slate-600 border-t-transparent animate-spin" />
              <span>{statusMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Current Loaded Dataset Info */}
          <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/80">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-slate-700">Currently Active Dataset:</span>
              <span className="text-slate-500 font-mono text-[11px]">{currentStats.sourceFilename}</span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="bg-white p-2 rounded border border-slate-200">
                <div className="font-mono font-bold text-slate-900 tabular-nums">{currentStats.patientCount.toLocaleString()}</div>
                <div className="text-[10px] text-slate-500">Patients</div>
              </div>
              <div className="bg-white p-2 rounded border border-slate-200">
                <div className="font-mono font-bold text-slate-900 tabular-nums">{currentStats.encounterCount.toLocaleString()}</div>
                <div className="text-[10px] text-slate-500">Encounters</div>
              </div>
              <div className="bg-white p-2 rounded border border-slate-200">
                <div className="font-mono font-bold text-slate-900 tabular-nums">{currentStats.departmentCount}</div>
                <div className="text-[10px] text-slate-500">Departments</div>
              </div>
              <div className="bg-white p-2 rounded border border-slate-200">
                <div className="font-mono font-bold text-slate-900 tabular-nums">{currentStats.diagnosticCount.toLocaleString()}</div>
                <div className="text-[10px] text-slate-500">Tests</div>
              </div>
            </div>
          </div>

          {/* Python Snippet for local exploration */}
          <div className="border border-slate-200 rounded-lg p-3 bg-slate-900 text-slate-100">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-300">
                Local Inspection Snippet (Python Pandas)
              </span>
              <button
                onClick={copyToClipboard}
                className="inline-flex items-center gap-1 text-[11px] text-teal-400 hover:text-teal-300 font-medium cursor-pointer"
              >
                {copiedSnippet ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSnippet ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mb-2 leading-relaxed">
              Run this in your terminal or Jupyter notebook to inspect shapes and sample records without printing millions of tokens:
            </p>
            <pre className="font-mono text-[11px] bg-slate-950 p-2.5 rounded overflow-x-auto text-teal-200">
              {pythonSnippet}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
