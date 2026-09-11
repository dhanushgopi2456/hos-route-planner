/**
 * Core pure HOS calculation utilities based on FMCSA CFR Part 395
 * Interstate Truck Driver's Guide to Hours of Service (April 2022)
 */

export const HOS_CONSTANTS = {
  CYCLE_LIMIT_HOURS: 70.0,
  CYCLE_DAYS: 8,
  MAX_DAILY_DRIVING_HOURS: 11.0,
  MAX_DAILY_WINDOW_HOURS: 14.0,
  MAX_CUMULATIVE_DRIVING_BEFORE_BREAK: 8.0,
  MIN_REST_BREAK_HOURS: 0.5, // 30 minutes
  MIN_DAILY_RESET_HOURS: 10.0, // 10 consecutive hours
  MIN_CYCLE_RESTART_HOURS: 34.0, // 34-hour restart
  MAX_FUELING_INTERVAL_MILES: 1000.0,
  FUELING_TRIGGER_MILES: 920.0, // Schedule fueling before reaching 1,000 mi
  FUELING_DURATION_HOURS: 0.5, // 30 minutes on-duty
  PICKUP_DURATION_HOURS: 1.0, // 1 hour on-duty
  DROPOFF_DURATION_HOURS: 1.0 // 1 hour on-duty
};

/**
 * Calculates remaining available cycle hours under the 70h/8-day rule
 */
export function calculateRemainingCycle(currentCycleUsed: number, limit = HOS_CONSTANTS.CYCLE_LIMIT_HOURS): number {
  return Math.max(0, Math.round((limit - currentCycleUsed) * 100) / 100);
}

/**
 * Calculates remaining driving hours inside the active 14-hour window
 */
export function calculateDrivingRemaining(drivingInWindow: number, limit = HOS_CONSTANTS.MAX_DAILY_DRIVING_HOURS): number {
  return Math.max(0, Math.round((limit - drivingInWindow) * 100) / 100);
}

/**
 * Calculates remaining driving window time before driving is barred
 */
export function calculateWindowRemaining(windowElapsedTime: number, limit = HOS_CONSTANTS.MAX_DAILY_WINDOW_HOURS): number {
  return Math.max(0, Math.round((limit - windowElapsedTime) * 100) / 100);
}

/**
 * Calculates driving time allowed before mandatory 30-minute consecutive break
 */
export function calculateBreakRemaining(
  cumulativeDrivingSinceBreak: number,
  limit = HOS_CONSTANTS.MAX_CUMULATIVE_DRIVING_BEFORE_BREAK
): number {
  return Math.max(0, Math.round((limit - cumulativeDrivingSinceBreak) * 100) / 100);
}

/**
 * Checks if driving is legally permitted
 */
export function canDrive(
  drivingRemaining: number,
  windowRemaining: number,
  cycleRemaining: number,
  breakRemaining: number
): boolean {
  return drivingRemaining > 0 && windowRemaining > 0 && cycleRemaining > 0 && breakRemaining > 0;
}

/**
 * Maximum driving segment duration permissible right now given all constraints
 */
export function maxAllowedDrivingDuration(
  drivingRemaining: number,
  windowRemaining: number,
  cycleRemaining: number,
  breakRemaining: number
): number {
  const min = Math.min(drivingRemaining, windowRemaining, cycleRemaining, breakRemaining);
  return Math.max(0, Math.round(min * 100) / 100);
}

/**
 * Checks if an 8-hour cumulative driving break is required
 */
export function requires30MinuteBreak(cumulativeDrivingSinceBreak: number): boolean {
  return cumulativeDrivingSinceBreak >= HOS_CONSTANTS.MAX_CUMULATIVE_DRIVING_BEFORE_BREAK;
}

/**
 * Checks if 10-hour daily rest is required
 */
export function requiresDailyReset(drivingInWindow: number, windowElapsedTime: number): boolean {
  return (
    drivingInWindow >= HOS_CONSTANTS.MAX_DAILY_DRIVING_HOURS ||
    windowElapsedTime >= HOS_CONSTANTS.MAX_DAILY_WINDOW_HOURS
  );
}

/**
 * Checks if fuel stop is needed
 */
export function requiresFuelStop(
  distanceSinceLastFuel: number,
  threshold = HOS_CONSTANTS.FUELING_TRIGGER_MILES
): boolean {
  return distanceSinceLastFuel >= threshold;
}
