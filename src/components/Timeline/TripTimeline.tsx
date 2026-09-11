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
  CheckCircle2
} from 'lucide-react';

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
    <div className={`bg-white rounded-xl border border-slate-200 shadow-xs p-6 ${className}`}>
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            HOS Trip Timeline &amp; Event Sequence
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Normalized FMCSA event sequence — single source of truth for map, ELD logs, and compliance.
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
          {events.length} Events
        </span>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {events.map((ev, idx) => {
          const start = formatTime(ev.start_time);
          const end = formatTime(ev.end_time);

          return (
            <div key={ev.id || idx} className="relative group">
              {/* Event Icon Pin on Timeline Line */}
              <div
                className={`absolute -left-[30px] top-1 w-6 h-6 rounded-full border-2 border-white shadow-xs flex items-center justify-center text-white ${getEventColor(
                  ev.type,
                  ev.status
                )}`}
              >
                {getEventIcon(ev.type)}
              </div>

              {/* Event Card */}
              <div className="bg-slate-50 hover:bg-slate-100/80 transition-colors border border-slate-200 rounded-lg p-3 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">
                      {getEventTitle(ev.type, ev.reason)}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${getDutyStatusBadge(
                        ev.status
                      )}`}
                    >
                      {ev.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="text-right font-mono font-semibold text-slate-600 text-xs">
                    <span>{start.timePart}</span>
                    <span className="mx-1 text-slate-400">→</span>
                    <span>{end.timePart}</span>
                    <span className="ml-2 font-bold text-blue-700">
                      ({(ev.duration_hours ?? 0).toFixed(2)}h)
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 text-slate-600 mt-2 pt-2 border-t border-slate-200/60">
                  <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{ev.location_name}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {(ev.distance_miles ?? 0) > 0 && (
                      <span className="font-medium text-slate-700">
                        Distance: <strong>{(ev.distance_miles ?? 0).toFixed(1)} mi</strong>
                      </span>
                    )}
                    <span className="text-slate-400">|</span>
                    <span className="text-slate-500">{start.datePart}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

function getEventTitle(type: string, reason: string): string {
  switch (type) {
    case 'DRIVING': return 'CMV Driving Segment';
    case 'PICKUP': return 'Freight Pickup & Bill of Lading (1h)';
    case 'DROPOFF': return 'Freight Delivery & Proof of Dropoff (1h)';
    case 'FUEL': return 'Planned Fuel Stop (30m)';
    case 'REST_BREAK': return '30-Minute Rest Break';
    case 'SLEEPER_BERTH': return '10-Hour Sleeper Berth Daily Reset';
    case 'OFF_DUTY': return reason || 'Off Duty';
    default: return reason || 'Scheduled Activity';
  }
}

function getEventColor(type: string, status: DutyStatus): string {
  switch (type) {
    case 'DRIVING': return 'bg-blue-600';
    case 'PICKUP': return 'bg-emerald-600';
    case 'DROPOFF': return 'bg-rose-600';
    case 'FUEL': return 'bg-amber-500';
    case 'REST_BREAK': return 'bg-purple-600';
    case 'SLEEPER_BERTH': return 'bg-indigo-700';
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
    case 'DRIVING': return 'bg-blue-100 text-blue-800 border border-blue-200';
    case 'ON_DUTY_NOT_DRIVING': return 'bg-amber-100 text-amber-900 border border-amber-200';
    case 'SLEEPER_BERTH': return 'bg-indigo-100 text-indigo-900 border border-indigo-200';
    case 'OFF_DUTY': return 'bg-slate-100 text-slate-800 border border-slate-200';
  }
}
