import {
  calculateBreakRemaining,
  calculateDrivingRemaining,
  calculateRemainingCycle,
  calculateWindowRemaining,
  canDrive,
  HOS_CONSTANTS,
  requires30MinuteBreak,
  requiresFuelStop
} from '../hos/calculator';
import { validateDailyLog, validateTrip } from '../hos/validators';
import { generateDailyLogs, splitEventsAtMidnight } from '../hos/logGenerator';
import { TimelineEvent } from '../../types/hos';

export interface TestResult {
  name: string;
  passed: boolean;
  message?: string;
}

export function runAllHosUnitTests(): TestResult[] {
  const results: TestResult[] = [];

  const assert = (name: string, condition: boolean, message?: string) => {
    results.push({
      name,
      passed: Boolean(condition),
      message: condition ? undefined : message || 'Assertion failed'
    });
  };

  // Test 1: Exactly 11 hours driving in window -> Valid
  {
    const events: TimelineEvent[] = [
      {
        id: '1',
        type: 'DRIVING',
        status: 'DRIVING',
        start_time: '2026-09-10T06:00:00.000Z',
        end_time: '2026-09-10T12:00:00.000Z',
        duration_hours: 6.0,
        distance_miles: 360,
        location_name: 'Chicago, IL',
        reason: 'Driving',
        sequence: 1
      },
      {
        id: '2',
        type: 'REST_BREAK',
        status: 'OFF_DUTY',
        start_time: '2026-09-10T12:00:00.000Z',
        end_time: '2026-09-10T12:30:00.000Z',
        duration_hours: 0.5,
        distance_miles: 0,
        location_name: 'Rest Plaza',
        reason: 'Break',
        sequence: 2
      },
      {
        id: '3',
        type: 'DRIVING',
        status: 'DRIVING',
        start_time: '2026-09-10T12:30:00.000Z',
        end_time: '2026-09-10T17:30:00.000Z',
        duration_hours: 5.0,
        distance_miles: 300,
        location_name: 'Destination',
        reason: 'Driving',
        sequence: 3
      }
    ];
    const res = validateTrip(events, 0);
    const has11Violation = res.violations.some(v => v.type === '11_HOUR_LIMIT');
    assert('Test 1: Exactly 11 hours driving -> valid', !has11Violation && res.checks.find(c => c.id === 'check-11h')?.passed === true);
  }

  // Test 2: 11h 1m driving in window -> violation
  {
    const events: TimelineEvent[] = [
      {
        id: '1',
        type: 'DRIVING',
        status: 'DRIVING',
        start_time: '2026-09-10T06:00:00.000Z',
        end_time: '2026-09-10T12:00:00.000Z',
        duration_hours: 6.0,
        distance_miles: 360,
        location_name: 'Chicago, IL',
        reason: 'Driving',
        sequence: 1
      },
      {
        id: '2',
        type: 'REST_BREAK',
        status: 'OFF_DUTY',
        start_time: '2026-09-10T12:00:00.000Z',
        end_time: '2026-09-10T12:30:00.000Z',
        duration_hours: 0.5,
        distance_miles: 0,
        location_name: 'Rest Plaza',
        reason: 'Break',
        sequence: 2
      },
      {
        id: '3',
        type: 'DRIVING',
        status: 'DRIVING',
        start_time: '2026-09-10T12:30:00.000Z',
        end_time: '2026-09-10T17:31:00.000Z',
        duration_hours: 5.02, // 11h 1.2m
        distance_miles: 302,
        location_name: 'Destination',
        reason: 'Driving',
        sequence: 3
      }
    ];
    const res = validateTrip(events, 0);
    const has11Violation = res.violations.some(v => v.type === '11_HOUR_LIMIT');
    assert('Test 2: 11h 1m driving -> violation', has11Violation === true);
  }

  // Test 3: Driving beyond 14-hour window -> violation
  {
    const events: TimelineEvent[] = [
      {
        id: '1',
        type: 'OFF_DUTY',
        status: 'ON_DUTY_NOT_DRIVING',
        start_time: '2026-09-10T06:00:00.000Z',
        end_time: '2026-09-10T10:00:00.000Z',
        duration_hours: 4.0,
        distance_miles: 0,
        location_name: 'Terminal',
        reason: 'Loading work',
        sequence: 1
      },
      {
        id: '2',
        type: 'DRIVING',
        status: 'DRIVING',
        start_time: '2026-09-10T10:00:00.000Z',
        end_time: '2026-09-10T16:00:00.000Z',
        duration_hours: 6.0,
        distance_miles: 350,
        location_name: 'Highway',
        reason: 'Driving',
        sequence: 2
      },
      {
        id: '3',
        type: 'OFF_DUTY',
        status: 'OFF_DUTY',
        start_time: '2026-09-10T16:00:00.000Z',
        end_time: '2026-09-10T20:15:00.000Z',
        duration_hours: 4.25,
        distance_miles: 0,
        location_name: 'Dock waiting',
        reason: 'Waiting',
        sequence: 3
      },
      {
        id: '4',
        type: 'DRIVING',
        status: 'DRIVING',
        start_time: '2026-09-10T20:15:00.000Z', // 14h15m after 06:00 start!
        end_time: '2026-09-10T21:00:00.000Z',
        duration_hours: 0.75,
        distance_miles: 40,
        location_name: 'Highway',
        reason: 'Driving after 14h window',
        sequence: 4
      }
    ];
    const res = validateTrip(events, 0);
    const hasWindowViolation = res.violations.some(v => v.type === '14_HOUR_WINDOW');
    assert('Test 3: Driving beyond 14-hour window -> violation', hasWindowViolation === true);
  }

  // Test 4: 8 hours cumulative driving -> 30-minute break required
  {
    assert(
      'Test 4: 8 hours cumulative driving -> 30-minute break required',
      requires30MinuteBreak(8.0) === true && calculateBreakRemaining(8.0) === 0
    );
  }

  // Test 5: 8 hours driving + 30 minute break -> driving can continue
  {
    const canContinue = canDrive(
      calculateDrivingRemaining(8.0), // 3h remaining
      calculateWindowRemaining(8.5),  // 5.5h window remaining
      calculateRemainingCycle(8.5),   // 61.5h remaining
      calculateBreakRemaining(0)      // 8h fresh break capacity!
    );
    assert('Test 5: 8 hours driving + 30 minute break -> driving can continue', canContinue === true);
  }

  // Test 6: 10 hours sleeper berth -> daily driving/window reset
  {
    const events: TimelineEvent[] = [
      {
        id: '1',
        type: 'DRIVING',
        status: 'DRIVING',
        start_time: '2026-09-10T06:00:00.000Z',
        end_time: '2026-09-10T12:00:00.000Z',
        duration_hours: 6.0,
        distance_miles: 360,
        location_name: 'Day 1 Leg 1',
        reason: 'Driving',
        sequence: 1
      },
      {
        id: '2',
        type: 'REST_BREAK',
        status: 'OFF_DUTY',
        start_time: '2026-09-10T12:00:00.000Z',
        end_time: '2026-09-10T12:30:00.000Z',
        duration_hours: 0.5,
        distance_miles: 0,
        location_name: 'Rest Stop',
        reason: '30m Break',
        sequence: 2
      },
      {
        id: '3',
        type: 'DRIVING',
        status: 'DRIVING',
        start_time: '2026-09-10T12:30:00.000Z',
        end_time: '2026-09-10T17:30:00.000Z',
        duration_hours: 5.0,
        distance_miles: 300,
        location_name: 'Day 1 Leg 2',
        reason: 'Driving',
        sequence: 3
      },
      {
        id: '4',
        type: 'SLEEPER_BERTH',
        status: 'SLEEPER_BERTH',
        start_time: '2026-09-10T17:30:00.000Z',
        end_time: '2026-09-11T03:30:00.000Z',
        duration_hours: 10.0,
        distance_miles: 0,
        location_name: 'Overnight Rest',
        reason: '10h Sleeper',
        sequence: 4
      },
      {
        id: '5',
        type: 'DRIVING',
        status: 'DRIVING',
        start_time: '2026-09-11T03:30:00.000Z',
        end_time: '2026-09-11T08:30:00.000Z',
        duration_hours: 5.0,
        distance_miles: 300,
        location_name: 'Day 2 Leg',
        reason: 'Driving after 10h rest',
        sequence: 5
      }
    ];
    const res = validateTrip(events, 0);
    assert('Test 6: 10 hours sleeper berth -> daily driving/window reset', res.violations.length === 0);
  }

  // Test 7: Current cycle 69h + 2h on duty -> violation
  {
    const events: TimelineEvent[] = [
      {
        id: '1',
        type: 'DRIVING',
        status: 'DRIVING',
        start_time: '2026-09-10T06:00:00.000Z',
        end_time: '2026-09-10T08:00:00.000Z',
        duration_hours: 2.0,
        distance_miles: 120,
        location_name: 'Highway',
        reason: 'Driving',
        sequence: 1
      }
    ];
    const res = validateTrip(events, 69.0);
    const hasCycleViolation = res.violations.some(v => v.type === '70_HOUR_CYCLE');
    assert('Test 7: Current cycle 69h + 2h on duty -> violation', hasCycleViolation === true);
  }

  // Test 8: Current cycle 40h + 20h trip on duty -> valid
  {
    const rem = calculateRemainingCycle(40.0 + 20.0);
    assert('Test 8: Current cycle 40h + 20h trip on duty -> valid', rem === 10.0 && 40 + 20 <= 70);
  }

  // Test 9: Fuel stop required before 1,000 miles
  {
    assert(
      'Test 9: Fuel stop required before 1,000 miles',
      requiresFuelStop(950) === true && requiresFuelStop(500) === false
    );
  }

  // Test 10: Pickup adds exactly 1 hour on-duty
  {
    const pickupDuration = HOS_CONSTANTS.PICKUP_DURATION_HOURS;
    assert('Test 10: Pickup adds exactly 1 hour on-duty', pickupDuration === 1.0);
  }

  // Test 11: Dropoff adds exactly 1 hour on-duty
  {
    const dropoffDuration = HOS_CONSTANTS.DROPOFF_DURATION_HOURS;
    assert('Test 11: Dropoff adds exactly 1 hour on-duty', dropoffDuration === 1.0);
  }

  // Test 12: Daily log totals exactly 24 hours
  {
    const mockLog = {
      id: 'log-1',
      trip_id: 't-1',
      day_number: 1,
      date: '2026-09-10',
      carrier_name: 'Carrier',
      carrier_office: 'Office',
      home_terminal: 'Terminal',
      driver_name: 'Driver',
      driver_signature: 'Signature',
      truck_number: '1',
      trailer_number: '2',
      from_location: 'A',
      to_location: 'B',
      shipping_doc_number: '123',
      shipper: 'Shipper',
      commodity: 'Goods',
      off_duty_hours: 6.0,
      sleeper_berth_hours: 8.0,
      driving_hours: 8.5,
      on_duty_not_driving_hours: 1.5,
      total_hours: 24.0,
      total_miles_driving_today: 450,
      total_mileage_today: 450,
      events: [],
      remarks: [],
      validation_status: 'VALID' as const,
      validation_errors: [],
      recap: { on_duty_today: 10, total_last_7_days: 30, total_last_8_days: 40, available_tomorrow: 30 }
    };
    const val = validateDailyLog(mockLog);
    assert('Test 12: Daily log totals exactly 24 hours', val.valid === true);
  }

  // Test 13: Multi-day trip creates one log per calendar day
  {
    const multiDayEvents: TimelineEvent[] = [
      {
        id: '1',
        type: 'DRIVING',
        status: 'DRIVING',
        start_time: '2026-09-10T14:00:00.000Z',
        end_time: '2026-09-10T22:00:00.000Z',
        duration_hours: 8.0,
        distance_miles: 450,
        location_name: 'Leg 1',
        reason: 'Driving',
        sequence: 1
      },
      {
        id: '2',
        type: 'SLEEPER_BERTH',
        status: 'SLEEPER_BERTH',
        start_time: '2026-09-10T22:00:00.000Z',
        end_time: '2026-09-11T08:00:00.000Z',
        duration_hours: 10.0,
        distance_miles: 0,
        location_name: 'Rest Stop',
        reason: 'Sleeper',
        sequence: 2
      },
      {
        id: '3',
        type: 'DRIVING',
        status: 'DRIVING',
        start_time: '2026-09-11T08:00:00.000Z',
        end_time: '2026-09-11T14:00:00.000Z',
        duration_hours: 6.0,
        distance_miles: 340,
        location_name: 'Leg 2',
        reason: 'Driving',
        sequence: 3
      }
    ];
    const logs = generateDailyLogs(multiDayEvents, {
      trip_id: 't-1',
      carrier_name: 'Carrier',
      carrier_office: 'Office',
      home_terminal: 'Home',
      driver_name: 'Driver',
      driver_signature: 'Sig',
      truck_number: '1',
      trailer_number: '2',
      from_location: 'From',
      to_location: 'To',
      shipping_doc_number: '123',
      shipper: 'Shipper',
      commodity: 'Freight'
    });
    assert('Test 13: Multi-day trip creates one log per calendar day', logs.length === 2);
  }

  // Test 14: Events crossing midnight are correctly split between logs
  {
    const midnightCrossingEvent: TimelineEvent[] = [
      {
        id: '1',
        type: 'SLEEPER_BERTH',
        status: 'SLEEPER_BERTH',
        start_time: '2026-09-10T22:00:00.000Z',
        end_time: '2026-09-11T06:00:00.000Z', // 8h total: 2h in Day 1, 6h in Day 2
        duration_hours: 8.0,
        distance_miles: 0,
        location_name: 'Rest Stop',
        reason: 'Sleeper',
        sequence: 1
      }
    ];
    const split = splitEventsAtMidnight(midnightCrossingEvent);
    assert(
      'Test 14: Events crossing midnight are correctly split between logs',
      split.length === 2 && split[0].duration_hours === 2.0 && split[1].duration_hours === 6.0
    );
  }

  // Test 15: No overlapping timeline events
  {
    const overlapping: TimelineEvent[] = [
      {
        id: '1',
        type: 'DRIVING',
        status: 'DRIVING',
        start_time: '2026-09-10T06:00:00.000Z',
        end_time: '2026-09-10T10:00:00.000Z',
        duration_hours: 4.0,
        distance_miles: 240,
        location_name: 'A',
        reason: 'D',
        sequence: 1
      },
      {
        id: '2',
        type: 'PICKUP',
        status: 'ON_DUTY_NOT_DRIVING',
        start_time: '2026-09-10T09:30:00.000Z', // 30 min overlap!
        end_time: '2026-09-10T10:30:00.000Z',
        duration_hours: 1.0,
        distance_miles: 0,
        location_name: 'B',
        reason: 'P',
        sequence: 2
      }
    ];
    const res = validateTrip(overlapping, 0);
    const hasOverlap = res.violations.some(v => v.type === 'TIMELINE_OVERLAP');
    assert('Test 15: No overlapping timeline events (detection works)', hasOverlap === true);
  }

  // Test 16: No unexplained timeline gaps
  {
    const gapped: TimelineEvent[] = [
      {
        id: '1',
        type: 'DRIVING',
        status: 'DRIVING',
        start_time: '2026-09-10T06:00:00.000Z',
        end_time: '2026-09-10T09:00:00.000Z',
        duration_hours: 3.0,
        distance_miles: 180,
        location_name: 'A',
        reason: 'D',
        sequence: 1
      },
      {
        id: '2',
        type: 'DRIVING',
        status: 'DRIVING',
        start_time: '2026-09-10T11:00:00.000Z', // 2h unexplained gap!
        end_time: '2026-09-10T14:00:00.000Z',
        duration_hours: 3.0,
        distance_miles: 180,
        location_name: 'B',
        reason: 'D',
        sequence: 2
      }
    ];
    const res = validateTrip(gapped, 0);
    const hasGap = res.violations.some(v => v.type === 'TIMELINE_GAP');
    assert('Test 16: No unexplained timeline gaps (detection works)', hasGap === true);
  }

  return results;
}
