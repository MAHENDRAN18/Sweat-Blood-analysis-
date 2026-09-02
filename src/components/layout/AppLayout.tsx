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
  UserCheck,
  User,
  ChevronRight,
  Menu,
  X,
  Bed,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Activity,
  Printer
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
    setCurrentUserRole,
    doctorName,
  } = useWardChart();

  const handleNavClick = (pageId: string) => {
    onNavigate(pageId);
    setMobileDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    ...(currentUserRole === 'doctor'
      ? [
          {
            id: 'ward-board',
            label: "Doctor's Ward Board",
            shortLabel: 'Ward Board',
            icon: LayoutGrid,
            badge: `${patients.length} Beds`,
          },
          {
            id: 'patient-chart',
            label: 'Full Bedside Chart',
            shortLabel: 'Bedside Chart',
            icon: ClipboardList,
            badge: selectedPatient.bedNumber,
          },
        ]
      : [
          {
            id: 'patient-booklet',
            label: 'My Chart Booklet',
            shortLabel: 'My Booklet',
            icon: FileText,
            badge: selectedPatient.bedNumber,
          },
        ]),
    {
      id: 'submit-readings',
      label: 'Submit Readings',
      shortLabel: 'Add Lab/Sweat',
      icon: FileSpreadsheet,
      badge: 'Blood + Sweat',
    },
    {
      id: 'report',
      label: 'Bedside Chart PDF',
      shortLabel: 'Chart PDF',
      icon: Printer,
      badge: 'Official',
    },
    {
      id: 'history',
      label: 'Pen-Plotted Trends',
      shortLabel: 'Trends',
      icon: History,
    },
    {
      id: 'models',
      label: 'AI Model Research Hub',
      shortLabel: 'ML Lab',
      icon: BrainCircuit,
      badge: '95%+ Acc',
    },
    {
      id: 'landing',
      label: 'Hospital Portal & Triage',
      shortLabel: 'Portal',
      icon: Stethoscope,
    },
    {
      id: 'settings',
      label: 'Ward & Role Settings',
      shortLabel: 'Settings',
      icon: Sliders,
    },
  ];

  const systolic = selectedPatient.healthData.systolic_bp;
  const diastolic = selectedPatient.healthData.diastolic_bp;
  const isBpAbnormal = systolic >= 140 || diastolic >= 90;
  const fastingGluc = selectedPatient.healthData.fasting_glucose;
  const isGlucAbnormal = fastingGluc >= 126;

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#1E293B] font-sans antialiased flex flex-col selection:bg-[#2B4570] selection:text-[#FAF6EE]">
      {/* 1. TOP CLINICAL BANNER (HOSPITAL WARD TELEMETRY & ROLE TOGGLE) */}
      <div className="bg-[#2B4570] text-[#FAF6EE] border-b border-[#1D3254] px-4 sm:px-6 py-2 text-xs font-mono-chart flex flex-wrap items-center justify-between gap-3 sticky top-0 z-50 shadow-xs">
        <div className="flex items-center gap-3">
          {/* Hospital Header Tag */}
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#6B8F71] shadow-[0_0_8px_#6B8F71] animate-pulse" />
            <span className="font-bold text-white tracking-wider uppercase text-[11px]">
              WARD 4B &bull; INTERNAL MEDICINE & METABOLIC
            </span>
          </div>

          <span className="text-[#647C9E] hidden sm:inline">|</span>

          {/* Active Bed Indicator */}
          <div className="hidden md:flex items-center gap-1.5 text-[#D1DCE5]">
            <Bed className="w-3.5 h-3.5 text-[#C98A2B]" />
            <span>ACTIVE:</span>
            <strong className="text-white">{selectedPatient.bedNumber} ({selectedPatient.name})</strong>
            <span className="text-[10px] text-[#A8BED0]">[{selectedPatient.mrn}]</span>
          </div>
        </div>

        {/* Right Role Switcher & Live Observation Time */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Active Role Selector Pill */}
          <div className="flex items-center bg-[#1D3254] rounded-lg p-0.5 border border-[#3D5B8C] text-[11px]">
            <button
              onClick={() => {
                setCurrentUserRole('doctor');
                if (currentNav === 'patient-booklet') onNavigate('ward-board');
              }}
              className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                currentUserRole === 'doctor'
                  ? 'bg-[#FAF6EE] text-[#2B4570] shadow-xs'
                  : 'text-[#C9D6DE] hover:text-white'
              }`}
            >
              <Stethoscope className="w-3 h-3" />
              <span>Doctor View</span>
            </button>
            <button
              onClick={() => {
                setCurrentUserRole('patient');
                if (currentNav === 'ward-board' || currentNav === 'patient-chart') onNavigate('patient-booklet');
              }}
              className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                currentUserRole === 'patient'
                  ? 'bg-[#FAF6EE] text-[#2B4570] shadow-xs'
                  : 'text-[#C9D6DE] hover:text-white'
              }`}
            >
              <User className="w-3 h-3" />
              <span>Patient View</span>
            </button>
          </div>

          <div className="hidden xl:flex items-center gap-1 text-[11px] text-[#D1DCE5]">
            <span>SHIFT:</span>
            <span className="text-[#6B8F71] font-bold">08:00 - 20:00 (ON-SERVICE)</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-row">
        {/* 2. DESKTOP WARD CHART SIDEBAR (STATION BOARD STYLE) */}
        <aside className="hidden lg:flex flex-col bg-[#FAF6EE] border-r border-[#D1DCE5] text-[#1E293B] w-68 shrink-0 sticky top-[37px] h-[calc(100vh-37px)] z-40 chart-paper">
          {/* Ward Chart Brand Card */}
          <div className="p-4 border-b border-[#D1DCE5] bg-[#F2F6F9]">
            <button
              onClick={() => handleNavClick(currentUserRole === 'doctor' ? 'ward-board' : 'patient-booklet')}
              className="flex items-center gap-3 text-left cursor-pointer group w-full"
            >
              <div className="w-10 h-10 rounded-lg bg-[#2B4570] text-white flex items-center justify-center font-bold shadow-xs group-hover:bg-[#1D3254] transition-colors shrink-0">
                <ClipboardList className="w-5 h-5 text-[#FAF6EE]" />
              </div>
              <div className="overflow-hidden">
                <h2 className="font-bold text-[#2B4570] text-base leading-tight font-heading">
                  Ward Chart
                </h2>
                <p className="text-[10px] text-[#556987] font-mono-chart truncate">
                  Bedside Biomarker Ledger
                </p>
              </div>
            </button>
          </div>

          {/* Active Bed Roster Selector */}
          <div className="p-3 border-b border-[#D1DCE5] bg-[#FAF6EE] space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-[#556987] uppercase tracking-wider font-mono-chart">
              <span>Bedside Observation</span>
              <span className="text-[10px] text-[#2B4570] bg-[#E2EAF0] px-1.5 py-0.5 rounded">
                {currentUserRole === 'doctor' ? 'Attending' : 'Patient'}
              </span>
            </div>

            {/* Quick Bed Dropdown */}
            <div className="space-y-1.5">
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full bg-[#FFFFFF] border border-[#C9D6DE] rounded-md px-2.5 py-1.5 text-xs font-mono-chart text-[#1E293B] font-bold focus:outline-none focus:border-[#2B4570] cursor-pointer shadow-2xs"
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.bedNumber}: {p.name} ({p.riskTier})
                  </option>
                ))}
              </select>

              {/* Active Bed Vitals Quick Readout */}
              <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono-chart pt-1">
                <div className="bg-[#FFFFFF] p-2 rounded border border-[#D8E2E8]">
                  <span className="text-[9px] text-[#556987] block uppercase">Blood Pressure</span>
                  <span className={`font-bold ${isBpAbnormal ? 'ink-red' : 'ink-blue'}`}>
                    {systolic}/{diastolic} <span className="text-[9px] font-normal">mmHg</span>
                  </span>
                </div>
                <div className="bg-[#FFFFFF] p-2 rounded border border-[#D8E2E8]">
                  <span className="text-[9px] text-[#556987] block uppercase">Fast. Glucose</span>
                  <span className={`font-bold ${isGlucAbnormal ? 'ink-red' : 'ink-blue'}`}>
                    {fastingGluc} <span className="text-[9px] font-normal">mg/dL</span>
                  </span>
                </div>
              </div>

              {/* Sweat Telemetry Mini-Ticker */}
              <div className="bg-[#FAF8F2] p-1.5 rounded border border-[#E8DFC9] flex items-center justify-between text-[10px] font-mono-chart">
                <span className="text-[#876527] flex items-center gap-1 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C98A2B]" /> Sweat Lactate:
                </span>
                <span className="font-bold text-[#2B4570]">{selectedPatient.healthData.sweat_lactate || 1.8} mmol/L</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
            <div className="px-3 py-1 text-[10px] font-bold text-[#647C9E] uppercase tracking-wider font-mono-chart">
              {currentUserRole === 'doctor' ? 'Clinical Navigation' : 'Patient Navigation'}
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#2B4570] text-[#FAF6EE] font-bold shadow-xs'
                      : 'text-[#334155] hover:bg-[#EEF4F8] hover:text-[#2B4570]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#FAF6EE]' : 'text-[#556987]'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-mono-chart px-1.5 py-0.5 rounded font-bold ${
                        isActive
                          ? 'bg-[#FAF6EE] text-[#2B4570]'
                          : 'bg-[#E2EAF0] text-[#2B4570] border border-[#C9D6DE]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Doctor Orders Note Preview */}
          <div className="p-3 border-t border-[#D1DCE5] bg-[#F2F6F9] space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono-chart text-[#556987]">
              <span>DOCTOR ON DUTY:</span>
              <span className="font-bold text-[#2B4570] truncate">{doctorName}</span>
            </div>
            <button
              onClick={() => handleNavClick(currentUserRole === 'doctor' ? 'patient-chart' : 'patient-booklet')}
              className="w-full py-2 px-3 rounded bg-[#2B4570] hover:bg-[#1D3254] text-[#FAF6EE] text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer font-heading"
            >
              <ClipboardList className="w-3.5 h-3.5" />
              <span>{currentUserRole === 'doctor' ? 'Write Doctor Notes' : 'View Doctor Notes'}</span>
            </button>
          </div>
        </aside>

        {/* 3. MAIN WORKSPACE VIEWPORT (GRAPH PAPER CANVAS) */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Sticky Mobile/Tablet Top Bar */}
          <header className="sticky top-[37px] z-30 bg-[#FAF6EE]/95 backdrop-blur-xs border-b border-[#D1DCE5] px-4 sm:px-6 lg:px-8 py-2.5">
            <div className="flex items-center justify-between gap-3">
              {/* Left: Mobile Navigation Trigger */}
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setMobileDrawerOpen(true)}
                  className="p-1.5 -ml-1 rounded-md text-[#2B4570] hover:bg-[#E2EAF0] transition-colors lg:hidden cursor-pointer"
                  aria-label="Open Navigation"
                >
                  <Menu className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#2B4570] font-heading">
                    {navItems.find((n) => n.id === currentNav)?.label || 'Bedside Chart'}
                  </span>
                  <span className="text-[#94A3B8] hidden sm:inline">&bull;</span>
                  <span className="text-xs text-[#556987] font-mono-chart hidden sm:inline">
                    {selectedPatient.bedNumber} &bull; {selectedPatient.name} ({selectedPatient.mrn})
                  </span>
                </div>
              </div>

              {/* Right: Quick Actions */}
              <div className="flex items-center gap-2">
                {/* Fast Bed Quick-Switcher for Mobile */}
                <div className="lg:hidden">
                  <select
                    value={selectedPatientId}
                    onChange={(e) => setSelectedPatientId(e.target.value)}
                    className="bg-[#FFFFFF] border border-[#C9D6DE] rounded px-2 py-1 text-xs font-mono-chart text-[#2B4570] font-bold"
                  >
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.bedNumber}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => handleNavClick('submit-readings')}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#FFFFFF] hover:bg-[#EEF4F8] text-[#2B4570] border border-[#C9D6DE] text-xs font-bold transition-all shadow-2xs cursor-pointer font-heading"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-[#2B4570]" />
                  <span>Submit Lab / Sweat</span>
                </button>

                <button
                  onClick={() => handleNavClick('report')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-[#2B4570] hover:bg-[#1D3254] text-[#FAF6EE] text-xs font-bold transition-all shadow-xs cursor-pointer font-heading"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Chart PDF</span>
                  <span className="sm:hidden">PDF</span>
                </button>
              </div>
            </div>
          </header>

          {/* Main Chart Body Content */}
          <main className="flex-1 px-3 sm:px-6 lg:px-8 py-5 max-w-7xl w-full mx-auto">
            {children}
          </main>

          {/* Hospital Bedside Ledger Footer */}
          <footer className="border-t border-[#D1DCE5] bg-[#F2F6F9] text-xs text-[#556987] py-4 px-4 sm:px-8 mt-auto font-mono-chart">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#2B4570] font-heading">WARD CHART</span>
                <span className="text-[#94A3B8]">&bull;</span>
                <span className="text-[11px]">
                  Blood Biochemistry &amp; Wearable Epidermal Sweat Telemetry System
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-bold text-[#2B4570]">
                <button
                  onClick={() => handleNavClick('ward-board')}
                  className="hover:underline cursor-pointer"
                >
                  Ward Board
                </button>
                <span>&bull;</span>
                <button
                  onClick={() => handleNavClick('history')}
                  className="hover:underline cursor-pointer"
                >
                  Pen-Plotted Trends
                </button>
                <span>&bull;</span>
                <button
                  onClick={() => handleNavClick('models')}
                  className="hover:underline cursor-pointer"
                >
                  ML Research Hub
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
            className="fixed inset-0 bg-[#1E293B]/60 backdrop-blur-xs"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="relative w-4/5 max-w-xs bg-[#FAF6EE] text-[#1E293B] border-r border-[#D1DCE5] p-4 flex flex-col h-full z-10 overflow-y-auto chart-paper">
            <div className="flex items-center justify-between pb-3 border-b border-[#D1DCE5]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-[#2B4570] text-[#FAF6EE] flex items-center justify-center font-bold">
                  <ClipboardList className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-[#2B4570] text-sm font-heading">Ward Chart</h3>
                  <p className="text-[10px] text-[#556987] font-mono-chart">Hospital Monitoring</p>
                </div>
              </div>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1 rounded text-[#556987] hover:bg-[#E2EAF0]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Role Switcher */}
            <div className="my-3 p-1 bg-[#E2EAF0] rounded-lg flex text-xs font-mono-chart">
              <button
                onClick={() => setCurrentUserRole('doctor')}
                className={`flex-1 py-1 rounded font-bold ${
                  currentUserRole === 'doctor' ? 'bg-[#2B4570] text-[#FAF6EE]' : 'text-[#556987]'
                }`}
              >
                Doctor View
              </button>
              <button
                onClick={() => setCurrentUserRole('patient')}
                className={`flex-1 py-1 rounded font-bold ${
                  currentUserRole === 'patient' ? 'bg-[#2B4570] text-[#FAF6EE]' : 'text-[#556987]'
                }`}
              >
                Patient View
              </button>
            </div>

            {/* Mobile Bed Selection */}
            <div className="p-2.5 bg-[#FFFFFF] border border-[#D1DCE5] rounded mb-3 space-y-1 text-xs font-mono-chart">
              <span className="text-[10px] text-[#556987] uppercase font-bold block">Active Bed:</span>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full bg-[#F2F6F9] border border-[#C9D6DE] rounded p-1 font-bold text-[#2B4570]"
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.bedNumber}: {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Nav Items */}
            <div className="space-y-1 flex-1">
              {navItems.map((route) => {
                const Icon = route.icon;
                const isActive = currentNav === route.id;
                return (
                  <button
                    key={route.id}
                    onClick={() => handleNavClick(route.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs font-semibold cursor-pointer ${
                      isActive
                        ? 'bg-[#2B4570] text-[#FAF6EE] font-bold'
                        : 'text-[#334155] hover:bg-[#EEF4F8]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4" />
                      <span>{route.label}</span>
                    </div>
                    {route.badge && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded font-mono-chart bg-[#E2EAF0] text-[#2B4570]">
                        {route.badge}
                      </span>
                    )}
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
