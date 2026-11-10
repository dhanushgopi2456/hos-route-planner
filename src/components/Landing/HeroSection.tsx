import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Truck,
  ArrowRight,
  Fuel,
  Moon,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface HeroSectionProps {
  onLaunchPlanner?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onLaunchPlanner }) => {
  const navigate = useNavigate();
  const [activeTelemetryTab, setActiveTelemetryTab] = useState<'corridor' | 'telemetry'>('corridor');

  const handleLaunch = () => {
    if (onLaunchPlanner) {
      onLaunchPlanner();
    } else {
      navigate('/planner');
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden bg-[#06080E]">
      {/* Background Mesh Gradients & Atmospheric Glows */}
      <div className="absolute inset-0 bg-grid-mesh opacity-30 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-radial-blue pointer-events-none opacity-80" />
      <div className="absolute top-1/4 -left-48 w-96 h-96 rounded-full bg-blue-600/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 -right-48 w-96 h-96 rounded-full bg-cyan-500/10 blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline, Copy & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Eyebrow Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/25 text-blue-400 text-xs font-semibold tracking-wide backdrop-blur-md"
            >
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="uppercase tracking-widest text-[11px] font-bold">FMCSA HOS COMPLIANCE &amp; AUTOMATED ELD LOGGING</span>
              <span className="text-slate-500">|</span>
              <span className="text-emerald-400 text-[11px]">49 CFR § 395</span>
            </motion.div>

            {/* Main Headline (Staggered Text Reveal) */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1, ease: [0.445, 0.05, 0.55, 0.95] }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[1.02] text-white font-display"
            >
              Every mile of the haul.{' '}
              <span className="block mt-1 bg-gradient-to-r from-blue-400 via-cyan-300 to-white bg-clip-text text-transparent">
                Planned, compliant, and logged automatically.
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed mx-auto lg:mx-0 font-normal"
            >
              Commercial HOS route planning, 11/14/30/70-hour duty scheduling, automated fuel stops, and daily ELD log sheets—unified in one intelligent dispatch workspace.
            </motion.p>

            {/* Dual CTAs & Micro-Proof */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <button
                type="button"
                onClick={handleLaunch}
                className="btn-electric-primary w-full sm:w-auto px-7 py-3.5 text-sm sm:text-base flex items-center justify-center gap-2.5 cursor-pointer group shadow-lg shadow-blue-600/30"
              >
                <Truck className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
                <span>Plan a Route Now</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('eld-showcase')}
                className="btn-electric-secondary w-full sm:w-auto px-6 py-3.5 text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Explore ELD Engine</span>
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </button>
            </motion.div>

            {/* Fast Features Pill Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs text-slate-400 font-mono"
            >
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                <span>OSRM Highway Geometry</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>1,000-Mi Fuel Routing</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>PDF Driver Logs</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: United Carriers Style Interactive Corridor Simulation Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 relative"
          >
            {/* Ambient Radial Spotlight behind card */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/30 to-cyan-500/20 rounded-3xl blur-2xl opacity-75" />

            <div className="relative rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-xl shadow-2xl overflow-hidden p-5 space-y-4">
              {/* Card Header Bar */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-[11px] font-mono text-slate-400 ml-2">corridor_live_telemetry.fmcsa</span>
                </div>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>DISPATCH ACTIVE</span>
                </div>
              </div>

              {/* Highway Corridor Animated Route Graphic */}
              <div className="relative h-44 rounded-xl bg-[#080C16] border border-slate-800/80 p-3 overflow-hidden flex flex-col justify-between">
                {/* Background highway grid */}
                <div className="absolute inset-0 bg-grid-mesh opacity-20 pointer-events-none" />

                {/* Animated Highway Corridor SVG Line */}
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 160">
                  <defs>
                    <linearGradient id="routeGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#0016cb" stopOpacity="0.95" />
                      <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0.95" />
                    </linearGradient>
                    <filter id="neonBlur" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3.5" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Route corridor glow path */}
                  <path
                    d="M 30,120 Q 120,40 200,90 T 370,50"
                    fill="none"
                    stroke="url(#routeGlow)"
                    strokeWidth="5"
                    filter="url(#neonBlur)"
                  />
                  {/* Dashed animated pulse path */}
                  <path
                    d="M 30,120 Q 120,40 200,90 T 370,50"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                    strokeDasharray="6 6"
                    className="animate-road-dash"
                  />

                  {/* Radar Wave Rings */}
                  <circle cx="30" cy="120" r="10" fill="none" stroke="#0016cb" strokeWidth="1" opacity="0.6" />
                  <circle cx="120" cy="65" r="9" fill="none" stroke="#ff5500" strokeWidth="1" opacity="0.6" />

                  {/* Waypoint Nodes */}
                  <circle cx="30" cy="120" r="5.5" fill="#0016cb" stroke="#FFFFFF" strokeWidth="2" />
                  <circle cx="120" cy="65" r="5" fill="#ff5500" stroke="#FFFFFF" strokeWidth="2" />
                  <circle cx="200" cy="90" r="5" fill="#8B5CF6" stroke="#FFFFFF" strokeWidth="2" />
                  <circle cx="370" cy="50" r="5.5" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
                </svg>

                {/* Stop Labels overlay */}
                <div className="relative z-10 flex justify-between text-[10px] font-mono font-bold">
                  <div className="bg-slate-900/90 border border-blue-500/40 px-2 py-0.5 rounded text-blue-300">
                    ORIGIN: Chicago, IL
                  </div>
                  <div className="bg-slate-900/90 border border-emerald-500/40 px-2 py-0.5 rounded text-emerald-300">
                    DROPOFF: Dallas, TX
                  </div>
                </div>

                <div className="relative z-10 flex justify-around text-[9px] font-mono text-slate-400">
                  <span className="flex items-center gap-1 bg-slate-900/80 px-1.5 py-0.5 rounded border border-amber-500/30 text-amber-300">
                    <Fuel className="w-2.5 h-2.5" /> Stop: 1,000mi Fuel
                  </span>
                  <span className="flex items-center gap-1 bg-slate-900/80 px-1.5 py-0.5 rounded border border-purple-500/30 text-purple-300">
                    <Moon className="w-2.5 h-2.5" /> 10h Sleeper Reset
                  </span>
                </div>
              </div>

              {/* Live Telemetry Grid */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider font-mono">
                    Total Haul Distance
                  </span>
                  <div className="text-xl font-bold font-mono text-white mt-0.5">
                    1,080 <span className="text-xs font-normal text-slate-400">mi</span>
                  </div>
                  <span className="text-[10px] text-blue-400 font-mono">OSRM Road Network</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider font-mono">
                    11h Driving Window
                  </span>
                  <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">
                    COMPLIANT
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">30-min break injected</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider font-mono">
                    70h / 8-Day Cycle
                  </span>
                  <div className="text-xl font-bold font-mono text-cyan-300 mt-0.5">
                    42.5h <span className="text-xs font-normal text-slate-400">/ 70h</span>
                  </div>
                  <div className="w-full h-1 bg-slate-700 rounded-full mt-1.5 overflow-hidden">
                    <div className="h-full bg-cyan-400 rounded-full" style={{ width: '61%' }} />
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider font-mono">
                    Daily ELD Sheets
                  </span>
                  <div className="text-xl font-bold font-mono text-white mt-0.5">
                    2 <span className="text-xs font-normal text-slate-400">Days</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono">24.00h balanced</span>
                </div>
              </div>

              {/* Bottom Quick Action Strip */}
              <div className="pt-1 flex items-center justify-between border-t border-slate-800">
                <span className="text-[11px] text-slate-400 font-sans">
                  Simulating Interstate Freight Corridor
                </span>
                <button
                  type="button"
                  onClick={handleLaunch}
                  className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Open in Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
