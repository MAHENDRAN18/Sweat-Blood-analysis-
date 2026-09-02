import React from 'react';
import { Activity, Droplets, Sparkles, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ConfluenceWaveProps {
  riskScore: number;
  riskTier?: 'Low' | 'Moderate' | 'High' | 'Critical';
  bloodMetrics?: { label: string; value: string | number }[];
  sweatMetrics?: { label: string; value: string | number }[];
  compact?: boolean;
  animated?: boolean;
  leadTimeMonths?: number;
}

export const ConfluenceWave: React.FC<ConfluenceWaveProps> = ({
  riskScore = 24,
  riskTier = 'Low',
  bloodMetrics = [
    { label: 'Venous Glucose', value: '92 mg/dL' },
    { label: 'HbA1c', value: '5.4%' },
    { label: 'BP Systolic', value: '118 mmHg' }
  ],
  sweatMetrics = [
    { label: 'Sweat Glucose', value: '1.8 mg/dL' },
    { label: 'Sweat Na+', value: '38 mmol/L' },
    { label: 'Sweat Lactate', value: '14.2 mmol/L' }
  ],
  compact = false,
  animated = true,
  leadTimeMonths = 9
}) => {
  // Determine merged wave color based on risk tier
  let mergedColor = '#5C8A66'; // Sage Green (Low)
  let mergedGlow = 'rgba(92, 138, 102, 0.25)';
  let tierLabel = 'Low Risk';

  if (riskTier === 'High' || riskTier === 'Critical' || riskScore >= 60) {
    mergedColor = '#B5473A'; // Clay Red (High)
    mergedGlow = 'rgba(181, 71, 58, 0.25)';
    tierLabel = 'Elevated Risk';
  } else if (riskTier === 'Moderate' || riskScore >= 35) {
    mergedColor = '#D9A441'; // Warm Amber (Moderate)
    mergedGlow = 'rgba(217, 164, 65, 0.25)';
    tierLabel = 'Moderate Risk';
  }

  // Calculate waveform amplitude variations depending on risk
  const waveJitter = riskScore > 50 ? 8 : 4;

  if (compact) {
    return (
      <div className="w-full bg-[#FAF7F0] p-3 rounded-xl border border-[#E5DDCE] space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 font-semibold text-[#8C3B3B]">
              <span className="w-2 h-2 rounded-full bg-[#8C3B3B]" />
              Blood
            </span>
            <span className="text-[#8C8270]">+</span>
            <span className="flex items-center gap-1 font-semibold text-[#D9A441]">
              <span className="w-2 h-2 rounded-full bg-[#D9A441]" />
              Sweat
            </span>
            <span className="text-[#8C8270]">&rarr;</span>
            <span className="font-bold text-[#1B2430] font-serif-heading">Confluence</span>
          </div>
          <span
            className="font-mono-tabular font-bold px-2 py-0.5 rounded text-[10px]"
            style={{ backgroundColor: `${mergedColor}18`, color: mergedColor, border: `1px solid ${mergedColor}40` }}
          >
            {riskScore}/100 ({tierLabel})
          </span>
        </div>

        {/* Compact SVG Wave Convergence */}
        <div className="h-14 w-full relative">
          <svg viewBox="0 0 400 60" className="w-full h-full overflow-visible" preserveAspectRatio="none">
            {/* Background Grid Lines */}
            <line x1="0" y1="30" x2="400" y2="30" stroke="#E5DDCE" strokeWidth="1" strokeDasharray="3 3" />
            
            {/* Stream 1: Blood Wave (Maroon) */}
            <path
              d="M 0 15 Q 40 5, 80 15 T 160 15 Q 180 18, 200 30"
              fill="none"
              stroke="#8C3B3B"
              strokeWidth="2.5"
              strokeLinecap="round"
              className={animated ? 'animate-wave-flow' : ''}
            />

            {/* Stream 2: Sweat Wave (Amber) */}
            <path
              d="M 0 45 Q 40 55, 80 45 T 160 45 Q 180 42, 200 30"
              fill="none"
              stroke="#D9A441"
              strokeWidth="2.5"
              strokeLinecap="round"
              className={animated ? 'animate-wave-flow' : ''}
            />

            {/* Merged Confluence Waveform (Converged Signal) */}
            <path
              d="M 200 30 Q 220 18, 240 30 T 280 30 Q 300 20, 320 30 T 360 30 L 400 30"
              fill="none"
              stroke={mergedColor}
              strokeWidth="3.5"
              strokeLinecap="round"
              filter="drop-shadow(0 2px 4px rgba(27,36,48,0.15))"
            />

            {/* Confluence Convergence Pulse Node */}
            <circle cx="200" cy="30" r="5" fill="#1B2430" stroke="#F6F1E9" strokeWidth="2" className="animate-pulse-confluence" />
            <circle cx="200" cy="30" r="2" fill={mergedColor} />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FAF7F0] p-4 sm:p-5 rounded-2xl border border-[#E5DDCE] shadow-xs space-y-4">
      {/* Header with Metaphor Explanation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#EADFCF]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold font-mono-tabular px-2.5 py-0.5 rounded bg-[#EAE2D5] text-[#1B2430] border border-[#DDD1BE]">
              MULTIMODAL SIGNAL CONFLUENCE
            </span>
            <span className="text-[#8C8270] text-xs">&bull;</span>
            <span className="text-xs text-[#5A6577] font-medium">Two Biomarker Streams &rarr; One Risk Signal</span>
          </div>
          <h4 className="text-base sm:text-lg font-bold font-serif-heading text-[#1B2430] mt-0.5">
            The Confluence Waveform
          </h4>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right font-mono-tabular">
            <span className="text-[10px] text-[#8C8270] block uppercase font-bold">Fused Prediction</span>
            <span className="text-base font-extrabold" style={{ color: mergedColor }}>
              {riskScore}/100 &bull; {tierLabel}
            </span>
          </div>
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xs font-bold text-sm"
            style={{ backgroundColor: mergedColor }}
          >
            {riskScore}%
          </div>
        </div>
      </div>

      {/* Main Interactive Confluence Waveform Canvas */}
      <div className="relative py-2">
        <div className="h-32 sm:h-36 w-full relative">
          <svg viewBox="0 0 800 140" className="w-full h-full overflow-visible" preserveAspectRatio="none">
            <defs>
              <linearGradient id="bloodGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8C3B3B" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#8C3B3B" stopOpacity="1" />
              </linearGradient>

              <linearGradient id="sweatGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#D9A441" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#D9A441" stopOpacity="1" />
              </linearGradient>

              <linearGradient id="confluenceGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1B2430" />
                <stop offset="30%" stopColor={mergedColor} />
                <stop offset="100%" stopColor={mergedColor} />
              </linearGradient>
            </defs>

            {/* Background Grid Lines & Markings */}
            <line x1="0" y1="70" x2="800" y2="70" stroke="#E5DDCE" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="400" y1="10" x2="400" y2="130" stroke="#DED5C5" strokeWidth="1" strokeDasharray="2 2" />

            {/* STREAM 1: Blood Biomarker Wave (Muted Maroon) */}
            <path
              d="M 0 35 Q 50 15, 100 35 T 200 35 Q 250 15, 300 35 T 380 45 Q 395 55, 400 70"
              fill="none"
              stroke="url(#bloodGradient)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* STREAM 2: Sweat Biomarker Wave (Warm Amber) */}
            <path
              d="M 0 105 Q 50 125, 100 105 T 200 105 Q 250 125, 300 105 T 380 95 Q 395 85, 400 70"
              fill="none"
              stroke="url(#sweatGradient)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* STREAM 3: MERGED CONFLUENCE SIGNAL (Sage / Clay / Amber) */}
            <path
              d={`M 400 70 Q 430 ${70 - waveJitter * 2}, 460 70 T 520 70 Q 550 ${70 + waveJitter * 3}, 580 70 T 640 70 Q 670 ${70 - waveJitter * 2.5}, 700 70 T 760 70 L 800 70`}
              fill="none"
              stroke="url(#confluenceGradient)"
              strokeWidth="4.5"
              strokeLinecap="round"
              filter="drop-shadow(0 3px 6px rgba(27,36,48,0.18))"
            />

            {/* Confluence Convergence Junction Circle */}
            <circle cx="400" cy="70" r="9" fill="#1B2430" stroke="#F6F1E9" strokeWidth="3" className="animate-pulse-confluence" />
            <circle cx="400" cy="70" r="4" fill={mergedColor} />

            {/* Labels on SVG */}
            <text x="12" y="24" fill="#8C3B3B" fontSize="11" fontWeight="700" fontFamily="Fraunces, serif">
              &bull; Blood Biomarker Stream
            </text>
            <text x="12" y="125" fill="#D9A441" fontSize="11" fontWeight="700" fontFamily="Fraunces, serif">
              &bull; Wearable Sweat Stream
            </text>
            <text x="420" y="55" fill={mergedColor} fontSize="12" fontWeight="800" fontFamily="Fraunces, serif">
              &bull; Fused Confluence Signal ({tierLabel})
            </text>
          </svg>
        </div>
      </div>

      {/* Dual Stream Data Pillars Below Wave */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
        {/* Blood Stream Pillar */}
        <div className="card-blood p-3 space-y-2">
          <div className="flex items-center justify-between text-xs pb-1.5 border-b border-[#E8CDCD]">
            <span className="font-bold text-[#8C3B3B] font-serif-heading flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#8C3B3B]" />
              Venous Blood Ingestion
            </span>
            <span className="text-[10px] text-[#8C3B3B] font-mono-tabular font-bold">14 Markers</span>
          </div>
          <div className="space-y-1 text-xs font-mono-tabular">
            {bloodMetrics.slice(0, 3).map((m, i) => (
              <div key={i} className="flex items-center justify-between text-[#1B2430]">
                <span className="text-[#5A6577] text-[11px]">{m.label}:</span>
                <span className="font-bold">{m.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sweat Stream Pillar */}
        <div className="card-sweat p-3 space-y-2">
          <div className="flex items-center justify-between text-xs pb-1.5 border-b border-[#EEDFBD]">
            <span className="font-bold text-[#9C701B] font-serif-heading flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#D9A441]" />
              Epidermal Sweat Stream
            </span>
            <span className="text-[10px] text-[#9C701B] font-mono-tabular font-bold">6 Sensors</span>
          </div>
          <div className="space-y-1 text-xs font-mono-tabular">
            {sweatMetrics.slice(0, 3).map((m, i) => (
              <div key={i} className="flex items-center justify-between text-[#1B2430]">
                <span className="text-[#5A6577] text-[11px]">{m.label}:</span>
                <span className="font-bold">{m.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Multimodal Confluence Synergy Pillar */}
        <div className="bg-[#FAF7F0] p-3 rounded-xl border border-[#E5DDCE] space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs pb-1.5 border-b border-[#E5DDCE]">
            <span className="font-bold text-[#1B2430] font-serif-heading flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#5C8A66]" />
              Confluence Advantage
            </span>
            <span className="text-[10px] font-mono-tabular font-bold text-[#5C8A66]">
              +{leadTimeMonths} Mo. Lead
            </span>
          </div>
          <p className="text-[11px] text-[#5A6577] leading-tight">
            Fusing venous biochemistry with continuous sweat flux captures inter-fluid latency, detecting metabolic and vascular strain earlier than static blood panels alone.
          </p>
        </div>
      </div>
    </div>
  );
};
