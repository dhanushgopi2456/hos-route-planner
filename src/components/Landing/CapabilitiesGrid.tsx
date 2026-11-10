import React from 'react';
import { motion } from 'motion/react';
import {
  MapPin,
  Clock,
  Fuel,
  FileText,
  Navigation,
  ArrowRight,
  Moon,
  Coffee,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CapabilitiesGridProps {
  onLaunchPlanner?: () => void;
}

export const CapabilitiesGrid: React.FC<CapabilitiesGridProps> = ({ onLaunchPlanner }) => {
  const navigate = useNavigate();

  const handleLaunch = () => {
    if (onLaunchPlanner) {
      onLaunchPlanner();
    } else {
      navigate('/planner');
    }
  };

  const capabilities = [
    {
      number: '01',
      title: 'OSRM Commercial Route Mapping',
      badge: 'HIGHWAY GEOMETRY',
      description:
        'Calculates real road coordinates and highway network distance using high-performance OSRM routing. Visualizes complete origin, pickup, fuel stops, and dropoff corridors with interactive Leaflet zoom and live mileage telemetry.',
      icon: Navigation,
      tags: ['OSRM Routing Engine', 'Turn-by-Turn Geometry', 'Multi-Leg Polylines'],
      visual: (
        <div className="h-36 rounded-xl bg-[#080D1A] border border-slate-800 p-3 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-mesh opacity-30" />
          <div className="relative z-10 flex items-center justify-between text-[11px] font-mono">
            <span className="text-blue-400 font-bold flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Origin → Pickup → Dropoff
            </span>
            <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              OSRM Verified
            </span>
          </div>
          {/* Simulated highway graphic */}
          <div className="relative z-10 flex items-center justify-between py-2 px-1">
            <div className="text-center">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold mx-auto">
                A
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Origin</span>
            </div>
            <div className="flex-1 h-[2px] bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-600 mx-2 relative">
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-cyan-300 shadow-sm shadow-cyan-300 animate-ping" />
            </div>
            <div className="text-center">
              <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[10px] font-bold mx-auto">
                P
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Pickup</span>
            </div>
            <div className="flex-1 h-[2px] bg-gradient-to-r from-amber-500 to-emerald-500 mx-2" />
            <div className="text-center">
              <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold mx-auto">
                D
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Dropoff</span>
            </div>
          </div>
          <div className="relative z-10 text-[10px] font-mono text-slate-400 flex justify-between">
            <span>Average Speed: 60 MPH</span>
            <span className="text-blue-300 font-bold">Zero Straight-Line Math</span>
          </div>
        </div>
      )
    },
    {
      number: '02',
      title: 'Automated HOS Duty Scheduling',
      badge: 'FMCSA 49 CFR § 395',
      description:
        'Enforces the 11-hour driving limit, 14-hour consecutive on-duty window, mandatory 30-minute rest break after 8 hours of cumulative driving, and required 10-hour sleeper berth or off-duty resets before continuing.',
      icon: Clock,
      tags: ['11h Driving Cap', '14h Duty Window', '10h Sleeper Reset'],
      visual: (
        <div className="h-36 rounded-xl bg-[#080D1A] border border-slate-800 p-3 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-amber-400 font-bold flex items-center gap-1">
              <Clock className="w-3 h-3" /> Duty Clocks Active
            </span>
            <span className="text-slate-300 bg-slate-800 px-2 py-0.5 rounded text-[10px]">
              Property-Carrying
            </span>
          </div>
          <div className="space-y-1.5 my-auto">
            <div>
              <div className="flex justify-between text-[10px] font-mono mb-0.5">
                <span className="text-slate-400">Driving Limit (11.0h max)</span>
                <span className="text-blue-400 font-bold">8.5h used / 2.5h rem</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '77%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[10px] font-mono mb-0.5">
                <span className="text-slate-400">Duty Window (14.0h max)</span>
                <span className="text-amber-400 font-bold">11.0h used / 3.0h rem</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '78%' }} />
              </div>
            </div>
          </div>
          <div className="text-[10px] font-mono text-emerald-400 flex items-center justify-between">
            <span>Mandatory 30m break scheduled</span>
            <span className="bg-emerald-500/20 px-1.5 py-0.5 rounded">0 Violations</span>
          </div>
        </div>
      )
    },
    {
      number: '03',
      title: 'Smart Fuel & Rest Stop Orchestration',
      badge: 'INTERVAL ORCHESTRATION',
      description:
        'Automatically injects commercial diesel fueling stops before 1,000 miles of travel. Schedules mandatory 1-hour dwell times for initial pickup loading and final dropoff unloading, accurately tracking on-duty not driving time.',
      icon: Fuel,
      tags: ['1,000-Mi Fuel Stops', '1h Loading / Unloading', 'Split-Sleeper Aware'],
      visual: (
        <div className="h-36 rounded-xl bg-[#080D1A] border border-slate-800 p-3 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-cyan-400 font-bold flex items-center gap-1">
              <Fuel className="w-3 h-3" /> Stop Injection Logic
            </span>
            <span className="text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/30 text-[10px]">
              Smart Interval
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 my-auto">
            <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 text-center">
              <Coffee className="w-3.5 h-3.5 text-amber-400 mx-auto mb-1" />
              <div className="text-[10px] font-bold text-slate-200">30-Min Rest</div>
              <div className="text-[9px] text-slate-400">@ 8h Drive</div>
            </div>
            <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 text-center">
              <Fuel className="w-3.5 h-3.5 text-blue-400 mx-auto mb-1" />
              <div className="text-[10px] font-bold text-slate-200">Fuel Stop</div>
              <div className="text-[9px] text-slate-400">&lt; 1,000 Mi</div>
            </div>
            <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 text-center">
              <Moon className="w-3.5 h-3.5 text-purple-400 mx-auto mb-1" />
              <div className="text-[10px] font-bold text-slate-200">10h Sleep</div>
              <div className="text-[9px] text-slate-400">Full Reset</div>
            </div>
          </div>
          <div className="text-[10px] font-mono text-slate-400 flex justify-between">
            <span>Pickup: 1.0h On-Duty</span>
            <span>Dropoff: 1.0h On-Duty</span>
          </div>
        </div>
      )
    },
    {
      number: '04',
      title: 'Electronic Daily Log (ELD) Generator',
      badge: 'CFR § 395.8 RODS',
      description:
        'Generates pixel-perfect 24-hour graph-grid log sheets for each calendar day of the trip. Accurately plots continuous duty-status polylines across Off-Duty, Sleeper Berth, Driving, and On-Duty with midnight splits, remarks, and PDF exports.',
      icon: FileText,
      tags: ['24-Hour Grid Polylines', 'Midnight Auto-Splits', 'PDF & Print Ready'],
      visual: (
        <div className="h-36 rounded-xl bg-[#080D1A] border border-slate-800 p-2.5 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <FileText className="w-3 h-3" /> RODS 24-Hour Grid
            </span>
            <span className="text-emerald-300 bg-emerald-500/20 px-1.5 py-0.5 rounded text-[10px] font-bold">
              24.00h BALANCED
            </span>
          </div>
          {/* Simulated 4-line ELD graph */}
          <div className="my-auto py-1 border border-slate-800 rounded bg-slate-950/70 p-1.5 space-y-1">
            <div className="flex items-center text-[9px] font-mono text-slate-400">
              <span className="w-14 truncate">1. Off Duty</span>
              <div className="flex-1 h-1.5 bg-slate-800/60 rounded relative">
                <div className="absolute left-0 w-1/3 h-full bg-slate-500 rounded" />
              </div>
              <span className="w-10 text-right">8.0h</span>
            </div>
            <div className="flex items-center text-[9px] font-mono text-slate-400">
              <span className="w-14 truncate">2. Sleeper</span>
              <div className="flex-1 h-1.5 bg-slate-800/60 rounded relative">
                <div className="absolute left-1/3 w-1/4 h-full bg-purple-500 rounded" />
              </div>
              <span className="w-10 text-right">6.0h</span>
            </div>
            <div className="flex items-center text-[9px] font-mono text-slate-400">
              <span className="w-14 truncate">3. Driving</span>
              <div className="flex-1 h-1.5 bg-slate-800/60 rounded relative">
                <div className="absolute left-[58%] w-1/3 h-full bg-blue-500 rounded" />
              </div>
              <span className="w-10 text-right">8.0h</span>
            </div>
            <div className="flex items-center text-[9px] font-mono text-slate-400">
              <span className="w-14 truncate">4. On Duty</span>
              <div className="flex-1 h-1.5 bg-slate-800/60 rounded relative">
                <div className="absolute right-0 w-1/12 h-full bg-amber-500 rounded" />
              </div>
              <span className="w-10 text-right">2.0h</span>
            </div>
          </div>
          <div className="text-[10px] font-mono text-slate-400 flex justify-between">
            <span>Day 1 of 2</span>
            <span className="text-blue-400 font-bold">Print &amp; PDF Export</span>
          </div>
        </div>
      )
    }
  ];

  return (
    <section id="features" className="relative py-24 bg-[#000000]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-widest font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full-Stack Freight Dispatch Architecture</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-white tracking-tight font-display">
              Everything your haul needs.{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Under one roof.
              </span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Replacing fragmented dispatch spreadsheets, paper logbooks, and map guess-work with an automated, auditable HOS compliance engine.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLaunch}
            className="btn-uc-solid px-6 py-3 text-xs sm:text-sm inline-flex items-center gap-2 self-start md:self-auto cursor-pointer shadow-[0_0_20px_rgba(0,22,203,0.4)] font-mono"
          >
            <span>Launch Planner Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {capabilities.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4 }}
                className="uc-glass-card rounded-2xl p-7 relative group flex flex-col justify-between space-y-6"
              >
                {/* Header row: Number & Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-black font-mono text-blue-500/60 group-hover:text-blue-400 transition-colors">
                      {item.number}
                    </span>
                    <span className="text-[11px] font-mono font-bold tracking-wider px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700/80">
                      {item.badge}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                {/* Title & Copy */}
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-white font-display group-hover:text-blue-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Embedded Mini-Visual */}
                <div>{item.visual}</div>

                {/* Tags Pill Row */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/80">
                  {item.tags.map(t => (
                    <span
                      key={t}
                      className="text-[11px] font-mono text-slate-400 bg-slate-900/90 px-2.5 py-1 rounded-full border border-slate-800 flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3 h-3 text-blue-400" />
                      <span>{t}</span>
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
