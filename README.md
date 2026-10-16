# FlowSentinel — Hospital Flow & Bottleneck Predictor

Predictive patient journey and bottleneck cascade early-warning system for the **"HEALTH — THE FORGOTTEN PATIENT"** Datathon track.

---

## How to Run the App Locally in PyCharm

This project contains two components:
1. **The Interactive Web Command Center** (built with React, TypeScript, Vite & Tailwind CSS)
2. **The Companion Data Science Pipeline** (`pipeline.py` for Python Pandas / Scikit-Learn)

---

### Step 1: Run the Interactive Web Application

The interactive UI runs on **Node.js**:

1. Open **PyCharm**.
2. Open the **Terminal** tab at the bottom of PyCharm (shortcut: `Alt + F12` on Windows/Linux or `Option + F12` on macOS).
3. Ensure you have Node.js installed (check by typing `node -v`). If not installed, download it from [nodejs.org](https://nodejs.org/) (LTS version).
4. Run:
   ```bash
   npm install
   npm run dev
   ```
5. Click the link in the terminal (usually `http://localhost:3000` or `http://localhost:5173`) to open the app in your browser!

---

### Step 2: (Optional) Run the Companion Python Pipeline in your venv

If you want to run Python ML analysis directly inside your PyCharm Python `venv`:

1. In PyCharm's Terminal (with your `venv` active):
   ```bash
   pip install pandas numpy scikit-learn
   ```
2. Place your 4 CSV files (`patients.csv`, `encounters.csv`, `departments.csv`, `diagnostic_tests.csv`) in the project root folder.
3. Run:
   ```bash
   python pipeline.py
   ```
   This will run the chronological time-aware 75/25 train-test split, compute the $Z$-score for **The Forgotten Patient** detection, and compute the Diagnostic Latency Index (DLI).

---

### Step 3: Loading Your Dataset in the Web App

In the web interface:
- Click **"Load Zip / CSVs"** in the top navigation bar.
- Drag & drop your Datathon `.zip` file (or select individual `.csv` files).
- The web app decompresses and processes the tables directly in your browser with zero token limits!
