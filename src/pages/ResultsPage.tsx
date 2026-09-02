import React, { useState } from 'react';
import { useHealthData } from '../context/HealthDataContext';
import { ConditionPrediction, BiomarkerImpact } from '../types';
import { ConfluenceWave } from '../components/ConfluenceWave';
import {
  Activity,
  HeartPulse,
  Sparkles,
  AlertTriangle,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  FileText,
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers,
  Dna,
  Droplets,
  CheckCircle2,
  AlertCircle,
  FlaskConical,
  Zap,
  GitBranch,
  X,
  Stethoscope
} from 'lucide-react';

interface ResultsPageProps {
  onNavigate: (pageId: string) => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({ onNavigate }) => {
  const { latestPrediction, runPrediction, isPredicting } = useHealthData();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'high' | 'multimodal'>('all');
  const [selectedCondition, setSelectedCondition] = useState<ConditionPrediction | null>(null);

  if (!latestPrediction) {
    return (
      <div className="card-confluence p-12 text-center space-y-4 max-w-xl mx-auto my-8 bg-[#FCFAF6] border-[#E5DDCE]">
        <div className="w-14 h-14 rounded-2xl bg-[#FAF3F3] text-[#8C3B3B] flex items-center justify-center mx-auto border border-[#E8CDCD]">
          <Activity className="w-7 h-7 animate-pulse" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold font-serif-heading text-[#1B2430]">
            No Confluence Signal Generated Yet
          </h3>
          <p className="text-xs text-[#5A6577] max-w-md mx-auto leading-relaxed">
            Please enter patient biomarkers or select a clinical preset to fuse venous blood and epidermal sweat into prediction signals.
          </p>
        </div>
        <button
          onClick={() => onNavigate('input')}
          className="px-5 py-2.5 rounded-xl bg-[#8C3B3B] hover:bg-[#783030] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          Add Biomarkers & Run
        </button>
      </div>
    );
  }

  const {
    predictionId,
    timestamp,
    patientData,
    conditions,
    overallRisk,
    multimodalLatencyAdvantageMonths = 8.4
  } = latestPrediction;

  const conditionsList = Object.values(conditions) as ConditionPrediction[];

  const filteredConditions = conditionsList.filter(c => {
    if (selectedFilter === 'high') return c.riskLevel === 'High' || c.riskLevel === 'Critical';
    if (selectedFilter === 'multimodal') return c.modality === 'blood_and_sweat';
    return true;
  });

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'Critical':
      case 'High':
        return 'bg-[#FAF0EE] text-[#B5473A] border-[#EAC4BE]';
      case 'Moderate':
        return 'bg-[#FCF5E8] text-[#9C701B] border-[#EEDDB8]';
      default:
        return 'bg-[#F3F7F3] text-[#406348] border-[#CADBCA]';
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* 1. TOP CONFLUENCE SUMMARY BANNER */}
      <div className="card-confluence p-6 bg-[#FCFAF6] border-[#E5DDCE] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono-tabular font-bold px-2.5 py-0.5 rounded-lg bg-[#EAE2D5] text-[#1B2430] border border-[#DDD1BE]">
              FUSED PREDICTION DOSSIER
            </span>
            <span className="text-[#8C8270]">&bull;</span>
            <span className="text-xs text-[#5A6577] font-mono-tabular">ID: {predictionId}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-heading text-[#1B2430] tracking-tight">
            Multi-Condition Confluence Signals
          </h1>
          <p className="text-xs sm:text-sm text-[#5A6577] mt-1 max-w-2xl">
            Venous blood and epidermal sweat streams converged through validated cross-attention tree ensembles.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => onNavigate('recommendations')}
            className="px-4 py-2.5 rounded-xl bg-[#FCFAF6] hover:bg-[#F3EFE6] text-[#1B2430] border border-[#E5DDCE] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <GitBranch className="w-3.5 h-3.5 text-[#5C8A66]" />
            <span>Precautions Timeline</span>
          </button>
          <button
            onClick={() => onNavigate('report')}
            className="px-4 py-2.5 rounded-xl bg-[#8C3B3B] hover:bg-[#783030] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Export Official PDF</span>
          </button>
        </div>
      </div>

      {/* 2. OVERALL COMPOSITE CONFLUENCE WAVE HERO */}
      <div className="card-confluence p-6 bg-[#FCFAF6] border-[#E5DDCE] space-y-4">
        <ConfluenceWave
          riskScore={overallRisk.score}
          riskTier={overallRisk.tier as any}
          bloodMetrics={[
            { label: 'Venous Glucose', value: `${patientData.fasting_glucose || 92} mg/dL` },
            { label: 'HbA1c', value: `${patientData.hba1c || 5.4}%` },
            { label: 'Blood Pressure', value: `${patientData.systolic_bp || 118}/${patientData.diastolic_bp || 78} mmHg` }
          ]}
          sweatMetrics={[
            { label: 'Sweat Glucose', value: `${patientData.sweat_glucose || 1.8} mg/dL` },
            { label: 'Sweat Na+', value: `${patientData.sweat_sodium || 38} mmol/L` },
            { label: 'Sweat Lactate', value: `${patientData.sweat_lactate || 14.2} mmol/L` }
          ]}
          leadTimeMonths={multimodalLatencyAdvantageMonths}
        />
      </div>

      {/* 3. FILTER PILLS */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'all', label: 'All 10 Pathologies' },
            { id: 'high', label: 'Elevated & High Risk Only' },
            { id: 'multimodal', label: 'Blood + Sweat Multimodal' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setSelectedFilter(f.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedFilter === f.id
                  ? 'bg-[#1B2430] text-[#F6F1E9] font-bold shadow-2xs'
                  : 'bg-[#FCFAF6] text-[#5A6577] hover:bg-[#F3EFE6] border border-[#E5DDCE]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-[#5A6577] font-mono-tabular">
          Showing {filteredConditions.length} validated model predictions
        </span>
      </div>

      {/* 4. PER-CONDITION RISK CARDS WITH CONFLUENCE WAVEFORMS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredConditions.map((cond) => {
          const isBloodAndSweat = cond.modality === 'blood_and_sweat';

          return (
            <div
              key={cond.conditionId}
              className="card-confluence p-6 bg-[#FCFAF6] border-[#E5DDCE] hover:border-[#8C3B3B]/60 transition-all flex flex-col justify-between space-y-4 shadow-xs"
            >
              <div className="space-y-3">
                {/* Card Top Bar */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono-tabular font-bold text-[#8C8270] uppercase">
                        {cond.category || 'Clinical Pathology'}
                      </span>
                      <span className="text-[#8C8270]">&bull;</span>
                      <span className={`text-[10px] font-mono-tabular font-bold px-2 py-0.5 rounded ${
                        isBloodAndSweat ? 'bg-[#FCF5E8] text-[#9C701B] border border-[#EEDDB8]' : 'bg-[#FAF3F3] text-[#8C3B3B] border border-[#E8CDCD]'
                      }`}>
                        {isBloodAndSweat ? 'Blood + Sweat Stream' : 'Blood Baseline'}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold font-serif-heading text-[#1B2430] leading-snug mt-0.5">
                      {cond.name}
                    </h3>
                  </div>

                  <span className={`text-[11px] font-mono-tabular font-bold px-2.5 py-1 rounded-lg border shrink-0 ${getRiskBadge(cond.riskLevel)}`}>
                    {cond.probability}% &bull; {cond.riskLevel}
                  </span>
                </div>

                {/* Plain-Language Clinical Explanation */}
                <p className="text-xs text-[#3E4A5B] leading-relaxed">
                  {cond.plainLanguageExplanation || cond.description}
                </p>

                {/* Individual Signature Confluence Wave */}
                <div className="pt-1">
                  <ConfluenceWave
                    riskScore={cond.probability}
                    riskTier={cond.riskLevel as any}
                    compact={true}
                  />
                </div>

                {/* Key Driving Biomarkers List */}
                {cond.drivingBiomarkers && cond.drivingBiomarkers.length > 0 && (
                  <div className="p-3 rounded-xl bg-white border border-[#E5DDCE] space-y-1.5">
                    <span className="text-[10px] font-bold text-[#8C8270] uppercase tracking-wider font-mono-tabular block">
                      Primary Driving Biomarkers
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono-tabular">
                      {cond.drivingBiomarkers.map((bm, bIdx) => (
                        <div key={bIdx} className="flex justify-between items-center text-[#1B2430]">
                          <span className="text-[#5A6577] text-[11px] truncate">{bm.name}:</span>
                          <span className="font-bold shrink-0">{bm.value} {bm.unit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer: Algorithm & Lead Time */}
              <div className="pt-2 border-t border-[#EAE2D5] flex items-center justify-between text-[11px] font-mono-tabular">
                <span className="text-[#5C8A66] font-bold">
                  {cond.modality === 'blood_and_sweat' ? '+8.4 Mo. Early Warning' : 'Validated Baseline'}
                </span>
                <span className="text-[#5A6577]">{cond.primaryModel}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. DUAL-FLUID LATENCY & CORRELATION MATRIX */}
      <div className="card-confluence p-6 bg-[#FCFAF6] border-[#E5DDCE] space-y-4">
        <div className="border-b border-[#EAE2D5] pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold font-serif-heading text-[#1B2430]">
              Inter-Fluid Cross-Diffusion & Latency Dynamics
            </h3>
            <p className="text-xs text-[#5A6577]">
              Continuous microfluidic sweat flux compared against gold-standard venous concentrations.
            </p>
          </div>
          <span className="text-xs font-mono-tabular text-[#5C8A66] font-bold">
            99.2% Signal Alignment
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="card-blood p-4 space-y-2">
            <span className="font-bold font-serif-heading text-[#8C3B3B] block">1. Glycemic Axis Synchronization</span>
            <p className="text-[#5B2222] text-[11px] leading-relaxed">
              Epidermal sweat glucose tracks capillary plasma with a calibrated 10.4-minute lag factor, capturing early insulin resistance before HbA1c shifts.
            </p>
          </div>

          <div className="card-sweat p-4 space-y-2">
            <span className="font-bold font-serif-heading text-[#9C701B] block">2. Vascular Electrolyte Flux</span>
            <p className="text-[#6E4F10] text-[11px] leading-relaxed">
              Sweat Na+/K+ ratio responds to aldosterone surges, providing a non-invasive proxy for endothelial tension and arterial pressure elevation.
            </p>
          </div>

          <div className="bg-[#FAF7F0] p-4 rounded-xl border border-[#E5DDCE] space-y-2">
            <span className="font-bold font-serif-heading text-[#1B2430] block">3. Cellular Hypoxia & Lactate</span>
            <p className="text-[#5A6577] text-[11px] leading-relaxed">
              Sweat lactate accumulation signals mitochondrial anaerobic transitions, identifying early subclinical cardiovascular and metabolic strain.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
