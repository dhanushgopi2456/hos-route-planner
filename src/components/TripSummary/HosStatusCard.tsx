import React from 'react';
import { TripPlanResponse } from '../../types/hos';
import { Truck, Clock, Calendar, Gauge, ShieldCheck, Fuel, Moon, Coffee } from 'lucide-react';
import { motion } from 'motion/react';

interface HosStatusCardProps {
  tripData: TripPlanResponse;
  className?: string;
}

export const HosStatusCard: React.FC<HosStatusCardProps> = ({
  tripData,
  className = ''
}) => {
  const { trip, hos, daily_logs, stops } = tripData;

  const fuelStopsCount = stops ? stops.filter(s => s.type === 'FUEL').length : 0;
  const sleeperStopsCount = stops ? stops.filter(s => s.type === 'SLEEPER').length : 0;
  const breakStopsCount = stops ? stops.filter(s => s.type === 'REST_BREAK').length : 0;

  const cycleUsedValue = hos?.current_cycle_used ?? hos?.cycle_used_after_trip ?? 0;
  const cycleRemainingValue = hos?.cycle_hours_remaining ?? hos?.cycle_remaining ?? Math.max(0, 70 - cycleUsedValue);
  const cyclePercent = Math.min(100, Math.round((cycleUsedValue / 70) * 100));

  const distanceMiles = trip?.distance_miles ?? 0;
  const drivingHours = trip?.driving_hours ?? 0;
  const totalDurationHours = trip?.total_duration_hours ?? 0;
  const dailyLogsCount = daily_logs?.length ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-md p-6 ${className}`}
    >
      {/* Top Header Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-5 mb-5 border-b border-slate-100">
        <motion.div
          whileHover={{ y: -2 }}
          className="p-3 bg-slate-50/80 border border-slate-200/60 rounded-xl"
        >
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Total Distance
          </span>
          <div className="text-2xl font-black text-slate-900 font-mono mt-0.5">
            {distanceMiles.toFixed(0)}{' '}
            <span className="text-xs font-normal text-slate-500">mi</span>
          </div>
          <span className="text-[11px] text-slate-500">
            Road routed highway
          </span>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl"
        >
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 block">
            Driving Time
          </span>
          <div className="text-2xl font-black text-blue-600 font-mono mt-0.5">
            {drivingHours.toFixed(1)}{' '}
            <span className="text-xs font-normal text-slate-500">hrs</span>
          </div>
          <span className="text-[11px] text-slate-500">
            @ avg ~60 mph
          </span>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="p-3 bg-slate-50/80 border border-slate-200/60 rounded-xl"
        >
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Elapsed Trip Duration
          </span>
          <div className="text-2xl font-black text-slate-900 font-mono mt-0.5">
            {totalDurationHours.toFixed(1)}{' '}
            <span className="text-xs font-normal text-slate-500">hrs</span>
          </div>
          <span className="text-[11px] text-slate-500">
            Inc. stops &amp; sleep
          </span>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl"
        >
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 block">
            ELD Daily Logs
          </span>
          <div className="text-2xl font-black text-emerald-600 font-mono mt-0.5">
            {dailyLogsCount}{' '}
            <span className="text-xs font-normal text-slate-500">
              {dailyLogsCount === 1 ? 'day' : 'days'}
            </span>
          </div>
          <span className="text-[11px] text-emerald-700 font-medium">
            24.00h balanced
          </span>
        </motion.div>
      </div>

      {/* 4 HOS Regulatory Clock Gauges with Animated Progress Bars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {/* Gauge 1: 11-Hour Driving Limit */}
        <div className="bg-slate-50/90 border border-slate-200 rounded-xl p-3.5">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="font-bold text-slate-800">11-Hour Drive Limit</span>
            <span className="font-mono font-bold text-slate-900">
              {Math.min(11, drivingHours).toFixed(1)} / 11.0h
            </span>
          </div>
          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden mb-1.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (Math.min(11, drivingHours) / 11) * 100)}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full shadow-xs"
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>Reset with 10h rest</span>
            <span className="text-emerald-700 font-semibold">Compliant</span>
          </div>
        </div>

        {/* Gauge 2: 14-Hour Window */}
        <div className="bg-slate-50/90 border border-slate-200 rounded-xl p-3.5">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="font-bold text-slate-800">14-Hour Duty Window</span>
            <span className="font-mono font-bold text-slate-900">Enforced</span>
          </div>
          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden mb-1.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="bg-gradient-to-r from-indigo-500 to-indigo-700 h-full rounded-full shadow-xs"
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>Non-extendable</span>
            <span className="text-emerald-700 font-semibold">Protected</span>
          </div>
        </div>

        {/* Gauge 3: 30-Minute Break */}
        <div className="bg-slate-50/90 border border-slate-200 rounded-xl p-3.5">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="font-bold text-slate-800">30-Min Rest Break</span>
            <span className="font-mono font-bold text-slate-900">
              {breakStopsCount} scheduled
            </span>
          </div>
          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden mb-1.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="bg-gradient-to-r from-purple-500 to-purple-700 h-full rounded-full shadow-xs"
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>Every 8h driving</span>
            <span className="text-emerald-700 font-semibold">Inserted</span>
          </div>
        </div>

        {/* Gauge 4: 70-Hour / 8-Day Cycle */}
        <div className="bg-slate-50/90 border border-slate-200 rounded-xl p-3.5">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="font-bold text-slate-800">70h / 8d Cycle Used</span>
            <span className="font-mono font-bold text-slate-900">
              {cycleUsedValue.toFixed(1)} / 70.0h
            </span>
          </div>
          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden mb-1.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${cyclePercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className={`h-full rounded-full transition-all ${
                cyclePercent > 85
                  ? 'bg-rose-500'
                  : cyclePercent > 65
                  ? 'bg-amber-500'
                  : 'bg-gradient-to-r from-blue-500 to-blue-700'
              }`}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>{cycleRemainingValue.toFixed(1)}h remaining</span>
            <span className="font-mono font-bold text-slate-700">{cyclePercent}%</span>
          </div>
        </div>
      </div>

      {/* Stop Badges Summary */}
      <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100 text-xs">
        <span className="font-bold text-slate-700 mr-1">Scheduled Stops:</span>
        <motion.span
          whileHover={{ scale: 1.05 }}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200/80 font-semibold cursor-default"
        >
          <Fuel className="w-3.5 h-3.5 text-amber-600" />
          {fuelStopsCount} Fuel Stop{fuelStopsCount !== 1 ? 's' : ''} (&le; 1,000 mi)
        </motion.span>
        <motion.span
          whileHover={{ scale: 1.05 }}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-800 border border-indigo-200/80 font-semibold cursor-default"
        >
          <Moon className="w-3.5 h-3.5 text-indigo-600" />
          {sleeperStopsCount} Sleeper Berth (10h each)
        </motion.span>
        <motion.span
          whileHover={{ scale: 1.05 }}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-800 border border-purple-200/80 font-semibold cursor-default"
        >
          <Coffee className="w-3.5 h-3.5 text-purple-600" />
          {breakStopsCount} Rest Break{breakStopsCount !== 1 ? 's' : ''} (30 min)
        </motion.span>
      </div>
    </motion.div>
  );
};
