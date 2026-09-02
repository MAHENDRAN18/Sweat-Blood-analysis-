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

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* 1. HOSPITAL WARD HEADER BANNER */}
      <div className="bg-[#FFFFFF] border-2 border-[#2B4570] rounded-lg p-6 sm:p-8 shadow-md chart-paper relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b-2 border-[#2B4570] pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-mono-chart uppercase font-bold tracking-wider px-2.5 py-0.5 rounded bg-[#2B4570] text-[#FAF6EE]">
                ST. JUDE CLINICAL RESEARCH HOSPITAL &bull; WARD 4B
              </span>
              <span className="text-xs font-mono-chart text-[#556987]">
                Internal Medicine &amp; Metabolic Observation Unit
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2B4570] font-heading tracking-tight">
              Ward Chart: Multimodal Patient Care
            </h1>

            <p className="text-xs sm:text-sm text-[#334155] max-w-3xl font-mono-chart leading-relaxed">
              Modeled on paper observation charts clipped to the foot of hospital beds. By uniting periodic <strong>venous blood tests</strong> with real-time <strong>wearable sweat sensor telemetry</strong>, Ward Chart detects acute metabolic and cardiovascular risks up to 9 months before clinical onset.
            </p>
          </div>

          <div className="shrink-0 flex flex-col items-start md:items-end gap-2 text-xs font-mono-chart">
            <div className="bg-[#FAF6EE] border border-[#C9D6DE] px-3.5 py-2 rounded text-right">
              <span className="text-[#556987] block text-[10px] uppercase font-bold">Attending Clinician</span>
              <strong className="text-[#2B4570] text-sm">{doctorName}</strong>
            </div>
            <span className="text-[#6B8F71] font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 10 Beds Occupied &bull; Telemetry Active
            </span>
          </div>
        </div>

        {/* 2. DUAL ROLE ENTRY GATEWAYS */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Doctor Gateway Card */}
          <div className="bg-[#FAF6EE] border-2 border-[#2B4570] rounded-lg p-5 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded bg-[#2B4570] text-[#FAF6EE] flex items-center justify-center font-bold">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono-chart font-bold text-[#2B4570] uppercase">
                      Physician &amp; Nursing Staff
                    </span>
                    <h3 className="text-xl font-bold text-[#2B4570] font-heading">
                      Doctor&apos;s Ward Board
                    </h3>
                  </div>
                </div>
                <span className="text-xs font-mono-chart font-bold bg-[#E2EAF0] text-[#2B4570] px-2.5 py-1 rounded">
                  Full Roster
                </span>
              </div>

              <p className="text-xs text-[#334155] font-mono-chart leading-relaxed">
                Review all 10 ward beds at a glance, triage high-risk alerts, inspect pen-plotted vital trends, and write official editable Doctor Notes &amp; Prescriptions.
              </p>
            </div>

            <button
              onClick={handleSelectDoctorRole}
              className="w-full py-2.5 px-4 rounded bg-[#2B4570] hover:bg-[#1D3254] text-[#FAF6EE] text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer font-heading"
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Enter as Attending Physician (Ward Board)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Patient Gateway Card */}
          <div className="bg-[#FAF8F2] border-2 border-[#C98A2B] rounded-lg p-5 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded bg-[#C98A2B] text-[#FAF6EE] flex items-center justify-center font-bold">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono-chart font-bold text-[#876527] uppercase">
                      Inpatient &amp; Family View
                    </span>
                    <h3 className="text-xl font-bold text-[#876527] font-heading">
                      Patient Chart Booklet
                    </h3>
                  </div>
                </div>
                <span className="text-xs font-mono-chart font-bold bg-[#FEF5E7] text-[#C98A2B] border border-[#FAD7A0] px-2.5 py-1 rounded">
                  Read-Only Orders
                </span>
              </div>

              <p className="text-xs text-[#334155] font-mono-chart leading-relaxed">
                A simplified bedside booklet view with plain-language lab results, your doctor&apos;s verified instructions &amp; diet plan, and direct reading submission.
              </p>
            </div>

            <button
              onClick={() => handleSelectPatientRole(selectedPatient.id)}
              className="w-full py-2.5 px-4 rounded bg-[#C98A2B] hover:bg-[#A9701E] text-[#FAF6EE] text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer font-heading"
            >
              <FileText className="w-4 h-4" />
              <span>Enter as Patient ({selectedPatient.name})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. WARD 4B INPATIENT ROSTER STRIP (10 BEDS) */}
      <div className="bg-[#FFFFFF] border-2 border-[#2B4570] rounded-lg p-5 chart-paper shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-[#2B4570] pb-3">
          <div>
            <h2 className="text-lg font-bold text-[#2B4570] font-heading uppercase">
              Ward 4B Active Bed Roster (10 Inpatients)
            </h2>
            <p className="text-xs text-[#556987] font-mono-chart">
              Click any patient bed to view their bedside chart or open their patient booklet
            </p>
          </div>

          <button
            onClick={() => onNavigate('ward-board')}
            className="text-xs font-mono-chart text-[#2B4570] font-bold hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
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
                className={`p-3 rounded border transition-all cursor-pointer space-y-2 hover:shadow-xs font-mono-chart ${
                  isHigh
                    ? 'bg-[#FDEDEC] border-[#F5B7B1] hover:border-[#B33A3A]'
                    : isMod
                    ? 'bg-[#FEF5E7] border-[#FAD7A0] hover:border-[#C98A2B]'
                    : 'bg-[#FAF6EE] border-[#C9D6DE] hover:border-[#2B4570]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#2B4570] text-xs">{p.bedNumber}</span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                      isHigh ? 'ink-red' : isMod ? 'ink-amber' : 'ink-blue'
                    }`}
                  >
                    {p.riskTier}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-[#1E293B] text-xs truncate">{p.name}</h4>
                  <p className="text-[10px] text-[#556987]">
                    {p.age}y &bull; {p.sex.toUpperCase()} &bull; {p.mrn}
                  </p>
                </div>

                <div className="pt-1 border-t border-[#D1DCE5] text-[10px] text-[#556987] flex justify-between">
                  <span>BP: {p.healthData.systolic_bp}/{p.healthData.diastolic_bp}</span>
                  <span>Glu: {p.healthData.fasting_glucose}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. CLINICAL DUAL-STREAM ARCHITECTURE EXPLAINED */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stream 1: Blood */}
        <div className="bg-[#FFFFFF] border-2 border-[#2B4570] rounded-lg p-5 chart-paper shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b-2 border-[#2B4570] pb-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#2B4570]" />
              <h3 className="text-base font-bold text-[#2B4570] font-heading uppercase">
                Stream 1: Venous Blood Chemistry
              </h3>
            </div>
            <span className="text-[10px] font-mono-chart bg-[#E2EAF0] text-[#2B4570] px-2 py-0.5 rounded font-bold">
              Gold-Standard Baseline
            </span>
          </div>

          <p className="text-xs text-[#334155] font-mono-chart leading-relaxed">
            Laboratory-certified venous blood draws capture systemic baseline metrics: 3-month glycation (HbA1c), renal glomerular filtration (serum creatinine &amp; eGFR), and complete lipid fractions.
          </p>

          <div className="p-3 bg-[#FAF6EE] border border-[#D1DCE5] rounded grid grid-cols-2 gap-2 text-xs font-mono-chart">
            <div>
              <span className="text-[#556987] block text-[10px]">Systolic / Diastolic</span>
              <strong className="text-[#2B4570]">120 / 80 mmHg</strong>
            </div>
            <div>
              <span className="text-[#556987] block text-[10px]">Fasting Glucose</span>
              <strong className="text-[#2B4570]">70 - 99 mg/dL</strong>
            </div>
            <div>
              <span className="text-[#556987] block text-[10px]">Hemoglobin A1c</span>
              <strong className="text-[#2B4570]">&lt; 5.7% (Normal)</strong>
            </div>
            <div>
              <span className="text-[#556987] block text-[10px]">eGFR Filtration</span>
              <strong className="text-[#2B4570]">&gt; 90 mL/min</strong>
            </div>
          </div>
        </div>

        {/* Stream 2: Sweat */}
        <div className="bg-[#FFFFFF] border-2 border-[#C98A2B] rounded-lg p-5 chart-paper shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b-2 border-[#C98A2B] pb-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#C98A2B]" />
              <h3 className="text-base font-bold text-[#876527] font-heading uppercase">
                Stream 2: Wearable Sweat Patch
              </h3>
            </div>
            <span className="text-[10px] font-mono-chart bg-[#FEF5E7] text-[#C98A2B] border border-[#FAD7A0] px-2 py-0.5 rounded font-bold">
              Continuous Telemetry
            </span>
          </div>

          <p className="text-xs text-[#334155] font-mono-chart leading-relaxed">
            Epidermal microfluidic sensor patches capture continuous metabolic kinetics: cellular fatigue via sweat lactate, sympathetic stress via cortisol surges, and epidermal glucose diffusion.
          </p>

          <div className="p-3 bg-[#FAF8F2] border border-[#E8DFC9] rounded grid grid-cols-2 gap-2 text-xs font-mono-chart">
            <div>
              <span className="text-[#876527] block text-[10px]">Sweat Lactate</span>
              <strong className="text-[#2B4570]">0.5 - 2.5 mmol/L</strong>
            </div>
            <div>
              <span className="text-[#876527] block text-[10px]">Sweat Cortisol</span>
              <strong className="text-[#2B4570]">0.2 - 1.5 ug/dL</strong>
            </div>
            <div>
              <span className="text-[#876527] block text-[10px]">Sweat Sodium (Na+)</span>
              <strong className="text-[#2B4570]">20 - 60 mM</strong>
            </div>
            <div>
              <span className="text-[#876527] block text-[10px]">Sweat Glucose</span>
              <strong className="text-[#2B4570]">0.1 - 1.0 mg/dL</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
