import React, { useState } from 'react';
import { useWardChart } from '../context/WardChartContext';
import {
  Sliders,
  User,
  Stethoscope,
  Building2,
  Save,
  CheckCircle2,
  ShieldCheck,
  Bed,
  Layers,
  FileText,
  HeartPulse
} from 'lucide-react';

interface SettingsProfilePageProps {
  onNavigate: (pageId: string) => void;
}

export const SettingsProfilePage: React.FC<SettingsProfilePageProps> = ({ onNavigate }) => {
  const {
    currentUserRole,
    setCurrentUserRole,
    doctorName,
    setDoctorName,
    selectedPatient,
    patients,
    setSelectedPatientId,
  } = useWardChart();

  const [inputDoctorName, setInputDoctorName] = useState(doctorName);
  const [wardUnit, setWardUnit] = useState('Ward 4B: Internal Medicine & Metabolic Observation');
  const [hospitalName, setHospitalName] = useState('St. Jude Clinical Research & Teaching Hospital');
  const [systolicAlert, setSystolicAlert] = useState(140);
  const [glucoseAlert, setGlucoseAlert] = useState(126);
  const [lactateAlert, setLactateAlert] = useState(2.5);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setDoctorName(inputDoctorName);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* 1. TOP HEADER */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 via-teal-500 to-red-500" />
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono-chart uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-800 text-white flex items-center gap-1 shadow-2xs">
              <HeartPulse className="w-3 h-3 text-emerald-300" />
              SYSTEM CONFIGURATION
            </span>
            <span className="text-xs font-mono-chart text-slate-500">
              Role &bull; Ward &bull; Thresholds
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-emerald-950 font-heading mt-1.5">
            Ward &amp; Role Settings
          </h1>
          <p className="text-xs text-slate-500 font-mono-chart mt-0.5">
            Configure clinical operator details, active bedside patient assignment, and biomarker alert boundaries
          </p>
        </div>

        {saveSuccess && (
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-mono-chart flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings Successfully Saved!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6 font-mono-chart">
        {/* 2. ROLE SWITCHER CARD */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2.5">
            <User className="w-4 h-4 text-emerald-700" />
            <h3 className="text-base font-bold text-emerald-950 font-heading uppercase">
              1. Active Viewing Role
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => setCurrentUserRole('doctor')}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                currentUserRole === 'doctor'
                  ? 'bg-emerald-50/60 border-emerald-700 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-emerald-500'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-emerald-950 text-sm font-heading flex items-center gap-1.5">
                  <Stethoscope className="w-4 h-4 text-emerald-700" /> Doctor View
                </span>
                {currentUserRole === 'doctor' && (
                  <span className="text-[10px] bg-emerald-700 text-white px-2 py-0.5 rounded-full font-bold">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 font-sans leading-relaxed">
                Full access to the Ward Board (all 10 beds), patient admission, and editable Doctor Notes &amp; Prescriptions.
              </p>
            </div>

            <div
              onClick={() => setCurrentUserRole('patient')}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                currentUserRole === 'patient'
                  ? 'bg-teal-50/60 border-teal-700 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-teal-500'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-teal-950 text-sm font-heading flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-teal-700" /> Patient View
                </span>
                {currentUserRole === 'patient' && (
                  <span className="text-[10px] bg-teal-700 text-white px-2 py-0.5 rounded-full font-bold">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 font-sans leading-relaxed">
                Simplified Bedside Chart Booklet with plain-language lab results and read-only physician instructions.
              </p>
            </div>
          </div>
        </div>

        {/* 3. CLINICIAN & WARD DETAILS */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2.5">
            <Building2 className="w-4 h-4 text-emerald-700" />
            <h3 className="text-base font-bold text-emerald-950 font-heading uppercase">
              2. Hospital &amp; Physician Profile
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-800 block mb-1">Attending Physician Name:</label>
              <input
                type="text"
                value={inputDoctorName}
                onChange={(e) => setInputDoctorName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-bold focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">Active Selected Patient Bed:</label>
              <select
                value={selectedPatient.id}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-emerald-950 font-bold focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 cursor-pointer"
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.bedNumber}: {p.name} ({p.mrn}) - {p.riskTier}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-slate-800 block mb-1">Hospital / Medical Center:</label>
              <input
                type="text"
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
            </div>
          </div>
        </div>

        {/* 4. CLINICAL ALERT THRESHOLDS */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2.5">
            <Sliders className="w-4 h-4 text-emerald-700" />
            <h3 className="text-base font-bold text-emerald-950 font-heading uppercase">
              3. Bedside Alert Thresholds
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-800 block mb-1">Systolic BP Alert (mmHg):</label>
              <input
                type="number"
                value={systolicAlert}
                onChange={(e) => setSystolicAlert(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-bold focus:border-red-600 focus:ring-1 focus:ring-red-600"
              />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">Fasting Glucose Alert (mg/dL):</label>
              <input
                type="number"
                value={glucoseAlert}
                onChange={(e) => setGlucoseAlert(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-bold focus:border-red-600 focus:ring-1 focus:ring-red-600"
              />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">Sweat Lactate Alert (mmol/L):</label>
              <input
                type="number"
                step="0.1"
                value={lactateAlert}
                onChange={(e) => setLactateAlert(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-bold focus:border-red-600 focus:ring-1 focus:ring-red-600"
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer font-heading"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
