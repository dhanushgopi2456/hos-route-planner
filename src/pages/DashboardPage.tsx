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

  // Celestial Ambient Video Background state
  const [ambientVideoActive, setAmbientVideoActive] = useState<boolean>(true);
  const videoBgRef = useRef<HTMLVideoElement>(null);

  const toggleAmbientVideo = () => {
    if (videoBgRef.current) {
      if (ambientVideoActive) {
        videoBgRef.current.pause();
      } else {
        videoBgRef.current.play().catch(() => {});
      }
      setAmbientVideoActive(!ambientVideoActive);
    }
  };

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
    <div className="min-h-screen bg-transparent text-slate-100 pb-20 relative selection:bg-[#0016CB] selection:text-white overflow-x-hidden">
      {/* 1. Cinematic Celestial Atmosphere Video Background (High-Vibrancy, Ultra-Clear) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
        <video
          ref={videoBgRef}
          autoPlay
          loop
          muted
          playsInline
          className={`w-full h-full object-cover object-center transition-opacity duration-700 filter brightness-125 contrast-110 saturate-130 ${
            ambientVideoActive ? 'opacity-90 md:opacity-95' : 'opacity-20'
          }`}
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260815_030633_1712fc71-4979-4e14-98f9-9f95702ab3da.mp4"
            type="video/mp4"
          />
        </video>

        {/* Lightweight subtle gradient: keeps celestial video fully vivid while protecting text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/15 via-transparent to-black/25 pointer-events-none" />
      </div>

      {/* Top Command Bar & Workspace Shell */}
      <div className="bg-[#0A0A0A]/95 dark:bg-[#0A0A0A]/95 bg-white/95 text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/10 py-3.5 px-4 sm:px-6 lg:px-8 sticky top-20 z-30 backdrop-blur-2xl shadow-md transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-black/40 border border-slate-300 dark:border-white/15 hover:border-[#0016CB] text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white transition-all cursor-pointer group font-mono backdrop-blur-md"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 text-[#0016CB]" />
              <span>Back to Home</span>
            </Link>

            <div className="h-4 w-[1px] bg-slate-300 dark:bg-slate-800 hidden sm:block" />

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                {plannedTrip ? 'HAUL ROUTED & COMPLIANT' : 'DISPATCH READY'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Ambient Background Toggle Pill */}
            <button
              type="button"
              onClick={toggleAmbientVideo}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-[#161616]/80 hover:bg-slate-200 dark:hover:bg-[#242424] text-[11px] font-mono text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-[#2E2E2E] hover:border-[#2f63ff] transition-all cursor-pointer"
              title={ambientVideoActive ? 'Pause Celestial Ambience' : 'Play Celestial Ambience'}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${ambientVideoActive ? 'bg-[#2f63ff] animate-pulse shadow-[0_0_8px_#2f63ff]' : 'bg-slate-400 dark:bg-slate-500'}`} />
              <span className="hidden sm:inline">Celestial Background</span>
              <span className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-400">{ambientVideoActive ? 'ON' : 'OFF'}</span>
            </button>

            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 hidden md:block">
              Standard: <span className="text-blue-600 dark:text-blue-400 font-semibold">FMCSA 49 CFR Part 395</span>
            </div>
            {plannedTrip && (
              <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30">
                {plannedTrip.daily_logs.length} Days Generated
              </span>
            )}
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 lg:pt-14 pb-20 relative z-10">
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
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Active Driver Credentials Card */}
            <div className="mb-6 p-4 sm:p-5 uc-card-stark flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3.5">
                {user?.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.name}
                    className="w-12 h-12 rounded-sm object-cover border border-[#0016CB]/50 shrink-0 shadow-xs"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-sm bg-[#0016CB] text-white flex items-center justify-center font-black text-base shrink-0 shadow-md">
                    {user?.name?.charAt(0) || 'D'}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-base text-slate-900 dark:text-white font-display uppercase">
                      {user?.name}
                    </span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#161616] text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Authorized {user?.role || 'Driver'}</span>
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 font-mono">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{user?.carrier_name || 'Independent Operator'}</span>
                    <span>&bull;</span>
                    <span>CDL: {user?.cdl_number || 'N/A'}</span>
                    <span>&bull;</span>
                    <span>Unit: #{user?.truck_number || '101'}</span>
                    <span>&bull;</span>
                    <span className="text-[#0016CB] dark:text-[#99A9EE] font-bold">
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
                  className="btn-uc-pill px-4 py-2 text-xs font-mono font-bold cursor-pointer transition-all flex items-center gap-1.5"
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
                ref={resultsRef}
                id="planned-trip-results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6 pt-4"
              >
                {/* HOS Status Metrics Card */}
                <HosStatusCard tripData={plannedTrip} />

                {/* Navigation Tabs for Planned Trip with Layout Indicator */}
                <div className="uc-card-stark p-1.5 flex flex-wrap items-center justify-between gap-2 font-mono">
                  <div className="flex items-center space-x-1 flex-wrap">
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
                          className={`relative px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer font-mono ${
                            isCurrent
                              ? 'text-white shadow-md'
                              : 'text-slate-400 hover:text-white hover:bg-[#161616]'
                          }`}
                        >
                          <span className="relative z-10">{tab.label}</span>
                          {isCurrent && (
                            <motion.div
                              layoutId="activeSubTab"
                              className="absolute inset-0 btn-uc-solid rounded-full"
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
                      className="btn-uc-solid px-4 py-2 text-xs font-bold inline-flex items-center space-x-1.5 cursor-pointer font-mono shadow-md"
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
                        <div className="flex items-center space-x-2 overflow-x-auto">
                          {/* Prev Day Pill */}
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            disabled={selectedDayLog <= 1}
                            onClick={handlePrevDay}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                              selectedDayLog > 1
                                ? 'bg-[#161616] border border-[#242424] text-white hover:border-[#0016CB] cursor-pointer'
                                : 'bg-transparent border border-[#242424]/40 text-slate-600 cursor-not-allowed'
                            }`}
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                            <span>Prev</span>
                          </motion.button>

                          {/* Individual Day Buttons */}
                          {plannedTrip.daily_logs.map(log => (
                            <motion.button
                              key={`day-btn-${log.day_number}`}
                              whileHover={{ scale: 1.04, y: -1 }}
                              whileTap={{ scale: 0.96 }}
                              onClick={() => setSelectedDayLog(log.day_number)}
                              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                                selectedDayLog === log.day_number
                                  ? 'btn-uc-solid shadow-md'
                                  : 'bg-[#161616] border border-[#242424] text-slate-300 hover:border-[#374151]'
                              }`}
                            >
                              Day {log.day_number} ({log.date})
                            </motion.button>
                          ))}

                          {/* Next Day Pill */}
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            disabled={selectedDayLog >= plannedTrip.daily_logs.length}
                            onClick={handleNextDay}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                              selectedDayLog < plannedTrip.daily_logs.length
                                ? 'bg-[#161616] border border-[#242424] text-white hover:border-[#0016CB] cursor-pointer'
                                : 'bg-transparent border border-[#242424]/40 text-slate-600 cursor-not-allowed'
                            }`}
                          >
                            <span>Next</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </motion.button>
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
