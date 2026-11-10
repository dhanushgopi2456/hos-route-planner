import React from 'react';
import { motion } from 'motion/react';
import { Compass, ShieldAlert, BarChart3, FileSpreadsheet, ArrowUpRight } from 'lucide-react';

export const ValuePillars: React.FC = () => {
  const pillars = [
    {
      num: '01',
      title: 'Precision Highway Routing',
      subtitle: 'Real-world road geometry powered by OSRM and Leaflet.',
      body: 'Standard trip planners calculate geodesic straight lines, causing severe mileage underestimations. Our OSRM engine follows actual interstate truck routes, mountain grades, and bypass corridors for accurate drive times.',
      icon: Compass,
      tag: 'OSRM Engine'
    },
    {
      num: '02',
      title: 'Zero Violation Math',
      subtitle: 'Automated enforcement of 11/14/30/70-hour statutory rules.',
      body: 'Stop guessing whether a driver has enough remaining duty time to make the receiver. The scheduler simulates every minute of travel, inserting required 30-minute breaks and 10-hour sleeper berth resets automatically.',
      icon: ShieldAlert,
      tag: 'CFR § 395.3'
    },
    {
      num: '03',
      title: 'Visual Timeline Clarity',
      subtitle: 'Color-coded chronological duty milestones from start to delivery.',
      body: 'A single, unified chronological source of truth. Every leg, fuel stop, sleeper interval, and dwell period is mapped on an interactive vertical timeline with exact departure and arrival timestamps.',
      icon: BarChart3,
      tag: 'Event Sequences'
    },
    {
      num: '04',
      title: 'Audit-Ready ELD Sheets',
      subtitle: 'Pixel-perfect 24-hour graph grids rendered for every single day.',
      body: 'Generate compliant Driver Daily Log sheets (RODS) complete with midnight splits, remark annotations, driver certifications, and instantaneous multi-page PDF exports ready for DOT roadside inspections.',
      icon: FileSpreadsheet,
      tag: 'CFR § 395.8'
    }
  ];

  return (
    <section className="relative py-24 bg-[#000000] border-t border-[#242424]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-widest font-mono">
            <span>Built For Fleets &amp; Owner-Operators</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-white tracking-tight font-display">
            Built for fleets and drivers that{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              can't afford violations.
            </span>
          </h2>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Every minute of downtime or roadside out-of-service order burns profit. Our 4-pillar compliance architecture protects drivers, safety managers, and carrier safety scores.
          </p>
        </div>

        {/* 4 Pillars Grid (United Carriers editorial style) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.num}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4 }}
                className="uc-glass-card rounded-2xl p-6 flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Glowing Top Number */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl font-black font-mono text-slate-800 group-hover:text-blue-500 transition-colors">
                      {pillar.num}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {pillar.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white font-display mb-1 group-hover:text-blue-300 transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-xs font-semibold text-blue-400/90 mb-3">
                    {pillar.subtitle}
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {pillar.body}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>Architecture Verified</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-blue-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
