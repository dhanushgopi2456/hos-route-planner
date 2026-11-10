import React from 'react';
import { Truck, ShieldCheck, Fuel, Clock, MapPin } from 'lucide-react';

interface MarqueeTickerProps {
  className?: string;
}

export const MarqueeTicker: React.FC<MarqueeTickerProps> = ({ className = '' }) => {
  const items = [
    { label: 'FMCSA 49 CFR § 395 compliant', icon: ShieldCheck, color: 'text-emerald-400' },
    { label: '11-hour driving limit enforced', icon: Clock, color: 'text-blue-400' },
    { label: '14-hour duty window tracked', icon: Clock, color: 'text-blue-400' },
    { label: '30-minute break auto-injection', icon: Clock, color: 'text-blue-400' },
    { label: '1,000-mile diesel fuel stops', icon: Fuel, color: 'text-amber-400' },
    { label: '24.00-hour balanced RODS grids', icon: Truck, color: 'text-blue-300' },
    { label: '70-hour / 8-day rolling cycle', icon: ShieldCheck, color: 'text-indigo-400' },
    { label: 'OSRM highway road geometry', icon: MapPin, color: 'text-rose-400' },
  ];

  return (
    <div
      className={`relative w-full overflow-hidden border-y border-[#232325] bg-[#141415] py-2.5 select-none ${className}`}
      aria-label="Compliance and Routing Features Ticker"
    >
      {/* Edge gradient masks for seamless fade */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#141415] to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#141415] to-transparent z-10" />

      <div className="animate-marquee flex items-center gap-8 whitespace-nowrap">
        {/* Render 2 continuous sets for infinite seamless looping */}
        {[...items, ...items].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={`marquee-item-${idx}`}
              className="inline-flex items-center gap-2.5 text-xs font-mono text-[#a1a1a6] hover:text-white transition-colors"
            >
              <Icon className={`h-3.5 w-3.5 ${item.color}`} />
              <span>{item.label}</span>
              <span className="h-1 w-1 rounded-full bg-[#85858b]" />
            </div>
          );
        })}
      </div>
    </div>
  );
};
