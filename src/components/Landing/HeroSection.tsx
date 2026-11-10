import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Truck,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Navigation,
  Clock,
  Fuel,
  FileCheck2,
  Play
} from 'lucide-react';

interface HeroSectionProps {
  onLaunchPlanner?: (demo?: boolean) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onLaunchPlanner }) => {
  const navigate = useNavigate();

  const handleLaunch = (demo = false) => {
    if (onLaunchPlanner) {
      onLaunchPlanner(demo);
    } else {
      navigate(demo ? '/planner?demo=1' : '/planner');
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Kinetic typography headline words
  const titleWords = ['EVERY', 'LEG', 'OF', 'THE', 'JOURNEY'];

  return (
    <section id="hero" className="relative min-h-[96vh] flex flex-col justify-between pt-24 pb-12 overflow-hidden bg-[#000000] text-white">
      {/* 1. Animated Highway Vector Grid & Living Telemetry Pulses */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <svg className="w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="highwayPulse" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0016CB" stopOpacity="0" />
              <stop offset="50%" stopColor="#3346D7" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
            </linearGradient>
            <pattern id="dotGrid" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#FFFFFF" fillOpacity="0.12" />
            </pattern>
          </defs>

          {/* Dot Grid */}
          <rect width="100%" height="100%" fill="url(#dotGrid)" />

          {/* Animated Highway Vector Paths */}
          <path
            d="M -100 200 C 300 250, 600 150, 1200 450 S 1800 300, 2200 600"
            fill="none"
            stroke="#242424"
            strokeWidth="2"
            strokeDasharray="6 6"
          />
          <path
            d="M -50 450 C 400 350, 800 650, 1400 350 S 1900 500, 2300 200"
            fill="none"
            stroke="#1E293B"
            strokeWidth="1.5"
          />

          {/* Glowing Animated Highway Data Pulses */}
          <motion.path
            d="M -100 200 C 300 250, 600 150, 1200 450 S 1800 300, 2200 600"
            fill="none"
            stroke="url(#highwayPulse)"
            strokeWidth="4"
            initial={{ pathLength: 0.15, pathOffset: 0 }}
            animate={{ pathOffset: [0, 1] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
          />
          <motion.path
            d="M -50 450 C 400 350, 800 650, 1400 350 S 1900 500, 2300 200"
            fill="none"
            stroke="url(#highwayPulse)"
            strokeWidth="3"
            initial={{ pathLength: 0.2, pathOffset: 0 }}
            animate={{ pathOffset: [1, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
          />
        </svg>

        {/* Slow Breathing Electric Blue Aurora */}
        <motion.div
          animate={{
            opacity: [0.15, 0.28, 0.15],
            scale: [1, 1.08, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-[#0016CB]/30 to-[#06B6D4]/20 rounded-full blur-[140px] pointer-events-none"
        />
      </div>

      {/* 2. Celestial Blue Horizon & Planet Sphere (from United Carriers Template) */}
      <div className="absolute top-0 right-0 w-[650px] sm:w-[850px] lg:w-[1050px] h-[650px] sm:h-[850px] lg:h-[1050px] pointer-events-none select-none z-0">
        <motion.img
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.85, scale: 1 }}
          transition={{ duration: 1.8, ease: 'easeOut' }}
          src="/assets/uc/hero_blur.png"
          alt="Atmospheric Blue Glow"
          className="absolute -top-24 -right-24 w-full h-full object-contain filter blur-[30px] mix-blend-screen pointer-events-none"
        />

        <motion.img
          initial={{ opacity: 0, scale: 0.9, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          src="/assets/uc/hero_sphere.png"
          alt="Celestial Blue Sphere"
          className="absolute top-4 right-4 sm:top-10 sm:right-10 w-[380px] sm:w-[540px] lg:w-[680px] object-contain drop-shadow-[0_0_80px_rgba(0,22,203,0.65)] pointer-events-none"
        />
      </div>

      {/* 3. Deep Blue Horizon Bloom Bleeding to Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[380px] bg-gradient-to-t from-[#0016CB]/40 via-[#0016CB]/15 to-transparent pointer-events-none mix-blend-screen" />
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[1400px] h-[300px] bg-[#0016CB]/35 filter blur-[100px] rounded-full pointer-events-none" />

      {/* 4. Main Hero Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full my-auto py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headline, Kinetic Typography, Subcopy & CTAs */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Template Category Index & Breadcrumb */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-4 text-xs font-mono tracking-widest text-slate-400"
            >
              <span className="text-[#0016CB] font-bold text-sm">01 / 05</span>
              <span className="text-white/20">|</span>
              <span className="text-white uppercase font-bold tracking-[0.25em]">HOS ROUTE PLANNING &amp; ELD LOGS</span>
              <span className="text-white/20 hidden sm:inline">|</span>
              <span className="text-[#0016CB] hidden sm:inline font-mono">FMCSA 49 CFR § 395</span>
            </motion.div>

            {/* Kinetic Word-by-Word Title Reveal */}
            <div className="space-y-2">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[88px] font-black uppercase tracking-tight leading-[0.95] text-white font-display flex flex-wrap gap-x-4">
                {titleWords.map((word, i) => (
                  <motion.span
                    key={word}
                    initial={{ y: 40, opacity: 0, filter: 'blur(8px)' }}
                    animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                    transition={{
                      duration: 0.7,
                      delay: 0.1 + i * 0.08,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                    className={i >= 2 ? 'text-white' : 'text-white'}
                  >
                    {word}
                  </motion.span>
                ))}
              </h1>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 96 }}
                transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
                className="h-1 bg-[#0016CB] mt-4"
              />
            </div>

            {/* Subcopy */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed font-normal"
            >
              Precision commercial corridor routing, automated 11h/14h/30m/70h duty scheduling, mandatory diesel stops every &lt; 1,000 miles, and FMCSA-certified 24.00h balanced RODS daily driver logs.
            </motion.p>

            {/* United Carriers Pill Buttons with Magnetic Hover & Shimmer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              {/* Primary Action Button with Shimmer Effect */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleLaunch(false)}
                className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#0016CB] hover:bg-[#0014B5] text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 shadow-[0_0_35px_rgba(0,22,203,0.5)] hover:shadow-[0_0_50px_rgba(0,22,203,0.8)] cursor-pointer overflow-hidden"
              >
                {/* Diagonal light shimmer */}
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '200%' }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 pointer-events-none"
                />

                <Truck className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                <span>PLAN A ROUTE NOW</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </motion.button>

              {/* Working Secondary Demo Button */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleLaunch(true)}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 text-white text-xs sm:text-sm font-semibold uppercase tracking-wider border border-white/20 hover:border-white/40 transition-all duration-300 cursor-pointer backdrop-blur-md group"
              >
                <Play className="w-3.5 h-3.5 text-[#0016CB] fill-[#0016CB] group-hover:scale-110 transition-transform" />
                <span>TRY LIVE DEMO TRIP</span>
              </motion.button>

              <button
                type="button"
                onClick={() => scrollToSection('crane-sequence')}
                className="text-xs font-mono text-slate-400 hover:text-white underline cursor-pointer ml-2"
              >
                Explore Dispatch Sequence &darr;
              </button>
            </motion.div>

            {/* Micro Compliance Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="pt-6 flex flex-wrap items-center gap-6 text-xs text-slate-400 font-mono"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0016CB]" />
                <span className="text-white">Real OSRM Road Geometry</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0016CB]" />
                <span className="text-white">1,000-Mi Fuel Enforced</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0016CB]" />
                <span className="text-white">Audit-Proof PDF Logs</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Floating Tactical Dispatch Capsule with Continuous Float Loop */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-4"
          >
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="relative rounded-2xl bg-black/60 backdrop-blur-xl border border-white/15 p-6 shadow-2xl space-y-5 overflow-hidden"
            >
              {/* Glowing Corner Indicator */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#0016CB]/20 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">FMCSA ENGINE ACTIVE</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0016CB]/20 text-[#99A9EE] border border-[#0016CB]/40 font-bold">
                  v2.4 AUDIT
                </span>
              </div>

              {/* Corridor Specifier */}
              <div className="space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Navigation className="w-3.5 h-3.5 text-[#0016CB]" />
                    <span>Origin:</span>
                  </div>
                  <span className="text-white font-bold">Chicago, IL (Terminal #04)</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Fuel className="w-3.5 h-3.5 text-amber-400" />
                    <span>Diesel Rest:</span>
                  </div>
                  <span className="text-amber-400 font-bold">Injected at Mile 964</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-purple-400" />
                    <span>Sleeper Berth:</span>
                  </div>
                  <span className="text-purple-400 font-bold">10.0h Mandatory Reset</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 text-slate-300">
                    <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Daily Log Sheet:</span>
                  </div>
                  <span className="text-emerald-400 font-bold">24.00h Balanced Grid</span>
                </div>
              </div>

              {/* Direct Quick Launch Trigger */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleLaunch(true)}
                className="w-full py-3.5 rounded-xl bg-white hover:bg-slate-200 text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg"
              >
                <span>RUN DEMO CORRIDOR</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            </motion.div>
          </motion.div>

        </div>
      </div>

      {/* 5. Bottom Corridor Barometer */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-4">
          <span className="text-[#0016CB] font-bold">ACTIVE PROTOCOL:</span>
          <span className="text-white">PROPERTY-CARRYING COMMERCIAL MOTOR VEHICLES (CMV)</span>
        </div>
        <div className="flex items-center gap-6">
          <span>70H / 8-DAY CYCLE</span>
          <span>•</span>
          <span>11H DRIVE CAP</span>
          <span>•</span>
          <span>14H DUTY WINDOW</span>
        </div>
      </div>
    </section>
  );
};
