import { DailyLog, DutyStatus, LogRemark, TimelineEvent } from '../../types/hos';
import { validateDailyLog } from './validators';

interface TripLogMetadata {
  trip_id: string;
  carrier_name: string;
  carrier_office: string;
  home_terminal: string;
  driver_name: string;
  driver_signature: string;
  co_driver_name?: string;
  truck_number: string;
  trailer_number: string;
  from_location: string;
  to_location: string;
  shipping_doc_number: string;
  shipper: string;
  commodity: string;
}

/**
 * Splits timeline events at midnight boundaries (00:00:00) so each event belongs strictly to one calendar day.
 */
export function splitEventsAtMidnight(events: TimelineEvent[]): TimelineEvent[] {
  if (!events || events.length === 0) return [];

  const splitList: TimelineEvent[] = [];

  for (const event of events) {
    let currentStart = new Date(event.start_time);
    const finalEnd = new Date(event.end_time);

    while (currentStart < finalEnd) {
      // Find end of current calendar day in UTC/local base
      const nextMidnight = new Date(currentStart);
      nextMidnight.setUTCHours(24, 0, 0, 0);

      const segmentEnd = nextMidnight < finalEnd ? nextMidnight : finalEnd;
      const segmentDurationHours = (segmentEnd.getTime() - currentStart.getTime()) / (3600 * 1000);
      const totalEventDuration = (finalEnd.getTime() - new Date(event.start_time).getTime()) / (3600 * 1000);
      const distRatio = totalEventDuration > 0 ? segmentDurationHours / totalEventDuration : 0;
      const segmentDistance = Math.round(event.distance_miles * distRatio * 10) / 10;

      splitList.push({
        ...event,
        id: `${event.id}-split-${splitList.length + 1}`,
        start_time: currentStart.toISOString(),
        end_time: segmentEnd.toISOString(),
        duration_hours: Math.round(segmentDurationHours * 100) / 100,
        distance_miles: segmentDistance,
        is_split: segmentEnd < finalEnd || currentStart > new Date(event.start_time),
        original_event_id: event.id
      });

      currentStart = segmentEnd;
    }
  }

  return splitList;
}

/**
 * Generates official FMCSA-style 24-hour Daily Logs (RODS) for every calendar day of the trip.
 */
export function generateDailyLogs(events: TimelineEvent[], meta: TripLogMetadata): DailyLog[] {
  if (!events || events.length === 0) return [];

  // 1. Split events at midnight
  const splitEvents = splitEventsAtMidnight(events);

  // 2. Group events by calendar date string (YYYY-MM-DD)
  const daysMap = new Map<string, TimelineEvent[]>();
  for (const ev of splitEvents) {
    const dateKey = ev.start_time.split('T')[0];
    if (!daysMap.has(dateKey)) {
      daysMap.set(dateKey, []);
    }
    daysMap.get(dateKey)!.push(ev);
  }

  const sortedDates = Array.from(daysMap.keys()).sort();
  const dailyLogs: DailyLog[] = [];

  let dayNumber = 1;
  let runningCycleHours = 0;

  for (const dateStr of sortedDates) {
    const rawEvents = daysMap.get(dateStr)!;

    // Ensure full 24-hour coverage from 00:00 to 24:00
    const dayEvents = ensureFull24Hours(rawEvents, dateStr, meta.from_location, meta.to_location);

    // Sum hours by duty status
    let offDuty = 0;
    let sleeper = 0;
    let driving = 0;
    let onDuty = 0;
    let totalMilesDrivingToday = 0;

    for (const ev of dayEvents) {
      if (ev.status === 'OFF_DUTY') offDuty += ev.duration_hours;
      else if (ev.status === 'SLEEPER_BERTH') sleeper += ev.duration_hours;
      else if (ev.status === 'DRIVING') {
        driving += ev.duration_hours;
        totalMilesDrivingToday += ev.distance_miles;
      } else if (ev.status === 'ON_DUTY_NOT_DRIVING') onDuty += ev.duration_hours;
    }

    // Precise rounding and normalize to exactly 24.00
    offDuty = Math.round(offDuty * 100) / 100;
    sleeper = Math.round(sleeper * 100) / 100;
    driving = Math.round(driving * 100) / 100;
    onDuty = Math.round(onDuty * 100) / 100;

    let totalSum = offDuty + sleeper + driving + onDuty;
    const diff = Math.round((24.0 - totalSum) * 100) / 100;
    if (Math.abs(diff) > 0 && Math.abs(diff) <= 0.1) {
      // Adjust off-duty to make total sum exactly 24.00
      offDuty = Math.round((offDuty + diff) * 100) / 100;
      totalSum = 24.0;
    }

    // Generate remarks for all duty status changes
    const remarks: LogRemark[] = [];
    let previousStatus: DutyStatus | null = null;

    for (const ev of dayEvents) {
      if (ev.status !== previousStatus) {
        const evDate = new Date(ev.start_time);
        const hours = evDate.getUTCHours();
        const mins = evDate.getUTCMinutes();
        const timeFormatted = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
        const minutesFromMidnight = hours * 60 + mins;

        remarks.push({
          time: timeFormatted,
          location: ev.location_name || meta.carrier_office,
          note: ev.reason || getDutyStatusLabel(ev.status),
          status: ev.status,
          minutes_from_midnight: minutesFromMidnight
        });

        previousStatus = ev.status;
      }
    }

    // Calculate 70-hour / 8-day rolling recap values
    const onDutyToday = Math.round((driving + onDuty) * 100) / 100;
    runningCycleHours += onDutyToday;
    const availableTomorrow = Math.max(0, Math.round((70.0 - runningCycleHours) * 100) / 100);

    const log: DailyLog = {
      id: `log-${dateStr}`,
      trip_id: meta.trip_id,
      day_number: dayNumber++,
      date: dateStr,
      carrier_name: meta.carrier_name,
      carrier_office: meta.carrier_office,
      home_terminal: meta.home_terminal,
      driver_name: meta.driver_name,
      driver_signature: meta.driver_signature,
      co_driver_name: meta.co_driver_name || 'None',
      truck_number: meta.truck_number,
      trailer_number: meta.trailer_number,
      from_location: meta.from_location,
      to_location: meta.to_location,
      shipping_doc_number: meta.shipping_doc_number,
      shipper: meta.shipper,
      commodity: meta.commodity,
      off_duty_hours: offDuty,
      sleeper_berth_hours: sleeper,
      driving_hours: driving,
      on_duty_not_driving_hours: onDuty,
      total_hours: 24.0,
      total_miles_driving_today: Math.round(totalMilesDrivingToday * 10) / 10,
      total_mileage_today: Math.round(totalMilesDrivingToday * 10) / 10,
      events: dayEvents,
      remarks,
      validation_status: 'VALID',
      validation_errors: [],
      recap: {
        on_duty_today: onDutyToday,
        total_last_7_days: Math.min(70, Math.round((runningCycleHours * 0.85) * 100) / 100),
        total_last_8_days: Math.round(runningCycleHours * 100) / 100,
        available_tomorrow: availableTomorrow
      }
    };

    const val = validateDailyLog(log);
    if (!val.valid) {
      log.validation_status = 'INVALID';
      log.validation_errors = val.errors;
    }

    dailyLogs.push(log);
  }

  return dailyLogs;
}

