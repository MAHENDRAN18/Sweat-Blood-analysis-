import React, { useState } from 'react';
import { useWardChart } from '../context/WardChartContext';
import {
  Building2,
  Users,
  UserPlus,
  Trash2,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Bed,
  Phone,
  Search,
  RefreshCw,
  Sparkles,
  HeartPulse,
  Sliders,
  ChevronRight,
  X
} from 'lucide-react';
import { PatientChartProfile } from '../types';

interface AdminManagementPageProps {
  onNavigate: (pageId: string) => void;
}

export const AdminManagementPage: React.FC<AdminManagementPageProps> = ({ onNavigate }) => {
  const {
    patients,
    deletePatient,
    admitNewPatient,
    resetToSampleData,
    setSelectedPatientId,
    currentUser,
  } = useWardChart();

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<PatientChartProfile | null>(null);
  const [adminMessage, setAdminMessage] = useState<string | null>(null);

  // New patient form state
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState('48');
  const [newSex, setNewSex] = useState<'male' | 'female'>('male');
  const [newBed, setNewBed] = useState(`Bed ${patients.length + 1}`);
  const [newDiagnosis, setNewDiagnosis] = useState('Hypertension & Pre-Diabetes');
  const [newBpSystolic, setNewBpSystolic] = useState('138');
  const [newBpDiastolic, setNewBpDiastolic] = useState('88');
  const [newGlucose, setNewGlucose] = useState('130');

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.bedNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.primaryDiagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleConfirmDelete = () => {
    if (!patientToDelete) return;
    const success = deletePatient(patientToDelete.id);
    if (success) {
      setAdminMessage(`Patient ${patientToDelete.name} (${patientToDelete.bedNumber}) removed successfully.`);
    } else {
      setAdminMessage('Cannot delete the last remaining patient in the hospital.');
    }
    setPatientToDelete(null);
    setTimeout(() => setAdminMessage(null), 4000);
  };

  const handleAddNewPatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const displayName = newName.trim();

    const newId = admitNewPatient({
      name: displayName,
      age: parseInt(newAge) || 45,
      sex: newSex,
      bedNumber: newBed,
      primaryDiagnosis: newDiagnosis,
      healthData: {
        name: displayName,
        age: parseInt(newAge) || 45,
        sex: newSex,
        height_cm: 168,
        weight_kg: 68,
        bmi: 24.1,
        systolic_bp: parseInt(newBpSystolic) || 125,
        diastolic_bp: parseInt(newBpDiastolic) || 82,
        resting_heart_rate: 74,
        spo2: 98,
        fasting_glucose: parseInt(newGlucose) || 110,
        hba1c: 6.0,
        total_cholesterol: 185,
        ldl_cholesterol: 110,
        hdl_cholesterol: 48,
        triglycerides: 135,
        serum_creatinine: 0.95,
        bun: 16,
        egfr: 92,
        sweat_glucose: 1.0,
        sweat_lactate: 2.0,
        sweat_sodium: 44,
        sweat_potassium: 4.6,
        sweat_cortisol: 1.6,
        physical_activity_hours: 2.0,
        smoking_status: 'never',
        alcohol_intake: 'none',
        sleep_hours_per_night: 7.0,
        stress_index: 4,
        hydration_liters_per_day: 2.0,
        daily_fatigue_score: 3,
      },
    });

    setAdminMessage(`New patient ${displayName} successfully admitted to ${newBed}. Full medical profile generated.`);
    setShowAddModal(false);
    setNewName('');
    setTimeout(() => setAdminMessage(null), 5000);
  };

  const totalPatients = patients.length;
  const criticalCount = patients.filter((p) => p.riskTier === 'Critical Health Alert' || p.riskTier === 'High Risk').length;
  const recoveredCount = patients.filter((p) => p.patientStatus === 'fully_recovered').length;
  const dischargedCount = patients.filter((p) => p.patientStatus === 'discharged').length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Admin Header Banner */}
      <div className="bg-gradient-to-r from-purple-800 via-indigo-900 to-purple-900 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-purple-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-purple-950/60 border border-purple-400/30 px-3 py-1 rounded-full text-xs font-semibold text-purple-200">
              <Building2 className="w-4 h-4 text-purple-300" />
              <span>Hospital Master Administration &amp; Patient Registry</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Hospital Admin Overall Control Console
            </h1>
            <p className="text-purple-100 text-sm sm:text-base max-w-2xl leading-relaxed">
              Full administrative rights over the hospital management application. Add new patients, safely remove records, review ward capacity, and supervise role privileges.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Admit New Patient</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Reset hospital database to default patient records?')) {
                  resetToSampleData();
                  setAdminMessage('Hospital data reset to initial default dataset.');
                  setTimeout(() => setAdminMessage(null), 3500);
                }
              }}
              className="px-4 py-2.5 bg-purple-700/60 hover:bg-purple-700 text-purple-100 hover:text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 border border-purple-500 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset Data</span>
            </button>
          </div>
        </div>
      </div>

      {adminMessage && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-950 px-5 py-4 rounded-xl flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3 font-semibold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{adminMessage}</span>
          </div>
        </div>
      )}

      {/* Hospital Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Patients</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{totalPatients}</div>
          <div className="text-xs text-emerald-700 mt-1 font-medium">All beds monitored</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="text-xs text-red-600 font-bold uppercase tracking-wider">High Risk / Alert</div>
          <div className="text-2xl font-extrabold text-red-600 mt-1">{criticalCount}</div>
          <div className="text-xs text-slate-500 mt-1 font-medium">Need immediate review</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="text-xs text-blue-600 font-bold uppercase tracking-wider">Discharged Home</div>
          <div className="text-2xl font-extrabold text-blue-700 mt-1">{dischargedCount}</div>
          <div className="text-xs text-slate-500 mt-1 font-medium">Under home recovery</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="text-xs text-emerald-600 font-bold uppercase tracking-wider">100% Recovered</div>
          <div className="text-2xl font-extrabold text-emerald-700 mt-1">{recoveredCount}</div>
          <div className="text-xs text-slate-500 mt-1 font-medium">Clinically cleared</div>
        </div>
      </div>

      {/* Patient Census Master Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-700" />
              <span>Patient Census &amp; Hospital Registry ({filteredPatients.length} Active Records)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Admin rights: You can view any patient chart, admit new patients, or delete records.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by patient name, bed, or diagnosis..."
              className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-purple-600"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Bed &amp; MRN</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Age / Sex</th>
                <th className="py-3 px-4">Diagnosis &amp; Severity</th>
                <th className="py-3 px-4">Status &amp; Recovery</th>
                <th className="py-3 px-4 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPatients.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    <div>{p.bedNumber}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{p.mrn}</div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-extrabold text-slate-900 text-sm">{p.name}</div>
                    <div className="text-[11px] text-purple-700 font-medium">{p.attendingDoctor}</div>
                  </td>

                  <td className="py-3 px-4 text-slate-600">
                    {p.age} yrs &bull; <span className="capitalize">{p.sex}</span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-900 truncate max-w-[200px]">
                      {p.primaryDiagnosis}
                    </div>
                    <div className="mt-1">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          p.riskTier === 'Critical Health Alert'
                            ? 'bg-red-100 text-red-800'
                            : p.riskTier === 'High Risk'
                            ? 'bg-orange-100 text-orange-800'
                            : p.riskTier === 'Moderate Risk'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {p.riskTier} ({p.riskScore}%)
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-800">{p.recoveryStatus.percentRecovered}%</span>
                      <span className="text-[10px] text-slate-500 capitalize">
                        ({p.patientStatus.replace('_', ' ')})
                      </span>
                    </div>
                    <div className="w-24 bg-slate-200 h-1.5 rounded-full mt-1 overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full"
                        style={{ width: `${p.recoveryStatus.percentRecovered}%` }}
                      ></div>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => {
                        setSelectedPatientId(p.id);
                        onNavigate('patient-chart');
                      }}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 rounded-lg font-bold text-[11px] transition-colors cursor-pointer border border-slate-200"
                    >
                      View Chart
                    </button>

                    <button
                      onClick={() => setPatientToDelete(p)}
                      title="Delete patient record"
                      className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg font-bold text-[11px] transition-colors cursor-pointer border border-red-200"
                    >
                      <Trash2 className="w-3.5 h-3.5 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {patientToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-red-100 text-red-700 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-bold text-lg text-slate-900">Delete Patient Record?</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to remove <strong className="text-slate-800">{patientToDelete.name}</strong> ({patientToDelete.bedNumber}) from the hospital system?
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                onClick={() => setPatientToDelete(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs cursor-pointer shadow-xs"
              >
                Yes, Delete Patient
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADMIT NEW PATIENT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-xl border border-slate-200 space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-emerald-600" />
                  <span>Admit New Patient to Hospital</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Creates patient record, generates initial alarms, and sets up diagnostic tracking.
                </p>
              </div>

              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewPatientSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. George Peterson"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    value={newAge}
                    onChange={(e) => setNewAge(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Gender
                  </label>
                  <select
                    value={newSex}
                    onChange={(e) => setNewSex(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600 cursor-pointer"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Bed Number
                  </label>
                  <input
                    type="text"
                    value={newBed}
                    onChange={(e) => setNewBed(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Primary Diagnosis
                  </label>
                  <input
                    type="text"
                    value={newDiagnosis}
                    onChange={(e) => setNewDiagnosis(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Systolic BP (mmHg)
                  </label>
                  <input
                    type="number"
                    value={newBpSystolic}
                    onChange={(e) => setNewBpSystolic(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Diastolic BP (mmHg)
                  </label>
                  <input
                    type="number"
                    value={newBpDiastolic}
                    onChange={(e) => setNewBpDiastolic(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Fasting Glucose (mg/dL)
                  </label>
                  <input
                    type="number"
                    value={newGlucose}
                    onChange={(e) => setNewGlucose(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl cursor-pointer shadow-xs"
                >
                  Admit Patient &amp; Create Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
