import React, { useState } from 'react';
import { useWardChart } from '../../context/WardChartContext';
import {
  LayoutGrid,
  ClipboardList,
  FileText,
  FileSpreadsheet,
  History,
  BrainCircuit,
  Sliders,
  Stethoscope,
  User,
  ChevronRight,
  Menu,
  X,
  Bed,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Activity,
  Printer,
  HeartPulse,
  ShieldAlert,
  ShieldCheck,
  Bell,
  BellRing,
  FlaskConical,
  Building2,
  LogIn,
  LogOut,
  Lock
} from 'lucide-react';

interface AppLayoutProps {
  activePage?: string;
  currentPageId?: string;
  onNavigate: (pageId: string) => void;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  activePage,
  currentPageId,
  onNavigate,
  children,
}) => {
  const currentNav = activePage || currentPageId || 'ward-board';
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const {
    patients,
    selectedPatientId,
    selectedPatient,
    setSelectedPatientId,
    currentUserRole,
    currentUser,
    setCurrentUserRole,
    doctorName,
    unreadNotificationCount,
    logoutUser,
  } = useWardChart();

  const handleNavClick = (pageId: string) => {
    onNavigate(pageId);
    setMobileDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const highRiskCount = patients.filter((p) => p.riskTier === 'High Risk' || p.riskTier === 'Critical Health Alert').length;

  if (currentNav === 'login') {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
        <header className="bg-gradient-to-r from-[#064E3B] to-[#047857] text-white px-4 sm:px-8 py-3.5 flex items-center justify-between border-b border-emerald-800 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 text-white flex items-center justify-center font-bold text-xl border border-white/20 shadow-inner">
              🏥
            </div>
            <div>
              <h1 className="font-bold text-sm sm:text-base leading-tight tracking-wide">
                City Hospital &bull; Multimodal Telemetry System
              </h1>
              <p className="text-[11px] text-emerald-200">
                Authorized Role-Based Healthcare Portal (Doctor, Patient, Lab Technician, Admin)
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-emerald-200 bg-emerald-900/60 px-3 py-1 rounded-full border border-emerald-700/50">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Secure Clinical Access Control</span>
          </div>
        </header>

        <main className="flex-1">
          {children}
        </main>
      </div>
    );
  }

  // Build role-specific navigation menu
  const getNavItems = () => {
    if (currentUserRole === 'patient') {
      return [
        {
          id: 'patient-alarms',
          label: 'My Alarms & Daily Tablets',
          shortLabel: 'Alarms',
          icon: BellRing,
          badge: unreadNotificationCount > 0 ? `${unreadNotificationCount} New Alerts` : 'Live Alarms',
          badgeColor: unreadNotificationCount > 0 ? 'bg-red-500 text-white animate-pulse' : 'bg-emerald-100 text-emerald-800',
        },
        {
          id: 'patient-booklet',
          label: 'My Online Health Portal',
          shortLabel: 'My Health',
          icon: FileText,
          badge: selectedPatient.patientStatus === 'fully_recovered' ? '100% Recovered' : 'Active Recovery',
        },
        {
          id: 'report',
          label: 'Bedside Chart & Official PDF',
          shortLabel: 'My Report PDF',
          icon: Printer,
          badge: 'Official',
        },
        {
          id: 'history',
          label: 'My Biomarker Trends',
          shortLabel: 'Trends',
          icon: History,
        },
        {
          id: 'login',
          label: 'Switch / Sign Out User',
          shortLabel: 'Login ID',
          icon: LogIn,
        },
      ];
    }

    if (currentUserRole === 'labtech') {
      return [
        {
          id: 'lab-technician',
          label: 'Lab Technician Diagnostics Workbench',
          shortLabel: 'Lab Workbench',
          icon: FlaskConical,
          badge: 'Biochemistry + Sweat',
          badgeColor: 'bg-blue-100 text-blue-800 border border-blue-200',
        },
        {
          id: 'ward-board',
          label: "Ward Specimen Roster",
          shortLabel: 'Ward Board',
          icon: LayoutGrid,
          badge: `${patients.length} Patients`,
        },
        {
          id: 'patient-chart',
          label: 'Patient Diagnostics Chart',
          shortLabel: 'Chart',
          icon: ClipboardList,
          badge: selectedPatient.bedNumber,
        },
        {
          id: 'history',
          label: 'Biomarker Telemetry Trends',
          shortLabel: 'Trends',
          icon: History,
        },
        {
          id: 'models',
          label: 'ML Disease Risk Matrix',
          shortLabel: 'AI Models',
          icon: BrainCircuit,
        },
        {
          id: 'login',
          label: 'Switch / Login Profiles',
          shortLabel: 'Login',
          icon: LogIn,
        },
      ];
    }

    if (currentUserRole === 'admin') {
      return [
        {
          id: 'admin-console',
          label: 'Hospital Admin Master Console',
          shortLabel: 'Admin Console',
          icon: Building2,
          badge: 'Full Overall Rights',
          badgeColor: 'bg-purple-100 text-purple-800 border border-purple-200',
        },
        {
          id: 'ward-board',
          label: "Ward Bed Census",
          shortLabel: 'Ward Board',
          icon: LayoutGrid,
          badge: `${patients.length} Patients`,
        },
        {
          id: 'patient-chart',
          label: 'Patient Clinical Chart',
          shortLabel: 'Chart',
          icon: ClipboardList,
          badge: selectedPatient.bedNumber,
        },
        {
          id: 'patient-alarms',
          label: 'Patient Alarms & Feeds',
          shortLabel: 'Alarms',
          icon: BellRing,
        },
        {
          id: 'lab-technician',
          label: 'Diagnostics Laboratory',
          shortLabel: 'Lab',
          icon: FlaskConical,
        },
        {
          id: 'report',
          label: 'Bedside Chart & Discharge PDF',
          shortLabel: 'PDF',
          icon: Printer,
        },
        {
          id: 'settings',
          label: 'Hospital Settings & Reset',
          shortLabel: 'Settings',
          icon: Sliders,
        },
        {
          id: 'login',
          label: 'Switch / Login Profiles',
          shortLabel: 'Login',
          icon: LogIn,
        },
      ];
    }

    // Doctor: strictly Doctor Dashboard and clinical oversight tools
    return [
      {
        id: 'ward-board',
        label: "Doctor's Ward Board",
        shortLabel: 'Ward Board',
        icon: LayoutGrid,
        badge: `${patients.length} Patients`,
      },
      {
        id: 'patient-chart',
        label: 'Doctor Care Workbench',
        shortLabel: 'Doctor Chart',
        icon: ClipboardList,
        badge: selectedPatient.bedNumber,
      },
      {
        id: 'submit-readings',
        label: 'Submit Readings & Labs',
        shortLabel: 'Add Lab/Sweat',
        icon: FileSpreadsheet,
        badge: 'Blood + Sweat',
      },
      {
        id: 'report',
        label: 'Bedside Chart & Discharge PDF',
        shortLabel: 'Chart PDF',
        icon: Printer,
        badge: 'Official',
      },
      {
        id: 'history',
        label: 'Biomarker Trends',
        shortLabel: 'Trends',
        icon: History,
      },
      {
        id: 'models',
        label: 'AI Multi-Disease Risk Matrix',
        shortLabel: 'AI Models',
        icon: BrainCircuit,
        badge: '96.8% Acc',
      },
      {
        id: 'settings',
        label: 'Ward & Clinical Settings',
        shortLabel: 'Settings',
        icon: Sliders,
      },
      {
        id: 'login',
        label: 'Sign Out / Switch User',
        shortLabel: 'Sign Out',
        icon: LogOut,
      },
    ];
  };

  const navItems = getNavItems();

  const systolic = selectedPatient.healthData.systolic_bp;
  const diastolic = selectedPatient.healthData.diastolic_bp;
  const isBpAbnormal = systolic >= 140 || diastolic >= 90;
  const fastingGluc = selectedPatient.healthData.fasting_glucose;
  const isGlucAbnormal = fastingGluc >= 126;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased flex flex-col selection:bg-[#059669] selection:text-white">
      {/* 1. TOP MEDICAL CLINICAL BANNER */}
      <div className="bg-[#064E3B] text-white border-b border-[#042F2E] px-4 sm:px-6 py-2 text-xs font-mono-chart flex flex-wrap items-center justify-between gap-3 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          {/* Hospital Ward Telemetry Tag */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
            </span>
            <span className="font-bold text-emerald-100 tracking-wider uppercase text-[11px] flex items-center gap-1.5">
              <HeartPulse className="w-3.5 h-3.5 text-emerald-300" />
              CITY HOSPITAL &bull; MULTI-DISEASE CARE &amp; TELEMETRY
            </span>
          </div>

          <span className="text-emerald-700 hidden sm:inline">|</span>

          {/* Active Bed Indicator */}
          <div className="hidden md:flex items-center gap-1.5 text-emerald-100">
            <Bed className="w-3.5 h-3.5 text-emerald-300" />
            <span className="text-emerald-200">
              {currentUserRole === 'patient' ? 'MY PROFILE:' : 'ACTIVE BED:'}
            </span>
            <strong className="text-white">{selectedPatient.bedNumber} ({selectedPatient.name})</strong>
            <span className="text-[10px] text-emerald-300 font-mono">[{selectedPatient.mrn}]</span>
          </div>

          {/* Emergency High Risk Alert */}
          {highRiskCount > 0 && currentUserRole !== 'patient' && (
            <div className="hidden lg:flex items-center gap-1.5 bg-red-600/90 text-white px-2.5 py-0.5 rounded text-[10px] font-bold border border-red-400">
              <AlertTriangle className="w-3 h-3 text-white animate-pulse" />
              <span>{highRiskCount} RED ALERT BEDS</span>
            </div>
          )}
        </div>

        {/* Right Role Switcher & Live Clinical Duty */}
        <div className="flex items-center gap-2.5 ml-auto">
          {/* Unread Patient Notification Pill */}
          {unreadNotificationCount > 0 && (
            <button
              onClick={() => handleNavClick('patient-alarms')}
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer shadow-xs animate-bounce"
            >
              <BellRing className="w-3.5 h-3.5" />
              <span>{unreadNotificationCount} New Alerts</span>
            </button>
          )}

          {/* User Account Chip */}
          <div className="flex items-center gap-2 bg-[#042F2E] px-2.5 py-1 rounded-lg border border-emerald-700/60 text-[11px]">
            <span className="text-base">{currentUser.avatar || '👤'}</span>
            <div className="flex flex-col text-left">
              <span className="font-bold text-white leading-tight truncate max-w-[120px] sm:max-w-[160px]">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-emerald-300 capitalize font-medium">
                {currentUser.role === 'doctor'
                  ? 'Doctor'
                  : currentUser.role === 'admin'
                  ? 'Admin'
                  : currentUser.role === 'labtech'
                  ? 'Lab Tech'
                  : 'Patient'}
              </span>
            </div>
          </div>

          {/* Quick Switch Role / Login Button */}
          <button
            onClick={() => handleNavClick('login')}
            className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-600 text-white text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1 border border-emerald-600 cursor-pointer shadow-xs"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Switch Role</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-row">
        {/* 2. DESKTOP CLINICAL SIDEBAR */}
        <aside className="hidden lg:flex flex-col bg-white border-r border-slate-200 text-[#0F172A] w-72 shrink-0 sticky top-[37px] h-[calc(100vh-37px)] z-40 shadow-sm">
          {/* Brand Card */}
          <div className="p-4 border-b border-slate-200 bg-emerald-50/50">
            <button
              onClick={() => handleNavClick(currentUserRole === 'patient' ? 'patient-alarms' : 'ward-board')}
              className="flex items-center gap-3 text-left cursor-pointer group w-full"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs group-hover:bg-emerald-700 transition-colors shrink-0 text-xl">
                🏥
              </div>
              <div className="overflow-hidden">
                <div className="flex items-center gap-1.5">
                  <h2 className="font-bold text-[#064E3B] text-base leading-tight font-heading">
                    Hospital Care
                  </h2>
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded uppercase">
                    Smart EHR
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-mono-chart truncate">
                  {currentUserRole === 'patient' ? 'Personal Patient Portal' : 'Clinical Ward & Telemetry'}
                </p>
              </div>
            </button>
          </div>

          {/* Active Bed Roster Selector (Locked for Patients!) */}
          <div className="p-3.5 border-b border-slate-200 bg-slate-50/70 space-y-2.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 uppercase tracking-wider font-mono-chart">
              <span>{currentUserRole === 'patient' ? 'Your Health Record' : 'Bedside Observation'}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                  selectedPatient.riskTier === 'Critical Health Alert'
                    ? 'bg-red-100 text-red-700 border border-red-200'
                    : selectedPatient.riskTier === 'High Risk'
                    ? 'bg-orange-100 text-orange-700 border border-orange-200'
                    : selectedPatient.riskTier === 'Moderate Risk'
                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}
              >
                {selectedPatient.riskTier}
              </span>
            </div>

            {/* If Patient: Locked to their own profile! If Doctor/Admin/LabTech: Dropdown */}
            {currentUserRole === 'patient' ? (
              <div className="bg-white border border-emerald-300 rounded-xl p-2.5 shadow-2xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">{selectedPatient.name}</span>
                  <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" /> Private
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  {selectedPatient.bedNumber} &bull; MRN: {selectedPatient.mrn}
                </div>
              </div>
            ) : (
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-md px-2.5 py-1.5 text-xs font-mono-chart text-[#0F172A] font-bold focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 cursor-pointer shadow-xs"
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.bedNumber}: {p.name} ({p.riskTier})
                  </option>
                ))}
              </select>
            )}

            {/* Active Bed Vitals Quick Readout */}
            <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono-chart pt-0.5">
              <div
                className={`p-2 rounded border ${
                  isBpAbnormal
                    ? 'bg-red-50 border-red-200 text-red-800'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                }`}
              >
                <span className="text-[9px] text-slate-500 block uppercase font-sans font-semibold">
                  Blood Pressure
                </span>
                <span className="font-bold text-xs">
                  {systolic}/{diastolic} <span className="text-[9px] font-normal font-mono">mmHg</span>
                </span>
              </div>
              <div
                className={`p-2 rounded border ${
                  isGlucAbnormal
                    ? 'bg-red-50 border-red-200 text-red-800'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                }`}
              >
                <span className="text-[9px] text-slate-500 block uppercase font-sans font-semibold">
                  Fast. Glucose
                </span>
                <span className="font-bold text-xs">
                  {fastingGluc} <span className="text-[9px] font-normal font-mono">mg/dL</span>
                </span>
              </div>
            </div>

            {/* Recovery Meter Snapshot */}
            <div className="bg-white p-2 rounded border border-slate-200 flex items-center justify-between text-[11px] font-mono-chart shadow-2xs">
              <span className="text-slate-600 flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Recovery:
              </span>
              <span className="font-bold text-[#064E3B]">
                {selectedPatient.recoveryStatus.percentRecovered}% ({selectedPatient.patientStatus === 'fully_recovered' ? 'Full' : 'In-Progress'})
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-2.5 space-y-1 overflow-y-auto">
            <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono-chart">
              {currentUserRole === 'patient'
                ? 'Patient Health & Alarms'
                : currentUserRole === 'admin'
                ? 'Hospital Master Admin'
                : currentUserRole === 'labtech'
                ? 'Diagnostics Laboratory'
                : 'Clinical Ward Controls'}
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-700 text-white font-bold shadow-xs'
                      : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-mono-chart px-2 py-0.5 rounded-full font-bold ${
                        (item as any).badgeColor || (isActive
                          ? 'bg-emerald-800 text-white'
                          : item.badge.includes('Bed')
                          ? 'bg-slate-100 text-slate-700 border border-slate-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200')
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Doctor / Role Action Banner */}
          <div className="p-3.5 border-t border-slate-200 bg-slate-50 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono-chart text-slate-500">
              <span>ACTIVE USER:</span>
              <span className="font-bold text-emerald-800 truncate">{currentUser.name}</span>
            </div>

            {currentUserRole === 'patient' ? (
              <button
                onClick={() => handleNavClick('patient-alarms')}
                className="w-full py-2.5 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer font-heading"
              >
                <BellRing className="w-3.5 h-3.5" />
                <span>My Medication Alarms</span>
              </button>
            ) : currentUserRole === 'labtech' ? (
              <button
                onClick={() => handleNavClick('lab-technician')}
                className="w-full py-2.5 px-3 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer font-heading"
              >
                <FlaskConical className="w-3.5 h-3.5" />
                <span>Update Lab Biosensors</span>
              </button>
            ) : currentUserRole === 'admin' ? (
              <button
                onClick={() => handleNavClick('admin-console')}
                className="w-full py-2.5 px-3 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer font-heading"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Admin Master Controls</span>
              </button>
            ) : (
              <button
                onClick={() => handleNavClick('patient-chart')}
                className="w-full py-2.5 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer font-heading"
              >
                <ClipboardList className="w-3.5 h-3.5" />
                <span>Write Doctor Notes &amp; Rx</span>
              </button>
            )}
          </div>
        </aside>

        {/* 3. MAIN WORKSPACE VIEWPORT */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Sticky Mobile/Tablet Top Bar */}
          <header className="sticky top-[37px] z-30 bg-white/95 backdrop-blur-xs border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-2.5">
            <div className="flex items-center justify-between gap-3">
              {/* Left: Mobile Navigation Trigger */}
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setMobileDrawerOpen(true)}
                  className="p-1.5 -ml-1 rounded-md text-emerald-800 hover:bg-emerald-50 transition-colors lg:hidden cursor-pointer"
                  aria-label="Open Navigation"
                >
                  <Menu className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-emerald-900 font-heading">
                    {navItems.find((n) => n.id === currentNav)?.label || 'Bedside Chart'}
                  </span>
                  <span className="text-slate-300 hidden sm:inline">&bull;</span>
                  <span className="text-xs text-slate-500 font-mono-chart hidden sm:inline">
                    {selectedPatient.bedNumber} &bull; {selectedPatient.name} ({selectedPatient.mrn})
                  </span>
                </div>
              </div>

              {/* Right: Quick Actions */}
              <div className="flex items-center gap-2">
                {/* Fast Bed Quick-Switcher for Mobile (Only for staff!) */}
                {currentUserRole !== 'patient' && (
                  <div className="lg:hidden">
                    <select
                      value={selectedPatientId}
                      onChange={(e) => setSelectedPatientId(e.target.value)}
                      className="bg-white border border-slate-300 rounded px-2 py-1 text-xs font-mono-chart text-emerald-800 font-bold"
                    >
                      {patients.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.bedNumber}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {currentUserRole === 'patient' ? (
                  <button
                    onClick={() => handleNavClick('patient-alarms')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer font-heading"
                  >
                    <BellRing className="w-3.5 h-3.5" />
                    <span>Alarms</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleNavClick('submit-readings')}
                      className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-all shadow-2xs cursor-pointer font-heading"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Submit Lab / Sweat</span>
                    </button>

                    <button
                      onClick={() => handleNavClick('report')}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer font-heading"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Chart PDF</span>
                      <span className="sm:hidden">PDF</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </header>

          {/* Main Chart Body Content */}
          <main className="flex-1 px-3 sm:px-6 lg:px-8 py-5 max-w-7xl w-full mx-auto">
            {children}
          </main>

          {/* Clinical Hospital Bedside Ledger Footer */}
          <footer className="border-t border-slate-200 bg-white text-xs text-slate-500 py-4 px-4 sm:px-8 mt-auto font-mono-chart">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div className="flex items-center gap-2">
                <span className="font-bold text-emerald-900 font-heading">HOSPITAL MANAGEMENT EHR</span>
                <span className="text-slate-300">&bull;</span>
                <span className="text-[11px]">
                  Role-Based Inpatient &amp; Home Recovery Telemetry System
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-bold text-emerald-700">
                <button
                  onClick={() => handleNavClick('login')}
                  className="hover:underline cursor-pointer"
                >
                  Switch User ID
                </button>
                <span className="text-slate-300">&bull;</span>
                <button
                  onClick={() => handleNavClick('patient-alarms')}
                  className="hover:underline cursor-pointer"
                >
                  Medicine Alarms
                </button>
                <span className="text-slate-300">&bull;</span>
                <button
                  onClick={() => handleNavClick('admin-console')}
                  className="hover:underline cursor-pointer"
                >
                  Admin Master
                </button>
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* 4. MOBILE DRAWER NAVIGATION */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="relative flex flex-col w-72 max-w-xs bg-white h-full shadow-2xl p-4 overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏥</span>
                <div>
                  <h3 className="font-bold text-emerald-900 text-sm">Hospital Care</h3>
                  <p className="text-[10px] text-slate-500 capitalize">Role: {currentUser.role}</p>
                </div>
              </div>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1 flex-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentNav === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-emerald-700 text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