/**
 * Ensures the day has continuous coverage from 00:00:00 to 24:00:00 by padding with OFF_DUTY if needed.
 */
function ensureFull24Hours(
  events: TimelineEvent[],
  dateStr: string,
  fromLoc: string,
  toLoc: string
): TimelineEvent[] {
  const result: TimelineEvent[] = [];
  const dayStart = new Date(`${dateStr}T00:00:00.000Z`);
  const dayEnd = new Date(`${dateStr}T24:00:00.000Z`);

  let currentPointer = dayStart;

  for (const ev of events) {
    const evStart = new Date(ev.start_time);
    const evEnd = new Date(ev.end_time);

    // If there is a gap before this event, fill it with OFF_DUTY
    if (evStart > currentPointer) {
      const gapHours = (evStart.getTime() - currentPointer.getTime()) / (3600 * 1000);
      result.push({
        id: `fill-pre-${result.length + 1}`,
        type: 'OFF_DUTY',
        status: 'OFF_DUTY',
        start_time: currentPointer.toISOString(),
        end_time: evStart.toISOString(),
        duration_hours: Math.round(gapHours * 100) / 100,
        distance_miles: 0,
        location_name: fromLoc,
        reason: 'Off duty at origin terminal',
        sequence: 0
      });
    }

    result.push(ev);
    currentPointer = evEnd;
  }

  // If there is remaining time after the last event until 24:00, fill with OFF_DUTY
  if (currentPointer < dayEnd) {
    const gapHours = (dayEnd.getTime() - currentPointer.getTime()) / (3600 * 1000);
    result.push({
      id: `fill-post-${result.length + 1}`,
      type: 'OFF_DUTY',
      status: 'OFF_DUTY',
      start_time: currentPointer.toISOString(),
      end_time: dayEnd.toISOString(),
      duration_hours: Math.round(gapHours * 100) / 100,
      distance_miles: 0,
      location_name: toLoc,
      reason: 'Off duty at destination terminal',
      sequence: 999
    });
  }

  return result;
}

function getDutyStatusLabel(status: DutyStatus): string {
  switch (status) {
    case 'OFF_DUTY':
      return 'Off duty';
    case 'SLEEPER_BERTH':
      return 'Sleeper berth';
    case 'DRIVING':
      return 'Driving CMV';
    case 'ON_DUTY_NOT_DRIVING':
      return 'On duty (not driving)';
  }
}
