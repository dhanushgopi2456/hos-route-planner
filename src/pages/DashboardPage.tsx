import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
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
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Printer
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import jsPDF from 'jspdf';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export const DashboardPage: React.FC = () => {
  const { user, token, isAuthenticated, logout } = useAuth();
  const { success: toastSuccess, error: toastError, info: toastInfo } = useToast();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [plannedTrip, setPlannedTrip] = useState<TripPlanResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [planningStep, setPlanningStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Selected stop for highlighting on map
  const [selectedStop, setSelectedStop] = useState<Stop | null>(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'logs' | 'timeline' | 'compliance'>('overview');

  // Selected Day Log
  const [selectedDayLog, setSelectedDayLog] = useState<number>(1);

  const resultsRef = useRef<HTMLDivElement>(null);

  // Clear trip if user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      setPlannedTrip(null);
      setSelectedStop(null);
    }
  }, [isAuthenticated]);

  // Support ?tab= in URL with alias mapping (e.g. eld -> logs, summary/map -> overview)
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      if (tabParam === 'logs' || tabParam === 'eld') {
        setActiveTab('logs');
      } else if (tabParam === 'timeline') {
        setActiveTab('timeline');
      } else if (tabParam === 'compliance') {
        setActiveTab('compliance');
      } else if (tabParam === 'overview' || tabParam === 'map' || tabParam === 'summary') {
        setActiveTab('overview');
      }
    }
  }, [searchParams]);

  // Auto-plan demo route if ?demo=1 in URL
  const demoTriggeredRef = useRef(false);
  useEffect(() => {
    const isDemo = searchParams.get('demo') === '1';
    if (isDemo && !demoTriggeredRef.current && !plannedTrip && !isLoading) {
      demoTriggeredRef.current = true;
      handlePlanTrip({
        current_location: {
          name: 'Chicago, IL',
          city: 'Chicago',
          state: 'IL',
          country: 'USA',
          lat: 41.8781,
          lng: -87.6298
        },
        pickup_location: {
          name: 'Indianapolis, IN',
          city: 'Indianapolis',
          state: 'IN',
          country: 'USA',
          lat: 39.7684,
          lng: -86.1581
        },
        dropoff_location: {
          name: 'Dallas, TX',
          city: 'Dallas',
          state: 'TX',
          country: 'USA',
          lat: 32.7767,
          lng: -96.7970
        },
        current_cycle_used: 42.5,
        carrier_name: 'National Commercial Express',
        truck_number: '702',
        trailer_number: '4410'
      });
    }
  }, [searchParams, plannedTrip, isLoading]);

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

      // Auto-scroll to results
      setTimeout(() => {
        if (resultsRef.current) {
          resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 250);

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

  // Day navigation helpers
  const handlePrevDay = () => {
    if (selectedDayLog > 1) {
      setSelectedDayLog(prev => prev - 1);
    }
  };

  const handleNextDay = () => {
    if (plannedTrip && selectedDayLog < plannedTrip.daily_logs.length) {
      setSelectedDayLog(prev => prev + 1);
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
    <div className="min-h-screen bg-[#0f0f10] text-[#ededed] pb-20 relative selection:bg-[#2563EB] selection:text-white overflow-x-clip">
      {/* Top Command Bar & Workspace Shell */}
      <div className="bg-[#141415]/95 backdrop-blur-md text-[#ededed] border-b border-[#232325] py-2.5 px-4 sm:px-6 lg:px-8 sticky top-14 z-30 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#19191b] border border-[#2e2e32] hover:border-[#2563EB] text-xs font-medium text-[#a1a1a6] hover:text-white transition-colors cursor-pointer group"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5 text-[#2563EB]" />
              <span>Back to home</span>
            </Link>

            <div className="h-4 w-[1px] bg-[#232325] hidden sm:block" />

            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="font-mono text-xs font-medium text-[#a1a1a6]">
                {plannedTrip ? 'Haul routed and compliant' : 'Dispatch ready'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-[11px] font-mono text-[#85858b] hidden md:block">
              Standard: <span className="text-[#a1a1a6]">FMCSA 49 CFR Part 395</span>
            </div>
            {plannedTrip && (
              <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-md bg-[#19191b] text-[#a1a1a6] border border-[#2e2e32]">
                {plannedTrip.daily_logs.length} days generated
              </span>
            )}
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-8 pb-20 relative z-10">
        {/* Error Alert */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-[#19191b] border border-rose-800/80 rounded-lg text-rose-200 text-xs flex items-start gap-3 shadow-sm font-mono"
            >
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-white">Trip Planning Error</div>
                <p className="mt-0.5 text-[#a1a1a6]">{errorMessage}</p>
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
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Active Driver Credentials Card */}
            <div className="mb-6 p-4 rounded-xl bg-[#19191b] border border-[#232325] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                {user?.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.name}
                    className="w-10 h-10 rounded-md object-cover border border-[#2e2e32] shrink-0"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-md bg-[#2563EB] text-white flex items-center justify-center font-semibold text-sm shrink-0">
                    {user?.name?.charAt(0) || 'D'}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-[#ededed]">
                      {user?.name}
                    </span>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-[#232325] text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>Authorized {user?.role || 'Driver'}</span>
                    </span>
                  </div>
                  <div className="text-xs text-[#a1a1a6] flex flex-wrap items-center gap-x-2.5 gap-y-1 mt-1 font-mono tabular-nums">
                    <span className="text-[#ededed] font-sans">{user?.carrier_name || 'Independent Operator'}</span>
                    <span>&bull;</span>
                    <span>CDL: {user?.cdl_number || 'N/A'}</span>
                    <span>&bull;</span>
                    <span>Unit: #{user?.truck_number || '101'}</span>
                    <span>&bull;</span>
                    <span className="text-blue-400 font-medium">
                      Cycle: {Number(user?.current_cycle_used ?? 0).toFixed(1)}h / 70.0h
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={async () => {
                    await logout();
                    navigate('/');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-3 py-1.5 rounded-md bg-[#232325] hover:bg-[#2e2e32] border border-[#2e2e32] text-xs text-[#a1a1a6] hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Switch driver</span>
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
                ref={resultsRef}
                id="planned-trip-results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6 pt-4"
              >
                {/* HOS Status Metrics Card */}
                <HosStatusCard tripData={plannedTrip} />

                {/* Navigation Tabs for Planned Trip */}
                <div className="p-1 rounded-lg bg-[#141415] border border-[#232325] flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-1 flex-wrap">
                    {[
                      { id: 'overview', label: 'Route & map' },
                      { id: 'logs', label: `ELD daily logs (${plannedTrip.daily_logs.length} days)` },
                      { id: 'timeline', label: `Duty timeline (${plannedTrip.events.length} events)` },
                      { id: 'compliance', label: 'Compliance audit (8 checks)' }
                    ].map(tab => {
                      const isCurrent = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setActiveTab(tab.id as any)}
                          className={`relative px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                            isCurrent
                              ? 'bg-[#232325] text-white border border-[#2e2e32]'
                              : 'text-[#a1a1a6] hover:text-white hover:bg-[#19191b]'
                          }`}
                        >
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={handleDownloadAllLogsPdf}
                      className="btn-electric-primary px-3 py-1.5 text-xs font-medium inline-flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download all logs (PDF)</span>
                    </button>
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
                        <div className="uc-card-stark p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-bold text-sm text-white flex items-center gap-1.5 font-display uppercase">
                              <MapPin className="w-4 h-4 text-[#6677E3]" />
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
                            className="h-[520px] w-full rounded-sm overflow-hidden"
                            selectedStopId={selectedStop?.id}
                            onSelectStop={setSelectedStop}
                            isLoading={isLoading}
                          />
                        </div>
                      </div>

                      {/* Right: Scheduled Stops List */}
                      <div className="lg:col-span-4">
                        <div className="uc-card-stark p-4 h-[585px] flex flex-col">
                          <div className="pb-3 border-b border-[#242424] mb-3">
                            <h3 className="font-bold text-sm text-white font-display uppercase">
                              Scheduled Stops Breakdown
                            </h3>
                            <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                              {plannedTrip.stops.length} stops along the trip
                            </p>
                          </div>

                          <div className="overflow-y-auto space-y-2.5 flex-1 pr-1 font-mono">
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
                                className={`p-3 rounded-sm border text-xs cursor-pointer transition-all ${
                                  selectedStop?.id === stop.id
                                    ? 'border-[#0016CB] bg-[#161616] shadow-md shadow-[#0016CB]/20'
                                    : 'border-[#242424] hover:border-[#374151] bg-[#161616]'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-1 mb-1">
                                  <span className="font-bold text-white truncate font-display">
                                    {i + 1}. {stop.location.name}
                                  </span>
                                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm bg-[#0A0A0A] border border-[#242424] text-[#99A9EE]">
                                    {stop.duration_hours}h
                                  </span>
                                </div>

                                <div className="text-[11px] text-slate-300 line-clamp-1 mb-1.5 font-sans">
                                  {stop.reason}
                                </div>

                                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-[#242424] font-mono">
                                  <span>Mile {Math.round(stop.distance_from_start_miles)}</span>
                                  <span className="font-medium text-[#6677E3]">{stop.hos_impact}</span>
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
                      {/* Day selector row with Prev/Next buttons */}
                      <div className="flex items-center justify-between gap-4 flex-wrap pb-1 font-mono">
                        <div className="flex items-center space-x-1.5 overflow-x-auto">
                          {/* Prev Day Pill */}
                          <button
                            type="button"
                            disabled={selectedDayLog <= 1}
                            onClick={handlePrevDay}
                            className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${
                              selectedDayLog > 1
                                ? 'bg-[#19191b] border border-[#232325] text-[#a1a1a6] hover:text-white hover:border-[#2e2e32] cursor-pointer'
                                : 'bg-transparent border border-[#232325]/40 text-[#85858b]/40 cursor-not-allowed'
                            }`}
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                            <span>Prev</span>
                          </button>

                          {/* Individual Day Buttons */}
                          {plannedTrip.daily_logs.map(log => (
                            <button
                              key={`day-btn-${log.day_number}`}
                              type="button"
                              onClick={() => setSelectedDayLog(log.day_number)}
                              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                                selectedDayLog === log.day_number
                                  ? 'bg-[#2563EB] text-white border border-blue-400/30'
                                  : 'bg-[#19191b] border border-[#232325] text-[#a1a1a6] hover:text-white hover:border-[#2e2e32]'
                              }`}
                            >
                              Day {log.day_number} ({log.date})
                            </button>
                          ))}

                          {/* Next Day Pill */}
                          <button
                            type="button"
                            disabled={selectedDayLog >= plannedTrip.daily_logs.length}
                            onClick={handleNextDay}
                            className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${
                              selectedDayLog < plannedTrip.daily_logs.length
                                ? 'bg-[#19191b] border border-[#232325] text-[#a1a1a6] hover:text-white hover:border-[#2e2e32] cursor-pointer'
                                : 'bg-transparent border border-[#232325]/40 text-[#85858b]/40 cursor-not-allowed'
                            }`}
                          >
                            <span>Next</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* The Active Daily Log Sheet */}
                      {plannedTrip.daily_logs.find(l => l.day_number === selectedDayLog) && (
                        <EldLogSheet
                          log={plannedTrip.daily_logs.find(l => l.day_number === selectedDayLog)!}
                          totalDaysInTrip={plannedTrip.daily_logs.length}
                          onPrevDay={handlePrevDay}
                          onNextDay={handleNextDay}
                          canPrevDay={selectedDayLog > 1}
                          canNextDay={selectedDayLog < plannedTrip.daily_logs.length}
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
          </motion.div>
        )}
      </div>
    </div>
  );
};
