import { ComplianceCheck, DailyLog, TimelineEvent, Violation } from '../../types/hos';
import { HOS_CONSTANTS } from './calculator';

export interface TripValidationResult {
  compliant: boolean;
  violations: Violation[];
  checks: ComplianceCheck[];
}

/**
 * Comprehensive FMCSA HOS validator for scheduled trip events
 */
export function validateTrip(events: TimelineEvent[], initialCycleUsed = 0): TripValidationResult {
  const violations: Violation[] = [];
  const checks: ComplianceCheck[] = [];

  let maxDrivingInWindow = 0;
  let maxWindowElapsed = 0;
  let maxCumulativeDriving = 0;
  let maxDistanceBetweenFuel = 0;
  let hasOverlap = false;
  let hasGap = false;
  let hasNegativeDuration = false;

  let currentDrivingInWindow = 0;
  let currentWindowStartTime: number | null = null;
  let currentCumulativeDriving = 0;
  let currentDistanceSinceFuel = 0;
  let cycleUsed = initialCycleUsed;

  let pickupCount = 0;
  let pickupDurationTotal = 0;
  let dropoffCount = 0;
  let dropoffDurationTotal = 0;

  for (let i = 0; i < events.length; i++) {
    const ev = events[i];
    const startMs = new Date(ev.start_time).getTime();
    const endMs = new Date(ev.end_time).getTime();
    const duration = ev.duration_hours;

    // Check negative duration
    if (duration < 0 || endMs < startMs) {
      hasNegativeDuration = true;
      violations.push({
        type: 'NEGATIVE_DURATION',
        severity: 'ERROR',
        message: `Event ${ev.id} has negative duration: ${duration} hours`,
        affected_event_id: ev.id
      });
    }

    // Check timeline overlap & gap with previous event
    if (i > 0) {
      const prevEndMs = new Date(events[i - 1].end_time).getTime();
      const diffMs = startMs - prevEndMs;
      if (diffMs < -60000) {
        // Overlap greater than 1 minute
        hasOverlap = true;
        violations.push({
          type: 'TIMELINE_OVERLAP',
          severity: 'ERROR',
          message: `Event ${ev.id} overlaps with previous event by ${Math.round(Math.abs(diffMs) / 60000)} minutes`,
          affected_event_id: ev.id
        });
      } else if (diffMs > 60000) {
        // Gap greater than 1 minute
        hasGap = true;
        violations.push({
          type: 'TIMELINE_GAP',
          severity: 'ERROR',
          message: `Unexplained timeline gap of ${Math.round(diffMs / 60000)} minutes before event ${ev.id}`,
          affected_event_id: ev.id
        });
      }
    }

    // On-duty and rest transitions
    if (ev.status === 'DRIVING' || ev.status === 'ON_DUTY_NOT_DRIVING') {
      cycleUsed += duration;
      if (!currentWindowStartTime) {
        currentWindowStartTime = startMs;
      }
    }

    // Check 10-hour rest reset
    if ((ev.status === 'OFF_DUTY' || ev.status === 'SLEEPER_BERTH') && duration >= HOS_CONSTANTS.MIN_DAILY_RESET_HOURS) {
      currentDrivingInWindow = 0;
      currentWindowStartTime = null;
      currentCumulativeDriving = 0;
    }

    // Check 34-hour restart
    if ((ev.status === 'OFF_DUTY' || ev.status === 'SLEEPER_BERTH') && duration >= HOS_CONSTANTS.MIN_CYCLE_RESTART_HOURS) {
      cycleUsed = 0;
      currentDrivingInWindow = 0;
      currentWindowStartTime = null;
      currentCumulativeDriving = 0;
    }

    // Driving checks
    if (ev.status === 'DRIVING') {
      currentDrivingInWindow += duration;
      currentCumulativeDriving += duration;
      currentDistanceSinceFuel += ev.distance_miles;

      if (currentDrivingInWindow > maxDrivingInWindow) maxDrivingInWindow = currentDrivingInWindow;
      if (currentCumulativeDriving > maxCumulativeDriving) maxCumulativeDriving = currentCumulativeDriving;
      if (currentDistanceSinceFuel > maxDistanceBetweenFuel) maxDistanceBetweenFuel = currentDistanceSinceFuel;

      // 11-hour limit check (allow tiny 0.01 floating point margin)
      if (currentDrivingInWindow > HOS_CONSTANTS.MAX_DAILY_DRIVING_HOURS + 0.01) {
        violations.push({
          type: '11_HOUR_LIMIT',
          severity: 'ERROR',
          message: `Driving time in window reached ${currentDrivingInWindow.toFixed(2)}h, exceeding the 11.0-hour limit`,
          affected_event_id: ev.id,
          start_time: ev.start_time,
          end_time: ev.end_time
        });
      }

      // 14-hour window check
      if (currentWindowStartTime) {
        const windowElapsed = (endMs - currentWindowStartTime) / (3600 * 1000);
        if (windowElapsed > maxWindowElapsed) maxWindowElapsed = windowElapsed;

        if (windowElapsed > HOS_CONSTANTS.MAX_DAILY_WINDOW_HOURS + 0.01) {
          violations.push({
            type: '14_HOUR_WINDOW',
            severity: 'ERROR',
            message: `CMV Driving occurred at ${windowElapsed.toFixed(2)}h after window start, exceeding the 14-hour window`,
            affected_event_id: ev.id,
            start_time: ev.start_time,
            end_time: ev.end_time
          });
        }
      }

      // 8-hour cumulative driving 30-min break check
      if (currentCumulativeDriving > HOS_CONSTANTS.MAX_CUMULATIVE_DRIVING_BEFORE_BREAK + 0.01) {
        violations.push({
          type: '30_MINUTE_BREAK',
          severity: 'ERROR',
          message: `Cumulative driving reached ${currentCumulativeDriving.toFixed(2)}h without a qualifying 30-minute break`,
          affected_event_id: ev.id,
          start_time: ev.start_time,
          end_time: ev.end_time
        });
      }
    }

    // Non-driving break reset check (>= 30 mins consecutive non-driving)
    if (ev.status !== 'DRIVING' && duration >= HOS_CONSTANTS.MIN_REST_BREAK_HOURS) {
      currentCumulativeDriving = 0;
    }

    // Fueling check
    if (ev.type === 'FUEL') {
      currentDistanceSinceFuel = 0;
    }

    // Pickup / Dropoff counts
    if (ev.type === 'PICKUP') {
      pickupCount++;
      pickupDurationTotal += duration;
    }
    if (ev.type === 'DROPOFF') {
      dropoffCount++;
      dropoffDurationTotal += duration;
    }

    // 70-hour cycle check
    if (cycleUsed > HOS_CONSTANTS.CYCLE_LIMIT_HOURS + 0.01) {
      violations.push({
        type: '70_HOUR_CYCLE',
        severity: 'ERROR',
        message: `Total on-duty hours reached ${cycleUsed.toFixed(2)}h, exceeding 70-hour / 8-day cycle limit`,
        affected_event_id: ev.id
      });
    }
  }

  // 1,000-mile fuel limit check
  if (maxDistanceBetweenFuel > HOS_CONSTANTS.MAX_FUELING_INTERVAL_MILES) {
    violations.push({
      type: 'FUEL_INTERVAL',
      severity: 'ERROR',
      message: `Distance between fuel stops reached ${Math.round(maxDistanceBetweenFuel)} miles, exceeding the 1,000-mile limit`
    });
  }

  // Build 8-point Compliance Verification Checks
  checks.push({
    id: 'check-11h',
    title: '11-Hour Driving Limit',
    passed: maxDrivingInWindow <= HOS_CONSTANTS.MAX_DAILY_DRIVING_HOURS + 0.01,
    detail: `Max driving in any window was ${maxDrivingInWindow.toFixed(2)}h (limit: 11.0h).`
  });

  checks.push({
    id: 'check-14h',
    title: '14-Hour Consecutive Window',
    passed: maxWindowElapsed <= HOS_CONSTANTS.MAX_DAILY_WINDOW_HOURS + 0.01,
    detail: `Max window driving span was ${maxWindowElapsed.toFixed(2)}h (limit: 14.0h).`
  });

  checks.push({
    id: 'check-break',
    title: '30-Minute Break after 8h Driving',
    passed: maxCumulativeDriving <= HOS_CONSTANTS.MAX_CUMULATIVE_DRIVING_BEFORE_BREAK + 0.01,
    detail: `Max cumulative driving before break was ${maxCumulativeDriving.toFixed(2)}h (limit: 8.0h).`
  });

  checks.push({
    id: 'check-cycle',
    title: '70-Hour / 8-Day On-Duty Limit',
    passed: cycleUsed <= HOS_CONSTANTS.CYCLE_LIMIT_HOURS + 0.01,
    detail: `Projected cycle on-duty is ${cycleUsed.toFixed(2)}h of 70.0h available.`
  });

  checks.push({
    id: 'check-fuel',
    title: 'Fueling Interval <= 1,000 Miles',
    passed: maxDistanceBetweenFuel <= HOS_CONSTANTS.MAX_FUELING_INTERVAL_MILES,
    detail: `Max distance between fueling was ${Math.round(maxDistanceBetweenFuel)} miles (threshold: 920 mi).`
  });

  checks.push({
    id: 'check-pickup',
    title: 'Pickup Stop (1 Hour On-Duty)',
    passed: pickupCount >= 1 && pickupDurationTotal >= 0.99,
    detail: `Scheduled ${pickupDurationTotal.toFixed(1)}h on-duty at pickup terminal.`
  });

  checks.push({
    id: 'check-dropoff',
    title: 'Dropoff Stop (1 Hour On-Duty)',
    passed: dropoffCount >= 1 && dropoffDurationTotal >= 0.99,
    detail: `Scheduled ${dropoffDurationTotal.toFixed(1)}h on-duty at dropoff destination.`
  });

  checks.push({
    id: 'check-integrity',
    title: 'Timeline Integrity & Continuity',
    passed: !hasOverlap && !hasGap && !hasNegativeDuration,
    detail: 'No overlapping events, timeline gaps, or negative durations detected.'
  });

  const compliant = violations.length === 0;

  return {
    compliant,
    violations,
    checks
  };
}

/**
 * Validates that an individual daily ELD log sums up to exactly 24.00 hours
 */
export function validateDailyLog(log: DailyLog): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  const sum =
    log.off_duty_hours +
    log.sleeper_berth_hours +
    log.driving_hours +
    log.on_duty_not_driving_hours;

  const roundedSum = Math.round(sum * 100) / 100;

  // Exact 24.00 check with 0.02 floating point tolerance
  if (Math.abs(roundedSum - 24.0) > 0.02) {
    errors.push(
      `Daily log for ${log.date} total hours is ${roundedSum.toFixed(2)}h, which does NOT equal the required 24.00 hours.`
    );
  }

  if (log.off_duty_hours < 0) errors.push('Off duty hours cannot be negative');
  if (log.sleeper_berth_hours < 0) errors.push('Sleeper berth hours cannot be negative');
  if (log.driving_hours < 0) errors.push('Driving hours cannot be negative');
  if (log.on_duty_not_driving_hours < 0) errors.push('On duty hours cannot be negative');

  return {
    valid: errors.length === 0,
    errors
  };
}
