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
  X,
  HeartPulse,
  Pill,
  Award,
  AlertCircle
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
  const [filterStatus, setFilterStatus] = useState<'all' | 'inpatient' | 'discharged' | 'recovered' | 'symptoms'>('all');
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

    const hasUnreviewedSymptoms = (p.symptomUpdates || []).some((u) => !u.doctorReviewed);

    if (!matchesSearch) return false;

    if (filterStatus === 'inpatient') return p.patientStatus === 'inpatient' || !p.patientStatus;
    if (filterStatus === 'discharged') return p.patientStatus === 'discharged' || p.patientStatus === 'recovering';
    if (filterStatus === 'recovered') return p.patientStatus === 'fully_recovered';
    if (filterStatus === 'symptoms') return hasUnreviewedSymptoms;

    return true;
  });

  const totalPatients = patients.length;
  const inpatientCount = patients.filter((p) => p.patientStatus === 'inpatient' || !p.patientStatus).length;
  const dischargedCount = patients.filter((p) => p.patientStatus === 'discharged' || p.patientStatus === 'recovering').length;
  const recoveredCount = patients.filter((p) => p.patientStatus === 'fully_recovered').length;
  const pendingSymptomsCount = patients.filter((p) => (p.symptomUpdates || []).some((u) => !u.doctorReviewed)).length;

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
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm relative overflow-hidden">
        {/* Medical Green Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 via-teal-500 to-red-500" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono-chart uppercase font-bold tracking-wider px-2.5 py-0.5 rounded bg-emerald-800 text-white flex items-center gap-1 shadow-2xs">
                <HeartPulse className="w-3.5 h-3.5 text-emerald-300" />
                HOSPITAL INPATIENT &amp; RECOVERY ROSTER
              </span>
              <span className="text-xs font-mono-chart text-slate-500">
                Shift: Active &bull; Attending: <strong className="text-emerald-950">{doctorName}</strong>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-emerald-950 font-heading mt-1.5">
              Doctor&apos;s Clinical Ward &amp; Outpatient Board
            </h1>
            <p className="text-xs text-slate-600 font-sans mt-0.5">
              Manage inpatient admissions, review online patient symptom updates, adjust medications/precautions, and monitor recovery.
            </p>
          </div>

          {/* Quick Action Buttons & Counts */}
          <div className="flex items-center gap-2 font-mono-chart text-xs flex-wrap">
            <div className="bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <Bed className="w-4 h-4 text-emerald-700" />
              <span className="font-bold text-emerald-800">{inpatientCount} Inpatients</span>
            </div>
            <div className="bg-teal-50 border border-teal-300 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-700" />
              <span className="font-bold text-teal-800">{dischargedCount} Discharged</span>
            </div>
            <div className="bg-emerald-100 border border-emerald-300 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-800" />
              <span className="font-bold text-emerald-900">{recoveredCount} Recovered</span>
            </div>
            {pendingSymptomsCount > 0 && (
              <div className="bg-amber-100 border border-amber-300 px-3 py-1.5 rounded-lg flex items-center gap-1.5 animate-pulse">
                <AlertCircle className="w-4 h-4 text-amber-800" />
                <span className="font-bold text-amber-900">{pendingSymptomsCount} Symptom Alert{pendingSymptomsCount > 1 ? 's' : ''}</span>
              </div>
            )}
            <button
              onClick={() => setShowAdmitModal(true)}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3.5 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs font-sans"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Admit Patient</span>
            </button>
          </div>
        </div>

        {/* 2. SEARCH & FILTER TOOLBAR */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Bed #, Name, MRN, or Diagnosis..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-sans text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-xs font-mono-chart text-slate-600">Filter View:</span>
            <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg p-0.5 text-xs font-sans">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer font-bold ${
                  filterStatus === 'all'
                    ? 'bg-emerald-700 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-emerald-900'
                }`}
              >
                All ({totalPatients})
              </button>
              <button
                onClick={() => setFilterStatus('inpatient')}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer font-bold ${
                  filterStatus === 'inpatient'
                    ? 'bg-emerald-700 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-emerald-900'
                }`}
              >
                Inpatients ({inpatientCount})
              </button>
              <button
                onClick={() => setFilterStatus('discharged')}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer font-bold ${
                  filterStatus === 'discharged'
                    ? 'bg-emerald-700 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-emerald-900'
                }`}
              >
                Discharged ({dischargedCount})
              </button>
              <button
                onClick={() => setFilterStatus('recovered')}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer font-bold ${
                  filterStatus === 'recovered'
                    ? 'bg-emerald-700 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-emerald-900'
                }`}
              >
                Recovered ({recoveredCount})
              </button>
              <button
                onClick={() => setFilterStatus('symptoms')}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer font-bold ${
                  filterStatus === 'symptoms'
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'text-amber-800 hover:text-amber-950'
                }`}
              >
                Symptom Alerts ({pendingSymptomsCount})
              </button>
            </div>
            <button
              onClick={resetToSampleData}
              title="Reset to original 10 Hospital Patients"
              className="p-2 rounded-lg border border-slate-300 bg-white text-slate-600 hover:text-emerald-800 hover:bg-emerald-50 cursor-pointer shadow-2xs transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. WARD BOARD GRID OF INPATIENT & OUTPATIENT CHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredPatients.map((patient) => {
          const isHigh = patient.riskTier === 'High Risk';
          const isModerate = patient.riskTier === 'Moderate Risk';
          const isSelected = selectedPatientId === patient.id;
          const isDischarged = patient.patientStatus === 'discharged' || patient.patientStatus === 'recovering';
          const isRecovered = patient.patientStatus === 'fully_recovered';

          const systolic = patient.healthData.systolic_bp;
          const diastolic = patient.healthData.diastolic_bp;
          const isBpHigh = systolic >= 140 || diastolic >= 90;

          const glucose = patient.healthData.fasting_glucose;
          const isGlucHigh = glucose >= 126;

          const sweatLactate = patient.healthData.sweat_lactate || 1.8;
          const isLactateElevated = sweatLactate >= 2.5;

          const sweatCortisol = patient.healthData.sweat_cortisol || 1.2;

          const unreviewedSymptoms = (patient.symptomUpdates || []).filter((u) => !u.doctorReviewed);
          const activeTabletsCount = (patient.tablets || []).filter(
            (t) => t.status === 'active' || t.status === 'modified'
          ).length;

          const recoveryPercent = patient.recoveryStatus?.percentRecovered || (isRecovered ? 100 : 50);

          return (
            <div
              key={patient.id}
              className={`bg-white rounded-xl border-2 transition-all hover:shadow-md cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                isRecovered
                  ? 'border-emerald-300 hover:border-emerald-500'
                  : isHigh
                  ? 'border-red-400 hover:border-red-600'
                  : isModerate
                  ? 'border-amber-300 hover:border-amber-500'
                  : 'border-teal-300 hover:border-teal-500'
              } ${isSelected ? 'ring-2 ring-emerald-600' : ''}`}
              onClick={() => handleOpenPatientChart(patient.id)}
            >
              {/* Card Header (Bed Tag, MRN, Status Stamp) */}
              <div
                className={`p-3.5 border-b flex items-center justify-between ${
                  isRecovered
                    ? 'bg-emerald-50/90 border-emerald-200'
                    : isHigh
                    ? 'bg-red-50/80 border-red-200'
                    : isModerate
                    ? 'bg-amber-50/80 border-amber-200'
                    : 'bg-teal-50/80 border-teal-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`px-2.5 py-1 rounded-md font-mono-chart font-bold text-xs text-white ${
                      isRecovered
                        ? 'bg-emerald-700'
                        : isHigh
                        ? 'bg-red-600'
                        : isModerate
                        ? 'bg-amber-600'
                        : 'bg-teal-700'
                    }`}
                  >
                    {isDischarged ? 'OUTPATIENT' : patient.bedNumber}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base font-heading leading-tight">
                      {patient.name}
                    </h3>
                    <p className="text-xs font-mono-chart text-slate-500">
                      {patient.age}y &bull; {patient.sex.toUpperCase()} &bull; {patient.mrn}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  {isRecovered ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono-chart bg-emerald-600 text-white flex items-center gap-1">
                      <Award className="w-3 h-3" /> RECOVERED 100%
                    </span>
                  ) : isDischarged ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono-chart bg-teal-700 text-white">
                      DISCHARGED
                    </span>
                  ) : (
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono-chart ${
                        isHigh ? 'bg-red-600 text-white' : isModerate ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {patient.riskTier.toUpperCase()}
                    </span>
                  )}
                  <span className="text-[10px] font-mono-chart text-slate-500 font-bold">
                    Recovery: {recoveryPercent}%
                  </span>
                </div>
              </div>

              {/* Card Body (Diagnosis & Dual-Stream Vitals Table) */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-mono-chart text-slate-500">
                    <span className="font-bold uppercase text-slate-600">Diagnosis:</span>{' '}
                    <span className="text-slate-900 font-semibold">{patient.primaryDiagnosis}</span>
                  </div>

                  {/* Symptom Report Alert Pill if unreviewed */}
                  {unreviewedSymptoms.length > 0 && (
                    <div className="mt-2 bg-amber-50 border border-amber-300 rounded-lg p-2 flex items-center gap-2 text-xs font-sans text-amber-950 animate-pulse">
                      <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                      <div>
                        <strong>{unreviewedSymptoms.length} Symptom Report Awaiting Review:</strong>
                        <p className="text-[11px] text-amber-900 truncate">
                          &ldquo;{unreviewedSymptoms[0].patientComments}&rdquo;
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Dual Stream Biomarkers Grid */}
                  <div className="grid grid-cols-2 gap-2.5 mt-3 text-xs font-mono-chart">
                    {/* Blood Stream Readings */}
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <span className="text-xs font-bold text-emerald-900 block uppercase border-b border-slate-200 pb-1 mb-1.5 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-600" /> Blood Stream
                      </span>
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 text-[11px]">BP:</span>
                          <strong className={isBpHigh ? 'text-red-700 font-bold' : 'text-emerald-800'}>
                            {systolic}/{diastolic}
                          </strong>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 text-[11px]">F. Gluc:</span>
                          <strong className={isGlucHigh ? 'text-red-700 font-bold' : 'text-emerald-800'}>
                            {glucose} mg/dL
                          </strong>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 text-[11px]">HbA1c:</span>
                          <strong className={patient.healthData.hba1c && patient.healthData.hba1c >= 6.5 ? 'text-red-700 font-bold' : 'text-emerald-800'}>
                            {patient.healthData.hba1c || 5.4}%
                          </strong>
                        </div>
                      </div>
                    </div>

                    {/* Sweat Sensor Stream Readings */}
                    <div className="bg-teal-50/50 p-2.5 rounded-lg border border-teal-200">
                      <span className="text-xs font-bold text-teal-900 block uppercase border-b border-teal-200 pb-1 mb-1.5 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-teal-600" /> Sweat Telemetry
                      </span>
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 text-[11px]">Lactate:</span>
                          <strong className={isLactateElevated ? 'text-red-700 font-bold' : 'text-teal-900'}>
                            {sweatLactate} mmol/L
                          </strong>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 text-[11px]">Cortisol:</span>
                          <strong className="text-teal-900">
                            {sweatCortisol} ug/dL
                          </strong>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 text-[11px]">Sodium:</span>
                          <strong className="text-teal-900">
                            {patient.healthData.sweat_sodium || 42} mM
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Medication & Precautions Status Snippet */}
                <div className="pt-2.5 border-t border-slate-200 text-xs font-mono-chart space-y-1">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1">
                      <Pill className="w-3.5 h-3.5 text-teal-700" />
                      <strong>{activeTabletsCount} Active Tablets</strong>
                    </span>
                    <span className="text-emerald-800 font-bold">
                      {isRecovered ? 'Treatment Completed' : 'Active Care Plan'}
                    </span>
                  </div>
                  <p className="text-slate-700 truncate italic font-sans text-xs">
                    &ldquo;{patient.doctorNotes.clinicalPrecautions.slice(0, 65)}...&rdquo;
                  </p>
                </div>
              </div>

              {/* Card Footer (Action Trigger) */}
              <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs font-mono-chart">
                <span className="text-slate-500">
                  Admitted: {patient.admissionDate}
                </span>
                <span className="font-bold text-emerald-800 flex items-center gap-1 group-hover:underline">
                  Open Patient Chart &amp; Adjust Care <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. ADMIT NEW PATIENT MODAL */}
      {showAdmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-xl font-bold text-emerald-950 font-heading">
                  Admit New Inpatient Bed
                </h3>
                <p className="text-xs font-mono-chart text-slate-500">
                  Ward 4B &bull; Internal Medicine &amp; Metabolic Observation
                </p>
              </div>
              <button
                onClick={() => setShowAdmitModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePatient} className="space-y-4 pt-4 text-xs font-mono-chart">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-900 block mb-1">Patient Full Name:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Samuel Jenkins"
                    value={newPatientName}
                    onChange={(e) => setNewPatientName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-900 block mb-1">Primary Diagnosis:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acute Metabolic Derangement"
                    value={newPatientDiagnosis}
                    onChange={(e) => setNewPatientDiagnosis(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-900 block mb-1">Age:</label>
                  <input
                    type="number"
                    value={newPatientAge}
                    onChange={(e) => setNewPatientAge(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-900 block mb-1">Biological Sex:</label>
                  <select
                    value={newPatientSex}
                    onChange={(e) => setNewPatientSex(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-900 block mb-1">Systolic BP (mmHg):</label>
                  <input
                    type="number"
                    value={newPatientSystolic}
                    onChange={(e) => setNewPatientSystolic(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-900 block mb-1">Diastolic BP (mmHg):</label>
                  <input
                    type="number"
                    value={newPatientDiastolic}
                    onChange={(e) => setNewPatientDiastolic(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-900 block mb-1">Fasting Glucose (mg/dL):</label>
                  <input
                    type="number"
                    value={newPatientGlucose}
                    onChange={(e) => setNewPatientGlucose(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-900 block mb-1">Sweat Lactate (mmol/L):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newPatientSweatLactate}
                    onChange={(e) => setNewPatientSweatLactate(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAdmitModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 cursor-pointer font-bold font-sans"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer font-bold shadow-xs font-sans"
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
