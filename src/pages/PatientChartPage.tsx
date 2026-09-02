import React, { useState } from 'react';
import { useWardChart } from '../context/WardChartContext';
import {
  ClipboardList,
  Stethoscope,
  FileCheck2,
  Save,
  Printer,
  History,
  AlertTriangle,
  CheckCircle2,
  Flame,
  Droplets,
  Activity,
  Bed,
  Calendar,
  User,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { DoctorNotesData } from '../types';

interface PatientChartPageProps {
  onNavigate: (pageId: string) => void;
}

export const PatientChartPage: React.FC<PatientChartPageProps> = ({ onNavigate }) => {
  const {
    selectedPatient,
    patients,
    setSelectedPatientId,
    doctorName,
    updateDoctorNotes,
  } = useWardChart();

  // Local state for editable doctor notes
  const [precautions, setPrecautions] = useState(selectedPatient.doctorNotes.clinicalPrecautions);
  const [medications, setMedications] = useState(selectedPatient.doctorNotes.medicationOrders);
  const [dietary, setDietary] = useState(selectedPatient.doctorNotes.dietaryDirectives);
  const [observation, setObservation] = useState(selectedPatient.doctorNotes.observationOrders);
  const [saveToast, setSaveToast] = useState(false);

  // Sync state when selected patient changes
  React.useEffect(() => {
    setPrecautions(selectedPatient.doctorNotes.clinicalPrecautions);
    setMedications(selectedPatient.doctorNotes.medicationOrders);
    setDietary(selectedPatient.doctorNotes.dietaryDirectives);
    setObservation(selectedPatient.doctorNotes.observationOrders);
  }, [selectedPatient.id]);

  const handleSaveNotes = () => {
    updateDoctorNotes(selectedPatient.id, {
      clinicalPrecautions: precautions,
      medicationOrders: medications,
      dietaryDirectives: dietary,
      observationOrders: observation,
    });

    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 4000);
  };

  const applyPreset = (type: 'cardiac' | 'diabetic' | 'renal' | 'discharge') => {
    if (type === 'cardiac') {
      setPrecautions('Continuous telemetry cardiac monitoring. Alert nursing if SBP > 140 or HR > 100.');
      setMedications('Lisinopril 10mg PO daily, Atorvastatin 20mg PO at bedtime. Hold if SBP < 100.');
      setDietary('Strict 2,000mg sodium cardiac diet. Fluid restriction to 1.8L/day.');
      setObservation('Serial blood pressure checks q4h. Repeat sweat cortisol sensor check q12h.');
    } else if (type === 'diabetic') {
      setPrecautions('Frequent fingerstick glucose and wearable sweat glucose sensor synchronization. Foot inspection daily.');
      setMedications('Metformin 500mg PO BID with meals. Sliding-scale regular insulin for capillary blood glucose > 180.');
      setDietary('Consistent carbohydrate diabetic meal plan (45-60g carbs per meal). Avoid simple sugars.');
      setObservation('Fasting morning blood draw. Log sweat glucose vs blood glucose cross-variance.');
    } else if (type === 'renal') {
      setPrecautions('Strict intake/output volume charting. Monitor for peripheral edema. Avoid nephrotoxic agents/NSAIDs.');
      setMedications('SGLT2 inhibitor dapagliflozin 10mg PO daily. Adjust antihypertensives based on eGFR.');
      setDietary('Moderate protein (0.8g/kg/day), low potassium, low phosphorus renal protocol.');
      setObservation('Daily serum creatinine, BUN, and sweat electrolyte panel.');
    } else if (type === 'discharge') {
      setPrecautions('Stable for step-down care. Patient educated on wearable sweat patch maintenance and blood pressure diary.');
      setMedications('Continue home regimen. 7-day medication organizer verified.');
      setDietary('Heart-healthy Mediterranean diet with adequate hydration (2L/day water).');
      setObservation('Outpatient cardiology and endocrinology follow-up in 14 days.');
    }
  };

  const data = selectedPatient.healthData;
  const pred = selectedPatient.latestPrediction;
  const isHighRisk = selectedPatient.riskTier === 'High Risk';
  const isModerateRisk = selectedPatient.riskTier === 'Moderate Risk';

  return (
    <div className="space-y-6">
      {/* 1. TOP BEDSIDE CHART CLIPBOARD HEADER */}
      <div className="bg-[#FFFFFF] border-2 border-[#2B4570] rounded-lg p-5 shadow-xs chart-paper relative">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b-2 border-[#2B4570] pb-4">
          <div className="flex items-start gap-3">
            <div className="bg-[#2B4570] text-[#FAF6EE] p-3 rounded-lg flex flex-col items-center justify-center min-w-16">
              <span className="text-[10px] uppercase font-bold tracking-wider font-mono-chart">BED</span>
              <span className="text-xl font-bold font-mono-chart leading-none mt-0.5">
                {selectedPatient.bedNumber.replace('Bed ', '')}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono-chart bg-[#E2EAF0] text-[#2B4570] px-2 py-0.5 rounded font-bold">
                  {selectedPatient.mrn}
                </span>
                <span className="text-xs font-mono-chart text-[#556987]">
                  Admitted: {selectedPatient.admissionDate}
                </span>
                <span className="text-xs font-mono-chart text-[#556987]">
                  Wing: {selectedPatient.wardWing}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#2B4570] font-heading mt-1">
                {selectedPatient.name}
              </h1>
              <p className="text-xs font-mono-chart text-[#556987]">
                {selectedPatient.age} Years &bull; Biological {selectedPatient.sex.toUpperCase()} &bull; Primary Diagnosis:{' '}
                <strong className="text-[#1E293B]">{selectedPatient.primaryDiagnosis}</strong>
              </p>
            </div>
          </div>

          {/* Quick Header Actions & Patient Switcher */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 bg-[#FAF6EE] border border-[#C9D6DE] rounded p-1.5 text-xs font-mono-chart">
              <span className="text-[#556987] font-bold">Change Bed:</span>
              <select
                value={selectedPatient.id}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="bg-transparent font-bold text-[#2B4570] focus:outline-none cursor-pointer"
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.bedNumber}: {p.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => onNavigate('submit-readings')}
              className="px-3 py-1.5 rounded bg-[#FFFFFF] border border-[#C9D6DE] text-[#2B4570] text-xs font-bold hover:bg-[#EEF4F8] transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs font-heading"
            >
              <Droplets className="w-3.5 h-3.5 text-[#2B4570]" />
              <span>Update Readings</span>
            </button>

            <button
              onClick={() => onNavigate('report')}
              className="px-3.5 py-1.5 rounded bg-[#2B4570] text-[#FAF6EE] text-xs font-bold hover:bg-[#1D3254] transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs font-heading"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Official PDF</span>
            </button>
          </div>
        </div>

        {/* Clinical Alert Stamp */}
        <div className="pt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono-chart">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#556987]">COMPOSITE RISK STATUS:</span>
            <span
              className={`px-2.5 py-0.5 rounded font-bold border ${
                isHighRisk
                  ? 'bg-[#FDEDEC] text-[#B33A3A] border-[#B33A3A]'
                  : isModerateRisk
                  ? 'bg-[#FEF5E7] text-[#C98A2B] border-[#C98A2B]'
                  : 'bg-[#EAFAF1] text-[#6B8F71] border-[#6B8F71]'
              }`}
            >
              {selectedPatient.riskTier.toUpperCase()} &bull; {selectedPatient.riskScore}%
            </span>
            <span className="text-[#556987]">
              ({pred.overallRisk.abnormalBiomarkersCount} Abnormal Biomarkers Detected)
            </span>
          </div>

          <div className="text-[#556987]">
            Attending Physician: <strong className="text-[#2B4570]">{selectedPatient.attendingDoctor}</strong>
          </div>
        </div>
      </div>

      {/* 2. DUAL-STREAM BIOMARKERS CLINICAL LEDGER (BLOOD & SWEAT) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stream 1: Blood Biochemistry Panel */}
        <div className="bg-[#FFFFFF] border-2 border-[#2B4570] rounded-lg p-5 chart-paper shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b-2 border-[#2B4570] pb-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#2B4570]" />
                <h3 className="text-base font-bold text-[#2B4570] font-heading uppercase tracking-wide">
                  Stream A: Blood Chemistry &amp; Hemodynamics
                </h3>
              </div>
              <span className="text-[10px] font-mono-chart bg-[#E2EAF0] text-[#2B4570] px-2 py-0.5 rounded font-bold">
                Phlebotomy &amp; Vitals
              </span>
            </div>

            {/* Ruled Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono-chart border-collapse">
                <thead>
                  <tr className="border-b border-[#C9D6DE] text-[#556987] text-[10px] uppercase text-left">
                    <th className="py-1.5 px-2">Biomarker</th>
                    <th className="py-1.5 px-2">Ref Range</th>
                    <th className="py-1.5 px-2 text-right">Value</th>
                    <th className="py-1.5 px-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2EAF0]">
                  <tr>
                    <td className="py-2 px-2 font-bold text-[#1E293B]">Systolic Blood Pressure</td>
                    <td className="py-2 px-2 text-[#556987]">90 &ndash; 120 mmHg</td>
                    <td className={`py-2 px-2 text-right font-bold ${data.systolic_bp >= 140 ? 'ink-red' : 'ink-blue'}`}>
                      {data.systolic_bp} mmHg
                    </td>
                    <td className="py-2 px-2 text-center">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${data.systolic_bp >= 140 ? 'bg-[#FDEDEC] text-[#B33A3A]' : 'bg-[#EAFAF1] text-[#6B8F71]'}`}>
                        {data.systolic_bp >= 140 ? 'HIGH' : 'NORMAL'}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2 px-2 font-bold text-[#1E293B]">Diastolic Blood Pressure</td>
                    <td className="py-2 px-2 text-[#556987]">60 &ndash; 80 mmHg</td>
                    <td className={`py-2 px-2 text-right font-bold ${data.diastolic_bp >= 90 ? 'ink-red' : 'ink-blue'}`}>
                      {data.diastolic_bp} mmHg
                    </td>
                    <td className="py-2 px-2 text-center">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${data.diastolic_bp >= 90 ? 'bg-[#FDEDEC] text-[#B33A3A]' : 'bg-[#EAFAF1] text-[#6B8F71]'}`}>
                        {data.diastolic_bp >= 90 ? 'HIGH' : 'NORMAL'}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2 px-2 font-bold text-[#1E293B]">Fasting Blood Glucose</td>
                    <td className="py-2 px-2 text-[#556987]">70 &ndash; 99 mg/dL</td>
                    <td className={`py-2 px-2 text-right font-bold ${data.fasting_glucose >= 126 ? 'ink-red' : data.fasting_glucose >= 100 ? 'ink-amber' : 'ink-blue'}`}>
                      {data.fasting_glucose} mg/dL
                    </td>
                    <td className="py-2 px-2 text-center">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${data.fasting_glucose >= 126 ? 'bg-[#FDEDEC] text-[#B33A3A]' : data.fasting_glucose >= 100 ? 'bg-[#FEF5E7] text-[#C98A2B]' : 'bg-[#EAFAF1] text-[#6B8F71]'}`}>
                        {data.fasting_glucose >= 126 ? 'DIABETIC' : data.fasting_glucose >= 100 ? 'ELEVATED' : 'NORMAL'}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2 px-2 font-bold text-[#1E293B]">Hemoglobin A1c</td>
                    <td className="py-2 px-2 text-[#556987]">4.0 &ndash; 5.6 %</td>
                    <td className={`py-2 px-2 text-right font-bold ${(data.hba1c || 5.4) >= 6.5 ? 'ink-red' : (data.hba1c || 5.4) >= 5.7 ? 'ink-amber' : 'ink-blue'}`}>
                      {data.hba1c || 5.4} %
                    </td>
                    <td className="py-2 px-2 text-center">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${(data.hba1c || 5.4) >= 6.5 ? 'bg-[#FDEDEC] text-[#B33A3A]' : 'bg-[#EAFAF1] text-[#6B8F71]'}`}>
                        {(data.hba1c || 5.4) >= 6.5 ? 'HIGH' : 'NORMAL'}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2 px-2 font-bold text-[#1E293B]">Serum Creatinine</td>
                    <td className="py-2 px-2 text-[#556987]">0.6 &ndash; 1.2 mg/dL</td>
                    <td className={`py-2 px-2 text-right font-bold ${(data.serum_creatinine || 0.9) >= 1.3 ? 'ink-red' : 'ink-blue'}`}>
                      {data.serum_creatinine || 0.9} mg/dL
                    </td>
                    <td className="py-2 px-2 text-center">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${(data.serum_creatinine || 0.9) >= 1.3 ? 'bg-[#FDEDEC] text-[#B33A3A]' : 'bg-[#EAFAF1] text-[#6B8F71]'}`}>
                        {(data.serum_creatinine || 0.9) >= 1.3 ? 'HIGH' : 'NORMAL'}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2 px-2 font-bold text-[#1E293B]">Estimated GFR</td>
                    <td className="py-2 px-2 text-[#556987]">&gt; 90 mL/min</td>
                    <td className={`py-2 px-2 text-right font-bold ${(data.egfr || 90) < 60 ? 'ink-red' : (data.egfr || 90) < 80 ? 'ink-amber' : 'ink-blue'}`}>
                      {data.egfr || 90} mL/min
                    </td>
                    <td className="py-2 px-2 text-center">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${(data.egfr || 90) < 60 ? 'bg-[#FDEDEC] text-[#B33A3A]' : 'bg-[#EAFAF1] text-[#6B8F71]'}`}>
                        {(data.egfr || 90) < 60 ? 'REDUCED' : 'NORMAL'}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2 px-2 font-bold text-[#1E293B]">Total / LDL Cholesterol</td>
                    <td className="py-2 px-2 text-[#556987]">&lt; 200 / &lt; 100 mg/dL</td>
                    <td className="py-2 px-2 text-right font-bold ink-blue">
                      {data.total_cholesterol || 190} / {data.ldl_cholesterol || 110}
                    </td>
                    <td className="py-2 px-2 text-center">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#EAFAF1] text-[#6B8F71]">
                        REVIEWED
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#D1DCE5] text-[11px] font-mono-chart text-[#556987] flex items-center justify-between">
            <span>Specimen: Venous Blood Draw</span>
            <span className="font-bold text-[#2B4570]">Certified Lab Analysis</span>
          </div>
        </div>

        {/* Stream 2: Wearable Epidermal Sweat Telemetry */}
        <div className="bg-[#FFFFFF] border-2 border-[#C98A2B] rounded-lg p-5 chart-paper shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b-2 border-[#C98A2B] pb-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#C98A2B]" />
                <h3 className="text-base font-bold text-[#876527] font-heading uppercase tracking-wide">
                  Stream B: Wearable Sweat Patch Telemetry
                </h3>
              </div>
              <span className="text-[10px] font-mono-chart bg-[#FEF5E7] text-[#C98A2B] border border-[#FAD7A0] px-2 py-0.5 rounded font-bold">
                Live Sensor (99.8% Sync)
              </span>
            </div>

            {/* Ruled Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono-chart border-collapse">
                <thead>
                  <tr className="border-b border-[#E8DFC9] text-[#556987] text-[10px] uppercase text-left">
                    <th className="py-1.5 px-2">Biomarker</th>
                    <th className="py-1.5 px-2">Ref Range</th>
                    <th className="py-1.5 px-2 text-right">Value</th>
                    <th className="py-1.5 px-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2EADA]">
                  <tr>
                    <td className="py-2 px-2 font-bold text-[#1E293B]">Epidermal Sweat Lactate</td>
                    <td className="py-2 px-2 text-[#556987]">0.5 &ndash; 2.5 mmol/L</td>
                    <td className={`py-2 px-2 text-right font-bold ${(data.sweat_lactate || 1.8) >= 2.5 ? 'ink-red' : 'text-[#2B4570]'}`}>
                      {data.sweat_lactate || 1.8} mmol/L
                    </td>
                    <td className="py-2 px-2 text-center">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${(data.sweat_lactate || 1.8) >= 2.5 ? 'bg-[#FDEDEC] text-[#B33A3A]' : 'bg-[#EAFAF1] text-[#6B8F71]'}`}>
                        {(data.sweat_lactate || 1.8) >= 2.5 ? 'ELEVATED' : 'NORMAL'}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2 px-2 font-bold text-[#1E293B]">Epidermal Sweat Cortisol</td>
                    <td className="py-2 px-2 text-[#556987]">0.2 &ndash; 1.5 ug/dL</td>
                    <td className={`py-2 px-2 text-right font-bold ${(data.sweat_cortisol || 1.2) >= 1.5 ? 'ink-red' : 'text-[#2B4570]'}`}>
                      {data.sweat_cortisol || 1.2} ug/dL
                    </td>
                    <td className="py-2 px-2 text-center">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${(data.sweat_cortisol || 1.2) >= 1.5 ? 'bg-[#FDEDEC] text-[#B33A3A]' : 'bg-[#EAFAF1] text-[#6B8F71]'}`}>
                        {(data.sweat_cortisol || 1.2) >= 1.5 ? 'HIGH STRESS' : 'STABLE'}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2 px-2 font-bold text-[#1E293B]">Sweat Glucose Telemetry</td>
                    <td className="py-2 px-2 text-[#556987]">0.1 &ndash; 1.0 mg/dL</td>
                    <td className={`py-2 px-2 text-right font-bold ${(data.sweat_glucose || 0.6) >= 1.0 ? 'ink-red' : 'text-[#2B4570]'}`}>
                      {data.sweat_glucose || 0.6} mg/dL
                    </td>
                    <td className="py-2 px-2 text-center">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${(data.sweat_glucose || 0.6) >= 1.0 ? 'bg-[#FDEDEC] text-[#B33A3A]' : 'bg-[#EAFAF1] text-[#6B8F71]'}`}>
                        {(data.sweat_glucose || 0.6) >= 1.0 ? 'SPIKE' : 'NORMAL'}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2 px-2 font-bold text-[#1E293B]">Sweat Sodium (Na+)</td>
                    <td className="py-2 px-2 text-[#556987]">20 &ndash; 60 mM</td>
                    <td className={`py-2 px-2 text-right font-bold ${(data.sweat_sodium || 42) >= 60 ? 'ink-red' : 'text-[#2B4570]'}`}>
                      {data.sweat_sodium || 42} mM
                    </td>
                    <td className="py-2 px-2 text-center">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${(data.sweat_sodium || 42) >= 60 ? 'bg-[#FDEDEC] text-[#B33A3A]' : 'bg-[#EAFAF1] text-[#6B8F71]'}`}>
                        {(data.sweat_sodium || 42) >= 60 ? 'HYPO-VOL' : 'EUVOLEMIC'}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2 px-2 font-bold text-[#1E293B]">Sweat Potassium (K+)</td>
                    <td className="py-2 px-2 text-[#556987]">4.0 &ndash; 8.0 mM</td>
                    <td className="py-2 px-2 text-right font-bold text-[#2B4570]">
                      {data.sweat_potassium || 5.8} mM
                    </td>
                    <td className="py-2 px-2 text-center">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#EAFAF1] text-[#6B8F71]">
                        NORMAL
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2 px-2 font-bold text-[#1E293B]">Sweat pH</td>
                    <td className="py-2 px-2 text-[#556987]">4.5 &ndash; 6.5</td>
                    <td className="py-2 px-2 text-right font-bold text-[#2B4570]">
                      {data.sweat_ph || 5.6}
                    </td>
                    <td className="py-2 px-2 text-center">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#EAFAF1] text-[#6B8F71]">
                        BALANCED
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2 px-2 font-bold text-[#1E293B]">Sweat Secretion Rate</td>
                    <td className="py-2 px-2 text-[#556987]">0.2 &ndash; 1.5 uL/min/cm2</td>
                    <td className="py-2 px-2 text-right font-bold text-[#2B4570]">
                      {data.sweat_rate || 0.8} uL/min
                    </td>
                    <td className="py-2 px-2 text-center">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#EAFAF1] text-[#6B8F71]">
                        ACTIVE
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E8DFC9] text-[11px] font-mono-chart text-[#876527] flex items-center justify-between">
            <span>Hardware: Forearm Ion-Selective Patch</span>
            <span className="font-bold">Battery 94% &bull; Calibrated</span>
          </div>
        </div>
      </div>

      {/* 3. MULTI-CONDITION AI RISK MATRIX */}
      <div className="bg-[#FFFFFF] border-2 border-[#2B4570] rounded-lg p-5 chart-paper shadow-xs">
        <div className="flex items-center justify-between border-b-2 border-[#2B4570] pb-3 mb-4">
          <div>
            <h3 className="text-lg font-bold text-[#2B4570] font-heading">
              Multimodal Disease Risk Stratification Matrix
            </h3>
            <p className="text-xs font-mono-chart text-[#556987]">
              Fusing Blood Biochemistry + Wearable Epidermal Sweat Kinetics via Random Forest &amp; XGBoost
            </p>
          </div>
          <div className="text-right font-mono-chart text-xs">
            <span className="text-[#556987]">Model Accuracy: </span>
            <span className="font-bold text-[#6B8F71]">96.8% ROC-AUC</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {Object.entries(pred.conditions).map(([key, cond]) => {
            const isHigh = cond.riskLevel === 'High';
            const isMod = cond.riskLevel === 'Moderate';

            return (
              <div
                key={key}
                className={`p-3 rounded border flex flex-col justify-between ${
                  isHigh
                    ? 'bg-[#FDEDEC] border-[#B33A3A]'
                    : isMod
                    ? 'bg-[#FEF5E7] border-[#C98A2B]'
                    : 'bg-[#EAFAF1] border-[#6B8F71]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono-chart font-bold text-[#556987] uppercase">
                      {key.replace('_', ' ')}
                    </span>
                    <span
                      className={`text-[9px] font-mono-chart font-bold px-1.5 py-0.5 rounded ${
                        isHigh
                          ? 'bg-[#B33A3A] text-white'
                          : isMod
                          ? 'bg-[#C98A2B] text-white'
                          : 'bg-[#6B8F71] text-white'
                      }`}
                    >
                      {cond.riskLevel}
                    </span>
                  </div>
                  <h4 className="font-bold text-[#1E293B] text-xs font-heading mt-1 leading-tight">
                    {cond.name}
                  </h4>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span
                      className={`text-xl font-bold font-mono-chart ${
                        isHigh ? 'ink-red' : isMod ? 'ink-amber' : 'ink-blue'
                      }`}
                    >
                      {cond.probability}%
                    </span>
                    <span className="text-[10px] font-mono-chart text-[#556987]">Probability</span>
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-black/10 text-[10px] font-mono-chart text-[#556987]">
                  Lead Time: <strong className="text-[#1E293B]">{cond.leadTimeWarning || '14 - 30 Days'}</strong>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. DOCTOR'S NOTES & MEDICAL ORDERS (EDITABLE BY DOCTOR) */}
      <div className="bg-[#FFFFFF] border-2 border-[#2B4570] rounded-lg p-5 chart-paper shadow-md relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-[#2B4570] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-[#2B4570] text-[#FAF6EE] flex items-center justify-center font-bold">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#2B4570] font-heading">
                Doctor's Clinical Notes &amp; Physician Orders
              </h3>
              <p className="text-xs font-mono-chart text-[#556987]">
                Editable Inpatient Directives &bull; Synced to Patient's Chart Booklet in Real-Time
              </p>
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-mono-chart text-[#556987]">Quick Protocols:</span>
            <button
              onClick={() => applyPreset('cardiac')}
              className="px-2 py-1 bg-[#FAF6EE] hover:bg-[#EEF4F8] border border-[#C9D6DE] text-[#2B4570] rounded text-[11px] font-mono-chart font-bold cursor-pointer"
            >
              Cardiac
            </button>
            <button
              onClick={() => applyPreset('diabetic')}
              className="px-2 py-1 bg-[#FAF6EE] hover:bg-[#EEF4F8] border border-[#C9D6DE] text-[#2B4570] rounded text-[11px] font-mono-chart font-bold cursor-pointer"
            >
              Diabetic
            </button>
            <button
              onClick={() => applyPreset('renal')}
              className="px-2 py-1 bg-[#FAF6EE] hover:bg-[#EEF4F8] border border-[#C9D6DE] text-[#2B4570] rounded text-[11px] font-mono-chart font-bold cursor-pointer"
            >
              Renal
            </button>
            <button
              onClick={() => applyPreset('discharge')}
              className="px-2 py-1 bg-[#FAF6EE] hover:bg-[#EEF4F8] border border-[#C9D6DE] text-[#2B4570] rounded text-[11px] font-mono-chart font-bold cursor-pointer"
            >
              Discharge
            </button>
          </div>
        </div>

        {/* 4 Editable Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-mono-chart">
          {/* Section 1: Clinical Precautions */}
          <div className="space-y-1.5">
            <label className="font-bold text-[#2B4570] uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#B33A3A]" />
              <span>1. Clinical Precautions &amp; Critical Warnings:</span>
            </label>
            <textarea
              rows={3}
              value={precautions}
              onChange={(e) => setPrecautions(e.target.value)}
              className="w-full p-3 bg-[#FAF6EE] border border-[#C9D6DE] rounded text-[#1E293B] font-mono-chart focus:outline-none focus:border-[#2B4570] leading-relaxed"
              placeholder="Enter patient precautions, fall risks, allergy alerts, critical vitals thresholds..."
            />
          </div>

          {/* Section 2: Medication Orders */}
          <div className="space-y-1.5">
            <label className="font-bold text-[#2B4570] uppercase tracking-wider flex items-center gap-1.5">
              <ClipboardList className="w-3.5 h-3.5 text-[#2B4570]" />
              <span>2. Medication Orders &amp; Prescriptions:</span>
            </label>
            <textarea
              rows={3}
              value={medications}
              onChange={(e) => setMedications(e.target.value)}
              className="w-full p-3 bg-[#FAF6EE] border border-[#C9D6DE] rounded text-[#1E293B] font-mono-chart focus:outline-none focus:border-[#2B4570] leading-relaxed"
              placeholder="Enter medication dosages, frequencies, administration instructions..."
            />
          </div>

          {/* Section 3: Dietary & Hydration */}
          <div className="space-y-1.5">
            <label className="font-bold text-[#2B4570] uppercase tracking-wider flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-[#C98A2B]" />
              <span>3. Dietary Directives &amp; Hydration Strategy:</span>
            </label>
            <textarea
              rows={3}
              value={dietary}
              onChange={(e) => setDietary(e.target.value)}
              className="w-full p-3 bg-[#FAF6EE] border border-[#C9D6DE] rounded text-[#1E293B] font-mono-chart focus:outline-none focus:border-[#2B4570] leading-relaxed"
              placeholder="Enter sodium restrictions, carb counting, fluid goals, meal protocols..."
            />
          </div>

          {/* Section 4: Observation & Nursing Orders */}
          <div className="space-y-1.5">
            <label className="font-bold text-[#2B4570] uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#6B8F71]" />
              <span>4. Observation &amp; Nursing Orders:</span>
            </label>
            <textarea
              rows={3}
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              className="w-full p-3 bg-[#FAF6EE] border border-[#C9D6DE] rounded text-[#1E293B] font-mono-chart focus:outline-none focus:border-[#2B4570] leading-relaxed"
              placeholder="Enter telemetry checks, lab orders, sweat patch sensor recalibration frequency..."
            />
          </div>
        </div>

        {/* Doctor Signature & Save Footer */}
        <div className="mt-5 pt-4 border-t-2 border-[#2B4570] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono-chart text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#EAFAF1] border border-[#A9DFBF] text-[#6B8F71] flex items-center justify-center font-bold">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-[#2B4570]">
                Attending Signature: {doctorName}
              </p>
              <p className="text-[10px] text-[#556987]">
                Last Signed &amp; Timestamped: {selectedPatient.doctorNotes.timestamp}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {saveToast && (
              <span className="text-[#6B8F71] font-bold flex items-center gap-1 animate-bounce">
                <CheckCircle2 className="w-4 h-4" /> Orders Saved &amp; Signed!
              </span>
            )}
            <button
              onClick={handleSaveNotes}
              className="px-6 py-2.5 rounded bg-[#2B4570] hover:bg-[#1D3254] text-[#FAF6EE] font-bold text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer font-heading"
            >
              <Save className="w-4 h-4" />
              <span>Sign &amp; Stamp Physician Orders</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
