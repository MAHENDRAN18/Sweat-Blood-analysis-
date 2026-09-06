import React, { useState } from 'react';
import { useWardChart } from '../context/WardChartContext';
import { BIOMARKER_RANGES } from '../utils/clinicalData';
import { ConditionPrediction } from '../types';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  Printer,
  Download,
  ClipboardList,
  CheckCircle2,
  Stethoscope,
  ShieldCheck,
  Droplets,
  Activity,
  Bed,
  Calendar,
  User,
  Info,
  HeartPulse
} from 'lucide-react';

interface HealthReportPageProps {
  onNavigate: (pageId: string) => void;
}

export const HealthReportPage: React.FC<HealthReportPageProps> = ({ onNavigate }) => {
  const { selectedPatient, doctorName } = useWardChart();
  const [isExporting, setIsExporting] = useState(false);

  const patient = selectedPatient;
  const data = patient.healthData;
  const pred = patient.latestPrediction;
  const notes = patient.doctorNotes;

  const isHighRisk = patient.riskTier === 'High Risk';
  const isModerateRisk = patient.riskTier === 'Moderate Risk';

  // Generate authentic Hospital Bedside Observation Chart PDF
  const generatePdfReport = () => {
    setIsExporting(true);
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // 1. Hospital Letterhead Header (Medical Emerald Green)
      doc.setFillColor(6, 78, 59); // Emerald 900
      doc.rect(0, 0, 210, 32, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont('times', 'bold');
      doc.text('ST. JUDE CLINICAL RESEARCH & TEACHING HOSPITAL', 14, 13);

      doc.setFontSize(9);
      doc.setFont('courier', 'normal');
      doc.setTextColor(167, 243, 208); // Emerald 200
      doc.text('WARD 4B: INTERNAL MEDICINE & METABOLIC OBSERVATION UNIT', 14, 20);
      doc.text('OFFICIAL BEDSIDE OBSERVATION LEDGER & BIOMARKER REPORT', 14, 26);

      // 2. Patient Demographics Block
      doc.setFillColor(248, 250, 252);
      doc.rect(14, 38, 182, 24, 'F');
      doc.setDrawColor(203, 213, 225);
      doc.rect(14, 38, 182, 24, 'S');

      doc.setFont('courier', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      doc.text(`BED: ${patient.bedNumber}  |  MRN: ${patient.mrn}`, 18, 45);
      doc.text(`PATIENT: ${patient.name} (${patient.age}y, ${patient.sex.toUpperCase()})`, 18, 51);
      doc.text(`DIAGNOSIS: ${patient.primaryDiagnosis}`, 18, 57);

      doc.text(`ADMITTED: ${patient.admissionDate}`, 120, 45);
      doc.text(`ATTENDING: ${patient.attendingDoctor}`, 120, 51);
      doc.text(`RISK TIER: ${patient.riskTier.toUpperCase()} (${patient.riskScore}%)`, 120, 57);

      // 3. Multi-Disease Risk Probability Table
      const conditionsArray = pred?.conditions ? Object.entries(pred.conditions).map(([k, cond]) => {
        const c = cond as ConditionPrediction;
        return [
          c.name,
          `${c.probability}%`,
          c.riskLevel,
          c.leadTimeWarning || '14-30 Days',
          c.drivingBiomarkers.map((b) => `${b.name}: ${b.value}`).slice(0, 2).join(', ') || 'Within Normal Bounds',
        ];
      }) : [];

      autoTable(doc, {
        startY: 67,
        head: [['Pathology Target', 'Risk Probability', 'Risk Level', 'Lead-Time Warning', 'Key Driving Biomarkers']],
        body: conditionsArray,
        theme: 'grid',
        headStyles: {
          fillColor: [6, 78, 59], // Emerald 900
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 8.5,
        },
        bodyStyles: {
          fontSize: 8,
          textColor: [30, 41, 59],
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252],
        },
        styles: {
          cellPadding: 2,
        },
      });

      // 4. Dual-Stream Biomarkers Table
      const currentY = (doc as any).lastAutoTable.finalY + 6;

      const biomarkersBody = [
        ['Systolic BP', `${data.systolic_bp} mmHg`, '90 - 120', data.systolic_bp >= 140 ? 'ELEVATED' : 'NORMAL', 'Venous Hemodynamics'],
        ['Diastolic BP', `${data.diastolic_bp} mmHg`, '60 - 80', data.diastolic_bp >= 90 ? 'ELEVATED' : 'NORMAL', 'Venous Hemodynamics'],
        ['Fasting Glucose', `${data.fasting_glucose} mg/dL`, '70 - 99', data.fasting_glucose >= 126 ? 'DIABETIC' : 'NORMAL', 'Certified Blood Chemistry'],
        ['Hemoglobin A1c', `${data.hba1c || 5.4}%`, '4.0 - 5.6', (data.hba1c || 5.4) >= 6.5 ? 'ELEVATED' : 'NORMAL', 'Glycemic History'],
        ['Serum Creatinine', `${data.serum_creatinine || 0.9} mg/dL`, '0.6 - 1.2', (data.serum_creatinine || 0.9) >= 1.3 ? 'HIGH' : 'NORMAL', 'Renal Function'],
        ['Epidermal Sweat Lactate', `${data.sweat_lactate || 1.8} mmol/L`, '0.5 - 2.5', (data.sweat_lactate || 1.8) >= 2.5 ? 'ELEVATED' : 'NORMAL', 'Wearable Telemetry'],
        ['Epidermal Sweat Cortisol', `${data.sweat_cortisol || 1.2} ug/dL`, '0.2 - 1.5', (data.sweat_cortisol || 1.2) >= 1.5 ? 'HIGH STRESS' : 'NORMAL', 'Wearable Telemetry'],
        ['Sweat Glucose', `${data.sweat_glucose || 0.6} mg/dL`, '0.1 - 1.0', (data.sweat_glucose || 0.6) >= 1.0 ? 'SPIKE' : 'NORMAL', 'Wearable Telemetry'],
        ['Sweat Sodium (Na+)', `${data.sweat_sodium || 42} mM`, '20 - 60', 'EUVOLEMIC', 'Wearable Telemetry'],
      ];

      autoTable(doc, {
        startY: currentY,
        head: [['Biomarker Parameter', 'Patient Value', 'Clinical Reference', 'Status', 'Sensor / Assay Modality']],
        body: biomarkersBody,
        theme: 'grid',
        headStyles: {
          fillColor: [4, 120, 87], // Emerald 700
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 8.5,
        },
        bodyStyles: {
          fontSize: 8,
          textColor: [30, 41, 59],
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252],
        },
        styles: {
          cellPadding: 1.8,
        },
      });

      // 5. Attending Doctor's Official Directives
      const notesY = (doc as any).lastAutoTable.finalY + 8;
      doc.setFillColor(240, 253, 244); // Emerald 50
      doc.rect(14, notesY, 182, 38, 'F');
      doc.setDrawColor(167, 243, 208);
      doc.rect(14, notesY, 182, 38, 'S');

      doc.setFont('courier', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(6, 78, 59);
      doc.text('ATTENDING PHYSICIAN CLINICAL DIRECTIVES & CARE INSTRUCTIONS:', 18, notesY + 6);

      doc.setFont('courier', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(30, 41, 59);
      doc.text(`PRECAUTIONS: ${notes.clinicalPrecautions.slice(0, 110)}...`, 18, notesY + 12);
      doc.text(`MEDICATIONS: ${notes.medicationOrders.slice(0, 110)}...`, 18, notesY + 18);
      doc.text(`DIETARY: ${notes.dietaryDirectives.slice(0, 110)}...`, 18, notesY + 24);
      doc.text(`OBSERVATION: ${notes.observationOrders.slice(0, 110)}...`, 18, notesY + 30);

      // Signature line
      doc.setFont('courier', 'bold');
      doc.setTextColor(6, 78, 59);
      doc.text(`SIGNED & TIMESTAMPED: ${notes.authorDoctor} (${notes.timestamp})`, 18, notesY + 36);

      // Save PDF
      doc.save(`WardChart_${patient.mrn}_${patient.name.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error('PDF Generation Error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 1. TOP CONTROLS & PRINT ACTION BAR */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 via-teal-500 to-red-500" />
        <div>
          <span className="text-[10px] font-mono-chart uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-800 text-white flex items-center gap-1 w-fit shadow-2xs">
            <HeartPulse className="w-3 h-3 text-emerald-300" />
            OFFICIAL CLINICAL LEDGER EXPORT
          </span>
          <h1 className="text-2xl font-bold text-emerald-950 font-heading mt-1.5">
            Bedside Patient Chart &amp; Biomarker Report
          </h1>
          <p className="text-xs text-slate-500 font-mono-chart mt-0.5">
            Bed: {patient.bedNumber} &bull; {patient.name} ({patient.mrn}) &bull; Attending: {patient.attendingDoctor}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-lg text-emerald-900 text-xs font-bold font-mono-chart flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Browser Print</span>
          </button>

          <button
            onClick={generatePdfReport}
            disabled={isExporting}
            className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold font-heading flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Generating PDF...' : 'Download Official PDF'}</span>
          </button>
        </div>
      </div>

      {/* 2. PRINTABLE BEDSIDE LEDGER SHEET */}
      <div className="bg-white border-2 border-emerald-900/40 rounded-xl p-6 sm:p-8 shadow-sm space-y-6 font-mono-chart">
        {/* Hospital Letterhead Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-emerald-900 pb-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold font-serif text-xl shadow-xs">
              +
            </div>
            <div>
              <h2 className="text-lg font-bold text-emerald-950 font-heading tracking-wide uppercase">
                St. Jude Clinical Research &amp; Teaching Hospital
              </h2>
              <p className="text-xs text-slate-600">
                Ward 4B: Internal Medicine &amp; Continuous Metabolic Telemetry Unit
              </p>
              <p className="text-[10px] text-slate-500">
                Official Inpatient Bedside Observation Record &bull; Dual Stream Integration
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs text-slate-600">
            <p><strong>BED:</strong> {patient.bedNumber}</p>
            <p><strong>MRN:</strong> {patient.mrn}</p>
            <p><strong>DATE:</strong> {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Demographics Card */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Patient Name:</span>
            <span className="font-bold text-slate-900 text-sm">{patient.name}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Age / Sex:</span>
            <span className="font-bold text-slate-900 text-sm">{patient.age} Yrs &bull; {patient.sex.toUpperCase()}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Primary Diagnosis:</span>
            <span className="font-bold text-slate-900 text-sm">{patient.primaryDiagnosis}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Composite Risk:</span>
            <span className={`font-bold text-sm ${isHighRisk ? 'text-red-700' : isModerateRisk ? 'text-amber-700' : 'text-emerald-700'}`}>
              {patient.riskTier} ({patient.riskScore}%)
            </span>
          </div>
        </div>

        {/* Multi-Condition Risk Matrix */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
            1. Multimodal Disease Risk Estimates (Blood + Wearable Sweat Telemetry)
          </h3>
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-emerald-900 text-white text-[10px] uppercase">
                <tr>
                  <th className="p-2.5">Pathology Target</th>
                  <th className="p-2.5">Probability</th>
                  <th className="p-2.5">Risk Level</th>
                  <th className="p-2.5">Lead-Time Warning</th>
                  <th className="p-2.5">Key Driving Biomarkers</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pred?.conditions && Object.entries(pred.conditions).map(([k, cond]) => {
                  const c = cond as ConditionPrediction;
                  return (
                    <tr key={k} className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold text-slate-900">{c.name}</td>
                      <td className="p-2.5 font-bold text-emerald-900">{c.probability}%</td>
                      <td className="p-2.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            c.riskLevel === 'High'
                              ? 'bg-red-100 text-red-800'
                              : c.riskLevel === 'Moderate'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {c.riskLevel}
                        </span>
                      </td>
                      <td className="p-2.5 text-slate-500">{c.leadTimeWarning || '14 - 30 Days'}</td>
                      <td className="p-2.5 text-slate-500 text-[11px]">
                        {c.drivingBiomarkers.map((b) => `${b.name}: ${b.value}`).slice(0, 2).join(', ') || 'Normal'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dual Stream Biomarkers Ledger */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
            2. Bedside Laboratory &amp; Wearable Sensor Panel
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <span className="font-bold text-emerald-900 block border-b border-slate-200 pb-1 uppercase text-[10px]">
                Blood Chemistry
              </span>
              <div className="flex justify-between">
                <span className="text-slate-500">Blood Pressure:</span>
                <strong className={data.systolic_bp >= 140 ? 'text-red-700' : 'text-emerald-800'}>
                  {data.systolic_bp}/{data.diastolic_bp} mmHg
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Fasting Glucose:</span>
                <strong className={data.fasting_glucose >= 126 ? 'text-red-700' : 'text-emerald-800'}>
                  {data.fasting_glucose} mg/dL
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">HbA1c:</span>
                <strong className={(data.hba1c || 5.4) >= 6.5 ? 'text-red-700' : 'text-emerald-800'}>
                  {data.hba1c || 5.4}%
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Serum Creatinine:</span>
                <strong className="text-emerald-800">{data.serum_creatinine || 0.9} mg/dL</strong>
              </div>
            </div>

            <div className="p-3.5 bg-teal-50/40 border border-teal-200 rounded-xl space-y-1.5">
              <span className="font-bold text-teal-900 block border-b border-teal-200 pb-1 uppercase text-[10px]">
                Wearable Sweat Telemetry
              </span>
              <div className="flex justify-between">
                <span className="text-slate-500">Sweat Lactate:</span>
                <strong className={(data.sweat_lactate || 1.8) >= 2.5 ? 'text-red-700' : 'text-teal-900'}>
                  {data.sweat_lactate || 1.8} mmol/L
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Sweat Cortisol:</span>
                <strong className={(data.sweat_cortisol || 1.2) >= 1.5 ? 'text-red-700' : 'text-teal-900'}>
                  {data.sweat_cortisol || 1.2} ug/dL
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Sweat Glucose:</span>
                <strong className="text-teal-900">{data.sweat_glucose || 0.6} mg/dL</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Sweat Sodium:</span>
                <strong className="text-teal-900">{data.sweat_sodium || 42} mM</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Active Tablets & Precautions Ledgers */}
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center justify-between">
              <span>3. Active Prescribed Tablets &amp; Medication Schedule</span>
              <span className="text-[11px] text-slate-500 font-normal">Active until full recovery</span>
            </h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-emerald-900 text-white text-[10px] uppercase font-mono-chart">
                  <tr>
                    <th className="p-2.5">Tablet / Medication</th>
                    <th className="p-2.5">Dose</th>
                    <th className="p-2.5">Frequency &amp; Route</th>
                    <th className="p-2.5">Target / Reason</th>
                    <th className="p-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {(patient.tablets || []).map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold text-slate-900">{t.name}</td>
                      <td className="p-2.5 font-mono-chart font-bold text-emerald-800">{t.dose}</td>
                      <td className="p-2.5 text-slate-600">{t.frequency} &bull; {t.route}</td>
                      <td className="p-2.5 text-slate-600">{t.reason}</td>
                      <td className="p-2.5">
                        <span className="text-[10px] font-mono-chart font-bold px-2 py-0.5 rounded uppercase bg-teal-100 text-teal-800">
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Precautions List */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
              4. Clinical Precautions, Dietary Protocol &amp; Vitals Alerts
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-sans">
              {(patient.precautionsList || []).map((prec) => (
                <div key={prec.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 uppercase font-mono-chart text-[11px]">{prec.category}</span>
                    <span className="text-[10px] font-mono-chart font-bold px-1.5 py-0.2 rounded uppercase bg-emerald-100 text-emerald-800">
                      {prec.severity}
                    </span>
                  </div>
                  <p className="text-slate-700 text-xs">{prec.directive}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Doctor's Signed Orders & Discharge Status */}
        <div className="p-4 bg-emerald-50/50 border border-emerald-300 rounded-xl space-y-3">
          <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
            <span className="font-bold text-emerald-950 uppercase text-xs">
              5. Attending Physician Orders &amp; Recovery Clearance
            </span>
            <span className="text-[10px] text-emerald-700 font-bold">
              &check; Signed by {notes.authorDoctor} ({notes.timestamp})
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <strong className="text-red-700 block text-[10px] uppercase font-mono-chart">Precautions Directive:</strong>
              <p className="text-slate-800 font-sans text-xs">{notes.clinicalPrecautions}</p>
            </div>
            <div>
              <strong className="text-emerald-900 block text-[10px] uppercase font-mono-chart">Medications Directive:</strong>
              <p className="text-slate-800 font-sans text-xs">{notes.medicationOrders}</p>
            </div>
            <div>
              <strong className="text-teal-800 block text-[10px] uppercase font-mono-chart">Diet &amp; Fluids:</strong>
              <p className="text-slate-800 font-sans text-xs">{notes.dietaryDirectives}</p>
            </div>
            <div>
              <strong className="text-emerald-800 block text-[10px] uppercase font-mono-chart">Observation Orders:</strong>
              <p className="text-slate-800 font-sans text-xs">{notes.observationOrders}</p>
            </div>
          </div>

          {patient.dischargeSummary && (
            <div className="pt-2 border-t border-emerald-200 text-xs text-slate-700">
              <strong className="text-emerald-950 block mb-0.5">Discharge Summary &amp; Outpatient Plan:</strong>
              <p className="text-slate-800">
                Discharged on {patient.dischargeSummary.dischargeDate} in {patient.dischargeSummary.dischargeCondition} condition.
                Follow-up: {patient.dischargeSummary.followUpDate}. Instructions: {patient.dischargeSummary.dischargeInstructions}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
