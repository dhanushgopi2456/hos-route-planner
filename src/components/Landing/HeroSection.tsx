import React from 'react';
import { useNavigate } from 'react-router-dom';
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

  return (
    <section id="hero" className="relative min-h-[88vh] flex flex-col justify-between pt-16 sm:pt-20 pb-12 bg-[#0f0f10] text-[#ededed] border-b border-[#232325]">
      {/* Main Hero Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full my-auto py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Headline, Subcopy & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Category Breadcrumb */}
            <div className="flex items-center gap-3 text-xs font-mono text-[#85858b]">
              <span className="text-[#2563EB] font-medium">01 / 05</span>
              <span>&bull;</span>
              <span className="text-[#a1a1a6]">HOS route planning &amp; ELD logs</span>
              <span className="hidden sm:inline">&bull;</span>
              <span className="text-[#85858b] hidden sm:inline">FMCSA 49 CFR § 395</span>
            </div>

            {/* Headline */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-white leading-[1.12]">
                Commercial corridor routing with guaranteed Hours of Service compliance.
              </h1>
              <div className="h-[2px] w-16 bg-[#2563EB]" />
            </div>

            {/* Subcopy */}
            <p className="text-sm sm:text-base text-[#a1a1a6] max-w-2xl leading-relaxed font-normal">
              Precision highway routing, automated 11h driving and 14h duty scheduling, mandatory diesel stops every &lt; 1,000 miles, and FMCSA-certified 24.00-hour balanced RODS daily driver logs.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => handleLaunch(false)}
                className="btn-electric-primary px-5 py-2.5 text-xs font-medium inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <Truck className="w-4 h-4" />
                <span>Plan a route</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => handleLaunch(true)}
                className="btn-electric-secondary px-5 py-2.5 text-xs font-medium inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 text-blue-400" />
                <span>Try live demo</span>
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('crane-sequence')}
                className="text-xs font-mono text-[#85858b] hover:text-[#ededed] cursor-pointer self-center sm:self-auto sm:ml-2"
              >
                Explore dispatch sequence &darr;
              </button>
            </div>

            {/* Micro Compliance Badges */}
            <div className="pt-4 flex flex-wrap items-center gap-5 text-xs text-[#85858b] font-mono">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB]" />
                <span className="text-[#a1a1a6]">Real OSRM road geometry</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB]" />
                <span className="text-[#a1a1a6]">Diesel stops &lt; 1,000 mi</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB]" />
                <span className="text-[#a1a1a6]">Audit-proof 24h RODS grid</span>
              </div>
            </div>
          </div>

          {/* Right Column: Tactical Dispatch Telemetry Card */}
          <div className="lg:col-span-5">
            <div className="rounded-xl bg-[#19191b] border border-[#232325] p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-[#232325] pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-mono font-medium text-[#ededed]">FMCSA engine active</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#232325] text-blue-400 border border-blue-500/20 font-medium">
                  v2.4 audit
                </span>
              </div>

              {/* Corridor Specifier */}
              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#141415] border border-[#232325]">
                  <div className="flex items-center gap-2 text-[#85858b]">
                    <Navigation className="w-3.5 h-3.5 text-blue-400" />
                    <span>Origin:</span>
                  </div>
                  <span className="text-[#ededed] font-medium">Chicago, IL (Terminal #04)</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#141415] border border-[#232325]">
                  <div className="flex items-center gap-2 text-[#85858b]">
                    <Fuel className="w-3.5 h-3.5 text-amber-400" />
                    <span>Diesel rest:</span>
                  </div>
                  <span className="text-amber-400 font-medium">Injected at Mile 964</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#141415] border border-[#232325]">
                  <div className="flex items-center gap-2 text-[#85858b]">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    <span>Sleeper berth:</span>
                  </div>
                  <span className="text-[#ededed] font-medium tabular-nums">10.0h mandatory reset</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#141415] border border-[#232325]">
                  <div className="flex items-center gap-2 text-[#85858b]">
                    <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Daily log sheet:</span>
                  </div>
                  <span className="text-emerald-400 font-medium tabular-nums">24.00h balanced grid</span>
                </div>
              </div>

              {/* Direct Quick Launch Trigger */}
              <button
                type="button"
                onClick={() => handleLaunch(true)}
                className="btn-electric-primary w-full py-2.5 text-xs font-medium flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Run demo corridor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Corridor Barometer */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-4 border-t border-[#232325] flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#85858b]">
        <div className="flex items-center gap-3">
          <span className="text-[#2563EB] font-medium">Active protocol:</span>
          <span className="text-[#a1a1a6]">Property-carrying commercial motor vehicles (CMV)</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] tabular-nums">
          <span>70h / 8-day cycle</span>
          <span>&bull;</span>
          <span>11h drive cap</span>
          <span>&bull;</span>
          <span>14h duty window</span>
        </div>
      </div>
    </section>
  );
};
