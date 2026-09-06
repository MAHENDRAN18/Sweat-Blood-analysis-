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
  Printer,
  HeartPulse
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
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 via-teal-500 to-red-500" />

        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono-chart uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-800 text-white flex items-center gap-1 shadow-2xs">
              <HeartPulse className="w-3 h-3 text-emerald-300" />
              LONGITUDINAL TELEMETRY
            </span>
            <span className="text-xs font-mono-chart text-slate-500">
              {patient.bedNumber} &bull; {patient.name} ({patient.mrn})
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-emerald-950 font-heading mt-1.5">
            Longitudinal Bedside Biomarker Progression
          </h1>
          <p className="text-xs text-slate-500 font-mono-chart mt-0.5">
            Synchronized clinical trends of hemodynamics, blood chemistry, and wearable sweat telemetry
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-lg p-1.5 text-xs font-mono-chart">
            <span className="text-slate-500 font-bold">Bed:</span>
            <select
              value={patient.id}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="bg-transparent font-bold text-emerald-950 focus:outline-none cursor-pointer"
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
            className="px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer font-heading"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Reading</span>
          </button>
        </div>
      </div>

      {/* 2. PLOTTED CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Blood Pressure Pen Plot */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
              <h3 className="text-sm font-bold text-emerald-950 font-heading uppercase">
                Hemodynamics: Systolic &amp; Diastolic BP (mmHg)
              </h3>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-mono-chart">
              <span className="text-red-700 font-bold">&bull; SBP</span>
              <span className="text-emerald-700 font-bold">&bull; DBP</span>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#E2E8F0" />
                <XAxis dataKey="time" stroke="#64748B" fontSize={10} />
                <YAxis domain={[50, 180]} stroke="#64748B" fontSize={10} />
                <ReferenceLine y={140} stroke="#DC2626" strokeDasharray="3 3" label={{ value: 'SBP Warning 140', fill: '#DC2626', fontSize: 9 }} />
                <ReferenceLine y={120} stroke="#059669" strokeDasharray="3 3" label={{ value: 'Normal 120', fill: '#059669', fontSize: 9 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#CBD5E1',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="systolic"
                  stroke="#DC2626"
                  strokeWidth={2.5}
                  dot={{ fill: '#DC2626', r: 3.5 }}
                  name="Systolic BP"
                />
                <Line
                  type="monotone"
                  dataKey="diastolic"
                  stroke="#047857"
                  strokeWidth={2}
                  dot={{ fill: '#047857', r: 3 }}
                  name="Diastolic BP"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[10px] font-mono-chart text-slate-500 flex justify-between border-t border-slate-100 pt-1.5">
            <span>Ref: Normal &lt; 120/80 mmHg</span>
            <span>Target: Maintain below stage 1 hypertension threshold</span>
          </div>
        </div>

        {/* Chart 2: Fasting Blood Glucose Trend */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <h3 className="text-sm font-bold text-emerald-950 font-heading uppercase">
                Metabolic: Fasting Blood Glucose (mg/dL)
              </h3>
            </div>
            <span className="text-[11px] font-mono-chart font-bold text-emerald-700">
              &bull; Serum Glycemia
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#E2E8F0" />
                <XAxis dataKey="time" stroke="#64748B" fontSize={10} />
                <YAxis domain={[60, 200]} stroke="#64748B" fontSize={10} />
                <ReferenceLine y={126} stroke="#DC2626" strokeDasharray="3 3" label={{ value: 'Diabetic 126', fill: '#DC2626', fontSize: 9 }} />
                <ReferenceLine y={100} stroke="#D97706" strokeDasharray="3 3" label={{ value: 'Pre-diabetes 100', fill: '#D97706', fontSize: 9 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#CBD5E1',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="glucose"
                  stroke="#047857"
                  strokeWidth={2.5}
                  dot={{ fill: '#047857', r: 3.5 }}
                  name="Fasting Glucose"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[10px] font-mono-chart text-slate-500 flex justify-between border-t border-slate-100 pt-1.5">
            <span>Ref: 70 - 99 mg/dL</span>
            <span>Early warning signature when tracking above 110 mg/dL</span>
          </div>
        </div>

        {/* Chart 3: Wearable Sweat Lactate & Cortisol Telemetry */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
              <h3 className="text-sm font-bold text-teal-950 font-heading uppercase">
                Wearable Sweat Kinetics: Lactate &amp; Cortisol
              </h3>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-mono-chart">
              <span className="text-red-700 font-bold">&bull; Lactate (mmol/L)</span>
              <span className="text-teal-800 font-bold">&bull; Cortisol (ug/dL)</span>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#E2E8F0" />
                <XAxis dataKey="time" stroke="#64748B" fontSize={10} />
                <YAxis domain={[0, 4.5]} stroke="#64748B" fontSize={10} />
                <ReferenceLine y={2.5} stroke="#DC2626" strokeDasharray="3 3" label={{ value: 'Lactate Alert 2.5', fill: '#DC2626', fontSize: 9 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#CBD5E1',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="sweatLactate"
                  stroke="#DC2626"
                  strokeWidth={2.5}
                  dot={{ fill: '#DC2626', r: 3.5 }}
                  name="Sweat Lactate"
                />
                <Line
                  type="monotone"
                  dataKey="sweatCortisol"
                  stroke="#0D9488"
                  strokeWidth={2}
                  dot={{ fill: '#0D9488', r: 3 }}
                  name="Sweat Cortisol"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[10px] font-mono-chart text-slate-500 flex justify-between border-t border-slate-100 pt-1.5">
            <span>Continuous Wireless Patch Telemetry</span>
            <span>Ref: Lactate &lt; 2.5 mmol/L, Cortisol &lt; 1.5 ug/dL</span>
          </div>
        </div>

        {/* Chart 4: AI Composite Risk Score Trajectory */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <h3 className="text-sm font-bold text-emerald-950 font-heading uppercase">
                AI Composite Multimodal Risk Trajectory
              </h3>
            </div>
            <span className="text-[11px] font-mono-chart font-bold text-emerald-800">
              &bull; Fused Risk Index (0 - 100)
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#E2E8F0" />
                <XAxis dataKey="time" stroke="#64748B" fontSize={10} />
                <YAxis domain={[0, 100]} stroke="#64748B" fontSize={10} />
                <ReferenceLine y={65} stroke="#DC2626" strokeDasharray="3 3" label={{ value: 'High Risk 65', fill: '#DC2626', fontSize: 9 }} />
                <ReferenceLine y={35} stroke="#D97706" strokeDasharray="3 3" label={{ value: 'Moderate Risk 35', fill: '#D97706', fontSize: 9 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#CBD5E1',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="riskScore"
                  stroke="#059669"
                  strokeWidth={3}
                  dot={{ fill: '#059669', r: 4 }}
                  name="Risk Index"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[10px] font-mono-chart text-slate-500 flex justify-between border-t border-slate-100 pt-1.5">
            <span>Machine Learning Ensemble Model</span>
            <span>Combines 10 Pathology Probabilities</span>
          </div>
        </div>
      </div>

      {/* 3. OBSERVATION TIMEPOINTS TABLE */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 mb-3">
          <h3 className="text-base font-bold text-emerald-950 font-heading uppercase">
            Sequential Bedside Observation History
          </h3>
          <span className="text-xs font-mono-chart text-slate-500">
            {history.length} Recorded Timepoints
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono-chart border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 text-[10px] uppercase text-left">
                <th className="py-2.5 px-3">Timepoint</th>
                <th className="py-2.5 px-3">Blood Pressure</th>
                <th className="py-2.5 px-3">Fasting Glucose</th>
                <th className="py-2.5 px-3">Sweat Lactate</th>
                <th className="py-2.5 px-3">Sweat Cortisol</th>
                <th className="py-2.5 px-3">eGFR</th>
                <th className="py-2.5 px-3 text-right">Risk Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.map((h, i) => (
                <tr key={i} className="hover:bg-slate-50/80">
                  <td className="py-2.5 px-3 font-bold text-slate-900">
                    {h.timestamp || `${h.dateStr} ${h.timeStr}`}
                  </td>
                  <td className={`py-2.5 px-3 font-bold ${h.systolic_bp >= 140 ? 'text-red-700' : 'text-emerald-800'}`}>
                    {h.systolic_bp}/{h.diastolic_bp} mmHg
                  </td>
                  <td className={`py-2.5 px-3 font-bold ${h.fasting_glucose >= 126 ? 'text-red-700' : 'text-emerald-800'}`}>
                    {h.fasting_glucose} mg/dL
                  </td>
                  <td className={`py-2.5 px-3 font-bold ${(h.sweat_lactate || 1.8) >= 2.5 ? 'text-red-700' : 'text-teal-900'}`}>
                    {h.sweat_lactate || 1.8} mmol/L
                  </td>
                  <td className="py-2.5 px-3 text-teal-900">
                    {h.sweat_cortisol || 1.2} ug/dL
                  </td>
                  <td className="py-2.5 px-3 text-slate-800">
                    {h.egfr || 90} mL/min
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      (h.riskScore || 50) >= 65
                        ? 'bg-red-100 text-red-800'
                        : (h.riskScore || 50) >= 35
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
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
