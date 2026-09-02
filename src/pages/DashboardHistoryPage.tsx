import React, { useState } from 'react';
import { useWardChart } from '../context/WardChartContext';
import {
  TrendingUp,
  History,
  Activity,
  Droplets,
  Calendar,
  Bed,
  CheckCircle2,
  AlertTriangle,
  Flame,
  PlusCircle,
  Printer
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts';

interface DashboardHistoryPageProps {
  onNavigate: (pageId: string) => void;
}

export const DashboardHistoryPage: React.FC<DashboardHistoryPageProps> = ({ onNavigate }) => {
  const { selectedPatient, patients, setSelectedPatientId } = useWardChart();

  const patient = selectedPatient;
  const history = patient.history || [];

  const chartData = history.map((h, idx) => ({
    time: h.timeStr || h.dateStr || `T-${idx + 1}`,
    fullTime: h.timestamp,
    systolic: h.systolic_bp,
    diastolic: h.diastolic_bp,
    glucose: h.fasting_glucose,
    sweatGlucose: (h.sweat_glucose || 0.6) * 50, // Scaled for comparison
    sweatLactate: h.sweat_lactate,
    sweatCortisol: h.sweat_cortisol,
    egfr: h.egfr || 90,
    riskScore: h.riskScore || 50,
  }));

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* 1. TOP HEADER */}
      <div className="bg-[#FFFFFF] border-2 border-[#2B4570] rounded-lg p-5 shadow-xs chart-paper flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono-chart uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#2B4570] text-[#FAF6EE]">
              PEN-PLOTTED TRENDS
            </span>
            <span className="text-xs font-mono-chart text-[#556987]">
              {patient.bedNumber} &bull; {patient.name} ({patient.mrn})
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2B4570] font-heading mt-1">
            Longitudinal Bedside Biomarker Progression
          </h1>
          <p className="text-xs text-[#556987] font-mono-chart mt-0.5">
            Pen-ink graph plots of hemodynamics, blood chemistry, and wearable sweat telemetry over time
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#FAF6EE] border border-[#C9D6DE] rounded p-1.5 text-xs font-mono-chart">
            <span className="text-[#556987] font-bold">Bed:</span>
            <select
              value={patient.id}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="bg-transparent font-bold text-[#2B4570] focus:outline-none cursor-pointer"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.bedNumber}: {p.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => onNavigate('submit-readings')}
            className="px-3.5 py-1.5 rounded bg-[#2B4570] hover:bg-[#1D3254] text-[#FAF6EE] text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer font-heading"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Reading</span>
          </button>
        </div>
      </div>

      {/* 2. PLOTTED CHARTS GRID (GRAPH PAPER BACKGROUND) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Blood Pressure Pen Plot */}
        <div className="bg-[#FFFFFF] border-2 border-[#2B4570] rounded-lg p-5 chart-paper shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#D1DCE5] pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#B33A3A]" />
              <h3 className="text-sm font-bold text-[#2B4570] font-heading uppercase">
                Hemodynamics: Systolic &amp; Diastolic BP (mmHg)
              </h3>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-mono-chart">
              <span className="ink-red font-bold">&bull; SBP</span>
              <span className="ink-blue font-bold">&bull; DBP</span>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#D1DCE5" />
                <XAxis dataKey="time" stroke="#556987" fontSize={10} font-family="monospace" />
                <YAxis domain={[50, 180]} stroke="#556987" fontSize={10} font-family="monospace" />
                <ReferenceLine y={140} stroke="#B33A3A" strokeDasharray="3 3" label={{ value: 'SBP Warning 140', fill: '#B33A3A', fontSize: 9 }} />
                <ReferenceLine y={120} stroke="#6B8F71" strokeDasharray="3 3" label={{ value: 'Normal 120', fill: '#6B8F71', fontSize: 9 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FAF6EE',
                    borderColor: '#2B4570',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="systolic"
                  stroke="#B33A3A"
                  strokeWidth={2.5}
                  dot={{ fill: '#B33A3A', r: 3.5 }}
                  name="Systolic BP"
                />
                <Line
                  type="monotone"
                  dataKey="diastolic"
                  stroke="#2B4570"
                  strokeWidth={2}
                  dot={{ fill: '#2B4570', r: 3 }}
                  name="Diastolic BP"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[10px] font-mono-chart text-[#556987] flex justify-between border-t border-[#D1DCE5] pt-1">
            <span>Ref: Normal &lt; 120/80 mmHg</span>
            <span>Target: Maintain below stage 1 hypertension threshold</span>
          </div>
        </div>

        {/* Chart 2: Fasting Blood Glucose Trend */}
        <div className="bg-[#FFFFFF] border-2 border-[#2B4570] rounded-lg p-5 chart-paper shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#D1DCE5] pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2B4570]" />
              <h3 className="text-sm font-bold text-[#2B4570] font-heading uppercase">
                Metabolic: Fasting Blood Glucose (mg/dL)
              </h3>
            </div>
            <span className="text-[11px] font-mono-chart font-bold text-[#2B4570]">
              &bull; Serum Glycemia
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#D1DCE5" />
                <XAxis dataKey="time" stroke="#556987" fontSize={10} />
                <YAxis domain={[60, 200]} stroke="#556987" fontSize={10} />
                <ReferenceLine y={126} stroke="#B33A3A" strokeDasharray="3 3" label={{ value: 'Diabetic 126', fill: '#B33A3A', fontSize: 9 }} />
                <ReferenceLine y={100} stroke="#C98A2B" strokeDasharray="3 3" label={{ value: 'Pre-diabetes 100', fill: '#C98A2B', fontSize: 9 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FAF6EE',
                    borderColor: '#2B4570',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="glucose"
                  stroke="#2B4570"
                  strokeWidth={2.5}
                  dot={{ fill: '#2B4570', r: 3.5 }}
                  name="Fasting Glucose"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[10px] font-mono-chart text-[#556987] flex justify-between border-t border-[#D1DCE5] pt-1">
            <span>Ref: 70 - 99 mg/dL</span>
            <span>Early warning signature when tracking above 110 mg/dL</span>
          </div>
        </div>

        {/* Chart 3: Wearable Sweat Lactate & Cortisol Telemetry */}
        <div className="bg-[#FFFFFF] border-2 border-[#C98A2B] rounded-lg p-5 chart-paper shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#E8DFC9] pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C98A2B]" />
              <h3 className="text-sm font-bold text-[#876527] font-heading uppercase">
                Wearable Sweat Kinetics: Lactate &amp; Cortisol
              </h3>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-mono-chart">
              <span className="text-[#C98A2B] font-bold">&bull; Lactate (mmol/L)</span>
              <span className="text-[#2B4570] font-bold">&bull; Cortisol (ug/dL)</span>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#E8DFC9" />
                <XAxis dataKey="time" stroke="#876527" fontSize={10} />
                <YAxis domain={[0, 4.5]} stroke="#876527" fontSize={10} />
                <ReferenceLine y={2.5} stroke="#B33A3A" strokeDasharray="3 3" label={{ value: 'Lactate Alert 2.5', fill: '#B33A3A', fontSize: 9 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FAF8F2',
                    borderColor: '#C98A2B',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="sweatLactate"
                  stroke="#C98A2B"
                  strokeWidth={2.5}
                  dot={{ fill: '#C98A2B', r: 3.5 }}
                  name="Sweat Lactate"
                />
                <Line
                  type="monotone"
                  dataKey="sweatCortisol"
                  stroke="#2B4570"
                  strokeWidth={2}
                  dot={{ fill: '#2B4570', r: 3 }}
                  name="Sweat Cortisol"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[10px] font-mono-chart text-[#876527] flex justify-between border-t border-[#E8DFC9] pt-1">
            <span>Continuous Wireless Patch Telemetry</span>
            <span>Ref: Lactate &lt; 2.5 mmol/L, Cortisol &lt; 1.5 ug/dL</span>
          </div>
        </div>

        {/* Chart 4: AI Composite Risk Score Trajectory */}
        <div className="bg-[#FFFFFF] border-2 border-[#2B4570] rounded-lg p-5 chart-paper shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#D1DCE5] pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#6B8F71]" />
              <h3 className="text-sm font-bold text-[#2B4570] font-heading uppercase">
                AI Composite Multimodal Risk Trajectory
              </h3>
            </div>
            <span className="text-[11px] font-mono-chart font-bold text-[#2B4570]">
              &bull; Fused Risk Index (0 - 100)
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#D1DCE5" />
                <XAxis dataKey="time" stroke="#556987" fontSize={10} />
                <YAxis domain={[0, 100]} stroke="#556987" fontSize={10} />
                <ReferenceLine y={65} stroke="#B33A3A" strokeDasharray="3 3" label={{ value: 'High Risk 65', fill: '#B33A3A', fontSize: 9 }} />
                <ReferenceLine y={35} stroke="#C98A2B" strokeDasharray="3 3" label={{ value: 'Moderate Risk 35', fill: '#C98A2B', fontSize: 9 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FAF6EE',
                    borderColor: '#2B4570',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="riskScore"
                  stroke="#2B4570"
                  strokeWidth={3}
                  dot={{ fill: '#2B4570', r: 4 }}
                  name="Risk Index"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[10px] font-mono-chart text-[#556987] flex justify-between border-t border-[#D1DCE5] pt-1">
            <span>Machine Learning Ensemble Model</span>
            <span>Combines 10 Pathology Probabilities</span>
          </div>
        </div>
      </div>

      {/* 3. OBSERVATION TIMEPOINTS TABLE */}
      <div className="bg-[#FFFFFF] border-2 border-[#2B4570] rounded-lg p-5 chart-paper shadow-xs">
        <div className="flex items-center justify-between border-b-2 border-[#2B4570] pb-2 mb-3">
          <h3 className="text-base font-bold text-[#2B4570] font-heading uppercase">
            Sequential Bedside Observation History
          </h3>
          <span className="text-xs font-mono-chart text-[#556987]">
            {history.length} Recorded Timepoints
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono-chart border-collapse">
            <thead>
              <tr className="border-b border-[#C9D6DE] text-[#556987] text-[10px] uppercase text-left">
                <th className="py-2 px-2">Timepoint</th>
                <th className="py-2 px-2">Blood Pressure</th>
                <th className="py-2 px-2">Fasting Glucose</th>
                <th className="py-2 px-2">Sweat Lactate</th>
                <th className="py-2 px-2">Sweat Cortisol</th>
                <th className="py-2 px-2">eGFR</th>
                <th className="py-2 px-2 text-right">Risk Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2EAF0]">
              {history.map((h, i) => (
                <tr key={i} className="hover:bg-[#FAF6EE]">
                  <td className="py-2 px-2 font-bold text-[#1E293B]">
                    {h.timestamp || `${h.dateStr} ${h.timeStr}`}
                  </td>
                  <td className={`py-2 px-2 font-bold ${h.systolic_bp >= 140 ? 'ink-red' : 'ink-blue'}`}>
                    {h.systolic_bp}/{h.diastolic_bp} mmHg
                  </td>
                  <td className={`py-2 px-2 font-bold ${h.fasting_glucose >= 126 ? 'ink-red' : 'ink-blue'}`}>
                    {h.fasting_glucose} mg/dL
                  </td>
                  <td className={`py-2 px-2 font-bold ${(h.sweat_lactate || 1.8) >= 2.5 ? 'ink-red' : 'text-[#2B4570]'}`}>
                    {h.sweat_lactate || 1.8} mmol/L
                  </td>
                  <td className="py-2 px-2 text-[#2B4570]">
                    {h.sweat_cortisol || 1.2} ug/dL
                  </td>
                  <td className="py-2 px-2 text-[#2B4570]">
                    {h.egfr || 90} mL/min
                  </td>
                  <td className="py-2 px-2 text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      (h.riskScore || 50) >= 65
                        ? 'bg-[#FDEDEC] text-[#B33A3A]'
                        : (h.riskScore || 50) >= 35
                        ? 'bg-[#FEF5E7] text-[#C98A2B]'
                        : 'bg-[#EAFAF1] text-[#6B8F71]'
                    }`}>
                      {h.riskScore || 50}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
