import React, { createContext, useContext, useState, useEffect } from 'react';
import { PatientHealthData, PredictionResponse, AssessmentHistoryItem } from '../types';
import { CLINICAL_PRESETS } from '../utils/clinicalData';
import { runMultimodalHealthAssessment } from '../services/predictionEngine';

interface HealthDataContextType {
  currentData: PatientHealthData;
  setCurrentData: React.Dispatch<React.SetStateAction<PatientHealthData>>;
  updateDataField: <K extends keyof PatientHealthData>(field: K, value: PatientHealthData[K]) => void;
  latestPrediction: PredictionResponse | null;
  history: AssessmentHistoryItem[];
  isPredicting: boolean;
  loadPreset: (presetId: string) => void;
  runPrediction: (customData?: PatientHealthData) => Promise<PredictionResponse>;
  loadHistoricalAssessment: (id: string) => void;
  deleteHistoricalAssessment: (id: string) => void;
  clearHistory: () => void;
  batchPredictCsv: (csvText: string) => Promise<{ success: boolean; count: number; message: string }>;
}

const STORAGE_KEY_HISTORY = 'health_ai_assessment_history';
const STORAGE_KEY_LATEST = 'health_ai_latest_prediction';

const HealthDataContext = createContext<HealthDataContextType | undefined>(undefined);

