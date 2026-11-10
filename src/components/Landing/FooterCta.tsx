import React from 'react';
import { useNavigate } from 'react-router-dom';
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
    <footer className="relative bg-[#0f0f10] text-[#a1a1a6] pt-14 pb-12 border-t border-[#232325] overflow-hidden">
      
      {/* Container Yard Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-12">
        <div className="rounded-xl overflow-hidden border border-[#232325] bg-[#19191b] p-6 sm:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-[#141415] border border-[#232325] text-[#ededed] text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Commercial interstate dispatch &bull; Zero audit risk</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white tracking-tight leading-tight">
              Ready to secure your next haul?
            </h2>

            <p className="text-xs sm:text-sm text-[#a1a1a6] leading-relaxed font-normal">
              Launch the interactive planner. Input your origin, pickup, dropoff, and active cycle hours to compute turn-by-turn highway coordinates, mandatory rest intervals, and 24.00h balanced driver daily logs.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={() => handleLaunch(false)}
              className="btn-electric-primary w-full sm:w-auto px-5 py-2.5 text-xs font-medium inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Launch interactive planner</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => handleLaunch(true)}
              className="btn-electric-secondary w-full sm:w-auto px-5 py-2.5 text-xs font-medium inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 text-blue-400" />
              <span>Load demo trip</span>
            </button>
          </div>
        </div>
      </div>

      {/* Brand & Navigation Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-4 border-t border-[#232325]">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-md bg-[#2563EB] flex items-center justify-center text-white shrink-0">
                <Truck className="w-3.5 h-3.5" />
              </div>
              <span className="font-semibold text-sm text-white">
                HOS Route Planner
              </span>
            </div>
            
            <p className="text-xs text-[#85858b] leading-relaxed max-w-sm">
              FMCSA 49 CFR Part 395 Hours of Service route planning, OSRM road geometry, automated 1,000-mile diesel refueling intervals, and 24-hour electronic driver daily log sheets.
            </p>

            <div className="flex items-center gap-2 text-[11px] text-[#85858b] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>FMCSA Property-Carrying Standard Enforced</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-2.5">
            <div className="text-xs font-mono font-medium text-white">
              Workspace views
            </div>
            <ul className="space-y-2 text-xs font-mono">
              {[
                { tab: 'overview', label: 'Interactive route & map' },
                { tab: 'logs', label: 'ELD daily log generator (RODS)' },
                { tab: 'timeline', label: 'Duty schedule timeline' },
                { tab: 'compliance', label: 'Compliance audit (8 checks)' }
              ].map(link => (
                <li key={link.tab}>
                  <button
                    type="button"
                    onClick={() => handleNavTab(link.tab)}
                    className="hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5 group text-[#a1a1a6]"
                  >
                    <ArrowRight className="w-3 h-3 text-blue-400" />
                    <span>{link.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Compliance Specs */}
          <div className="space-y-2.5">
            <div className="text-xs font-mono font-medium text-white">
              Regulatory rules
            </div>
            <ul className="space-y-1.5 text-xs font-mono text-[#85858b]">
              <li>49 CFR § 395.3(a)(1) — 11h drive cap</li>
              <li>49 CFR § 395.3(a)(2) — 14h duty window</li>
              <li>49 CFR § 395.3(a)(3) — 30m rest break</li>
              <li>49 CFR § 395.3(b)(2) — 70h / 8-day cycle</li>
              <li>49 CFR § 395.8 — 24h graph grid RODS</li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright & Back to Top */}
        <div className="pt-6 border-t border-[#232325] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#85858b]">
          <div>
            &copy; {new Date().getFullYear()} HOS Route Planner &bull; FMCSA 49 CFR § 395 compliant.
          </div>

          <div className="flex items-center gap-6">
            <span>FMCSA compliant</span>
            <button
              type="button"
              onClick={scrollToTop}
              className="text-[#2563EB] hover:text-blue-400 font-medium cursor-pointer transition-colors"
            >
              Back to top &uarr;
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
