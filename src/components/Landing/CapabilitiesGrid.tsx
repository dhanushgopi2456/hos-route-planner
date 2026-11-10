import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface CapabilitiesGridProps {
  onLaunchPlanner?: (tab?: string) => void;
}

// 3D Card with cursor spotlight component
const CapabilityCard: React.FC<{
  item: {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    icon: string;
    badge: string;
    tab: string;
  };
  index: number;
  onClick: (tab: string) => void;
}> = ({ item, index, onClick }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick(item.tab)}
      className="relative p-8 rounded-none bg-[#0A0A0A] border border-white/10 hover:border-[#0016CB] transition-all duration-300 group flex flex-col justify-between cursor-pointer overflow-hidden shadow-lg"
    >
      {/* Radial Cursor Spotlight */}
      {isHovered && (
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-0"
          style={{
            background: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0, 22, 203, 0.22), transparent 70%)`
          }}
        />
      )}

      <div className="relative z-10">
        {/* Header row: Icon & ID */}
        <div className="flex items-center justify-between mb-8">
          <div className="w-14 h-14 rounded-none bg-white/5 border border-white/15 flex items-center justify-center p-3 group-hover:border-[#0016CB] group-hover:bg-[#0016CB]/15 transition-all">
            <img
              src={item.icon}
              alt={item.title}
              className="w-full h-full object-contain filter invert contrast-200 group-hover:brightness-125 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-none bg-white/5 border border-white/10 text-slate-300">
              {item.badge}
            </span>
            <span className="text-xs font-mono font-bold text-slate-500">
              {item.id}
            </span>
          </div>
        </div>

        {/* Service Title & Subtitle */}
        <h3 className="text-xl font-bold uppercase tracking-tight text-white font-display mb-1 group-hover:text-[#0016CB] transition-colors">
          {item.title}
        </h3>
        <div className="text-xs font-mono text-slate-400 mb-4 uppercase">
          {item.subtitle}
        </div>

        {/* Service Description */}
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          {item.description}
        </p>
      </div>

      {/* Action trigger footer with animated sliding arrow */}
      <div className="pt-8 mt-6 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400 group-hover:text-white transition-colors relative z-10">
        <span className="uppercase tracking-wider font-bold">VIEW IN DISPATCH WORKSPACE</span>
        <motion.div
          animate={{ x: isHovered ? 5 : 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-[#0016CB]" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export const CapabilitiesGrid: React.FC<CapabilitiesGridProps> = ({ onLaunchPlanner }) => {
  const navigate = useNavigate();

  const handleLaunch = (tab?: string) => {
    if (onLaunchPlanner) {
      onLaunchPlanner(tab);
    } else {
      navigate(tab ? `/planner?demo=1&tab=${tab}` : '/planner?demo=1');
    }
  };

  const services = [
    {
      id: '01',
      title: 'OSRM Route & Rest Engine',
      subtitle: '49 CFR § 395 Compliance',
      description: 'Calculates true highway geometry, enforcing 11-hour driving caps, 14-hour on-duty windows, and automatic 10-hour sleeper resets.',
      icon: '/assets/uc/icon_transport.png',
      badge: 'CFR § 395.3',
      tab: 'overview'
    },
    {
      id: '02',
      title: 'FMCSA ELD Daily Log Generator',
      subtitle: '24.00h Balanced RODS Grid',
      description: 'Generates standard FMCSA 24-hour graphical log sheets with midnight day transitions, remarks, totals, and carrier details.',
      icon: '/assets/uc/icon_customs.png',
      badge: 'CFR § 395.8',
      tab: 'logs'
    },
    {
      id: '03',
      title: 'Diesel Fuel Routing Network',
      subtitle: '< 1,000 Mile Fuel Intervals',
      description: 'Automatically detects cumulative driving distance and injects commercial diesel stops before the 1,000-mile tank threshold.',
      icon: '/assets/uc/icon_warehouse.png',
      badge: 'FUEL SHIELD',
      tab: 'overview'
    },
    {
      id: '04',
      title: '70-Hour / 8-Day Cycle Tracker',
      subtitle: 'Cumulative On-Duty Audit',
      description: 'Continuously tracks driver available cycle hours before dispatching multi-day line-hauls, preventing catastrophic cycle violations.',
      icon: '/assets/uc/icon_air_freight.png',
      badge: 'CYCLE GUARD',
      tab: 'compliance'
    },
    {
      id: '05',
      title: 'Turn-by-Turn Waypoint Manifest',
      subtitle: 'Interactive Leaflet Integration',
      description: 'Chronological timetable of every leg, inspection break, refueling stop, and rest pause with accurate ETAs and durations.',
      icon: '/assets/uc/icon_project_cargo.png',
      badge: 'LEAFLET GIS',
      tab: 'timeline'
    },
    {
      id: '06',
      title: 'Audit-Ready PDF & Print Export',
      subtitle: 'Level I–III Inspection Proof',
      description: 'One-click high-resolution PDF download and printable inspection manifests formatted for DOT roadside enforcement officers.',
      icon: '/assets/uc/icon_sea_freight.png',
      badge: 'DOT AUDIT',
      tab: 'logs'
    }
  ];

  return (
    <section id="capabilities-grid" className="relative py-28 bg-[#000000] text-white overflow-hidden border-t border-white/10">
      
      {/* 1. Giant Background Watermark Text (from United Carriers Template) */}
      <div className="absolute top-12 left-0 right-0 overflow-hidden pointer-events-none select-none z-0">
        <div className="text-[120px] sm:text-[180px] lg:text-[230px] font-black uppercase tracking-tighter text-transparent whitespace-nowrap opacity-[0.06] font-display text-stroke-white text-center">
          OUR SERVICES
        </div>
      </div>

      {/* 2. Top Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
          <div>
            <div className="flex items-center gap-3 text-xs font-mono tracking-widest text-slate-400 mb-4">
              <span className="text-[#0016CB] font-bold">02 / 05</span>
              <span>|</span>
              <span className="uppercase tracking-[0.2em] text-white font-bold">CORE CAPABILITIES</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white font-display max-w-3xl leading-[1.02]">
              EVERY COMPLIANCE RULE <br />
              <span className="text-slate-400">UNDER ONE ENGINE.</span>
            </h2>
          </div>

          <p className="text-sm sm:text-base text-slate-400 max-w-md leading-relaxed font-normal">
            Unified dispatch intelligence engineered for commercial interstate logistics, meeting FMCSA statutory property-carrying requirements without manual spreadsheets.
          </p>
        </div>
      </div>

      {/* 3. Horizontal Highway Track with Semi-Truck Gliding Across (Template Feature) */}
      <div className="relative w-full my-8 py-6 overflow-hidden bg-neutral-950/80 border-y border-white/10">
        {/* Road line background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-40">
          <img
            src="/assets/uc/road_line_big.svg"
            alt="Highway road track"
            className="w-full object-cover min-h-[40px]"
          />
        </div>

        {/* Semi-Truck gliding across the road */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center">
          <motion.div
            animate={{
              x: ['-10%', '100%']
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: 'linear'
            }}
            className="relative flex items-center gap-4 select-none pointer-events-none"
          >
            <img
              src="/assets/uc/truck_static.avif"
              alt="Semi-Truck Highway Cruise"
              className="h-16 w-auto object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)]"
            />
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded bg-[#0016CB]/80 border border-[#0016CB] text-white text-[11px] font-mono font-bold whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>OSRM CRUISE // 60 MPH // CFR § 395 COMPLIANT</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 4. 6-Card Services Grid with Spotlight & Working Click Targets */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((item, index) => (
            <CapabilityCard
              key={item.id}
              item={item}
              index={index}
              onClick={handleLaunch}
            />
          ))}
        </div>

        {/* Bottom CTA Button with Spring Hover & Shimmer */}
        <div className="mt-16 text-center">
          <motion.button
            type="button"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => handleLaunch()}
            className="relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#0016CB] hover:bg-[#0014B5] text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 shadow-[0_0_35px_rgba(0,22,203,0.5)] cursor-pointer overflow-hidden group"
          >
            {/* Shimmer line */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '200%' }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 pointer-events-none"
            />
            <span>LAUNCH LIVE COMPLIANCE ENGINE</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </motion.button>
        </div>
      </div>
    </section>
  );
};
