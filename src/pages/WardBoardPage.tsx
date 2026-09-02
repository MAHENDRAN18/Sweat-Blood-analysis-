import React, { useState } from 'react';
import { useWardChart } from '../context/WardChartContext';
import {
  Bed,
  Search,
  Filter,
  PlusCircle,
  AlertTriangle,
  CheckCircle2,
  Flame,
  ArrowRight,
  Droplets,
  Activity,
  FileText,
  Stethoscope,
  Clock,
  UserPlus,
  RefreshCw,
  X
} from 'lucide-react';
import { PatientChartProfile } from '../types';

interface WardBoardPageProps {
  onNavigate: (pageId: string) => void;
}

export const WardBoardPage: React.FC<WardBoardPageProps> = ({ onNavigate }) => {
  const {
    patients,
    selectedPatientId,
    setSelectedPatientId,
    doctorName,
    admitNewPatient,
    resetToSampleData,
  } = useWardChart();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterTier, setFilterTier] = useState<string>('all');
  const [showAdmitModal, setShowAdmitModal] = useState(false);

  // New patient form state
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientAge, setNewPatientAge] = useState(52);
  const [newPatientSex, setNewPatientSex] = useState<'male' | 'female' | 'other'>('male');
  const [newPatientDiagnosis, setNewPatientDiagnosis] = useState('Cardiometabolic Evaluation');
  const [newPatientSystolic, setNewPatientSystolic] = useState(135);
  const [newPatientDiastolic, setNewPatientDiastolic] = useState(85);
  const [newPatientGlucose, setNewPatientGlucose] = useState(115);
  const [newPatientSweatLactate, setNewPatientSweatLactate] = useState(2.1);
  const [newPatientSweatCortisol, setNewPatientSweatCortisol] = useState(1.4);

  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.bedNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.mrn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.primaryDiagnosis.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTier =
      filterTier === 'all' ||
      (filterTier === 'high' && p.riskTier === 'High Risk') ||
      (filterTier === 'moderate' && p.riskTier === 'Moderate Risk') ||
      (filterTier === 'low' && p.riskTier === 'Low Risk');

    return matchesSearch && matchesTier;
  });

  const highRiskCount = patients.filter((p) => p.riskTier === 'High Risk').length;
  const moderateRiskCount = patients.filter((p) => p.riskTier === 'Moderate Risk').length;
  const lowRiskCount = patients.filter((p) => p.riskTier === 'Low Risk').length;

  const handleOpenPatientChart = (patientId: string) => {
    setSelectedPatientId(patientId);
    onNavigate('patient-chart');
  };

  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName.trim()) return;

    const newId = admitNewPatient({
      name: newPatientName,
      age: newPatientAge,
      sex: newPatientSex,
      primaryDiagnosis: newPatientDiagnosis,
      healthData: {
        name: newPatientName,
        age: newPatientAge,
        sex: newPatientSex,
        systolic_bp: newPatientSystolic,
        diastolic_bp: newPatientDiastolic,
        fasting_glucose: newPatientGlucose,
        sweat_lactate: newPatientSweatLactate,
        sweat_cortisol: newPatientSweatCortisol,
      },
    });

    setShowAdmitModal(false);
    setSelectedPatientId(newId);
    onNavigate('patient-chart');
  };

  return (
    <div className="space-y-6">
      {/* 1. CLINICAL WARD BOARD BANNER */}
      <div className="bg-[#FFFFFF] border-2 border-[#2B4570] rounded-lg p-5 shadow-xs chart-paper relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D1DCE5] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono-chart uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#2B4570] text-[#FAF6EE]">
                HOSPITAL INPATIENT ROSTER
              </span>
              <span className="text-xs font-mono-chart text-[#556987]">
                Shift: Day (08:00 - 20:00)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#2B4570] font-heading mt-1">
              Ward Board &mdash; Bedside Patient Grid
            </h1>
            <p className="text-xs text-[#556987] font-mono-chart mt-0.5">
              Attending: <strong className="text-[#2B4570]">{doctorName}</strong> &bull; Total Occupancy: <strong>{patients.length} / 12 Beds</strong>
            </p>
          </div>

          {/* Quick Roster Tally Stats */}
          <div className="flex items-center gap-2 font-mono-chart text-xs flex-wrap">
            <div className="bg-[#FDEDEC] border border-[#F5B7B1] px-3 py-1.5 rounded flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#B33A3A] animate-ping" />
              <span className="font-bold text-[#B33A3A]">{highRiskCount} RED ALERT</span>
            </div>
            <div className="bg-[#FEF5E7] border border-[#FAD7A0] px-3 py-1.5 rounded flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#C98A2B]" />
              <span className="font-bold text-[#C98A2B]">{moderateRiskCount} AMBER</span>
            </div>
            <div className="bg-[#EAFAF1] border border-[#A9DFBF] px-3 py-1.5 rounded flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#6B8F71]" />
              <span className="font-bold text-[#6B8F71]">{lowRiskCount} SAGE</span>
            </div>
            <button
              onClick={() => setShowAdmitModal(true)}
              className="bg-[#2B4570] hover:bg-[#1D3254] text-[#FAF6EE] font-bold px-3 py-1.5 rounded text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Admit Patient</span>
            </button>
          </div>
        </div>

        {/* 2. SEARCH & FILTER TOOLBAR */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#556987] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Bed #, Name, MRN, or Diagnosis..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#FAF6EE] border border-[#C9D6DE] rounded text-xs font-mono-chart text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:border-[#2B4570]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Filter className="w-3.5 h-3.5 text-[#556987]" />
            <span className="text-xs font-mono-chart text-[#556987]">Filter Risk:</span>
            <div className="flex items-center bg-[#FAF6EE] border border-[#C9D6DE] rounded p-0.5 text-xs font-mono-chart">
              {(['all', 'high', 'moderate', 'low'] as const).map((tier) => (
                <button
                  key={tier}
                  onClick={() => setFilterTier(tier)}
                  className={`px-2.5 py-0.5 rounded capitalize transition-all cursor-pointer font-bold ${
                    filterTier === tier
                      ? 'bg-[#2B4570] text-[#FAF6EE]'
                      : 'text-[#556987] hover:text-[#2B4570]'
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>
            <button
              onClick={resetToSampleData}
              title="Reset to original 10 Hospital Patients"
              className="p-1.5 rounded border border-[#C9D6DE] bg-[#FAF6EE] text-[#556987] hover:text-[#2B4570] hover:bg-[#E2EAF0] cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. WARD BOARD GRID OF INPATIENT BEDSIDE CHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredPatients.map((patient) => {
          const isHigh = patient.riskTier === 'High Risk';
          const isModerate = patient.riskTier === 'Moderate Risk';
          const isSelected = selectedPatientId === patient.id;

          const systolic = patient.healthData.systolic_bp;
          const diastolic = patient.healthData.diastolic_bp;
          const isBpHigh = systolic >= 140 || diastolic >= 90;

          const glucose = patient.healthData.fasting_glucose;
          const isGlucHigh = glucose >= 126;

          const sweatLactate = patient.healthData.sweat_lactate || 1.8;
          const isLactateElevated = sweatLactate >= 2.5;

          const sweatCortisol = patient.healthData.sweat_cortisol || 1.2;

          return (
            <div
              key={patient.id}
              className={`bg-[#FFFFFF] rounded-lg border-2 transition-all hover:shadow-md cursor-pointer flex flex-col justify-between relative chart-paper ${
                isHigh
                  ? 'border-[#B33A3A] hover:border-[#8E2828]'
                  : isModerate
                  ? 'border-[#C98A2B] hover:border-[#A56E1E]'
                  : 'border-[#6B8F71] hover:border-[#527056]'
              } ${isSelected ? 'ring-2 ring-[#2B4570]' : ''}`}
              onClick={() => handleOpenPatientChart(patient.id)}
            >
              {/* Card Header (Bed Tag, MRN, Risk Stamp) */}
              <div
                className={`p-3.5 border-b flex items-center justify-between ${
                  isHigh
                    ? 'bg-[#FDEDEC] border-[#F5B7B1]'
                    : isModerate
                    ? 'bg-[#FEF5E7] border-[#FAD7A0]'
                    : 'bg-[#EAFAF1] border-[#A9DFBF]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="bg-[#2B4570] text-[#FAF6EE] px-2 py-0.5 rounded font-mono-chart font-bold text-xs">
                    {patient.bedNumber}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1E293B] text-base font-heading leading-none">
                      {patient.name}
                    </h3>
                    <p className="text-[10px] font-mono-chart text-[#556987] mt-0.5">
                      {patient.age}y &bull; {patient.sex.toUpperCase()} &bull; {patient.mrn}
                    </p>
                  </div>
                </div>

                <div
                  className={`px-2.5 py-1 rounded text-[11px] font-bold font-mono-chart border ${
                    isHigh
                      ? 'bg-[#FFFFFF] text-[#B33A3A] border-[#B33A3A]'
                      : isModerate
                      ? 'bg-[#FFFFFF] text-[#C98A2B] border-[#C98A2B]'
                      : 'bg-[#FFFFFF] text-[#6B8F71] border-[#6B8F71]'
                  }`}
                >
                  {isHigh && 'RED ALERT'}
                  {isModerate && 'MODERATE'}
                  {!isHigh && !isModerate && 'STABLE'} &bull; {patient.riskScore}%
                </div>
              </div>

              {/* Card Body (Diagnosis & Dual-Stream Vitals Table) */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-mono-chart text-[#556987]">
                    <span className="font-bold uppercase">Diagnosis:</span>{' '}
                    <span className="text-[#1E293B] font-semibold">{patient.primaryDiagnosis}</span>
                  </div>

                  {/* Dual Stream Biomarkers Grid */}
                  <div className="grid grid-cols-2 gap-2 mt-3 text-xs font-mono-chart">
                    {/* Blood Stream Readings */}
                    <div className="bg-[#FAF6EE] p-2 rounded border border-[#D1DCE5]">
                      <span className="text-[10px] font-bold text-[#2B4570] block uppercase border-b border-[#D1DCE5] pb-0.5 mb-1 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2B4570]" /> Blood Chemistry
                      </span>
                      <div className="space-y-0.5">
                        <div className="flex justify-between">
                          <span className="text-[#556987]">BP:</span>
                          <strong className={isBpHigh ? 'ink-red' : 'ink-blue'}>
                            {systolic}/{diastolic}
                          </strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#556987]">F. Gluc:</span>
                          <strong className={isGlucHigh ? 'ink-red' : 'ink-blue'}>
                            {glucose} mg/dL
                          </strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#556987]">HbA1c:</span>
                          <strong className={patient.healthData.hba1c && patient.healthData.hba1c >= 6.5 ? 'ink-red' : 'ink-blue'}>
                            {patient.healthData.hba1c || 5.4}%
                          </strong>
                        </div>
                      </div>
                    </div>

                    {/* Sweat Sensor Stream Readings */}
                    <div className="bg-[#FAF8F2] p-2 rounded border border-[#E8DFC9]">
                      <span className="text-[10px] font-bold text-[#876527] block uppercase border-b border-[#E8DFC9] pb-0.5 mb-1 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C98A2B]" /> Sweat Telemetry
                      </span>
                      <div className="space-y-0.5">
                        <div className="flex justify-between">
                          <span className="text-[#556987]">Lactate:</span>
                          <strong className={isLactateElevated ? 'ink-red' : 'text-[#2B4570]'}>
                            {sweatLactate} mmol/L
                          </strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#556987]">Cortisol:</span>
                          <strong className="text-[#2B4570]">
                            {sweatCortisol} ug/dL
                          </strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#556987]">Sodium:</span>
                          <strong className="text-[#2B4570]">
                            {patient.healthData.sweat_sodium || 42} mM
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Doctor Orders Status Snippet */}
                <div className="pt-2 border-t border-[#E2EAF0] text-[11px] font-mono-chart">
                  <div className="text-[#556987] flex items-center justify-between">
                    <span>Doctor Note:</span>
                    <span className="text-[#2B4570] font-bold">
                      {patient.doctorNotes.physicianSigned ? 'Signed & Active' : 'Pending Review'}
                    </span>
                  </div>
                  <p className="text-[#1E293B] truncate italic mt-0.5 font-sans text-xs">
                    &ldquo;{patient.doctorNotes.clinicalPrecautions.slice(0, 60)}...&rdquo;
                  </p>
                </div>
              </div>

              {/* Card Footer (Action Trigger) */}
              <div className="p-3 bg-[#FAF6EE] border-t border-[#D1DCE5] rounded-b flex items-center justify-between text-xs font-mono-chart">
                <span className="text-[#556987] text-[10px]">
                  Admitted: {patient.admissionDate}
                </span>
                <span className="font-bold text-[#2B4570] flex items-center gap-1 group-hover:underline">
                  Open Full Chart <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. ADMIT NEW PATIENT MODAL */}
      {showAdmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E293B]/70 backdrop-blur-xs">
          <div className="bg-[#FFFFFF] border-2 border-[#2B4570] rounded-lg max-w-xl w-full p-6 shadow-2xl chart-paper relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#D1DCE5]">
              <div>
                <h3 className="text-xl font-bold text-[#2B4570] font-heading">
                  Admit New Inpatient Bed
                </h3>
                <p className="text-xs font-mono-chart text-[#556987]">
                  Internal Medicine &amp; Metabolic Observation Unit
                </p>
              </div>
              <button
                onClick={() => setShowAdmitModal(false)}
                className="p-1.5 rounded text-[#556987] hover:bg-[#E2EAF0] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePatient} className="space-y-4 pt-4 text-xs font-mono-chart">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#1E293B] block mb-1">Patient Full Name:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Samuel Jenkins"
                    value={newPatientName}
                    onChange={(e) => setNewPatientName(e.target.value)}
                    className="w-full p-2 bg-[#FAF6EE] border border-[#C9D6DE] rounded text-[#1E293B] focus:border-[#2B4570]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#1E293B] block mb-1">Primary Diagnosis:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acute Metabolic Derangement"
                    value={newPatientDiagnosis}
                    onChange={(e) => setNewPatientDiagnosis(e.target.value)}
                    className="w-full p-2 bg-[#FAF6EE] border border-[#C9D6DE] rounded text-[#1E293B] focus:border-[#2B4570]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-[#1E293B] block mb-1">Age:</label>
                  <input
                    type="number"
                    value={newPatientAge}
                    onChange={(e) => setNewPatientAge(Number(e.target.value))}
                    className="w-full p-2 bg-[#FAF6EE] border border-[#C9D6DE] rounded text-[#1E293B]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#1E293B] block mb-1">Biological Sex:</label>
                  <select
                    value={newPatientSex}
                    onChange={(e) => setNewPatientSex(e.target.value as any)}
                    className="w-full p-2 bg-[#FAF6EE] border border-[#C9D6DE] rounded text-[#1E293B]"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-[#1E293B] block mb-1">Systolic BP (mmHg):</label>
                  <input
                    type="number"
                    value={newPatientSystolic}
                    onChange={(e) => setNewPatientSystolic(Number(e.target.value))}
                    className="w-full p-2 bg-[#FAF6EE] border border-[#C9D6DE] rounded text-[#1E293B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-[#1E293B] block mb-1">Diastolic BP (mmHg):</label>
                  <input
                    type="number"
                    value={newPatientDiastolic}
                    onChange={(e) => setNewPatientDiastolic(Number(e.target.value))}
                    className="w-full p-2 bg-[#FAF6EE] border border-[#C9D6DE] rounded text-[#1E293B]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#1E293B] block mb-1">Fasting Glucose (mg/dL):</label>
                  <input
                    type="number"
                    value={newPatientGlucose}
                    onChange={(e) => setNewPatientGlucose(Number(e.target.value))}
                    className="w-full p-2 bg-[#FAF6EE] border border-[#C9D6DE] rounded text-[#1E293B]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#1E293B] block mb-1">Sweat Lactate (mmol/L):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newPatientSweatLactate}
                    onChange={(e) => setNewPatientSweatLactate(Number(e.target.value))}
                    className="w-full p-2 bg-[#FAF6EE] border border-[#C9D6DE] rounded text-[#1E293B]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#D1DCE5] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAdmitModal(false)}
                  className="px-4 py-2 rounded border border-[#C9D6DE] text-[#556987] hover:bg-[#E2EAF0] cursor-pointer font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-[#2B4570] hover:bg-[#1D3254] text-[#FAF6EE] cursor-pointer font-bold shadow-xs"
                >
                  Admit &amp; Open Bedside Chart
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
