import React from 'react';
import { Compass, ShieldAlert, BarChart3, FileSpreadsheet, ArrowUpRight } from 'lucide-react';

const PillarCard: React.FC<{
  pillar: {
    num: string;
    title: string;
    subtitle: string;
    body: string;
    icon: any;
    tag: string;
  };
  index: number;
}> = ({ pillar }) => {
  return (
    <div className="p-5 sm:p-6 rounded-xl bg-[#19191b] border border-[#232325] hover:border-[#2e2e32] flex flex-col justify-between group transition-colors">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-3xl font-semibold font-mono text-[#85858b] group-hover:text-[#2563EB] transition-colors">
            {pillar.num}
          </span>
          <span className="text-[10px] font-mono text-[#85858b] bg-[#141415] px-2 py-0.5 rounded border border-[#232325]">
            {pillar.tag}
          </span>
        </div>

        <h3 className="text-sm sm:text-base font-semibold text-[#ededed] mb-1 group-hover:text-white transition-colors">
          {pillar.title}
        </h3>
        <p className="text-xs text-blue-400 mb-2 font-mono">
          {pillar.subtitle}
        </p>
        <p className="text-xs text-[#a1a1a6] leading-relaxed">
          {pillar.body}
        </p>
      </div>

      <div className="pt-4 mt-5 border-t border-[#232325] flex items-center justify-between text-[11px] text-[#85858b] font-mono">
        <span>FMCSA engine rule</span>
        <ArrowUpRight className="w-3.5 h-3.5 text-[#2563EB] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </div>
    </div>
  );
};

export const ValuePillars: React.FC = () => {
  const pillars = [
    {
      num: '01',
      title: 'Precision Highway Routing',
      subtitle: 'Real-world road geometry via OSRM.',
      body: 'Standard trip planners calculate geodesic straight lines, causing severe mileage underestimations. Our OSRM engine follows actual interstate truck routes, mountain grades, and bypass corridors.',
      icon: Compass,
      tag: 'OSRM Engine'
    },
    {
      num: '02',
      title: 'Zero Violation Calculations',
      subtitle: 'Automated 11/14/30/70 statutory enforcement.',
      body: 'Stop guessing whether a driver has enough remaining duty time to make the receiver. The scheduler simulates every minute of travel, inserting required 30-minute breaks and 10-hour sleeper resets automatically.',
      icon: ShieldAlert,
      tag: 'CFR § 395.3'
    },
    {
      num: '03',
      title: 'Visual Timeline Clarity',
      subtitle: 'Chronological duty milestones.',
      body: 'A single, unified chronological source of truth. Every leg, fuel stop, sleeper interval, and dwell period is mapped on an interactive vertical timeline with exact departure and arrival timestamps.',
      icon: BarChart3,
      tag: 'Event Sequences'
    },
    {
      num: '04',
      title: 'Audit-Ready ELD Sheets',
      subtitle: '24.00h balanced graph grids for every day.',
      body: 'Generate compliant Driver Daily Log sheets (RODS) complete with midnight splits, remark annotations, driver certifications, and instantaneous multi-page PDF exports ready for DOT inspections.',
      icon: FileSpreadsheet,
      tag: 'CFR § 395.8'
    }
  ];

  return (
    <section id="value-pillars" className="relative py-20 bg-[#0f0f10] border-t border-[#232325] text-[#ededed]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 space-y-2.5">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-[#141415] border border-[#232325] text-blue-400 text-xs font-mono">
            <span>Built for commercial fleets &amp; owner-operators</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight leading-tight">
            Engineered for drivers and fleets that cannot afford violations.
          </h2>

          <p className="text-[#a1a1a6] text-xs sm:text-sm leading-relaxed max-w-2xl font-normal">
            Every minute of downtime or roadside out-of-service order burns profit. Our 4-pillar compliance architecture protects drivers, safety managers, and carrier safety scores.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {pillars.map((pillar, index) => (
            <PillarCard
              key={pillar.num}
              pillar={pillar}
              index={index}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
