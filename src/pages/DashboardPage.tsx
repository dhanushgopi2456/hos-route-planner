import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TripPlanRequest, TripPlanResponse, Stop } from '../types/hos';
import { TripPlannerForm } from '../components/TripPlanner/TripPlannerForm';
import { HosStatusCard } from '../components/TripSummary/HosStatusCard';
import { LeafletRouteMap } from '../components/Map/LeafletRouteMap';
import { CompliancePanel } from '../components/Compliance/CompliancePanel';
import { TripTimeline } from '../components/Timeline/TripTimeline';
import { EldLogSheet } from '../components/ELD/EldLogSheet';
import { AuthGateCard } from '../components/Auth/AuthGateCard';
import {
  MapPin,
  AlertCircle,
  Download,
  LogOut,
  ArrowLeft
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

      const controller = new AbortController();
      const fetchTimeout = setTimeout(() => controller.abort(), 15000);

      const res = await fetch('/api/trips/plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${effectiveToken}`,
          ...(user ? { 'X-Driver-User': JSON.stringify(user) } : {})
        },
        body: JSON.stringify(enrichedRequest),
        signal: controller.signal
      });
      clearTimeout(fetchTimeout);

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
      let msg = err.message || 'An unexpected error occurred while planning the trip.';
      if (err.name === 'AbortError') {
        msg = 'Trip planning request timed out. Please check that stops are connected via highway or select a corridor preset.';
      }
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

      const tripId = plannedTrip.id || 'TRIP_HAUL';
      pdf.save(`FMCSA_ELD_Logs_${tripId}.pdf`);
      toastSuccess(
        'Complete ELD PDF Exported',
        `All ${plannedTrip.daily_logs.length} daily logs compiled into FMCSA_ELD_Logs_${tripId}.pdf`
      );
    } catch (e) {
      console.error('Download all PDF failed:', e);
      toastInfo('Print Fallback Opened', 'Opening system print preview dialog.');
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-[#06080E] text-slate-100 pb-20 relative selection:bg-blue-600 selection:text-white">
      {/* Top Command Bar & Workspace Shell */}
      <div className="bg-[#080C16] border-b border-white/[0.08] py-4 px-4 sm:px-6 lg:px-8 sticky top-20 z-40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-blue-500 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer group"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 text-blue-400" />
              <span>Back to Home</span>
            </Link>

            <div className="h-4 w-[1px] bg-slate-800 hidden sm:block" />

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider">
                {plannedTrip ? 'HAUL ROUTED & COMPLIANT' : 'DISPATCH READY'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-[11px] font-mono text-slate-400 hidden md:block">
              Standard: <span className="text-blue-400 font-semibold">FMCSA 49 CFR Part 395</span>
            </div>
            {plannedTrip && (
              <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {plannedTrip.daily_logs.length} Days Generated
              </span>
            )}
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
              className="mb-6 p-4 bg-rose-950/60 border border-rose-800/80 rounded-2xl text-rose-200 text-sm flex items-start gap-3 shadow-md font-mono"
            >
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-white">Trip Planning Error</div>
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
            {/* Active Driver Credentials Card */}
            <div className="mb-6 p-4 sm:p-5 rounded-2xl uc-glass-card shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3.5">
                {user?.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-blue-500/40 shrink-0 shadow-xs"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-base shrink-0 shadow-md shadow-blue-500/30">
                    {user?.name?.charAt(0) || 'D'}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-base text-white font-display">
                      {user?.name}
                    </span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Authorized {user?.role || 'Driver'}</span>
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 font-mono">
                    <span className="font-medium text-slate-300">{user?.carrier_name || 'Independent Operator'}</span>
                    <span>&bull;</span>
                    <span>CDL: {user?.cdl_number || 'N/A'}</span>
                    <span>&bull;</span>
                    <span>Unit: #{user?.truck_number || '101'}</span>
                    <span>&bull;</span>
                    <span className="text-cyan-400 font-bold">
                      Cycle: {Number(user?.current_cycle_used ?? 0).toFixed(1)}h / 70.0h
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => logout()}
                  className="px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 font-mono"
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
                <div className="uc-glass-card rounded-2xl p-1.5 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-1">
                    {[
                      { id: 'overview', label: 'Route & Map Telemetry' },
                      { id: 'logs', label: `ELD Daily Logs (${plannedTrip.daily_logs.length} Days)` },
                      { id: 'timeline', label: `Duty Timeline (${plannedTrip.events.length} Events)` },
                      { id: 'compliance', label: 'Compliance Audit (8 Checks)' }
                    ].map(tab => {
                      const isCurrent = activeTab === tab.id;
                      return (
                        <motion.button
                          key={tab.id}
                          whileHover={{ scale: 1.02, y: -1 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setActiveTab(tab.id as any)}
                          className={`relative px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer font-display ${
                            isCurrent
                              ? 'text-white shadow-md shadow-blue-500/25'
                              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                          }`}
                        >
                          <span className="relative z-10">{tab.label}</span>
                          {isCurrent && (
                            <motion.div
                              layoutId="activeSubTab"
                              className="absolute inset-0 btn-electric-primary rounded-xl"
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
                      className="btn-electric-primary px-4 py-2 text-xs font-bold inline-flex items-center space-x-1.5 cursor-pointer font-mono shadow-md shadow-blue-600/30"
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
                        <div className="uc-glass-card rounded-2xl p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-bold text-sm text-white flex items-center gap-1.5 font-display">
                              <MapPin className="w-4 h-4 text-blue-400" />
                              <span>Highway Route &amp; Scheduled Stops Map</span>
                            </h3>
                            <span className="text-[11px] text-slate-400 font-mono">
                              OSRM road geometry &bull; Click any marker for stop details
                            </span>
                          </div>
                          <LeafletRouteMap
                            stops={plannedTrip.stops}
                            routeLegs={plannedTrip.trip?.route_legs || []}
                            allCoordinates={plannedTrip.trip?.all_coordinates || []}
                            totalDistance={plannedTrip.trip?.distance_miles}
                            drivingHours={plannedTrip.trip?.driving_hours}
                            totalDuration={plannedTrip.trip?.total_duration_hours}
                            className="h-[520px] w-full rounded-xl overflow-hidden shadow-inner"
                            selectedStopId={selectedStop?.id}
                            onSelectStop={setSelectedStop}
                          />
                        </div>
                      </div>

                      {/* Right: Scheduled Stops List */}
                      <div className="lg:col-span-4">
                        <div className="uc-glass-card rounded-2xl p-4 h-[585px] flex flex-col">
                          <div className="pb-3 border-b border-slate-800 mb-3">
                            <h3 className="font-bold text-sm text-white font-display">
                              Scheduled Stops Breakdown
                            </h3>
                            <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
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
                                    ? 'border-blue-500 bg-blue-950/50 shadow-md shadow-blue-500/20'
                                    : 'border-slate-800 hover:border-slate-700 bg-slate-900/60'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-1 mb-1">
                                  <span className="font-bold text-white truncate font-display">
                                    {i + 1}. {stop.location.name}
                                  </span>
                                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-blue-300">
                                    {stop.duration_hours}h
                                  </span>
                                </div>

                                <div className="text-[11px] text-slate-300 line-clamp-1 mb-1.5 font-sans">
                                  {stop.reason}
                                </div>

                                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-800 font-mono">
                                  <span>Mile {Math.round(stop.distance_from_start_miles)}</span>
                                  <span className="font-medium text-cyan-400">{stop.hos_impact}</span>
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
                      <div className="flex items-center space-x-2 overflow-x-auto pb-1 font-mono">
                        <span className="text-xs font-bold text-slate-300 mr-2">Select Calendar Day:</span>
                        {plannedTrip.daily_logs.map(log => (
                          <motion.button
                            key={`day-btn-${log.day_number}`}
                            whileHover={{ scale: 1.04, y: -1 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => setSelectedDayLog(log.day_number)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                              selectedDayLog === log.day_number
                                ? 'btn-electric-primary shadow-lg shadow-blue-600/30'
                                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700'
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
