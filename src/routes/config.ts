import {
  LayoutGrid,
  FileSpreadsheet,
  FileText,
  Activity,
  History,
  BrainCircuit,
  Sliders,
  ClipboardList,
  Stethoscope,
  LucideIcon
} from 'lucide-react';

export interface RouteConfig {
  id: string;
  path: string;
  label: string;
  shortDescription: string;
  icon: LucideIcon;
  badge?: string;
  roleVisibility?: 'all' | 'doctor' | 'patient';
  category: 'Clinical Workflows' | 'Observation & Reports' | 'System & Research';
  showInNav: boolean;
}

export const APP_ROUTES: RouteConfig[] = [
  {
    id: 'landing',
    path: '/',
    label: 'Hospital Portal',
    shortDescription: 'Ward Chart overview, role-based login, and clinical methodology',
    icon: Stethoscope,
    roleVisibility: 'all',
    category: 'Clinical Workflows',
    showInNav: true,
  },
  {
    id: 'ward-board',
    path: '/ward-board',
    label: "Doctor's Ward Board",
    shortDescription: 'Hospital ward bed roster with live vitals, risk flags, and quick chart access',
    icon: LayoutGrid,
    badge: '10 Inpatients',
    roleVisibility: 'doctor',
    category: 'Clinical Workflows',
    showInNav: true,
  },
  {
    id: 'patient-chart',
    path: '/chart',
    label: 'Full Bedside Chart',
    shortDescription: 'Complete blood + sweat observation ledger, AI risk scores, and editable Doctor Notes',
    icon: ClipboardList,
    badge: 'Doctor Orders',
    roleVisibility: 'doctor',
    category: 'Clinical Workflows',
    showInNav: true,
  },
  {
    id: 'patient-booklet',
    path: '/booklet',
    label: 'Patient Chart Booklet',
    shortDescription: 'Patient-friendly bedside chart summary with plain-language readings and Doctor Notes',
    icon: FileText,
    badge: 'My Chart',
    roleVisibility: 'patient',
    category: 'Clinical Workflows',
    showInNav: true,
  },
  {
    id: 'submit-readings',
    path: '/submit-readings',
    label: 'Submit Readings',
    shortDescription: 'Log new blood lab results and wearable sweat patch telemetry or upload CSV',
    icon: FileSpreadsheet,
    badge: 'Blood + Sweat',
    roleVisibility: 'all',
    category: 'Clinical Workflows',
    showInNav: true,
  },
  {
    id: 'report',
    path: '/report',
    label: 'Bedside Chart PDF',
    shortDescription: 'Authentic hospital bedside observation chart export with doctor signature stamp',
    icon: FileText,
    badge: 'PDF Export',
    roleVisibility: 'all',
    category: 'Observation & Reports',
    showInNav: true,
  },
  {
    id: 'history',
    path: '/history',
    label: 'Pen-Plotted Trends',
    shortDescription: 'Timepoint progression of vitals, blood chemistry, and sweat biomarkers on graph paper',
    icon: History,
    roleVisibility: 'all',
    category: 'Observation & Reports',
    showInNav: true,
  },
  {
    id: 'models',
    path: '/models',
    label: 'Model Training Hub',
    shortDescription: 'Comparative ML benchmark: Random Forest vs. XGBoost vs. LightGBM (95%+ accuracy)',
    icon: BrainCircuit,
    badge: 'Academic Research',
    roleVisibility: 'all',
    category: 'System & Research',
    showInNav: true,
  },
  {
    id: 'settings',
    path: '/settings',
    label: 'Role & Ward Config',
    shortDescription: 'Instant Doctor / Patient role toggle, patient reassignment, and clinical thresholds',
    icon: Sliders,
    roleVisibility: 'all',
    category: 'System & Research',
    showInNav: true,
  },
];
