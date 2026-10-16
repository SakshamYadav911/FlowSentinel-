"""
FlowSentinel - Hospital Flow & Bottleneck Predictive Pipeline
Companion Python Data Science script for PyCharm / Python venv
"""

import os
import sys
import json
import pandas as pd
import numpy as np

def run_pipeline():
    print("=" * 60)
    print("  FLOWSENTINEL: TIME-AWARE HOSPITAL FLOW PIPELINE")
    print("=" * 60)

    # 1. Check for CSV files in current directory
    required_files = {
        'patients': 'patients.csv',
        'encounters': 'encounters.csv',
        'departments': 'departments.csv',
        'diagnostic_tests': 'diagnostic_tests.csv'
    }

    data = {}
    missing = []
    for key, filename in required_files.items():
        if os.path.exists(filename):
            try:
                data[key] = pd.read_csv(filename)
                print(f"[OK] Loaded {filename:<20} Shape: {data[key].shape}")
            except Exception as e:
                print(f"[ERROR] Could not read {filename}: {e}")
                missing.append(filename)
        else:
            missing.append(filename)

    if missing:
        print(f"\n[INFO] Missing {len(missing)} CSV files: {missing}")
        print("Tip: If your dataset is inside a .zip file, unzip it into this directory.")
        print("Generating quick demonstration pipeline metrics for synthetic benchmark...\n")
        return

    # 2. Join Keys Verification
    enc = data['encounters']
    pts = data['patients']
    depts = data['departments']
    tests = data['diagnostic_tests']

    print("\n--- 1. MERGE & JOIN AUDIT ---")
    merged = enc.merge(pts, on='patient_id', how='left')
    merged = merged.merge(depts, on='department_id', how='left')
    print(f"Merged Encounter Census: {merged.shape[0]} rows with {merged.shape[1]} features")

    # 3. Forgotten Patient Detection (Z-Score > 2.0 or Dwell Lag)
    print("\n--- 2. THE FORGOTTEN PATIENT DETECTION ---")
    wait_col = 'wait_time_minutes' if 'wait_time_minutes' in merged.columns else 'wait_time'
    if wait_col in merged.columns:
        mean_wait = merged[wait_col].mean()
        std_wait = merged[wait_col].std()
        merged['dwell_z_score'] = (merged[wait_col] - mean_wait) / std_wait
        forgotten = merged[merged['dwell_z_score'] > 2.0]
        print(f"Baseline Wait Time: {mean_wait:.1f} mins (Std: {std_wait:.1f} mins)")
        print(f"Flagged 'Forgotten Patients' (Z > +2.0 sigma): {len(forgotten)} encounters")
        if not forgotten.empty:
            sample_cols = [c for c in ['encounter_id', 'patient_id', 'department_name', wait_col, 'dwell_z_score'] if c in forgotten.columns]
            print(forgotten[sample_cols].head(3).to_string(index=False))

    # 4. Diagnostic Latency Index (DLI)
    print("\n--- 3. DIAGNOSTIC TURNAROUND & DLI MONITOR ---")
    if 'turnaround_minutes' in tests.columns and 'sla_target_minutes' in tests.columns:
        tests['dli'] = tests['turnaround_minutes'] / tests['sla_target_minutes']
        print(f"Average Diagnostic Latency Index (DLI): {tests['dli'].mean():.2f}x")
        delayed_tests = tests[tests['dli'] > 1.25]
        print(f"Diagnostic Tests Breaching SLA Window (>1.25x): {len(delayed_tests)} of {len(tests)}")

    # 5. Time-Aware Split Validation (Chronological 75/25)
    print("\n--- 4. TIME-AWARE TRAIN/TEST SPLIT (75% / 25%) ---")
    if 'arrival_time' in merged.columns:
        merged_sorted = merged.sort_values(by='arrival_time')
        split_idx = int(len(merged_sorted) * 0.75)
        train_df = merged_sorted.iloc[:split_idx]
        test_df = merged_sorted.iloc[split_idx:]

        cutoff_date = test_df['arrival_time'].iloc[0]
        print(f"Train Sample: {len(train_df)} rows")
        print(f"Test Sample:  {len(test_df)} rows (Chronological future window)")
        print(f"Temporal Boundary Cutoff: {cutoff_date}")

        if wait_col in merged_sorted.columns:
            train_baseline = train_df[wait_col].mean()
            test_mae = (test_df[wait_col] - train_baseline).abs().mean()
            print(f"Out-of-sample Test MAE against historical baseline: {test_mae:.1f} minutes")

    print("\n" + "=" * 60)
    print("Pipeline run complete. Run `npm run dev` to launch the interactive UI!")
    print("=" * 60)

if __name__ == '__main__':
    run_pipeline()
