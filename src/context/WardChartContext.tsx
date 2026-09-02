import React, { createContext, useContext, useState, useEffect } from 'react';
import { PatientChartProfile, DoctorNotesData, PatientHealthData, PredictionResponse } from '../types';
import { SAMPLE_PATIENTS } from '../data/samplePatients';
import { calculateComprehensiveRisk } from '../utils/mlEngine';

interface WardChartContextType {
  patients: PatientChartProfile[];
  selectedPatientId: string;
  selectedPatient: PatientChartProfile;
  setSelectedPatientId: (id: string) => void;
  currentUserRole: 'doctor' | 'patient';
  setCurrentUserRole: (role: 'doctor' | 'patient') => void;
  assignedPatientId: string;
  setAssignedPatientId: (id: string) => void;
  doctorName: string;
  setDoctorName: (name: string) => void;
  updateDoctorNotes: (patientId: string, notes: Partial<DoctorNotesData>) => void;
  submitPatientReadings: (patientId: string, newData: Partial<PatientHealthData>) => { success: boolean; prediction: PredictionResponse };
  batchUploadCsvReadings: (patientId: string, csvText: string) => { success: boolean; count: number; message: string };
  admitNewPatient: (patient: Partial<PatientChartProfile>) => string;
  resetToSampleData: () => void;
}

const STORAGE_KEY_PATIENTS = 'ward_chart_patients_v1';
const STORAGE_KEY_ROLE = 'ward_chart_active_role';
const STORAGE_KEY_SELECTED_PATIENT = 'ward_chart_selected_patient_id';
const STORAGE_KEY_ASSIGNED_PATIENT = 'ward_chart_assigned_patient_id';

const WardChartContext = createContext<WardChartContextType | undefined>(undefined);

