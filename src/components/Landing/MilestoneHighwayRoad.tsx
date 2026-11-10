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
      tag: '14-hour on-duty window',
      icon: Clock,
      description: 'The driver logs 1.0 hour On-Duty (Not Driving) for pre-trip vehicle and cargo inspection. This officially starts the consecutive 14-hour duty clock under FMCSA 49 CFR § 395.3(a)(2).',
      telemetry: 'Baseline set • 14.0h duty window active • 0 mi traveled'
    },
    {
      step: '02',
      title: 'OSRM Highway Geometry & Diesel Refueling',
      tag: '< 1,000-mile fuel interval',
      icon: Fuel,
      description: 'Real interstate corridors are computed with accurate speed telemetry. If any single leg or cumulative route exceeds 1,000 miles, the engine automatically schedules a 0.5-hour commercial diesel fuel stop.',
      telemetry: 'Commercial diesel inserted • Fuel reserve protected'
    },
    {
      step: '03',
      title: 'Mandatory 30-Min Rest & 10-Hr Sleeper Reset',
      tag: '49 CFR § 395.3(a)(3) rest enforcement',
      icon: CheckCircle2,
      description: 'Before cumulative driving reaches 8.0 hours without a break, a 30-minute off-duty rest interval is enforced. When driving hits 11.0 hours or 14.0 hours duty, a mandatory 10.0-hour sleeper berth reset is scheduled.',
      telemetry: '30m break inserted • 10.0h sleeper berth reset applied'
    },
    {
      step: '04',
      title: 'Consignee Delivery & 24.00h Balanced RODS',
      tag: 'FMCSA 24.00h balanced log sheet',
      icon: FileCheck2,
      description: '1.0 hour On-Duty is allocated for post-trip inspection and consignee dropoff unloading. The system compiles every duty status segment into a balanced 24.00-hour graphical log sheet with remarks and recap.',
      telemetry: 'Midnight day rollovers • Exactly 24.00h per day • Audit-ready'
    }
  ];

  return (
    <section id="milestones" className="relative py-20 bg-[#FFFFFF] text-[#111111] overflow-hidden border-t border-[#111111]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Section Breadcrumb */}
        <div className="flex items-center gap-3 text-xs font-mono text-[#111111]/60 mb-4">
          <span className="text-[#1D4ED8] font-medium">03 / 05</span>
          <span>&bull;</span>
          <span>Operational milestones</span>
          <span>&bull;</span>
          <span className="text-[#1D4ED8]">FMCSA audit architecture</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Column: Headline and intro */}
          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#111111] leading-tight">
              Reliability at every milestone.
            </h2>

            <p className="text-sm sm:text-base text-[#111111]/75 max-w-md leading-relaxed font-normal">
              From terminal departure to consignee delivery, every second of driver duty, continuous line-haul, diesel refueling, and sleeper berth rest is mapped and verified.
            </p>

            {/* Quick Status Box */}
            <div className="p-3.5 rounded-lg bg-[#111111]/5 border-l-2 border-[#1D4ED8] space-y-1">
              <div className="flex items-center justify-between text-xs font-mono font-medium text-[#111111]">
                <span>Corridor simulation</span>
                <span className="text-[#1D4ED8]">Active</span>
              </div>
              <p className="text-xs text-[#111111]/70 leading-relaxed">
                Zero roadside violations, zero driving-over-hours citations, and guaranteed 24.00-hour log compliance.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => handleLaunch(true)}
                className="btn-electric-primary px-5 py-2.5 text-xs font-medium inline-flex items-center gap-2 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Test route dispatch</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Column: Highway Road & Milestones */}
          <div className="lg:col-span-7 relative">
            
            {/* The Vertical Highway Road track */}
            <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-16 sm:w-20 bg-[#111111] rounded-t-xl flex flex-col items-center justify-between py-6 overflow-hidden z-0">
              {/* White Dashed Center-line */}
              <div 
                className="w-1 h-full opacity-60"
                style={{
                  backgroundImage: 'linear-gradient(to bottom, #FFFFFF 50%, transparent 50%)',
                  backgroundSize: '100% 28px'
                }}
              />

              {/* Waypoint Marker traveling down track */}
              <motion.div
                animate={{
                  top: `${14 + activeMilestone * 24}%`
                }}
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                className="absolute left-1/2 -translate-x-1/2 z-20 pointer-events-none"
              >
                <div className="w-3.5 h-3.5 rounded-full bg-[#1D4ED8] border-2 border-white flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-white" />
                </div>
              </motion.div>
            </div>

            {/* Sequential Milestones */}
            <div className="relative z-10 pl-20 sm:pl-28 space-y-6 sm:space-y-8">
              {milestones.map((m, index) => {
                const isSelected = activeMilestone === index;

                return (
                  <div
                    key={m.step}
                    onClick={() => setActiveMilestone(index)}
                    className={`relative p-5 sm:p-6 rounded-lg border transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#19191b] text-white border-[#1D4ED8] shadow-md'
                        : 'bg-white text-[#111111] border-[#111111]/15 hover:border-[#111111]/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded ${
                        isSelected 
                          ? 'bg-[#1D4ED8] text-white' 
                          : 'bg-[#111111]/5 text-[#111111]'
                      }`}>
                        {m.tag}
                      </span>
                      <span className={`text-xs font-mono font-medium ${isSelected ? 'text-blue-400' : 'text-[#111111]/40'}`}>
                        {m.step}
                      </span>
                    </div>

                    <h3 className={`text-sm sm:text-base font-semibold mb-1.5 ${
                      isSelected ? 'text-white' : 'text-[#111111]'
                    }`}>
                      {m.title}
                    </h3>

                    <p className={`text-xs leading-relaxed mb-3 ${
                      isSelected ? 'text-[#a1a1a6]' : 'text-[#111111]/70'
                    }`}>
                      {m.description}
                    </p>

                    <div className={`pt-2.5 border-t text-[11px] font-mono flex items-center gap-2 ${
                      isSelected ? 'border-white/10 text-emerald-400' : 'border-[#111111]/10 text-[#1D4ED8]'
                    }`}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{m.telemetry}</span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
