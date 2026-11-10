import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Clock,
  Gauge,
  ShieldCheck,
  ChevronRight,
  Package,
  Truck
} from 'lucide-react';

interface Stage {
  id: number;
  title: string;
  subtitle: string;
  actionText: string;
  speedMph: number;
  dutyStatus: string;
  details: {
    label: string;
    value: string;
  }[];
}

const STAGES: Stage[] = [
  {
    id: 1,
    title: 'Container Yard Staging',
    subtitle: 'Reach stacker prepares commercial freight container in terminal yard.',
    actionText: 'Container Inspected & Staged',
    speedMph: 0,
    dutyStatus: 'ON-DUTY (Pre-Trip Inspection)',
    details: [
      { label: 'Container ID', value: 'UC-TX-948120' },
      { label: 'Gross Weight', value: '44,800 lbs' },
      { label: 'Freight Type', value: 'Dry Van Intermodal' },
      { label: 'Inspection Clock', value: '0.5h Logged' }
    ]
  },
  {
    id: 2,
    title: 'Telescopic Crane Lift',
    subtitle: 'Hydraulic boom locks twistlocks and hovers container above stack.',
    actionText: 'Hydraulic Twistlocks Engaged',
    speedMph: 0,
    dutyStatus: 'ON-DUTY (Terminal Loading)',
    details: [
      { label: 'Lift Altitude', value: '28.5 ft' },
      { label: 'Boom Extension', value: '14.2 m' },
      { label: 'Balance Sensor', value: '100% Centered' },
      { label: 'Terminal State', value: 'Clearance Granted' }
    ]
  },
  {
    id: 3,
    title: 'Chassis Docking & Lowering',
    subtitle: 'Flatbed trailer backs underneath; container lowers onto chassis bed.',
    actionText: 'Chassis Clamped & Verified',
    speedMph: 5,
    dutyStatus: 'ON-DUTY (Chassis Attachment)',
    details: [
      { label: 'Trailer Unit', value: '#TL-4410' },
      { label: 'Kingpin Lock', value: 'Secured' },
      { label: 'Tandem Position', value: 'Hole #5 (40ft Bridge)' },
      { label: 'Axle Weight', value: '33,900 lbs (Compliant)' }
    ]
  },
  {
    id: 4,
    title: 'Tractor Cab Coupling',
    subtitle: 'Class 8 semi-truck cab couples to trailer; air brake lines pressurized.',
    actionText: 'Tractor & Trailer Coupled',
    speedMph: 15,
    dutyStatus: 'ON-DUTY (Brake Air Check)',
    details: [
      { label: 'Tractor Unit', value: '#TR-510' },
      { label: 'Air Pressure', value: '120 PSI (Green)' },
      { label: 'Pre-Trip Complete', value: '1.0h Total On-Duty' },
      { label: 'Driver Cycle', value: '32.5h / 70.0h Used' }
    ]
  },
  {
    id: 5,
    title: 'Interstate Highway Dispatch',
    subtitle: 'Semi-truck accelerates onto open highway; 11h driving clock active.',
    actionText: 'Highway Cruise En Route',
    speedMph: 60,
    dutyStatus: 'DRIVING (Line-Haul Leg)',
    details: [
      { label: 'Road Speed', value: '60 MPH' },
      { label: 'Drive Clock', value: '10.8h Remaining' },
      { label: 'Duty Window', value: '13.0h Remaining' },
      { label: 'Fuel Range', value: '950 mi to Fuel Stop' }
    ]
  }
];

interface CraneTruckInteractiveShowcaseProps {
  onLaunchPlanner?: () => void;
}

