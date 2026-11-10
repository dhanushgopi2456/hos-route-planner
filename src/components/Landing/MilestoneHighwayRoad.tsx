import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, Fuel, Clock, FileCheck2, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MilestoneHighwayRoadProps {
  onLaunchPlanner?: (demo?: boolean) => void;
}

export const MilestoneHighwayRoad: React.FC<MilestoneHighwayRoadProps> = ({ onLaunchPlanner }) => {
  const navigate = useNavigate();
  const [activeMilestone, setActiveMilestone] = useState<number>(0);

  const handleLaunch = (demo = true) => {
    if (onLaunchPlanner) {
      onLaunchPlanner(demo);
    } else {
      navigate(demo ? '/planner?demo=1' : '/planner');
    }
  };

  const milestones = [
    {
      step: '01',
      title: 'Pre-Trip Inspection & Window Initiation',
      tag: '14-HOUR ON-DUTY WINDOW',
      icon: Clock,
      description: 'The driver logs 1.0 hour On-Duty (Not Driving) for pre-trip vehicle and cargo inspection. This officially starts the consecutive 14-hour duty clock under FMCSA 49 CFR § 395.3(a)(2).',
      telemetry: 'Baseline Set • 14.0h Duty Window Active • 0 mi Traveled'
    },
    {
      step: '02',
      title: 'OSRM Highway Geometry & Diesel Refueling',
      tag: '< 1,000 MILE MANDATORY FUEL STOP',
      icon: Fuel,
      description: 'Real interstate corridors are computed with accurate speed telemetry. If any single leg or cumulative route exceeds 1,000 miles, the engine automatically schedules a 0.5-hour On-Duty commercial diesel fuel stop.',
      telemetry: 'Commercial Diesel Inserted • Fuel Reserve Protected'
    },
    {
      step: '03',
      title: 'Mandatory 30-Min Rest & 10-Hr Sleeper Reset',
      tag: 'CFR § 395.3(a)(3) REST ENFORCEMENT',
      icon: CheckCircle2,
      description: 'Before cumulative driving reaches 8.0 hours without a break, a 30-minute off-duty rest interval is enforced. When driving hits 11.0 hours or 14.0 hours duty, a mandatory 10.0-hour sleeper berth reset is scheduled.',
      telemetry: '30m Break Inserted • 10.0h Sleeper Berth Reset Applied'
    },
    {
      step: '04',
      title: 'Consignee Delivery & 24.00h Balanced RODS',
      tag: 'FMCSA 24.00H BALANCED LOG SHEET',
      icon: FileCheck2,
      description: '1.0 hour On-Duty is allocated for post-trip inspection and consignee dropoff unloading. The system compiles every duty status segment into a balanced 24.00-hour graphical log sheet with remarks and recap.',
      telemetry: 'Midnight Day Rollovers • Exactly 24.00h per Day • Audit-Ready'
    }
  ];

  return (
    <section id="milestones" className="relative py-28 bg-[#FFFFFF] text-[#111111] overflow-hidden">
      {/* Background Subtle Micro-dots */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#000000 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Section Breadcrumb */}
        <div className="flex items-center gap-4 text-xs font-mono tracking-widest text-[#111111]/60 mb-6">
          <span className="text-[#0016CB] font-bold">03 / 05</span>
          <span>|</span>
          <span className="uppercase tracking-[0.2em] text-[#111111] font-bold">OPERATIONAL MILESTONES</span>
          <span>|</span>
          <span className="text-[#0016CB] font-bold">FMCSA AUDIT ARCHITECTURE</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Monumental Staggered Headline */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-1"
            >
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-[#111111] font-display leading-[0.95]">
                RELIABILITY <br />
                <span className="text-[#111111]">AT EVERY</span> <br />
                <span className="text-[#0016CB]">MILESTONE</span>
              </h2>
            </motion.div>

            <p className="text-base sm:text-lg text-[#111111]/80 max-w-md leading-relaxed">
              From terminal departure to consignee delivery, every second of driver duty, continuous line-haul, diesel refueling, and sleeper berth rest is mapped and verified.
            </p>

            {/* Quick Status Pill */}
            <div className="p-4 rounded-none bg-[#111111]/5 border-l-4 border-[#0016CB] space-y-2">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-[#111111]">
                <span>CORRIDOR SIMULATION</span>
                <span className="text-[#0016CB]">ACTIVE</span>
              </div>
              <p className="text-xs text-[#111111]/70 leading-relaxed">
                Zero roadside violations, zero driving-over-hours citations, and guaranteed 24.00-hour log compliance.
              </p>
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleLaunch(true)}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#111111] hover:bg-[#0016CB] text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 shadow-md cursor-pointer group"
              >
                <Play className="w-4 h-4 fill-white group-hover:scale-110 transition-transform" />
                <span>TEST YOUR ROUTE NOW</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </motion.button>
            </div>
          </div>

          {/* Right Column: Vertical Winding Highway Road with Top-Down Truck & Milestones */}
          <div className="lg:col-span-7 relative">
            
            {/* The Vertical Highway Road track (from United Carriers Template) */}
            <div className="absolute left-6 sm:left-10 top-0 bottom-0 w-20 sm:w-24 bg-[#111111] rounded-t-3xl shadow-xl flex flex-col items-center justify-between py-6 overflow-hidden z-0">
              {/* White Dashed Center-line */}
              <div 
                className="w-1.5 h-full opacity-80"
                style={{
                  backgroundImage: 'linear-gradient(to bottom, #FFFFFF 50%, transparent 50%)',
                  backgroundSize: '100% 32px'
                }}
              />

              {/* Animated Top-Down Semi-Truck (cab + container) moving down the road */}
              <motion.div
                animate={{
                  y: ['0%', '420%', '0%']
                }}
                transition={{
                  duration: 22,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center z-10 pointer-events-none drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
              >
                <img
                  src="/assets/uc/truck_top_view.avif"
                  alt="Semi-Truck Top View"
                  className="w-10 sm:w-12 h-auto object-contain"
                />
                <img
                  src="/assets/uc/container_top_view.avif"
                  alt="Intermodal Container Top View"
                  className="w-9 sm:w-11 h-auto -mt-1 object-contain"
                />
              </motion.div>
            </div>

            {/* Sequential Milestones positioned alongside the road */}
            <div className="relative z-10 pl-24 sm:pl-32 space-y-10 sm:space-y-12">
              {milestones.map((m, index) => {
                const Icon = m.icon;
                const isSelected = activeMilestone === index;

                return (
                  <motion.div
                    key={m.step}
                    initial={{ opacity: 0, x: 24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
                    onClick={() => setActiveMilestone(index)}
                    className={`relative p-6 sm:p-8 rounded-none border transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? 'bg-[#111111] text-white border-[#0016CB] shadow-xl'
                        : 'bg-white text-[#111111] border-[#111111]/15 hover:border-[#0016CB]/50 hover:bg-slate-50'
                    }`}
                  >
                    {/* Connecting Waypoint Pin towards the road */}
                    <div className={`absolute -left-12 sm:-left-14 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected ? 'bg-[#0016CB] border-white ring-4 ring-[#0016CB]/30' : 'bg-white border-[#111111] shadow'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white' : 'bg-[#111111]'}`} />
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-none border ${
                        isSelected 
                          ? 'bg-[#0016CB] text-white border-[#0016CB]' 
                          : 'bg-[#111111]/5 text-[#111111] border-[#111111]/10'
                      }`}>
                        {m.tag}
                      </span>
                      <span className={`text-base font-mono font-black ${isSelected ? 'text-[#0016CB]' : 'text-[#111111]/40'}`}>
                        {m.step}
                      </span>
                    </div>

                    <h3 className={`text-lg sm:text-xl font-black uppercase tracking-tight font-display mb-2 ${
                      isSelected ? 'text-white' : 'text-[#111111]'
                    }`}>
                      {m.title}
                    </h3>

                    <p className={`text-xs sm:text-sm leading-relaxed mb-4 ${
                      isSelected ? 'text-slate-300' : 'text-[#111111]/70'
                    }`}>
                      {m.description}
                    </p>

                    <div className={`pt-3 border-t text-[11px] font-mono flex items-center gap-2 ${
                      isSelected ? 'border-white/10 text-emerald-400' : 'border-[#111111]/10 text-[#0016CB]'
                    }`}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{m.telemetry}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
