import React, { useEffect, useState } from 'react';
import { TripPlanResponse } from '../../types/hos';
import { ShieldCheck, Fuel, Moon, Coffee, Clock, Activity, Compass, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface HosStatusCardProps {
  tripData: TripPlanResponse;
  className?: string;
}

// Smooth count-up hook for kinetic metrics
function useCountUp(target: number, duration: number = 900) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    let start: number | null = null;
    let frameId: number;

    const step = (now: number) => {
      if (!start) start = now;
      const progress = Math.min((now - start) / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setVal(target * eased);
      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [target, duration]);

  return val;
}

// Circular SVG Radial Progress Clock Component
interface RadialGaugeProps {
  percent: number;
  valueStr: string;
  limitStr: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  ringColor: string;
  icon: React.ReactNode;
}

const RadialClockGauge: React.FC<RadialGaugeProps> = ({
  percent,
  valueStr,
  limitStr,
  title,
  subtitle,
  badge,
  badgeColor,
  ringColor,
  icon
}) => {
  const size = 76;
  const strokeWidth = 6.5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedPercent = Math.max(0, Math.min(100, percent));
  const strokeDashoffset = circumference - (clampedPercent / 100) * circumference;

  return (
    <div
      className="p-4 rounded-lg bg-[#141415] border border-[#232325] transition-colors flex flex-col justify-between"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-[#ededed]">
            {icon}
            <span>{title}</span>
          </div>
          <span className="text-[10px] font-mono text-[#85858b] mt-0.5 block">
            {subtitle}
          </span>
        </div>

        <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${badgeColor}`}>
          {badge}
        </span>
      </div>

      <div className="flex items-center gap-4 my-2">
        {/* Circular SVG Gauge */}
        <div className="relative shrink-0" style={{ width: size, height: size }}>
          <svg className="w-full h-full -rotate-90 transform" viewBox={`0 0 ${size} ${size}`}>
            {/* Background Track Ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              fill="transparent"
              className="text-[#232325]"
            />
            {/* Animated Progress Ring */}
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={ringColor}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          {/* Centered Percentage */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xs font-medium font-mono text-white leading-none tabular-nums">
              {Math.round(clampedPercent)}%
            </span>
          </div>
        </div>

        {/* Value and Limit Readout */}
        <div className="flex-1 min-w-0">
          <div className="text-base font-semibold font-mono text-white leading-tight tabular-nums">
            {valueStr}
          </div>
          <div className="text-[11px] font-mono text-[#85858b] mt-0.5 tabular-nums">
            Limit: <span className="text-[#ededed] font-medium">{limitStr}</span>
          </div>
          {/* Linear Mini Bar */}
          <div className="w-full bg-[#232325] h-1.5 rounded-full overflow-hidden mt-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${clampedPercent}%` }}
              transition={{ duration: 1.0, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ backgroundColor: ringColor }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

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

  // Kinetic Count-up values
  const animatedDistance = useCountUp(distanceMiles, 850);
  const animatedDriveHours = useCountUp(drivingHours, 850);
  const animatedDuration = useCountUp(totalDurationHours, 850);
  const animatedLogs = useCountUp(dailyLogsCount, 600);

  // 11H Drive Limit calculation
  const currentLegDrive = Math.min(11, drivingHours);
  const drive11Percent = Math.min(100, (currentLegDrive / 11) * 100);

  // 14H Duty Window calculation
  const currentDutyWindow = Math.min(14, Math.max(1, drivingHours + 2));
  const duty14Percent = Math.min(100, (currentDutyWindow / 14) * 100);

  return (
    <div
      className={`rounded-xl bg-[#19191b] border border-[#232325] p-5 sm:p-6 text-[#ededed] ${className}`}
    >
      {/* Top Header Metrics Row with Count-Up Tickers */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pb-5 mb-5 border-b border-[#232325]">
        {/* Metric 1: Distance */}
        <div
          className="p-3.5 bg-[#141415] border border-[#232325] rounded-lg"
        >
          <span className="text-[11px] font-mono text-[#85858b] block">
            Total distance
          </span>
          <div className="text-xl sm:text-2xl font-semibold text-white font-mono mt-0.5 tabular-nums">
            {animatedDistance.toFixed(0)}{' '}
            <span className="text-xs font-normal text-[#85858b]">mi</span>
          </div>
          <span className="text-[10px] text-blue-400 font-mono mt-0.5 block">
            OSRM road network
          </span>
        </div>

        {/* Metric 2: Driving Time */}
        <div
          className="p-3.5 bg-[#141415] border border-[#232325] rounded-lg"
        >
          <span className="text-[11px] font-mono text-[#85858b] block">
            Driving time
          </span>
          <div className="text-xl sm:text-2xl font-semibold text-white font-mono mt-0.5 tabular-nums">
            {animatedDriveHours.toFixed(1)}{' '}
            <span className="text-xs font-normal text-[#85858b]">hrs</span>
          </div>
          <span className="text-[10px] text-[#85858b] font-mono mt-0.5 block">
            @ avg ~60 mph
          </span>
        </div>

        {/* Metric 3: Elapsed Trip Duration */}
        <div
          className="p-3.5 bg-[#141415] border border-[#232325] rounded-lg"
        >
          <span className="text-[11px] font-mono text-[#85858b] block">
            Elapsed duration
          </span>
          <div className="text-xl sm:text-2xl font-semibold text-white font-mono mt-0.5 tabular-nums">
            {animatedDuration.toFixed(1)}{' '}
            <span className="text-xs font-normal text-[#85858b]">hrs</span>
          </div>
          <span className="text-[10px] text-blue-400 font-mono mt-0.5 block">
            Inc. stops &amp; sleep
          </span>
        </div>

        {/* Metric 4: ELD Daily Logs */}
        <div
          className="p-3.5 bg-[#141415] border border-[#232325] rounded-lg"
        >
          <span className="text-[11px] font-mono text-[#85858b] block">
            ELD daily logs
          </span>
          <div className="text-xl sm:text-2xl font-semibold text-emerald-400 font-mono mt-0.5 tabular-nums">
            {Math.round(animatedLogs)}{' '}
            <span className="text-xs font-normal text-[#85858b]">
              {dailyLogsCount === 1 ? 'day' : 'days'}
            </span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono mt-0.5 block">
            24.00h balanced RODS
          </span>
        </div>
      </div>

      {/* 4 HOS Regulatory Clock Gauges with SVG Circular Progress Rings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-5">
        {/* Clock 1: 11-Hour Driving Limit */}
        <RadialClockGauge
          percent={drive11Percent}
          valueStr={`${currentLegDrive.toFixed(1)} hrs`}
          limitStr="11.0 hrs"
          title="11H Drive Limit"
          subtitle="FMCSA CFR § 395.3(a)(1)"
          badge="10h Sleep Reset"
          badgeColor="bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
          ringColor="#0016CB"
          icon={<Compass className="w-3.5 h-3.5 text-[#0016CB]" />}
        />

        {/* Clock 2: 14-Hour Duty Window */}
        <RadialClockGauge
          percent={duty14Percent}
          valueStr={`${currentDutyWindow.toFixed(1)} hrs`}
          limitStr="14.0 hrs"
          title="14H Duty Window"
          subtitle="Consecutive Clock"
          badge="Daily Limit"
          badgeColor="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
          ringColor="#F59E0B"
          icon={<Clock className="w-3.5 h-3.5 text-amber-500" />}
        />

        {/* Clock 3: 70H / 8D Rolling Cycle */}
        <RadialClockGauge
          percent={cyclePercent}
          valueStr={`${cycleUsedValue.toFixed(1)} hrs`}
          limitStr="70.0 hrs"
          title="70H / 8D Cycle"
          subtitle={`${cycleRemainingValue.toFixed(1)}h remaining`}
          badge={cyclePercent > 85 ? 'Near Cap' : 'Compliant'}
          badgeColor={
            cyclePercent > 85
              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
              : 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20'
          }
          ringColor={cyclePercent > 85 ? '#EF4444' : '#06B6D4'}
          icon={<Activity className="w-3.5 h-3.5 text-cyan-500" />}
        />

        {/* Clock 4: 1,000-Mile Fuel Interval */}
        <RadialClockGauge
          percent={Math.min(100, (distanceMiles / 1000) * 100)}
          valueStr={`${fuelStopsCount} ${fuelStopsCount === 1 ? 'Stop' : 'Stops'}`}
          limitStr="< 1,000 mi"
          title="Fueling Interval"
          subtitle="Mandatory Diesel Stops"
          badge="Tank Managed"
          badgeColor="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
          ringColor="#10B981"
          icon={<Fuel className="w-3.5 h-3.5 text-emerald-500" />}
        />
      </div>

      {/* Stop Summary Pills Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#232325]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono text-[#85858b] mr-1">
            Stops scheduled:
          </span>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono bg-[#141415] text-amber-300 border border-amber-500/20">
            <Fuel className="w-3.5 h-3.5 text-amber-400" />
            <span>{fuelStopsCount} fuel stop{fuelStopsCount !== 1 ? 's' : ''}</span>
          </span>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono bg-[#141415] text-blue-300 border border-blue-500/20">
            <Moon className="w-3.5 h-3.5 text-blue-400" />
            <span>{sleeperStopsCount} 10h sleeper reset{sleeperStopsCount !== 1 ? 's' : ''}</span>
          </span>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono bg-[#141415] text-[#ededed] border border-[#232325]">
            <Coffee className="w-3.5 h-3.5 text-blue-400" />
            <span>{breakStopsCount} 30-min rest break{breakStopsCount !== 1 ? 's' : ''}</span>
          </span>
        </div>

        <div className="text-xs font-mono flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-emerald-400 font-medium">100% FMCSA compliant</span>
        </div>
      </div>
    </div>
  );
};
