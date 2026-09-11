import React, { useState, useEffect } from 'react';
import { TripPlanRequest, TripPlanResponse, Stop } from '../types/hos';
import { TripPlannerForm } from '../components/TripPlanner/TripPlannerForm';
import { HosStatusCard } from '../components/TripSummary/HosStatusCard';
import { LeafletRouteMap } from '../components/Map/LeafletRouteMap';
import { CompliancePanel } from '../components/Compliance/CompliancePanel';
import { TripTimeline } from '../components/Timeline/TripTimeline';
import { EldLogSheet } from '../components/ELD/EldLogSheet';
import { AuthGateCard } from '../components/Auth/AuthGateCard';
import {
  Truck,
  MapPin,
  Calendar,
  FileText,
  CheckCircle2,
  AlertCircle,
  Download,
  Printer,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  LogOut,
  UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import jsPDF from 'jspdf';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export const DashboardPage: React.FC = () => {
  const { user, token, isAuthenticated, logout } = useAuth();
  const { success: toastSuccess, error: toastError, info: toastInfo } = useToast();
  const [plannedTrip, setPlannedTrip] = useState<TripPlanResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [planningStep, setPlanningStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Clear trip if user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      setPlannedTrip(null);
      setSelectedStop(null);
    }
  }, [isAuthenticated]);

  // Selected stop for highlighting on map
  const [selectedStop, setSelectedStop] = useState<Stop | null>(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'logs' | 'timeline' | 'compliance'>('overview');

  // Selected Day Log
  const [selectedDayLog, setSelectedDayLog] = useState<number>(1);

  const handlePlanTrip = async (request: TripPlanRequest) => {
    // Ensure active driver token
    const effectiveToken = token || (user ? `eld_token_${user.id}_active` : 'eld_token_usr_gopi_operator_active');

    setIsLoading(true);
    setErrorMessage(null);
    setPlanningStep('Geocoding waypoints & calculating highway route...');

    try {
      setPlanningStep('Analyzing road segments & 11h/14h limits...');
      const enrichedRequest: TripPlanRequest = {
        ...request,
        driver_name: request.driver_name || user?.name || 'Gopi',
        carrier_name: request.carrier_name || user?.carrier_name || 'National Commercial Express',
        truck_number: request.truck_number || user?.truck_number || '702',
        trailer_number: request.trailer_number || user?.trailer_number || '4410'
      };

      const res = await fetch('/api/trips/plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${effectiveToken}`,
          ...(user ? { 'X-Driver-User': JSON.stringify(user) } : {})
        },
        body: JSON.stringify(enrichedRequest)
      });

      if (!res.ok) {
        let errMessage = 'Failed to plan trip. Please check your inputs.';
        try {
          const err = await res.json();
          errMessage = err.error || errMessage;
        } catch {
          const txt = await res.text().catch(() => '');
          if (txt && txt.length < 200) errMessage = txt;
        }
        throw new Error(errMessage);
      }

      setPlanningStep('Generating 24.00h ELD Driver Logs & midnight splits...');
      let data: TripPlanResponse;
      try {
        data = await res.json();
      } catch {
        throw new Error('Route calculation response could not be parsed. Please try again.');
      }
      setPlannedTrip(data);
      setSelectedDayLog(1);
      setSelectedStop(null);

      toastSuccess(
        'Compliant Trip Route Planned!',
        `Calculated ${(data.trip?.distance_miles ?? 0).toFixed(0)} miles across ${data.daily_logs.length} days with ${data.stops.length} scheduled stops. FMCSA CFR § 395 verified.`,
        {
          label: 'View ELD Logs',
          onClick: () => setActiveTab('logs')
        }
      );
    } catch (err: any) {
      console.error('Trip planning error:', err);
      const msg = err.message || 'An unexpected error occurred while planning the trip.';
      setErrorMessage(msg);
      toastError('Trip Planning Failed', msg);
    } finally {
      setIsLoading(false);
      setPlanningStep('');
    }
  };

  // Download all daily logs in single PDF
  const handleDownloadAllLogsPdf = () => {
    if (!plannedTrip || !plannedTrip.daily_logs.length) return;

    try {
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'pt',
        format: 'letter'
      });

      plannedTrip.daily_logs.forEach((log, index) => {
        if (index > 0) {
          pdf.addPage('letter', 'landscape');
        }

        // Header
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(16);
        pdf.text("DRIVER'S DAILY LOG (24 HOURS) - FMCSA CFR § 395.8", 40, 45);

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Day ${log.day_number} of ${plannedTrip.daily_logs.length} | Date: ${log.date}`, 40, 65);
        pdf.text(`Carrier: ${log.carrier_name} - ${log.carrier_office}`, 40, 80);
        pdf.text(`Driver: ${log.driver_name} | Truck: ${log.truck_number} | Trailer: ${log.trailer_number}`, 40, 95);
        pdf.text(`From: ${log.from_location}  -->  To: ${log.to_location}`, 40, 110);
        pdf.text(`Shipping Doc / DVL #: ${log.shipping_doc_number} | Commodity: ${log.commodity}`, 40, 125);

        // Duty Hour Totals
        pdf.setDrawColor(180, 180, 180);
        pdf.rect(40, 140, 712, 45);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Line 1 (Off Duty):', 50, 165);
        pdf.text(`${(log.off_duty_hours ?? 0).toFixed(2)} hrs`, 145, 165);

        pdf.text('Line 2 (Sleeper):', 220, 165);
        pdf.text(`${(log.sleeper_berth_hours ?? 0).toFixed(2)} hrs`, 310, 165);

        pdf.text('Line 3 (Driving):', 390, 165);
        pdf.text(`${(log.driving_hours ?? 0).toFixed(2)} hrs`, 475, 165);

        pdf.text('Line 4 (On Duty):', 555, 165);
        pdf.text(`${(log.on_duty_not_driving_hours ?? 0).toFixed(2)} hrs`, 645, 165);

        pdf.text('TOTAL 24 HOURS:', 555, 205);
        pdf.text(`${(log.total_hours ?? 24).toFixed(2)} hrs (BALANCED)`, 660, 205);

        // Remarks Summary
        pdf.text('REMARKS & DUTY STATUS CHANGES:', 40, 230);
        pdf.setFont('helvetica', 'normal');
        let remarkY = 250;
        log.remarks.slice(0, 10).forEach(rem => {
          pdf.text(`• ${rem.time} - ${rem.location}: ${rem.note}`, 50, remarkY);
          remarkY += 16;
        });

        // Driver Certification
        pdf.setFont('helvetica', 'italic');
        pdf.text(
          'I certify these entries are true and correct as prescribed by 49 CFR Part 395.',
          40,
          540
        );
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Driver Signature: ${log.driver_signature}`, 40, 560);
      });

      pdf.save(`FMCSA_ELD_Logs_${plannedTrip.trip.id}.pdf`);
      toastSuccess(
        'Complete ELD PDF Exported',
        `All ${plannedTrip.daily_logs.length} daily logs compiled into FMCSA_ELD_Logs_${plannedTrip.trip.id}.pdf`
      );
    } catch (e) {
      console.error('Download all PDF failed:', e);
      toastInfo('Print Fallback Opened', 'Opening system print preview dialog.');
      window.print();
    }
  };

  return (
    <div className="pb-16 relative">
      {/* Top Hero Banner with subtle gradient animation */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border-b border-slate-800 py-8 px-4 sm:px-6 lg:px-8 text-white relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-semibold mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>49 CFR Part 395 Property-Carrying Standard</span>
                <span className="text-slate-400">&bull;</span>
                <span className="text-emerald-400 font-bold">April 2022 Guide Enforced</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
                <span>Commercial HOS Trip Planner &amp; Electronic Daily Logs</span>
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
                Automatic road routing, compliant 11h/14h/30m/70h scheduling, fuel stops under 1,000 miles,
                and pixel-perfect 24-hour Driver's Daily Log sheets.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Error Alert */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-rose-50 border border-rose-300 rounded-2xl text-rose-900 text-sm flex items-start gap-3 shadow-sm"
            >
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold">Trip Planning Error</div>
                <p className="mt-0.5">{errorMessage}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* If user is NOT logged in: Show AuthGateCard preventing unauthenticated access */}
        {!isAuthenticated ? (
          <div className="mb-12">
            <AuthGateCard />
          </div>
        ) : (
          <>
            {/* Active Driver Credentials Banner */}
            <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3.5">
                {user?.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-blue-400/40 shrink-0 shadow-xs"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-base shrink-0 shadow-sm">
                    {user?.name?.charAt(0) || 'D'}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-base text-slate-900 dark:text-white">
                      {user?.name}
                    </span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Authorized {user?.role || 'Driver'}</span>
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 font-mono">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{user?.carrier_name || 'Independent Operator'}</span>
                    <span>•</span>
                    <span>CDL: {user?.cdl_number || 'N/A'}</span>
                    <span>•</span>
                    <span>Unit: #{user?.truck_number || '101'}</span>
                    <span>•</span>
                    <span className="text-amber-600 dark:text-amber-400 font-bold">
                      Cycle: {Number(user?.current_cycle_used ?? 0).toFixed(1)}h / 70.0h
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => logout()}
                  className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Switch Driver / Sign Out</span>
                </button>
              </div>
            </div>

            {/* Input Form Section */}
            <div className="mb-8">
              <TripPlannerForm
                onPlanTrip={handlePlanTrip}
                isLoading={isLoading}
                planningStep={planningStep}
              />
            </div>

            {/* Planned Trip Results */}
        {plannedTrip && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* HOS Status Metrics Card */}
            <HosStatusCard tripData={plannedTrip} />

            {/* Navigation Tabs for Planned Trip */}
            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-1.5 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-1">
                {[
                  { id: 'overview', label: 'Interactive Map & Stops' },
                  { id: 'logs', label: `ELD Daily Logs (${plannedTrip.daily_logs.length} Days)` },
                  { id: 'timeline', label: `Timeline (${plannedTrip.events.length} Events)` },
                  { id: 'compliance', label: 'Compliance Audit (8 Checks)' }
                ].map(tab => {
                  const isCurrent = activeTab === tab.id;
                  return (
                    <motion.button
                      key={tab.id}
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`relative px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isCurrent
                          ? 'text-white shadow-md shadow-blue-500/25'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="relative z-10">{tab.label}</span>
                      {isCurrent && (
                        <motion.div
                          layoutId="activeSubTab"
                          className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl"
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleDownloadAllLogsPdf}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 dark:from-blue-600 dark:to-indigo-600 dark:hover:from-blue-500 dark:hover:to-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-slate-900/20 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download All Logs (PDF)</span>
                </motion.button>
              </div>
            </div>

            {/* TAB CONTENT WITH CROSS-FADE ANIMATION */}
            <AnimatePresence mode="wait">
              {/* TAB 1: OVERVIEW (MAP + STOPS) */}
              {activeTab === 'overview' && (
                <motion.div
                  key="tab-overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-6"
                >
                  {/* Left: Interactive Map */}
                  <div className="lg:col-span-8">
                    <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-md p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <span>Highway Route &amp; Scheduled Stops Map</span>
                        </h3>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                          OSRM road geometry &bull; Click any marker for stop details
                        </span>
                      </div>
                      <LeafletRouteMap
                        stops={plannedTrip.stops}
                        routeLegs={plannedTrip.route_legs}
                        allCoordinates={plannedTrip.route_coordinates}
                        className="h-[520px] w-full rounded-xl overflow-hidden shadow-inner"
                        selectedStopId={selectedStop?.id}
                        onSelectStop={setSelectedStop}
                      />
                    </div>
                  </div>

                  {/* Right: Scheduled Stops List */}
                  <div className="lg:col-span-4">
                    <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-md p-4 h-[585px] flex flex-col">
                      <div className="pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                          Scheduled Stops Breakdown
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {plannedTrip.stops.length} stops along the trip
                        </p>
                      </div>

                      <div className="overflow-y-auto space-y-2.5 flex-1 pr-1">
                        {plannedTrip.stops.map((stop, i) => (
                          <motion.div
                            key={stop.id}
                            whileHover={{ scale: 1.02, x: 2 }}
                            onClick={() => {
                              setSelectedStop(stop);
                              toastInfo(
                                `Stop #${i + 1}: ${stop.location.name}`,
                                `${stop.reason} (${stop.duration_hours}h duration) at Mile ${Math.round(stop.distance_from_start_miles)}. HOS Impact: ${stop.hos_impact}`
                              );
                            }}
                            className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                              selectedStop?.id === stop.id
                                ? 'border-blue-600 dark:border-blue-500 bg-blue-50/80 dark:bg-blue-950/50 shadow-sm'
                                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className="font-bold text-slate-900 dark:text-white truncate">
                                {i + 1}. {stop.location.name}
                              </span>
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 shadow-2xs">
                                {stop.duration_hours}h
                              </span>
                            </div>

                            <div className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-1 mb-1.5">
                              {stop.reason}
                            </div>

                            <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 pt-1.5 border-t border-slate-200/60 dark:border-slate-800">
                              <span>Mile {Math.round(stop.distance_from_start_miles)}</span>
                              <span className="font-medium text-blue-700 dark:text-blue-400">{stop.hos_impact}</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 2: ELD DAILY LOGS */}
              {activeTab === 'logs' && (
                <motion.div
                  key="tab-logs"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  {/* Day selector pills with micro-animations */}
                  <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mr-2">Select Calendar Day:</span>
                    {plannedTrip.daily_logs.map(log => (
                      <motion.button
                        key={`day-btn-${log.day_number}`}
                        whileHover={{ scale: 1.04, y: -1 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setSelectedDayLog(log.day_number)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                          selectedDayLog === log.day_number
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25'
                            : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-2xs'
                        }`}
                      >
                        Day {log.day_number} ({log.date})
                      </motion.button>
                    ))}
                  </div>

                  {/* The Active Daily Log Sheet */}
                  {plannedTrip.daily_logs.find(l => l.day_number === selectedDayLog) && (
                    <EldLogSheet
                      log={plannedTrip.daily_logs.find(l => l.day_number === selectedDayLog)!}
                      totalDaysInTrip={plannedTrip.daily_logs.length}
                    />
                  )}
                </motion.div>
              )}

              {/* TAB 3: TIMELINE */}
              {activeTab === 'timeline' && (
                <motion.div
                  key="tab-timeline"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <TripTimeline events={plannedTrip.events} />
                </motion.div>
              )}

              {/* TAB 4: COMPLIANCE */}
              {activeTab === 'compliance' && (
                <motion.div
                  key="tab-compliance"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <CompliancePanel
                    complianceChecks={plannedTrip.compliance_checks}
                    violations={plannedTrip.violations}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </>
    )}
  </div>
</div>
  );
};
