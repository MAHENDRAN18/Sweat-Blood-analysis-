import React from 'react';
import { useWardChart } from '../context/WardChartContext';
import {
  FileText,
  Stethoscope,
  ShieldCheck,
  ClipboardList,
  Droplets,
  Activity,
  Printer,
  PlusCircle,
  CheckCircle2,
  AlertTriangle,
  HeartPulse,
  Clock,
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';

interface PatientBookletPageProps {
  onNavigate: (pageId: string) => void;
}

export const PatientBookletPage: React.FC<PatientBookletPageProps> = ({ onNavigate }) => {
  const {
    selectedPatient,
    patients,
    setSelectedPatientId,
    doctorName,
  } = useWardChart();

  const data = selectedPatient.healthData;
  const pred = selectedPatient.latestPrediction;
  const notes = selectedPatient.doctorNotes;

  const isHighRisk = selectedPatient.riskTier === 'High Risk';
  const isModerateRisk = selectedPatient.riskTier === 'Moderate Risk';

  return (
    <div className="space-y-6">
      {/* 1. PATIENT BOOKLET WELCOME BANNER */}
      <div className="bg-[#FFFFFF] border-2 border-[#2B4570] rounded-lg p-5 shadow-xs chart-paper relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D1DCE5] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono-chart uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#2B4570] text-[#FAF6EE]">
                MY PATIENT BEDSIDE BOOKLET
              </span>
              <span className="text-xs font-mono-chart text-[#556987]">
                Bed: {selectedPatient.bedNumber} &bull; {selectedPatient.mrn}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#2B4570] font-heading mt-1">
              Welcome, {selectedPatient.name}
            </h1>
            <p className="text-xs text-[#556987] font-mono-chart mt-0.5">
              Attending Physician: <strong className="text-[#2B4570]">{selectedPatient.attendingDoctor}</strong> &bull; Admitted on {selectedPatient.admissionDate}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onNavigate('submit-readings')}
              className="px-4 py-2 rounded bg-[#2B4570] hover:bg-[#1D3254] text-[#FAF6EE] text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer font-heading"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Submit New Readings</span>
            </button>
            <button
              onClick={() => onNavigate('report')}
              className="px-3.5 py-2 rounded bg-[#FAF6EE] hover:bg-[#E2EAF0] text-[#2B4570] border border-[#C9D6DE] text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer font-heading"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>

        {/* Plain Language Summary Card */}
        <div className="mt-4 bg-[#F2F6F9] border border-[#D1DCE5] rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded bg-[#2B4570] text-[#FAF6EE] mt-0.5">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[#2B4570] text-sm font-heading">
                Current Health Status Summary:
              </h3>
              <p className="text-xs text-[#334155] mt-1 leading-relaxed max-w-2xl">
                {isHighRisk ? (
                  <span>
                    Your latest blood and sweat biomarkers indicate <strong>higher metabolic and cardiovascular stress</strong>. Your care team has adjusted your medication and dietary protocols below.
                  </span>
                ) : isModerateRisk ? (
                  <span>
                    Your readings show <strong>moderate elevation in some markers</strong> (such as glucose or blood pressure). Adhering to your doctor&apos;s lifestyle and medication directives will help stabilize these trends.
                  </span>
                ) : (
                  <span>
                    Your readings are currently in a <strong>stable, balanced range</strong>. Continue following your hydration and daily activity guidelines.
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="shrink-0 bg-[#FFFFFF] border border-[#C9D6DE] px-4 py-2 rounded text-center font-mono-chart">
            <span className="text-[10px] text-[#556987] uppercase block font-bold">Risk Level</span>
            <span
              className={`text-lg font-bold ${
                isHighRisk ? 'ink-red' : isModerateRisk ? 'ink-amber' : 'ink-blue'
              }`}
            >
              {selectedPatient.riskTier}
            </span>
          </div>
        </div>
      </div>

      {/* 2. DOCTOR'S ORDERS & ADVICE (READ-ONLY FOR PATIENT) */}
      <div className="bg-[#FFFFFF] border-2 border-[#2B4570] rounded-lg p-5 chart-paper shadow-md">
        <div className="flex items-center justify-between border-b-2 border-[#2B4570] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-[#2B4570] text-[#FAF6EE] flex items-center justify-center font-bold">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#2B4570] font-heading">
                Instructions from Your Attending Doctor
              </h3>
              <p className="text-xs font-mono-chart text-[#556987]">
                Written by <strong>{notes.authorDoctor}</strong> &bull; Signed on {notes.timestamp}
              </p>
            </div>
          </div>

          <div className="bg-[#EAFAF1] border border-[#A9DFBF] text-[#6B8F71] px-3 py-1 rounded text-xs font-mono-chart font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Verified Physician Orders</span>
          </div>
        </div>

        {/* 4 Clean Card Panels for the Patient */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Precautions */}
          <div className="bg-[#FAF6EE] border border-[#D1DCE5] rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-[#B33A3A] font-bold font-mono-chart uppercase text-[11px]">
              <ShieldCheck className="w-4 h-4" />
              <span>Precautions &amp; Alerts</span>
            </div>
            <p className="text-[#1E293B] leading-relaxed font-sans text-xs">
              {notes.clinicalPrecautions}
            </p>
          </div>

          {/* Medications */}
          <div className="bg-[#FAF6EE] border border-[#D1DCE5] rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-[#2B4570] font-bold font-mono-chart uppercase text-[11px]">
              <ClipboardList className="w-4 h-4" />
              <span>Prescriptions &amp; Medications</span>
            </div>
            <p className="text-[#1E293B] leading-relaxed font-sans text-xs">
              {notes.medicationOrders}
            </p>
          </div>

          {/* Diet & Hydration */}
          <div className="bg-[#FAF8F2] border border-[#E8DFC9] rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-[#876527] font-bold font-mono-chart uppercase text-[11px]">
              <Droplets className="w-4 h-4" />
              <span>Diet &amp; Hydration Strategy</span>
            </div>
            <p className="text-[#1E293B] leading-relaxed font-sans text-xs">
              {notes.dietaryDirectives}
            </p>
          </div>

          {/* Observation & Follow-up */}
          <div className="bg-[#FAF6EE] border border-[#D1DCE5] rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-[#6B8F71] font-bold font-mono-chart uppercase text-[11px]">
              <Activity className="w-4 h-4" />
              <span>Observation &amp; Next Check-up</span>
            </div>
            <p className="text-[#1E293B] leading-relaxed font-sans text-xs">
              {notes.observationOrders}
            </p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#E2EAF0] flex items-center justify-between text-[11px] font-mono-chart text-[#556987]">
          <span className="flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-[#2B4570]" />
            Note: Patient view is read-only. Your doctor updates these orders during clinical rounds.
          </span>
          <button
            onClick={() => onNavigate('submit-readings')}
            className="text-[#2B4570] font-bold hover:underline flex items-center gap-1 cursor-pointer"
          >
            Submit New Lab Results <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. PATIENT'S READINGS SUMMARY SHEET (EASY-TO-READ) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Blood Tests */}
        <div className="bg-[#FFFFFF] border-2 border-[#2B4570] rounded-lg p-5 chart-paper shadow-xs">
          <div className="flex items-center justify-between border-b-2 border-[#2B4570] pb-2 mb-3">
            <h3 className="text-base font-bold text-[#2B4570] font-heading uppercase">
              My Latest Blood Test Readings
            </h3>
            <span className="text-[10px] font-mono-chart bg-[#E2EAF0] text-[#2B4570] px-2 py-0.5 rounded font-bold">
              Lab Record
            </span>
          </div>

          <div className="space-y-2.5 text-xs font-mono-chart">
            <div className="flex items-center justify-between p-2 rounded bg-[#FAF6EE] border border-[#D1DCE5]">
              <div>
                <span className="font-bold text-[#1E293B] block">Blood Pressure:</span>
                <span className="text-[10px] text-[#556987]">Target: Under 120/80</span>
              </div>
              <span className={`font-bold text-sm ${data.systolic_bp >= 140 ? 'ink-red' : 'ink-blue'}`}>
                {data.systolic_bp}/{data.diastolic_bp} mmHg
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded bg-[#FAF6EE] border border-[#D1DCE5]">
              <div>
                <span className="font-bold text-[#1E293B] block">Fasting Blood Glucose:</span>
                <span className="text-[10px] text-[#556987]">Target: 70 - 99 mg/dL</span>
              </div>
              <span className={`font-bold text-sm ${data.fasting_glucose >= 126 ? 'ink-red' : 'ink-blue'}`}>
                {data.fasting_glucose} mg/dL
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded bg-[#FAF6EE] border border-[#D1DCE5]">
              <div>
                <span className="font-bold text-[#1E293B] block">HbA1c (3-Month Sugar Average):</span>
                <span className="text-[10px] text-[#556987]">Target: Under 5.7%</span>
              </div>
              <span className={`font-bold text-sm ${(data.hba1c || 5.4) >= 6.5 ? 'ink-red' : 'ink-blue'}`}>
                {data.hba1c || 5.4}%
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded bg-[#FAF6EE] border border-[#D1DCE5]">
              <div>
                <span className="font-bold text-[#1E293B] block">Kidney Filtration (eGFR):</span>
                <span className="text-[10px] text-[#556987]">Target: Above 90 mL/min</span>
              </div>
              <span className={`font-bold text-sm ${(data.egfr || 90) < 60 ? 'ink-red' : 'ink-blue'}`}>
                {data.egfr || 90} mL/min
              </span>
            </div>
          </div>
        </div>

        {/* Sweat Sensor Patch */}
        <div className="bg-[#FFFFFF] border-2 border-[#C98A2B] rounded-lg p-5 chart-paper shadow-xs">
          <div className="flex items-center justify-between border-b-2 border-[#C98A2B] pb-2 mb-3">
            <h3 className="text-base font-bold text-[#876527] font-heading uppercase">
              My Wearable Sweat Patch Telemetry
            </h3>
            <span className="text-[10px] font-mono-chart bg-[#FEF5E7] text-[#C98A2B] border border-[#FAD7A0] px-2 py-0.5 rounded font-bold">
              Connected Sensor
            </span>
          </div>

          <div className="space-y-2.5 text-xs font-mono-chart">
            <div className="flex items-center justify-between p-2 rounded bg-[#FAF8F2] border border-[#E8DFC9]">
              <div>
                <span className="font-bold text-[#1E293B] block">Sweat Lactate (Metabolic Fatigue):</span>
                <span className="text-[10px] text-[#556987]">Normal: 0.5 - 2.5 mmol/L</span>
              </div>
              <span className={`font-bold text-sm ${(data.sweat_lactate || 1.8) >= 2.5 ? 'ink-red' : 'text-[#2B4570]'}`}>
                {data.sweat_lactate || 1.8} mmol/L
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded bg-[#FAF8F2] border border-[#E8DFC9]">
              <div>
                <span className="font-bold text-[#1E293B] block">Sweat Cortisol (Physical Stress):</span>
                <span className="text-[10px] text-[#556987]">Normal: 0.2 - 1.5 ug/dL</span>
              </div>
              <span className={`font-bold text-sm ${(data.sweat_cortisol || 1.2) >= 1.5 ? 'ink-red' : 'text-[#2B4570]'}`}>
                {data.sweat_cortisol || 1.2} ug/dL
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded bg-[#FAF8F2] border border-[#E8DFC9]">
              <div>
                <span className="font-bold text-[#1E293B] block">Sweat Glucose:</span>
                <span className="text-[10px] text-[#556987]">Normal: 0.1 - 1.0 mg/dL</span>
              </div>
              <span className={`font-bold text-sm ${(data.sweat_glucose || 0.6) >= 1.0 ? 'ink-red' : 'text-[#2B4570]'}`}>
                {data.sweat_glucose || 0.6} mg/dL
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded bg-[#FAF8F2] border border-[#E8DFC9]">
              <div>
                <span className="font-bold text-[#1E293B] block">Sweat Sodium (Hydration Level):</span>
                <span className="text-[10px] text-[#556987]">Normal: 20 - 60 mM</span>
              </div>
              <span className="font-bold text-sm text-[#2B4570]">
                {data.sweat_sodium || 42} mM
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
