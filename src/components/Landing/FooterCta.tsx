import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Truck, ArrowRight, ShieldCheck, Heart } from 'lucide-react';

interface FooterCtaProps {
  onLaunchPlanner?: () => void;
}

export const FooterCta: React.FC<FooterCtaProps> = ({ onLaunchPlanner }) => {
  const navigate = useNavigate();

  const handleLaunch = () => {
    if (onLaunchPlanner) {
      onLaunchPlanner();
    } else {
      navigate('/planner');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#04060A] text-slate-400 pt-20 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* Bold CTA Banner */}
        <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden border border-blue-500/30 bg-gradient-to-r from-blue-950/40 via-slate-900/90 to-blue-950/40 backdrop-blur-xl shadow-2xl">
          {/* Subtle Radial Mesh */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-mono font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>Zero Violation Math &bull; 100% Free &amp; Open Commercial Dispatch</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-white tracking-tight font-display">
                Ready to plan your next{' '}
                <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-white bg-clip-text text-transparent">
                  compliant haul?
                </span>
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Launch the interactive planner now. Enter your origin, pickup, dropoff, and current cycle hours to generate an audit-ready multi-day route in seconds.
              </p>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row items-center gap-4">
              <button
                type="button"
                onClick={handleLaunch}
                className="btn-electric-primary w-full sm:w-auto px-8 py-4 text-base flex items-center justify-center gap-3 cursor-pointer shadow-xl shadow-blue-600/40"
              >
                <Truck className="w-5 h-5" />
                <span>Open HOS Route Planner</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Navigation & Brand Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-8 border-t border-slate-800/80">
          {/* Col 1: Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30 border border-white/20">
                <Truck className="w-5 h-5" />
              </div>
              <span className="font-black text-lg text-white font-display tracking-tight">
                HOS ROUTE PLANNER
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Commercial motor vehicle route optimization, FMCSA 49 CFR Part 395 Hours of Service scheduling, automated fuel stops, and 24-hour electronic driver daily log sheets.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>April 2022 FMCSA Property-Carrying Standard Active</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <div className="text-xs font-mono uppercase font-bold text-white tracking-wider">
              Navigation
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={handleLaunch}
                  className="hover:text-blue-400 transition-colors cursor-pointer text-left"
                >
                  Trip Planner Workspace
                </button>
              </li>
              <li>
                <a href="#features" className="hover:text-blue-400 transition-colors">
                  Core Capabilities
                </a>
              </li>
              <li>
                <a href="#eld-showcase" className="hover:text-blue-400 transition-colors">
                  ELD Engine &amp; Milestones
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-blue-400 transition-colors">
                  Compliance FAQ
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/about')}
                  className="hover:text-blue-400 transition-colors cursor-pointer text-left"
                >
                  HOS Rules &amp; Audit Suite
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Regulatory Compliance */}
          <div className="space-y-3">
            <div className="text-xs font-mono uppercase font-bold text-white tracking-wider">
              CFR Compliance
            </div>
            <ul className="space-y-2 text-xs text-slate-400 font-mono">
              <li>&bull; 49 CFR § 395.3(a)(1) 11h Driving</li>
              <li>&bull; 49 CFR § 395.3(a)(2) 14h Duty</li>
              <li>&bull; 49 CFR § 395.3(a)(3) 30m Rest</li>
              <li>&bull; 49 CFR § 395.3(b)(2) 70h/8d Cycle</li>
              <li>&bull; 49 CFR § 395.8 RODS Daily Logs</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Disclaimers */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
          <div>
            &copy; {new Date().getFullYear()} HOS Route Planner &amp; ELD Generator. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={scrollToTop}
              className="hover:text-blue-400 transition-colors cursor-pointer"
            >
              Back to Top &uarr;
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
