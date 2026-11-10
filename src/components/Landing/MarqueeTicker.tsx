import React from 'react';
import { Truck, ShieldCheck, Fuel, Clock, MapPin, Sparkles } from 'lucide-react';

interface MarqueeTickerProps {
  className?: string;
}

export const MarqueeTicker: React.FC<MarqueeTickerProps> = ({ className = '' }) => {
  const items = [
    { label: 'FMCSA 49 CFR § 395 COMPLIANT', icon: ShieldCheck, color: 'text-emerald-400' },
    { label: '11-HOUR DRIVING LIMIT ENFORCED', icon: Clock, color: 'text-blue-400' },
    { label: '14-HOUR DUTY WINDOW TRACKED', icon: Clock, color: 'text-cyan-400' },
    { label: '30-MINUTE BREAK AUTO-INJECTION', icon: Sparkles, color: 'text-purple-400' },
    { label: '1,000-MILE DIESEL FUEL STOPS', icon: Fuel, color: 'text-amber-400' },
    { label: '24.00-HOUR BALANCED RODS GRIDS', icon: Truck, color: 'text-blue-300' },
    { label: '70-HR / 8-DAY ROLLING CYCLE', icon: ShieldCheck, color: 'text-indigo-400' },
    { label: 'OSRM HIGHWAY ROAD GEOMETRY', icon: MapPin, color: 'text-rose-400' },
  ];

  return (
    <div
      className={`relative w-full overflow-hidden border-y border-white/[0.08] bg-[#070A12] py-3.5 select-none ${className}`}
      aria-label="Compliance and Routing Features Ticker"
    >
      {/* Edge gradient masks for seamless fade */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#06080E] to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#06080E] to-transparent z-10" />

      <div className="animate-marquee flex items-center gap-10 whitespace-nowrap">
        {/* Render 2 continuous sets for infinite seamless looping */}
        {[...items, ...items].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={`marquee-item-${idx}`}
              className="inline-flex items-center gap-3 text-xs font-mono font-bold uppercase tracking-wider text-slate-300 transition-colors hover:text-white"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/[0.06] border border-white/10">
                <Icon className={`h-3 w-3 ${item.color}`} />
              </span>
              <span>{item.label}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500/60 shadow-[0_0_8px_#0016cb]" />
            </div>
          );
        })}
      </div>
    </div>
  );
};
