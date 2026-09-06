import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PatientChartProfile,
  DoctorNotesData,
  PatientHealthData,
  PredictionResponse,
  MedicationTablet,
  PrecautionItem,
  PatientSymptomUpdate,
  DischargeSummary,
  RecoveryStatus,
  UserRole,
  MedicineAlarm,
  PatientNotification,
} from '../types';
import {
  SAMPLE_PATIENTS,
  generateDefaultAlarmsForPatient,
  generateDefaultNotificationsForPatient,
} from '../data/samplePatients';
import { SYSTEM_USERS, UserAccount, getAllUsers, registerNewUser } from '../data/users';
import { calculateComprehensiveRisk } from '../utils/mlEngine';
import { playChimeSound, playAlertSound, speakAlarmText } from '../utils/audioAlarm';

interface WardChartContextType {
  patients: PatientChartProfile[];
  selectedPatientId: string;
  selectedPatient: PatientChartProfile;
  setSelectedPatientId: (id: string) => void;
  currentUserRole: UserRole;
  currentUser: UserAccount;
  setCurrentUserRole: (role: UserRole) => void;
  assignedPatientId: string;
  setAssignedPatientId: (id: string) => void;
  doctorName: string;
  setDoctorName: (name: string) => void;

  // Authentication & Session Guarding
  isLoggedIn: boolean;
  loginAsUser: (username: string) => boolean;
  loginWithCredentials: (usernameOrEmail: string, password?: string) => { success: boolean; error?: string; user?: UserAccount };
  registerAndLogin: (account: { name: string; username: string; email: string; password?: string; role: UserRole; phone?: string; assignedPatientId?: string }) => { success: boolean; error?: string };
  logoutUser: () => void;
  allUsers: UserAccount[];

  // Patient accessibility constraint
  accessiblePatients: PatientChartProfile[];

  // Doctor Actions
  updatePatientPersonalDetails: (patientId: string, details: Partial<PatientChartProfile>) => void;
  updatePatientDiet: (patientId: string, dietaryDirectives: string) => void;
  updateDoctorNotes: (patientId: string, notes: Partial<DoctorNotesData>) => void;
  submitPatientReadings: (patientId: string, newData: Partial<PatientHealthData>) => { success: boolean; prediction: PredictionResponse };
  batchUploadCsvReadings: (patientId: string, csvText: string) => { success: boolean; count: number; message: string };
  submitPatientSymptomUpdate: (
    patientId: string,
    update: Omit<PatientSymptomUpdate, 'id' | 'timestamp' | 'doctorReviewed'>
  ) => void;
  doctorReviewSymptomAndAdjustCare: (
    patientId: string,
    updateId: string,
    review: {
      doctorAnalysis: string;
      doctorActionTaken: string;
      updatedTablets?: MedicationTablet[];
      updatedPrecautions?: PrecautionItem[];
      percentRecovered?: number;
      markFullyRecovered?: boolean;
      doctorNotesUpdate?: Partial<DoctorNotesData>;
    }
  ) => void;
  updatePatientTablets: (patientId: string, tablets: MedicationTablet[], notifyPatient?: boolean) => void;
  updatePatientPrecautions: (patientId: string, precautions: PrecautionItem[], notifyPatient?: boolean) => void;
  dischargePatient: (patientId: string, summary: Partial<DischargeSummary>) => void;
  markPatientFullyRecovered: (patientId: string, notes?: string) => void;

  // Lab Technician Actions
  updatePatientLabReport: (
    patientId: string,
    updatedLabs: Partial<PatientHealthData>,
    technicianNotes?: string
  ) => { success: boolean; prediction: PredictionResponse };

  // Admin Actions
  admitNewPatient: (patient: Partial<PatientChartProfile>) => string;
  deletePatient: (patientId: string) => boolean;

  // Alarms System
  alarms: MedicineAlarm[];
  patientAlarms: MedicineAlarm[];
  toggleAlarm: (alarmId: string) => void;
  acknowledgeAlarm: (alarmId: string) => void;
  snoozeAlarm: (alarmId: string, minutes?: number) => void;
  addCustomAlarm: (alarm: Omit<MedicineAlarm, 'id' | 'status'>) => void;
  testAlarmSound: (type?: 'chime' | 'alert') => void;
  announceAlarmSpeech: (text: string) => void;

