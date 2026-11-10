import React, { useRef } from 'react';
import { DailyLog } from '../../types/hos';
import { EldLogGraph } from './EldLogGraph';
import { Printer, Download, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import jsPDF from 'jspdf';
import { useToast } from '../../context/ToastContext';

interface EldLogSheetProps {
  log: DailyLog;
  totalDaysInTrip?: number;
  onDownloadPdf?: () => void;
}

export const EldLogSheet: React.FC<EldLogSheetProps> = ({
  log,
  totalDaysInTrip = 1,
  onDownloadPdf
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
    <div className="uc-glass-card rounded-2xl overflow-hidden print:border-none print:shadow-none print:m-0 print:bg-white">
      {/* Top Action & Duty Hours Bar (hidden in print) */}
      <div className="bg-[#0B0F19]/90 border-b border-white/10 px-6 py-4 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-wide text-white font-display">
              DAY {log.day_number} OF {totalDaysInTrip}
            </span>
            <span className="text-slate-500 font-mono text-xs">|</span>
            <span className="text-slate-300 text-xs font-mono">{log.date}</span>
          </div>

          <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>24.00h Balanced</span>
          </span>
        </div>

        {/* 4 Summary Stat Pills */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <div className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300">
            <span className="text-slate-500 mr-1.5">Off:</span>
            <strong className="text-white font-bold">{(log.off_duty_hours ?? 0).toFixed(2)}h</strong>
          </div>
          <div className="px-2.5 py-1 rounded-lg bg-purple-950/40 border border-purple-800/60 text-purple-300">
            <span className="text-purple-400 mr-1.5">Sleep:</span>
            <strong className="text-white font-bold">{(log.sleeper_berth_hours ?? 0).toFixed(2)}h</strong>
          </div>
          <div className="px-2.5 py-1 rounded-lg bg-blue-950/40 border border-blue-800/60 text-blue-300">
            <span className="text-blue-400 mr-1.5">Drive:</span>
            <strong className="text-white font-bold">{(log.driving_hours ?? 0).toFixed(2)}h</strong>
          </div>
          <div className="px-2.5 py-1 rounded-lg bg-amber-950/40 border border-amber-800/60 text-amber-300">
            <span className="text-amber-400 mr-1.5">On-Duty:</span>
            <strong className="text-white font-bold">{(log.on_duty_not_driving_hours ?? 0).toFixed(2)}h</strong>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.96 }}
            onClick={handlePrint}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-all cursor-pointer font-mono"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Sheet</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleExportPdf}
            className="btn-electric-primary px-4 py-1.5 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer font-mono shadow-md shadow-blue-600/30"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </motion.button>
        </div>
      </div>

      {/* The FMCSA Paper Form (Exact Visual Representation of blank-paper-log.png for Legal DOT Audits) */}
      <div className="p-4 sm:p-6 bg-slate-950/60">
        <div
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
              <div className="text-[9.5px] text-slate-500 uppercase tracking-tight font-mono">
                ORIGINAL — File at home terminal
              </div>
              <div className="text-[9.5px] text-slate-500 uppercase tracking-tight font-mono">
                DUPLICATE — Driver retains in possession for 8 days
              </div>
            </div>
          </div>

          {/* Section 1: Trip Route & Vehicle Information */}
          <div className="grid grid-cols-12 gap-3 mb-4 border border-slate-400 p-3 rounded-md bg-slate-50/50">
            {/* From / To */}
            <div className="col-span-12 md:col-span-6 grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-600 block">From:</span>
                <div className="border-b border-slate-800 font-semibold text-slate-900 pb-0.5 truncate">
                  {log.from_location}
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-600 block">To:</span>
                <div className="border-b border-slate-800 font-semibold text-slate-900 pb-0.5 truncate">
                  {log.to_location}
                </div>
              </div>
            </div>

            {/* Mileage Boxes */}
            <div className="col-span-6 md:col-span-3">
              <div className="border border-slate-400 bg-white p-1.5 rounded text-center">
                <span className="text-[9px] font-bold uppercase text-slate-600 block">
                  Total Miles Driving Today
                </span>
                <span className="text-base font-bold font-mono text-slate-950">
                  {log.total_miles_driving_today} mi
                </span>
              </div>
            </div>

            <div className="col-span-6 md:col-span-3">
              <div className="border border-slate-400 bg-white p-1.5 rounded text-center">
                <span className="text-[9px] font-bold uppercase text-slate-600 block">
                  Total Mileage Today
                </span>
                <span className="text-base font-bold font-mono text-slate-950">
                  {log.total_mileage_today} mi
                </span>
              </div>
            </div>

            {/* Vehicle & Carrier info */}
            <div className="col-span-12 md:col-span-4">
              <span className="text-[10px] font-bold uppercase text-slate-600 block">
                Truck / Tractor &amp; Trailer Number:
              </span>
              <div className="border-b border-slate-800 font-semibold text-slate-900 pb-0.5">
                Unit #{log.truck_number} / Trailer #{log.trailer_number}
              </div>
            </div>

            <div className="col-span-12 md:col-span-4">
              <span className="text-[10px] font-bold uppercase text-slate-600 block">
                Name of Carrier or Carriers:
              </span>
              <div className="border-b border-slate-800 font-semibold text-slate-900 pb-0.5 truncate">
                {log.carrier_name}
              </div>
            </div>

            <div className="col-span-12 md:col-span-4">
              <span className="text-[10px] font-bold uppercase text-slate-600 block">
                Main Office Address:
              </span>
              <div className="border-b border-slate-800 font-semibold text-slate-900 pb-0.5 truncate">
                {log.carrier_office}
              </div>
            </div>

            <div className="col-span-12 md:col-span-6">
              <span className="text-[10px] font-bold uppercase text-slate-600 block">
                Home Terminal Address:
              </span>
              <div className="border-b border-slate-800 font-semibold text-slate-900 pb-0.5 truncate">
                {log.home_terminal}
              </div>
            </div>

            <div className="col-span-12 md:col-span-6">
              <span className="text-[10px] font-bold uppercase text-slate-600 block">
                Driver's Signature in Full:
              </span>
              <div className="border-b border-slate-800 font-serif italic text-base text-blue-900 pb-0.5">
                {log.driver_signature}
              </div>
            </div>
          </div>

          {/* Section 2: The 24-Hour Graph Grid */}
          <div className="mb-4">
            <EldLogGraph log={log} />
          </div>

          {/* Section 3: Remarks Section */}
          <div className="border border-slate-400 p-3 rounded-md mb-4 bg-white">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1.5 mb-2">
              <span className="font-bold uppercase tracking-wider text-xs text-slate-900">
                REMARKS — Duty Status Changes &amp; Route Locations
              </span>
              <span className="text-[10px] text-slate-500 italic">
                Enter city/town &amp; state at each duty status change. Time standard: Home terminal.
              </span>
            </div>

            {log.remarks && log.remarks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 text-xs">
                {log.remarks.map((r, i) => (
                  <div key={`remark-${i}`} className="flex items-center space-x-2 py-0.5 border-b border-slate-100">
                    <span className="font-mono font-bold text-slate-800 w-12 shrink-0">{r.time}</span>
                    <span className="font-semibold text-slate-900 truncate">{r.location}</span>
                    <span className="text-slate-400">—</span>
                    <span className="text-slate-600 italic truncate">{r.note}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 italic text-xs py-2">No status changes on this day.</p>
            )}

            {/* Shipping document numbers & commodity */}
            <div className="mt-3 pt-2 border-t border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-600 block">
                  Shipping Document / DVL / Manifest No:
                </span>
                <span className="font-mono font-bold text-slate-900">{log.shipping_doc_number}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-600 block">Shipper:</span>
                <span className="font-medium text-slate-900">{log.shipper}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-600 block">Commodity:</span>
                <span className="font-medium text-slate-900">{log.commodity}</span>
              </div>
            </div>
          </div>

          {/* Section 4: 70-Hour / 8-Day Rolling Recap Table */}
          <div className="border border-slate-900 p-3 rounded-md bg-slate-50">
            <div className="flex items-center justify-between border-b border-slate-300 pb-1 mb-2">
              <span className="font-bold text-xs text-slate-900 tracking-wide uppercase">
                70 HOUR / 8 DAY DRIVERS CYCLE RECAP (Complete at end of day)
              </span>
              <span className="text-[10px] font-bold text-blue-700">
                *34 consecutive hours off duty resets cycle to 70 hours
              </span>
            </div>

            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="border border-slate-300 bg-white p-2 rounded">
                <span className="text-[9px] font-bold uppercase text-slate-600 block">
                  On Duty Today (Lines 3 &amp; 4)
                </span>
                <span className="font-mono font-bold text-sm text-slate-900">
                  {(log.recap?.on_duty_today ?? 0).toFixed(2)} h
                </span>
              </div>

              <div className="border border-slate-300 bg-white p-2 rounded">
                <span className="text-[9px] font-bold uppercase text-slate-600 block">
                  A. Total On Duty Last 7 Days (inc. today)
                </span>
                <span className="font-mono font-bold text-sm text-slate-900">
                  {(log.recap?.total_last_7_days ?? 0).toFixed(2)} h
                </span>
              </div>

              <div className="border border-slate-300 bg-white p-2 rounded">
                <span className="text-[9px] font-bold uppercase text-slate-600 block">
                  B. Hours Available Tomorrow (70h minus A)
                </span>
                <span className="font-mono font-bold text-sm text-emerald-700">
                  {(log.recap?.available_tomorrow ?? 0).toFixed(2)} h
                </span>
              </div>

              <div className="border border-slate-300 bg-white p-2 rounded">
                <span className="text-[9px] font-bold uppercase text-slate-600 block">
                  C. Total On Duty Last 8 Days (inc. today)
                </span>
                <span className="font-mono font-bold text-sm text-slate-900">
                  {(log.recap?.total_last_8_days ?? 0).toFixed(2)} h
                </span>
              </div>
            </div>

            <div className="mt-2 text-[10px] text-slate-600 flex items-center justify-between">
              <span>
                Driver Certification: <em>I certify that these entries are true and correct.</em>
              </span>
              <span className="font-serif italic text-slate-800">
                Signed: {log.driver_signature}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
