import React from 'react';
import { useWardChart } from '../context/WardChartContext';
import {
  LayoutGrid,
  FileText,
  Stethoscope,
  User,
  HeartPulse,
  Droplets,
  Activity,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet,
  Printer,
  History,
  BrainCircuit,
  AlertTriangle,
  Flame,
  Info
} from 'lucide-react';

interface LandingPortalPageProps {
  onNavigate: (pageId: string) => void;
}

export const LandingPortalPage: React.FC<LandingPortalPageProps> = ({ onNavigate }) => {
  const {
    patients,
    currentUserRole,
    setCurrentUserRole,
    selectedPatient,
    setSelectedPatientId,
    doctorName,
  } = useWardChart();

  const handleSelectDoctorRole = () => {
    setCurrentUserRole('doctor');
    onNavigate('ward-board');
  };

  const handleSelectPatientRole = (patientId?: string) => {
    setCurrentUserRole('patient');
    if (patientId) {
      setSelectedPatientId(patientId);
    }
    onNavigate('patient-booklet');
  };

  const highRiskCount = patients.filter((p) => p.riskTier === 'High Risk').length;
  const modRiskCount = patients.filter((p) => p.riskTier === 'Moderate Risk').length;
  const stableCount = patients.filter((p) => p.riskTier === 'Low Risk').length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* 1. HOSPITAL CLINICAL HEADER BANNER */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        {/* Subtle accent border at top */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-600 via-teal-500 to-red-500" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-mono-chart uppercase font-bold tracking-wider px-2.5 py-1 rounded bg-emerald-800 text-white flex items-center gap-1.5 shadow-2xs">
                <HeartPulse className="w-3.5 h-3.5 text-emerald-300" />
                ST. JUDE CLINICAL HOSPITAL &bull; WARD 4B
              </span>
              <span className="text-xs font-mono-chart text-slate-500">
                Internal Medicine &amp; Metabolic Observation Unit
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#064E3B] font-heading tracking-tight">
              Multimodal Early Disease Detection
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl font-sans leading-relaxed">
              Hospital bedside observation system uniting gold-standard <strong>venous blood biochemistry</strong> with real-time <strong>wearable epidermal sweat sensor telemetry</strong> to identify acute metabolic, renal, and cardiovascular risks up to 9 months before clinical onset.
            </p>
          </div>

          <div className="shrink-0 flex flex-col items-start md:items-end gap-2 text-xs font-mono-chart">
            <div className="bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg text-right">
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Attending Clinician</span>
              <strong className="text-emerald-900 text-sm font-heading">{doctorName}</strong>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded font-bold text-[10px] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                {highRiskCount} High Risk Red
              </span>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-bold text-[10px] flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                {stableCount} Stable Green
              </span>
            </div>
          </div>
        </div>

        {/* 2. DUAL ROLE ENTRY GATEWAYS */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Doctor Gateway Card */}
          <div className="bg-gradient-to-b from-emerald-50/60 to-white border-2 border-emerald-600/60 rounded-xl p-5 flex flex-col justify-between space-y-4 hover:border-emerald-600 hover:shadow-md transition-all">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold shadow-xs">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono-chart font-bold text-emerald-800 uppercase tracking-wide">
                      Physician &amp; Nursing Staff
                    </span>
                    <h3 className="text-xl font-bold text-emerald-950 font-heading">
                      Doctor&apos;s Ward Board
                    </h3>
                  </div>
                </div>
                <span className="text-xs font-mono-chart font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-md border border-emerald-200">
                  Full Roster
                </span>
              </div>

              <p className="text-xs text-slate-600 font-sans leading-relaxed">
                Review all 10 ward beds at a glance, triage high-risk alerts, inspect real-time vital trends, admit inpatients, and write official doctor orders &amp; prescriptions.
              </p>
            </div>

            <button
              onClick={handleSelectDoctorRole}
              className="w-full py-2.5 px-4 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer font-heading"
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Enter Doctor&apos;s Ward Board (All Beds)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Patient Gateway Card */}
          <div className="bg-gradient-to-b from-teal-50/50 to-white border-2 border-teal-600/50 rounded-xl p-5 flex flex-col justify-between space-y-4 hover:border-teal-600 hover:shadow-md transition-all">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-lg bg-teal-700 text-white flex items-center justify-center font-bold shadow-xs">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono-chart font-bold text-teal-800 uppercase tracking-wide">
                      Inpatient &amp; Family View
                    </span>
                    <h3 className="text-xl font-bold text-teal-950 font-heading">
                      Patient Chart Booklet
                    </h3>
                  </div>
                </div>
                <span className="text-xs font-mono-chart font-bold bg-teal-100 text-teal-800 px-2.5 py-1 rounded-md border border-teal-200">
                  Bedside View
                </span>
              </div>

              <p className="text-xs text-slate-600 font-sans leading-relaxed">
                A simplified bedside booklet view with plain-language lab results, your physician&apos;s verified instructions &amp; nutrition plan, and direct reading submission.
              </p>
            </div>

            <button
              onClick={() => handleSelectPatientRole(selectedPatient.id)}
              className="w-full py-2.5 px-4 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer font-heading"
            >
              <FileText className="w-4 h-4" />
              <span>Enter Patient Booklet ({selectedPatient.name})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. WARD 4B ACTIVE BED ROSTER (10 INPATIENT BEDS) */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-lg font-bold text-emerald-950 font-heading uppercase flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-700" />
              Ward 4B Active Bed Roster (10 Inpatients)
            </h2>
            <p className="text-xs text-slate-500 font-mono-chart">
              Click any patient bed to inspect bedside observation chart or write clinical notes
            </p>
          </div>

          <button
            onClick={() => onNavigate('ward-board')}
            className="text-xs font-mono-chart text-emerald-700 hover:text-emerald-800 font-bold hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>Open Interactive Ward Board</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {patients.map((p) => {
            const isHigh = p.riskTier === 'High Risk';
            const isMod = p.riskTier === 'Moderate Risk';

            return (
              <div
                key={p.id}
                onClick={() => {
                  setSelectedPatientId(p.id);
                  onNavigate(currentUserRole === 'doctor' ? 'patient-chart' : 'patient-booklet');
                }}
                className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer space-y-2 hover:shadow-sm font-mono-chart ${
                  isHigh
                    ? 'bg-red-50/70 border-red-300 hover:border-red-500'
                    : isMod
                    ? 'bg-amber-50/70 border-amber-300 hover:border-amber-500'
                    : 'bg-emerald-50/70 border-emerald-300 hover:border-emerald-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">{p.bedNumber}</span>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      isHigh
                        ? 'bg-red-600 text-white'
                        : isMod
                        ? 'bg-amber-500 text-white'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {p.riskTier}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-xs truncate font-heading">{p.name}</h4>
                  <p className="text-[10px] text-slate-500">
                    {p.age}y &bull; {p.sex.toUpperCase()} &bull; {p.mrn}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/80 text-[10px] flex justify-between">
                  <span className={p.healthData.systolic_bp >= 140 ? 'text-red-700 font-bold' : 'text-slate-600'}>
                    BP: {p.healthData.systolic_bp}/{p.healthData.diastolic_bp}
                  </span>
                  <span className={p.healthData.fasting_glucose >= 126 ? 'text-red-700 font-bold' : 'text-slate-600'}>
                    Glu: {p.healthData.fasting_glucose}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. CLINICAL DUAL-STREAM TELEMETRY ARCHITECTURE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stream 1: Blood */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
            <div className="flex items-center gap-2.5">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-600" />
              <h3 className="text-base font-bold text-emerald-950 font-heading uppercase">
                Stream 1: Venous Blood Chemistry
              </h3>
            </div>
            <span className="text-[10px] font-mono-chart bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold border border-emerald-200">
              Gold-Standard Lab Baseline
            </span>
          </div>

          <p className="text-xs text-slate-600 font-sans leading-relaxed">
            Laboratory-certified venous blood draws capture systemic baseline metrics: 3-month glycation (HbA1c), renal glomerular filtration (serum creatinine &amp; eGFR), and complete lipid fractions.
          </p>

          <div className="p-3.5 bg-emerald-50/50 border border-emerald-200 rounded-lg grid grid-cols-2 gap-2.5 text-xs font-mono-chart">
            <div>
              <span className="text-slate-500 block text-[10px]">Systolic / Diastolic</span>
              <strong className="text-emerald-950">120 / 80 mmHg</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Fasting Glucose</span>
              <strong className="text-emerald-950">70 - 99 mg/dL</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Hemoglobin A1c</span>
              <strong className="text-emerald-950">&lt; 5.7% (Normal)</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">eGFR Filtration</span>
              <strong className="text-emerald-950">&gt; 90 mL/min</strong>
            </div>
          </div>
        </div>

        {/* Stream 2: Sweat */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
            <div className="flex items-center gap-2.5">
              <span className="w-3.5 h-3.5 rounded-full bg-teal-600" />
              <h3 className="text-base font-bold text-teal-950 font-heading uppercase">
                Stream 2: Wearable Sweat Patch
              </h3>
            </div>
            <span className="text-[10px] font-mono-chart bg-teal-100 text-teal-800 px-2 py-0.5 rounded font-bold border border-teal-200">
              Continuous Biosensing
            </span>
          </div>

          <p className="text-xs text-slate-600 font-sans leading-relaxed">
            Epidermal microfluidic sensor patches capture continuous metabolic kinetics: cellular fatigue via sweat lactate, sympathetic stress via cortisol surges, and epidermal glucose diffusion.
          </p>

          <div className="p-3.5 bg-teal-50/50 border border-teal-200 rounded-lg grid grid-cols-2 gap-2.5 text-xs font-mono-chart">
            <div>
              <span className="text-slate-500 block text-[10px]">Sweat Lactate</span>
              <strong className="text-teal-950">0.5 - 2.5 mmol/L</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Sweat Cortisol</span>
              <strong className="text-teal-950">0.2 - 1.5 ug/dL</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Sweat Sodium (Na+)</span>
              <strong className="text-teal-950">20 - 60 mM</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Sweat Glucose</span>
              <strong className="text-teal-950">0.1 - 1.0 mg/dL</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
