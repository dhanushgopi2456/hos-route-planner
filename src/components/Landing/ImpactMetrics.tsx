import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Clock, Fuel, FileCheck2 } from 'lucide-react';

export const ImpactMetrics: React.FC = () => {
  const metrics = [
    {
      stat: '11 / 14 hr',
      label: 'Driving & Duty Window Limits',
      desc: 'Enforces 11-hour driving caps and 14-hour on-duty windows with automatic 10-hour sleeper resets.',
      icon: Clock,
      tag: 'CFR § 395.3(a)(1)',
      color: 'from-blue-500 to-indigo-500',
      badgeBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    },
    {
      stat: '70 hr / 8 day',
      label: 'Rolling Cycle Tracking',
      desc: 'Accurate accumulation of rolling cycle on-duty hours before dispatching multi-day interstate hauls.',
      icon: ShieldCheck,
      tag: 'CFR § 395.3(b)(2)',
      color: 'from-cyan-400 to-blue-500',
      badgeBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
    },
    {
      stat: '1,000 mi',
      label: 'Smart Fuel & 30-Min Rest',
      desc: 'Mandatory fuel stops placed every 1,000 miles, plus 30-minute breaks injected before 8h of continuous drive.',
      icon: Fuel,
      tag: 'Auto-Injected Stops',
      color: 'from-amber-400 to-orange-500',
      badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    },
    {
      stat: '100%',
      label: 'FMCSA-Ready 24-Hour Grids',
      desc: 'Instant 24.00h balanced RODS graph grids, midnight transitions, remarks, and PDF inspection exports.',
      icon: FileCheck2,
      tag: 'CFR § 395.8 Compliant',
      color: 'from-emerald-400 to-teal-500',
      badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    }
  ];

  return (
    <section className="relative py-20 bg-[#000000] border-y border-[#242424]">
      {/* Background Subtle Accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/10 via-transparent to-blue-950/10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-semibold uppercase tracking-widest font-mono"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Audited FMCSA Operational Thresholds</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.445, 0.05, 0.55, 0.95] }}
            className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-white tracking-tight font-display"
          >
            We map the route.{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              We guarantee compliance.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-400 text-sm sm:text-base leading-relaxed"
          >
            Eliminate logbook math, roadside DOT violations, and scheduling guesswork. Every calculation rigorously adheres to FMCSA 49 CFR Part 395 standards.
          </motion.p>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.stat}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="uc-glass-card rounded-2xl p-6 relative group overflow-hidden"
              >
                {/* Top Subtle Border Highlight */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-center text-white group-hover:border-blue-500/50 transition-colors">
                    <Icon className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${item.badgeBg}`}>
                    {item.tag}
                  </span>
                </div>

                <div className="text-3xl sm:text-4xl font-black font-display text-white tracking-tight tabular-nums">
                  {item.stat}
                </div>

                <div className="text-sm font-bold text-slate-200 mt-2 font-display">
                  {item.label}
                </div>

                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