export const WardChartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<PatientChartProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PATIENTS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse saved patients', e);
    }
    return SAMPLE_PATIENTS;
  });

  const [currentUserRole, setCurrentUserRoleState] = useState<'doctor' | 'patient'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ROLE);
      if (saved === 'doctor' || saved === 'patient') return saved;
    } catch (e) {}
    return 'doctor';
  });

  const [selectedPatientId, setSelectedPatientIdState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SELECTED_PATIENT);
      if (saved) return saved;
    } catch (e) {}
    return 'patient-01';
  });

  const [assignedPatientId, setAssignedPatientIdState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ASSIGNED_PATIENT);
      if (saved) return saved;
    } catch (e) {}
    return 'patient-01';
  });

  const [doctorName, setDoctorName] = useState<string>('Dr. Alistair Ross, MD');

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PATIENTS, JSON.stringify(patients));
  }, [patients]);

  const setCurrentUserRole = (role: 'doctor' | 'patient') => {
    setCurrentUserRoleState(role);
    localStorage.setItem(STORAGE_KEY_ROLE, role);
    if (role === 'patient') {
      setSelectedPatientIdState(assignedPatientId);
      localStorage.setItem(STORAGE_KEY_SELECTED_PATIENT, assignedPatientId);
    }
  };

  const setSelectedPatientId = (id: string) => {
    setSelectedPatientIdState(id);
    localStorage.setItem(STORAGE_KEY_SELECTED_PATIENT, id);
  };

  const setAssignedPatientId = (id: string) => {
    setAssignedPatientIdState(id);
    localStorage.setItem(STORAGE_KEY_ASSIGNED_PATIENT, id);
    if (currentUserRole === 'patient') {
      setSelectedPatientIdState(id);
      localStorage.setItem(STORAGE_KEY_SELECTED_PATIENT, id);
    }
  };

  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || patients[0] || SAMPLE_PATIENTS[0];

  const updateDoctorNotes = (patientId: string, updatedNotes: Partial<DoctorNotesData>) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id !== patientId) return p;
        const newNotes: DoctorNotesData = {
          ...p.doctorNotes,
          ...updatedNotes,
          timestamp: new Date().toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          }),
          authorDoctor: doctorName,
          physicianSigned: true,
        };
        return {
          ...p,
          doctorNotes: newNotes,
        };
      })
    );
  };

  const submitPatientReadings = (patientId: string, newData: Partial<PatientHealthData>) => {
    let updatedPrediction: PredictionResponse = calculateComprehensiveRisk(selectedPatient.healthData);

    setPatients((prev) =>
      prev.map((p) => {
        if (p.id !== patientId) return p;
        const mergedData: PatientHealthData = {
          ...p.healthData,
          ...newData,
        };

        // Recalculate BMI if height or weight is updated
        if (newData.height_cm || newData.weight_kg) {
          const hM = (newData.height_cm || mergedData.height_cm || 170) / 100;
          const wKg = newData.weight_kg || mergedData.weight_kg || 70;
          mergedData.bmi = +(wKg / (hM * hM)).toFixed(1);
        }

        updatedPrediction = calculateComprehensiveRisk(mergedData);

        const now = new Date();
        const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
        const timestampStr = `${now.toISOString().split('T')[0]} ${timeStr}`;

        const newTimepoint = {
          timestamp: timestampStr,
          dateStr,
          timeStr,
          systolic_bp: mergedData.systolic_bp,
          diastolic_bp: mergedData.diastolic_bp,
          fasting_glucose: mergedData.fasting_glucose,
          sweat_glucose: mergedData.sweat_glucose,
          sweat_lactate: mergedData.sweat_lactate,
          sweat_cortisol: mergedData.sweat_cortisol,
          egfr: mergedData.egfr,
          riskScore: updatedPrediction.overallRisk.score,
        };

        const updatedHistory = [...p.history, newTimepoint].slice(-15);

        return {
          ...p,
          healthData: mergedData,
          latestPrediction: updatedPrediction,
          riskScore: updatedPrediction.overallRisk.score,
          riskTier: updatedPrediction.overallRisk.tier as any,
          history: updatedHistory,
        };
      })
    );

    return { success: true, prediction: updatedPrediction };
  };

  const batchUploadCsvReadings = (patientId: string, csvText: string) => {
    try {
      const lines = csvText.trim().split('\n');
      if (lines.length < 2) {
        return { success: false, count: 0, message: 'CSV requires a header and at least one data row.' };
      }

      const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/[\s"-]/g, '_'));
      let appliedCount = 0;

      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const vals = lines[i].split(',').map((v) => v.trim());
        const rowData: any = {};

        headers.forEach((h, idx) => {
          const v = vals[idx];
          if (v !== undefined && v !== '') {
            if (!isNaN(Number(v))) {
              rowData[h] = Number(v);
            } else if (v.toLowerCase() === 'true' || v.toLowerCase() === 'false') {
              rowData[h] = v.toLowerCase() === 'true';
            } else {
              rowData[h] = v;
            }
          }
        });

        if (Object.keys(rowData).length > 0) {
          submitPatientReadings(patientId, rowData);
          appliedCount++;
        }
      }

      return {
        success: true,
        count: appliedCount,
        message: `Successfully loaded ${appliedCount} sequential readings from CSV into patient chart.`,
      };
    } catch (e: any) {
      return {
        success: false,
        count: 0,
        message: `Failed to parse CSV: ${e?.message || 'Unknown format'}`,
      };
    }
  };

  const admitNewPatient = (newPatientData: Partial<PatientChartProfile>) => {
    const bedIdx = patients.length + 1;
    const bedNum = newPatientData.bedNumber || `Bed ${bedIdx < 10 ? '0' + bedIdx : bedIdx}`;
    const mrnNum = newPatientData.mrn || `MRN-${Math.floor(10000 + Math.random() * 90000)}`;
    const newId = `patient-${Date.now()}`;

    const defaultHealthData: PatientHealthData = {
      name: newPatientData.name || 'New Inpatient',
      age: newPatientData.age || 50,
      sex: newPatientData.sex || 'male',
      systolic_bp: newPatientData.healthData?.systolic_bp || 125,
      diastolic_bp: newPatientData.healthData?.diastolic_bp || 80,
      bmi: newPatientData.healthData?.bmi || 24.5,
      fasting_glucose: newPatientData.healthData?.fasting_glucose || 95,
      hba1c: newPatientData.healthData?.hba1c || 5.4,
      serum_creatinine: newPatientData.healthData?.serum_creatinine || 0.9,
      total_cholesterol: newPatientData.healthData?.total_cholesterol || 185,
      ldl_cholesterol: newPatientData.healthData?.ldl_cholesterol || 105,
      hdl_cholesterol: newPatientData.healthData?.hdl_cholesterol || 55,
      triglycerides: newPatientData.healthData?.triglycerides || 120,
      sweat_glucose: newPatientData.healthData?.sweat_glucose || 0.6,
      sweat_lactate: newPatientData.healthData?.sweat_lactate || 1.6,
      sweat_sodium: newPatientData.healthData?.sweat_sodium || 42,
      sweat_cortisol: newPatientData.healthData?.sweat_cortisol || 1.3,
      ...newPatientData.healthData,
    };

    const prediction = calculateComprehensiveRisk(defaultHealthData);

    const fullPatient: PatientChartProfile = {
      id: newId,
      bedNumber: bedNum,
      wardWing: newPatientData.wardWing || 'General Medical Inpatient Unit',
      mrn: mrnNum,
      name: newPatientData.name || 'New Inpatient',
      age: newPatientData.age || 50,
      sex: newPatientData.sex || 'male',
      admissionDate: new Date().toISOString().split('T')[0],
      attendingDoctor: doctorName,
      primaryDiagnosis: newPatientData.primaryDiagnosis || 'Observation & Biomarker Evaluation',
      riskTier: prediction.overallRisk.tier as any,
      riskScore: prediction.overallRisk.score,
      healthData: defaultHealthData,
      latestPrediction: prediction,
      doctorNotes: {
        id: `note-${Date.now()}`,
        patientId: newId,
        authorDoctor: doctorName,
        authorTitle: 'Attending Physician',
        timestamp: new Date().toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }),
        clinicalPrecautions: 'Initial observation protocol. Monitor blood pressure and continuous sweat patch telemetry q6h.',
        medicationOrders: 'Standard baseline hydration. Routine vitals monitoring.',
        dietaryDirectives: 'Standard hospital cardiac/wellness meal plan.',
        observationOrders: 'Daily laboratory check and sweat patch recalibration.',
        physicianSigned: true,
      },
      history: [
        {
          timestamp: `${new Date().toISOString().split('T')[0]} 08:00`,
          dateStr: 'Today',
          timeStr: '08:00',
          systolic_bp: defaultHealthData.systolic_bp,
          diastolic_bp: defaultHealthData.diastolic_bp,
          fasting_glucose: defaultHealthData.fasting_glucose,
          sweat_glucose: defaultHealthData.sweat_glucose,
          sweat_lactate: defaultHealthData.sweat_lactate,
          sweat_cortisol: defaultHealthData.sweat_cortisol,
          egfr: defaultHealthData.egfr || 90,
          riskScore: prediction.overallRisk.score,
        },
      ],
    };

    setPatients((prev) => [fullPatient, ...prev]);
    setSelectedPatientIdState(newId);
    return newId;
  };

  const resetToSampleData = () => {
    setPatients(SAMPLE_PATIENTS);
    setSelectedPatientIdState('patient-01');
    setAssignedPatientIdState('patient-01');
    localStorage.removeItem(STORAGE_KEY_PATIENTS);
  };

  return (
    <WardChartContext.Provider
      value={{
        patients,
        selectedPatientId,
        selectedPatient,
        setSelectedPatientId,
        currentUserRole,
        setCurrentUserRole,
        assignedPatientId,
        setAssignedPatientId,
        doctorName,
        setDoctorName,
        updateDoctorNotes,
        submitPatientReadings,
        batchUploadCsvReadings,
        admitNewPatient,
        resetToSampleData,
      }}
    >
      {children}
    </WardChartContext.Provider>
  );
};

export const useWardChart = () => {
  const context = useContext(WardChartContext);
  if (!context) {
    throw new Error('useWardChart must be used within a WardChartProvider');
  }
  return context;
};
