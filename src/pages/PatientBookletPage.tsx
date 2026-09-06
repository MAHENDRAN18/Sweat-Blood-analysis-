import React, { useState } from 'react';
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
  Pill,
  Send,
  Sparkles,
  ArrowRight,
  Info,
  Calendar,
  Phone,
  Award,
  Check,
  UserCheck,
  AlertCircle,
  CheckSquare,
  Square,
  ChevronDown
} from 'lucide-react';
import { MedicationTablet, PrecautionItem } from '../types';

interface PatientBookletPageProps {
  onNavigate: (pageId: string) => void;
}

export const PatientBookletPage: React.FC<PatientBookletPageProps> = ({ onNavigate }) => {
  const {
    selectedPatient,
    patients,
    setSelectedPatientId,
    submitPatientSymptomUpdate,
  } = useWardChart();

  // Local state for interactive symptom reporting
  const [patientComments, setPatientComments] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customSymptom, setCustomSymptom] = useState('');
  const [severityLevel, setSeverityLevel] = useState<'None' | 'Mild' | 'Moderate' | 'Severe'>('Mild');
  const [homeSystolic, setHomeSystolic] = useState<string>('');
  const [homeDiastolic, setHomeDiastolic] = useState<string>('');
  const [homeHeartRate, setHomeHeartRate] = useState<string>('');
  const [homeGlucose, setHomeGlucose] = useState<string>('');
  const [submitSuccessMessage, setSubmitSuccessMessage] = useState(false);

  // Local state for marking tablets taken today
  const [takenTablets, setTakenTablets] = useState<Record<string, boolean>>({});

  const toggleTabletTaken = (tabletId: string) => {
    setTakenTablets((prev) => ({
      ...prev,
      [tabletId]: !prev[tabletId],
    }));
  };

  const data = selectedPatient.healthData;
  const pred = selectedPatient.latestPrediction;
  const notes = selectedPatient.doctorNotes;
  const recovery = selectedPatient.recoveryStatus || {
    recoveryStage: selectedPatient.patientStatus === 'discharged' ? 'Discharged - Home Recovery' : 'Inpatient Intensive',
    percentRecovered: 50,
    isFullyRecovered: selectedPatient.patientStatus === 'fully_recovered',
  };

  const isHighRisk = selectedPatient.riskTier === 'High Risk';
  const isModerateRisk = selectedPatient.riskTier === 'Moderate Risk';
  const isDischarged = selectedPatient.patientStatus === 'discharged' || selectedPatient.patientStatus === 'recovering';
  const isFullyRecovered = selectedPatient.patientStatus === 'fully_recovered' || recovery.isFullyRecovered;

  const tablets: MedicationTablet[] = selectedPatient.tablets || [];
  const precautions: PrecautionItem[] = selectedPatient.precautionsList || [];
  const activeTablets = tablets.filter((t) => t.status === 'active' || t.status === 'modified');
  const completedTablets = tablets.filter((t) => t.status === 'completed' || t.status === 'discontinued');

  const availableSymptomTags = [
    'Mild dizziness on standing',
    'Morning headache',
    'Fatigue / low energy',
    'Swelling in ankles',
    'Mild nausea after meals',
    'Rapid pulse / palpitations',
    'Feeling well & improved',
    'Normal daily routine',
  ];

  const handleToggleSymptom = (tag: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(tag) ? prev.filter((s) => s !== tag) : [...prev, tag]
    );
  };

  const handleAddCustomSymptom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSymptom.trim() && !selectedSymptoms.includes(customSymptom.trim())) {
      setSelectedSymptoms((prev) => [...prev, customSymptom.trim()]);
      setCustomSymptom('');
    }
  };

  const handleSubmitSymptomReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientComments.trim() && selectedSymptoms.length === 0) {
      alert('Please describe your condition or select at least one symptom.');
      return;
    }

    const homeVitals: any = {};
    if (homeSystolic) homeVitals.systolic_bp = parseInt(homeSystolic, 10);
    if (homeDiastolic) homeVitals.diastolic_bp = parseInt(homeDiastolic, 10);
    if (homeHeartRate) homeVitals.heart_rate = parseInt(homeHeartRate, 10);
    if (homeGlucose) homeVitals.fasting_glucose = parseInt(homeGlucose, 10);

    submitPatientSymptomUpdate(selectedPatient.id, {
      patientComments: patientComments.trim() || 'Daily health check-in submitted.',
      reportedSymptoms: selectedSymptoms.length > 0 ? selectedSymptoms : ['Routine check-in'],
      severityLevel,
      homeVitals: Object.keys(homeVitals).length > 0 ? homeVitals : undefined,
    });

    setPatientComments('');
    setSelectedSymptoms([]);
    setHomeSystolic('');
    setHomeDiastolic('');
    setHomeHeartRate('');
    setHomeGlucose('');
    setSubmitSuccessMessage(true);
    setTimeout(() => setSubmitSuccessMessage(false), 5000);
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP HEADER & PATIENT STATUS BANNER */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 via-teal-500 to-red-500" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono-chart uppercase font-bold tracking-wider px-2.5 py-1 rounded bg-emerald-800 text-white flex items-center gap-1.5 shadow-2xs">
                <HeartPulse className="w-3.5 h-3.5 text-emerald-300" />
                ONLINE PATIENT HEALTH PORTAL
              </span>

              {/* Status Pill */}
              {isFullyRecovered ? (
                <span className="text-xs font-mono-chart px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-emerald-700" />
                  FULLY RECOVERED (100%)
                </span>
              ) : isDischarged ? (
                <span className="text-xs font-mono-chart px-2.5 py-1 rounded-full bg-teal-100 text-teal-800 border border-teal-300 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-700" />
                  DISCHARGED &bull; HOME RECOVERY
                </span>
              ) : (
                <span className="text-xs font-mono-chart px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300 font-bold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-700" />
                  HOSPITAL INPATIENT &bull; {selectedPatient.bedNumber}
                </span>
              )}

              <span className="text-xs font-mono-chart text-slate-500">
                MRN: {selectedPatient.mrn}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-emerald-950 font-heading mt-2">
              {selectedPatient.name}
            </h1>
            <p className="text-sm text-slate-600 font-sans mt-0.5">
              Primary Diagnosis: <strong className="text-slate-900">{selectedPatient.primaryDiagnosis}</strong> &bull; Attending Physician:{' '}
              <strong className="text-emerald-900">{selectedPatient.attendingDoctor}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Patient Switcher for Testing/Reviewing */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 px-3 py-1.5 rounded-lg text-xs font-mono-chart">
              <span className="text-slate-600 font-bold">Switch Patient:</span>
              <select
                value={selectedPatient.id}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="bg-white border border-slate-300 rounded px-2 py-1 text-slate-800 font-sans font-medium focus:outline-emerald-600 cursor-pointer"
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.patientStatus === 'fully_recovered' ? 'Fully Recovered' : p.patientStatus === 'discharged' ? 'Discharged' : p.bedNumber})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => onNavigate('patient-alarms')}
              className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer font-sans"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Medicine Alarms</span>
            </button>
            <button
              onClick={() => onNavigate('submit-readings')}
              className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer font-sans"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Submit Vitals / Patch</span>
            </button>
            <button
              onClick={() => onNavigate('report')}
              className="px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-emerald-900 border border-slate-300 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer font-sans"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Printable Report</span>
            </button>
          </div>
        </div>

        {/* RECOVERY PROGRESS BAR */}
        <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <div>
              <span className="text-xs font-mono-chart font-bold text-slate-500 uppercase tracking-wide">
                Health Recovery Status
              </span>
              <h3 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
                <span>{recovery.recoveryStage}</span>
                {isFullyRecovered && (
                  <span className="text-xs bg-emerald-700 text-white px-2 py-0.5 rounded font-mono-chart font-bold">
                    Official Clearance Granted
                  </span>
                )}
              </h3>
            </div>
            <div className="text-right sm:text-right">
              <span className="text-2xl font-bold font-mono-chart text-emerald-800">
                {recovery.percentRecovered}%
              </span>
              <span className="text-xs text-slate-500 block font-mono-chart">Recovery Target Progress</span>
            </div>
          </div>

          {/* Progress Bar Track */}
          <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                isFullyRecovered
                  ? 'bg-emerald-600'
                  : recovery.percentRecovered > 70
                  ? 'bg-teal-600'
                  : recovery.percentRecovered > 40
                  ? 'bg-amber-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(100, Math.max(5, recovery.percentRecovered))}%` }}
            />
          </div>

          <p className="text-xs text-slate-600 font-sans mt-2.5 leading-relaxed">
            <strong className="text-slate-800">Physician Clinical Assessment:</strong>{' '}
            {recovery.recoveryNotes || 'Patient is making steady clinical recovery under monitored medical care.'}
          </p>
        </div>
      </div>

      {/* 2. OFFICIAL DISCHARGE SUMMARY OR RECOVERY CLEARANCE CERTIFICATE */}
      {isFullyRecovered ? (
        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-700 text-white rounded-xl shadow-xs">
              <Award className="w-8 h-8 text-emerald-200" />
            </div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="text-xl font-bold text-emerald-950 font-heading">
                  Official Hospital Medical Recovery Clearance Certificate
                </h3>
                <span className="text-xs font-mono-chart font-bold bg-emerald-200 text-emerald-900 px-3 py-1 rounded-full border border-emerald-300">
                  Certified: {recovery.recoveryCertifiedDate || 'Current'}
                </span>
              </div>
              <p className="text-sm text-emerald-900 font-sans mt-1.5 leading-relaxed">
                Congratulations, <strong className="text-emerald-950">{selectedPatient.name}</strong>. Your attending physician{' '}
                <strong className="text-emerald-950">{recovery.certifyingDoctor || selectedPatient.attendingDoctor}</strong> has verified that your metabolic, cardiovascular, and biomarker parameters have fully stabilized to optimal physiological limits.
              </p>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono-chart">
                <div className="bg-white/80 border border-emerald-200 p-2.5 rounded-lg">
                  <span className="text-slate-500 block">Acute Medication Status:</span>
                  <span className="font-bold text-emerald-800 text-sm">Course Completed</span>
                </div>
                <div className="bg-white/80 border border-emerald-200 p-2.5 rounded-lg">
                  <span className="text-slate-500 block">Required Precautions:</span>
                  <span className="font-bold text-emerald-800 text-sm">Routine Lifestyle Wellness</span>
                </div>
                <div className="bg-white/80 border border-emerald-200 p-2.5 rounded-lg">
                  <span className="text-slate-500 block">Next Clinical Follow-up:</span>
                  <span className="font-bold text-emerald-800 text-sm">Annual Wellness Check</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : selectedPatient.dischargeSummary?.isDischarged ? (
        <div className="bg-white border-2 border-teal-200 rounded-xl p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-teal-700 text-white flex items-center justify-center font-bold shadow-xs">
                <CheckCircle2 className="w-5 h-5 text-teal-200" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-teal-950 font-heading">
                  Official Post-Discharge Medical Summary
                </h3>
                <p className="text-xs font-mono-chart text-slate-500">
                  Discharged on <strong className="text-slate-800">{selectedPatient.dischargeSummary.dischargeDate}</strong> by{' '}
                  <strong className="text-teal-900">{selectedPatient.dischargeSummary.dischargingPhysician}</strong>
                </p>
              </div>
            </div>
            <div className="bg-teal-50 border border-teal-300 text-teal-800 px-3 py-1 rounded-full text-xs font-mono-chart font-bold flex items-center gap-1.5 w-fit">
              <span>Condition: {selectedPatient.dischargeSummary.dischargeCondition}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5">
              <span className="text-slate-500 font-mono-chart font-bold block mb-1 uppercase text-[11px]">
                Discharge Diagnosis &amp; Hemodynamics
              </span>
              <p className="text-slate-800 font-sans leading-relaxed">
                <strong>Diagnosis:</strong> {selectedPatient.dischargeSummary.dischargeDiagnosis}
              </p>
              <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-mono-chart text-slate-600">
                <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
                  BP at Discharge: <strong>{selectedPatient.dischargeSummary.dischargeVitals.bp}</strong>
                </span>
                <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
                  Glucose: <strong>{selectedPatient.dischargeSummary.dischargeVitals.glucose} mg/dL</strong>
                </span>
                <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
                  Pulse: <strong>{selectedPatient.dischargeSummary.dischargeVitals.heartRate} bpm</strong>
                </span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5">
              <span className="text-slate-500 font-mono-chart font-bold block mb-1 uppercase text-[11px]">
                Home Recovery Instructions &amp; Follow-up
              </span>
              <p className="text-slate-800 font-sans leading-relaxed">
                {selectedPatient.dischargeSummary.dischargeInstructions}
              </p>
              <div className="mt-2 space-y-1 text-slate-700 font-mono-chart text-[11px]">
                <div className="flex items-center gap-1.5 text-teal-900 font-bold">
                  <Calendar className="w-3.5 h-3.5 text-teal-700" />
                  <span>{selectedPatient.dischargeSummary.followUpDate}</span>
                </div>
                {selectedPatient.dischargeSummary.emergencyContactDoctor && (
                  <div className="flex items-center gap-1.5 text-red-700 font-bold">
                    <Phone className="w-3.5 h-3.5 text-red-600" />
                    <span>Emergency Clinic Line: {selectedPatient.dischargeSummary.emergencyContactDoctor}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* 3. PRESCRIBED TABLETS & MEDICATION MANAGEMENT (SHOWN UNTIL FULLY RECOVERED) */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold shadow-xs">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-emerald-950 font-heading flex items-center gap-2">
                <span>Prescribed Medication &amp; Tablets</span>
                <span className="text-xs font-mono-chart bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                  {isFullyRecovered ? 'Course Finished' : 'Active Daily Regimen'}
                </span>
              </h3>
              <p className="text-xs font-mono-chart text-slate-500">
                {isFullyRecovered
                  ? 'All acute medications discontinued upon 100% full recovery clearance.'
                  : 'Active tablets and exact dosing instructions required until health is fully recovered.'}
              </p>
            </div>
          </div>

          {!isFullyRecovered && (
            <div className="text-xs font-mono-chart text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <CheckSquare className="w-4 h-4 text-emerald-700" />
              <span>Check off tablets as you take them today</span>
            </div>
          )}
        </div>

        {isFullyRecovered ? (
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-5 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-700 mx-auto" />
            <h4 className="text-base font-bold text-emerald-950 font-heading">
              Medication Course Successfully Completed
            </h4>
            <p className="text-sm text-slate-700 max-w-xl mx-auto font-sans leading-relaxed">
              Because your health has achieved 100% full recovery, your doctor has discontinued all acute hospital medications.
              You do not need to take regular cardiovascular or metabolic tablets at this time. Maintain your hydration and healthy diet!
            </p>
            {completedTablets.length > 0 && (
              <div className="mt-4 pt-3 border-t border-emerald-200 text-left">
                <span className="text-xs font-mono-chart font-bold text-slate-600 uppercase block mb-2">
                  Previously Prescribed &amp; Resolved Medications:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {completedTablets.map((tab) => (
                    <div key={tab.id} className="bg-white border border-emerald-200 p-2.5 rounded-lg text-xs font-mono-chart">
                      <div className="font-bold text-slate-900">{tab.name} ({tab.dose})</div>
                      <div className="text-slate-500 text-[11px]">Reason: {tab.reason}</div>
                      <div className="text-emerald-700 font-bold text-[11px] mt-0.5">
                        {tab.durationNote || 'Discontinued upon full clinical recovery.'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : activeTablets.length === 0 ? (
          <div className="text-center py-6 text-slate-500 font-sans text-sm">
            No active tablets currently assigned. Your attending doctor will configure medication during clinical rounds.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeTablets.map((tablet) => {
              const isTaken = !!takenTablets[tablet.id];
              return (
                <div
                  key={tablet.id}
                  className={`border rounded-xl p-4 transition-all ${
                    isTaken
                      ? 'bg-emerald-50/50 border-emerald-300'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-emerald-950 font-heading">
                          {tablet.name}
                        </span>
                        <span className="text-xs font-mono-chart bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded border border-slate-200">
                          {tablet.dose}
                        </span>
                      </div>
                      <span className="text-xs font-mono-chart text-emerald-800 font-bold block mt-0.5">
                        {tablet.frequency} &bull; {tablet.route}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleTabletTaken(tablet.id)}
                      className={`p-1.5 rounded-lg border text-xs font-mono-chart flex items-center gap-1.5 cursor-pointer transition-all ${
                        isTaken
                          ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                          : 'bg-slate-50 text-slate-600 border-slate-300 hover:bg-slate-100'
                      }`}
                      title={isTaken ? 'Mark as untaken' : 'Mark as taken today'}
                    >
                      {isTaken ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                      <span className="font-bold">{isTaken ? 'Taken Today' : 'Mark Taken'}</span>
                    </button>
                  </div>

                  <div className="space-y-1.5 text-xs font-sans mt-2.5">
                    <div className="text-slate-700 leading-relaxed">
                      <strong className="text-slate-900">How to take:</strong> {tablet.instructions}
                    </div>
                    <div className="text-slate-600 font-mono-chart text-[11px]">
                      <strong className="text-slate-800">Target Purpose:</strong> {tablet.reason}
                    </div>

                    {tablet.doctorChangeReason && (
                      <div className="bg-amber-50 border border-amber-200 rounded p-2 text-amber-900 font-sans text-xs mt-2">
                        <strong className="text-amber-950 font-bold block mb-0.5">Doctor Adjusted Dose:</strong>
                        {tablet.doctorChangeReason}
                      </div>
                    )}

                    <div className="text-emerald-700 font-mono-chart text-[11px] pt-1">
                      Duration: {tablet.durationNote || 'Continue daily until doctor assesses recovery progress.'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. PRECAUTIONS & DIET PROTOCOL (SHOWN UNTIL FULLY RECOVERED) */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-teal-700 text-white flex items-center justify-center font-bold shadow-xs">
            <ShieldCheck className="w-5 h-5 text-teal-200" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-teal-950 font-heading">
              Precautions &amp; Dietary Directives
            </h3>
            <p className="text-xs font-mono-chart text-slate-500">
              {isFullyRecovered
                ? 'Standard healthy living habits following full recovery.'
                : 'Mandatory clinical precautions to safeguard your recovery. Active until doctor marks full recovery.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
          {precautions.map((prec) => (
            <div
              key={prec.id}
              className={`p-4 rounded-xl border space-y-1.5 ${
                prec.severity === 'critical'
                  ? 'bg-red-50/60 border-red-200 text-red-950'
                  : prec.severity === 'important'
                  ? 'bg-amber-50/50 border-amber-200 text-slate-900'
                  : 'bg-teal-50/40 border-teal-200 text-slate-900'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold font-mono-chart uppercase text-[11px] flex items-center gap-1.5">
                  {prec.severity === 'critical' ? (
                    <AlertTriangle className="w-3.5 h-3.5 text-red-700" />
                  ) : (
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
                  )}
                  {prec.category}
                </span>
                <span
                  className={`text-[10px] font-mono-chart font-bold px-2 py-0.5 rounded uppercase ${
                    prec.severity === 'critical'
                      ? 'bg-red-200 text-red-900'
                      : prec.severity === 'important'
                      ? 'bg-amber-200 text-amber-900'
                      : 'bg-teal-200 text-teal-900'
                  }`}
                >
                  {prec.severity}
                </span>
              </div>
              <p className="text-slate-800 leading-relaxed text-xs pt-1">
                {prec.directive}
              </p>
              {prec.doctorNote && (
                <div className="text-[11px] font-mono-chart text-slate-600 pt-1 border-t border-slate-200/60">
                  Physician Note: {prec.doctorNote}
                </div>
              )}
            </div>
          ))}

          {/* Quick Doctor Orders fallback if precautions list is light */}
          {precautions.length === 0 && (
            <>
              <div className="bg-red-50/50 border border-red-200 rounded-xl p-4 space-y-1.5">
                <div className="font-bold text-red-700 font-mono-chart uppercase text-[11px] flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Clinical Precautions</span>
                </div>
                <p className="text-slate-800 text-xs leading-relaxed">{notes.clinicalPrecautions}</p>
              </div>
              <div className="bg-teal-50/40 border border-teal-200 rounded-xl p-4 space-y-1.5">
                <div className="font-bold text-teal-800 font-mono-chart uppercase text-[11px] flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5" />
                  <span>Diet &amp; Hydration Protocol</span>
                </div>
                <p className="text-slate-800 text-xs leading-relaxed">{notes.dietaryDirectives}</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 5. INTERACTIVE SYMPTOM REPORTING & DOCTOR ANALYSIS HISTORY */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-bold shadow-xs">
              <Activity className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-emerald-950 font-heading">
                Report Health Condition &amp; Symptoms to Doctor
              </h3>
              <p className="text-xs font-mono-chart text-slate-500">
                Send your latest symptoms, vitals, and comments. Your doctor will analyse them and update your tablets or precautions accordingly.
              </p>
            </div>
          </div>
        </div>

        {/* Submit Form */}
        <form onSubmit={handleSubmitSymptomReport} className="space-y-4 bg-slate-50 border border-slate-200 rounded-xl p-4">
          {submitSuccessMessage && (
            <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 px-4 py-2.5 rounded-lg text-xs font-mono-chart font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Your symptom report has been delivered to Dr. {selectedPatient.attendingDoctor}&apos;s review queue!</span>
            </div>
          )}

          {/* Quick Symptoms Tag Cloud */}
          <div>
            <label className="block text-xs font-mono-chart font-bold text-slate-700 mb-1.5 uppercase">
              Select Symptoms Experienced Today:
            </label>
            <div className="flex flex-wrap gap-2">
              {availableSymptomTags.map((tag) => {
                const isSelected = selectedSymptoms.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleToggleSymptom(tag)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-sans transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-emerald-700 text-white border-emerald-800 font-bold shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {tag} {isSelected && '✓'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Symptom Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={customSymptom}
              onChange={(e) => setCustomSymptom(e.target.value)}
              placeholder="Add other symptom (e.g. slight tremor, dry mouth)..."
              className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-sans focus:outline-emerald-600"
            />
            <button
              type="button"
              onClick={handleAddCustomSymptom}
              className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-bold font-sans cursor-pointer"
            >
              Add Tag
            </button>
          </div>

          {/* Severity & Home Vitals */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
            <div>
              <label className="block text-xs font-mono-chart font-bold text-slate-700 mb-1 uppercase">
                Symptom Severity:
              </label>
              <select
                value={severityLevel}
                onChange={(e) => setSeverityLevel(e.target.value as any)}
                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-2 text-xs font-sans focus:outline-emerald-600"
              >
                <option value="None">None (Feeling Well)</option>
                <option value="Mild">Mild (Noticeable)</option>
                <option value="Moderate">Moderate (Interferes slightly)</option>
                <option value="Severe">Severe (Needs urgent review)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono-chart font-bold text-slate-700 mb-1 uppercase">
                Home SBP (mmHg):
              </label>
              <input
                type="number"
                value={homeSystolic}
                onChange={(e) => setHomeSystolic(e.target.value)}
                placeholder="e.g. 126"
                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-2 text-xs font-mono-chart focus:outline-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-mono-chart font-bold text-slate-700 mb-1 uppercase">
                Home DBP (mmHg):
              </label>
              <input
                type="number"
                value={homeDiastolic}
                onChange={(e) => setHomeDiastolic(e.target.value)}
                placeholder="e.g. 82"
                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-2 text-xs font-mono-chart focus:outline-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-mono-chart font-bold text-slate-700 mb-1 uppercase">
                Heart Rate (bpm):
              </label>
              <input
                type="number"
                value={homeHeartRate}
                onChange={(e) => setHomeHeartRate(e.target.value)}
                placeholder="e.g. 74"
                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-2 text-xs font-mono-chart focus:outline-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-mono-chart font-bold text-slate-700 mb-1 uppercase">
                Blood Glucose (mg/dL):
              </label>
              <input
                type="number"
                value={homeGlucose}
                onChange={(e) => setHomeGlucose(e.target.value)}
                placeholder="e.g. 108"
                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-2 text-xs font-mono-chart focus:outline-emerald-600"
              />
            </div>
          </div>

          {/* Patient Comments / Commands to Doctor */}
          <div>
            <label className="block text-xs font-mono-chart font-bold text-slate-700 mb-1 uppercase">
              Message or Question for Dr. {selectedPatient.attendingDoctor}:
            </label>
            <textarea
              rows={3}
              value={patientComments}
              onChange={(e) => setPatientComments(e.target.value)}
              placeholder="e.g. Doctor, after taking my morning tablet, I experienced slight lightheadedness when standing up. My blood pressure reading was 126/80. Should we adjust my medication or precautions?"
              className="w-full bg-white border border-slate-300 rounded-lg p-3 text-xs font-sans focus:outline-emerald-600 leading-relaxed"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer font-sans"
            >
              <Send className="w-4 h-4" />
              <span>Send Health Update to Doctor</span>
            </button>
          </div>
        </form>

        {/* Previous Updates & Doctor Analysis Log */}
        <div className="mt-5 space-y-3">
          <span className="text-xs font-mono-chart font-bold text-slate-600 uppercase block">
            Previous Reports &amp; Doctor&apos;s Symptom Analysis History:
          </span>

          {(!selectedPatient.symptomUpdates || selectedPatient.symptomUpdates.length === 0) ? (
            <div className="text-slate-500 font-sans text-xs bg-slate-50 border border-slate-200 rounded-lg p-3">
              No symptom reports submitted yet. Use the form above to send any health updates or questions directly to your physician.
            </div>
          ) : (
            selectedPatient.symptomUpdates.map((update) => (
              <div
                key={update.id}
                className="border border-slate-200 rounded-xl p-4 bg-white space-y-2.5 shadow-2xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono-chart font-bold text-slate-800">
                      {update.timestamp}
                    </span>
                    <span
                      className={`text-[10px] font-mono-chart font-bold px-2 py-0.5 rounded ${
                        update.severityLevel === 'Severe'
                          ? 'bg-red-100 text-red-800'
                          : update.severityLevel === 'Moderate'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      Severity: {update.severityLevel}
                    </span>
                  </div>

                  <div>
                    {update.doctorReviewed ? (
                      <span className="text-[11px] font-mono-chart font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Reviewed by Dr. {selectedPatient.attendingDoctor}
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono-chart font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-600" />
                        Awaiting Doctor Clinical Analysis
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-800 font-sans leading-relaxed">
                  <strong className="text-slate-900">Your Message:</strong> {update.patientComments}
                </p>

                {update.reportedSymptoms && update.reportedSymptoms.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {update.reportedSymptoms.map((symp, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-mono-chart bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded"
                      >
                        {symp}
                      </span>
                    ))}
                  </div>
                )}

                {update.homeVitals && (
                  <div className="text-[11px] font-mono-chart text-slate-600 bg-slate-50 p-2 rounded border border-slate-200 flex flex-wrap gap-3">
                    {update.homeVitals.systolic_bp && (
                      <span>BP: <strong>{update.homeVitals.systolic_bp}/{update.homeVitals.diastolic_bp} mmHg</strong></span>
                    )}
                    {update.homeVitals.heart_rate && (
                      <span>Heart Rate: <strong>{update.homeVitals.heart_rate} bpm</strong></span>
                    )}
                    {update.homeVitals.fasting_glucose && (
                      <span>Glucose: <strong>{update.homeVitals.fasting_glucose} mg/dL</strong></span>
                    )}
                  </div>
                )}

                {/* DOCTOR'S CLINICAL ANALYSIS AND ACTION TAKEN */}
                {update.doctorReviewed && update.doctorAnalysis && (
                  <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-3 text-xs font-sans space-y-1 mt-2">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-950 font-heading">
                      <Stethoscope className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Doctor&apos;s Symptom Analysis ({update.doctorReviewedAt || 'Reviewed'}):</span>
                    </div>
                    <p className="text-emerald-900 leading-relaxed">
                      {update.doctorAnalysis}
                    </p>
                    {update.doctorActionTaken && (
                      <p className="text-emerald-800 font-mono-chart text-[11px] pt-1">
                        <strong>Clinical Action Taken:</strong> {update.doctorActionTaken}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* 6. HEALTH READINGS & WEARABLE SWEAT SENSOR TELEMETRY */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Blood Lab Readings */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 mb-3">
            <h3 className="text-base font-bold text-emerald-950 font-heading uppercase">
              Current Blood Test Parameters
            </h3>
            <span className="text-xs font-mono-chart bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold border border-emerald-200">
              Laboratory Certified
            </span>
          </div>

          <div className="space-y-2.5 text-xs font-mono-chart">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div>
                <span className="font-bold text-slate-800 block text-sm">Blood Pressure:</span>
                <span className="text-xs text-slate-500">Normal Range: Under 120/80 mmHg</span>
              </div>
              <span className={`font-bold text-base ${data.systolic_bp >= 140 ? 'text-red-700' : 'text-emerald-800'}`}>
                {data.systolic_bp}/{data.diastolic_bp} mmHg
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div>
                <span className="font-bold text-slate-800 block text-sm">Fasting Blood Glucose:</span>
                <span className="text-xs text-slate-500">Normal Range: 70 - 99 mg/dL</span>
              </div>
              <span className={`font-bold text-base ${data.fasting_glucose >= 126 ? 'text-red-700' : 'text-emerald-800'}`}>
                {data.fasting_glucose} mg/dL
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div>
                <span className="font-bold text-slate-800 block text-sm">Glycated Hemoglobin (HbA1c):</span>
                <span className="text-xs text-slate-500">Normal Range: Under 5.7%</span>
              </div>
              <span className={`font-bold text-base ${(data.hba1c || 5.4) >= 6.5 ? 'text-red-700' : 'text-emerald-800'}`}>
                {data.hba1c || 5.4}%
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div>
                <span className="font-bold text-slate-800 block text-sm">Glomerular Filtration Rate (eGFR):</span>
                <span className="text-xs text-slate-500">Normal Range: &gt; 90 mL/min</span>
              </div>
              <span className={`font-bold text-base ${(data.egfr || 90) < 60 ? 'text-red-700' : 'text-emerald-800'}`}>
                {data.egfr || 90} mL/min
              </span>
            </div>
          </div>
        </div>

        {/* Wearable Sweat Patch Readings */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 mb-3">
            <h3 className="text-base font-bold text-teal-950 font-heading uppercase">
              Wearable Sweat Patch Telemetry
            </h3>
            <span className="text-xs font-mono-chart bg-teal-100 text-teal-800 border border-teal-200 px-2 py-0.5 rounded font-bold">
              Wireless Bio-Sensor
            </span>
          </div>

          <div className="space-y-2.5 text-xs font-mono-chart">
            <div className="flex items-center justify-between p-3 rounded-lg bg-teal-50/40 border border-teal-200">
              <div>
                <span className="font-bold text-slate-800 block text-sm">Sweat Lactate (Tissue Oxygenation):</span>
                <span className="text-xs text-slate-500">Target Range: 0.5 - 2.5 mmol/L</span>
              </div>
              <span className={`font-bold text-base ${(data.sweat_lactate || 1.8) >= 2.5 ? 'text-red-700' : 'text-teal-900'}`}>
                {data.sweat_lactate || 1.8} mmol/L
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-teal-50/40 border border-teal-200">
              <div>
                <span className="font-bold text-slate-800 block text-sm">Sweat Cortisol (Hormonal Stress):</span>
                <span className="text-xs text-slate-500">Target Range: 0.2 - 1.5 ug/dL</span>
              </div>
              <span className={`font-bold text-base ${(data.sweat_cortisol || 1.2) >= 1.5 ? 'text-red-700' : 'text-teal-900'}`}>
                {data.sweat_cortisol || 1.2} ug/dL
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-teal-50/40 border border-teal-200">
              <div>
                <span className="font-bold text-slate-800 block text-sm">Sweat Glucose Transudate:</span>
                <span className="text-xs text-slate-500">Target Range: 0.1 - 1.0 mg/dL</span>
              </div>
              <span className={`font-bold text-base ${(data.sweat_glucose || 0.6) >= 1.0 ? 'text-red-700' : 'text-teal-900'}`}>
                {data.sweat_glucose || 0.6} mg/dL
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-teal-50/40 border border-teal-200">
              <div>
                <span className="font-bold text-slate-800 block text-sm">Sweat Sodium (Hydration Status):</span>
                <span className="text-xs text-slate-500">Target Range: 20 - 60 mM</span>
              </div>
              <span className="font-bold text-base text-teal-900">
                {data.sweat_sodium || 42} mM
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
