import { User } from '../types';

export interface UserAccount extends User {
  passwordHash?: string; // Stored password or hash for verification
  friendlyTitle?: string;
  phone?: string;
}

export const SYSTEM_USERS: UserAccount[] = [
  // 1 DOCTOR
  {
    id: 'user_doc_1',
    username: 'doctor',
    passwordHash: 'doc123',
    name: 'Dr. Alexander Wright, MD',
    friendlyTitle: 'Chief Medical Officer & Primary Attending Physician',
    email: 'dr.wright@cityhospital.org',
    role: 'doctor',
    department: 'Cardiology & Internal Medicine',
    avatar: '👨‍⚕️',
    phone: '+1 (555) 234-5678',
    createdAt: '2026-01-10',
  },

  // 1 ADMIN
  {
    id: 'user_admin_1',
    username: 'admin',
    passwordHash: 'admin123',
    name: 'Marcus Vance',
    friendlyTitle: 'Hospital Administrator & Operations Director',
    email: 'admin@cityhospital.org',
    role: 'admin',
    department: 'Hospital Operations & Inpatient Registry',
    avatar: '🏢',
    phone: '+1 (555) 234-9999',
    createdAt: '2026-01-01',
  },

  // 1 LAB TECHNICIAN
  {
    id: 'user_lab_1',
    username: 'labtech',
    passwordHash: 'lab123',
    name: 'Marcus Brody',
    friendlyTitle: 'Lead Medical & Biomarker Technologist',
    email: 'lab.brody@cityhospital.org',
    role: 'labtech',
    department: 'Biochemistry & Multi-Organ Biomarker Testing Lab',
    avatar: '🔬',
    phone: '+1 (555) 234-7777',
    createdAt: '2026-02-15',
  },

  // 12 PATIENTS
  {
    id: 'user_pat_01',
    username: 'john',
    passwordHash: 'pat123',
    name: 'John Miller',
    friendlyTitle: 'Patient • Bed 01 (Cardiovascular & Neuro)',
    email: 'john.miller@gmail.com',
    role: 'patient',
    assignedPatientId: 'patient-01',
    phone: '+1 (555) 301-4421',
    avatar: '🧔',
    createdAt: '2026-08-30',
  },
  {
    id: 'user_pat_02',
    username: 'david',
    passwordHash: 'pat123',
    name: 'David Chen',
    friendlyTitle: 'Patient • Bed 02 (Endocrinology & Diabetes)',
    email: 'david.chen@gmail.com',
    role: 'patient',
    assignedPatientId: 'patient-02',
    phone: '+1 (555) 302-8874',
    avatar: '👨',
    createdAt: '2026-08-31',
  },
  {
    id: 'user_pat_03',
    username: 'sarah',
    passwordHash: 'pat123',
    name: 'Sarah Jenkins',
    friendlyTitle: 'Patient • Bed 03 (Outpatient Home Recovery)',
    email: 'sarah.jenkins@gmail.com',
    role: 'patient',
    assignedPatientId: 'patient-03',
    phone: '+1 (555) 303-9912',
    avatar: '👩',
    createdAt: '2026-08-28',
  },
  {
    id: 'user_pat_04',
    username: 'emily',
    passwordHash: 'pat123',
    name: 'Emily Watson',
    friendlyTitle: 'Patient • Bed 04 (Observation & Wellness)',
    email: 'emily.watson@gmail.com',
    role: 'patient',
    assignedPatientId: 'patient-04',
    phone: '+1 (555) 304-5511',
    avatar: '👩‍🦰',
    createdAt: '2026-09-01',
  },
  {
    id: 'user_pat_05',
    username: 'james',
    passwordHash: 'pat123',
    name: 'James Wilson',
    friendlyTitle: 'Patient • Bed 05 (Renal Protection)',
    email: 'james.wilson@gmail.com',
    role: 'patient',
    assignedPatientId: 'patient-05',
    phone: '+1 (555) 305-6677',
    avatar: '👨‍💼',
    createdAt: '2026-09-01',
  },
  {
    id: 'user_pat_06',
    username: 'olivia',
    passwordHash: 'pat123',
    name: 'Olivia Taylor',
    friendlyTitle: 'Patient • Bed 06 (Lipid Health & Vascular)',
    email: 'olivia.taylor@gmail.com',
    role: 'patient',
    assignedPatientId: 'patient-06',
    phone: '+1 (555) 306-1144',
    avatar: '🧕',
    createdAt: '2026-09-01',
  },
  {
    id: 'user_pat_07',
    username: 'robert',
    passwordHash: 'pat123',
    name: 'Robert Garcia',
    friendlyTitle: 'Patient • Bed 07 (Thyroid & Metabolic)',
    email: 'robert.garcia@gmail.com',
    role: 'patient',
    assignedPatientId: 'patient-07',
    phone: '+1 (555) 307-8822',
    avatar: '👴',
    createdAt: '2026-09-02',
  },
  {
    id: 'user_pat_08',
    username: 'emma',
    passwordHash: 'pat123',
    name: 'Emma Davis',
    friendlyTitle: 'Patient • Home Care (100% Recovered)',
    email: 'emma.davis@gmail.com',
    role: 'patient',
    assignedPatientId: 'patient-08',
    phone: '+1 (555) 308-3355',
    avatar: '👩‍🦱',
    createdAt: '2026-08-10',
  },
  {
    id: 'user_pat_09',
    username: 'daniel',
    passwordHash: 'pat123',
    name: 'Daniel Martinez',
    friendlyTitle: 'Patient • Bed 09 (Cardiac Rhythm Care)',
    email: 'daniel.martinez@gmail.com',
    role: 'patient',
    assignedPatientId: 'patient-09',
    phone: '+1 (555) 309-4466',
    avatar: '🧔‍♂️',
    createdAt: '2026-09-01',
  },
  {
    id: 'user_pat_10',
    username: 'sophia',
    passwordHash: 'pat123',
    name: 'Sophia Anderson',
    friendlyTitle: 'Patient • Bed 10 (Glycemic Balance)',
    email: 'sophia.anderson@gmail.com',
    role: 'patient',
    assignedPatientId: 'patient-10',
    phone: '+1 (555) 310-7799',
    avatar: '👩',
    createdAt: '2026-09-02',
  },
  {
    id: 'user_pat_11',
    username: 'lucas',
    passwordHash: 'pat123',
    name: 'Lucas Robinson',
    friendlyTitle: 'Patient • Bed 11 (Electrolyte & Hydration)',
    email: 'lucas.robinson@gmail.com',
    role: 'patient',
    assignedPatientId: 'patient-11',
    phone: '+1 (555) 311-2233',
    avatar: '👨‍🦲',
    createdAt: '2026-09-02',
  },
  {
    id: 'user_pat_12',
    username: 'grace',
    passwordHash: 'pat123',
    name: 'Grace Thomas',
    friendlyTitle: 'Patient • Bed 12 (Hematology & Vitality)',
    email: 'grace.thomas@gmail.com',
    role: 'patient',
    assignedPatientId: 'patient-12',
    phone: '+1 (555) 312-6688',
    avatar: '👩‍🦰',
    createdAt: '2026-09-02',
  },
];

const REGISTERED_USERS_KEY = 'hospital_registered_users_v1';

export function getAllUsers(): UserAccount[] {
  try {
    const saved = localStorage.getItem(REGISTERED_USERS_KEY);
    if (saved) {
      const extra: UserAccount[] = JSON.parse(saved);
      const combined = [...SYSTEM_USERS];
      extra.forEach((u) => {
        if (!combined.some((c) => c.username.toLowerCase() === u.username.toLowerCase() || c.id === u.id)) {
          combined.push(u);
        }
      });
      return combined;
    }
  } catch (e) {}
  return SYSTEM_USERS;
}

export function registerNewUser(account: UserAccount): void {
  try {
    const saved = localStorage.getItem(REGISTERED_USERS_KEY);
    const existing: UserAccount[] = saved ? JSON.parse(saved) : [];
    const index = existing.findIndex((u) => u.username.toLowerCase() === account.username.toLowerCase());
    if (index >= 0) {
      existing[index] = account;
    } else {
      existing.push(account);
    }
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(existing));
  } catch (e) {
    console.error('Failed to register user', e);
  }
}
