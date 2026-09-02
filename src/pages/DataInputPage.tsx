import React, { useState, useRef } from 'react';
import { useHealthData } from '../context/HealthDataContext';
import { BIOMARKER_RANGES, CLINICAL_PRESETS } from '../utils/clinicalData';
import { PatientHealthData } from '../types';
import { ConfluenceWave } from '../components/ConfluenceWave';
import {
  Stethoscope,
  Sparkles,
  Droplets,
  Zap,
  Activity,
  Upload,
  Download,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  FlaskConical,
  Heart,
  Dna,
  RotateCcw,
  Check,
  ArrowRight,
  ShieldAlert,
  Sliders,
  TrendingUp,
  Info,
  ChevronRight,
  ChevronLeft,
  Flame,
  User,
  Layers,
  Thermometer,
  FileSpreadsheet,
  HeartPulse,
  Clock,
  Radio,
  Wifi,
  BatteryCharging
} from 'lucide-react';

interface DataInputPageProps {
  onNavigate: (pageId: string) => void;
}

export const DataInputPage: React.FC<DataInputPageProps> = ({ onNavigate }) => {
  const {
    currentData,
    updateDataField,
    loadPreset,
    runPrediction,
    isPredicting,
    batchPredictCsv
  } = useHealthData();

  // Active Data Adding Method
  const [activeMethod, setActiveMethod] = useState<'wizard' | 'rapid' | 'sweat_sim' | 'presets' | 'csv'>('wizard');
  
  // Wizard current step (1 to 5)
  const [wizardStep, setWizardStep] = useState<number>(1);

  // Early warning symptoms checklist state
  const [earlySymptoms, setEarlySymptoms] = useState<Record<string, boolean>>({
    postprandial_fatigue: true,
    excessive_thirst: false,
    salt_craving: true,
    morning_headache: false,
    cold_sensitivity: false,
    unexplained_exhaustion: false,
    nocturnal_urination: false,
    muscle_cramps: false
  });

  const [csvStatus, setCsvStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePredict = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    await runPrediction();
    onNavigate('results');
  };

  const handleCsvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCsvStatus({ type: 'loading', message: `Parsing and validating ${file.name}...` });

    try {
      const text = await file.text();
      const count = await batchPredictCsv(text);
      setCsvStatus({
        type: 'success',
        message: `Successfully ingested and scored ${count} patient records through multimodal ensemble.`
      });
    } catch (err: any) {
      setCsvStatus({
        type: 'error',
        message: err.message || 'Failed to parse CSV file. Please ensure valid biomarker column headers.'
      });
    }
  };

  // Helper for field validation status
  const getFieldStatus = (key: keyof PatientHealthData) => {
    const val = currentData[key];
    const meta = BIOMARKER_RANGES[key as string];
    if (typeof val !== 'number' || !meta) return 'normal';
    if (val > meta.normalMax) return 'high';
    if (val < meta.normalMin) return 'low';
    return 'normal';
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* 1. TOP DUAL-STREAM INTAKE HEADER */}
      <div className="card-confluence p-6 bg-[#FCFAF6] border-[#E5DDCE] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono-tabular font-bold px-2.5 py-0.5 rounded-lg bg-[#EAE2D5] text-[#1B2430] border border-[#DDD1BE]">
              DUAL-STREAM INGESTION ENGINE
            </span>
            <span className="text-[#8C8270]">&bull;</span>
            <span className="text-xs text-[#5A6577] font-medium">Venous Blood + Epidermal Sweat</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-heading text-[#1B2430] tracking-tight">
            Patient Biomarker Ingestion Hub
          </h1>
          <p className="text-xs sm:text-sm text-[#5A6577] mt-1 max-w-2xl">
            Input deep blood biochemistry and continuous sweat sensor flux to converge the signals into early disease probabilities.
          </p>
        </div>

        {/* Quick Predict Action Button */}
        <button
          onClick={handlePredict}
          disabled={isPredicting}
          className="px-5 py-3 rounded-xl bg-[#8C3B3B] hover:bg-[#783030] text-white text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer shrink-0 disabled:opacity-50"
        >
          {isPredicting ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Converging Signals...</span>
            </>
          ) : (
            <>
              <Activity className="w-4 h-4 text-[#D9A441]" />
              <span>Fuse Signals & Predict Risks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>

      {/* 2. INTAKE METHOD SELECTION TABS */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {[
          { id: 'wizard', label: '1. Guided Dual Wizard', icon: Sparkles },
          { id: 'rapid', label: '2. Rapid Split Matrix', icon: Sliders },
          { id: 'sweat_sim', label: '3. Wearable Sweat Telemetry', icon: Droplets },
          { id: 'presets', label: '4. Clinical Patient Presets', icon: FlaskConical },
          { id: 'csv', label: '5. CSV Batch Upload', icon: FileSpreadsheet }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeMethod === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveMethod(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-2 ${
                isActive
                  ? 'bg-[#1B2430] text-[#F6F1E9] shadow-xs font-bold'
                  : 'bg-[#FCFAF6] text-[#5A6577] hover:bg-[#F3EFE6] border border-[#E5DDCE]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#D9A441]' : 'text-[#8C8270]'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. METHOD 1: 5-STEP GUIDED WIZARD */}
      {activeMethod === 'wizard' && (
        <div className="card-confluence p-6 bg-[#FCFAF6] border-[#E5DDCE] space-y-6">
          {/* Step Progress Tracker */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono-tabular">
              <span className="font-bold text-[#8C3B3B] uppercase">
                Step {wizardStep} of 5 &bull; {
                  wizardStep === 1 ? 'Patient Demographics & Blood Pressure' :
                  wizardStep === 2 ? 'Venous Blood Stream: Glycemic & Metabolic' :
                  wizardStep === 3 ? 'Venous Blood Stream: Lipid & Renal Profile' :
                  wizardStep === 4 ? 'Sweat Stream: Wearable Microfluidic Sensors' :
                  'Subclinical Warning Signals'
                }
              </span>
              <span className="text-[#8C8270]">{Math.round((wizardStep / 5) * 100)}% Complete</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#EAE2D5] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#8C3B3B] via-[#D9A441] to-[#5C8A66] transition-all duration-300"
                style={{ width: `${(wizardStep / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* Step 1: Demographics & Hemodynamics */}
          {wizardStep === 1 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#FAF7F0] border border-[#E5DDCE] flex items-center gap-3">
                <HeartPulse className="w-5 h-5 text-[#8C3B3B] shrink-0" />
                <p className="text-xs text-[#3E4A5B] leading-relaxed">
                  Enter baseline subject metrics and resting blood pressure hemodynamics.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1B2430]">Patient Full Name</label>
                  <input
                    type="text"
                    value={currentData.name || ''}
                    onChange={(e) => updateDataField('name', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5DDCE] bg-white text-xs font-medium focus:outline-none focus:border-[#8C3B3B]"
                    placeholder="e.g. Eleanor Vance"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1B2430]">Age (Years)</label>
                  <input
                    type="number"
                    value={currentData.age || 48}
                    onChange={(e) => updateDataField('age', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5DDCE] bg-white text-xs font-mono-tabular focus:outline-none focus:border-[#8C3B3B]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1B2430]">Biological Sex</label>
                  <select
                    value={currentData.sex || 'female'}
                    onChange={(e) => updateDataField('sex', e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5DDCE] bg-white text-xs font-semibold focus:outline-none focus:border-[#8C3B3B]"
                  >
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1B2430]">Body Mass Index (BMI)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={currentData.bmi || 24.5}
                    onChange={(e) => updateDataField('bmi', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5DDCE] bg-white text-xs font-mono-tabular focus:outline-none focus:border-[#8C3B3B]"
                  />
                </div>
              </div>

              {/* Hemodynamics Bar */}
              <div className="p-4 rounded-xl bg-[#FAF3F3] border border-[#E8CDCD] space-y-3">
                <h4 className="text-xs font-bold font-serif-heading text-[#8C3B3B] uppercase tracking-wider">
                  &bull; Resting Hemodynamics (Blood Pressure)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-[#1B2430]">Systolic BP (mmHg)</span>
                      <span className="font-mono-tabular text-[#8C3B3B] font-bold">{currentData.systolic_bp || 118}</span>
                    </div>
                    <input
                      type="range"
                      min="90"
                      max="200"
                      value={currentData.systolic_bp || 118}
                      onChange={(e) => updateDataField('systolic_bp', Number(e.target.value))}
                      className="w-full range-blood cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-[#1B2430]">Diastolic BP (mmHg)</span>
                      <span className="font-mono-tabular text-[#8C3B3B] font-bold">{currentData.diastolic_bp || 78}</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="120"
                      value={currentData.diastolic_bp || 78}
                      onChange={(e) => updateDataField('diastolic_bp', Number(e.target.value))}
                      className="w-full range-blood cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-[#1B2430]">Resting Heart Rate (BPM)</span>
                      <span className="font-mono-tabular text-[#8C3B3B] font-bold">{currentData.heart_rate || 72}</span>
                    </div>
                    <input
                      type="range"
                      min="45"
                      max="140"
                      value={currentData.heart_rate || 72}
                      onChange={(e) => updateDataField('heart_rate', Number(e.target.value))}
                      className="w-full range-blood cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Venous Blood Glycemic Panel */}
          {wizardStep === 2 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#FAF3F3] border border-[#E8CDCD] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#8C3B3B] text-white flex items-center justify-center font-bold text-xs">
                    01
                  </div>
                  <div>
                    <h4 className="text-sm font-bold font-serif-heading text-[#8C3B3B]">
                      Venous Blood Stream &bull; Glycemic Panel
                    </h4>
                    <p className="text-[11px] text-[#5B2222]">
                      Plasma fasting glucose, glycated hemoglobin HbA1c, and fasting insulin levels.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono-tabular font-bold text-[#8C3B3B] bg-white px-2 py-0.5 rounded border border-[#E8CDCD]">
                  Blood Stream
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { key: 'fasting_glucose', label: 'Fasting Blood Glucose', unit: 'mg/dL', min: 60, max: 300, step: 1 },
                  { key: 'hba1c', label: 'Glycated Hemoglobin (HbA1c)', unit: '%', min: 4.0, max: 14.0, step: 0.1 },
                  { key: 'fasting_insulin', label: 'Fasting Insulin', unit: 'µIU/mL', min: 2, max: 50, step: 0.5 }
                ].map(item => {
                  const val = (currentData as any)[item.key] ?? item.min;
                  const meta = BIOMARKER_RANGES[item.key];
                  const status = getFieldStatus(item.key as any);
                  return (
                    <div key={item.key} className="p-4 rounded-xl bg-white border border-[#E5DDCE] space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xs font-bold text-[#1B2430] block">{item.label}</span>
                          <span className="text-[10px] text-[#8C8270]">Ref: {meta?.normalMin} - {meta?.normalMax} {item.unit}</span>
                        </div>
                        <span className={`text-[10px] font-mono-tabular font-bold px-1.5 py-0.5 rounded ${
                          status === 'high' ? 'bg-[#FAF0EE] text-[#B5473A]' : status === 'low' ? 'bg-[#FCF5E8] text-[#9C701B]' : 'bg-[#F3F7F3] text-[#5C8A66]'
                        }`}>
                          {val} {item.unit}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={item.min}
                        max={item.max}
                        step={item.step}
                        value={val}
                        onChange={(e) => updateDataField(item.key as any, Number(e.target.value))}
                        className="w-full range-blood cursor-pointer"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Venous Blood Lipid & Renal Panel */}
          {wizardStep === 3 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#FAF3F3] border border-[#E8CDCD] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#8C3B3B] text-white flex items-center justify-center font-bold text-xs">
                    02
                  </div>
                  <div>
                    <h4 className="text-sm font-bold font-serif-heading text-[#8C3B3B]">
                      Venous Blood Stream &bull; Lipid Fractions & Renal Panel
                    </h4>
                    <p className="text-[11px] text-[#5B2222]">
                      Serum creatinine, BUN, total cholesterol, LDL, HDL, and triglycerides.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono-tabular font-bold text-[#8C3B3B] bg-white px-2 py-0.5 rounded border border-[#E8CDCD]">
                  Blood Stream
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { key: 'ldl_cholesterol', label: 'LDL Cholesterol', unit: 'mg/dL', min: 40, max: 250, step: 1 },
                  { key: 'hdl_cholesterol', label: 'HDL Cholesterol', unit: 'mg/dL', min: 20, max: 100, step: 1 },
                  { key: 'triglycerides', label: 'Triglycerides', unit: 'mg/dL', min: 40, max: 500, step: 1 },
                  { key: 'serum_creatinine', label: 'Serum Creatinine', unit: 'mg/dL', min: 0.4, max: 4.5, step: 0.05 },
                  { key: 'blood_urea_nitrogen', label: 'Blood Urea Nitrogen (BUN)', unit: 'mg/dL', min: 5, max: 60, step: 1 },
                  { key: 'alt_liver', label: 'ALT (Alanine Transaminase)', unit: 'U/L', min: 5, max: 150, step: 1 }
                ].map(item => {
                  const val = (currentData as any)[item.key] ?? item.min;
                  const meta = BIOMARKER_RANGES[item.key];
                  const status = getFieldStatus(item.key as any);
                  return (
                    <div key={item.key} className="p-4 rounded-xl bg-white border border-[#E5DDCE] space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xs font-bold text-[#1B2430] block">{item.label}</span>
                          <span className="text-[10px] text-[#8C8270]">Ref: {meta?.normalMin} - {meta?.normalMax} {item.unit}</span>
                        </div>
                        <span className={`text-[10px] font-mono-tabular font-bold px-1.5 py-0.5 rounded ${
                          status === 'high' ? 'bg-[#FAF0EE] text-[#B5473A]' : status === 'low' ? 'bg-[#FCF5E8] text-[#9C701B]' : 'bg-[#F3F7F3] text-[#5C8A66]'
                        }`}>
                          {val} {item.unit}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={item.min}
                        max={item.max}
                        step={item.step}
                        value={val}
                        onChange={(e) => updateDataField(item.key as any, Number(e.target.value))}
                        className="w-full range-blood cursor-pointer"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 4: Wearable Sweat Stream */}
          {wizardStep === 4 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#FCF8EE] border border-[#EEDFBD] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#D9A441] text-white flex items-center justify-center font-bold text-xs">
                    03
                  </div>
                  <div>
                    <h4 className="text-sm font-bold font-serif-heading text-[#9C701B]">
                      Epidermal Sweat Stream &bull; Wearable Microfluidic Sensors
                    </h4>
                    <p className="text-[11px] text-[#6E4F10]">
                      Continuous sweat glucose diffusion, ionic sodium/potassium ratio, lactate, and stress cortisol.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono-tabular font-bold text-[#9C701B] bg-white px-2 py-0.5 rounded border border-[#EEDFBD]">
                  Sweat Stream
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { key: 'sweat_glucose', label: 'Epidermal Sweat Glucose', unit: 'mg/dL', min: 0.2, max: 8.0, step: 0.1 },
                  { key: 'sweat_sodium', label: 'Sweat Sodium (Na+)', unit: 'mmol/L', min: 10, max: 90, step: 1 },
                  { key: 'sweat_potassium', label: 'Sweat Potassium (K+)', unit: 'mmol/L', min: 1.0, max: 15.0, step: 0.2 },
                  { key: 'sweat_lactate', label: 'Sweat Lactate Flux', unit: 'mmol/L', min: 2.0, max: 35.0, step: 0.5 },
                  { key: 'sweat_cortisol', label: 'Sweat Cortisol (Stress)', unit: 'µg/dL', min: 0.05, max: 2.5, step: 0.05 },
                  { key: 'sweat_rate', label: 'Sweat Excretion Rate', unit: 'mg/cm²/min', min: 0.1, max: 3.0, step: 0.1 }
                ].map(item => {
                  const val = (currentData as any)[item.key] ?? item.min;
                  const meta = BIOMARKER_RANGES[item.key];
                  const status = getFieldStatus(item.key as any);
                  return (
                    <div key={item.key} className="p-4 rounded-xl bg-white border border-[#E5DDCE] space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xs font-bold text-[#1B2430] block">{item.label}</span>
                          <span className="text-[10px] text-[#8C8270]">Ref: {meta?.normalMin} - {meta?.normalMax} {item.unit}</span>
                        </div>
                        <span className={`text-[10px] font-mono-tabular font-bold px-1.5 py-0.5 rounded ${
                          status === 'high' ? 'bg-[#FAF0EE] text-[#B5473A]' : status === 'low' ? 'bg-[#FCF5E8] text-[#9C701B]' : 'bg-[#F3F7F3] text-[#5C8A66]'
                        }`}>
                          {val} {item.unit}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={item.min}
                        max={item.max}
                        step={item.step}
                        value={val}
                        onChange={(e) => updateDataField(item.key as any, Number(e.target.value))}
                        className="w-full range-sweat cursor-pointer"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 5: Subclinical Warning Checklist */}
          {wizardStep === 5 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#FAF7F0] border border-[#E5DDCE]">
                <h4 className="text-sm font-bold font-serif-heading text-[#1B2430]">
                  Subclinical Early Symptoms & Lifestyle Indicators
                </h4>
                <p className="text-xs text-[#5A6577] mt-0.5">
                  Select any subtle signals experienced in the past 30 days to refine ensemble risk calibration.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { key: 'postprandial_fatigue', label: 'Post-Meal Lethargy / Energy Crashes', desc: 'Sign of early insulin resistance and glucose latency' },
                  { key: 'salt_craving', label: 'Frequent Salt / Sodium Cravings', desc: 'Associated with epidermal sodium loss and adrenal stress' },
                  { key: 'excessive_thirst', label: 'Unusual Thirst / Dry Mouth (Polydipsia)', desc: 'Early osmotic glycemic shifts' },
                  { key: 'morning_headache', label: 'Morning Occipital Headaches', desc: 'Nocturnal blood pressure elevation' },
                  { key: 'unexplained_exhaustion', label: 'Chronic Midday Fatigue', desc: 'Cellular lactate accumulation and mitochondrial strain' },
                  { key: 'muscle_cramps', label: 'Calf Cramping After Mild Exertion', desc: 'Electrolyte Na+/K+ imbalance in sweat' }
                ].map(sym => {
                  const isChecked = !!earlySymptoms[sym.key];
                  return (
                    <div
                      key={sym.key}
                      onClick={() => setEarlySymptoms(prev => ({ ...prev, [sym.key]: !prev[sym.key] }))}
                      className={`p-3.5 rounded-xl border text-xs flex items-start gap-3 transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-[#F3F7F3] border-[#CADBCA] text-[#1B2430]'
                          : 'bg-white border-[#E5DDCE] text-[#5A6577] hover:bg-[#FAF7F0]'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border transition-all ${
                        isChecked ? 'bg-[#5C8A66] border-[#5C8A66] text-white' : 'border-[#8C8270] bg-white'
                      }`}>
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div>
                        <span className="font-bold text-[#1B2430] block">{sym.label}</span>
                        <span className="text-[11px] text-[#8C8270]">{sym.desc}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Wizard Step Navigation Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-[#EAE2D5]">
            <button
              onClick={() => setWizardStep(prev => Math.max(1, prev - 1))}
              disabled={wizardStep === 1}
              className="px-4 py-2.5 rounded-xl bg-[#FCFAF6] hover:bg-[#F3EFE6] text-[#1B2430] border border-[#E5DDCE] text-xs font-bold transition-all disabled:opacity-40 cursor-pointer flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Step</span>
            </button>

            {wizardStep < 5 ? (
              <button
                onClick={() => setWizardStep(prev => Math.min(5, prev + 1))}
                className="px-5 py-2.5 rounded-xl bg-[#1B2430] hover:bg-[#253142] text-[#F6F1E9] text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <span>Next Step</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handlePredict}
                disabled={isPredicting}
                className="px-6 py-2.5 rounded-xl bg-[#8C3B3B] hover:bg-[#783030] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-2"
              >
                <Activity className="w-4 h-4 text-[#D9A441]" />
                <span>Fuse Biomarkers & Predict Risks</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 4. METHOD 2: 1-PAGE RAPID MATRIX (SPLIT BLOOD VS SWEAT) */}
      {activeMethod === 'rapid' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Blood Stream */}
          <div className="card-blood p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E8CDCD]">
              <div className="flex items-center gap-2.5">
                <HeartPulse className="w-5 h-5 text-[#8C3B3B]" />
                <h3 className="text-base font-bold font-serif-heading text-[#8C3B3B]">
                  Venous Blood Biomarkers Stream
                </h3>
              </div>
              <span className="text-[10px] font-mono-tabular font-bold px-2 py-0.5 rounded bg-white text-[#8C3B3B] border border-[#E8CDCD]">
                14 Markers
              </span>
            </div>

            <div className="space-y-3">
              {[
                { key: 'fasting_glucose', label: 'Fasting Plasma Glucose', unit: 'mg/dL', min: 60, max: 280, step: 1 },
                { key: 'hba1c', label: 'Glycated HbA1c', unit: '%', min: 4.0, max: 13.0, step: 0.1 },
                { key: 'systolic_bp', label: 'Systolic Blood Pressure', unit: 'mmHg', min: 90, max: 200, step: 1 },
                { key: 'diastolic_bp', label: 'Diastolic Blood Pressure', unit: 'mmHg', min: 50, max: 120, step: 1 },
                { key: 'ldl_cholesterol', label: 'LDL Cholesterol', unit: 'mg/dL', min: 50, max: 240, step: 1 },
                { key: 'serum_creatinine', label: 'Serum Creatinine', unit: 'mg/dL', min: 0.4, max: 3.5, step: 0.05 },
                { key: 'blood_urea_nitrogen', label: 'BUN', unit: 'mg/dL', min: 5, max: 60, step: 1 }
              ].map(item => {
                const val = (currentData as any)[item.key] ?? item.min;
                const meta = BIOMARKER_RANGES[item.key];
                const status = getFieldStatus(item.key as any);
                return (
                  <div key={item.key} className="p-3 rounded-xl bg-white border border-[#E8CDCD] space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-[#1B2430]">{item.label}</span>
                      <span className={`font-mono-tabular font-bold px-1.5 py-0.2 rounded text-[11px] ${
                        status === 'high' ? 'bg-[#FAF0EE] text-[#B5473A]' : status === 'low' ? 'bg-[#FCF5E8] text-[#9C701B]' : 'bg-[#F3F7F3] text-[#5C8A66]'
                      }`}>
                        {val} {item.unit}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={item.min}
                      max={item.max}
                      step={item.step}
                      value={val}
                      onChange={(e) => updateDataField(item.key as any, Number(e.target.value))}
                      className="w-full range-blood cursor-pointer"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Sweat Stream */}
          <div className="card-sweat p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#EEDFBD]">
              <div className="flex items-center gap-2.5">
                <Droplets className="w-5 h-5 text-[#D9A441]" />
                <h3 className="text-base font-bold font-serif-heading text-[#9C701B]">
                  Epidermal Sweat Sensors Stream
                </h3>
              </div>
              <span className="text-[10px] font-mono-tabular font-bold px-2 py-0.5 rounded bg-white text-[#9C701B] border border-[#EEDFBD]">
                6 Sensors
              </span>
            </div>

            <div className="space-y-3">
              {[
                { key: 'sweat_glucose', label: 'Sweat Glucose Diffusion', unit: 'mg/dL', min: 0.2, max: 7.0, step: 0.1 },
                { key: 'sweat_sodium', label: 'Sweat Sodium (Na+)', unit: 'mmol/L', min: 10, max: 90, step: 1 },
                { key: 'sweat_potassium', label: 'Sweat Potassium (K+)', unit: 'mmol/L', min: 1.0, max: 14.0, step: 0.2 },
                { key: 'sweat_lactate', label: 'Sweat Lactate Flux', unit: 'mmol/L', min: 2.0, max: 35.0, step: 0.5 },
                { key: 'sweat_cortisol', label: 'Sweat Cortisol Surge', unit: 'µg/dL', min: 0.05, max: 2.5, step: 0.05 },
                { key: 'sweat_rate', label: 'Local Excretion Rate', unit: 'mg/cm²/min', min: 0.1, max: 3.0, step: 0.1 }
              ].map(item => {
                const val = (currentData as any)[item.key] ?? item.min;
                const meta = BIOMARKER_RANGES[item.key];
                const status = getFieldStatus(item.key as any);
                return (
                  <div key={item.key} className="p-3 rounded-xl bg-white border border-[#EEDFBD] space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-[#1B2430]">{item.label}</span>
                      <span className={`font-mono-tabular font-bold px-1.5 py-0.2 rounded text-[11px] ${
                        status === 'high' ? 'bg-[#FAF0EE] text-[#B5473A]' : status === 'low' ? 'bg-[#FCF5E8] text-[#9C701B]' : 'bg-[#F3F7F3] text-[#5C8A66]'
                      }`}>
                        {val} {item.unit}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={item.min}
                      max={item.max}
                      step={item.step}
                      value={val}
                      onChange={(e) => updateDataField(item.key as any, Number(e.target.value))}
                      className="w-full range-sweat cursor-pointer"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 5. METHOD 3: WEARABLE SWEAT PATCH LIVE SIMULATOR */}
      {activeMethod === 'sweat_sim' && (
        <div className="card-confluence p-6 bg-[#FCFAF6] border-[#E5DDCE] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EAE2D5]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#D9A441] text-white flex items-center justify-center font-bold">
                <Radio className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-serif-heading text-[#1B2430]">
                  Epidermal Patch Telemetry Simulator
                </h3>
                <p className="text-xs text-[#5A6577]">
                  Simulates microfluidic wearable sensor extraction from the forearm stratum corneum.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 font-mono-tabular text-xs">
              <span className="flex items-center gap-1.5 text-[#5C8A66] font-bold">
                <Wifi className="w-3.5 h-3.5" /> Link: 99.4%
              </span>
              <span className="flex items-center gap-1.5 text-[#1B2430]">
                <BatteryCharging className="w-3.5 h-3.5 text-[#5C8A66]" /> 96%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="card-sweat p-4 space-y-2">
              <span className="text-[10px] text-[#8C8270] uppercase font-bold font-mono-tabular">Real-Time Glucose Lag</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold font-serif-heading text-[#1B2430]">{currentData.sweat_glucose || 1.8}</span>
                <span className="text-xs text-[#9C701B] font-mono-tabular font-bold">mg/dL</span>
              </div>
              <p className="text-[11px] text-[#5A6577]">8-12 min biological diffusion lag behind venous blood.</p>
            </div>

            <div className="card-sweat p-4 space-y-2">
              <span className="text-[10px] text-[#8C8270] uppercase font-bold font-mono-tabular">Na+ / K+ Ionic Ratio</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold font-serif-heading text-[#1B2430]">
                  {((currentData.sweat_sodium || 38) / (currentData.sweat_potassium || 4.8)).toFixed(1)}
                </span>
                <span className="text-xs text-[#9C701B] font-mono-tabular font-bold">Ratio</span>
              </div>
              <p className="text-[11px] text-[#5A6577]">Reflects aldosterone activity and vascular smooth muscle tone.</p>
            </div>

            <div className="card-sweat p-4 space-y-2">
              <span className="text-[10px] text-[#8C8270] uppercase font-bold font-mono-tabular">Lactate & Hypoxia Index</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold font-serif-heading text-[#1B2430]">{currentData.sweat_lactate || 14.2}</span>
                <span className="text-xs text-[#9C701B] font-mono-tabular font-bold">mmol/L</span>
              </div>
              <p className="text-[11px] text-[#5A6577]">Anaerobic sweat gland glycolysis & ischemic alert index.</p>
            </div>
          </div>
        </div>
      )}

      {/* 6. METHOD 4: CLINICAL PRESETS */}
      {activeMethod === 'presets' && (
        <div className="card-confluence p-6 bg-[#FCFAF6] border-[#E5DDCE] space-y-4">
          <div className="border-b border-[#EAE2D5] pb-3">
            <h3 className="text-base font-bold font-serif-heading text-[#1B2430]">
              Validated Clinical Patient Profiles
            </h3>
            <p className="text-xs text-[#5A6577]">
              Load calibrated real-world test cases across metabolic, vascular, and renal phenotypes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {CLINICAL_PRESETS.map(preset => (
              <div
                key={preset.id}
                onClick={() => {
                  loadPreset(preset.id);
                  setActiveMethod('wizard');
                }}
                className="p-4 rounded-xl bg-white hover:bg-[#FAF7F0] border border-[#E5DDCE] hover:border-[#8C3B3B] transition-all cursor-pointer space-y-2 shadow-2xs group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm font-serif-heading text-[#1B2430] group-hover:text-[#8C3B3B]">
                    {preset.name}
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#8C8270] group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-xs text-[#5A6577] leading-relaxed">
                  {preset.description}
                </p>
                <div className="text-[10px] font-mono-tabular text-[#8C3B3B] font-bold pt-1">
                  Click to load into dual-stream intake &rarr;
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. METHOD 5: CSV BATCH UPLOAD */}
      {activeMethod === 'csv' && (
        <div className="card-confluence p-6 bg-[#FCFAF6] border-[#E5DDCE] space-y-6">
          <div className="text-center max-w-lg mx-auto space-y-2">
            <FileSpreadsheet className="w-10 h-10 text-[#8C3B3B] mx-auto" />
            <h3 className="text-lg font-bold font-serif-heading text-[#1B2430]">
              Batch Multimodal Laboratory CSV Ingestion
            </h3>
            <p className="text-xs text-[#5A6577]">
              Upload multi-patient cohorts with matching venous blood & epidermal sweat columns.
            </p>
          </div>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-[#DDD1BE] hover:border-[#8C3B3B] rounded-2xl p-8 text-center cursor-pointer transition-all bg-white hover:bg-[#FAF7F0]"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleCsvUpload}
              accept=".csv"
              className="hidden"
            />
            <Upload className="w-8 h-8 text-[#8C8270] mx-auto mb-2" />
            <span className="text-xs font-bold text-[#1B2430] block font-serif-heading">
              Click to browse or drop patient CSV here
            </span>
            <span className="text-[11px] text-[#8C8270] mt-1 block font-mono-tabular">
              Supported columns: fasting_glucose, hba1c, systolic_bp, sweat_glucose, sweat_sodium, sweat_lactate, etc.
            </span>
          </div>

          {csvStatus.message && (
            <div className={`p-4 rounded-xl text-xs font-mono-tabular ${
              csvStatus.type === 'success' ? 'bg-[#F3F7F3] text-[#29422E] border border-[#CADBCA]' :
              csvStatus.type === 'error' ? 'bg-[#FAF0EE] text-[#B5473A] border border-[#EAC4BE]' :
              'bg-[#FAF7F0] text-[#1B2430] border border-[#E5DDCE]'
            }`}>
              {csvStatus.message}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
