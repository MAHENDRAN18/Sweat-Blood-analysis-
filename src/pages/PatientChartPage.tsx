import React, { useState, useEffect } from 'react';
import { useWardChart } from '../context/WardChartContext';
import {
  ClipboardList,
  Stethoscope,
  FileCheck2,
  Save,
  Printer,
  History,
  AlertTriangle,
  AlertCircle,
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
  ArrowRight,
  HeartPulse,
  Pill,
  Plus,
  Trash2,
  Edit3,
  Award,
  Clock,
  Send,
  UserCheck,
  Phone,
  Check,
  X
} from 'lucide-react';
import {
  DoctorNotesData,
  ConditionPrediction,
  MedicationTablet,
  PrecautionItem,
  PatientSymptomUpdate,
  DischargeSummary,
} from '../types';

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
    doctorReviewSymptomAndAdjustCare,
    updatePatientTablets,
    updatePatientPrecautions,
    dischargePatient,
    markPatientFullyRecovered,
  } = useWardChart();

  // Local state for editable doctor notes
  const [precautionsText, setPrecautionsText] = useState(selectedPatient.doctorNotes.clinicalPrecautions);
  const [medicationsText, setMedicationsText] = useState(selectedPatient.doctorNotes.medicationOrders);
  const [dietaryText, setDietaryText] = useState(selectedPatient.doctorNotes.dietaryDirectives);
  const [observationText, setObservationText] = useState(selectedPatient.doctorNotes.observationOrders);
  const [saveToast, setSaveToast] = useState(false);

  // Sync state when selected patient changes
  useEffect(() => {
    setPrecautionsText(selectedPatient.doctorNotes.clinicalPrecautions);
    setMedicationsText(selectedPatient.doctorNotes.medicationOrders);
    setDietaryText(selectedPatient.doctorNotes.dietaryDirectives);
    setObservationText(selectedPatient.doctorNotes.observationOrders);
  }, [selectedPatient.id, selectedPatient.doctorNotes]);

  // Symptom Review & Adjustment Modal/Drawer State
  const [reviewingUpdate, setReviewingUpdate] = useState<PatientSymptomUpdate | null>(null);
  const [doctorAnalysis, setDoctorAnalysis] = useState('');
  const [doctorActionTaken, setDoctorActionTaken] = useState('');
  const [reviewTablets, setReviewTablets] = useState<MedicationTablet[]>([]);
  const [reviewPrecautions, setReviewPrecautions] = useState<PrecautionItem[]>([]);
  const [reviewRecoveryPercent, setReviewRecoveryPercent] = useState<number>(50);
  const [markFullyRecoveredInReview, setMarkFullyRecoveredInReview] = useState(false);

  // Tablet Management Modal State (Direct Add/Edit)
  const [showAddTabletModal, setShowAddTabletModal] = useState(false);
  const [editingTablet, setEditingTablet] = useState<MedicationTablet | null>(null);
  const [newTabName, setNewTabName] = useState('');
  const [newTabDose, setNewTabDose] = useState('');
  const [newTabFreq, setNewTabFreq] = useState('');
  const [newTabRoute, setNewTabRoute] = useState('Oral tablet');
  const [newTabInstructions, setNewTabInstructions] = useState('');
  const [newTabReason, setNewTabReason] = useState('');

  // Precaution Management Modal State (Direct Add)
  const [showAddPrecautionModal, setShowAddPrecautionModal] = useState(false);
  const [newPrecCategory, setNewPrecCategory] = useState<'Diet & Nutrition' | 'Blood Pressure & Vitals' | 'Physical Activity & Posture' | 'Medication Timing' | 'Emergency Alert'>('Diet & Nutrition');
  const [newPrecDirective, setNewPrecDirective] = useState('');
  const [newPrecSeverity, setNewPrecSeverity] = useState<'routine' | 'important' | 'critical'>('important');
  const [newPrecDoctorNote, setNewPrecDoctorNote] = useState('');

  // Discharge Modal State
  const [showDischargeModal, setShowDischargeModal] = useState(false);
  const [dischargeDiagnosisInput, setDischargeDiagnosisInput] = useState(selectedPatient.primaryDiagnosis);
  const [dischargeConditionInput, setDischargeConditionInput] = useState<'Clinically Stable' | 'Improving' | 'Fully Resolved'>('Clinically Stable');
  const [dischargeInstructionsInput, setDischargeInstructionsInput] = useState(
    'Patient safely cleared for outpatient recovery. Adhere to daily tablets, monitor morning blood pressure, and report any dizziness or fatigue online.'
  );
  const [followUpDateInput, setFollowUpDateInput] = useState('In 14 Days at Outpatient Cardiology Clinic, Room 302');

  const data = selectedPatient.healthData;
  const pred = selectedPatient.latestPrediction;
  const isHighRisk = selectedPatient.riskTier === 'High Risk';
  const isModerateRisk = selectedPatient.riskTier === 'Moderate Risk';
  const isDischarged = selectedPatient.patientStatus === 'discharged' || selectedPatient.patientStatus === 'recovering';
  const isFullyRecovered = selectedPatient.patientStatus === 'fully_recovered';
  const recovery = selectedPatient.recoveryStatus || {
    recoveryStage: isDischarged ? 'Discharged - Home Recovery' : 'Inpatient Intensive',
    percentRecovered: 50,
    isFullyRecovered,
  };

  const tablets: MedicationTablet[] = selectedPatient.tablets || [];
  const precautions: PrecautionItem[] = selectedPatient.precautionsList || [];
  const symptomUpdates: PatientSymptomUpdate[] = selectedPatient.symptomUpdates || [];
  const unreviewedCount = symptomUpdates.filter((u) => !u.doctorReviewed).length;

  const handleSaveNotes = () => {
    updateDoctorNotes(selectedPatient.id, {
      clinicalPrecautions: precautionsText,
      medicationOrders: medicationsText,
      dietaryDirectives: dietaryText,
      observationOrders: observationText,
    });

    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 4000);
  };

  const applyPreset = (type: 'cardiac' | 'diabetic' | 'renal' | 'discharge') => {
    if (type === 'cardiac') {
      setPrecautionsText('Continuous telemetry cardiac monitoring. Alert nursing if SBP > 140 or HR > 100.');
      setMedicationsText('Lisinopril 10mg PO daily, Atorvastatin 20mg PO at bedtime. Hold if SBP < 100.');
      setDietaryText('Strict 2,000mg sodium cardiac diet. Fluid restriction to 1.8L/day.');
      setObservationText('Serial blood pressure checks q4h. Repeat sweat cortisol sensor check q12h.');
    } else if (type === 'diabetic') {
      setPrecautionsText('Frequent fingerstick glucose and wearable sweat glucose sensor synchronization. Foot inspection daily.');
      setMedicationsText('Metformin 500mg PO BID with meals. Sliding-scale regular insulin for capillary blood glucose > 180.');
      setDietaryText('Consistent carbohydrate diabetic meal plan (45-60g carbs per meal). Avoid simple sugars.');
      setObservationText('Fasting morning blood draw. Log sweat glucose vs blood glucose cross-variance.');
    } else if (type === 'renal') {
      setPrecautionsText('Strict intake/output volume charting. Monitor for peripheral edema. Avoid nephrotoxic agents/NSAIDs.');
      setMedicationsText('SGLT2 inhibitor dapagliflozin 10mg PO daily. Adjust antihypertensives based on eGFR.');
      setDietaryText('Moderate protein (0.8g/kg/day), low potassium, low phosphorus renal protocol.');
      setObservationText('Daily serum creatinine, BUN, and sweat electrolyte panel.');
    } else if (type === 'discharge') {
      setPrecautionsText('Stable for step-down care. Patient educated on wearable sweat patch maintenance and blood pressure diary.');
      setMedicationsText('Continue home regimen. 7-day medication organizer verified.');
      setDietaryText('Heart-healthy Mediterranean diet with adequate hydration (2L/day water).');
      setObservationText('Outpatient cardiology and endocrinology follow-up in 14 days.');
    }
  };

  // Open Symptom Review
  const handleOpenReview = (update: PatientSymptomUpdate) => {
    setReviewingUpdate(update);
    setReviewTablets(JSON.parse(JSON.stringify(tablets)));
    setReviewPrecautions(JSON.parse(JSON.stringify(precautions)));
    setReviewRecoveryPercent(recovery.percentRecovered);
    setMarkFullyRecoveredInReview(isFullyRecovered);

    // Provide helpful clinical decision support draft based on symptoms
    const symptomsJoined = update.reportedSymptoms.join(', ');
    let defaultAnalysis = update.doctorAnalysis || '';
    let defaultAction = update.doctorActionTaken || '';

    if (!defaultAnalysis) {
      if (symptomsJoined.toLowerCase().includes('dizziness') || symptomsJoined.toLowerCase().includes('lightheaded')) {
        defaultAnalysis = `Evaluated reported symptoms: ${symptomsJoined}. Correlating with home BP (${update.homeVitals?.systolic_bp || data.systolic_bp}/${update.homeVitals?.diastolic_bp || data.diastolic_bp} mmHg). Probable mild orthostatic hypotension secondary to vasodilator medication. Metabolic panel is stable.`;
        defaultAction = 'Titrated oral antihypertensive dose downward to reduce postural lightheadedness; reinforced postural standing precautions.';
      } else if (symptomsJoined.toLowerCase().includes('fatigue') || symptomsJoined.toLowerCase().includes('tired')) {
        defaultAnalysis = `Evaluated reported symptoms: ${symptomsJoined}. Correlating with sweat lactate (${data.sweat_lactate} mmol/L) and glucose (${data.fasting_glucose} mg/dL). Mild cellular energy depletion under observation.`;
        defaultAction = 'Added supportive electrolyte complex and adjusted hydration goal to 2.2L daily.';
      } else if (symptomsJoined.toLowerCase().includes('well') || symptomsJoined.toLowerCase().includes('improved')) {
        defaultAnalysis = 'Patient reports significant clinical improvement with no adverse effects. Physiological markers remain well within target ranges.';
        defaultAction = 'Maintained current therapeutic regimen and advanced recovery score towards discharge target.';
      } else {
        defaultAnalysis = `Clinical review of reported symptoms (${symptomsJoined}) and patient comment: "${update.patientComments}". Vitals reviewed.`;
        defaultAction = 'Adjusted care plan and tablets to optimize symptom control.';
      }
    }

    setDoctorAnalysis(defaultAnalysis);
    setDoctorActionTaken(defaultAction);
  };

  // Save Symptom Review & Adjust Care
  const handleSaveReview = () => {
    if (!reviewingUpdate) return;

    doctorReviewSymptomAndAdjustCare(selectedPatient.id, reviewingUpdate.id, {
      doctorAnalysis,
      doctorActionTaken,
      updatedTablets: reviewTablets,
      updatedPrecautions: reviewPrecautions,
      percentRecovered: markFullyRecoveredInReview ? 100 : reviewRecoveryPercent,
      markFullyRecovered: markFullyRecoveredInReview,
    });

    setReviewingUpdate(null);
  };

  // Helper to adjust tablet dose inside review
  const handleModifyReviewTabletDose = (tabId: string, newDose: string) => {
    setReviewTablets((prev) =>
      prev.map((t) => {
        if (t.id !== tabId) return t;
        return {
          ...t,
          dose: newDose,
          status: 'modified',
          doctorChangeReason: `Dose adjusted to ${newDose} in response to patient reported symptoms.`,
        };
      })
    );
  };

  // Helper to discontinue tablet inside review
  const handleDiscontinueReviewTablet = (tabId: string) => {
    setReviewTablets((prev) =>
      prev.map((t) => {
        if (t.id !== tabId) return t;
        return {
          ...t,
          status: 'discontinued',
          doctorChangeReason: 'Discontinued based on clinical symptom analysis.',
        };
      })
    );
  };

  // Add Direct Tablet
  const handleAddDirectTablet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTabName.trim() || !newTabDose.trim()) return;

    const newTab: MedicationTablet = {
      id: `tab-${Date.now()}`,
      name: newTabName.trim(),
      dose: newTabDose.trim(),
      frequency: newTabFreq.trim() || 'Once daily with meals',
      route: newTabRoute,
      instructions: newTabInstructions.trim() || 'Take with water after meals.',
      reason: newTabReason.trim() || 'Cardiometabolic stabilization',
      status: 'active',
      prescribedDate: new Date().toISOString().split('T')[0],
      durationNote: 'Active daily until doctor assesses complete recovery.',
    };

    updatePatientTablets(selectedPatient.id, [...tablets, newTab]);
    setNewTabName('');
    setNewTabDose('');
    setNewTabFreq('');
    setNewTabInstructions('');
    setNewTabReason('');
    setShowAddTabletModal(false);
  };

  // Add Direct Precaution
  const handleAddDirectPrecaution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrecDirective.trim()) return;

    const newPrec: PrecautionItem = {
      id: `prec-${Date.now()}`,
      category: newPrecCategory,
      directive: newPrecDirective.trim(),
      severity: newPrecSeverity,
      activeUntilRecovery: true,
      updatedDate: new Date().toISOString().split('T')[0],
      doctorNote: newPrecDoctorNote.trim() || undefined,
    };

    updatePatientPrecautions(selectedPatient.id, [...precautions, newPrec]);
    setNewPrecDirective('');
    setNewPrecDoctorNote('');
    setShowAddPrecautionModal(false);
  };

  // Execute Discharge
  const handleExecuteDischarge = () => {
    dischargePatient(selectedPatient.id, {
      dischargeDiagnosis: dischargeDiagnosisInput,
      dischargeCondition: dischargeConditionInput,
      dischargeInstructions: dischargeInstructionsInput,
      followUpDate: followUpDateInput,
    });
    setShowDischargeModal(false);
  };

  // Execute Full Recovery
  const handleExecuteFullRecovery = () => {
    const confirm = window.confirm(
      `Are you sure you want to certify ${selectedPatient.name} as FULLY RECOVERED (100%)? This will issue the official hospital recovery certificate and complete active acute prescriptions.`
    );
    if (confirm) {
      markPatientFullyRecovered(selectedPatient.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP BEDSIDE & HOSPITAL CARE HEADER */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 via-teal-500 to-red-500" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex items-start gap-4">
            <div
              className={`p-3.5 rounded-xl flex flex-col items-center justify-center min-w-16 text-white shadow-xs ${
                isFullyRecovered
                  ? 'bg-emerald-700'
                  : isHighRisk
                  ? 'bg-red-600'
                  : isModerateRisk
                  ? 'bg-amber-600'
                  : 'bg-teal-700'
              }`}
            >
              <span className="text-xs uppercase font-bold tracking-wider font-mono-chart">
                {isDischarged ? 'OUTPATIENT' : 'BED'}
              </span>
              <span className="text-xl font-bold font-mono-chart leading-none mt-0.5">
                {selectedPatient.bedNumber.replace('Bed ', '')}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono-chart bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-md font-bold border border-emerald-200">
                  {selectedPatient.mrn}
                </span>

                {/* Status Pill */}
                {isFullyRecovered ? (
                  <span className="text-xs font-mono-chart px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-emerald-700" />
                    FULLY RECOVERED (100%)
                  </span>
                ) : isDischarged ? (
                  <span className="text-xs font-mono-chart px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-300 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-700" />
                    DISCHARGED &bull; HOME CARE
                  </span>
                ) : (
                  <span className="text-xs font-mono-chart px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 font-bold flex items-center gap-1">
                    <Bed className="w-3.5 h-3.5 text-amber-700" />
                    INPATIENT WARD
                  </span>
                )}

                <span className="text-xs font-mono-chart text-slate-500">
                  Admitted: {selectedPatient.admissionDate}
                </span>
                <span className="text-xs font-mono-chart text-slate-500">
                  Wing: {selectedPatient.wardWing}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-emerald-950 font-heading mt-1">
                {selectedPatient.name}
              </h1>
              <p className="text-sm text-slate-600 font-sans mt-0.5">
                {selectedPatient.age} Years &bull; Biological {selectedPatient.sex.toUpperCase()} &bull; Primary Diagnosis:{' '}
                <strong className="text-slate-900">{selectedPatient.primaryDiagnosis}</strong>
              </p>
            </div>
          </div>

          {/* Quick Header Actions & Patient Switcher */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-mono-chart">
              <span className="text-slate-600 font-bold">Chart:</span>
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

            {/* Discharge Button */}
            {!isDischarged && !isFullyRecovered && (
              <button
                type="button"
                onClick={() => setShowDischargeModal(true)}
                className="px-3 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold font-sans transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Discharge Patient</span>
              </button>
            )}

            {/* Certify Full Recovery Button */}
            {!isFullyRecovered && (
              <button
                type="button"
                onClick={handleExecuteFullRecovery}
                className="px-3 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold font-sans transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Certify Full Recovery (100%)</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onNavigate('report')}
              className="px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-emerald-950 border border-slate-300 text-xs font-bold font-sans transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Chart</span>
            </button>
          </div>
        </div>

        {/* RECOVERY TARGET PROGRESS & DISCHARGE STATUS */}
        <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <div>
              <span className="text-xs font-mono-chart font-bold text-slate-500 uppercase tracking-wide">
                Patient Physiological Recovery Progress
              </span>
              <h3 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
                <span>{recovery.recoveryStage}</span>
                {isFullyRecovered ? (
                  <span className="text-xs bg-emerald-700 text-white px-2.5 py-0.5 rounded font-mono-chart font-bold">
                    Official Clearance Certified
                  </span>
                ) : (
                  <span className="text-xs text-slate-600 font-mono-chart">
                    (Medication &amp; Precautions active until 100% recovery)
                  </span>
                )}
              </h3>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-2xl font-bold font-mono-chart text-emerald-800">
                {recovery.percentRecovered}%
              </span>
              <span className="text-xs text-slate-500 block font-mono-chart">Recovery Progress</span>
            </div>
          </div>

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

          <div className="mt-2 text-xs text-slate-600 font-sans flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <p>
              <strong className="text-slate-800">Clinical Recovery Assessment:</strong>{' '}
              {recovery.recoveryNotes || 'Ongoing inpatient medical care with continuous telemetry and biomarker monitoring.'}
            </p>
            {isDischarged && selectedPatient.dischargeSummary && (
              <span className="text-teal-900 font-bold font-mono-chart shrink-0">
                Discharged: {selectedPatient.dischargeSummary.dischargeDate} &bull; Follow-up: {selectedPatient.dischargeSummary.followUpDate}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2. PATIENT REPORTED SYMPTOMS & DOCTOR ANALYSIS WORKBENCH (CORE REQUIREMENT) */}
      <div className="bg-white border-2 border-emerald-600/60 rounded-xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold shadow-xs">
              <Stethoscope className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-emerald-950 font-heading flex items-center gap-2">
                <span>Patient Health Condition, Reported Symptoms &amp; Doctor Analysis</span>
                {unreviewedCount > 0 && (
                  <span className="text-xs font-mono-chart bg-amber-500 text-white px-2 py-0.5 rounded-full font-bold animate-pulse">
                    {unreviewedCount} New Update{unreviewedCount > 1 ? 's' : ''} Awaiting Review
                  </span>
                )}
              </h3>
              <p className="text-xs font-mono-chart text-slate-500">
                Analyze patient symptoms and update prescribed tablets, dosages, and precautions in real-time.
              </p>
            </div>
          </div>
        </div>

        {/* Symptoms Log Table / Cards */}
        {symptomUpdates.length === 0 ? (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-center text-slate-600 text-xs font-sans">
            No symptom updates reported by patient yet. The patient can send comments and symptoms online via their Patient Health Portal.
          </div>
        ) : (
          <div className="space-y-4">
            {symptomUpdates.map((update) => (
              <div
                key={update.id}
                className={`border rounded-xl p-4 transition-all ${
                  !update.doctorReviewed
                    ? 'bg-amber-50/60 border-amber-300 shadow-xs'
                    : 'bg-white border-slate-200 shadow-2xs'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono-chart font-bold text-slate-800">
                      {update.timestamp}
                    </span>
                    <span
                      className={`text-[11px] font-mono-chart font-bold px-2 py-0.5 rounded ${
                        update.severityLevel === 'Severe'
                          ? 'bg-red-100 text-red-800'
                          : update.severityLevel === 'Moderate'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      Severity: {update.severityLevel}
                    </span>
                    {!update.doctorReviewed && (
                      <span className="text-[11px] font-mono-chart font-bold bg-amber-200 text-amber-950 px-2 py-0.5 rounded flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-800" />
                        Requires Doctor Analysis &amp; Tablet Adjustment
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenReview(update)}
                    className="px-4 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold font-sans transition-all shadow-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                  >
                    <Stethoscope className="w-3.5 h-3.5" />
                    <span>{update.doctorReviewed ? 'Re-Analyze Symptoms & Adjust Care' : 'Analyse Symptoms & Adjust Care'}</span>
                  </button>
                </div>

                <div className="mt-2.5 text-xs font-sans space-y-2">
                  <div className="bg-white border border-slate-200 p-3 rounded-lg">
                    <strong className="text-slate-900 block mb-1">Patient Comments / Health Condition Reported:</strong>
                    <p className="text-slate-800 leading-relaxed italic">&ldquo;{update.patientComments}&rdquo;</p>
                  </div>

                  {update.reportedSymptoms && update.reportedSymptoms.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap pt-1">
                      <span className="text-xs font-mono-chart font-bold text-slate-500">Symptoms:</span>
                      {update.reportedSymptoms.map((s, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-mono-chart bg-slate-100 text-slate-800 border border-slate-300 px-2 py-0.5 rounded"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  {update.homeVitals && (
                    <div className="text-xs font-mono-chart text-slate-700 bg-slate-100/70 p-2.5 rounded-lg flex flex-wrap gap-4 border border-slate-200">
                      {update.homeVitals.systolic_bp && (
                        <span>Home BP: <strong className="text-slate-900">{update.homeVitals.systolic_bp}/{update.homeVitals.diastolic_bp} mmHg</strong></span>
                      )}
                      {update.homeVitals.heart_rate && (
                        <span>Resting Pulse: <strong className="text-slate-900">{update.homeVitals.heart_rate} bpm</strong></span>
                      )}
                      {update.homeVitals.fasting_glucose && (
                        <span>Home Glucose: <strong className="text-slate-900">{update.homeVitals.fasting_glucose} mg/dL</strong></span>
                      )}
                    </div>
                  )}

                  {/* Doctor Analysis Result */}
                  {update.doctorReviewed && update.doctorAnalysis && (
                    <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-3 text-xs font-sans space-y-1 mt-2">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-950 font-heading">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Doctor&apos;s Clinical Symptom Analysis ({update.doctorReviewedAt || 'Reviewed'}):</span>
                      </div>
                      <p className="text-emerald-900 leading-relaxed font-sans">
                        {update.doctorAnalysis}
                      </p>
                      {update.doctorActionTaken && (
                        <p className="text-emerald-800 font-mono-chart text-[11px] pt-1">
                          <strong>Action Taken &amp; Prescription Update:</strong> {update.doctorActionTaken}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. PRESCRIBED TABLETS & MEDICATION MANAGEMENT (DOCTOR'S ACTIVE LEDGER) */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-700 text-white flex items-center justify-center font-bold shadow-xs">
              <Pill className="w-5 h-5 text-teal-200" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-teal-950 font-heading flex items-center gap-2">
                <span>Active Prescribed Tablets &amp; Medication Schedule</span>
                <span className="text-xs font-mono-chart bg-teal-100 text-teal-800 border border-teal-200 px-2 py-0.5 rounded font-bold">
                  {tablets.filter((t) => t.status === 'active' || t.status === 'modified').length} Active
                </span>
              </h3>
              <p className="text-xs font-mono-chart text-slate-500">
                Shown to patient until full physiological recovery is achieved.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAddTabletModal(true)}
            className="px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold font-sans transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Tablet / Medication</span>
          </button>
        </div>

        {tablets.length === 0 ? (
          <div className="text-center py-6 text-slate-500 font-sans text-xs">
            No tablets currently prescribed. Click &ldquo;Add New Tablet / Medication&rdquo; to prescribe.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
            {tablets.map((tab) => (
              <div
                key={tab.id}
                className={`border rounded-xl p-4 space-y-2 ${
                  tab.status === 'discontinued'
                    ? 'bg-slate-50 border-slate-200 opacity-60'
                    : tab.status === 'completed'
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : tab.status === 'modified'
                    ? 'bg-amber-50/40 border-amber-300'
                    : 'bg-white border-slate-200 shadow-2xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-emerald-950 font-heading">
                        {tab.name}
                      </span>
                      <span className="text-xs font-mono-chart bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded border border-slate-200">
                        {tab.dose}
                      </span>
                    </div>
                    <span className="text-xs font-mono-chart text-teal-800 font-bold block mt-0.5">
                      {tab.frequency} &bull; {tab.route}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-mono-chart font-bold px-2 py-0.5 rounded uppercase ${
                      tab.status === 'completed'
                        ? 'bg-emerald-200 text-emerald-900'
                        : tab.status === 'modified'
                        ? 'bg-amber-200 text-amber-900'
                        : tab.status === 'discontinued'
                        ? 'bg-slate-200 text-slate-700'
                        : 'bg-teal-100 text-teal-800'
                    }`}
                  >
                    {tab.status}
                  </span>
                </div>

                <p className="text-slate-800 leading-relaxed text-xs">
                  <strong className="text-slate-900">Instructions:</strong> {tab.instructions}
                </p>
                <p className="text-slate-600 font-mono-chart text-[11px]">
                  <strong>Indication / Target:</strong> {tab.reason}
                </p>

                {tab.doctorChangeReason && (
                  <div className="bg-amber-100/70 border border-amber-200 rounded p-2 text-amber-950 font-sans text-xs">
                    <strong>Doctor Modification Note:</strong> {tab.doctorChangeReason}
                  </div>
                )}

                <div className="text-slate-500 font-mono-chart text-[11px] pt-1 border-t border-slate-100 flex items-center justify-between">
                  <span>Prescribed: {tab.prescribedDate}</span>
                  <span className="text-emerald-700 font-bold">
                    {tab.durationNote || 'Continue until full recovery'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. PRECAUTIONS & DIETARY RESTRICTIONS LEDGER */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-bold shadow-xs">
              <ShieldCheck className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-emerald-950 font-heading">
                Clinical Precautions &amp; Dietary Directives
              </h3>
              <p className="text-xs font-mono-chart text-slate-500">
                Dietary limits, blood pressure checks, and posture safeguards active until full health recovery.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAddPrecautionModal(true)}
            className="px-3.5 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold font-sans transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Precaution / Diet Directive</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
          {precautions.map((prec) => (
            <div
              key={prec.id}
              className={`p-4 rounded-xl border space-y-1.5 ${
                prec.severity === 'critical'
                  ? 'bg-red-50/70 border-red-300 text-red-950'
                  : prec.severity === 'important'
                  ? 'bg-amber-50/60 border-amber-300 text-slate-900'
                  : 'bg-emerald-50/50 border-emerald-300 text-slate-900'
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
                      ? 'bg-red-200 text-red-950'
                      : prec.severity === 'important'
                      ? 'bg-amber-200 text-amber-950'
                      : 'bg-emerald-200 text-emerald-950'
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
                  Doctor Note: {prec.doctorNote}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 5. MULTI-CONDITION AI RISK STRATIFICATION MATRIX */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3 mb-4">
          <div>
            <h3 className="text-lg font-bold text-emerald-950 font-heading flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-700" />
              Multimodal Disease Risk Stratification Matrix
            </h3>
            <p className="text-xs font-mono-chart text-slate-500">
              Fusing Blood Biochemistry + Wearable Epidermal Sweat Kinetics via Random Forest &amp; XGBoost
            </p>
          </div>
          <div className="text-left sm:text-right font-mono-chart text-xs">
            <span className="text-slate-500">Model Accuracy: </span>
            <span className="font-bold text-emerald-700">96.8% ROC-AUC</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {Object.entries(pred.conditions).map(([key, cond]) => {
            const c = cond as ConditionPrediction;
            const isHigh = c.riskLevel === 'High';
            const isMod = c.riskLevel === 'Moderate';

            return (
              <div
                key={key}
                className={`p-3.5 rounded-xl border-2 flex flex-col justify-between transition-all hover:shadow-xs ${
                  isHigh
                    ? 'bg-red-50/70 border-red-300'
                    : isMod
                    ? 'bg-amber-50/70 border-amber-300'
                    : 'bg-emerald-50/70 border-emerald-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono-chart font-bold text-slate-500 uppercase truncate">
                      {key.replace('_', ' ')}
                    </span>
                    <span
                      className={`text-[10px] font-mono-chart font-bold px-2 py-0.5 rounded-full ${
                        isHigh
                          ? 'bg-red-600 text-white'
                          : isMod
                          ? 'bg-amber-500 text-white'
                          : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {c.riskLevel}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs font-heading mt-1 leading-tight">
                    {c.name}
                  </h4>
                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span
                      className={`text-2xl font-bold font-mono-chart ${
                        isHigh ? 'text-red-700' : isMod ? 'text-amber-700' : 'text-emerald-700'
                      }`}
                    >
                      {c.probability}%
                    </span>
                    <span className="text-xs font-mono-chart text-slate-500">Prob</span>
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-200/80 text-xs font-mono-chart text-slate-500">
                  Lead Time: <strong className="text-slate-800">{c.leadTimeWarning || '14 - 30 Days'}</strong>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. DOCTOR'S CLINICAL ORDERS & PRESCRIPTION PAD */}
      <div className="bg-white border-2 border-emerald-700/60 rounded-xl p-5 sm:p-6 shadow-sm relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold shadow-xs">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-emerald-950 font-heading">
                Doctor&apos;s Clinical Orders &amp; Prescription Pad
              </h3>
              <p className="text-xs font-mono-chart text-slate-500">
                Official Physician Orders &bull; Instantly synced to Bedside Patient Booklet
              </p>
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-mono-chart text-slate-500 font-semibold">Protocols:</span>
            <button
              onClick={() => applyPreset('cardiac')}
              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-md text-xs font-mono-chart font-bold cursor-pointer transition-colors"
            >
              Cardiac
            </button>
            <button
              onClick={() => applyPreset('diabetic')}
              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-md text-xs font-mono-chart font-bold cursor-pointer transition-colors"
            >
              Diabetic
            </button>
            <button
              onClick={() => applyPreset('renal')}
              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-md text-xs font-mono-chart font-bold cursor-pointer transition-colors"
            >
              Renal
            </button>
            <button
              onClick={() => applyPreset('discharge')}
              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-md text-xs font-mono-chart font-bold cursor-pointer transition-colors"
            >
              Discharge
            </button>
          </div>
        </div>

        {/* 4 Editable Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-mono-chart">
          {/* Section 1: Clinical Precautions */}
          <div className="space-y-1.5">
            <label className="font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-red-600" />
              <span>1. Clinical Precautions &amp; Alerts:</span>
            </label>
            <textarea
              rows={3}
              value={precautionsText}
              onChange={(e) => setPrecautionsText(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-sans focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 leading-relaxed text-xs"
              placeholder="Enter patient precautions, fall risks, allergy alerts, critical vitals thresholds..."
            />
          </div>

          {/* Section 2: Medication Orders */}
          <div className="space-y-1.5">
            <label className="font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
              <ClipboardList className="w-4 h-4 text-emerald-700" />
              <span>2. Medication Orders &amp; Prescriptions:</span>
            </label>
            <textarea
              rows={3}
              value={medicationsText}
              onChange={(e) => setMedicationsText(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-sans focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 leading-relaxed text-xs"
              placeholder="Enter medication dosages, frequencies, administration instructions..."
            />
          </div>

          {/* Section 3: Dietary & Hydration */}
          <div className="space-y-1.5">
            <label className="font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-teal-600" />
              <span>3. Dietary Directives &amp; Nutrition:</span>
            </label>
            <textarea
              rows={3}
              value={dietaryText}
              onChange={(e) => setDietaryText(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-sans focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 leading-relaxed text-xs"
              placeholder="Enter sodium restrictions, carb counting, fluid goals, meal protocols..."
            />
          </div>

          {/* Section 4: Observation & Nursing Orders */}
          <div className="space-y-1.5">
            <label className="font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-700" />
              <span>4. Observation &amp; Nursing Orders:</span>
            </label>
            <textarea
              rows={3}
              value={observationText}
              onChange={(e) => setObservationText(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-sans focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 leading-relaxed text-xs"
              placeholder="Enter telemetry checks, lab orders, sweat patch sensor recalibration frequency..."
            />
          </div>
        </div>

        {/* Doctor Signature & Save Footer */}
        <div className="mt-5 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono-chart text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center font-bold">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-emerald-950">
                Attending Signature: {doctorName}
              </p>
              <p className="text-xs text-slate-500">
                Last Signed &amp; Timestamped: {selectedPatient.doctorNotes.timestamp}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {saveToast && (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Orders Saved &amp; Signed!
              </span>
            )}
            <button
              onClick={handleSaveNotes}
              className="px-6 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-all shadow-sm flex items-center gap-2 cursor-pointer font-sans"
            >
              <Save className="w-4 h-4" />
              <span>Sign &amp; Stamp Physician Orders</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: SYMPTOM ANALYSIS & TREATMENT ADJUSTMENT DRAWER / WORKBENCH */}
      {/* ========================================================================= */}
      {reviewingUpdate && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-300 my-8 max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold shadow-xs">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-emerald-950 font-heading">
                    Clinical Symptom Analysis &amp; Treatment Adjustment
                  </h3>
                  <p className="text-xs font-mono-chart text-slate-500">
                    Patient: {selectedPatient.name} &bull; Submitted: {reviewingUpdate.timestamp}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setReviewingUpdate(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Patient Symptoms Summary Banner */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2 text-xs font-sans">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-900 font-mono-chart uppercase">
                  Patient Health Condition &amp; Reported Input:
                </span>
                <span className="font-bold font-mono-chart bg-amber-200 text-amber-900 px-2 py-0.5 rounded">
                  Severity: {reviewingUpdate.severityLevel}
                </span>
              </div>
              <p className="text-slate-900 leading-relaxed font-medium bg-white p-3 rounded-lg border border-amber-200/80">
                &ldquo;{reviewingUpdate.patientComments}&rdquo;
              </p>
              {reviewingUpdate.reportedSymptoms.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {reviewingUpdate.reportedSymptoms.map((s, idx) => (
                    <span key={idx} className="bg-amber-200/80 text-amber-950 font-mono-chart text-[11px] px-2 py-0.5 rounded">
                      {s}
                    </span>
                  ))}
                </div>
              )}
              {reviewingUpdate.homeVitals && (
                <div className="font-mono-chart text-[11px] text-slate-700 pt-1">
                  Home Vitals Check: BP: {reviewingUpdate.homeVitals.systolic_bp}/{reviewingUpdate.homeVitals.diastolic_bp} mmHg | Heart Rate: {reviewingUpdate.homeVitals.heart_rate} bpm | Glucose: {reviewingUpdate.homeVitals.fasting_glucose} mg/dL
                </div>
              )}
            </div>

            {/* Doctor Analysis Input */}
            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-slate-800 font-mono-chart uppercase block">
                Doctor&apos;s Clinical Symptom Analysis &amp; Diagnostic Impression:
              </label>
              <textarea
                rows={3}
                value={doctorAnalysis}
                onChange={(e) => setDoctorAnalysis(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-sans focus:outline-emerald-600 leading-relaxed text-xs"
                placeholder="Document your clinical analysis of the patient's symptoms (e.g. orthostasis, medication tolerance, metabolic response)..."
              />
            </div>

            {/* Interactive Tablets Adjustment Table */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-800 font-mono-chart uppercase">
                  Adjust Prescribed Tablets &amp; Dosages:
                </label>
                <span className="text-[11px] text-slate-500 font-mono-chart">
                  Modify doses directly or discontinue tablets
                </span>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto border border-slate-200 rounded-xl p-2 bg-slate-50">
                {reviewTablets.map((tab) => (
                  <div
                    key={tab.id}
                    className="bg-white border border-slate-200 rounded-lg p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <span>{tab.name}</span>
                        <span className="text-slate-500 text-[11px] font-mono-chart font-normal">
                          (Current: {tab.dose})
                        </span>
                        <span className={`text-[10px] font-mono-chart font-bold px-1.5 py-0.2 rounded uppercase ${
                          tab.status === 'modified' ? 'bg-amber-100 text-amber-800' : tab.status === 'discontinued' ? 'bg-slate-200 text-slate-700' : 'bg-teal-100 text-teal-800'
                        }`}>
                          {tab.status}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono-chart">
                        {tab.frequency} &bull; {tab.reason}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        defaultValue={tab.dose}
                        onBlur={(e) => handleModifyReviewTabletDose(tab.id, e.target.value)}
                        placeholder="New dose..."
                        className="w-24 bg-white border border-slate-300 rounded px-2 py-1 text-xs font-mono-chart focus:outline-emerald-600"
                      />
                      <button
                        type="button"
                        onClick={() => handleDiscontinueReviewTablet(tab.id)}
                        className="px-2 py-1 text-[11px] bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-700 border border-slate-300 rounded font-sans cursor-pointer"
                      >
                        Discontinue
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recovery Progress Target Slider */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 font-mono-chart uppercase">
                  Adjust Recovery Progress (% Target):
                </span>
                <span className="text-base font-bold font-mono-chart text-emerald-800">
                  {markFullyRecoveredInReview ? 100 : reviewRecoveryPercent}%
                </span>
              </div>
              <input
                type="range"
                min={10}
                max={100}
                step={5}
                disabled={markFullyRecoveredInReview}
                value={markFullyRecoveredInReview ? 100 : reviewRecoveryPercent}
                onChange={(e) => setReviewRecoveryPercent(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-700 cursor-pointer"
              />
              <label className="flex items-center gap-2 cursor-pointer font-sans text-xs text-slate-700 pt-1">
                <input
                  type="checkbox"
                  checked={markFullyRecoveredInReview}
                  onChange={(e) => setMarkFullyRecoveredInReview(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
                />
                <span className="font-bold text-emerald-950">
                  Mark Patient Fully Recovered (100% — Issue Medical Clearance &amp; Complete Acute Tablets)
                </span>
              </label>
            </div>

            {/* Doctor's Action Response to Patient */}
            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-slate-800 font-mono-chart uppercase block">
                Doctor&apos;s Action Taken &amp; Feedback for Patient:
              </label>
              <textarea
                rows={2}
                value={doctorActionTaken}
                onChange={(e) => setDoctorActionTaken(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-sans focus:outline-emerald-600 leading-relaxed text-xs"
                placeholder="Explain the changes to the patient (e.g. 'Reduced Amlodipine to 5mg due to dizziness; rise slowly from sitting position')..."
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setReviewingUpdate(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold font-sans cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveReview}
                className="px-6 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold font-sans transition-all shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Approve &amp; Push Updated Care Plan</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ADD NEW TABLET MODAL */}
      {/* ========================================================================= */}
      {showAddTabletModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleAddDirectTablet}
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-300 space-y-4 text-xs font-sans"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-emerald-950 font-heading flex items-center gap-2">
                <Pill className="w-5 h-5 text-emerald-700" />
                Prescribe New Tablet / Medication
              </h3>
              <button
                type="button"
                onClick={() => setShowAddTabletModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase font-mono-chart text-[11px]">
                  Medication / Tablet Name:
                </label>
                <input
                  type="text"
                  required
                  value={newTabName}
                  onChange={(e) => setNewTabName(e.target.value)}
                  placeholder="e.g. Amlodipine Besylate, Metformin, Lisinopril..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs focus:outline-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 uppercase font-mono-chart text-[11px]">
                    Dosage:
                  </label>
                  <input
                    type="text"
                    required
                    value={newTabDose}
                    onChange={(e) => setNewTabDose(e.target.value)}
                    placeholder="e.g. 5 mg, 500 mg, 1 tablet"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs focus:outline-emerald-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1 uppercase font-mono-chart text-[11px]">
                    Frequency / Timing:
                  </label>
                  <input
                    type="text"
                    value={newTabFreq}
                    onChange={(e) => setNewTabFreq(e.target.value)}
                    placeholder="e.g. Once daily in the morning"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs focus:outline-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase font-mono-chart text-[11px]">
                  Clinical Reason / Purpose:
                </label>
                <input
                  type="text"
                  value={newTabReason}
                  onChange={(e) => setNewTabReason(e.target.value)}
                  placeholder="e.g. Blood pressure regulation, Glycemic control"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase font-mono-chart text-[11px]">
                  Patient Instructions:
                </label>
                <textarea
                  rows={2}
                  value={newTabInstructions}
                  onChange={(e) => setNewTabInstructions(e.target.value)}
                  placeholder="e.g. Take with a glass of water after breakfast. Do not stand up quickly."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs focus:outline-emerald-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowAddTabletModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Prescribe Tablet
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: ADD NEW PRECAUTION MODAL */}
      {/* ========================================================================= */}
      {showAddPrecautionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleAddDirectPrecaution}
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-300 space-y-4 text-xs font-sans"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-emerald-950 font-heading flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                Add Clinical Precaution / Diet Directive
              </h3>
              <button
                type="button"
                onClick={() => setShowAddPrecautionModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 uppercase font-mono-chart text-[11px]">
                    Category:
                  </label>
                  <select
                    value={newPrecCategory}
                    onChange={(e) => setNewPrecCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs focus:outline-emerald-600"
                  >
                    <option value="Diet & Nutrition">Diet &amp; Nutrition</option>
                    <option value="Blood Pressure & Vitals">Blood Pressure &amp; Vitals</option>
                    <option value="Physical Activity & Posture">Physical Activity &amp; Posture</option>
                    <option value="Medication Timing">Medication Timing</option>
                    <option value="Emergency Alert">Emergency Alert</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1 uppercase font-mono-chart text-[11px]">
                    Severity Level:
                  </label>
                  <select
                    value={newPrecSeverity}
                    onChange={(e) => setNewPrecSeverity(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs focus:outline-emerald-600"
                  >
                    <option value="routine">Routine</option>
                    <option value="important">Important</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase font-mono-chart text-[11px]">
                  Precaution Directive:
                </label>
                <textarea
                  rows={3}
                  required
                  value={newPrecDirective}
                  onChange={(e) => setNewPrecDirective(e.target.value)}
                  placeholder="e.g. Strict low-sodium diet (< 1,500 mg/day). Sit on bed edge 2 minutes before standing."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase font-mono-chart text-[11px]">
                  Clinical Doctor Note (Optional):
                </label>
                <input
                  type="text"
                  value={newPrecDoctorNote}
                  onChange={(e) => setNewPrecDoctorNote(e.target.value)}
                  placeholder="e.g. Dual vasodilator therapy increases postural sensitivity."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs focus:outline-emerald-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowAddPrecautionModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Save Precaution
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: DISCHARGE PATIENT MODAL */}
      {/* ========================================================================= */}
      {showDischargeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-300 space-y-4 text-xs font-sans">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-teal-950 font-heading flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-teal-700" />
                Discharge Patient to Home Recovery
              </h3>
              <button
                type="button"
                onClick={() => setShowDischargeModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-slate-600 leading-relaxed">
              This will transition <strong className="text-slate-900">{selectedPatient.name}</strong> from Inpatient to{' '}
              <strong className="text-teal-900">Discharged Home Recovery</strong>. The patient will retain access to their online health condition, active tablets, precautions, and symptom reporting tools until 100% full recovery.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase font-mono-chart text-[11px]">
                  Discharge Diagnosis:
                </label>
                <input
                  type="text"
                  value={dischargeDiagnosisInput}
                  onChange={(e) => setDischargeDiagnosisInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs focus:outline-teal-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase font-mono-chart text-[11px]">
                  Condition at Discharge:
                </label>
                <select
                  value={dischargeConditionInput}
                  onChange={(e) => setDischargeConditionInput(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs focus:outline-teal-600"
                >
                  <option value="Clinically Stable">Clinically Stable</option>
                  <option value="Improving">Improving</option>
                  <option value="Fully Resolved">Fully Resolved</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase font-mono-chart text-[11px]">
                  Scheduled Follow-up Clinic Appointment:
                </label>
                <input
                  type="text"
                  value={followUpDateInput}
                  onChange={(e) => setFollowUpDateInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs focus:outline-teal-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase font-mono-chart text-[11px]">
                  Home Recovery Instructions for Patient:
                </label>
                <textarea
                  rows={3}
                  value={dischargeInstructionsInput}
                  onChange={(e) => setDischargeInstructionsInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs focus:outline-teal-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowDischargeModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteDischarge}
                className="px-5 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Confirm Discharge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
