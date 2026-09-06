export type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Critical';

export type OrganSystemCategory =
  | 'cardiovascular'
  | 'renal'
  | 'neurological'
  | 'respiratory'
  | 'hepatic'
  | 'hematological'
  | 'endocrine'
  | 'metabolic'
  | 'musculoskeletal';

export interface ExactMedicationPlan {
  tabletName: string;
  dose: string;
  route: string;
  frequency: string;
  timing: string;
  foodRelation: string;
  clinicalTarget: string;
  instructions: string;
}

export interface ExactDietPlan {
  dietType: string;
  breakfast: string;
  lunch: string;
  eveningSnack: string;
  dinner: string;
  hydrationTarget: string;
  strictlyProhibited: string[];
  recommendedFoods: string[];
  clinicalNutrientFocus: string;
}

export interface PatientHealthData {
  // Patient Demographics & Body Metrics
  name?: string;
  age: number;
  sex: 'male' | 'female' | 'other';
  height_cm?: number;
  weight_kg?: number;
  bmi: number;
  waist_circumference_cm?: number;

  // 1. Cardiovascular Biomarkers & Vitals
  systolic_bp: number;
  diastolic_bp: number;
  heart_rate?: number;
  resting_heart_rate?: number;
  total_cholesterol?: number; // mg/dL
  hdl_cholesterol?: number; // mg/dL
  ldl_cholesterol?: number; // mg/dL
  triglycerides?: number; // mg/dL
  troponin_i?: number; // ng/mL (cardiac injury marker)

  // 2. Renal Biomarkers
  serum_creatinine: number; // mg/dL
  bun?: number; // Blood Urea Nitrogen mg/dL
  blood_urea_nitrogen?: number;
  egfr?: number; // mL/min/1.73m2
  urine_albumin?: number; // mg/L or mg/g
  urine_protein?: number; // mg/dL
  serum_sodium?: number; // mmol/L
  serum_potassium?: number; // mmol/L

  // 3. Brain & Neurological Inputs
  previous_stroke_tia?: boolean;
  stress_index?: number; // 1-10
  cognitive_symptoms?: boolean;

  // 4. Lungs & Respiratory Inputs
  spo2?: number; // %
  respiratory_rate?: number; // breaths/min
  temperature_c?: number; // °C

  // 5. Liver Biomarkers
  alt?: number; // Alanine Aminotransferase U/L
  alt_liver?: number;
  ast?: number; // Aspartate Aminotransferase U/L
  total_bilirubin?: number; // mg/dL
  direct_bilirubin?: number; // mg/dL
  albumin?: number; // g/dL
  alp?: number; // Alkaline Phosphatase U/L

  // 6. Blood & Hematology Biomarkers
  hemoglobin?: number; // g/dL
  hematocrit?: number; // %
  rbc_count?: number; // 10^6 / uL
  wbc_count?: number; // 10^3 / uL
  platelet_count?: number; // 10^3 / uL
  ferritin?: number; // ng/mL
  serum_iron?: number; // µg/dL
  vitamin_b12?: number; // pg/mL
  pt_inr?: number; // Prothrombin Time / INR ratio
  d_dimer?: number; // ng/mL

  // 7. Thyroid & Endocrine
  tsh?: number; // Thyroid Stimulating Hormone uIU/mL
  free_t3?: number; // pg/mL
  free_t4?: number; // ng/dL

  // 8. Pancreas & Metabolic Biomarkers
  fasting_glucose: number; // mg/dL
  random_glucose?: number; // mg/dL
  hba1c: number; // %
  insulin_fasting?: number; // uIU/mL
  fasting_insulin?: number;

  // 9. Musculoskeletal Biomarkers
  serum_lactate?: number; // mmol/L
  ck_total?: number; // U/L (Creatine Kinase / CPK)

  // Sweat-Based Dynamic Biomarkers (Multimodal Biofluid Channel)
  sweat_glucose?: number; // mg/dL (tracks micro-glycemic flux non-invasively)
  sweat_lactate?: number; // mmol/L (early anaerobic threshold & metabolic fatigue marker)
  sweat_sodium?: number; // mmol/L (hydration deficit & salt homeostasis)
  sweat_potassium?: number; // mmol/L (cellular electrolyte balance & muscle recovery)
  sweat_chloride?: number; // mmol/L (CFTR integrity & ion reabsorption)
  sweat_cortisol?: number; // µg/dL (continuous diurnal stress biomarker)
  sweat_ph?: number; // pH scale (4.5 - 7.5)
  sweat_rate?: number; // mg/cm²/min

  // Lifestyle & Behavioral Factors
  physical_activity_hours?: number; // hours/week
  smoking_status?: 'never' | 'former' | 'current';
  alcohol_intake?: 'none' | 'moderate' | 'heavy';
  sleep_hours_per_night?: number;
  hydration_liters_per_day?: number;
  daily_fatigue_score?: number; // 1-10

  // Clinical & Family History
  family_history_diabetes?: boolean;
  family_history_heart_disease?: boolean;
  family_history_hypertension?: boolean;
}

