import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Route,
  FileText,
  Fuel,
  ShieldCheck,
  Milestone,
  FileCheck2,
  LucideIcon
} from 'lucide-react';

interface CapabilitiesGridProps {
  onLaunchPlanner?: (tab?: string) => void;
}

interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  badge: string;
  tab: string;
}

const CapabilityCard: React.FC<{
  item: ServiceItem;
  index: number;
  onClick: (tab: string) => void;
}> = ({ item, onClick }) => {
  const IconComponent = item.icon;

  return (
    <div
      onClick={() => onClick(item.tab)}
      className="relative p-6 rounded-xl bg-[#19191b] border border-[#232325] hover:border-[#2e2e32] transition-colors group flex flex-col justify-between cursor-pointer"
    >
      <div>
        {/* Header row: Vector Icon & Badge */}
        <div className="flex items-center justify-between mb-5">
          <div className="w-10 h-10 rounded-md bg-[#232325] border border-[#2e2e32] flex items-center justify-center text-blue-400">
            <IconComponent className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#232325] border border-[#2e2e32] text-[#85858b]">
              {item.badge}
            </span>
            <span className="text-xs font-mono text-[#85858b]">
              {item.id}
            </span>
          </div>
        </div>

        {/* Service Title & Subtitle */}
        <h3 className="text-base font-semibold text-[#ededed] mb-0.5 group-hover:text-white transition-colors">
          {item.title}
        </h3>
        <div className="text-xs font-mono text-[#85858b] mb-3">
          {item.subtitle}
        </div>

        {/* Service Description */}
        <p className="text-xs text-[#a1a1a6] leading-relaxed">
          {item.description}
        </p>
      </div>

      {/* Action trigger footer */}
      <div className="pt-5 mt-5 border-t border-[#232325] flex items-center justify-between text-xs font-mono text-[#85858b] group-hover:text-[#ededed] transition-colors">
        <span>View in dispatch workspace</span>
        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
      </div>
    </div>
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

  const services: ServiceItem[] = [
    {
      id: '01',
      title: 'OSRM Route & Rest Engine',
      subtitle: '49 CFR § 395 compliance',
      description: 'Calculates true highway geometry, enforcing 11-hour driving caps, 14-hour on-duty windows, and automatic 10-hour sleeper resets.',
      icon: Route,
      badge: 'CFR § 395.3',
      tab: 'overview'
    },
    {
      id: '02',
      title: 'FMCSA ELD Daily Log Generator',
      subtitle: '24.00h balanced RODS grid',
      description: 'Generates standard FMCSA 24-hour graphical log sheets with midnight day transitions, remarks, totals, and carrier details.',
      icon: FileText,
      badge: 'CFR § 395.8',
      tab: 'logs'
    },
    {
      id: '03',
      title: 'Diesel Fuel Routing Network',
      subtitle: '< 1,000 mile fuel intervals',
      description: 'Automatically detects cumulative driving distance and injects commercial diesel stops before the 1,000-mile tank threshold.',
      icon: Fuel,
      badge: 'Fuel shield',
      tab: 'overview'
    },
    {
      id: '04',
      title: '70-Hour / 8-Day Cycle Tracker',
      subtitle: 'Cumulative on-duty audit',
      description: 'Continuously tracks driver available cycle hours before dispatching multi-day line-hauls, preventing catastrophic cycle violations.',
      icon: ShieldCheck,
      badge: 'Cycle guard',
      tab: 'compliance'
    },
    {
      id: '05',
      title: 'Turn-by-Turn Waypoint Manifest',
      subtitle: 'Interactive Leaflet GIS',
      description: 'Chronological timetable of every leg, inspection break, refueling stop, and rest pause with accurate ETAs and durations.',
      icon: Milestone,
      badge: 'Leaflet GIS',
      tab: 'timeline'
    },
    {
      id: '06',
      title: 'Audit-Ready PDF & Print Export',
      subtitle: 'Level I–III inspection proof',
      description: 'One-click high-resolution PDF download and printable inspection manifests formatted for DOT roadside enforcement officers.',
      icon: FileCheck2,
      badge: 'DOT audit',
      tab: 'logs'
    }
  ];

  return (
    <section id="capabilities-grid" className="relative py-20 bg-[#0f0f10] text-[#ededed] overflow-hidden border-t border-[#232325]">
      {/* Top Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-3 text-xs font-mono text-[#85858b] mb-3">
              <span className="text-[#2563EB] font-medium">02 / 05</span>
              <span>&bull;</span>
              <span className="text-[#a1a1a6]">Core capabilities</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white leading-tight">
              Compliance rules under one engine.
            </h2>
          </div>

          <p className="text-sm text-[#a1a1a6] max-w-md leading-relaxed font-normal">
            Unified dispatch intelligence engineered for commercial interstate logistics, meeting FMCSA statutory property-carrying requirements without manual spreadsheets.
          </p>
        </div>
      </div>

      {/* Semi-Truck Cruise Bar */}
      <div className="relative w-full my-6 py-4 overflow-hidden bg-[#141415] border-y border-[#232325]">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between text-xs font-mono text-[#85858b]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[#a1a1a6]">OSRM cruise active &bull; 60 mph commercial speed cap</span>
          </div>
          <span className="hidden sm:inline">FMCSA 49 CFR Part 395 verified</span>
        </div>
      </div>

      {/* 6-Card Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((item, index) => (
            <CapabilityCard
              key={item.id}
              item={item}
              index={index}
              onClick={handleLaunch}
            />
          ))}
        </div>

        {/* Bottom CTA Button */}
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={() => handleLaunch()}
            className="btn-electric-primary px-5 py-2.5 text-xs font-medium inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Launch compliance workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