export const HealthDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to the first preset (Healthy Adult) or Early Diabetic
  const [currentData, setCurrentData] = useState<PatientHealthData>(CLINICAL_PRESETS[1].data);
  const [latestPrediction, setLatestPrediction] = useState<PredictionResponse | null>(null);
  const [history, setHistory] = useState<AssessmentHistoryItem[]>([]);
  const [isPredicting, setIsPredicting] = useState<boolean>(false);

  // Initialize data and run initial assessment
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      } else {
        // Generate baseline seeded history for longitudinal analysis
        const sampleHistory: AssessmentHistoryItem[] = [
          {
            id: 'hist_1',
            timestamp: new Date(Date.now() - 180 * 24 * 3600 * 1000).toISOString(),
            patientName: 'Eleanor Vance',
            age: 51,
            sex: 'female',
            overallScore: 68,
            overallTier: 'High Risk',
            topRiskConditions: [
              { name: 'Type 2 Diabetes Mellitus', probability: 78, riskLevel: 'High' },
              { name: 'Metabolic Syndrome', probability: 74, riskLevel: 'High' },
              { name: 'Hypertension', probability: 58, riskLevel: 'High' }
            ],
            abnormalBiomarkersCount: 6
          },
          {
            id: 'hist_2',
            timestamp: new Date(Date.now() - 90 * 24 * 3600 * 1000).toISOString(),
            patientName: 'Eleanor Vance',
            age: 52,
            sex: 'female',
            overallScore: 59,
            overallTier: 'High Risk',
            topRiskConditions: [
              { name: 'Type 2 Diabetes Mellitus', probability: 68, riskLevel: 'High' },
              { name: 'Metabolic Syndrome', probability: 64, riskLevel: 'High' },
              { name: 'Hypertension', probability: 48, riskLevel: 'Moderate' }
            ],
            abnormalBiomarkersCount: 4
          },
          {
            id: 'hist_3',
            timestamp: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
            patientName: 'Eleanor Vance',
            age: 52,
            sex: 'female',
            overallScore: 51,
            overallTier: 'Moderate Risk',
            topRiskConditions: [
              { name: 'Type 2 Diabetes Mellitus', probability: 56, riskLevel: 'High' },
              { name: 'Metabolic Syndrome', probability: 52, riskLevel: 'High' },
              { name: 'Hypertension', probability: 42, riskLevel: 'Moderate' }
            ],
            abnormalBiomarkersCount: 3
          }
        ];
        setHistory(sampleHistory);
        localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(sampleHistory));
      }

      const savedLatest = localStorage.getItem(STORAGE_KEY_LATEST);
      if (savedLatest) {
        setLatestPrediction(JSON.parse(savedLatest));
      } else {
        // Run initial evaluation
        const initialPred = runMultimodalHealthAssessment(CLINICAL_PRESETS[1].data);
        setLatestPrediction(initialPred);
        localStorage.setItem(STORAGE_KEY_LATEST, JSON.stringify(initialPred));
      }
    } catch (e) {
      console.error('Initialization error in HealthDataProvider', e);
    }
  }, []);

  const updateDataField = <K extends keyof PatientHealthData>(field: K, value: PatientHealthData[K]) => {
    setCurrentData(prev => {
      const next = { ...prev, [field]: value };
      // Auto-compute BMI if height or weight changes
      if (field === 'height_cm' || field === 'weight_kg') {
        const hM = (field === 'height_cm' ? (value as number) : next.height_cm) / 100;
        const wKg = field === 'weight_kg' ? (value as number) : next.weight_kg;
        if (hM > 0 && wKg > 0) {
          next.bmi = +(wKg / (hM * hM)).toFixed(1);
        }
      }
      return next;
    });
  };

  const loadPreset = (presetId: string) => {
    const preset = CLINICAL_PRESETS.find(p => p.id === presetId);
    if (preset) {
      setCurrentData({ ...preset.data });
      // Auto-run evaluation for instant feedback
      const pred = runMultimodalHealthAssessment(preset.data);
      setLatestPrediction(pred);
      localStorage.setItem(STORAGE_KEY_LATEST, JSON.stringify(pred));
    }
  };

  const runPrediction = async (customData?: PatientHealthData): Promise<PredictionResponse> => {
    setIsPredicting(true);
    const dataToPredict = customData || currentData;

    try {
      // Attempt backend API call first
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToPredict)
      });

      let pred: PredictionResponse;
      if (res.ok) {
        pred = await res.json();
      } else {
        pred = runMultimodalHealthAssessment(dataToPredict);
      }

      setLatestPrediction(pred);
      localStorage.setItem(STORAGE_KEY_LATEST, JSON.stringify(pred));

      // Append to historical log
      const topConditions = Object.values(pred.conditions)
        .sort((a, b) => b.probability - a.probability)
        .slice(0, 3)
        .map(c => ({ name: c.name, probability: c.probability, riskLevel: c.riskLevel }));

      const historyItem: AssessmentHistoryItem = {
        id: pred.predictionId,
        timestamp: pred.timestamp,
        patientName: pred.patientData.name || 'Patient Assessment',
        age: pred.patientData.age,
        sex: pred.patientData.sex,
        overallScore: pred.overallRisk.score,
        overallTier: pred.overallRisk.tier,
        topRiskConditions: topConditions,
        abnormalBiomarkersCount: pred.overallRisk.abnormalBiomarkersCount,
        rawPrediction: pred
      };

      setHistory(prev => {
        const next = [historyItem, ...prev.filter(h => h.id !== pred.predictionId)].slice(0, 30);
        localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(next));
        return next;
      });

      return pred;
    } catch (e) {
      const pred = runMultimodalHealthAssessment(dataToPredict);
      setLatestPrediction(pred);
      return pred;
    } finally {
      setIsPredicting(false);
    }
  };

  const loadHistoricalAssessment = (id: string) => {
    const item = history.find(h => h.id === id);
    if (item && item.rawPrediction) {
      setLatestPrediction(item.rawPrediction);
      setCurrentData(item.rawPrediction.patientData);
    }
  };

  const deleteHistoricalAssessment = (id: string) => {
    setHistory(prev => {
      const next = prev.filter(h => h.id !== id);
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(next));
      return next;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY_HISTORY);
  };

  const batchPredictCsv = async (csvText: string) => {
    try {
      const lines = csvText.trim().split('\n');
      if (lines.length < 2) {
        return { success: false, count: 0, message: 'CSV file must have a header and at least one data row.' };
      }

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/[\s"-]/g, '_'));
      let processed = 0;

      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const values = lines[i].split(',').map(v => v.trim());
        const rowData: any = { ...CLINICAL_PRESETS[0].data };

        headers.forEach((h, idx) => {
          const val = values[idx];
          if (val !== undefined && val !== '') {
            if (!isNaN(Number(val))) {
              rowData[h] = Number(val);
            } else if (val.toLowerCase() === 'true' || val.toLowerCase() === 'false') {
              rowData[h] = val.toLowerCase() === 'true';
            } else {
              rowData[h] = val;
            }
          }
        });

        const pred = runMultimodalHealthAssessment(rowData);
        if (i === 1) {
          setCurrentData(rowData);
          setLatestPrediction(pred);
        }

        const topConditions = Object.values(pred.conditions)
          .sort((a, b) => b.probability - a.probability)
          .slice(0, 3)
          .map(c => ({ name: c.name, probability: c.probability, riskLevel: c.riskLevel }));

        const histItem: AssessmentHistoryItem = {
          id: 'csv_' + Date.now() + '_' + i,
          timestamp: new Date().toISOString(),
          patientName: rowData.name || `Batch Patient #${i}`,
          age: rowData.age || 45,
          sex: rowData.sex || 'other',
          overallScore: pred.overallRisk.score,
          overallTier: pred.overallRisk.tier,
          topRiskConditions: topConditions,
          abnormalBiomarkersCount: pred.overallRisk.abnormalBiomarkersCount,
          rawPrediction: pred
        };

        setHistory(prev => [histItem, ...prev]);
        processed++;
      }

      return {
        success: true,
        count: processed,
        message: `Successfully processed and scored ${processed} patient records from CSV.`
      };
    } catch (err) {
      return {
        success: false,
        count: 0,
        message: 'Failed to parse CSV format. Please ensure comma-separated columns.'
      };
    }
  };

  return (
    <HealthDataContext.Provider
      value={{
        currentData,
        setCurrentData,
        updateDataField,
        latestPrediction,
        history,
        isPredicting,
        loadPreset,
        runPrediction,
        loadHistoricalAssessment,
        deleteHistoricalAssessment,
        clearHistory,
        batchPredictCsv
      }}
    >
      {children}
    </HealthDataContext.Provider>
  );
};

export const useHealthData = () => {
  const context = useContext(HealthDataContext);
  if (!context) {
    throw new Error('useHealthData must be used within a HealthDataProvider');
  }
  return context;
};
