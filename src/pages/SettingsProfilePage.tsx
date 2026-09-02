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
  FileText
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
      <div className="bg-[#FFFFFF] border-2 border-[#2B4570] rounded-lg p-5 shadow-xs chart-paper flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono-chart uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#2B4570] text-[#FAF6EE]">
              SYSTEM CONFIGURATION
            </span>
            <span className="text-xs font-mono-chart text-[#556987]">
              Role &bull; Ward &bull; Thresholds
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2B4570] font-heading mt-1">
            Ward &amp; Role Settings
          </h1>
          <p className="text-xs text-[#556987] font-mono-chart mt-0.5">
            Configure clinical operator details, active bedside patient assignment, and biomarker alert boundaries
          </p>
        </div>

        {saveSuccess && (
          <div className="p-2.5 bg-[#EAFAF1] border border-[#A9DFBF] text-[#1E824C] rounded text-xs font-mono-chart flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings Successfully Saved!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6 font-mono-chart">
        {/* 2. ROLE SWITCHER CARD */}
        <div className="bg-[#FFFFFF] border-2 border-[#2B4570] rounded-lg p-5 chart-paper shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b-2 border-[#2B4570] pb-2">
            <User className="w-4 h-4 text-[#2B4570]" />
            <h3 className="text-base font-bold text-[#2B4570] font-heading uppercase">
              1. Active Viewing Role
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => setCurrentUserRole('doctor')}
              className={`p-4 rounded border-2 cursor-pointer transition-all ${
                currentUserRole === 'doctor'
                  ? 'bg-[#FAF6EE] border-[#2B4570] shadow-xs'
                  : 'bg-[#FFFFFF] border-[#C9D6DE] hover:border-[#2B4570]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-[#2B4570] text-sm font-heading flex items-center gap-1.5">
                  <Stethoscope className="w-4 h-4" /> Doctor View
                </span>
                {currentUserRole === 'doctor' && (
                  <span className="text-[10px] bg-[#2B4570] text-[#FAF6EE] px-2 py-0.5 rounded font-bold">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-[#556987] font-sans">
                Full access to the Ward Board (all 10 beds), patient admission, and editable Doctor Notes &amp; Prescriptions.
              </p>
            </div>

            <div
              onClick={() => setCurrentUserRole('patient')}
              className={`p-4 rounded border-2 cursor-pointer transition-all ${
                currentUserRole === 'patient'
                  ? 'bg-[#FAF8F2] border-[#C98A2B] shadow-xs'
                  : 'bg-[#FFFFFF] border-[#C9D6DE] hover:border-[#C98A2B]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-[#876527] text-sm font-heading flex items-center gap-1.5">
                  <FileText className="w-4 h-4" /> Patient View
                </span>
                {currentUserRole === 'patient' && (
                  <span className="text-[10px] bg-[#C98A2B] text-[#FAF6EE] px-2 py-0.5 rounded font-bold">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-[#556987] font-sans">
                Simplified Bedside Chart Booklet with plain-language lab results and read-only physician instructions.
              </p>
            </div>
          </div>
        </div>

        {/* 3. CLINICIAN & WARD DETAILS */}
        <div className="bg-[#FFFFFF] border-2 border-[#2B4570] rounded-lg p-5 chart-paper shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b-2 border-[#2B4570] pb-2">
            <Building2 className="w-4 h-4 text-[#2B4570]" />
            <h3 className="text-base font-bold text-[#2B4570] font-heading uppercase">
              2. Hospital &amp; Physician Profile
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-[#1E293B] block mb-1">Attending Physician Name:</label>
              <input
                type="text"
                value={inputDoctorName}
                onChange={(e) => setInputDoctorName(e.target.value)}
                className="w-full p-2 bg-[#FAF6EE] border border-[#C9D6DE] rounded text-[#1E293B] font-bold focus:border-[#2B4570]"
              />
            </div>

            <div>
              <label className="font-bold text-[#1E293B] block mb-1">Active Selected Patient Bed:</label>
              <select
                value={selectedPatient.id}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full p-2 bg-[#FAF6EE] border border-[#C9D6DE] rounded text-[#2B4570] font-bold focus:border-[#2B4570] cursor-pointer"
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.bedNumber}: {p.name} ({p.mrn}) - {p.riskTier}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-[#1E293B] block mb-1">Hospital / Medical Center:</label>
              <input
                type="text"
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                className="w-full p-2 bg-[#FAF6EE] border border-[#C9D6DE] rounded text-[#1E293B] focus:border-[#2B4570]"
              />
            </div>
          </div>
        </div>

        {/* 4. CLINICAL ALERT THRESHOLDS */}
        <div className="bg-[#FFFFFF] border-2 border-[#2B4570] rounded-lg p-5 chart-paper shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b-2 border-[#2B4570] pb-2">
            <Sliders className="w-4 h-4 text-[#2B4570]" />
            <h3 className="text-base font-bold text-[#2B4570] font-heading uppercase">
              3. Bedside Alert Thresholds
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-bold text-[#1E293B] block mb-1">Systolic BP Alert (mmHg):</label>
              <input
                type="number"
                value={systolicAlert}
                onChange={(e) => setSystolicAlert(Number(e.target.value))}
                className="w-full p-2 bg-[#FAF6EE] border border-[#C9D6DE] rounded text-[#1E293B] font-bold focus:border-[#2B4570]"
              />
            </div>

            <div>
              <label className="font-bold text-[#1E293B] block mb-1">Fasting Glucose Alert (mg/dL):</label>
              <input
                type="number"
                value={glucoseAlert}
                onChange={(e) => setGlucoseAlert(Number(e.target.value))}
                className="w-full p-2 bg-[#FAF6EE] border border-[#C9D6DE] rounded text-[#1E293B] font-bold focus:border-[#2B4570]"
              />
            </div>

            <div>
              <label className="font-bold text-[#1E293B] block mb-1">Sweat Lactate Alert (mmol/L):</label>
              <input
                type="number"
                step="0.1"
                value={lactateAlert}
                onChange={(e) => setLactateAlert(Number(e.target.value))}
                className="w-full p-2 bg-[#FAF6EE] border border-[#C9D6DE] rounded text-[#1E293B] font-bold focus:border-[#2B4570]"
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded bg-[#2B4570] hover:bg-[#1D3254] text-[#FAF6EE] text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer font-heading"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
