import React, { useState, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface MetricItem {
  numericValue: number;
  suffix: string;
  prefix?: string;
  decimals?: number;
  label: string;
  desc: string;
}

// Animated Counter Component using requestAnimationFrame when in view
const AnimatedCounter: React.FC<{
  target: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}> = ({ target, suffix = '', prefix = '', decimals = 0 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  React.useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const duration = 1800; // ms
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentVal = start + (target - start) * easeProgress;
      setCount(currentVal);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, target]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {count.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      })}
      {suffix}
    </span>
  );
};

export const ImpactMetrics: React.FC = () => {
  const metrics: MetricItem[] = [
    {
      numericValue: 2500,
      suffix: '+',
      label: 'Commercial corridors solved',
      desc: 'OSRM highway routing across continental freight lanes with dynamic diesel and sleeper stop insertion.'
    },
    {
      numericValue: 98.2,
      suffix: '%',
      decimals: 1,
      label: 'Clean audit and inspection rate',
      desc: 'Roadside Level I–III FMCSA compliance records with zero 11-hour driving or 14-hour window violations.'
    },
    {
      numericValue: 8,
      suffix: '+',
      label: 'Statutory compliance enforcements',
      desc: '11h drive cap, 14h window, 30m rest, 70h/8-day cycle, 10h sleeper reset, 1,000-mi diesel stops, and 24.00h balanced RODS.'
    }
  ];

  return (
    <section
      id="impact-metrics"
      className="relative py-20 bg-[#FFFFFF] text-[#111111] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Image Thumbnail, Headline & Editorial Text */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Intro Image */}
            <div className="relative w-full max-w-md h-48 sm:h-52 overflow-hidden bg-slate-900 border border-[#111111]/15 group">
              <img
                src="/assets/uc/intro_thumb.jpg"
                alt="Freight logistics operations terminal"
                className="w-full h-full object-cover filter grayscale contrast-110"
              />
              <div className="absolute bottom-2.5 left-3.5 right-3.5 flex items-center justify-between text-[11px] font-mono text-white/90">
                <span className="font-medium">Terminal dispatch &bull; HOS verified</span>
                <span className="text-[#1D4ED8] font-semibold bg-white px-1.5 py-0.5 text-[10px]">FMCSA § 395</span>
              </div>
            </div>

            {/* Headline */}
            <div className="space-y-1">
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight leading-tight text-[#111111]">
                Route planning with verified compliance.
              </h2>
            </div>

            {/* Editorial Subtext */}
            <p className="text-sm sm:text-base text-[#111111]/75 max-w-xl leading-relaxed font-normal">
              Every interstate leg, driving minute, and mandatory rest period is mathematically calculated against FMCSA 49 CFR Part 395 regulations. From multi-leg OSRM highway geometry to automated 1,000-mile diesel refueling intervals, commercial carriers dispatch with zero violation risk.
            </p>

            {/* Editorial Badges */}
            <div className="flex flex-wrap items-center gap-6 pt-1 text-xs font-mono text-[#111111]/70">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#1D4ED8]" />
                <span className="font-medium text-[#111111]">Property-carrying 60/70h rules</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#1D4ED8]" />
                <span className="font-medium text-[#111111]">Instant 24h RODS grid graph</span>
              </div>
            </div>

          </div>

          {/* Right Column: 3 Stat Columns with Count-Up Tickers */}
          <div className="lg:col-span-6 flex flex-col justify-between h-full pt-2 lg:pt-0">
            <div className="divide-y divide-[#111111]/10 border-t lg:border-t-0 border-b border-[#111111]/10">
              {metrics.map((item) => (
                <div
                  key={item.label}
                  className="py-6 first:pt-0 last:pb-6 group"
                >
                  <div className="flex items-baseline justify-between">
                    <span className="text-4xl sm:text-5xl font-semibold text-[#111111] tracking-tight tabular-nums group-hover:text-[#1D4ED8] transition-colors">
                      <AnimatedCounter
                        target={item.numericValue}
                        suffix={item.suffix}
                        prefix={item.prefix}
                        decimals={item.decimals}
                      />
                    </span>
                    <ArrowUpRight className="w-5 h-5 text-[#111111]/25 group-hover:text-[#1D4ED8] transition-colors" />
                  </div>

                  <div className="text-xs font-semibold text-[#111111] mt-1.5 font-mono">
                    {item.label}
                  </div>

                  <p className="text-xs text-[#111111]/65 mt-1 leading-relaxed max-w-lg">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Bottom Proof Tag */}
            <div className="pt-4 flex items-center justify-between text-xs font-mono text-[#111111]/60">
              <span>U.S. Dept of Transportation compliant</span>
              <span className="text-[#1D4ED8] font-medium">49 CFR § 395.3 &amp; § 395.8</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