export interface BiomarkerImpact {
  name: string;
  key: string;
  value: number;
  unit: string;
  normalRange?: string;
  status?: 'low' | 'normal' | 'high' | 'critical';
  impactPercent?: number; // Feature contribution
  clinicalMeaning?: string;
  biofluidSource?: 'Blood' | 'Sweat' | 'Vital Sign';
}

export interface ConditionPrediction {
  conditionId: string;
  name: string;
  category?: string;
  modality?: 'blood_and_sweat' | 'blood_only' | string;
  multimodalType?: 'True Multimodal (Blood + Sweat)' | 'Blood-Dominant + Sweat Stress' | 'Blood-Only (Enzyme/Immunoassay)' | 'Blood-Only';
  isCoreCritical?: boolean;
  corePriority?: number;
  riskLevel: RiskLevel;
  probability: number; // 0 - 100
  confidence?: number; // 0 - 100
  primaryModel?: 'Random Forest' | 'XGBoost' | 'LightGBM' | string;
  drivingBiomarkers: BiomarkerImpact[];
  clinicalSummary?: string;
  plainLanguageExplanation?: string;
  description?: string;
  earlyWarningSigns?: string[];
  recommendedAction?: string;
  leadTimeWarning?: string;
  organSystem?: OrganSystemCategory;
  organSystemName?: string;
  exactMedications?: ExactMedicationPlan[];
  exactDietPlan?: ExactDietPlan;
}

export interface OverallHealthRisk {
  score: number; // 0 - 100
  tier: 'Low Risk' | 'Moderate Risk' | 'High Risk' | 'Critical Health Alert' | string;
  color?: string;
  summary?: string;
  abnormalBiomarkersCount?: number;
  highRiskConditionsCount?: number;
  metabolicSyndromeCriteriaMet?: number;
  systemHealthScores?: {
    cardiovascular?: number;
    metabolic?: number;
    renal?: number;
    hepatic?: number;
    hematologic?: number;
    endocrine?: number;
  };
}

export interface Recommendation {
  id: string;
  timestamp?: string;
  category: 'Diet & Nutrition' | 'Exercise & Fitness' | 'Hydration & Electrolytes' | 'Sleep & Stress' | 'Clinical Follow-Up' | 'Diet & Glycemic Control' | 'Cardiovascular & Sodium Balance' | 'Hydration & Renal Protection' | 'Sleep & Stress Architecture' | string;
  title: string;
  priority: 'Critical' | 'High' | 'Moderate' | 'Routine';
  status?: 'New' | 'Active' | 'Updated' | 'Escalated' | 'Resolved' | 'In Progress';
  description: string;
  targetConditions?: string[];
  actionableSteps: string[];
  biomarkerTargets?: string[];
  evolutionNote?: string;
}

export interface EvolvingPrecautionFeedItem extends Recommendation {
  assessmentDate: string;
  previousRiskScore?: number;
  currentRiskScore: number;
  statusHistory?: Array<{ status: string; timestamp: string; note: string }>;
}

export interface ModelBenchmark {
  conditionId: string;
  conditionName: string;
  bestModel?: 'Random Forest' | 'XGBoost' | 'LightGBM' | string;
  topModel?: string;
  datasetSource?: string;
  sampleCount?: number;
  sampleSize?: number;
  featuresCount?: number;
  category?: string;
  ensembleAccuracy?: number;
  ensembleAuc?: number;
  ensembleF1?: number;
  multimodalLeadTimeMonths?: number;
  randomForest: { accuracy: number; precision?: number; recall?: number; f1?: number; rocAuc?: number; f1Score?: number; roc_auc?: number };
  xgboost: { accuracy: number; precision?: number; recall?: number; f1?: number; rocAuc?: number; f1Score?: number; roc_auc?: number };
  lightgbm: { accuracy: number; precision?: number; recall?: number; f1?: number; rocAuc?: number; f1Score?: number; roc_auc?: number };
  clinicalJustification?: string;
  clinicalSignificance?: string;
}

export interface PredictionResponse {
  predictionId: string;
  timestamp: string;
  patientData: PatientHealthData;
  conditions: Record<string, ConditionPrediction>;
  overallRisk: OverallHealthRisk;
  recommendations: Recommendation[];
  clinicalNotes?: string;
  inferenceTimeMs?: number;
  multimodalLatencyAdvantageMonths?: number;
}

export interface AssessmentHistoryItem {
  id: string;
  timestamp: string;
  patientName: string;
  age: number;
  sex: string;
  overallScore: number;
  overallTier: string;
  topRiskConditions?: Array<{ name: string; probability: number; riskLevel: RiskLevel }>;
  topPredictedCondition?: string;
  abnormalBiomarkersCount: number;
  rawPrediction?: PredictionResponse;
}

export interface DoctorNotesData {
  id: string;
  patientId: string;
  authorDoctor: string;
  authorTitle: string;
  timestamp: string;
  clinicalPrecautions: string;
  medicationOrders: string;
  dietaryDirectives: string;
  observationOrders: string;
  physicianSigned: boolean;
}

