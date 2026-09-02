import React, { useState } from 'react';
import { Recommendation } from '../types';
import {
  Utensils,
  Dumbbell,
  Droplets,
  Moon,
  Stethoscope,
  Check,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Plus,
  GitBranch,
  Layers,
  HeartPulse,
  Activity
} from 'lucide-react';

interface LivingRiverTimelineProps {
  recommendations: Recommendation[];
  patientName?: string;
  onNavigate?: (pageId: string) => void;
}

export const LivingRiverTimeline: React.FC<LivingRiverTimelineProps> = ({
  recommendations,
  patientName = 'Eleanor Vance',
  onNavigate
}) => {
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [timelineItems, setTimelineItems] = useState<Recommendation[]>(recommendations);

  const toggleStep = (stepKey: string) => {
    setCompletedSteps(prev => ({
      ...prev,
      [stepKey]: !prev[stepKey]
    }));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Diet & Nutrition': return Utensils;
      case 'Exercise & Fitness': return Dumbbell;
      case 'Hydration & Electrolytes': return Droplets;
      case 'Sleep & Stress': return Moon;
      case 'Clinical Follow-Up': return Stethoscope;
      default: return Sparkles;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Diet & Nutrition': return { border: '#E8CDCD', bg: '#FAF3F3', text: '#8C3B3B', accent: '#8C3B3B' };
      case 'Exercise & Fitness': return { border: '#EEDFBD', bg: '#FCF8EE', text: '#9C701B', accent: '#D9A441' };
      case 'Hydration & Electrolytes': return { border: '#DCE6DC', bg: '#F3F7F3', text: '#406348', accent: '#5C8A66' };
      case 'Sleep & Stress': return { border: '#E5DDCE', bg: '#FAF7F0', text: '#1B2430', accent: '#1B2430' };
      default: return { border: '#E7DFC9', bg: '#FCFAF6', text: '#1B2430', accent: '#8C3B3B' };
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-[#FAF0EE] text-[#B5473A] border-[#EAC4BE]';
      case 'High': return 'bg-[#FCF5E8] text-[#9C701B] border-[#EEDDB8]';
      case 'Moderate': return 'bg-[#F3F7F3] text-[#406348] border-[#CADBCA]';
      default: return 'bg-[#FAF7F0] text-[#5A6577] border-[#E5DDCE]';
    }
  };

  const filteredItems = selectedCategory === 'all'
    ? timelineItems
    : timelineItems.filter(r => r.category === selectedCategory);

  const categories = [
    { id: 'all', label: 'Entire River Timeline', count: timelineItems.length },
    { id: 'Diet & Nutrition', label: 'Glycemic Tributary', count: timelineItems.filter(r => r.category === 'Diet & Nutrition').length },
    { id: 'Exercise & Fitness', label: 'Vascular Tributary', count: timelineItems.filter(r => r.category === 'Exercise & Fitness').length },
    { id: 'Hydration & Electrolytes', label: 'Electrolyte Tributary', count: timelineItems.filter(r => r.category === 'Hydration & Electrolytes').length },
    { id: 'Sleep & Stress', label: 'Cortisol Tributary', count: timelineItems.filter(r => r.category === 'Sleep & Stress').length },
    { id: 'Clinical Follow-Up', label: 'Clinical Follow-Up', count: timelineItems.filter(r => r.category === 'Clinical Follow-Up').length },
  ];

  // Helper date simulator for living timeline
  const getSimulatedDate = (index: number) => {
    const d = new Date();
    d.setDate(d.getDate() - (index * 4));
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* Tributary Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer flex items-center gap-2 ${
              selectedCategory === cat.id
                ? 'bg-[#1B2430] text-[#F6F1E9] shadow-xs'
                : 'bg-[#FCFAF6] text-[#5A6577] hover:bg-[#F3EFE6] border border-[#E5DDCE]'
            }`}
          >
            <span>{cat.label}</span>
            <span className={`text-[10px] font-mono-tabular px-1.5 py-0.2 rounded ${
              selectedCategory === cat.id ? 'bg-[#2D3949] text-[#EAE2D5]' : 'bg-[#EAE2D5] text-[#1B2430]'
            }`}>
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* The River with Branching Tributaries Container */}
      <div className="relative pl-6 sm:pl-10 space-y-8 before:content-[''] before:absolute before:left-3 sm:before:left-5 before:top-4 before:bottom-4 before:w-1 before:bg-gradient-to-b before:from-[#8C3B3B] before:via-[#D9A441] before:to-[#5C8A66] before:rounded-full">
        {filteredItems.map((rec, idx) => {
          const Icon = getCategoryIcon(rec.category);
          const style = getCategoryColor(rec.category);
          const dateStr = getSimulatedDate(idx);
          const isEven = idx % 2 === 0;

          return (
            <div key={rec.id} className="relative group">
              {/* Tributary Branching SVG Connector */}
              <div className="absolute -left-6 sm:-left-10 top-6 flex items-center">
                {/* Main River Node on the Spine */}
                <div
                  className="w-6 h-6 rounded-full border-2 border-[#F6F1E9] shadow-xs flex items-center justify-center z-10 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: style.accent }}
                >
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>

                {/* Tributary Curved Arm Path */}
                <svg className="w-8 sm:w-12 h-6 -ml-1 overflow-visible pointer-events-none" viewBox="0 0 40 24">
                  <path
                    d="M 0 12 C 15 12, 20 12, 40 12"
                    fill="none"
                    stroke={style.accent}
                    strokeWidth="2"
                    strokeDasharray="2 2"
                  />
                </svg>
              </div>

              {/* Branch Card: Floating Precaution Tributary */}
              <div
                className="card-confluence p-5 sm:p-6 transition-all border shadow-xs ml-2 sm:ml-4 space-y-4"
                style={{ borderColor: style.border, backgroundColor: '#FCFAF6' }}
              >
                {/* Branch Top Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs"
                      style={{ backgroundColor: style.bg, color: style.text, border: `1px solid ${style.border}` }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className="text-[11px] font-mono-tabular font-bold uppercase tracking-wider"
                          style={{ color: style.text }}
                        >
                          {rec.category} Tributary
                        </span>
                        <span className="text-[#8C8270]">&bull;</span>
                        <span className="text-xs text-[#5A6577] font-mono-tabular flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#8C8270]" />
                          {dateStr}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold font-serif-heading text-[#1B2430] leading-snug mt-0.5">
                        {rec.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] font-mono-tabular font-bold px-2.5 py-0.5 rounded border ${getPriorityBadge(rec.priority)}`}>
                      {rec.priority} Priority
                    </span>
                  </div>
                </div>

                {/* Plain Language Clinical Narrative */}
                <p className="text-xs sm:text-sm text-[#3E4A5B] leading-relaxed">
                  {rec.description}
                </p>

                {/* Target Conditions Tags */}
                {rec.targetConditions && rec.targetConditions.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-[#8C8270] font-bold uppercase font-mono-tabular">Pathology Targets:</span>
                    {rec.targetConditions.map((tc, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[11px] font-medium px-2.5 py-0.5 rounded-lg bg-[#EAE2D5] text-[#1B2430] border border-[#DDD1BE] font-mono-tabular"
                      >
                        {tc}
                      </span>
                    ))}
                  </div>
                )}

                {/* Step-by-Step Action Tributaries (Checklist) */}
                <div className="space-y-2 pt-2 border-t border-[#EAE2D5]">
                  <span className="text-[11px] font-bold text-[#5A6577] uppercase tracking-wider block font-mono-tabular flex items-center gap-1.5">
                    <GitBranch className="w-3.5 h-3.5 text-[#8C8270]" />
                    Actionable Flow Steps ({rec.actionableSteps.length})
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {rec.actionableSteps.map((step, sIdx) => {
                      const stepKey = `${rec.id}-${sIdx}`;
                      const isDone = !!completedSteps[stepKey];
                      return (
                        <div
                          key={sIdx}
                          onClick={() => toggleStep(stepKey)}
                          className={`p-2.5 rounded-xl border text-xs flex items-start gap-2.5 transition-all cursor-pointer ${
                            isDone
                              ? 'bg-[#F3F7F3] border-[#CADBCA] text-[#29422E]'
                              : 'bg-[#FAF7F0] border-[#E5DDCE] text-[#1B2430] hover:bg-[#F4EFE6]'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border transition-all ${
                            isDone ? 'bg-[#5C8A66] border-[#5C8A66] text-white' : 'border-[#8C8270] bg-white'
                          }`}>
                            {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className={isDone ? 'line-through opacity-70' : 'font-medium'}>
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Confluence Dual-Fluid Rationale */}
                {rec.evolutionNote && (
                  <div className="p-3 rounded-xl bg-[#FAF3F3] border border-[#E8CDCD] text-xs text-[#8C3B3B] flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-[#8C3B3B] shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-serif-heading font-bold text-[#8C3B3B]">Multimodal Convergence Rationale:</strong>{' '}
                      <span className="text-[#5B2222]">{rec.evolutionNote}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
