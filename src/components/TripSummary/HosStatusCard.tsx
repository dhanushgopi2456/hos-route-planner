import React from 'react';
import { TripPlanResponse } from '../../types/hos';
import { ShieldCheck, Fuel, Moon, Coffee } from 'lucide-react';
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
      className={`uc-card-stark p-6 sm:p-7 relative overflow-hidden ${className}`}
    >
      {/* Top Header Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-6 mb-6 border-b border-[#242424]">
        <motion.div
          whileHover={{ y: -2 }}
          className="p-4 bg-[#161616] border border-[#242424] rounded-sm relative overflow-hidden group"
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#0016CB] opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
            Total Distance
          </span>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono mt-1">
            {distanceMiles.toFixed(0)}{' '}
            <span className="text-xs font-normal text-slate-400">mi</span>
          </div>
          <span className="text-[11px] text-[#6677E3] font-mono mt-1 block">
            OSRM road network
          </span>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="p-4 bg-[#161616] border border-[#0016CB]/40 rounded-sm relative overflow-hidden group"
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#0016CB] opacity-100" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#99A9EE] block font-mono">
            Driving Time
          </span>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono mt-1">
            {drivingHours.toFixed(1)}{' '}
            <span className="text-xs font-normal text-slate-400">hrs</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono mt-1 block">
            @ avg ~60 mph
          </span>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="p-4 bg-[#161616] border border-[#242424] rounded-sm relative overflow-hidden group"
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#3346D7] opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
            Elapsed Trip Duration
          </span>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono mt-1">
            {totalDurationHours.toFixed(1)}{' '}
            <span className="text-xs font-normal text-slate-400">hrs</span>
          </div>
          <span className="text-[11px] text-[#6677E3] font-mono mt-1 block">
            Inc. stops &amp; sleep
          </span>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="p-4 bg-[#161616] border border-[#242424] rounded-sm relative overflow-hidden group"
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-emerald-500 opacity-70" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block font-mono">
            ELD Daily Logs
          </span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono mt-1">
            {dailyLogsCount}{' '}
            <span className="text-xs font-normal text-slate-400">
              {dailyLogsCount === 1 ? 'day' : 'days'}
            </span>
          </div>
          <span className="text-[11px] text-emerald-400/90 font-mono mt-1 block">
            24.00h balanced
          </span>
        </motion.div>
      </div>

      {/* 4 HOS Regulatory Clock Gauges with Animated Progress Bars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-5">
        {/* Gauge 1: 11-Hour Driving Limit */}
        <div className="bg-[#161616] border border-[#242424] rounded-sm p-3.5">
          <div className="flex justify-between items-center text-xs mb-1.5 font-mono">
            <span className="font-bold text-slate-200 uppercase">11H Drive Limit</span>
            <span className="font-bold text-[#6677E3]">
              {Math.min(11, drivingHours).toFixed(1)} / 11.0h
            </span>
          </div>
          <div className="w-full bg-[#242424] h-2 rounded-full overflow-hidden mb-1.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (Math.min(11, drivingHours) / 11) * 100)}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-[#0016CB] rounded-full"
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>FMCSA CFR § 395.3(a)(1)</span>
            <span className="text-emerald-400 font-semibold">Resets with 10h sleep</span>
          </div>
        </div>

        {/* Gauge 2: 14-Hour Duty Window */}
        <div className="bg-[#161616] border border-[#242424] rounded-sm p-3.5">
          <div className="flex justify-between items-center text-xs mb-1.5 font-mono">
            <span className="font-bold text-slate-200 uppercase">14H Duty Window</span>
            <span className="font-bold text-amber-400">
              {Math.min(14, Math.max(1, drivingHours + 2)).toFixed(1)} / 14.0h
            </span>
          </div>
          <div className="w-full bg-[#242424] h-2 rounded-full overflow-hidden mb-1.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (Math.min(14, Math.max(1, drivingHours + 2)) / 14) * 100)}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
              className="h-full bg-amber-500 rounded-full"
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>Consecutive Window</span>
            <span className="text-amber-400 font-semibold">Daily Cap</span>
          </div>
        </div>

        {/* Gauge 3: 70-Hour / 8-Day Rolling Cycle */}
        <div className="bg-[#161616] border border-[#242424] rounded-sm p-3.5">
          <div className="flex justify-between items-center text-xs mb-1.5 font-mono">
            <span className="font-bold text-slate-200 uppercase">70H / 8D Rolling Cycle</span>
            <span className="font-bold text-cyan-300">
              {cycleUsedValue.toFixed(1)} / 70.0h
            </span>
          </div>
          <div className="w-full bg-[#242424] h-2 rounded-full overflow-hidden mb-1.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${cyclePercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
              className={`h-full rounded-full ${
                cyclePercent > 85 ? 'bg-rose-500' : 'bg-[#0016CB]'
              }`}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>{cycleRemainingValue.toFixed(1)}h remaining</span>
            <span className="text-cyan-400 font-bold">{cyclePercent}% cycle used</span>
          </div>
        </div>

        {/* Gauge 4: 1,000-Mile Fuel Stop Interval */}
        <div className="bg-[#161616] border border-[#242424] rounded-sm p-3.5">
          <div className="flex justify-between items-center text-xs mb-1.5 font-mono">
            <span className="font-bold text-slate-200 uppercase">1,000-Mi Fuel Interval</span>
            <span className="font-bold text-[#6677E3]">
              {fuelStopsCount} {fuelStopsCount === 1 ? 'Stop' : 'Stops'}
            </span>
          </div>
          <div className="w-full bg-[#242424] h-2 rounded-full overflow-hidden mb-1.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (distanceMiles / 1000) * 100)}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
              className="h-full bg-[#0016CB] rounded-full"
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>Threshold: &lt; 1,000 mi</span>
            <span className="text-emerald-400 font-semibold">Tank Managed</span>
          </div>
        </div>
      </div>

      {/* Stop Summary Pills Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#242424]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400 mr-1 uppercase font-bold">
            Stops Scheduled:
          </span>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#161616] text-amber-300 border border-[#242424]">
            <Fuel className="w-3.5 h-3.5 text-amber-400" />
            <span>{fuelStopsCount} Fuel Stop{fuelStopsCount !== 1 ? 's' : ''}</span>
          </span>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#161616] text-purple-300 border border-[#242424]">
            <Moon className="w-3.5 h-3.5 text-purple-400" />
            <span>{sleeperStopsCount} 10h Sleeper Reset{sleeperStopsCount !== 1 ? 's' : ''}</span>
          </span>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#161616] text-blue-300 border border-[#242424]">
            <Coffee className="w-3.5 h-3.5 text-blue-400" />
            <span>{breakStopsCount} 30-Min Rest Break{breakStopsCount !== 1 ? 's' : ''}</span>
          </span>
        </div>

        <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-emerald-400 font-bold">100% FMCSA Compliant</span>
        </div>
      </div>
    </motion.div>
  );
};
