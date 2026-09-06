import React, { useState } from 'react';
import { useWardChart } from '../context/WardChartContext';
import { SYSTEM_USERS, UserAccount } from '../data/users';
import {
  Stethoscope,
  Building2,
  FlaskConical,
  User,
  ShieldCheck,
  CheckCircle2,
  LogIn,
  KeyRound,
  Sparkles,
  ArrowRight,
  HeartPulse,
  BellRing,
  AlertTriangle
} from 'lucide-react';

interface LoginPageProps {
  onNavigate: (pageId: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { currentUser, loginAsUser } = useWardChart();
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'patients' | 'staff'>('all');
  const [loginMessage, setLoginMessage] = useState<string | null>(null);

  const handleQuickLogin = (username: string) => {
    const success = loginAsUser(username);
    if (success) {
      setLoginMessage(`Welcome! Successfully logged in as ${username}.`);
      setTimeout(() => {
        const loggedUser = SYSTEM_USERS.find(u => u.username === username);
        if (loggedUser?.role === 'patient') {
          onNavigate('patient-alarms');
        } else if (loggedUser?.role === 'labtech') {
          onNavigate('lab-technician');
        } else if (loggedUser?.role === 'admin') {
          onNavigate('admin-console');
        } else {
          onNavigate('ward-board');
        }
      }, 350);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;
    const success = loginAsUser(usernameInput.trim());
    if (success) {
      setLoginMessage(`Logged in as ${usernameInput.trim()}`);
      setTimeout(() => {
        const loggedUser = SYSTEM_USERS.find(u => u.username.toLowerCase() === usernameInput.trim().toLowerCase());
        if (loggedUser?.role === 'patient') {
          onNavigate('patient-alarms');
        } else if (loggedUser?.role === 'labtech') {
          onNavigate('lab-technician');
        } else if (loggedUser?.role === 'admin') {
          onNavigate('admin-console');
        } else {
          onNavigate('ward-board');
        }
      }, 350);
    } else {
      setLoginMessage(`User ID "${usernameInput}" not found. Try one of the quick logins below.`);
    }
  };

  const doctorUser = SYSTEM_USERS.find(u => u.role === 'doctor')!;
  const adminUser = SYSTEM_USERS.find(u => u.role === 'admin')!;
  const labTechUser = SYSTEM_USERS.find(u => u.role === 'labtech')!;
  const patientUsers = SYSTEM_USERS.filter(u => u.role === 'patient');

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#064E3B] via-[#047857] to-[#059669] rounded-2xl p-6 sm:p-8 text-white shadow-lg border border-emerald-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-emerald-900/60 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-semibold text-emerald-200">
              <HeartPulse className="w-4 h-4 text-emerald-300 animate-pulse" />
              <span>City Hospital Management & Telemetry System</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Hospital Login & Role-Based Access Control
            </h1>
            <p className="text-emerald-100 text-sm sm:text-base max-w-2xl leading-relaxed">
              Login to your specialized portal. Doctor has full patient care rights; patients access only their own medical data, timed medicine alarms, and doctor precaution updates.
            </p>
          </div>

          {/* Current Active User Card */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 min-w-[260px] text-white">
            <div className="text-xs uppercase text-emerald-200 font-bold tracking-wider mb-1">
              Currently Logged In As
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{currentUser.avatar || '👤'}</span>
              <div>
                <div className="font-bold text-sm sm:text-base text-white">{currentUser.name}</div>
                <div className="text-xs text-emerald-200 capitalize font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                  Role: {currentUser.role}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {loginMessage && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-xl flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2 font-medium text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{loginMessage}</span>
          </div>
        </div>
      )}

      {/* Manual Login Form */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
              <KeyRound className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Sign In with User ID</h2>
            <p className="text-sm text-slate-500 mt-1">
              Enter any authorized ID (e.g., <code className="bg-slate-100 px-1.5 py-0.5 rounded text-emerald-700 font-bold">doctor</code>, <code className="bg-slate-100 px-1.5 py-0.5 rounded text-emerald-700 font-bold">ram</code>, <code className="bg-slate-100 px-1.5 py-0.5 rounded text-emerald-700 font-bold">anu</code>, <code className="bg-slate-100 px-1.5 py-0.5 rounded text-emerald-700 font-bold">labtech</code>, <code className="bg-slate-100 px-1.5 py-0.5 rounded text-emerald-700 font-bold">admin</code>)
            </p>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Login Username / ID
              </label>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="e.g. ram, doctor, labtech, admin"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium text-sm focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password (Demo - optional)
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium text-sm focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Login to Account</span>
            </button>
          </form>
        </div>
      </div>

      {/* 1-Touch Role Fast Switch Cards */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <span>Instant 1-Touch Role Selectors</span>
            </h2>
            <p className="text-sm text-slate-500">
              Click any profile card below to instantly test its access permissions.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'all' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Roles ({SYSTEM_USERS.length})
            </button>
            <button
              onClick={() => setActiveTab('staff')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'staff' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Medical Staff (3)
            </button>
            <button
              onClick={() => setActiveTab('patients')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'patients' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Patients ({patientUsers.length})
            </button>
          </div>
        </div>

        {/* Staff Cards */}
        {(activeTab === 'all' || activeTab === 'staff') && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Hospital Staff & Administration
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Doctor Card */}
              <div
                onClick={() => handleQuickLogin(doctorUser.username)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer hover:shadow-md bg-white ${
                  currentUser.role === 'doctor'
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/20'
                    : 'border-slate-200 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-2xl shadow-xs">
                    👨‍⚕️
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase">
                    1 Doctor ID
                  </span>
                </div>
                <div className="mt-4 space-y-1">
                  <h4 className="font-bold text-slate-900 text-base">{doctorUser.name}</h4>
                  <div className="text-xs text-emerald-700 font-medium">{doctorUser.friendlyTitle}</div>
                  <div className="text-xs text-slate-500 font-mono">Login ID: <strong className="text-slate-800">{doctorUser.username}</strong></div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                  <p className="font-medium text-emerald-800">Rights:</p>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-500 text-[11px]">
                    <li>View all 12 patients & full charts</li>
                    <li>Change tablets, doses, & precautions</li>
                    <li>Analyze symptoms & issue discharge</li>
                  </ul>
                </div>
                <button className="mt-4 w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors">
                  <span>Enter as Doctor</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Lab Technician Card */}
              <div
                onClick={() => handleQuickLogin(labTechUser.username)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer hover:shadow-md bg-white ${
                  currentUser.role === 'labtech'
                    ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/20'
                    : 'border-slate-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center text-2xl shadow-xs">
                    🔬
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200 uppercase">
                    Lab Technician
                  </span>
                </div>
                <div className="mt-4 space-y-1">
                  <h4 className="font-bold text-slate-900 text-base">{labTechUser.name}</h4>
                  <div className="text-xs text-blue-700 font-medium">{labTechUser.friendlyTitle}</div>
                  <div className="text-xs text-slate-500 font-mono">Login ID: <strong className="text-slate-800">{labTechUser.username}</strong></div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                  <p className="font-medium text-blue-800">Rights:</p>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-500 text-[11px]">
                    <li>Update Blood & Sweat Lab Reports</li>
                    <li>Recalculate ML Risk & Disease Severity</li>
                    <li>Send Diagnostic Alerts to Patients</li>
                  </ul>
                </div>
                <button className="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors">
                  <span>Enter Lab Workbench</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Admin Card */}
              <div
                onClick={() => handleQuickLogin(adminUser.username)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer hover:shadow-md bg-white ${
                  currentUser.role === 'admin'
                    ? 'border-purple-500 ring-2 ring-purple-500/20 bg-purple-50/20'
                    : 'border-slate-200 hover:border-purple-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center text-2xl shadow-xs">
                    🏢
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-200 uppercase">
                    Hospital Admin
                  </span>
                </div>
                <div className="mt-4 space-y-1">
                  <h4 className="font-bold text-slate-900 text-base">{adminUser.name}</h4>
                  <div className="text-xs text-purple-700 font-medium">{adminUser.friendlyTitle}</div>
                  <div className="text-xs text-slate-500 font-mono">Login ID: <strong className="text-slate-800">{adminUser.username}</strong></div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                  <p className="font-medium text-purple-800">Rights:</p>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-500 text-[11px]">
                    <li>Overall Control of App</li>
                    <li>Add New Patients & Full Records</li>
                    <li>Delete Patients with Safety Lock</li>
                  </ul>
                </div>
                <button className="mt-4 w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors">
                  <span>Enter Admin Console</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Patient Cards */}
        {(activeTab === 'all' || activeTab === 'patients') && (
          <div className="space-y-3 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Patient Logins ({patientUsers.length} Individual Patient Accounts)
              </h3>
              <span className="text-xs text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                🔒 Security Enforced: Patient can only access their own data
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {patientUsers.map((pat) => {
                const isCurrent = currentUser.username === pat.username;
                return (
                  <div
                    key={pat.id}
                    onClick={() => handleQuickLogin(pat.username)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-md bg-white flex flex-col justify-between ${
                      isCurrent
                        ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/20'
                        : 'border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-3xl">{pat.avatar}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          ID: {pat.username}
                        </span>
                      </div>

                      <div className="mt-3 space-y-0.5">
                        <h4 className="font-bold text-slate-900 text-sm">{pat.name}</h4>
                        <div className="text-xs text-emerald-700 font-semibold">{pat.friendlyTitle}</div>
                      </div>

                      <div className="mt-2 text-[11px] text-slate-500 space-y-0.5">
                        <div>Bed ID: <strong className="text-slate-800">{pat.assignedPatientId?.toUpperCase()}</strong></div>
                        <div>Contact: <span className="font-mono text-slate-600">{pat.phone}</span></div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <button className="w-full py-1.5 bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-800 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors">
                        <span>Sign In as {pat.username}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
