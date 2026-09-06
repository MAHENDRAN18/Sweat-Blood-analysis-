import React, { useState } from 'react';
import { useWardChart } from '../context/WardChartContext';
import {
  Bell,
  BellRing,
  Clock,
  CheckCircle2,
  AlertCircle,
  Volume2,
  VolumeX,
  Send,
  Droplets,
  Heart,
  Pill,
  Sparkles,
  ShieldAlert,
  Flame,
  Activity,
  Smile,
  MessageSquare,
  Calendar,
  Info,
  ChevronRight
} from 'lucide-react';

interface PatientAlarmsPageProps {
  onNavigate: (pageId: string) => void;
}

export const PatientAlarmsPage: React.FC<PatientAlarmsPageProps> = ({ onNavigate }) => {
  const {
    selectedPatient,
    patientAlarms,
    acknowledgeAlarm,
    snoozeAlarm,
    testAlarmSound,
    announceAlarmSpeech,
    patientNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    currentUser,
    submitPatientSymptomUpdate,
  } = useWardChart();

  const [activeTab, setActiveTab] = useState<'alarms' | 'notifications' | 'symptoms'>('alarms');
  const [quickSymptomText, setQuickSymptomText] = useState('');
  const [selectedFeeling, setSelectedFeeling] = useState<string | null>(null);
  const [sentSuccess, setSentSuccess] = useState(false);

  // Group alarms by time period
  const morningAlarms = patientAlarms.filter((a) => a.period === 'morning');
  const afternoonAlarms = patientAlarms.filter((a) => a.period === 'afternoon');
  const eveningAlarms = patientAlarms.filter((a) => a.period === 'evening');
  const nightAlarms = patientAlarms.filter((a) => a.period === 'night');

  const unreadNotifs = patientNotifications.filter((n) => !n.read);

  const handleTestAlarm = (title: string, instructions: string) => {
    testAlarmSound('chime');
    announceAlarmSpeech(`Reminder for ${selectedPatient.name}. ${title}. ${instructions}`);
  };

  const handleSendQuickSymptom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickSymptomText && !selectedFeeling) return;

    submitPatientSymptomUpdate(selectedPatient.id, {
      patientComments: `${selectedFeeling ? `[Status: ${selectedFeeling}] ` : ''}${quickSymptomText || 'Feeling updated by patient'}`,
      reportedSymptoms: selectedFeeling ? [selectedFeeling] : ['General update'],
      severityLevel: selectedFeeling === 'Feeling Dizzy' ? 'Moderate' : 'Mild',
    });

    setQuickSymptomText('');
    setSelectedFeeling(null);
    setSentSuccess(true);
    setTimeout(() => setSentSuccess(false), 3500);
  };

  const isRecovered = selectedPatient.recoveryStatus.isFullyRecovered;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* 1. TOP FRIENDLY WELCOME BANNER (DESIGNED FOR EASY COMPREHENSION) */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-emerald-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-white/20 px-3.5 py-1 rounded-full text-xs font-bold text-white tracking-wide">
              <span>🩺 Daily Health & Medication Care</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight flex items-center gap-3">
              <span>Hello, {selectedPatient.name}</span>
              <span className="text-3xl">👋</span>
            </h1>

            <p className="text-emerald-50 text-sm sm:text-base max-w-2xl leading-relaxed">
              Here is your easy medication and wellness timetable. When an alarm rings, please remember to take your prescribed tablets or check your vitals.
            </p>
          </div>

          {/* Big Recovery Meter Card */}
          <div className="bg-white text-slate-900 rounded-2xl p-5 min-w-[280px] shadow-sm border border-emerald-100 flex items-center gap-4">
            <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100"
                  strokeWidth="4"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={`${isRecovered ? 'text-emerald-500' : 'text-teal-600'} transition-all duration-1000`}
                  strokeDasharray={`${selectedPatient.recoveryStatus.percentRecovered}, 100`}
                  strokeWidth="4"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute font-extrabold text-base text-slate-800">
                {selectedPatient.recoveryStatus.percentRecovered}%
              </span>
            </div>

            <div className="space-y-0.5">
              <div className="text-xs uppercase font-bold text-emerald-800 flex items-center gap-1">
                <Smile className="w-4 h-4 text-emerald-600" />
                <span>Recovery Progress</span>
              </div>
              <div className="text-base font-extrabold text-slate-900">
                {isRecovered ? 'Fully Recovered (100%)' : selectedPatient.recoveryStatus.recoveryStage}
              </div>
              <div className="text-xs text-slate-500 font-medium">
                {selectedPatient.attendingDoctor}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. DOCTOR PRECAUTION UPDATE NOTIFICATION BANNER */}
      {unreadNotifs.length > 0 && (
        <div className="bg-amber-50 border-2 border-amber-400 rounded-2xl p-4 sm:p-5 text-amber-950 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-pulse">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <BellRing className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="font-extrabold text-sm sm:text-base flex items-center gap-2">
                <span>Doctor's Care Notice! ({unreadNotifs.length} New Alerts)</span>
                <span className="bg-amber-200 text-amber-900 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
                  Doctor Updated Care
                </span>
              </div>
              <p className="text-xs sm:text-sm text-amber-900 mt-0.5 leading-relaxed">
                {unreadNotifs[0].title}: {unreadNotifs[0].message}
              </p>
            </div>
          </div>

          <button
            onClick={markAllNotificationsAsRead}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white rounded-xl text-xs font-bold shrink-0 transition-colors shadow-xs cursor-pointer"
          >
            Got It, Mark as Read
          </button>
        </div>
      )}

      {/* 3. NAVIGATION TABS */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('alarms')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'alarms'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Medication Alarms</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
              activeTab === 'alarms' ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {patientAlarms.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'notifications'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Doctor's Updates</span>
            {unreadNotifs.length > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-extrabold animate-pulse">
                {unreadNotifs.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('symptoms')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'symptoms'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Check In With Doctor</span>
          </button>
        </div>

        {/* Universal Chime Sound Test Button */}
        <button
          onClick={() => {
            testAlarmSound('chime');
            announceAlarmSpeech('Alarm sound test. Systems are working clearly.');
          }}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer border border-slate-300 shadow-xs"
        >
          <Volume2 className="w-4 h-4 text-emerald-600" />
          <span>Test Alarm Sound</span>
        </button>
      </div>

      {/* 4. TAB 1: ALARMS & MEDICINE TIMETABLE */}
      {activeTab === 'alarms' && (
        <div className="space-y-8">
          {/* A. MORNING SECTION */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-amber-800 font-extrabold text-lg">
              <span className="text-2xl">☀️</span>
              <h2>Morning Schedule (07:30 - 08:30 AM)</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {morningAlarms.map((alarm) => (
                <div
                  key={alarm.id}
                  className={`bg-white border-2 rounded-2xl p-5 transition-all shadow-xs flex flex-col justify-between ${
                    alarm.status === 'taken'
                      ? 'border-emerald-300 bg-emerald-50/30'
                      : alarm.status === 'snoozed'
                      ? 'border-amber-300 bg-amber-50/20'
                      : 'border-slate-200 hover:border-emerald-400'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-xl shrink-0">
                          {alarm.category === 'vitals' ? '🩺' : '💊'}
                        </div>
                        <div>
                          <div className="text-base font-extrabold text-slate-900 leading-tight">
                            {alarm.title}
                          </div>
                          {alarm.friendlyLabel && (
                            <div className="text-xs font-bold text-emerald-700">
                              {alarm.friendlyLabel}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="px-3 py-1 rounded-full text-xs font-extrabold font-mono bg-amber-100 text-amber-800 border border-amber-200">
                        {alarm.time}
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 space-y-1">
                      <div>
                        <strong>Instructions:</strong> {alarm.instructions}
                      </div>
                      {alarm.dose && (
                        <div>
                          <strong>Dose:</strong> <span className="font-bold text-emerald-800">{alarm.dose}</span> ({alarm.foodRelation === 'after_food' ? 'Take after breakfast' : 'Take before food'})
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {alarm.status === 'taken' ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Taken ({alarm.lastAcknowledgedAt || 'Completed'})</span>
                        </span>
                      ) : alarm.status === 'snoozed' ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 border border-amber-300">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>Snoozed 10 mins</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                          <span>Pending</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleTestAlarm(alarm.title, alarm.instructions)}
                        title="Read aloud reminder"
                        className="p-2 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 rounded-xl transition-colors cursor-pointer border border-slate-200"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => snoozeAlarm(alarm.id, 10)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-800 rounded-xl text-xs font-bold transition-colors cursor-pointer border border-slate-200"
                      >
                        Snooze (10m)
                      </button>

                      <button
                        onClick={() => acknowledgeAlarm(alarm.id)}
                        className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center gap-1 ${
                          alarm.status === 'taken'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark as Taken</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* B. AFTERNOON & EVENING SECTION */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-lg">
              <span className="text-2xl">🌤️</span>
              <h2>Afternoon & Evening Schedule (01:00 PM - 05:00 PM)</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...afternoonAlarms, ...eveningAlarms].map((alarm) => (
                <div
                  key={alarm.id}
                  className={`bg-white border-2 rounded-2xl p-5 transition-all shadow-xs flex flex-col justify-between ${
                    alarm.status === 'taken'
                      ? 'border-emerald-300 bg-emerald-50/30'
                      : 'border-slate-200 hover:border-emerald-400'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center text-xl shrink-0">
                          {alarm.category === 'water' ? '💧' : '💊'}
                        </div>
                        <div>
                          <div className="text-base font-extrabold text-slate-900 leading-tight">
                            {alarm.title}
                          </div>
                          {alarm.friendlyLabel && (
                            <div className="text-xs font-bold text-teal-700">
                              {alarm.friendlyLabel}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="px-3 py-1 rounded-full text-xs font-extrabold font-mono bg-teal-100 text-teal-800 border border-teal-200">
                        {alarm.time}
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 space-y-1">
                      <div>
                        <strong>Instructions:</strong> {alarm.instructions}
                      </div>
                      {alarm.dose && (
                        <div>
                          <strong>Dose:</strong> <span className="font-bold text-teal-800">{alarm.dose}</span> ({alarm.foodRelation === 'after_food' ? 'Take after lunch' : 'Anytime'})
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      {alarm.status === 'taken' ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Completed</span>
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500 font-medium">Ready & Scheduled</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleTestAlarm(alarm.title, alarm.instructions)}
                        className="p-2 bg-slate-100 hover:bg-emerald-50 text-slate-700 rounded-xl transition-colors cursor-pointer border border-slate-200"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => acknowledgeAlarm(alarm.id)}
                        className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center gap-1 ${
                          alarm.status === 'taken'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark as Taken</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* C. NIGHT SECTION */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-indigo-900 font-extrabold text-lg">
              <span className="text-2xl">🌙</span>
              <h2>Night Schedule (09:00 PM)</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {nightAlarms.map((alarm) => (
                <div
                  key={alarm.id}
                  className={`bg-white border-2 rounded-2xl p-5 transition-all shadow-xs flex flex-col justify-between ${
                    alarm.status === 'taken'
                      ? 'border-emerald-300 bg-emerald-50/30'
                      : 'border-slate-200 hover:border-indigo-400'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-xl shrink-0">
                          💊
                        </div>
                        <div>
                          <div className="text-base font-extrabold text-slate-900 leading-tight">
                            {alarm.title}
                          </div>
                          {alarm.friendlyLabel && (
                            <div className="text-xs font-bold text-indigo-700">
                              {alarm.friendlyLabel}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="px-3 py-1 rounded-full text-xs font-extrabold font-mono bg-indigo-100 text-indigo-800 border border-indigo-200">
                        {alarm.time}
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 space-y-1">
                      <div>
                        <strong>Instructions:</strong> {alarm.instructions}
                      </div>
                      {alarm.dose && (
                        <div>
                          <strong>Dose:</strong> <span className="font-bold text-indigo-800">{alarm.dose}</span> (Take before sleep)
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      {alarm.status === 'taken' ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Completed</span>
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500 font-medium">Night Alarm</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleTestAlarm(alarm.title, alarm.instructions)}
                        className="p-2 bg-slate-100 hover:bg-emerald-50 text-slate-700 rounded-xl transition-colors cursor-pointer border border-slate-200"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => acknowledgeAlarm(alarm.id)}
                        className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center gap-1 ${
                          alarm.status === 'taken'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark as Taken</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB 2: DOCTOR NOTIFICATIONS & PRECAUTION ADJUSTMENTS */}
      {activeTab === 'notifications' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Bell className="w-5 h-5 text-emerald-600" />
                <span>Doctor's Care Updates & Prescriptions</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Any updates to your tablets or care precautions by your doctor appear here immediately.
              </p>
            </div>

            {unreadNotifs.length > 0 && (
              <button
                onClick={markAllNotificationsAsRead}
                className="px-3 py-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                Mark All as Read
              </button>
            )}
          </div>

          <div className="space-y-3">
            {patientNotifications.length === 0 ? (
              <div className="text-center py-10 text-slate-500">
                No notifications right now.
              </div>
            ) : (
              patientNotifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markNotificationAsRead(n.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    !n.read
                      ? 'border-emerald-400 bg-emerald-50/40 ring-1 ring-emerald-300'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                        {n.type === 'medication_change' ? '💊' : n.type === 'precaution_change' ? '⚠️' : '📋'}
                      </div>
                      <div className="space-y-1">
                        <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                          <span>{n.title}</span>
                          {!n.read && (
                            <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block"></span>
                          )}
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed">{n.message}</p>
                        {n.doctorName && (
                          <div className="text-[11px] font-semibold text-emerald-800">
                            Dr: {n.doctorName}
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">
                      {n.timestamp}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 6. TAB 3: REPORT SYMPTOMS & HOME VITALS TO DOCTOR */}
      {activeTab === 'symptoms' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-600" />
              <span>Report Your Condition to Doctor</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Are you experiencing any fatigue, dizziness, or chest discomfort? Choose below to let your doctor know right away.
            </p>
          </div>

          {sentSuccess && (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-bold">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Thank you! Your health report has been sent directly to Dr. Alexander Wright, MD.</span>
            </div>
          )}

          {/* Quick Feeling Buttons (Pictorial 1-Touch for Laypeople) */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              1. How are you feeling right now? (Quick Select)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Feeling Great', icon: '😊', desc: 'No pain or discomfort' },
                { label: 'A Bit Tired', icon: '😴', desc: 'Mild body fatigue' },
                { label: 'Feeling Dizzy', icon: '💫', desc: 'Lightheaded or faint' },
                { label: 'Swelling', icon: '🦶', desc: 'Swelling in ankles/feet' },
              ].map((item) => {
                const isSel = selectedFeeling === item.label;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setSelectedFeeling(item.label)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSel
                        ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-600/20'
                        : 'border-slate-200 hover:border-emerald-300 bg-slate-50/50'
                    }`}
                  >
                    <div className="text-2xl mb-1">{item.icon}</div>
                    <div className="font-bold text-xs text-slate-900">{item.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{item.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSendQuickSymptom} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                2. Would you like to write a note to your doctor? (Optional)
              </label>
              <textarea
                rows={3}
                value={quickSymptomText}
                onChange={(e) => setQuickSymptomText(e.target.value)}
                placeholder="Example: Felt slight dizziness after morning dose, but feeling better now after drinking water..."
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Send Update to Doctor</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