  // Notifications System
  notifications: PatientNotification[];
  patientNotifications: PatientNotification[];
  unreadNotificationCount: number;
  addNotification: (notif: Omit<PatientNotification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // Reset
  resetToSampleData: () => void;
}

const STORAGE_KEY_PATIENTS = 'ward_chart_hospital_v4_clean';
const STORAGE_KEY_ACTIVE_USER = 'ward_chart_active_user_id';
const STORAGE_KEY_ALARMS = 'ward_chart_alarms_v4';
const STORAGE_KEY_NOTIFS = 'ward_chart_notifications_v4';
const STORAGE_KEY_IS_LOGGED_IN = 'ward_chart_is_logged_in_v4';

const WardChartContext = createContext<WardChartContextType | undefined>(undefined);

export const WardChartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Authentication status: default to false so app strictly begins at Login Page as required!
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_IS_LOGGED_IN) === 'true';
    } catch (e) {
      return false;
    }
  });

  // Patients storage
  const [patients, setPatients] = useState<PatientChartProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PATIENTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].tablets) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved hospital patients', e);
    }
    return SAMPLE_PATIENTS;
  });

  // Current active user account
  const [currentUser, setCurrentUser] = useState<UserAccount>(() => {
    try {
      const savedUserId = localStorage.getItem(STORAGE_KEY_ACTIVE_USER);
      if (savedUserId) {
        const all = getAllUsers();
        const found = all.find((u) => u.id === savedUserId || u.username === savedUserId);
        if (found) return found;
      }
    } catch (e) {}
    // Default to Doctor
    return SYSTEM_USERS[0];
  });

  // Current selected patient (for viewing in charts / reports)
  const [selectedPatientId, setSelectedPatientIdState] = useState<string>(() => {
    if (currentUser.role === 'patient' && currentUser.assignedPatientId) {
      return currentUser.assignedPatientId;
    }
    return 'patient-01';
  });

  // Alarms storage
  const [alarms, setAlarms] = useState<MedicineAlarm[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ALARMS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    // Generate from initial patients
    return SAMPLE_PATIENTS.flatMap((p) => generateDefaultAlarmsForPatient(p));
  });

  // Notifications storage
  const [notifications, setNotifications] = useState<PatientNotification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_NOTIFS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    // Generate from initial patients
    return SAMPLE_PATIENTS.flatMap((p) => generateDefaultNotificationsForPatient(p));
  });

  const [doctorName, setDoctorName] = useState<string>('Dr. Alexander Wright, MD');

  // Persistence effects
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PATIENTS, JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ACTIVE_USER, currentUser.id);
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ALARMS, JSON.stringify(alarms));
  }, [alarms]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_IS_LOGGED_IN, isLoggedIn ? 'true' : 'false');
  }, [isLoggedIn]);

  // Login handler by username
  const loginAsUser = (username: string): boolean => {
    const users = getAllUsers();
    const user = users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase() || u.id === username
    );
    if (!user) return false;

    setCurrentUser(user);
    setIsLoggedIn(true);
    localStorage.setItem(STORAGE_KEY_IS_LOGGED_IN, 'true');
    localStorage.setItem(STORAGE_KEY_ACTIVE_USER, user.id);

    if (user.role === 'patient' && user.assignedPatientId) {
      setSelectedPatientIdState(user.assignedPatientId);
    } else if (user.role === 'doctor') {
      setDoctorName(user.name);
    }
    playChimeSound();
    return true;
  };

  // Login with credentials verification
  const loginWithCredentials = (
    usernameOrEmail: string,
    password?: string
  ): { success: boolean; error?: string; user?: UserAccount } => {
    const users = getAllUsers();
    const trimmed = usernameOrEmail.trim().toLowerCase();
    const user = users.find(
      (u) =>
        u.username.toLowerCase() === trimmed ||
        u.email.toLowerCase() === trimmed ||
        u.id.toLowerCase() === trimmed
    );

    if (!user) {
      return {
        success: false,
        error: `Login ID or Email "${usernameOrEmail}" was not found. If new, please click "Create Account".`,
      };
    }

    if (password && user.passwordHash) {
      if (user.passwordHash !== password.trim()) {
        return {
          success: false,
          error: 'Incorrect password entered. Please check and try again.',
        };
      }
    }

    setCurrentUser(user);
    setIsLoggedIn(true);
    localStorage.setItem(STORAGE_KEY_IS_LOGGED_IN, 'true');
    localStorage.setItem(STORAGE_KEY_ACTIVE_USER, user.id);

    if (user.role === 'patient' && user.assignedPatientId) {
      setSelectedPatientIdState(user.assignedPatientId);
    } else if (user.role === 'doctor') {
      setDoctorName(user.name);
    }
    playChimeSound();
    return { success: true, user };
  };

  // Create new account and immediately login
  const registerAndLogin = (account: {
    name: string;
    username: string;
    email: string;
    password?: string;
    role: UserRole;
    phone?: string;
    assignedPatientId?: string;
  }): { success: boolean; error?: string } => {
    const existingUsers = getAllUsers();
    if (existingUsers.some((u) => u.username.toLowerCase() === account.username.trim().toLowerCase())) {
      return { success: false, error: `Login ID "${account.username}" is already taken. Please choose another.` };
    }

    const assignedPatId =
      account.role === 'patient'
        ? account.assignedPatientId || `patient-0${((existingUsers.filter((u) => u.role === 'patient').length) % 12) + 1}`
        : undefined;

    const newUser: UserAccount = {
      id: `user_${Date.now()}`,
      username: account.username.trim(),
      name: account.name.trim(),
      email: account.email.trim(),
      passwordHash: account.password?.trim() || 'pass123',
      role: account.role,
      assignedPatientId: assignedPatId,
      phone: account.phone?.trim() || '+1 (555) 000-0000',
      avatar: account.role === 'doctor' ? '👨‍⚕️' : account.role === 'patient' ? '🧑' : '🏢',
      createdAt: new Date().toISOString().split('T')[0],
      friendlyTitle: `${account.role.toUpperCase()} • ${account.name}`,
    };

    registerNewUser(newUser);
    setCurrentUser(newUser);
    setIsLoggedIn(true);
    localStorage.setItem(STORAGE_KEY_IS_LOGGED_IN, 'true');
    localStorage.setItem(STORAGE_KEY_ACTIVE_USER, newUser.id);

    if (newUser.role === 'patient' && newUser.assignedPatientId) {
      setSelectedPatientIdState(newUser.assignedPatientId);
    } else if (newUser.role === 'doctor') {
      setDoctorName(newUser.name);
    }
    playChimeSound();
    return { success: true };
  };

  const logoutUser = () => {
    setIsLoggedIn(false);
    localStorage.removeItem(STORAGE_KEY_IS_LOGGED_IN);
    localStorage.removeItem(STORAGE_KEY_ACTIVE_USER);
    playAlertSound();
  };

  const currentUserRole = currentUser.role;

  const setCurrentUserRole = (role: UserRole) => {
    // Find matching default user for that role
    const matched = SYSTEM_USERS.find((u) => u.role === role) || SYSTEM_USERS[0];
    loginAsUser(matched.username);
  };

  const assignedPatientId = currentUser.assignedPatientId || 'patient-01';

  const setAssignedPatientId = (id: string) => {
    setCurrentUser((prev) => ({
      ...prev,
      assignedPatientId: id,
    }));
    if (currentUserRole === 'patient') {
      setSelectedPatientIdState(id);
    }
  };

  // Enforce access rights:
  // Patient role CAN ONLY see their assigned profile!
  const accessiblePatients =
    currentUserRole === 'patient'
      ? patients.filter((p) => p.id === (currentUser.assignedPatientId || selectedPatientId))
      : patients;

  // Selected patient safely constrained
  const targetId =
    currentUserRole === 'patient' ? currentUser.assignedPatientId || selectedPatientId : selectedPatientId;
  const selectedPatient =
    patients.find((p) => p.id === targetId) ||
    patients.find((p) => p.id === 'patient-01') ||
    patients[0] ||
    SAMPLE_PATIENTS[0];

  const setSelectedPatientId = (id: string) => {
    if (currentUserRole === 'patient') {
      // Patients cannot switch to another patient
      return;
    }
    setSelectedPatientIdState(id);
  };

  // Add Notification Helper
  const addNotification = (notif: Omit<PatientNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: PatientNotification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      timestamp: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    playChimeSound();
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => (n.patientId === selectedPatient.id ? { ...n, read: true } : n))
    );
  };

  // Doctor Notes Update
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

  // Submit Patient Readings
  const submitPatientReadings = (patientId: string, newData: Partial<PatientHealthData>) => {
    let updatedPrediction: PredictionResponse = calculateComprehensiveRisk(selectedPatient.healthData);

    setPatients((prev) =>
      prev.map((p) => {
        if (p.id !== patientId) return p;
        const mergedData: PatientHealthData = {
          ...p.healthData,
          ...newData,
        };

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

  // Batch Upload CSV
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
        message: `Successfully processed and integrated ${appliedCount} clinical timepoint readings into telemetry log.`,
      };
    } catch (err: any) {
      return { success: false, count: 0, message: `Failed to parse CSV: ${err?.message || 'Invalid format'}` };
    }
  };

  // Submit Patient Symptom Update
  const submitPatientSymptomUpdate = (
    patientId: string,
    update: Omit<PatientSymptomUpdate, 'id' | 'timestamp' | 'doctorReviewed'>
  ) => {
    const now = new Date();
    const newEntry: PatientSymptomUpdate = {
      ...update,
      id: `symp-${Date.now()}`,
      timestamp: now.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
      doctorReviewed: false,
    };

    setPatients((prev) =>
      prev.map((p) => {
        if (p.id !== patientId) return p;
        return {
          ...p,
          symptomUpdates: [newEntry, ...p.symptomUpdates],
        };
      })
    );

    // Also update current vitals if reported
    if (update.homeVitals) {
      submitPatientReadings(patientId, {
        ...(update.homeVitals.systolic_bp ? { systolic_bp: update.homeVitals.systolic_bp } : {}),
        ...(update.homeVitals.diastolic_bp ? { diastolic_bp: update.homeVitals.diastolic_bp } : {}),
        ...(update.homeVitals.fasting_glucose ? { fasting_glucose: update.homeVitals.fasting_glucose } : {}),
        ...(update.homeVitals.heart_rate ? { resting_heart_rate: update.homeVitals.heart_rate } : {}),
      });
    }

    addNotification({
      patientId,
      title: 'Symptoms Sent to Attending Doctor',
      message: 'Your symptom update and home vitals have been forwarded to Dr. Alexander Wright, MD for clinical review.',
      type: 'doctor_message',
    });
  };

  // Update Patient Personal Details (Doctor can view and update)
  const updatePatientPersonalDetails = (patientId: string, details: Partial<PatientChartProfile>) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id !== patientId) return p;
        return {
          ...p,
          ...details,
          healthData: {
            ...p.healthData,
            ...(details.name ? { name: details.name } : {}),
            ...(details.age !== undefined ? { age: details.age } : {}),
            ...(details.sex ? { sex: details.sex } : {}),
          },
        };
      })
    );
  };

  // Update Patient Diet Directives
  const updatePatientDiet = (patientId: string, dietaryDirectives: string) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id !== patientId) return p;
        return {
          ...p,
          doctorNotes: {
            ...p.doctorNotes,
            dietaryDirectives,
            timestamp: new Date().toLocaleDateString(),
            authorDoctor: doctorName,
          },
        };
      })
    );

    addNotification({
      patientId,
      title: '🥗 Doctor Updated Your Diet & Nutrition Plan',
      message: `${doctorName} updated your dietary plan: "${dietaryDirectives}". Please check your meal instructions!`,
      type: 'precaution_change',
      doctorName,
    });
  };

  // Update Patient Tablets with automatic Notification to patient
  const updatePatientTablets = (patientId: string, tablets: MedicationTablet[], notifyPatient: boolean = true) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id !== patientId) return p;
        return {
          ...p,
          tablets,
        };
      })
    );

    if (notifyPatient) {
      addNotification({
        patientId,
        title: '🔔 Prescription & Tablet Schedule Updated',
        message: `${doctorName} has modified your medication schedule. Please review your updated tablet times and instructions!`,
        type: 'medication_change',
        doctorName,
      });
    }
  };

  // Update Patient Precautions with automatic Notification to patient
  const updatePatientPrecautions = (
    patientId: string,
    precautions: PrecautionItem[],
    notifyPatient: boolean = true
  ) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id !== patientId) return p;
        return {
          ...p,
          precautionsList: precautions,
        };
      })
    );

    if (notifyPatient) {
      addNotification({
        patientId,
        title: '⚠️ Health Precaution & Diet Directives Updated',
        message: `${doctorName} updated your clinical precautions and dietary rules. Please check your daily precautions list.`,
        type: 'precaution_change',
        doctorName,
      });
    }
  };

  // Doctor Review Symptom and Adjust Care
  const doctorReviewSymptomAndAdjustCare = (
    patientId: string,
    updateId: string,
    review: {
      doctorAnalysis: string;
      doctorActionTaken: string;
      updatedTablets?: MedicationTablet[];
      updatedPrecautions?: PrecautionItem[];
      percentRecovered?: number;
      markFullyRecovered?: boolean;
      doctorNotesUpdate?: Partial<DoctorNotesData>;
    }
  ) => {
    const nowStr = new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    setPatients((prev) =>
      prev.map((p) => {
        if (p.id !== patientId) return p;

        const updatedSymptoms = p.symptomUpdates.map((item) => {
          if (item.id !== updateId) return item;
          return {
            ...item,
            doctorReviewed: true,
            doctorReviewedAt: nowStr,
            doctorAnalysis: review.doctorAnalysis,
            doctorActionTaken: review.doctorActionTaken,
          };
        });

        const nextTablets = review.updatedTablets || p.tablets;
        const nextPrecautions = review.updatedPrecautions || p.precautionsList;

        let nextRecovery = { ...p.recoveryStatus };
        if (review.percentRecovered !== undefined) {
          nextRecovery.percentRecovered = review.percentRecovered;
        }

        let nextPatientStatus = p.patientStatus;

        if (review.markFullyRecovered) {
          nextPatientStatus = 'fully_recovered';
          nextRecovery = {
            ...nextRecovery,
            recoveryStage: 'Fully Recovered',
            percentRecovered: 100,
            isFullyRecovered: true,
            recoveryCertifiedDate: new Date().toISOString().split('T')[0],
            certifyingDoctor: doctorName,
            recoveryNotes:
              'Full clinical and biomarker normalization achieved. Patient medically certified as recovered.',
          };
        }

        const updatedDoctorNotes = review.doctorNotesUpdate
          ? {
              ...p.doctorNotes,
              ...review.doctorNotesUpdate,
              timestamp: nowStr,
              authorDoctor: doctorName,
            }
          : p.doctorNotes;

        return {
          ...p,
          symptomUpdates: updatedSymptoms,
          tablets: nextTablets,
          precautionsList: nextPrecautions,
          recoveryStatus: nextRecovery,
          patientStatus: nextPatientStatus,
          doctorNotes: updatedDoctorNotes,
        };
      })
    );

    // Notify patient of doctor review and care adjustments
    addNotification({
      patientId,
      title: '📋 Doctor Reviewed Your Symptoms & Updated Care Plan',
      message: `${doctorName} analyzed your reported condition: "${review.doctorAnalysis}". Action: ${review.doctorActionTaken}`,
      type: 'doctor_message',
      doctorName,
    });
  };

  // Lab Technician: Update Lab Report
  const updatePatientLabReport = (
    patientId: string,
    updatedLabs: Partial<PatientHealthData>,
    technicianNotes?: string
  ) => {
    let updatedPrediction: PredictionResponse = calculateComprehensiveRisk(selectedPatient.healthData);

    setPatients((prev) =>
      prev.map((p) => {
        if (p.id !== patientId) return p;

        const merged: PatientHealthData = {
          ...p.healthData,
          ...updatedLabs,
        };

        if (updatedLabs.height_cm || updatedLabs.weight_kg) {
          const hM = (updatedLabs.height_cm || merged.height_cm || 170) / 100;
          const wKg = updatedLabs.weight_kg || merged.weight_kg || 70;
          merged.bmi = +(wKg / (hM * hM)).toFixed(1);
        }

        updatedPrediction = calculateComprehensiveRisk(merged);

        const now = new Date();
        const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
        const timestampStr = `${now.toISOString().split('T')[0]} ${timeStr}`;

        const newTimepoint = {
          timestamp: timestampStr,
          dateStr,
          timeStr,
          systolic_bp: merged.systolic_bp,
          diastolic_bp: merged.diastolic_bp,
          fasting_glucose: merged.fasting_glucose,
          sweat_glucose: merged.sweat_glucose,
          sweat_lactate: merged.sweat_lactate,
          sweat_cortisol: merged.sweat_cortisol,
          egfr: merged.egfr,
          riskScore: updatedPrediction.overallRisk.score,
        };

        // Automatically synthesize patient precaution diet and medication plans from predicted diseases
        const highRiskConditions = Object.values(updatedPrediction.conditions).filter(
          (c) => c.probability >= 45
        );
        let nextPrecautions = [...p.precautionsList];
        let nextTablets = [...p.tablets];

        highRiskConditions.forEach((c) => {
          if (c.exactDietPlan) {
            const dietPrecaution: PrecautionItem = {
              id: `prec-diet-${c.conditionId}-${Date.now()}`,
              category: 'Diet & Nutrition',
              directive: `${c.name} (${c.exactDietPlan.dietType}): Target ${c.exactDietPlan.clinicalNutrientFocus}. Hydration: ${c.exactDietPlan.hydrationTarget}. Strictly avoid: ${c.exactDietPlan.strictlyProhibited.slice(0, 3).join(', ')}.`,
              severity: c.riskLevel === 'Critical' ? 'critical' : 'important',
              activeUntilRecovery: true,
              updatedDate: `${dateStr} ${timeStr}`,
              doctorNote: `Meals: (Breakfast) ${c.exactDietPlan.breakfast} | (Lunch) ${c.exactDietPlan.lunch} | (Dinner) ${c.exactDietPlan.dinner}`,
            };
            nextPrecautions = [
              dietPrecaution,
              ...nextPrecautions.filter((item) => !item.id.includes(c.conditionId)),
            ];
          }

          if (c.exactMedications && c.exactMedications.length > 0) {
            c.exactMedications.forEach((m) => {
              const rootName = m.tabletName.split(' ')[0].toLowerCase();
              const existing = nextTablets.find((t) => t.name.toLowerCase().includes(rootName));
              if (!existing) {
                nextTablets.push({
                  id: `tab-auto-${c.conditionId}-${Date.now()}-${Math.random().toString(36).substring(7)}`,
                  name: m.tabletName,
                  dose: m.dose,
                  frequency: m.frequency,
                  route: 'Oral tablet',
                  instructions: `${m.timing} (${m.foodRelation}). ${m.instructions}`,
                  reason: m.clinicalTarget,
                  status: 'active',
                  prescribedDate: `${dateStr} ${timeStr}`,
                  durationNote: 'Administer daily until clinical biomarker normalization',
                  doctorChangeReason: 'Initiated based on multi-organ multimodal lab diagnostics',
                });
              }
            });
          }
        });

        return {
          ...p,
          healthData: merged,
          latestPrediction: updatedPrediction,
          riskScore: updatedPrediction.overallRisk.score,
          riskTier: updatedPrediction.overallRisk.tier as any,
          history: [...p.history, newTimepoint].slice(-15),
          precautionsList: nextPrecautions,
          tablets: nextTablets,
        };
      })
    );

    // Notify patient
    addNotification({
      patientId,
      title: '🔬 Diagnostic Lab Report Updated by Lab Technician',
      message: `Chief Lab Officer Ramesh recorded updated blood and sweat biosensor biomarkers. ML Model Analyzed: ${updatedPrediction.overallRisk.tier} (Risk Score: ${updatedPrediction.overallRisk.score}%). ${technicianNotes ? `Notes: ${technicianNotes}` : ''}`,
      type: 'lab_updated',
    });

    return { success: true, prediction: updatedPrediction };
  };

  // Discharge Patient
  const dischargePatient = (patientId: string, summary: Partial<DischargeSummary>) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id !== patientId) return p;

        const fullSummary: DischargeSummary = {
          isDischarged: true,
          dischargeDate: summary.dischargeDate || new Date().toISOString().split('T')[0],
          dischargingPhysician: doctorName,
          dischargeCondition: summary.dischargeCondition || 'Clinically Stable',
          dischargeVitals: summary.dischargeVitals || {
            bp: `${p.healthData.systolic_bp}/${p.healthData.diastolic_bp} mmHg`,
            glucose: p.healthData.fasting_glucose,
            heartRate: p.healthData.resting_heart_rate || 72,
            spO2: p.healthData.spo2 || 98,
          },
          dischargeDiagnosis: summary.dischargeDiagnosis || p.primaryDiagnosis,
          dischargeInstructions:
            summary.dischargeInstructions ||
            'Patient discharged to home recovery. Adhere strictly to prescribed tablets, check vitals daily, and report any symptoms online via the patient recovery portal.',
          followUpDate:
            summary.followUpDate || `Follow-up in 14 days with ${doctorName} at Outpatient Care Pavilion.`,
          emergencyContactDoctor: 'Ward 4B On-Call: +91 98401 99999',
        };

        return {
          ...p,
          patientStatus: 'discharged',
          dischargeSummary: fullSummary,
          recoveryStatus: {
            ...p.recoveryStatus,
            recoveryStage: 'Discharged - Home Recovery',
            percentRecovered: Math.max(p.recoveryStatus.percentRecovered, 75),
          },
        };
      })
    );

    addNotification({
      patientId,
      title: '🏠 Patient Discharged to Home Recovery',
      message: `You have been safely discharged for home care by ${doctorName}. Follow your daily medication schedule and precaution alarms.`,
      type: 'recovery_update',
      doctorName,
    });
  };

  // Mark Patient Fully Recovered
  const markPatientFullyRecovered = (patientId: string, notes?: string) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id !== patientId) return p;

        const completedTablets: MedicationTablet[] = p.tablets.map((t) => ({
          ...t,
          status: 'completed',
          durationNote: 'Course completed — patient fully recovered.',
        }));

        const maintenancePrecautions: PrecautionItem[] = p.precautionsList.map((prec) => ({
          ...prec,
          activeUntilRecovery: false,
          severity: 'routine',
          doctorNote: 'Health fully restored. Maintain general wellness habits.',
        }));

        return {
          ...p,
          patientStatus: 'fully_recovered',
          tablets: completedTablets,
          precautionsList: maintenancePrecautions,
          recoveryStatus: {
            recoveryStage: 'Fully Recovered',
            percentRecovered: 100,
            isFullyRecovered: true,
            recoveryCertifiedDate: new Date().toISOString().split('T')[0],
            certifyingDoctor: doctorName,
            recoveryNotes:
              notes ||
              'Patient has attained 100% physiological recovery. Biomarkers, vitals, and symptomatology are within normal limits. Medical clearance issued.',
          },
        };
      })
    );

    addNotification({
      patientId,
      title: '🎉 100% Full Medical Recovery Certified!',
      message: `Congratulations! ${doctorName} has certified your 100% complete recovery. Active tablets have concluded successfully.`,
      type: 'recovery_update',
      doctorName,
    });
  };

  // Admin: Admit New Patient
  const admitNewPatient = (newPat: Partial<PatientChartProfile>): string => {
    const id = `patient-${Date.now().toString().slice(-4)}`;
    const bedNumber = newPat.bedNumber || `Bed ${patients.length + 1}`;
    const mrn = newPat.mrn || `MRN-${Math.floor(10000 + Math.random() * 90000)}`;

    const healthData: PatientHealthData = newPat.healthData || {
      name: newPat.name || 'New Patient',
      age: newPat.age || 45,
      sex: newPat.sex || 'male',
      height_cm: 170,
      weight_kg: 70,
      bmi: 24.2,
      systolic_bp: 120,
      diastolic_bp: 80,
      resting_heart_rate: 72,
      spo2: 98,
      fasting_glucose: 95,
      hba1c: 5.4,
      total_cholesterol: 180,
      ldl_cholesterol: 100,
      hdl_cholesterol: 50,
      triglycerides: 120,
      serum_creatinine: 0.9,
      bun: 15,
      egfr: 95,
      sweat_glucose: 0.8,
      sweat_lactate: 1.8,
      sweat_sodium: 42,
      sweat_potassium: 4.5,
      sweat_cortisol: 1.5,
      physical_activity_hours: 2.0,
      smoking_status: 'never',
      alcohol_intake: 'none',
      sleep_hours_per_night: 7.0,
      stress_index: 4,
      hydration_liters_per_day: 2.0,
      daily_fatigue_score: 3,
    };

    const prediction = calculateComprehensiveRisk(healthData);

    const fullProfile: PatientChartProfile = {
      id,
      bedNumber,
      wardWing: newPat.wardWing || 'Cardiometabolic Unit',
      mrn,
      name: newPat.name || 'New Patient',
      age: newPat.age || 45,
      sex: newPat.sex || 'male',
      admissionDate: new Date().toISOString().split('T')[0],
      attendingDoctor: doctorName,
      primaryDiagnosis: newPat.primaryDiagnosis || 'Acute Observation Baseline',
      riskTier: prediction.overallRisk.tier as any,
      riskScore: prediction.overallRisk.score,
      patientStatus: 'inpatient',
      healthData,
      latestPrediction: prediction,
      doctorNotes: {
        id: `note-${id}`,
        patientId: id,
        authorDoctor: doctorName,
        authorTitle: 'Attending Physician',
        timestamp: new Date().toLocaleString(),
        clinicalPrecautions: 'Inpatient observation and continuous vital checks.',
        medicationOrders: 'Standard baseline hydration and inpatient supportive care.',
        dietaryDirectives: 'Hospital balanced meal plan.',
        observationOrders: 'Daily morning metabolic panel and sweat telemetry.',
        physicianSigned: true,
      },
      tablets: [
        {
          id: `tab-${id}-1`,
          name: 'Multivitamin & Electrolytes',
          dose: '1 tablet',
          frequency: 'Once daily (08:00 AM)',
          route: 'Oral tablet',
          instructions: 'Take after breakfast with water.',
          reason: 'Inpatient recovery baseline',
          status: 'active',
          prescribedDate: new Date().toISOString().split('T')[0],
          durationNote: 'Continue throughout admission.',
        },
      ],
      precautionsList: [
        {
          id: `prec-${id}-1`,
          category: 'Blood Pressure & Vitals',
          directive: 'Check blood pressure and heart rate every morning at 07:30 AM.',
          severity: 'important',
          activeUntilRecovery: true,
          updatedDate: new Date().toISOString().split('T')[0],
        },
      ],
      symptomUpdates: [],
      recoveryStatus: {
        recoveryStage: 'Inpatient Intensive',
        percentRecovered: 40,
        isFullyRecovered: false,
        recoveryNotes: 'Newly admitted patient under hospital observation.',
      },
      history: [
        {
          timestamp: `${new Date().toISOString().split('T')[0]} 08:00`,
          dateStr: 'Today',
          timeStr: '08:00',
          systolic_bp: healthData.systolic_bp,
          diastolic_bp: healthData.diastolic_bp,
          fasting_glucose: healthData.fasting_glucose,
          sweat_glucose: healthData.sweat_glucose,
          sweat_lactate: healthData.sweat_lactate,
          sweat_cortisol: healthData.sweat_cortisol,
          egfr: healthData.egfr,
          riskScore: prediction.overallRisk.score,
        },
      ],
    };

    setPatients((prev) => [fullProfile, ...prev]);
    setSelectedPatientIdState(id);

    // Also generate initial alarms and notification
    const patAlarms = generateDefaultAlarmsForPatient(fullProfile);
    setAlarms((prev) => [...prev, ...patAlarms]);

    addNotification({
      patientId: id,
      title: 'Welcome to Hospital Patient Care',
      message: `Admitted under ${doctorName}. Medical monitoring is active.`,
      type: 'doctor_message',
      doctorName,
    });

    return id;
  };

  // Admin: Delete Patient
  const deletePatient = (patientId: string): boolean => {
    if (patients.length <= 1) return false;
    setPatients((prev) => prev.filter((p) => p.id !== patientId));
    setAlarms((prev) => prev.filter((a) => a.patientId !== patientId));
    setNotifications((prev) => prev.filter((n) => n.patientId !== patientId));

    if (selectedPatientId === patientId) {
      const remaining = patients.filter((p) => p.id !== patientId);
      if (remaining.length > 0) {
        setSelectedPatientIdState(remaining[0].id);
      }
    }
    return true;
  };

  // Alarms actions
  const patientAlarms = alarms.filter((a) => a.patientId === selectedPatient.id);

  const toggleAlarm = (alarmId: string) => {
    setAlarms((prev) =>
      prev.map((a) => (a.id === alarmId ? { ...a, enabled: !a.enabled } : a))
    );
  };

  const acknowledgeAlarm = (alarmId: string) => {
    setAlarms((prev) =>
      prev.map((a) =>
        a.id === alarmId
          ? {
              ...a,
              status: 'taken',
              lastAcknowledgedAt: new Date().toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              }),
            }
          : a
      )
    );
    playChimeSound();
  };

  const snoozeAlarm = (alarmId: string, minutes: number = 10) => {
    setAlarms((prev) =>
      prev.map((a) => (a.id === alarmId ? { ...a, status: 'snoozed' } : a))
    );
    playAlertSound();
  };

  const addCustomAlarm = (alarmData: Omit<MedicineAlarm, 'id' | 'status'>) => {
    const newAlarm: MedicineAlarm = {
      ...alarmData,
      id: `alarm-custom-${Date.now()}`,
      status: 'pending',
    };
    setAlarms((prev) => [...prev, newAlarm]);
    playChimeSound();
  };

  const testAlarmSound = (type: 'chime' | 'alert' = 'chime') => {
    if (type === 'alert') {
      playAlertSound();
    } else {
      playChimeSound();
    }
  };

  const announceAlarmSpeech = (text: string) => {
    speakAlarmText(text);
  };

  // Patient notifications
  const patientNotifications = notifications.filter((n) => n.patientId === selectedPatient.id);
  const unreadNotificationCount = patientNotifications.filter((n) => !n.read).length;

  const resetToSampleData = () => {
    setPatients(SAMPLE_PATIENTS);
    setSelectedPatientIdState('patient-01');
    setCurrentUser(SYSTEM_USERS[0]);
    setAlarms(SAMPLE_PATIENTS.flatMap((p) => generateDefaultAlarmsForPatient(p)));
    setNotifications(SAMPLE_PATIENTS.flatMap((p) => generateDefaultNotificationsForPatient(p)));
    localStorage.removeItem(STORAGE_KEY_PATIENTS);
    localStorage.removeItem(STORAGE_KEY_ACTIVE_USER);
    localStorage.removeItem(STORAGE_KEY_ALARMS);
    localStorage.removeItem(STORAGE_KEY_NOTIFS);
  };

  return (
    <WardChartContext.Provider
      value={{
        patients,
        selectedPatientId,
        selectedPatient,
        setSelectedPatientId,
        currentUserRole,
        currentUser,
        setCurrentUserRole,
        assignedPatientId,
        setAssignedPatientId,
        doctorName,
        setDoctorName,

        isLoggedIn,
        loginAsUser,
        loginWithCredentials,
        registerAndLogin,
        logoutUser,
        allUsers: getAllUsers(),
        accessiblePatients,

        updatePatientPersonalDetails,
        updatePatientDiet,
        updateDoctorNotes,
        submitPatientReadings,
        batchUploadCsvReadings,
        submitPatientSymptomUpdate,
        doctorReviewSymptomAndAdjustCare,
        updatePatientTablets,
        updatePatientPrecautions,
        dischargePatient,
        markPatientFullyRecovered,

        updatePatientLabReport,

        admitNewPatient,
        deletePatient,

        alarms,
        patientAlarms,
        toggleAlarm,
        acknowledgeAlarm,
        snoozeAlarm,
        addCustomAlarm,
        testAlarmSound,
        announceAlarmSpeech,

        notifications,
        patientNotifications,
        unreadNotificationCount,
        addNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,

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