export interface PatientTimepoint {
  timestamp: string;
  dateStr: string;
  timeStr: string;
  systolic_bp: number;
  diastolic_bp: number;
  fasting_glucose: number;
  sweat_glucose?: number;
  sweat_lactate?: number;
  sweat_cortisol?: number;
  egfr?: number;
  riskScore: number;
}

export interface MedicationTablet {
  id: string;
  name: string; // e.g., "Amlodipine Besylate"
  dose: string; // e.g., "5 mg"
  frequency: string; // e.g., "Once daily after breakfast"
  route?: string; // e.g., "Oral tablet"
  instructions: string; // e.g., "Take with a full glass of water. Do not stand up abruptly."
  reason: string; // e.g., "Blood pressure regulation"
  status: 'active' | 'modified' | 'discontinued' | 'completed';
  prescribedDate: string;
  durationNote?: string; // e.g., "Take daily until doctor confirms full recovery"
  doctorChangeReason?: string; // Clinical explanation when adjusted
}

export interface PrecautionItem {
  id: string;
  category: 'Diet & Nutrition' | 'Blood Pressure & Vitals' | 'Physical Activity & Posture' | 'Warning Alert' | 'Medication Routine';
  directive: string;
  severity: 'critical' | 'important' | 'routine';
  activeUntilRecovery: boolean;
  updatedDate: string;
  doctorNote?: string;
}

export interface PatientSymptomUpdate {
  id: string;
  timestamp: string;
  patientComments: string;
  reportedSymptoms: string[]; // e.g., ["Mild dizziness", "Morning headache", "Fatigue"]
  severityLevel: 'None' | 'Mild' | 'Moderate' | 'Severe';
  homeVitals?: {
    systolic_bp?: number;
    diastolic_bp?: number;
    fasting_glucose?: number;
    heart_rate?: number;
    temperature_c?: number;
  };
  doctorReviewed: boolean;
  doctorReviewedAt?: string;
  doctorAnalysis?: string;
  doctorActionTaken?: string;
}

export interface DischargeSummary {
  isDischarged: boolean;
  dischargeDate?: string;
  dischargingPhysician?: string;
  dischargeCondition?: 'Clinically Stable' | 'Improving Under Home Care' | 'Fully Resolved';
  dischargeVitals?: {
    bp: string;
    glucose: number;
    heartRate: number;
    spO2: number;
  };
  dischargeDiagnosis?: string;
  dischargeInstructions?: string;
  followUpDate?: string;
  emergencyContactDoctor?: string;
}

export interface RecoveryStatus {
  recoveryStage: 'Inpatient Intensive' | 'Inpatient Step-Down' | 'Discharged - Home Recovery' | 'Ongoing Follow-up' | 'Fully Recovered';
  percentRecovered: number; // 0 to 100
  isFullyRecovered: boolean;
  recoveryCertifiedDate?: string;
  certifyingDoctor?: string;
  recoveryNotes?: string;
}

export interface PatientChartProfile {
  id: string;
  bedNumber: string;
  wardWing: string;
  mrn: string;
  name: string;
  age: number;
  sex: 'male' | 'female' | 'other';
  admissionDate: string;
  attendingDoctor: string;
  primaryDiagnosis: string;
  riskTier: 'Low Risk' | 'Moderate Risk' | 'High Risk' | 'Critical Health Alert';
  riskScore: number;
  patientStatus: 'inpatient' | 'discharged' | 'recovering' | 'fully_recovered';
  healthData: PatientHealthData;
  latestPrediction?: PredictionResponse;
  doctorNotes: DoctorNotesData;
  tablets: MedicationTablet[];
  precautionsList: PrecautionItem[];
  symptomUpdates: PatientSymptomUpdate[];
  dischargeSummary?: DischargeSummary;
  recoveryStatus: RecoveryStatus;
  history: PatientTimepoint[];
}

export type UserRole = 'doctor' | 'patient' | 'labtech' | 'admin';

export interface PatientNotification {
  id: string;
  patientId: string;
  timestamp: string;
  title: string;
  message: string;
  type: 'medication_change' | 'precaution_change' | 'alarm_reminder' | 'lab_updated' | 'recovery_update' | 'doctor_message';
  read: boolean;
  doctorName?: string;
}

export interface MedicineAlarm {
  id: string;
  patientId: string;
  title: string;
  time: string; // e.g., "08:00 AM"
  period: 'morning' | 'afternoon' | 'evening' | 'night';
  category: 'tablet' | 'precaution' | 'vitals' | 'water';
  tabletName?: string;
  dose?: string;
  instructions: string;
  foodRelation?: 'before_food' | 'after_food' | 'with_food' | 'anytime';
  status: 'pending' | 'taken' | 'snoozed' | 'missed';
  enabled: boolean;
  lastAcknowledgedAt?: string;
  colorTag?: string;
  friendlyLabel?: string;
}

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  assignedPatientId?: string; // For patient role (must access only their data)
  avatar?: string;
  department?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

