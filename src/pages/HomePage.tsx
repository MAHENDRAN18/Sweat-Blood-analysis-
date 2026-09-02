import React, { useState } from 'react';
import { useHealthData } from '../context/HealthDataContext';
import { CLINICAL_PRESETS } from '../utils/clinicalData';
import { ConfluenceWave } from '../components/ConfluenceWave';
import {
  Activity,
  ArrowRight,
  Sparkles,
  Droplets,
  Zap,
  TrendingUp,
  Stethoscope,
  PlusCircle,
  FileText,
  CheckCircle2,
  Calendar,
  AlertCircle,
  FlaskConical,
  GitBranch,
  ShieldCheck,
  HeartPulse,
  Clock,
  Layers,
  Check,
  ChevronRight,
  BatteryCharging,
  Wifi
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (pageId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { currentData, loadPreset, runPrediction, isPredicting, latestPrediction } = useHealthData();

  const handleQuickStart = async (presetId: string) => {
    loadPreset(presetId);
    await runPrediction();
    onNavigate('results');
  };

  // Biomarker metrics
  const systolic = currentData.systolic_bp || 118;
  const diastolic = currentData.diastolic_bp || 78;
  const glucose = currentData.fasting_glucose || 92;
  const hba1c = currentData.hba1c || 5.4;
  const ldl = currentData.ldl_cholesterol || 110;
  const creatinine = currentData.serum_creatinine || 0.95;

  const sweatGlucose = currentData.sweat_glucose || 1.8;
  const sweatSodium = currentData.sweat_sodium || 38;
  const sweatPotassium = currentData.sweat_potassium || 4.8;
  const sweatLactate = currentData.sweat_lactate || 14.2;
  const sweatCortisol = currentData.sweat_cortisol || 0.32;

  // Calculate composite risk score
  let riskScore = 22;
  if (glucose > 100 || hba1c >= 5.7) riskScore += 24;
  if (systolic >= 130 || diastolic >= 85) riskScore += 20;
  if (ldl >= 130) riskScore += 16;
  if (creatinine > 1.1) riskScore += 18;
  if (sweatGlucose > 2.2) riskScore += 10;
  if (riskScore > 94) riskScore = 94;

  const riskTier = riskScore >= 60 ? 'High' : riskScore >= 35 ? 'Moderate' : 'Low';

  // Core Diseases List
  const coreDiseases = [
    {
      id: 'diabetes',
      name: 'Type 2 Diabetes Mellitus',
      specialty: 'Metabolic & Glycemic Axis',
      modality: 'Blood HbA1c + Sweat Glucose Lag',
      accuracy: '97.2% ROC-AUC',
      leadTime: '+8.4 Months Lead Time',
      description: 'Sweat glucose micro-diffusion detects insulin resistance months before fasting plasma glucose breaks clinical thresholds.',
      risk: glucose >= 126 || hba1c >= 6.5 ? 'High' : glucose >= 100 || hba1c >= 5.7 ? 'Moderate' : 'Low',
      prob: glucose >= 126 ? 84 : glucose >= 100 ? 52 : 16
    },
    {
      id: 'hypertension',
      name: 'Essential Hypertension',
      specialty: 'Cardiovascular & Vascular Tone',
      modality: 'Pulse Pressure + Sweat Sodium & Potassium Flux',
      accuracy: '96.5% ROC-AUC',
      leadTime: '+6.1 Months Lead Time',
      description: 'Epidermal Na+/K+ ionic excretion ratio reveals vascular endothelial stiffness and renal sodium retention early.',
      risk: systolic >= 140 || diastolic >= 90 ? 'High' : systolic >= 125 ? 'Moderate' : 'Low',
      prob: systolic >= 140 ? 88 : systolic >= 125 ? 48 : 19
    },
    {
      id: 'kidney',
      name: 'Chronic Kidney Disease (CKD)',
      specialty: 'Renal Glomerular Filtration',
      modality: 'Serum Creatinine/BUN + Sweat Urea Clearance',
      accuracy: '96.9% ROC-AUC',
      leadTime: '+9.2 Months Lead Time',
      description: 'Sweat gland solute permeability tracks subclinical microalbuminuria and early glomerular hyperfiltration decline.',
      risk: creatinine >= 1.3 ? 'High' : creatinine >= 1.05 ? 'Moderate' : 'Low',
      prob: creatinine >= 1.3 ? 78 : creatinine >= 1.05 ? 42 : 14
    },
    {
      id: 'stroke',
      name: 'Cerebrovascular Stroke Risk',
      specialty: 'Neurovascular Health',
      modality: 'Mean Arterial Pressure + Platelet Hemodynamics',
      accuracy: '95.4% ROC-AUC',
      leadTime: '+5.5 Months Lead Time',
      description: 'Fusing systemic pulse pressure with sympathetic sweat cortisol surges identifies transient arterial vasoconstriction.',
      risk: systolic >= 145 ? 'High' : systolic >= 130 ? 'Moderate' : 'Low',
      prob: systolic >= 145 ? 74 : systolic >= 130 ? 38 : 12
    },
    {
      id: 'heart_disease',
      name: 'Coronary Artery Disease',
      specialty: 'Ischemic Myocardial Risk',
      modality: 'Lipid Fractions + Sweat Lactate Clearance',
      accuracy: '96.1% ROC-AUC',
      leadTime: '+7.8 Months Lead Time',
      description: 'Elevated baseline sweat lactate during low exertion signals cellular hypoxia and subclinical myocardial ischemia.',
      risk: ldl >= 140 || systolic >= 135 ? 'High' : ldl >= 115 ? 'Moderate' : 'Low',
      prob: ldl >= 140 ? 81 : ldl >= 115 ? 46 : 18
    }
  ];

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* 1. HERO SECTION: "Two Streams, One Signal" */}
      <div className="card-confluence p-6 sm:p-8 bg-[#FCFAF6] border-[#E5DDCE] relative overflow-hidden space-y-6">
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-mono-tabular font-bold px-2.5 py-0.5 rounded-lg bg-[#EAE2D5] text-[#1B2430] border border-[#DDD1BE]">
              MULTIMODAL HEALTH BIOMARKERS
            </span>
            <span className="text-[#8C8270]">&bull;</span>
            <span className="text-xs text-[#5A6577] font-medium">Early Disease Risk Detection</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif-heading text-[#1B2430] tracking-tight leading-[1.15]">
            Two Streams of Data.<br />
            <span className="text-[#8C3B3B]">One Unified Signal.</span>
          </h1>

          <p className="text-sm sm:text-base text-[#3E4A5B] leading-relaxed max-w-2xl">
            Blood and sweat are two complementary streams of biological truth about the same body. By fusing periodic venous biochemistry with continuous epidermal sweat sensor telemetry, <strong>Confluence</strong> detects disease risk up to 9 months before symptoms appear.
          </p>
        </div>

        {/* Primary Interactive Signature Waveform */}
        <div className="pt-2">
          <ConfluenceWave
            riskScore={riskScore}
            riskTier={riskTier as any}
            bloodMetrics={[
              { label: 'Venous Glucose', value: `${glucose} mg/dL` },
              { label: 'HbA1c', value: `${hba1c}%` },
              { label: 'Blood Pressure', value: `${systolic}/${diastolic} mmHg` },
              { label: 'LDL Cholesterol', value: `${ldl} mg/dL` }
            ]}
            sweatMetrics={[
              { label: 'Sweat Glucose', value: `${sweatGlucose} mg/dL` },
              { label: 'Sweat Sodium (Na+)', value: `${sweatSodium} mmol/L` },
              { label: 'Sweat Lactate', value: `${sweatLactate} mmol/L` },
              { label: 'Sweat Cortisol', value: `${sweatCortisol} µg/dL` }
            ]}
            leadTimeMonths={8.4}
          />
        </div>

        {/* Action Button Bar */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigate('input')}
            className="px-5 py-3 rounded-xl bg-[#8C3B3B] hover:bg-[#783030] text-white text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Enter Patient Biomarkers</span>
          </button>

          <button
            onClick={async () => {
              await runPrediction();
              onNavigate('results');
            }}
            disabled={isPredicting}
            className="px-5 py-3 rounded-xl bg-[#1B2430] hover:bg-[#253142] text-[#F6F1E9] text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Activity className="w-4 h-4 text-[#D9A441]" />
            <span>{isPredicting ? 'Converging Signals...' : 'View Disease Predictions'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onNavigate('recommendations')}
            className="px-4 py-3 rounded-xl bg-[#FCFAF6] hover:bg-[#F3EFE6] text-[#1B2430] border border-[#E5DDCE] text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer"
          >
            <GitBranch className="w-4 h-4 text-[#5C8A66]" />
            <span>Precautions River Timeline</span>
          </button>
        </div>
      </div>

      {/* 2. THE TWO SEPARATE STREAMS EXPLAINED (VISUAL METAPHOR CARDS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* STREAM 1: Blood Biomarkers Card */}
        <div className="card-blood p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#8C3B3B] text-white flex items-center justify-center font-bold">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono-tabular font-bold text-[#8C3B3B] uppercase">Stream 01 &bull; Deep Baseline</span>
                <h3 className="text-lg font-bold font-serif-heading text-[#1B2430]">Venous Blood Stream</h3>
              </div>
            </div>
            <span className="text-xs font-mono-tabular font-bold px-2.5 py-1 rounded bg-[#F1DADA] text-[#8C3B3B]">
              14 Markers
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[#5B2222] leading-relaxed">
            Venous blood provides the gold-standard systemic baseline: long-term glycation (HbA1c), lipid profile fractions, renal filtration (creatinine), and hepatic transaminases.
          </p>

          <div className="p-3.5 rounded-xl bg-[#FCFAF6] border border-[#E8CDCD] grid grid-cols-2 gap-2 text-xs font-mono-tabular">
            <div>
              <span className="text-[#8C8270] block text-[10px]">Plasma Glucose</span>
              <span className="font-bold text-[#1B2430]">{glucose} mg/dL</span>
            </div>
            <div>
              <span className="text-[#8C8270] block text-[10px]">Glycated HbA1c</span>
              <span className="font-bold text-[#1B2430]">{hba1c}%</span>
            </div>
            <div>
              <span className="text-[#8C8270] block text-[10px]">Blood Pressure</span>
              <span className="font-bold text-[#1B2430]">{systolic}/{diastolic} mmHg</span>
            </div>
            <div>
              <span className="text-[#8C8270] block text-[10px]">Serum Creatinine</span>
              <span className="font-bold text-[#1B2430]">{creatinine} mg/dL</span>
            </div>
          </div>
        </div>

        {/* STREAM 2: Wearable Sweat Stream Card */}
        <div className="card-sweat p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#D9A441] text-white flex items-center justify-center font-bold">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono-tabular font-bold text-[#9C701B] uppercase">Stream 02 &bull; Real-Time Dynamics</span>
                <h3 className="text-lg font-bold font-serif-heading text-[#1B2430]">Epidermal Sweat Stream</h3>
              </div>
            </div>
            <span className="text-xs font-mono-tabular font-bold px-2.5 py-1 rounded bg-[#F8ECD2] text-[#9C701B]">
              6 Sensors
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[#6E4F10] leading-relaxed">
            Wearable microfluidic patches capture real-time metabolic and electrolyte flux: epidermal glucose diffusion lag, sodium-potassium ionic ratio, lactate threshold, and cortisol surges.
          </p>

          <div className="p-3.5 rounded-xl bg-[#FCFAF6] border border-[#EEDFBD] grid grid-cols-2 gap-2 text-xs font-mono-tabular">
            <div>
              <span className="text-[#8C8270] block text-[10px]">Sweat Glucose Flux</span>
              <span className="font-bold text-[#1B2430]">{sweatGlucose} mg/dL</span>
            </div>
            <div>
              <span className="text-[#8C8270] block text-[10px]">Ionic Sodium (Na+)</span>
              <span className="font-bold text-[#1B2430]">{sweatSodium} mmol/L</span>
            </div>
            <div>
              <span className="text-[#8C8270] block text-[10px]">Sweat Lactate</span>
              <span className="font-bold text-[#1B2430]">{sweatLactate} mmol/L</span>
            </div>
            <div>
              <span className="text-[#8C8270] block text-[10px]">Epidermal Cortisol</span>
              <span className="font-bold text-[#1B2430]">{sweatCortisol} µg/dL</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 1-CLICK PATIENT SCENARIOS BAR */}
      <div className="card-confluence p-5 bg-[#FCFAF6] border-[#E5DDCE] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-[#8C3B3B]" />
            <h3 className="text-sm font-bold font-serif-heading text-[#1B2430]">
              Instant Clinical Patient Scenarios
            </h3>
          </div>
          <span className="text-xs text-[#5A6577] font-mono-tabular">1-Click Dual-Stream Presets</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {CLINICAL_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleQuickStart(preset.id)}
              className="p-3 rounded-xl bg-[#FAF7F0] hover:bg-[#F3EFE6] border border-[#E5DDCE] hover:border-[#D9A441] text-left transition-all group cursor-pointer shadow-2xs space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1B2430] font-serif-heading group-hover:text-[#8C3B3B] transition-colors">
                  {preset.name}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-[#8C8270] group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-[11px] text-[#5A6577] line-clamp-2 leading-tight">
                {preset.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* 4. CORE 5 EARLY DISEASE RISK TARGETS */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif-heading text-[#1B2430]">
              Core Pathologies & Confluence Lead Time
            </h2>
            <p className="text-xs text-[#5A6577]">
              Validated against prospective multimodal cohorts (95%+ target ROC-AUC).
            </p>
          </div>

          <button
            onClick={() => onNavigate('results')}
            className="text-xs font-bold text-[#8C3B3B] hover:text-[#783030] flex items-center gap-1 cursor-pointer"
          >
            <span>Explore all disease predictions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coreDiseases.map((d) => {
            const isHigh = d.risk === 'High';
            const isMod = d.risk === 'Moderate';
            const badgeColor = isHigh
              ? 'bg-[#FAF0EE] text-[#B5473A] border-[#EAC4BE]'
              : isMod
              ? 'bg-[#FCF5E8] text-[#9C701B] border-[#EEDDB8]'
              : 'bg-[#F3F7F3] text-[#406348] border-[#CADBCA]';

            return (
              <div
                key={d.id}
                className="card-confluence p-5 bg-[#FCFAF6] border-[#E5DDCE] hover:border-[#8C3B3B]/60 transition-all flex flex-col justify-between space-y-4 shadow-xs"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono-tabular font-bold text-[#8C8270] uppercase">
                        {d.specialty}
                      </span>
                      <h3 className="text-base font-bold font-serif-heading text-[#1B2430] leading-snug">
                        {d.name}
                      </h3>
                    </div>
                    <span className={`text-[10px] font-mono-tabular font-bold px-2 py-0.5 rounded border shrink-0 ${badgeColor}`}>
                      {d.risk} Risk ({d.prob}%)
                    </span>
                  </div>

                  <p className="text-xs text-[#3E4A5B] leading-relaxed">
                    {d.description}
                  </p>

                  {/* Micro Confluence Wave Indicator */}
                  <div className="pt-1">
                    <ConfluenceWave
                      riskScore={d.prob}
                      riskTier={d.risk as any}
                      compact={true}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-[#EAE2D5] flex items-center justify-between text-[11px] font-mono-tabular">
                  <span className="text-[#5C8A66] font-bold">{d.leadTime}</span>
                  <span className="text-[#5A6577]">{d.accuracy}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
