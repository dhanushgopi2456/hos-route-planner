import React from 'react';
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
  Calendar
} from 'lucide-react';
import { motion } from 'motion/react';

interface TripTimelineProps {
  events: TimelineEvent[];
  className?: string;
}

export const TripTimeline: React.FC<TripTimelineProps> = ({
  events,
  className = ''
}) => {
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

  return (
    <div className={`uc-glass-card rounded-2xl p-6 sm:p-8 ${className}`}>
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between pb-5 mb-6 border-b border-slate-800 gap-3">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono uppercase font-bold tracking-widest mb-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>United Carriers Milestone Tracker</span>
          </div>
          <h3 className="font-bold text-xl text-white font-display flex items-center gap-2">
            <span>HOS Duty Schedule &amp; Milestone Timeline</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 font-sans">
            Normalized FMCSA event sequence — single source of truth for highway map, ELD logs, and compliance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-slate-900 text-slate-300 border border-slate-700">
            {events.length} Events Total
          </span>
        </div>
      </div>

      {/* Timeline Milestone Stream */}
      <div className="relative pl-7 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-blue-600 before:via-cyan-500 before:to-emerald-500">
        {events.map((ev, idx) => {
          const start = formatTime(ev.start_time);
          const end = formatTime(ev.end_time);

          return (
            <motion.div
              key={ev.id || idx}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: Math.min(idx * 0.05, 0.4) }}
              className="relative group"
            >
              {/* Event Icon Pin on the Timeline Line */}
              <div
                className={`absolute -left-[35px] top-1.5 w-7 h-7 rounded-full border-2 border-slate-900 shadow-md flex items-center justify-center text-white ${getEventColor(
                  ev.type,
                  ev.status
                )} group-hover:scale-110 transition-transform`}
              >
                {getEventIcon(ev.type)}
              </div>

              {/* Event Milestone Card */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all text-xs space-y-2 group-hover:shadow-lg group-hover:shadow-blue-500/5">
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

                  {/* Timestamps */}
                  <div className="text-right font-mono font-semibold text-slate-300 text-xs">
                    <span>{start.timePart}</span>
                    <span className="mx-1.5 text-slate-500">→</span>
                    <span>{end.timePart}</span>
                    <span className="ml-2 font-bold text-blue-400">
                      ({(ev.duration_hours ?? 0).toFixed(2)}h)
                    </span>
                  </div>
                </div>

                {/* Subtitle & Location */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-slate-400 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center gap-1.5 text-slate-200 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>{ev.location_name}</span>
                  </div>

                  <div className="flex items-center gap-3 font-mono text-[11px]">
                    {(ev.distance_miles ?? 0) > 0 && (
                      <span className="text-slate-300">
                        Distance: <strong className="text-white">{(ev.distance_miles ?? 0).toFixed(1)} mi</strong>
                      </span>
                    )}
                    <span className="text-slate-600">|</span>
                    <span className="text-cyan-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{start.datePart}</span>
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

function getEventTitle(type: string, reason: string): string {
  switch (type) {
    case 'DRIVING': return 'CMV Driving Highway Leg';
    case 'PICKUP': return 'Freight Pickup Loading & Inspection (1h)';
    case 'DROPOFF': return 'Freight Delivery & Unloading (1h)';
    case 'FUEL': return 'Commercial Diesel Fuel Stop (30m)';
    case 'REST_BREAK': return 'Mandatory 30-Minute Rest Break';
    case 'SLEEPER_BERTH': return '10-Hour Sleeper Berth Daily Reset';
    case 'OFF_DUTY': return reason || 'Off Duty';
    default: return reason || 'Scheduled Activity';
  }
}

function getEventColor(type: string, status: DutyStatus): string {
  switch (type) {
    case 'DRIVING': return 'bg-blue-600 ring-2 ring-blue-500/50';
    case 'PICKUP': return 'bg-emerald-600 ring-2 ring-emerald-500/50';
    case 'DROPOFF': return 'bg-rose-600 ring-2 ring-rose-500/50';
    case 'FUEL': return 'bg-amber-500 ring-2 ring-amber-400/50';
    case 'REST_BREAK': return 'bg-purple-600 ring-2 ring-purple-400/50';
    case 'SLEEPER_BERTH': return 'bg-indigo-600 ring-2 ring-indigo-400/50';
    default: return 'bg-slate-600';
  }
}

function getEventIcon(type: string): React.ReactNode {
  switch (type) {
    case 'DRIVING': return <Truck className="w-3.5 h-3.5" />;
    case 'PICKUP': return <Package className="w-3.5 h-3.5" />;
    case 'DROPOFF': return <Flag className="w-3.5 h-3.5" />;
    case 'FUEL': return <Fuel className="w-3.5 h-3.5" />;
    case 'REST_BREAK': return <Coffee className="w-3.5 h-3.5" />;
    case 'SLEEPER_BERTH': return <Moon className="w-3.5 h-3.5" />;
    default: return <Clock className="w-3.5 h-3.5" />;
  }
}

function getDutyStatusBadge(status: DutyStatus): string {
  switch (status) {
    case 'DRIVING': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    case 'ON_DUTY_NOT_DRIVING': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    case 'SLEEPER_BERTH': return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
    case 'OFF_DUTY': return 'bg-slate-800 text-slate-400 border-slate-700';
  }
}
