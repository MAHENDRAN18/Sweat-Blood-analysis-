import React, { useState } from 'react';
import { useWardChart } from '../context/WardChartContext';
import { BIOMARKER_RANGES } from '../utils/clinicalData';
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
  Info
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

      // 1. Hospital Letterhead Header (#2B4570 Ballpoint Blue)
      doc.setFillColor(43, 69, 112);
      doc.rect(0, 0, 210, 32, 'F');

      doc.setTextColor(250, 246, 238); // #FAF6EE
      doc.setFontSize(14);
      doc.setFont('times', 'bold');
      doc.text('ST. JUDE CLINICAL RESEARCH & TEACHING HOSPITAL', 14, 13);

      doc.setFontSize(9);
      doc.setFont('courier', 'normal');
      doc.setTextColor(201, 214, 222);
      doc.text('WARD 4B: INTERNAL MEDICINE & METABOLIC OBSERVATION UNIT', 14, 20);
      doc.text('OFFICIAL BEDSIDE OBSERVATION LEDGER & BIOMARKER REPORT', 14, 26);

      // 2. Patient Demographics Block
      doc.setFillColor(242, 246, 249);
      doc.rect(14, 38, 182, 24, 'F');
      doc.setDrawColor(201, 214, 222);
      doc.rect(14, 38, 182, 24, 'S');

      doc.setFont('courier', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(30, 41, 59);
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
          fillColor: [43, 69, 112],
          textColor: [250, 246, 238],
          fontStyle: 'bold',
          fontSize: 8,
          font: 'courier',
        },
        bodyStyles: {
          fontSize: 7.5,
          textColor: [30, 41, 59],
          font: 'courier',
        },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        margin: { left: 14, right: 14 },
      });

      // 4. Dual-Stream Biomarkers Table
      const labRows = [
        ['Systolic Blood Pressure', 'Blood Stream', `${data.systolic_bp} mmHg`, '90 - 120 mmHg', data.systolic_bp >= 140 ? 'HIGH' : 'NORMAL'],
        ['Diastolic Blood Pressure', 'Blood Stream', `${data.diastolic_bp} mmHg`, '60 - 80 mmHg', data.diastolic_bp >= 90 ? 'HIGH' : 'NORMAL'],
        ['Fasting Blood Glucose', 'Blood Stream', `${data.fasting_glucose} mg/dL`, '70 - 99 mg/dL', data.fasting_glucose >= 126 ? 'DIABETIC' : 'NORMAL'],
        ['Hemoglobin A1c', 'Blood Stream', `${data.hba1c || 5.4}%`, '4.0 - 5.6%', (data.hba1c || 5.4) >= 6.5 ? 'ELEVATED' : 'NORMAL'],
        ['Serum Creatinine', 'Blood Stream', `${data.serum_creatinine || 0.9} mg/dL`, '0.6 - 1.2 mg/dL', 'NORMAL'],
        ['Estimated GFR', 'Blood Stream', `${data.egfr || 90} mL/min`, '> 90 mL/min', (data.egfr || 90) < 60 ? 'REDUCED' : 'NORMAL'],
        ['Epidermal Sweat Lactate', 'Sweat Stream', `${data.sweat_lactate || 1.8} mmol/L`, '0.5 - 2.5 mmol/L', (data.sweat_lactate || 1.8) >= 2.5 ? 'ELEVATED' : 'NORMAL'],
        ['Epidermal Sweat Cortisol', 'Sweat Stream', `${data.sweat_cortisol || 1.2} ug/dL`, '0.2 - 1.5 ug/dL', (data.sweat_cortisol || 1.2) >= 1.5 ? 'HIGH' : 'NORMAL'],
        ['Sweat Glucose', 'Sweat Stream', `${data.sweat_glucose || 0.6} mg/dL`, '0.1 - 1.0 mg/dL', 'NORMAL'],
        ['Sweat Sodium (Na+)', 'Sweat Stream', `${data.sweat_sodium || 42} mM`, '20 - 60 mM', 'NORMAL'],
      ];

      const currentY = (doc as any).lastAutoTable.finalY + 6;
      doc.setFontSize(9.5);
      doc.setFont('courier', 'bold');
      doc.setTextColor(43, 69, 112);
      doc.text('BEDSIDE LABORATORY & WEARABLE SENSOR READINGS', 14, currentY);

      autoTable(doc, {
        startY: currentY + 3,
        head: [['Biomarker Parameter', 'Stream Source', 'Patient Result', 'Reference Range', 'Clinical Status']],
        body: labRows,
        theme: 'grid',
        headStyles: {
          fillColor: [43, 69, 112],
          textColor: [250, 246, 238],
          fontStyle: 'bold',
          fontSize: 8,
          font: 'courier',
        },
        bodyStyles: {
          fontSize: 7.5,
          textColor: [30, 41, 59],
          font: 'courier',
        },
        margin: { left: 14, right: 14 },
      });

      // 5. Doctor's Orders Box
      const notesY = (doc as any).lastAutoTable.finalY + 6;
      doc.setFillColor(250, 246, 238);
      doc.rect(14, notesY, 182, 38, 'F');
      doc.setDrawColor(43, 69, 112);
      doc.rect(14, notesY, 182, 38, 'S');

      doc.setFont('courier', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(43, 69, 112);
      doc.text(`DOCTOR ORDERS & DIRECTIVES (Signed by ${notes.authorDoctor} on ${notes.timestamp})`, 18, notesY + 6);

      doc.setFont('courier', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(30, 41, 59);
      doc.text(`Precautions: ${notes.clinicalPrecautions}`, 18, notesY + 12, { maxWidth: 174 });
      doc.text(`Medications: ${notes.medicationOrders}`, 18, notesY + 20, { maxWidth: 174 });
      doc.text(`Diet & Fluids: ${notes.dietaryDirectives}`, 18, notesY + 28, { maxWidth: 174 });
      doc.text(`Observation: ${notes.observationOrders}`, 18, notesY + 34, { maxWidth: 174 });

      // Page footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(7);
        doc.setFont('courier', 'normal');
        doc.setTextColor(100, 116, 139);
        doc.text(
          `ST. JUDE HOSPITAL WARD 4B &bull; BED: ${patient.bedNumber} &bull; MRN: ${patient.mrn} &bull; Page ${i} of ${pageCount}`,
          14,
          290
        );
      }

      doc.save(`WardChart_${patient.bedNumber.replace(/\s+/g, '_')}_${patient.name.replace(/\s+/g, '_')}.pdf`);
    } catch (e) {
      console.error('Failed to export PDF', e);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* 1. TOP ACTION HEADER */}
      <div className="bg-[#FFFFFF] border-2 border-[#2B4570] rounded-lg p-5 shadow-xs chart-paper flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono-chart uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#2B4570] text-[#FAF6EE]">
              OFFICIAL HOSPITAL REPORT
            </span>
            <span className="text-xs font-mono-chart text-[#556987]">
              {patient.bedNumber} &bull; {patient.mrn}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2B4570] font-heading mt-1">
            Bedside Observation Chart &amp; Health Dossier
          </h1>
          <p className="text-xs text-[#556987] font-mono-chart mt-0.5">
            Printable hospital record with dual-stream blood + sweat biomarkers and physician orders
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded bg-[#FAF6EE] hover:bg-[#E2EAF0] text-[#2B4570] border border-[#C9D6DE] text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer font-heading"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print View</span>
          </button>
          <button
            onClick={generatePdfReport}
            disabled={isExporting}
            className="px-5 py-2 rounded bg-[#2B4570] hover:bg-[#1D3254] text-[#FAF6EE] text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer font-heading disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Generating PDF...' : 'Download Official PDF'}</span>
          </button>
        </div>
      </div>

      {/* 2. PRINTABLE CHART PREVIEW (GRAPH PAPER BACKGROUND) */}
      <div className="bg-[#FFFFFF] border-2 border-[#2B4570] rounded-lg p-6 sm:p-8 shadow-md chart-paper space-y-6 font-mono-chart">
        {/* Hospital Letterhead */}
        <div className="border-b-2 border-[#2B4570] pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded bg-[#2B4570] text-[#FAF6EE] flex items-center justify-center font-bold">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#2B4570] font-heading leading-tight">
                ST. JUDE CLINICAL RESEARCH &amp; TEACHING HOSPITAL
              </h2>
              <p className="text-xs text-[#556987]">
                Ward 4B: Internal Medicine &amp; Metabolic Observation Ledger
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs text-[#556987]">
            <p><strong>BED:</strong> {patient.bedNumber}</p>
            <p><strong>MRN:</strong> {patient.mrn}</p>
            <p><strong>DATE:</strong> {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Demographics Card */}
        <div className="p-4 bg-[#F2F6F9] border border-[#D1DCE5] rounded grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-[#556987] block text-[10px] uppercase font-bold">Patient Name:</span>
            <span className="font-bold text-[#1E293B] text-sm">{patient.name}</span>
          </div>
          <div>
            <span className="text-[#556987] block text-[10px] uppercase font-bold">Age / Biological Sex:</span>
            <span className="font-bold text-[#1E293B] text-sm">{patient.age} Yrs &bull; {patient.sex.toUpperCase()}</span>
          </div>
          <div>
            <span className="text-[#556987] block text-[10px] uppercase font-bold">Primary Diagnosis:</span>
            <span className="font-bold text-[#1E293B] text-sm">{patient.primaryDiagnosis}</span>
          </div>
          <div>
            <span className="text-[#556987] block text-[10px] uppercase font-bold">Composite Risk:</span>
            <span className={`font-bold text-sm ${isHighRisk ? 'ink-red' : isModerateRisk ? 'ink-amber' : 'ink-blue'}`}>
              {patient.riskTier} ({patient.riskScore}%)
            </span>
          </div>
        </div>

        {/* Multi-Condition Risk Matrix */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-[#2B4570] uppercase tracking-wider">
            1. Multimodal Disease Risk Estimates (Blood + Wearable Sweat Telemetry)
          </h3>
          <div className="border border-[#C9D6DE] rounded overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#2B4570] text-[#FAF6EE] text-[10px] uppercase">
                <tr>
                  <th className="p-2.5">Pathology Target</th>
                  <th className="p-2.5">Probability</th>
                  <th className="p-2.5">Risk Level</th>
                  <th className="p-2.5">Lead-Time Warning</th>
                  <th className="p-2.5">Key Driving Biomarkers</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2EAF0]">
                {pred?.conditions && Object.entries(pred.conditions).map(([k, cond]) => {
                  const c = cond as ConditionPrediction;
                  return (
                    <tr key={k} className="hover:bg-[#FAF6EE]">
                      <td className="p-2.5 font-bold text-[#1E293B]">{c.name}</td>
                      <td className="p-2.5 font-bold text-[#2B4570]">{c.probability}%</td>
                      <td className="p-2.5">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            c.riskLevel === 'High'
                              ? 'bg-[#FDEDEC] text-[#B33A3A]'
                              : c.riskLevel === 'Moderate'
                              ? 'bg-[#FEF5E7] text-[#C98A2B]'
                              : 'bg-[#EAFAF1] text-[#6B8F71]'
                          }`}
                        >
                          {c.riskLevel}
                        </span>
                      </td>
                      <td className="p-2.5 text-[#556987]">{c.leadTimeWarning || '14 - 30 Days'}</td>
                      <td className="p-2.5 text-[#556987] text-[11px]">
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
          <h3 className="text-xs font-bold text-[#2B4570] uppercase tracking-wider">
            2. Bedside Laboratory &amp; Wearable Sensor Panel
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-[#FAF6EE] border border-[#D1DCE5] rounded space-y-1.5">
              <span className="font-bold text-[#2B4570] block border-b border-[#D1DCE5] pb-1 uppercase text-[10px]">
                Blood Chemistry
              </span>
              <div className="flex justify-between">
                <span className="text-[#556987]">Blood Pressure:</span>
                <strong className={data.systolic_bp >= 140 ? 'ink-red' : 'ink-blue'}>
                  {data.systolic_bp}/{data.diastolic_bp} mmHg
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#556987]">Fasting Glucose:</span>
                <strong className={data.fasting_glucose >= 126 ? 'ink-red' : 'ink-blue'}>
                  {data.fasting_glucose} mg/dL
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#556987]">HbA1c:</span>
                <strong className={(data.hba1c || 5.4) >= 6.5 ? 'ink-red' : 'ink-blue'}>
                  {data.hba1c || 5.4}%
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#556987]">Serum Creatinine:</span>
                <strong className="ink-blue">{data.serum_creatinine || 0.9} mg/dL</strong>
              </div>
            </div>

            <div className="p-3 bg-[#FAF8F2] border border-[#E8DFC9] rounded space-y-1.5">
              <span className="font-bold text-[#876527] block border-b border-[#E8DFC9] pb-1 uppercase text-[10px]">
                Wearable Sweat Telemetry
              </span>
              <div className="flex justify-between">
                <span className="text-[#556987]">Sweat Lactate:</span>
                <strong className={(data.sweat_lactate || 1.8) >= 2.5 ? 'ink-red' : 'text-[#2B4570]'}>
                  {data.sweat_lactate || 1.8} mmol/L
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#556987]">Sweat Cortisol:</span>
                <strong className={(data.sweat_cortisol || 1.2) >= 1.5 ? 'ink-red' : 'text-[#2B4570]'}>
                  {data.sweat_cortisol || 1.2} ug/dL
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#556987]">Sweat Glucose:</span>
                <strong className="text-[#2B4570]">{data.sweat_glucose || 0.6} mg/dL</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#556987]">Sweat Sodium:</span>
                <strong className="text-[#2B4570]">{data.sweat_sodium || 42} mM</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Doctor's Signed Orders */}
        <div className="p-4 bg-[#FAF6EE] border-2 border-[#2B4570] rounded space-y-3">
          <div className="flex items-center justify-between border-b border-[#D1DCE5] pb-2">
            <span className="font-bold text-[#2B4570] uppercase text-xs">
              3. Attending Physician Orders &amp; Directives
            </span>
            <span className="text-[10px] text-[#6B8F71] font-bold">
              &check; Signed by {notes.authorDoctor} ({notes.timestamp})
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <strong className="text-[#B33A3A] block text-[10px] uppercase">Precautions:</strong>
              <p className="text-[#1E293B] font-sans text-xs">{notes.clinicalPrecautions}</p>
            </div>
            <div>
              <strong className="text-[#2B4570] block text-[10px] uppercase">Medications:</strong>
              <p className="text-[#1E293B] font-sans text-xs">{notes.medicationOrders}</p>
            </div>
            <div>
              <strong className="text-[#876527] block text-[10px] uppercase">Diet &amp; Fluids:</strong>
              <p className="text-[#1E293B] font-sans text-xs">{notes.dietaryDirectives}</p>
            </div>
            <div>
              <strong className="text-[#6B8F71] block text-[10px] uppercase">Observation Orders:</strong>
              <p className="text-[#1E293B] font-sans text-xs">{notes.observationOrders}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
