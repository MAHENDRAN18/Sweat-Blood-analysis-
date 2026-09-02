import React from 'react';
import { useHealthData } from '../context/HealthDataContext';
import { LivingRiverTimeline } from '../components/LivingRiverTimeline';
import {
  Sparkles,
  GitBranch,
  FileText,
  Activity,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface RecommendationsPageProps {
  onNavigate: (pageId: string) => void;
}

export const RecommendationsPage: React.FC<RecommendationsPageProps> = ({ onNavigate }) => {
  const { latestPrediction } = useHealthData();

  if (!latestPrediction) {
    return (
      <div className="card-confluence p-12 text-center space-y-4 max-w-xl mx-auto my-8 bg-[#FCFAF6] border-[#E5DDCE]">
        <div className="w-14 h-14 rounded-2xl bg-[#FAF3F3] text-[#8C3B3B] flex items-center justify-center mx-auto border border-[#E8CDCD]">
          <GitBranch className="w-7 h-7 animate-pulse" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold font-serif-heading text-[#1B2430]">
            No Living River Timeline Active
          </h3>
          <p className="text-xs text-[#5A6577] max-w-md mx-auto leading-relaxed">
            Run a dual-stream health assessment to generate an evolving, branching precaution timeline mapped to your biomarker signals.
          </p>
        </div>
        <button
          onClick={() => onNavigate('input')}
          className="px-5 py-2.5 rounded-xl bg-[#8C3B3B] hover:bg-[#783030] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          Enter Patient Biomarkers
        </button>
      </div>
    );
  }

  const { recommendations, overallRisk, patientData } = latestPrediction;

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="card-confluence p-6 bg-[#FCFAF6] border-[#E5DDCE] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono-tabular font-bold px-2.5 py-0.5 rounded-lg bg-[#EAE2D5] text-[#1B2430] border border-[#DDD1BE]">
              EVOLVING CARE STREAM
            </span>
            <span className="text-[#8C8270]">&bull;</span>
            <span className="text-xs text-[#5A6577] font-medium">{recommendations.length} Active Tributaries</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-heading text-[#1B2430] tracking-tight">
            Precautions River Timeline
          </h1>
          <p className="text-xs sm:text-sm text-[#5A6577] mt-1 max-w-2xl">
            A living, branching river of evidence-based dietary, cardiovascular, and electrolyte actions that evolve as new blood and sweat telemetry arrives.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => onNavigate('results')}
            className="px-4 py-2.5 rounded-xl bg-[#FCFAF6] hover:bg-[#F3EFE6] text-[#1B2430] border border-[#E5DDCE] text-xs font-bold transition-all cursor-pointer"
          >
            Disease Signals
          </button>
          <button
            onClick={() => onNavigate('report')}
            className="px-4 py-2.5 rounded-xl bg-[#8C3B3B] hover:bg-[#783030] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Export PDF Dossier</span>
          </button>
        </div>
      </div>

      {/* The Living River Timeline */}
      <LivingRiverTimeline
        recommendations={recommendations}
        patientName={patientData.name || 'Eleanor Vance'}
        onNavigate={onNavigate}
      />
    </div>
  );
};
