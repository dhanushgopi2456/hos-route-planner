import React, { useState, useMemo } from 'react';
import { TimelineEvent, DutyStatus } from '../../types/hos';
import {
  Clock,
  MapPin,
  Truck,
  Coffee,
  Moon,
  Fuel,
  Package,
  Flag,
  Calendar,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TripTimelineProps {
  events: TimelineEvent[];
  className?: string;
}

type TimelineFilter = 'ALL' | 'DRIVING' | 'ON_DUTY' | 'REST' | 'FUEL';

export const TripTimeline: React.FC<TripTimelineProps> = ({
  events,
  className = ''
}) => {
  const [activeFilter, setActiveFilter] = useState<TimelineFilter>('ALL');

  const formatTime = (iso: string) => {
    try {
      const d = new Date(iso);
      const datePart = d.toLocaleDateString([], { month: 'short', day: 'numeric' });
      const timePart = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
      return { datePart, timePart };
    } catch {
      return { datePart: '', timePart: iso };
    }
  };

  // Filter events based on active category
  const filteredEvents = useMemo(() => {
    if (activeFilter === 'ALL') return events;
    if (activeFilter === 'DRIVING') {
      return events.filter(e => e.status === 'DRIVING');
    }
    if (activeFilter === 'ON_DUTY') {
      return events.filter(e => e.status === 'ON_DUTY_NOT_DRIVING');
    }
    if (activeFilter === 'REST') {
      return events.filter(e => e.status === 'SLEEPER_BERTH' || e.type === 'REST_BREAK' || e.type === 'SLEEPER_BERTH');
    }
    if (activeFilter === 'FUEL') {
      return events.filter(e => e.type === 'FUEL');
    }
    return events;
  }, [events, activeFilter]);

  const filterOptions: { id: TimelineFilter; label: string; count: number }[] = [
    { id: 'ALL', label: 'All Events', count: events.length },
    { id: 'DRIVING', label: 'Driving', count: events.filter(e => e.status === 'DRIVING').length },
    { id: 'ON_DUTY', label: 'On-Duty (Loading/Inspection)', count: events.filter(e => e.status === 'ON_DUTY_NOT_DRIVING').length },
    { id: 'REST', label: 'Rest & Sleeper', count: events.filter(e => e.status === 'SLEEPER_BERTH' || e.type === 'REST_BREAK' || e.type === 'SLEEPER_BERTH').length },
    { id: 'FUEL', label: 'Diesel Fuel Stops', count: events.filter(e => e.type === 'FUEL').length }
  ];

  return (
    <div className={`uc-card-stark p-6 sm:p-8 ${className}`}>
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-5 mb-6 border-b border-[#242424] gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161616] border border-[#242424] text-[#99A9EE] text-xs font-mono uppercase font-bold tracking-widest mb-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>United Carriers Milestone Tracker</span>
          </div>
          <h3 className="font-bold text-xl text-white font-display flex items-center gap-2 uppercase tracking-tight">
            <span>HOS Duty Schedule &amp; Milestone Timeline</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 font-sans">
            Normalized FMCSA event sequence — single source of truth for highway map, ELD logs, and compliance.
          </p>
        </div>

        {/* Filter Pills with layout animation */}
        <div className="flex items-center gap-1.5 flex-wrap font-mono">
          <span className="text-[11px] text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            <span>Filter:</span>
          </span>
          {filterOptions.map(f => {
            const isSelected = activeFilter === f.id;
            return (
              <motion.button
                key={f.id}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setActiveFilter(f.id)}
                className={`relative px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'btn-uc-solid text-white shadow-md'
                    : 'bg-[#161616] border border-[#242424] text-slate-400 hover:text-white'
                }`}
              >
                <span>{f.label} ({f.count})</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Timeline Milestone Stream with Glowing Vertical Line */}
      <div className="relative pl-7 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-[#0016CB] before:via-[#3346D7] before:to-emerald-500">
        <AnimatePresence mode="popLayout">
          {filteredEvents.map((ev, idx) => {
            const start = formatTime(ev.start_time);
            const end = formatTime(ev.end_time);

            return (
              <motion.div
                key={ev.id || `${ev.start_time}-${idx}`}
                layout
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, delay: Math.min(idx * 0.04, 0.3) }}
                className="relative group"
              >
                {/* Event Icon Pin on the Timeline Line */}
                <div
                  className={`absolute -left-[35px] top-1.5 w-7 h-7 rounded-full border-2 border-black shadow-md flex items-center justify-center text-white ${getEventColor(
                    ev.type,
                    ev.status
                  )} group-hover:scale-110 transition-transform`}
                >
                  {getEventIcon(ev.type)}
                </div>

                {/* Event Milestone Card */}
                <div className="p-4 rounded-sm bg-[#161616] border border-[#242424] hover:border-[#374151] transition-all text-xs space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-white font-display">
                        {getEventTitle(ev.type, ev.reason)}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${getDutyStatusBadge(
                          ev.status
                        )}`}
                      >
                        {ev.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="text-right text-[11px] text-slate-400 font-mono">
                      <span>{start.datePart}</span> &bull; <span>{start.timePart} → {end.timePart}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 font-mono text-[11px] text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      <span className="text-slate-300 font-medium">{ev.location_name}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span>Duration: <strong className="text-white">{ev.duration_hours.toFixed(2)}h</strong></span>
                      {ev.distance_miles !== undefined && ev.distance_miles > 0 && (
                        <span>Distance: <strong className="text-blue-400">{ev.distance_miles.toFixed(1)} mi</strong></span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

function getEventIcon(type: string) {
  switch (type) {
    case 'CURRENT':
    case 'DRIVE':
      return <Truck className="w-3.5 h-3.5" />;
    case 'PICKUP':
      return <Package className="w-3.5 h-3.5" />;
    case 'DROPOFF':
      return <Flag className="w-3.5 h-3.5" />;
    case 'FUEL':
      return <Fuel className="w-3.5 h-3.5" />;
    case 'REST_BREAK':
      return <Coffee className="w-3.5 h-3.5" />;
    case 'SLEEPER_BERTH':
      return <Moon className="w-3.5 h-3.5" />;
    default:
      return <Clock className="w-3.5 h-3.5" />;
  }
}

function getEventColor(type: string, status: DutyStatus) {
  if (type === 'FUEL') return 'bg-amber-500';
  if (type === 'REST_BREAK') return 'bg-purple-500';
  if (type === 'SLEEPER_BERTH') return 'bg-indigo-600';
  if (type === 'PICKUP') return 'bg-emerald-500';
  if (type === 'DROPOFF') return 'bg-rose-500';

  switch (status) {
    case 'DRIVING':
      return 'bg-[#0016CB]';
    case 'ON_DUTY_NOT_DRIVING':
      return 'bg-amber-500';
    case 'SLEEPER_BERTH':
      return 'bg-indigo-600';
    case 'OFF_DUTY':
    default:
      return 'bg-slate-700';
  }
}

function getDutyStatusBadge(status: DutyStatus) {
  switch (status) {
    case 'DRIVING':
      return 'bg-[#0016CB]/20 text-blue-300 border-[#0016CB]/40';
    case 'ON_DUTY_NOT_DRIVING':
      return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
    case 'SLEEPER_BERTH':
      return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
    case 'OFF_DUTY':
    default:
      return 'bg-slate-800 text-slate-300 border-slate-700';
  }
}

function getEventTitle(type: string, reason?: string) {
  if (reason) return reason;
  switch (type) {
    case 'CURRENT':
      return 'Pre-Trip Vehicle & Cargo Inspection (1.0h)';
    case 'DRIVE':
      return 'Interstate Line-Haul Highway Leg';
    case 'PICKUP':
      return 'Shipper Terminal Loading & Verification (1.0h)';
    case 'DROPOFF':
      return 'Consignee Delivery Unloading & Post-Trip (1.0h)';
    case 'FUEL':
      return 'Commercial Diesel Fueling Stop (30m)';
    case 'REST_BREAK':
      return 'Mandatory 30-Minute Rest Break';
    case 'SLEEPER':
      return '10-Hour Sleeper Berth Daily Rest & Reset';
    default:
      return 'Scheduled Trip Event';
  }
}
