import React, { useState } from 'react';
import { useWardChart } from '../context/WardChartContext';
import {
  FileSpreadsheet,
  Droplets,
  Activity,
  CheckCircle2,
  Upload,
  Download,
  AlertCircle,
  ArrowRight,
  ClipboardList,
  Flame,
  FileText
} from 'lucide-react';

interface SubmitReadingsPageProps {
  onNavigate: (pageId: string) => void;
}

export const SubmitReadingsPage: React.FC<SubmitReadingsPageProps> = ({ onNavigate }) => {
  const {
    selectedPatient,
    patients,
    setSelectedPatientId,
    submitPatientReadings,
    batchUploadCsvReadings,
    currentUserRole,
  } = useWardChart();

  // Form State initialized from selected patient's current readings
  const [systolic, setSystolic] = useState(selectedPatient.healthData.systolic_bp || 120);
  const [diastolic, setDiastolic] = useState(selectedPatient.healthData.diastolic_bp || 80);
  const [fastingGlucose, setFastingGlucose] = useState(selectedPatient.healthData.fasting_glucose || 95);
  const [hba1c, setHba1c] = useState(selectedPatient.healthData.hba1c || 5.4);
  const [serumCreatinine, setSerumCreatinine] = useState(selectedPatient.healthData.serum_creatinine || 0.9);
  const [totalCholesterol, setTotalCholesterol] = useState(selectedPatient.healthData.total_cholesterol || 185);
  const [ldlCholesterol, setLdlCholesterol] = useState(selectedPatient.healthData.ldl_cholesterol || 105);
  const [hdlCholesterol, setHdlCholesterol] = useState(selectedPatient.healthData.hdl_cholesterol || 55);
  const [triglycerides, setTriglycerides] = useState(selectedPatient.healthData.triglycerides || 120);

  // Sweat Biomarkers
  const [sweatLactate, setSweatLactate] = useState(selectedPatient.healthData.sweat_lactate || 1.8);
  const [sweatCortisol, setSweatCortisol] = useState(selectedPatient.healthData.sweat_cortisol || 1.2);
  const [sweatGlucose, setSweatGlucose] = useState(selectedPatient.healthData.sweat_glucose || 0.6);
  const [sweatSodium, setSweatSodium] = useState(selectedPatient.healthData.sweat_sodium || 42);
  const [sweatPotassium, setSweatPotassium] = useState(selectedPatient.healthData.sweat_potassium || 5.6);
  const [sweatPh, setSweatPh] = useState(selectedPatient.healthData.sweat_ph || 5.5);

  // Submission feedback
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [csvMessage, setCsvMessage] = useState<string | null>(null);
  const [csvError, setCsvError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    submitPatientReadings(selectedPatient.id, {
      systolic_bp: Number(systolic),
      diastolic_bp: Number(diastolic),
      fasting_glucose: Number(fastingGlucose),
      hba1c: Number(hba1c),
      serum_creatinine: Number(serumCreatinine),
      total_cholesterol: Number(totalCholesterol),
      ldl_cholesterol: Number(ldlCholesterol),
      hdl_cholesterol: Number(hdlCholesterol),
      triglycerides: Number(triglycerides),
      sweat_lactate: Number(sweatLactate),
      sweat_cortisol: Number(sweatCortisol),
      sweat_glucose: Number(sweatGlucose),
      sweat_sodium: Number(sweatSodium),
      sweat_potassium: Number(sweatPotassium),
      sweat_ph: Number(sweatPh),
    });

    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 5000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const result = batchUploadCsvReadings(selectedPatient.id, text);
        if (result.success) {
          setCsvMessage(result.message);
          setCsvError(null);
        } else {
          setCsvError(result.message);
          setCsvMessage(null);
        }
      }
    };
    reader.readAsText(file);
  };

  const downloadSampleCsv = () => {
    const csvContent =
      'timestamp,systolic_bp,diastolic_bp,fasting_glucose,hba1c,serum_creatinine,sweat_lactate,sweat_cortisol,sweat_glucose,sweat_sodium\n' +
      '2026-09-01 08:00,122,80,96,5.4,0.9,1.7,1.1,0.5,41\n' +
      '2026-09-01 14:00,128,82,102,5.4,0.9,2.0,1.3,0.7,43\n' +
      '2026-09-02 08:00,134,86,118,5.5,1.0,2.3,1.4,0.8,46\n';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ward_chart_sample_${selectedPatient.mrn}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 1. HEADER BANNER */}
      <div className="bg-[#FFFFFF] border-2 border-[#2B4570] rounded-lg p-5 shadow-xs chart-paper">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D1DCE5] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono-chart uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#2B4570] text-[#FAF6EE]">
                DATA INTAKE &bull; DUAL STREAM
              </span>
              <span className="text-xs font-mono-chart text-[#556987]">
                Bed: {selectedPatient.bedNumber} ({selectedPatient.mrn})
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#2B4570] font-heading mt-1">
              Submit Patient Biomarker Readings
            </h1>
            <p className="text-xs text-[#556987] font-mono-chart mt-0.5">
              Enter updated blood laboratory values or sync wearable sweat patch telemetry data
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-[#FAF6EE] border border-[#C9D6DE] rounded p-1.5 text-xs font-mono-chart">
              <span className="text-[#556987] font-bold">Inpatient:</span>
              <select
                value={selectedPatient.id}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="bg-transparent font-bold text-[#2B4570] focus:outline-none cursor-pointer"
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.bedNumber}: {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {submitSuccess && (
          <div className="mt-4 p-3 bg-[#EAFAF1] border border-[#A9DFBF] text-[#1E824C] rounded-md flex items-center justify-between text-xs font-mono-chart">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#6B8F71]" />
              <span>
                <strong>Readings Successfully Logged!</strong> AI risk assessment recalculated and added to timepoint progression.
              </span>
            </div>
            <button
              onClick={() => onNavigate(currentUserRole === 'doctor' ? 'patient-chart' : 'patient-booklet')}
              className="font-bold underline flex items-center gap-1 cursor-pointer"
            >
              View Chart <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* 2. MANUAL SUBMISSION FORM */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Section A: Blood Chemistry */}
          <div className="bg-[#FFFFFF] border-2 border-[#2B4570] rounded-lg p-5 chart-paper shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b-2 border-[#2B4570] pb-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#2B4570]" />
                <h3 className="text-base font-bold text-[#2B4570] font-heading uppercase">
                  Section A: Blood Chemistry
                </h3>
              </div>
              <span className="text-[10px] font-mono-chart bg-[#E2EAF0] text-[#2B4570] px-2 py-0.5 rounded font-bold">
                Certified Lab
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono-chart">
              <div>
                <label className="font-bold text-[#1E293B] block mb-1">Systolic BP (mmHg):</label>
                <input
                  type="number"
                  required
                  value={systolic}
                  onChange={(e) => setSystolic(Number(e.target.value))}
                  className="w-full p-2 bg-[#FAF6EE] border border-[#C9D6DE] rounded text-[#1E293B] font-bold focus:border-[#2B4570]"
                />
              </div>

              <div>
                <label className="font-bold text-[#1E293B] block mb-1">Diastolic BP (mmHg):</label>
                <input
                  type="number"
                  required
                  value={diastolic}
                  onChange={(e) => setDiastolic(Number(e.target.value))}
                  className="w-full p-2 bg-[#FAF6EE] border border-[#C9D6DE] rounded text-[#1E293B] font-bold focus:border-[#2B4570]"
                />
              </div>

              <div>
                <label className="font-bold text-[#1E293B] block mb-1">Fasting Glucose (mg/dL):</label>
                <input
                  type="number"
                  required
                  value={fastingGlucose}
                  onChange={(e) => setFastingGlucose(Number(e.target.value))}
                  className="w-full p-2 bg-[#FAF6EE] border border-[#C9D6DE] rounded text-[#1E293B] font-bold focus:border-[#2B4570]"
                />
              </div>

              <div>
                <label className="font-bold text-[#1E293B] block mb-1">Hemoglobin A1c (%):</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={hba1c}
                  onChange={(e) => setHba1c(Number(e.target.value))}
                  className="w-full p-2 bg-[#FAF6EE] border border-[#C9D6DE] rounded text-[#1E293B] font-bold focus:border-[#2B4570]"
                />
              </div>

              <div>
                <label className="font-bold text-[#1E293B] block mb-1">Serum Creatinine (mg/dL):</label>
                <input
                  type="number"
                  step="0.05"
                  required
                  value={serumCreatinine}
                  onChange={(e) => setSerumCreatinine(Number(e.target.value))}
                  className="w-full p-2 bg-[#FAF6EE] border border-[#C9D6DE] rounded text-[#1E293B] font-bold focus:border-[#2B4570]"
                />
              </div>

              <div>
                <label className="font-bold text-[#1E293B] block mb-1">Total Cholesterol (mg/dL):</label>
                <input
                  type="number"
                  value={totalCholesterol}
                  onChange={(e) => setTotalCholesterol(Number(e.target.value))}
                  className="w-full p-2 bg-[#FAF6EE] border border-[#C9D6DE] rounded text-[#1E293B] focus:border-[#2B4570]"
                />
              </div>

              <div>
                <label className="font-bold text-[#1E293B] block mb-1">LDL Cholesterol (mg/dL):</label>
                <input
                  type="number"
                  value={ldlCholesterol}
                  onChange={(e) => setLdlCholesterol(Number(e.target.value))}
                  className="w-full p-2 bg-[#FAF6EE] border border-[#C9D6DE] rounded text-[#1E293B] focus:border-[#2B4570]"
                />
              </div>

              <div>
                <label className="font-bold text-[#1E293B] block mb-1">Triglycerides (mg/dL):</label>
                <input
                  type="number"
                  value={triglycerides}
                  onChange={(e) => setTriglycerides(Number(e.target.value))}
                  className="w-full p-2 bg-[#FAF6EE] border border-[#C9D6DE] rounded text-[#1E293B] focus:border-[#2B4570]"
                />
              </div>
            </div>
          </div>

          {/* Section B: Wearable Sweat Patch */}
          <div className="bg-[#FFFFFF] border-2 border-[#C98A2B] rounded-lg p-5 chart-paper shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b-2 border-[#C98A2B] pb-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#C98A2B]" />
                <h3 className="text-base font-bold text-[#876527] font-heading uppercase">
                  Section B: Wearable Sweat Patch
                </h3>
              </div>
              <span className="text-[10px] font-mono-chart bg-[#FEF5E7] text-[#C98A2B] border border-[#FAD7A0] px-2 py-0.5 rounded font-bold">
                Epidermal Sensor
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono-chart">
              <div>
                <label className="font-bold text-[#1E293B] block mb-1">Sweat Lactate (mmol/L):</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={sweatLactate}
                  onChange={(e) => setSweatLactate(Number(e.target.value))}
                  className="w-full p-2 bg-[#FAF8F2] border border-[#E8DFC9] rounded text-[#1E293B] font-bold focus:border-[#C98A2B]"
                />
              </div>

              <div>
                <label className="font-bold text-[#1E293B] block mb-1">Sweat Cortisol (ug/dL):</label>
                <input
                  type="number"
                  step="0.05"
                  required
                  value={sweatCortisol}
                  onChange={(e) => setSweatCortisol(Number(e.target.value))}
                  className="w-full p-2 bg-[#FAF8F2] border border-[#E8DFC9] rounded text-[#1E293B] font-bold focus:border-[#C98A2B]"
                />
              </div>

              <div>
                <label className="font-bold text-[#1E293B] block mb-1">Sweat Glucose (mg/dL):</label>
                <input
                  type="number"
                  step="0.05"
                  required
                  value={sweatGlucose}
                  onChange={(e) => setSweatGlucose(Number(e.target.value))}
                  className="w-full p-2 bg-[#FAF8F2] border border-[#E8DFC9] rounded text-[#1E293B] font-bold focus:border-[#C98A2B]"
                />
              </div>

              <div>
                <label className="font-bold text-[#1E293B] block mb-1">Sweat Sodium (mM):</label>
                <input
                  type="number"
                  value={sweatSodium}
                  onChange={(e) => setSweatSodium(Number(e.target.value))}
                  className="w-full p-2 bg-[#FAF8F2] border border-[#E8DFC9] rounded text-[#1E293B] font-bold focus:border-[#C98A2B]"
                />
              </div>

              <div>
                <label className="font-bold text-[#1E293B] block mb-1">Sweat Potassium (mM):</label>
                <input
                  type="number"
                  step="0.1"
                  value={sweatPotassium}
                  onChange={(e) => setSweatPotassium(Number(e.target.value))}
                  className="w-full p-2 bg-[#FAF8F2] border border-[#E8DFC9] rounded text-[#1E293B] focus:border-[#C98A2B]"
                />
              </div>

              <div>
                <label className="font-bold text-[#1E293B] block mb-1">Sweat pH (Acidity):</label>
                <input
                  type="number"
                  step="0.1"
                  value={sweatPh}
                  onChange={(e) => setSweatPh(Number(e.target.value))}
                  className="w-full p-2 bg-[#FAF8F2] border border-[#E8DFC9] rounded text-[#1E293B] focus:border-[#C98A2B]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Form Submit Bar */}
        <div className="bg-[#FFFFFF] border-2 border-[#2B4570] rounded-lg p-4 chart-paper flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs font-mono-chart text-[#556987]">
            <span>Logging to Bedside Record for: </span>
            <strong className="text-[#2B4570]">{selectedPatient.bedNumber} &bull; {selectedPatient.name}</strong>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 rounded bg-[#2B4570] hover:bg-[#1D3254] text-[#FAF6EE] text-sm font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 font-heading"
          >
            <Activity className="w-4 h-4 text-[#FAF6EE]" />
            <span>Submit &amp; Update Bedside Chart</span>
          </button>
        </div>
      </form>

      {/* 3. CSV BATCH UPLOAD SECTION */}
      <div className="bg-[#FFFFFF] border-2 border-[#D1DCE5] rounded-lg p-5 chart-paper shadow-xs">
        <div className="flex items-center justify-between border-b border-[#D1DCE5] pb-3 mb-3">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-[#2B4570]" />
            <h3 className="text-sm font-bold text-[#2B4570] font-heading uppercase">
              Batch CSV Timepoint Upload
            </h3>
          </div>
          <button
            onClick={downloadSampleCsv}
            className="text-xs font-mono-chart text-[#2B4570] font-bold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Sample CSV Template</span>
          </button>
        </div>

        <p className="text-xs text-[#556987] font-mono-chart mb-4 leading-relaxed">
          Upload multi-row timepoint files containing sequential laboratory and continuous sweat sensor recordings. All rows will be parsed and appended directly to the selected patient&apos;s observation history.
        </p>

        <label className="border-2 border-dashed border-[#C9D6DE] hover:border-[#2B4570] bg-[#FAF6EE] rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors text-center">
          <Upload className="w-8 h-8 text-[#2B4570] mb-2" />
          <span className="text-xs font-bold text-[#2B4570] font-heading">
            Click to upload or drag &amp; drop CSV laboratory file
          </span>
          <span className="text-[10px] font-mono-chart text-[#556987] mt-1">
            Accepts standard .csv formatted rows with blood and sweat header keys
          </span>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>

        {csvMessage && (
          <div className="mt-3 p-2.5 bg-[#EAFAF1] border border-[#A9DFBF] text-[#1E824C] rounded text-xs font-mono-chart flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{csvMessage}</span>
          </div>
        )}

        {csvError && (
          <div className="mt-3 p-2.5 bg-[#FDEDEC] border border-[#F5B7B1] text-[#B33A3A] rounded text-xs font-mono-chart flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{csvError}</span>
          </div>
        )}
      </div>
    </div>
  );
};
