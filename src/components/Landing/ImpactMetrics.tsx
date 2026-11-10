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
    const duration = 2000; // ms
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing: easeOutExpo
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
      label: 'COMMERCIAL CORRIDORS SOLVED',
      desc: 'OSRM highway routing across continental freight lanes with dynamic diesel and sleeper stop insertion.'
    },
    {
      numericValue: 98.2,
      suffix: '%',
      decimals: 1,
      label: 'CLEAN AUDIT & INSPECTION RATE',
      desc: 'Roadside Level I–III FMCSA compliance records with zero 11-hour driving or 14-hour window violations.'
    },
    {
      numericValue: 8,
      suffix: '+',
      label: 'STATUTORY COMPLIANCE ENFORCEMENTS',
      desc: '11h drive cap, 14h window, 30m rest, 70h/8-day cycle, 10h sleeper reset, 1,000-mi diesel stops, and 24.00h balanced RODS.'
    }
  ];

  // Mouse spotlight tracking for the container
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <section
      id="impact-metrics"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative py-24 bg-[#FFFFFF] text-[#111111] overflow-hidden group/section"
    >
      {/* Subtle radial spotlight tracking mouse cursor */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 group-hover/section:opacity-100 transition-opacity duration-500 z-0"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0, 22, 203, 0.05), transparent 40%)`
        }}
      />

      {/* Subtle background micro-grid */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#000000 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Image Thumbnail, Monumental Copy & Statement */}
          <div className="lg:col-span-6 space-y-8">
            
            {/* Authentic Template Monochrome Intro Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-md h-48 sm:h-56 rounded-none overflow-hidden bg-slate-900 border border-[#111111]/20 shadow-md group"
            >
              <img
                src="/assets/uc/intro_thumb.jpg"
                alt="Freight logistics operations terminal"
                className="w-full h-full object-cover filter grayscale contrast-125 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-white/90">
                <span className="uppercase tracking-widest font-bold">TERMINAL DISPATCH // HOS VERIFIED</span>
                <span className="text-[#0016CB] font-bold bg-white px-2 py-0.5 rounded-none text-[10px]">FMCSA § 395</span>
              </div>
            </motion.div>

            {/* High-Impact Headline (Exact United Carriers Stance) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-1"
            >
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[0.98] text-[#111111] font-display">
                WE PLAN ROUTES. <br />
                <span className="text-[#111111]">WE SHIELD COMPLIANCE.</span>
              </h2>
            </motion.div>

            {/* Editorial Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-[#111111]/80 max-w-xl leading-relaxed font-normal"
            >
              Every interstate leg, driving minute, and mandatory rest period is mathematically calculated against FMCSA 49 CFR Part 395 regulations. From multi-leg OSRM highway geometry to automated 1,000-mile diesel refueling intervals, we ensure commercial carriers dispatch with zero violation risk.
            </motion.p>

            {/* Editorial Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center gap-6 pt-2 text-xs font-mono text-[#111111]/70"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0016CB]" />
                <span className="font-bold text-[#111111]">Property-Carrying 60/70h Rules</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0016CB]" />
                <span className="font-bold text-[#111111]">Instant 24h RODS Grid Graph</span>
              </div>
            </motion.div>

          </div>

          {/* Right Column: 3 Massive Stat Columns with Live Count-Up Tickers */}
          <div className="lg:col-span-6 flex flex-col justify-between h-full pt-4 lg:pt-0">
            <div className="divide-y divide-[#111111]/15 border-t lg:border-t-0 border-b border-[#111111]/15">
              {metrics.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
                  className="py-8 first:pt-0 last:pb-8 group"
                >
                  <div className="flex items-baseline justify-between">
                    <span className="text-5xl sm:text-6xl lg:text-7xl font-black font-display text-[#111111] tracking-tight tabular-nums group-hover:text-[#0016CB] transition-colors duration-300">
                      <AnimatedCounter
                        target={item.numericValue}
                        suffix={item.suffix}
                        prefix={item.prefix}
                        decimals={item.decimals}
                      />
                    </span>
                    <ArrowUpRight className="w-6 h-6 text-[#111111]/30 group-hover:text-[#0016CB] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                  </div>

                  <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#111111] mt-2 font-mono">
                    {item.label}
                  </div>

                  <p className="text-xs sm:text-sm text-[#111111]/70 mt-2 leading-relaxed max-w-lg">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Bottom Proof Tag */}
            <div className="pt-6 flex items-center justify-between text-xs font-mono text-[#111111]/60">
              <span className="uppercase">U.S. DEPT OF TRANSPORTATION COMPLIANT</span>
              <span className="text-[#0016CB] font-bold">49 CFR § 395.3 &amp; § 395.8</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
