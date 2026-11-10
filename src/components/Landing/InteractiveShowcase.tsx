import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Moon,
  Coffee,
  ArrowRight,
  Layers
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface InteractiveShowcaseProps {
  onLaunchPlanner?: () => void;
}

export const InteractiveShowcase: React.FC<InteractiveShowcaseProps> = ({ onLaunchPlanner }) => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState<number>(0);

  const handleLaunch = () => {
    if (onLaunchPlanner) {
      onLaunchPlanner();
    } else {
      navigate('/planner');
    }
  };

  const steps = [
    {
      id: 'telemetry',
      title: 'Live Route & Stop Telemetry',
      subtitle: 'Corridor Routing with Dynamic Fuel & Rest Injection',
      badge: 'MILESTONE 01',
      description:
        'From Chicago to Dallas via Indianapolis, every stop is automatically sequenced. Rather than estimating fuel points, the system calculates exact cumulative driving distance and injects commercial diesel stops before the 1,000-mile mark, along with 30-minute rest intervals when continuous driving hits 8.0 hours.',
      points: [
        'Precise geocoded coordinates for Origin, Pickup, and Dropoff',
        'Automatic injection of diesel stops every < 1,000 miles',
        '30-minute break enforcement triggered at 8 cumulative drive hours',
        'Exact highway distance calculation powered by OSRM'
      ],
      previewContent: (
        <div className="space-y-3 font-mono text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-700/80">
            <div className="flex items-center justify-between text-slate-400 mb-2 pb-1.5 border-b border-slate-800">
              <span className="font-bold text-white flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>Leg 1: Chicago, IL → Indianapolis, IN</span>
              </span>
              <span className="text-blue-400 font-bold">184 mi • 3.1h</span>
            </div>
            <div className="text-[11px] text-slate-300 flex items-center justify-between">
              <span>Pickup Loading: 1.0h On-Duty scheduled</span>
              <span className="text-emerald-400 font-bold">0 Violations</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-amber-500/40">
            <div className="flex items-center justify-between text-slate-400 mb-2 pb-1.5 border-b border-slate-800">
              <span className="font-bold text-amber-300 flex items-center gap-1.5">
                <Coffee className="w-3.5 h-3.5 text-amber-400" />
                <span>Mandatory Break: Effingham, IL</span>
              </span>
              <span className="text-amber-400 font-bold">0.5h Rest</span>
            </div>
            <div className="text-[11px] text-slate-300 flex items-center justify-between">
              <span>Triggered before 8h continuous driving limit</span>
              <span className="text-emerald-400 font-bold">Clock Reset</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-purple-500/40">
            <div className="flex items-center justify-between text-slate-400 mb-2 pb-1.5 border-b border-slate-800">
              <span className="font-bold text-purple-300 flex items-center gap-1.5">
                <Moon className="w-3.5 h-3.5 text-purple-400" />
                <span>10-Hour Sleeper Berth: Texarkana, AR</span>
              </span>
              <span className="text-purple-400 font-bold">10.0h Rest</span>
            </div>
            <div className="text-[11px] text-slate-300 flex items-center justify-between">
              <span>Full 11h driving &amp; 14h duty window reset</span>
              <span className="text-emerald-400 font-bold">Day 1 → Day 2</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-emerald-500/40">
            <div className="flex items-center justify-between text-slate-400 mb-2 pb-1.5 border-b border-slate-800">
              <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Final Leg: Dallas, TX Facility</span>
              </span>
              <span className="text-emerald-400 font-bold">1,080 mi Total</span>
            </div>
            <div className="text-[11px] text-slate-300 flex items-center justify-between">
              <span>Receiver Delivery: 1.0h On-Duty scheduled</span>
              <span className="text-blue-400 font-bold">Trip Complete</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'duty-status',
      title: 'Duty Status Breakdown & Clocks',
      subtitle: 'Real-Time 4-State FMCSA Duty Partitioning',
      badge: 'MILESTONE 02',
      description:
        'Every second of the planned haul is categorized across the four statutory lines: Line 1 (Off-Duty), Line 2 (Sleeper Berth), Line 3 (Driving), and Line 4 (On-Duty Not Driving). Dwell times, pre-trip inspections, and unloading intervals are cleanly booked to Line 4, preventing drive time underreporting.',
      points: [
        'Line 1 (Off-Duty): Fueling & mandatory 30-minute breaks',
        'Line 2 (Sleeper Berth): 10-hour consecutive overnight rests',
        'Line 3 (Driving): Highway travel at ~60 mph speed model',
        'Line 4 (On-Duty): 1.0h pickup loading & 1.0h dropoff unloading'
      ],
      previewContent: (
        <div className="space-y-4 font-mono text-xs">
          <div className="p-4 rounded-xl bg-[#080D1A] border border-slate-800 space-y-3">
            <div className="flex justify-between items-center text-slate-300">
              <span className="font-bold text-sm text-white">4-Line Duty Allocation</span>
              <span className="text-emerald-400 font-bold text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                100% BALANCED
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                  <span className="text-slate-200">Line 1: Off-Duty</span>
                </div>
                <span className="font-bold text-slate-300">0.50 hrs</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  <span className="text-purple-300">Line 2: Sleeper Berth</span>
                </div>
                <span className="font-bold text-purple-300">10.00 hrs</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span className="text-blue-300">Line 3: Driving</span>
                </div>
                <span className="font-bold text-blue-300">18.00 hrs</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-amber-300">Line 4: On-Duty Not Driving</span>
                </div>
                <span className="font-bold text-amber-300">2.50 hrs</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-between text-slate-400 text-[11px]">
              <span>Trip Duration: 31.00 hrs</span>
              <span className="text-cyan-400 font-bold">2-Day Calendar Haul</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'verification',
      title: 'Instant Daily Log Verification',
      subtitle: 'Zero Guesswork Across Multi-Day Hauls',
      badge: 'MILESTONE 03',
      description:
        'When a haul spans multiple calendar days, events crossing midnight (00:00:00 UTC) are cleanly split into two distinct entries. Each daily log sheet sums to exactly 24.00 hours, complete with driver remarks, carrier metadata, and instant PDF compilation for safety audits.',
      points: [
        'Automated midnight event splitting without overlapping minutes',
        'Daily log line sums mathematically equal 24.00 hours',
        'Compliant remark logging with time, location, and duty change',
        'Single-click multi-page PDF compilation ready for DOT inspection'
      ],
      previewContent: (
        <div className="space-y-4 font-mono text-xs">
          <div className="p-4 rounded-xl bg-[#080D1A] border border-emerald-500/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-sm">Automated DOT Audit Pass</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px] border border-emerald-500/40">
                FMCSA § 395.8 PASS
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5 text-[11px]">
              <div className="flex justify-between text-slate-400">
                <span>Day 1 (24 Hours):</span>
                <span className="text-emerald-400 font-bold">24.00 hrs (BALANCED)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Day 2 (24 Hours):</span>
                <span className="text-emerald-400 font-bold">24.00 hrs (BALANCED)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Midnight Split Integrity:</span>
                <span className="text-blue-400 font-bold">0.00 min Drift</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Driver Signature &amp; Cert:</span>
                <span className="text-cyan-400 font-bold">Attached</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-[11px] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Certified audit-proof against 49 CFR § 395 standards</span>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <section id="eld-showcase" className="relative py-24 bg-[#0A0A0A] border-t border-[#242424]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-semibold uppercase tracking-widest font-mono">
            <Layers className="w-3.5 h-3.5" />
            <span>Choreographed Compliance Architecture</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-white tracking-tight font-display">
            Compliance at{' '}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-white bg-clip-text text-transparent">
              Every Milestone.
            </span>
          </h2>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            From initial dispatch to multi-day receiver delivery, see how our algorithm eliminates manual math and guarantees FMCSA compliance step by step.
          </p>
        </div>

        {/* Split-Screen Interactive Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Milestone Tabs */}
          <div className="lg:col-span-5 space-y-3">
            {steps.map((step, idx) => {
              const isActive = activeStep === idx;
              return (
                <motion.div
                  key={step.id}
                  onClick={() => setActiveStep(idx)}
                  whileHover={{ x: 3 }}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    isActive
                      ? 'bg-slate-900/90 border-blue-500/80 shadow-lg shadow-blue-500/15'
                      : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700/80 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 border border-blue-500/30">
                      {step.badge}
                    </span>
                    <span className="text-xs font-mono text-slate-500">Step 0{idx + 1} / 03</span>
                  </div>

                  <h3 className={`text-base font-bold font-display ${isActive ? 'text-white' : 'text-slate-300'}`}>
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {step.subtitle}
                  </p>
                </motion.div>
              );
            })}

            <div className="pt-4">
              <button
                type="button"
                onClick={handleLaunch}
                className="w-full btn-uc-solid py-3.5 text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(0,22,203,0.4)] font-mono"
              >
                <span>Launch Interactive Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Detailed Animated Preview Card */}
          <div className="lg:col-span-7">
            <div className="uc-glass-card rounded-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-mono text-blue-400 font-bold uppercase tracking-wider block">
                    {steps[activeStep].badge}
                  </span>
                  <h3 className="text-xl font-bold text-white font-display mt-0.5">
                    {steps[activeStep].title}
                  </h3>
                </div>
                <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>

              {/* Narrative Text */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {steps[activeStep].description}
              </p>

              {/* Bullet Points */}
              <div className="space-y-2 pt-1">
                {steps[activeStep].points.map((pt, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>

              {/* Interactive Telemetry Box with AnimatePresence */}
              <div className="pt-2">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={steps[activeStep].id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                  >
                    {steps[activeStep].previewContent}
                  </motion.div>
                </AnimatePresence>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
