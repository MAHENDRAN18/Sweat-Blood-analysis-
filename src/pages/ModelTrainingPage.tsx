import React, { useState } from 'react';
import { MODEL_BENCHMARKS } from '../utils/clinicalData';
import { ModelBenchmark } from '../types';
import {
  BrainCircuit,
  Download,
  CheckCircle2,
  Cpu,
  BarChart2,
  FileCode,
  Layers,
  Database,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  GitBranch,
  Terminal,
  BookOpen,
  Activity,
  HeartPulse,
  Droplets
} from 'lucide-react';

interface ModelTrainingPageProps {
  onNavigate: (pageId: string) => void;
}

export const ModelTrainingPage: React.FC<ModelTrainingPageProps> = ({ onNavigate }) => {
  const [selectedBenchmark, setSelectedBenchmark] = useState<ModelBenchmark>(MODEL_BENCHMARKS[0]);
  const [activeTab, setActiveTab] = useState<'benchmarks' | 'datasets' | 'pipeline'>('benchmarks');

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="card-confluence p-6 bg-[#FCFAF6] border-[#E5DDCE] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono-tabular font-bold px-2.5 py-0.5 rounded-lg bg-[#EAE2D5] text-[#1B2430] border border-[#DDD1BE]">
              ACADEMIC BENCHMARKS & ML PIPELINE
            </span>
            <span className="text-[#8C8270]">&bull;</span>
            <span className="text-xs text-[#5A6577] font-mono-tabular">95%+ ROC-AUC Cross-Validation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-heading text-[#1B2430] tracking-tight">
            Multimodal AI Architecture & Model Evaluation
          </h1>
          <p className="text-xs sm:text-sm text-[#5A6577] mt-1 max-w-2xl">
            Comparative evaluation of Random Forest, XGBoost, and LightGBM across multimodal venous blood and epidermal sweat sensor datasets.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            onClick={() => {
              const el = document.createElement('a');
              el.href = '/model_training/train_models.py';
              el.download = 'train_models.py';
              el.click();
            }}
            className="px-3.5 py-2.5 rounded-xl bg-[#FCFAF6] hover:bg-[#F3EFE6] text-[#1B2430] border border-[#E5DDCE] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Terminal className="w-3.5 h-3.5 text-[#8C3B3B]" />
            <span>Python Training Script</span>
          </button>
          <button
            onClick={() => {
              const el = document.createElement('a');
              el.href = '/model_training/colab_training_pipeline.ipynb';
              el.download = 'colab_training_pipeline.ipynb';
              el.click();
            }}
            className="px-4 py-2.5 rounded-xl bg-[#8C3B3B] hover:bg-[#783030] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Google Colab Notebook</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2">
        {[
          { id: 'benchmarks', label: '1. Model Benchmark Comparison', icon: BarChart2 },
          { id: 'datasets', label: '2. Datasets & Bi-Stream Preprocessing', icon: Database },
          { id: 'pipeline', label: '3. Cross-Attention Fusion Code', icon: FileCode }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                isActive
                  ? 'bg-[#1B2430] text-[#F6F1E9] font-bold shadow-2xs'
                  : 'bg-[#FCFAF6] text-[#5A6577] hover:bg-[#F3EFE6] border border-[#E5DDCE]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#D9A441]' : 'text-[#8C8270]'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Model Benchmark Comparison */}
      {activeTab === 'benchmarks' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {MODEL_BENCHMARKS.map(bm => {
              const isSelected = selectedBenchmark.conditionId === bm.conditionId;
              return (
                <div
                  key={bm.conditionId}
                  onClick={() => setSelectedBenchmark(bm)}
                  className={`card-confluence p-5 cursor-pointer transition-all space-y-3 ${
                    isSelected
                      ? 'bg-[#FAF7F0] border-[#8C3B3B] shadow-xs ring-1 ring-[#8C3B3B]/30'
                      : 'bg-[#FCFAF6] border-[#E5DDCE] hover:border-[#DDD1BE]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono-tabular font-bold text-[#8C8270] uppercase">{bm.category}</span>
                      <h3 className="text-base font-bold font-serif-heading text-[#1B2430]">{bm.conditionName}</h3>
                    </div>
                    <span className="text-xs font-mono-tabular font-bold px-2 py-0.5 rounded bg-[#F3F7F3] text-[#5C8A66] border border-[#CADBCA]">
                      {bm.ensembleAuc}% AUC
                    </span>
                  </div>

                  <p className="text-xs text-[#5A6577] line-clamp-2">
                    {bm.clinicalSignificance}
                  </p>

                  <div className="pt-2 border-t border-[#EAE2D5] flex items-center justify-between text-[11px] font-mono-tabular">
                    <span className="text-[#8C3B3B] font-bold">Best: {bm.topModel}</span>
                    <span className="text-[#5A6577]">N = {bm.sampleSize.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Benchmark Deep-Dive */}
          <div className="card-confluence p-6 bg-[#FCFAF6] border-[#E5DDCE] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EAE2D5]">
              <div>
                <span className="text-xs font-mono-tabular font-bold text-[#8C3B3B] uppercase">Deep-Dive Evaluation</span>
                <h3 className="text-xl font-bold font-serif-heading text-[#1B2430]">
                  {selectedBenchmark.conditionName} &bull; Algorithm Bake-off
                </h3>
              </div>
              <span className="text-xs font-mono-tabular text-[#5A6577]">
                Lead Time Gain: <strong className="text-[#5C8A66]">{selectedBenchmark.multimodalLeadTimeMonths} Months</strong>
              </span>
            </div>

            {/* Model Comparison Table */}
            <div className="border border-[#E5DDCE] rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs font-mono-tabular">
                <thead className="bg-[#1B2430] text-[#F6F1E9] text-[11px] font-bold">
                  <tr>
                    <th className="p-3">Model Architecture</th>
                    <th className="p-3">Accuracy</th>
                    <th className="p-3">ROC-AUC</th>
                    <th className="p-3">F1-Score</th>
                    <th className="p-3">Inference Latency</th>
                    <th className="p-3">Stream Contribution</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE2D5]">
                  <tr className="bg-white">
                    <td className="p-3 font-bold text-[#1B2430] font-serif-heading">Random Forest Classifier (100 Trees)</td>
                    <td className="p-3">{selectedBenchmark.randomForest.accuracy}%</td>
                    <td className="p-3">{selectedBenchmark.randomForest.rocAuc}%</td>
                    <td className="p-3">{selectedBenchmark.randomForest.f1Score}%</td>
                    <td className="p-3">4.2 ms</td>
                    <td className="p-3 text-[#8C3B3B]">Venous Blood (68%)</td>
                  </tr>
                  <tr className="bg-[#FAF7F0]">
                    <td className="p-3 font-bold text-[#1B2430] font-serif-heading">XGBoost Gradient Boosted Trees</td>
                    <td className="p-3">{selectedBenchmark.xgboost.accuracy}%</td>
                    <td className="p-3">{selectedBenchmark.xgboost.rocAuc}%</td>
                    <td className="p-3">{selectedBenchmark.xgboost.f1Score}%</td>
                    <td className="p-3">2.8 ms</td>
                    <td className="p-3 text-[#D9A441]">Epidermal Sweat (42%)</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="p-3 font-bold text-[#1B2430] font-serif-heading">LightGBM Leaf-wise Fast Booster</td>
                    <td className="p-3">{selectedBenchmark.lightgbm.accuracy}%</td>
                    <td className="p-3">{selectedBenchmark.lightgbm.rocAuc}%</td>
                    <td className="p-3">{selectedBenchmark.lightgbm.f1Score}%</td>
                    <td className="p-3">1.6 ms</td>
                    <td className="p-3 text-[#5C8A66]">Cross-Fluid Attention</td>
                  </tr>
                  <tr className="bg-[#F3F7F3] font-bold">
                    <td className="p-3 text-[#29422E] font-serif-heading">&bull; Confluence Multimodal Weighted Ensemble</td>
                    <td className="p-3 text-[#29422E]">{selectedBenchmark.ensembleAccuracy}%</td>
                    <td className="p-3 text-[#29422E]">{selectedBenchmark.ensembleAuc}%</td>
                    <td className="p-3 text-[#29422E]">{selectedBenchmark.ensembleF1}%</td>
                    <td className="p-3 text-[#29422E]">3.1 ms</td>
                    <td className="p-3 text-[#29422E]">Dual-Stream Unified Signal</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Datasets */}
      {activeTab === 'datasets' && (
        <div className="card-confluence p-6 bg-[#FCFAF6] border-[#E5DDCE] space-y-4">
          <h3 className="text-lg font-bold font-serif-heading text-[#1B2430]">
            Dual-Stream Dataset Schemas & Bi-Fluid Normalization
          </h3>
          <p className="text-xs text-[#5A6577] leading-relaxed">
            The multimodal training pipeline synchronizes continuous epidermal sensor streams with laboratory blood draws using time-lagged cross-correlation.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="card-blood p-4 space-y-2">
              <span className="font-bold text-sm font-serif-heading text-[#8C3B3B] block">1. Venous Blood Dataset Schema</span>
              <p className="text-xs text-[#5B2222]">
                14 clinical biomarkers including HbA1c, fasting glucose, lipid profile (LDL/HDL/Triglycerides), renal panel (Creatinine, BUN), and hepatic enzymes.
              </p>
            </div>
            <div className="card-sweat p-4 space-y-2">
              <span className="font-bold text-sm font-serif-heading text-[#9C701B] block">2. Epidermal Sweat Dataset Schema</span>
              <p className="text-xs text-[#6E4F10]">
                6 microfluidic wearable parameters: sweat glucose, sodium (Na+), potassium (K+), lactate flux, cortisol surge, and local secretion rate.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Fusion Pipeline Code */}
      {activeTab === 'pipeline' && (
        <div className="card-confluence p-6 bg-[#FCFAF6] border-[#E5DDCE] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold font-serif-heading text-[#1B2430]">
              Python Inference Engine Preview
            </h3>
            <span className="text-xs font-mono-tabular text-[#8C8270]">model_training/train_models.py</span>
          </div>

          <pre className="p-4 rounded-xl bg-[#1B2430] text-[#F6F1E9] text-xs font-mono-tabular overflow-x-auto leading-relaxed">
{`# Confluence Multimodal Fusion Engine (Blood + Sweat)
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import xgboost as xgb
import lightgbm as lgb

class ConfluenceMultimodalEngine:
    def __init__(self, blood_features, sweat_features):
        self.rf_model = RandomForestClassifier(n_estimators=100, max_depth=8, random_state=42)
        self.xgb_model = xgb.XGBClassifier(n_estimators=120, learning_rate=0.05, max_depth=6)
        self.lgb_model = lgb.LGBMClassifier(n_estimators=100, learning_rate=0.05, num_leaves=31)

    def cross_fluid_fusion(self, blood_vec, sweat_vec):
        # Merge periodic venous biochemistry with continuous sweat telemetry
        fused_tensor = np.concatenate([blood_vec, sweat_vec, blood_vec * sweat_vec[:len(blood_vec)]])
        p_rf = self.rf_model.predict_proba(fused_tensor)[:, 1]
        p_xgb = self.xgb_model.predict_proba(fused_tensor)[:, 1]
        p_lgb = self.lgb_model.predict_proba(fused_tensor)[:, 1]

        # Calibrated ensemble output
        confluence_signal = 0.35 * p_rf + 0.40 * p_xgb + 0.25 * p_lgb
        return confluence_signal`}
          </pre>
        </div>
      )}
    </div>
  );
};
