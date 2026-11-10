import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Truck,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { CinematicRadarCorridor } from './CinematicRadarCorridor';

interface HeroSectionProps {
  onLaunchPlanner?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onLaunchPlanner }) => {
  const navigate = useNavigate();

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
    <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden bg-[#000000]">
      {/* Background Mesh Gradients & Atmospheric Glows */}
      <div className="absolute inset-0 bg-grid-mesh opacity-20 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-radial-blue pointer-events-none opacity-90" />
      <div className="absolute top-1/4 -left-48 w-96 h-96 rounded-full bg-[#0016CB]/15 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline, Copy & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Eyebrow Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.445, 0.05, 0.55, 0.95] }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0A0A0A] border border-[#242424] text-white text-xs font-semibold tracking-wide backdrop-blur-md"
            >
              <span className="w-2 h-2 rounded-full bg-[#0016CB] animate-ping" />
              <span className="uppercase tracking-widest text-[11px] font-mono text-slate-300">FMCSA HOS COMPLIANCE &amp; AUTOMATED ELD LOGGING</span>
              <span className="text-[#374151]">|</span>
              <span className="text-[#0016CB] font-mono font-bold text-[11px]">49 CFR § 395</span>
            </motion.div>

            {/* Main Headline (Staggered Text Reveal) */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1, ease: [0.445, 0.05, 0.55, 0.95] }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[1.02] text-white font-display"
            >
              Every mile of the haul.{' '}
              <span className="block mt-1 text-[#0016CB] drop-shadow-[0_0_35px_rgba(0,22,203,0.55)]">
                Planned, compliant, and logged.
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.445, 0.05, 0.55, 0.95] }}
              className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed mx-auto lg:mx-0 font-normal"
            >
              Commercial HOS route planning, 11/14/30/70-hour duty scheduling, automated fuel stops, and daily ELD log sheets—unified in one intelligent dispatch workspace.
            </motion.p>

            {/* Dual CTAs & Micro-Proof */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.445, 0.05, 0.55, 0.95] }}
              className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <button
                type="button"
                onClick={handleLaunch}
                className="btn-uc-solid px-8 py-4 text-sm flex items-center justify-center gap-2.5 cursor-pointer shadow-[0_0_25px_rgba(0,22,203,0.4)]"
              >
                <Truck className="w-4 h-4" />
                <span>Plan a Route Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('eld-showcase')}
                className="btn-uc-pill px-8 py-4 text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Explore ELD Engine</span>
              </button>
            </motion.div>

            {/* Key Value Micro Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400 font-mono"
            >
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#0016CB]" />
                <span className="text-white">OSRM Highway Geometry</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#0016CB]" />
                <span className="text-white">1,000-Mi Fuel Routing</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#0016CB]" />
                <span className="text-white">PDF Driver Logs</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: 3D Animated Cinematic Radar Corridor */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.25, ease: [0.445, 0.05, 0.55, 0.95] }}
            className="lg:col-span-5 relative"
          >
            <CinematicRadarCorridor />
          </motion.div>

        </div>
      </div>
    </section>
  );
};