export const CraneTruckInteractiveShowcase: React.FC<CraneTruckInteractiveShowcaseProps> = ({ onLaunchPlanner }) => {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const currentStage = STAGES[currentStageIdx];

  // Auto-play timer loop
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentStageIdx(prev => (prev + 1) % STAGES.length);
    }, 4200);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <section className="relative py-24 bg-[#000000] border-t border-[#242424] overflow-hidden text-white">
      {/* Background Subtle Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none opacity-[0.03] text-[18vw] font-black uppercase tracking-tighter whitespace-nowrap font-display text-white">
        HOS DISPATCH
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Top Header with Speed HUD */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#242424] mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#161616] border border-[#242424] text-xs font-mono font-bold tracking-wider text-[#99A9EE] mb-3">
              <span className="w-2 h-2 rounded-full bg-[#0016CB] animate-ping" />
              <span>INTERACTIVE LOGISTICS KINEMATICS</span>
              <span className="text-slate-600">|</span>
              <span className="text-emerald-400">FMCSA Part 395 Staging</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white font-display">
              From terminal lift <br className="hidden sm:inline" />
              to interstate highway cruise.
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl mt-2 font-sans">
              Watch the reach stacker crane stage cargo, load the semi-truck chassis, lock commercial freight, and launch onto the open highway with continuous HOS clock monitoring.
            </p>
          </div>

          {/* Speed & Duty HUD Pill */}
          <div className="flex items-center gap-3">
            <div className="bg-[#161616] border border-[#242424] p-3 sm:p-4 rounded-sm flex items-center gap-4 font-mono">
              <div className="flex items-center gap-2">
                <Gauge className="w-5 h-5 text-[#6677E3]" />
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Speedometer</span>
                  <div className="text-2xl font-black text-white leading-none">
                    <span className="tabular-nums">{currentStage.speedMph.toString().padStart(2, '0')}</span>
                    <span className="text-xs text-slate-400 ml-1 font-normal">MPH</span>
                  </div>
                </div>
              </div>

              <div className="w-[1px] h-8 bg-[#242424]" />

              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-bold">FMCSA Duty Status</span>
                <span className="text-xs font-bold text-emerald-400 truncate block max-w-44">
                  {currentStage.dutyStatus}
                </span>
              </div>
            </div>

            {/* Play / Pause Toggle */}
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-3.5 rounded-sm bg-[#161616] hover:bg-[#242424] border border-[#242424] text-white cursor-pointer transition-colors"
              title={isPlaying ? 'Pause sequence' : 'Play sequence'}
            >
              {isPlaying ? <Pause className="w-4 h-4 text-[#99A9EE]" /> : <Play className="w-4 h-4 text-emerald-400" />}
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* THE MAIN CINEMATIC ANIMATION STAGE (The Crane & Truck Yard) */}
        {/* ============================================================ */}
        <div className="relative w-full h-[360px] sm:h-[460px] md:h-[520px] bg-gradient-to-b from-[#0A0A0A] via-[#050505] to-[#000000] border border-[#242424] rounded-sm overflow-hidden mb-8 shadow-2xl">
          
          {/* Subtle Grid Ceiling & Yard Lights */}
          <div className="absolute inset-0 bg-grid-mesh opacity-15 pointer-events-none" />
          <div className="absolute top-4 left-6 flex items-center gap-2 text-[11px] font-mono text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
            <span>INTERMODAL TERMINAL CRANE YARD — BAY 04</span>
          </div>

          {/* Top Stage Indicator Tag */}
          <div className="absolute top-4 right-6 text-right font-mono">
            <span className="text-[10px] text-slate-500 uppercase">Current Stage</span>
            <div className="text-sm font-bold text-white uppercase">
              {currentStageIdx + 1} / {STAGES.length} : {currentStage.title}
            </div>
          </div>

          {/* ========================================================== */}
          {/* THE CRANE / REACH STACKER & TRUCK SCENE */}
          {/* ========================================================== */}
          <div className="absolute inset-0 flex items-end justify-center pb-12 sm:pb-16 px-4">
            
            {/* STAGES 1 & 2: REACH STACKER CRANE & CONTAINER STACK */}
            {(currentStageIdx === 0 || currentStageIdx === 1) && (
              <motion.div
                key="crane-scene"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-full max-w-4xl h-[280px] sm:h-[360px] flex items-end justify-between"
              >
                {/* Left: The Reach Stacker Crane Vehicle */}
                <motion.div
                  initial={{ x: -120, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                  className="relative w-1/2 sm:w-5/12 flex items-end"
                >
                  {/* Crane Vehicle Body */}
                  <img
                    src="/assets/uc/crane_reach_stacker.avif"
                    alt="Blue reach stacker crane vehicle"
                    className="w-full h-auto object-contain select-none filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.9)]"
                  />

                  {/* Telescopic Lifting Boom in Stage 2 */}
                  {currentStageIdx === 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 30, scale: 0.95 }}
                      animate={{ opacity: 1, y: -20, scale: 1 }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="absolute -top-16 right-0 w-3/4"
                    >
                      <img
                        src="/assets/uc/crane_lift_container.avif"
                        alt="Crane lifting container with extended hydraulic boom"
                        className="w-full h-auto object-contain filter drop-shadow-[0_10px_20px_rgba(0,22,203,0.3)]"
                      />
                    </motion.div>
                  )}
                </motion.div>

                {/* Right: The 3 Stacked Shipping Containers (White, Blue, Orange) */}
                <div className="relative w-1/3 sm:w-1/4 flex flex-col items-center space-y-1">
                  {/* Hovering lifted container in Stage 2 */}
                  {currentStageIdx === 1 && (
                    <motion.div
                      initial={{ y: 0, opacity: 1 }}
                      animate={{ y: -65, scale: 1.05 }}
                      transition={{ duration: 1.2, ease: 'easeInOut' }}
                      className="relative z-20"
                    >
                      <img
                        src="/assets/uc/container_white.avif"
                        alt="White cargo container being lifted"
                        className="w-24 sm:w-32 h-auto object-contain ring-2 ring-[#0016CB] shadow-[0_0_25px_rgba(0,22,203,0.5)]"
                      />
                      <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-mono font-bold uppercase bg-[#0016CB] text-white px-1.5 py-0.5 rounded-full whitespace-nowrap">
                        LIFT ACTIVE
                      </span>
                    </motion.div>
                  )}

                  {/* Top White Container (Stage 1 only) */}
                  {currentStageIdx === 0 && (
                    <motion.div
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="relative"
                    >
                      <img
                        src="/assets/uc/container_white.avif"
                        alt="White cargo container"
                        className="w-24 sm:w-32 h-auto object-contain"
                      />
                    </motion.div>
                  )}

                  {/* Middle Blue Container */}
                  <img
                    src="/assets/uc/container_blue.avif"
                    alt="Blue cargo container"
                    className="w-24 sm:w-32 h-auto object-contain"
                  />

                  {/* Bottom Orange Container */}
                  <img
                    src="/assets/uc/container_orange.avif"
                    alt="Orange cargo container"
                    className="w-24 sm:w-32 h-auto object-contain"
                  />
                </div>
              </motion.div>
            )}

            {/* STAGE 3: CHASSIS DOCKING & LOWERING CONTAINER */}
            {currentStageIdx === 2 && (
              <motion.div
                key="loading-scene"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-full max-w-4xl h-[260px] sm:h-[320px] flex items-end justify-center"
              >
                {/* Crane Lowering Arm Above Trailer */}
                <motion.div
                  initial={{ y: -40, opacity: 0 }}
                  animate={{ y: -10, opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="absolute top-2 left-1/4 w-72 sm:w-96 z-20"
                >
                  <img
                    src="/assets/uc/crane_gantry_top.avif"
                    alt="Crane overhead gantry mechanism"
                    className="w-full h-auto object-contain"
                  />
                </motion.div>

                {/* Container Lowering onto Trailer Bed */}
                <div className="relative w-full max-w-2xl flex flex-col items-center">
                  <motion.div
                    initial={{ y: -70, opacity: 0.8 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
                    className="relative z-10 -mb-3"
                  >
                    <img
                      src="/assets/uc/truck_container_only.avif"
                      alt="Long white shipping container lowering"
                      className="w-[320px] sm:w-[480px] h-auto object-contain"
                    />
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: [1, 1.4, 1] }}
                      transition={{ delay: 1.1, duration: 0.4 }}
                      className="absolute inset-0 border-2 border-[#0016CB] rounded-sm pointer-events-none shadow-[0_0_30px_rgba(0,22,203,0.8)]"
                    />
                  </motion.div>

                  {/* Empty Trailer Chassis Waiting */}
                  <motion.div
                    initial={{ x: 60, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="w-[340px] sm:w-[500px]"
                  >
                    <img
                      src="/assets/uc/truck_cab_only.avif"
                      alt="Semi-truck chassis backing into position"
                      className="w-full h-auto object-contain"
                    />
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* STAGE 4: TRACTOR CAB COUPLING */}
            {currentStageIdx === 3 && (
              <motion.div
                key="coupling-scene"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-full max-w-3xl h-[240px] sm:h-[300px] flex items-end justify-center"
              >
                <div className="relative flex items-end">
                  {/* Coupled Full Semi-Truck */}
                  <motion.div
                    initial={{ scale: 0.96, x: 20 }}
                    animate={{ scale: 1, x: 0 }}
                    transition={{ duration: 0.7 }}
                    className="relative"
                  >
                    <img
                      src="/assets/uc/truck_static.avif"
                      alt="Coupled commercial semi-truck and trailer"
                      className="w-[420px] sm:w-[620px] md:w-[720px] h-auto object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.9)]"
                    />

                    {/* Pre-Trip Inspection Badge */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="absolute -top-8 right-24 bg-[#161616] border border-[#242424] px-3 py-1 rounded-full text-[10px] font-mono font-bold text-emerald-400 flex items-center gap-1.5 shadow-lg"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>KINGPIN LOCKED &amp; 1H PRE-TRIP LOGGED</span>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* STAGE 5: HIGHWAY ACCELERATION & CRUISE */}
            {currentStageIdx === 4 && (
              <motion.div
                key="highway-scene"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-full h-[240px] sm:h-[300px] flex items-end overflow-hidden"
              >
                {/* Truck moving smoothly across the screen */}
                <motion.div
                  initial={{ x: '-40%' }}
                  animate={{ x: ['-20%', '15%'] }}
                  transition={{ duration: 4.2, ease: 'linear', repeat: Infinity }}
                  className="relative flex items-end"
                >
                  <img
                    src="/assets/uc/truck_static.avif"
                    alt="Semi-truck cruising on interstate highway"
                    className="w-[420px] sm:w-[620px] md:w-[720px] h-auto object-contain filter drop-shadow-[0_25px_40px_rgba(0,22,203,0.35)]"
                  />

                  {/* Rotating Wheels */}
                  <div className="absolute bottom-[6px] left-[78px] sm:left-[116px] md:left-[136px] w-8 h-8 sm:w-11 sm:h-11">
                    <img
                      src="/assets/uc/wheel_front.avif"
                      alt="Front steer tire"
                      className="w-full h-full object-contain animate-spin-wheel"
                    />
                  </div>
                  <div className="absolute bottom-[6px] left-[200px] sm:left-[296px] md:left-[346px] w-8 h-8 sm:w-11 sm:h-11 flex gap-1">
                    <img
                      src="/assets/uc/wheel_rear.avif"
                      alt="Drive axle tire"
                      className="w-full h-full object-contain animate-spin-wheel"
                    />
                    <img
                      src="/assets/uc/wheel_rear.avif"
                      alt="Drive axle tire"
                      className="w-full h-full object-contain animate-spin-wheel"
                    />
                  </div>
                  <div className="absolute bottom-[6px] right-[40px] sm:right-[60px] md:right-[70px] w-8 h-8 sm:w-11 sm:h-11 flex gap-1">
                    <img
                      src="/assets/uc/wheel_rear.avif"
                      alt="Trailer tandem tire"
                      className="w-full h-full object-contain animate-spin-wheel"
                    />
                    <img
                      src="/assets/uc/wheel_rear.avif"
                      alt="Trailer tandem tire"
                      className="w-full h-full object-contain animate-spin-wheel"
                    />
                  </div>

                  {/* Cruise Glow Beacon */}
                  <div className="absolute -top-6 left-1/3 px-3 py-1 rounded-full bg-[#0016CB]/80 text-white text-[10px] font-mono font-bold tracking-wider shadow-[0_0_20px_rgba(0,22,203,0.8)]">
                    CRUISE: 60 MPH ACTIVE
                  </div>
                </motion.div>
              </motion.div>
            )}
          </div>

          {/* ========================================================== */}
          {/* THE GROUND HIGHWAY ASPHALT & ROAD MARKINGS */}
          {/* ========================================================== */}
          <div className="absolute bottom-0 left-0 right-0 h-10 sm:h-12 bg-[#0C0C0C] border-t border-[#242424] flex items-center overflow-hidden">
            {/* Dashed Road Line */}
            <div className="w-full h-1 relative">
              <div
                className={`w-[200%] h-full flex items-center gap-6 ${
                  currentStageIdx === 4 ? 'animate-marquee' : ''
                }`}
              >
                {Array.from({ length: 40 }).map((_, i) => (
                  <div key={i} className="w-12 h-1 bg-white/40 shrink-0 rounded-full" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* INTERACTIVE STAGE SCRUBBER & TELEMETRY CARDS */}
        {/* ============================================================ */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3 mb-8">
          {STAGES.map((s, idx) => {
            const isActive = currentStageIdx === idx;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setCurrentStageIdx(idx);
                  setIsPlaying(false);
                }}
                className={`p-3 sm:p-4 rounded-sm border text-left cursor-pointer transition-all ${
                  isActive
                    ? 'bg-[#161616] border-[#0016CB] shadow-[0_0_20px_rgba(0,22,203,0.3)]'
                    : 'bg-[#0A0A0A] border-[#242424] hover:border-[#374151]'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                  <span className={isActive ? 'text-[#99A9EE] font-bold' : 'text-slate-500'}>
                    0{s.id}
                  </span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#0016CB] animate-pulse" />}
                </div>
                <div className="text-xs font-bold text-white uppercase font-display truncate">
                  {s.title}
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
                  {s.speedMph} MPH &bull; {s.dutyStatus.split(' ')[0]}
                </div>
              </button>
            );
          })}
        </div>

        {/* Stage Specification Telemetry Grid */}
        <div className="p-5 sm:p-6 bg-[#0A0A0A] border border-[#242424] rounded-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#242424] mb-4">
            <div>
              <span className="text-[10px] font-mono text-[#99A9EE] uppercase tracking-wider font-bold">
                STAGE 0{currentStage.id} TELEMETRY VERIFICATION
              </span>
              <h3 className="text-lg font-bold text-white font-display uppercase mt-0.5">
                {currentStage.title} — {currentStage.actionText}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#161616] text-emerald-400 border border-[#242424]">
                FMCSA Compliant
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
            {currentStage.details.map((d, i) => (
              <div key={i} className="p-3 bg-[#161616] border border-[#242424] rounded-sm">
                <span className="text-[10px] text-slate-500 uppercase block font-bold">
                  {d.label}
                </span>
                <span className="text-sm font-bold text-white mt-0.5 block truncate">
                  {d.value}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

