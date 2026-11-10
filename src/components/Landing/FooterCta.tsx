import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Truck, ArrowRight, Play } from 'lucide-react';

interface FooterCtaProps {
  onLaunchPlanner?: (demo?: boolean) => void;
}

export const FooterCta: React.FC<FooterCtaProps> = ({ onLaunchPlanner }) => {
  const navigate = useNavigate();

  const handleLaunch = (demo = false) => {
    if (onLaunchPlanner) {
      onLaunchPlanner(demo);
    } else {
      navigate(demo ? '/planner?demo=1' : '/planner');
    }
  };

  const handleNavTab = (tab: string) => {
    navigate(`/planner?demo=1&tab=${tab}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#000000] text-slate-400 pt-16 pb-12 border-t border-white/10 overflow-hidden">
      
      {/* 1. Dramatic Container Yard Backdrop (from United Carriers Template) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-16">
        <div className="relative rounded-none overflow-hidden border border-white/15 bg-black shadow-2xl group">
          {/* Background image from template */}
          <div className="absolute inset-0 z-0">
            <img
              src="/assets/uc/footer_thumb.jpg"
              alt="Intermodal freight terminal"
              className="w-full h-full object-cover opacity-35 filter contrast-125 group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/60" />
            <div className="absolute inset-0 bg-[#0016CB]/10 mix-blend-color" />
          </div>

          {/* Banner Content */}
          <div className="relative z-10 p-8 sm:p-14 lg:p-16 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-mono font-bold tracking-wider">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>COMMERCIAL INTERSTATE DISPATCH</span>
                <span className="text-white/40">|</span>
                <span className="text-[#60A5FA] font-bold tracking-widest drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]">ZERO AUDIT RISK</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase text-white tracking-tight font-display leading-[0.98]">
                {'READY TO SECURE YOUR NEXT HAUL?'.split(' ').map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className={`inline-block mr-2.5 ${
                      word === 'NEXT' || word === 'HAUL?' ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-[#60A5FA]' : 'text-white'
                    }`}
                  >
                    {word}
                  </motion.span>
                ))}
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
                Launch the interactive planner. Input your origin, pickup, dropoff, and active cycle hours to compute turn-by-turn highway coordinates, mandatory rest intervals, and 24.00h balanced driver daily logs.
              </p>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row items-center gap-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleLaunch(false)}
                className="relative overflow-hidden w-full sm:w-auto px-8 py-4 rounded-full bg-[#0016CB] hover:bg-[#0022ff] text-white text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-3 transition-all duration-300 shadow-[0_0_35px_rgba(0,22,203,0.7)] hover:shadow-[0_0_50px_rgba(0,22,203,0.9)] cursor-pointer group font-mono"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />
                <Truck className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span>LAUNCH INTERACTIVE PLANNER</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleLaunch(true)}
                className="relative overflow-hidden w-full sm:w-auto px-6 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 border border-white/20 hover:border-cyan-400/50 transition-all cursor-pointer backdrop-blur-md font-mono group"
              >
                <Play className="w-3.5 h-3.5 fill-white group-hover:scale-110 transition-transform" />
                <span>LOAD DEMO TRIP</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Brand & Navigation Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pt-4 border-t border-white/10">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#0016CB] flex items-center justify-center text-white">
                <Truck className="w-4 h-4" />
              </div>
              <span className="font-black text-lg text-white font-display tracking-tight uppercase">
                HOS ROUTE PLANNER
              </span>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              FMCSA 49 CFR Part 395 Hours of Service route planning, OSRM road geometry, automated 1,000-mile diesel refueling intervals, and 24-hour electronic driver daily log sheets.
            </p>

            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>April 2022 FMCSA Property-Carrying Standard Enforced</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <div className="text-xs font-mono uppercase font-bold text-white tracking-wider">
              WORKSPACE VIEWS
            </div>
            <ul className="space-y-2.5 text-xs font-mono">
              {[
                { tab: 'overview', label: 'Interactive Route & GIS Map' },
                { tab: 'logs', label: 'ELD Daily Log Generator (RODS)' },
                { tab: 'timeline', label: 'Duty Schedule Timeline' },
                { tab: 'compliance', label: 'Compliance Audit (8 Checks)' }
              ].map(link => (
                <li key={link.tab}>
                  <button
                    type="button"
                    onClick={() => handleNavTab(link.tab)}
                    className="hover:text-white transition-all cursor-pointer text-left flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-3 h-3 text-blue-500 transition-transform group-hover:translate-x-1" />
                    <span className="group-hover:text-blue-300 transition-colors">{link.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Compliance Specs */}
          <div className="space-y-3">
            <div className="text-xs font-mono uppercase font-bold text-white tracking-wider">
              REGULATORY RULES
            </div>
            <ul className="space-y-2 text-xs font-mono text-slate-400">
              <li>49 CFR § 395.3(a)(1) — 11-Hour Drive Cap</li>
              <li>49 CFR § 395.3(a)(2) — 14-Hour Duty Window</li>
              <li>49 CFR § 395.3(a)(3) — 30-Minute Rest Break</li>
              <li>49 CFR § 395.3(b)(2) — 70-Hour / 8-Day Cycle</li>
              <li>49 CFR § 395.8 — 24-Hour Graph Grid RODS</li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright & Back to Top */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} HOS Route Planner &bull; Built to United Carriers Design Standard.
          </div>

          <div className="flex items-center gap-6">
            <span>FMCSA COMPLIANT</span>
            <button
              type="button"
              onClick={scrollToTop}
              className="text-[#0016CB] hover:underline uppercase font-bold cursor-pointer transition-colors"
            >
              Back to Top &uarr;
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
