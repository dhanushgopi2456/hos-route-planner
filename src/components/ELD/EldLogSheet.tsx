import React, { useRef } from 'react';
import { DailyLog } from '../../types/hos';
import { EldLogGraph } from './EldLogGraph';
import {
  Printer,
  Download,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  FileCode
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import jsPDF from 'jspdf';
import { useToast } from '../../context/ToastContext';

interface EldLogSheetProps {
  log: DailyLog;
  totalDaysInTrip?: number;
  onDownloadPdf?: () => void;
  onPrevDay?: () => void;
  onNextDay?: () => void;
  canPrevDay?: boolean;
  canNextDay?: boolean;
}

export const EldLogSheet: React.FC<EldLogSheetProps> = ({
  log,
  totalDaysInTrip = 1,
  onDownloadPdf,
  onPrevDay,
  onNextDay,
  canPrevDay,
  canNextDay
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const { success: toastSuccess, info: toastInfo } = useToast();

  // Format date parts
  const dateObj = new Date(log.date + 'T00:00:00Z');
  const month = (dateObj.getUTCMonth() + 1).toString().padStart(2, '0');
  const day = dateObj.getUTCDate().toString().padStart(2, '0');
  const year = dateObj.getUTCFullYear().toString();

  const handlePrint = () => {
    toastInfo('Print Sheet Ready', `Preparing print layout for Day ${log.day_number} (${log.date}).`);
    window.print();
  };

  // Download raw JSON record
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(log, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `hos-trip-log-day-${log.day_number}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toastSuccess(
      'JSON Log Exported',
      `Downloaded hos-trip-log-day-${log.day_number}.json with full event records.`
    );
  };

  // Download tabular CSV summary
  const handleExportCsv = () => {
    const headers = ['Day', 'Date', 'Carrier', 'Driver', 'Truck', 'Trailer', 'OffDuty_Hrs', 'Sleeper_Hrs', 'Driving_Hrs', 'OnDuty_Hrs', 'Total_Hrs', 'Status'];
    const row = [
      log.day_number,
      log.date,
      `"${log.carrier_name}"`,
      `"${log.driver_name}"`,
      log.truck_number,
      log.trailer_number,
      (log.off_duty_hours ?? 0).toFixed(2),
      (log.sleeper_berth_hours ?? 0).toFixed(2),
      (log.driving_hours ?? 0).toFixed(2),
      (log.on_duty_not_driving_hours ?? 0).toFixed(2),
      (log.total_hours ?? 24).toFixed(2),
      log.validation_status
    ];

    let csvContent = 'data:text/csv;charset=utf-8,' + headers.join(',') + '\n' + row.join(',') + '\n\n';
    csvContent += 'Time,Status,Duration_Hrs,Location,Remarks\n';
    (log.events || []).forEach(ev => {
      csvContent += `"${ev.start_time}","${ev.status}",${ev.duration_hours.toFixed(2)},"${ev.location_name}","${ev.reason}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', encodedUri);
    downloadAnchor.setAttribute('download', `hos-trip-log-day-${log.day_number}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toastSuccess(
      'CSV Log Exported',
      `Downloaded hos-trip-log-day-${log.day_number}.csv with timeline events.`
    );
  };

  const handleExportPdf = () => {
    if (onDownloadPdf) {
      onDownloadPdf();
      return;
    }

    try {
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'pt',
        format: 'letter'
      });

      if (sheetRef.current) {
        doc.html(sheetRef.current, {
          callback: pdf => {
            pdf.save(`Driver_Daily_Log_${log.date}_Day${log.day_number}.pdf`);
            toastSuccess(
              `Day ${log.day_number} PDF Exported`,
              `Saved Driver_Daily_Log_${log.date}_Day${log.day_number}.pdf`
            );
          },
          x: 20,
          y: 20,
          html2canvas: {
            scale: 0.72
          }
        });
      }
    } catch (err) {
      console.error('PDF export fallback:', err);
      toastInfo('Print Fallback', 'Opening system print preview dialog.');
      window.print();
    }
  };

  return (
    <div className="uc-card-stark overflow-hidden print:border-none print:shadow-none print:m-0 print:bg-white">
      {/* Top Action & Duty Hours Bar (hidden in print) */}
      <div className="bg-[#0A0A0A] border-b border-[#242424] px-6 py-4 flex flex-wrap items-center justify-between gap-4 print:hidden">
        
        {/* Day Navigation & Status Badge */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Prev Day Button */}
          {onPrevDay && (
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!canPrevDay}
              onClick={onPrevDay}
              className={`p-1.5 rounded-full border text-xs flex items-center justify-center transition-all ${
                canPrevDay
                  ? 'bg-[#161616] border-[#242424] text-white hover:border-[#0016CB] cursor-pointer'
                  : 'bg-transparent border-[#242424]/40 text-slate-600 cursor-not-allowed'
              }`}
              title="Previous Calendar Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </motion.button>
          )}

          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-wide text-white font-display uppercase">
              DAY {log.day_number} OF {totalDaysInTrip}
            </span>
            <span className="text-[#374151] font-mono text-xs">|</span>
            <span className="text-slate-300 text-xs font-mono">{log.date}</span>
          </div>

          {/* Next Day Button */}
          {onNextDay && (
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!canNextDay}
              onClick={onNextDay}
              className={`p-1.5 rounded-full border text-xs flex items-center justify-center transition-all ${
                canNextDay
                  ? 'bg-[#161616] border-[#242424] text-white hover:border-[#0016CB] cursor-pointer'
                  : 'bg-transparent border-[#242424]/40 text-slate-600 cursor-not-allowed'
              }`}
              title="Next Calendar Day"
            >
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          )}

          <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-mono font-bold bg-[#161616] text-emerald-400 border border-[#242424]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>24.00h Balanced</span>
          </span>
        </div>

        {/* 4 Summary Stat Pills */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <div className="px-2.5 py-1 rounded-sm bg-[#161616] border border-[#242424] text-slate-300">
            <span className="text-slate-500 mr-1.5">OFF:</span>
            <strong className="text-white font-bold">{(log.off_duty_hours ?? 0).toFixed(2)}h</strong>
          </div>
          <div className="px-2.5 py-1 rounded-sm bg-[#161616] border border-[#242424] text-purple-300">
            <span className="text-purple-400 mr-1.5">SLEEP:</span>
            <strong className="text-white font-bold">{(log.sleeper_berth_hours ?? 0).toFixed(2)}h</strong>
          </div>
          <div className="px-2.5 py-1 rounded-sm bg-[#161616] border border-[#242424] text-blue-300">
            <span className="text-blue-400 mr-1.5">DRIVE:</span>
            <strong className="text-white font-bold">{(log.driving_hours ?? 0).toFixed(2)}h</strong>
          </div>
          <div className="px-2.5 py-1 rounded-sm bg-[#161616] border border-[#242424] text-amber-300">
            <span className="text-amber-400 mr-1.5">ON-DUTY:</span>
            <strong className="text-white font-bold">{(log.on_duty_not_driving_hours ?? 0).toFixed(2)}h</strong>
          </div>
        </div>

        {/* Action Buttons: Print, PDF, CSV, JSON */}
        <div className="flex items-center space-x-2">
          <motion.button
            type="button"
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.96 }}
            onClick={handlePrint}
            className="btn-uc-pill px-3 py-1.5 text-xs cursor-pointer font-mono flex items-center gap-1.5"
            title="Print this 24-hour log sheet"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print Sheet</span>
          </motion.button>

          <motion.button
            type="button"
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleExportCsv}
            className="btn-uc-pill px-3 py-1.5 text-xs cursor-pointer font-mono flex items-center gap-1.5 text-emerald-400 hover:text-white"
            title="Download CSV log summary"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>CSV</span>
          </motion.button>

          <motion.button
            type="button"
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleExportJson}
            className="btn-uc-pill px-3 py-1.5 text-xs cursor-pointer font-mono flex items-center gap-1.5 text-cyan-400 hover:text-white"
            title="Download JSON log file"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>JSON</span>
          </motion.button>

          <motion.button
            type="button"
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleExportPdf}
            className="btn-uc-solid px-4 py-1.5 text-xs cursor-pointer font-mono flex items-center gap-1.5 shadow-md"
            title="Download audit-proof PDF"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PDF</span>
          </motion.button>
        </div>
      </div>

      {/* The FMCSA Paper Form (Exact Visual Representation of blank-paper-log.png for Legal DOT Audits) */}
      <div className="p-4 sm:p-6 bg-[#000000]">
        <motion.div
          key={`day-sheet-${log.day_number}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          ref={sheetRef}
          id={`eld-sheet-${log.day_number}`}
          className="p-6 md:p-8 text-slate-900 bg-white font-sans text-xs max-w-5xl mx-auto rounded-xl shadow-lg border border-slate-300"
        >
          {/* Form Title & Legal Instructions Header */}
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-3 mb-4">
            <div>
              <div className="text-[10px] tracking-wider uppercase font-semibold text-slate-600">
                U.S. DEPARTMENT OF TRANSPORTATION — FEDERAL MOTOR CARRIER SAFETY ADMINISTRATION
              </div>
              <h1 className="text-2xl font-black tracking-tight text-slate-950 font-serif">
                DRIVER'S DAILY LOG
              </h1>
              <div className="text-[11px] font-bold text-slate-700">
                (ONE CALENDAR DAY — 24 HOURS)
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center justify-end gap-2 mb-1.5">
                <span className="font-semibold text-slate-700 text-xs">DATE:</span>
                <div className="inline-flex items-center border border-slate-900 px-2 py-0.5 font-mono font-bold text-sm bg-slate-50">
                  <span>{month}</span>
                  <span className="mx-1 text-slate-400">/</span>
                  <span>{day}</span>
                  <span className="mx-1 text-slate-400">/</span>
                  <span>{year}</span>
                </div>
              </div>
              <div className="text-[10px] font-mono text-slate-600">
                24-Hour Period Starting: Midnight (00:00:00)
              </div>
            </div>
          </div>

          {/* Carrier & Vehicle Header Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 border-b border-slate-300 pb-4 mb-4 font-mono text-[11px]">
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-500 block">Name of Carrier</span>
              <span className="font-bold text-slate-900 block truncate">{log.carrier_name}</span>
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-500 block">Main Office Address</span>
              <span className="font-bold text-slate-900 block truncate">{log.carrier_office}</span>
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-500 block">Truck / Tractor No.</span>
              <span className="font-bold text-slate-900 block">#{log.truck_number}</span>
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-500 block">Trailer No.(s)</span>
              <span className="font-bold text-slate-900 block">#{log.trailer_number}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 border-b border-slate-300 pb-4 mb-5 font-mono text-[11px]">
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-500 block">Driver Name</span>
              <span className="font-bold text-slate-900 block truncate">{log.driver_name}</span>
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-500 block">Total Miles Driving Today</span>
              <span className="font-bold text-blue-700 block">
                {((log.driving_hours ?? 0) * 60).toFixed(0)} mi
              </span>
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-500 block">From Location</span>
              <span className="font-bold text-slate-900 block truncate">{log.from_location}</span>
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-500 block">To Location</span>
              <span className="font-bold text-slate-900 block truncate">{log.to_location}</span>
            </div>
          </div>

          {/* 24-Hour Graph Grid */}
          <div className="mb-6 w-full overflow-x-auto pb-2">
            <div className="min-w-[760px]">
              <EldLogGraph log={log} />
            </div>
          </div>

          {/* Remarks & Duty Changes Table */}
          <div className="border border-slate-300 rounded-sm mb-6 overflow-hidden">
            <div className="bg-slate-100 px-3 py-1.5 border-b border-slate-300 font-bold text-[10px] uppercase text-slate-700 flex justify-between">
              <span>Remarks &amp; Duty Status Changes (Time, Location &amp; Activity)</span>
              <span className="font-mono">{log.remarks?.length || 0} Entries</span>
            </div>
            <div className="divide-y divide-slate-200 max-h-48 overflow-y-auto font-mono text-[11px]">
              {(log.remarks || []).map((rem, rIdx) => (
                <div key={rIdx} className="px-3 py-1.5 flex items-center justify-between gap-2">
                  <span className="font-bold text-slate-900 shrink-0">{rem.time}</span>
                  <span className="text-slate-700 truncate flex-1">{rem.location}</span>
                  <span className="text-slate-500 text-[10px]">{rem.note}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Driver Certification Footer */}
          <div className="pt-4 border-t-2 border-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-[10px] text-slate-600 max-w-md italic">
              I certify that these entries are true and correct as prescribed by 49 CFR Part 395 of the Federal Motor Carrier Safety Regulations.
            </div>
            <div className="text-right">
              <span className="text-[9px] uppercase font-bold text-slate-500 block">Driver's Signature</span>
              <span className="font-serif italic font-bold text-base text-blue-900 border-b border-slate-900 pb-0.5 px-4 inline-block">
                {log.driver_signature || log.driver_name}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
