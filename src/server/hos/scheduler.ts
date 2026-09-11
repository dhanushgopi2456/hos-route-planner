import {
  DutyStatus,
  EventType,
  HosSummary,
  LocationPoint,
  RouteData,
  RouteLeg,
  Stop,
  TimelineEvent,
  TripPlanRequest,
  TripPlanResponse
} from '../../types/hos';
import { HOS_CONSTANTS } from './calculator';
import { interpolateCoordinate } from '../routing/router';
import { reverseGeocode } from '../routing/geocoder';
import { generateDailyLogs } from './logGenerator';
import { validateTrip } from './validators';

export class HosTripPlanner {
  /**
   * Plans a fully FMCSA-compliant trip schedule
   */
  public static async planTrip(
    request: TripPlanRequest,
    routeData: RouteData
  ): Promise<TripPlanResponse> {
    const startTimeStr = request.start_time || new Date().toISOString().split('T')[0] + 'T06:00:00.000Z';
    const startDate = new Date(startTimeStr);

    let currentTime = new Date(startDate.getTime());
    let currentCycleUsed = request.current_cycle_used || 0;
    const initialCycleUsed = currentCycleUsed;

    let drivingInWindow = 0;
    let windowStartTime: Date | null = null;
    let cumulativeDrivingSinceBreak = 0;
    let distanceSinceLastFuel = 0;
    let totalMilesDriven = 0;

    const events: TimelineEvent[] = [];
    const stops: Stop[] = [];
    let sequence = 1;

    // Helper to record an event
    const recordEvent = (
      type: EventType,
      status: DutyStatus,
      durationHours: number,
      distanceMiles: number,
      location: LocationPoint,
      reason: string
    ): TimelineEvent => {
      const startIso = currentTime.toISOString();
      const endMillis = currentTime.getTime() + Math.round(durationHours * 3600 * 1000);
      const endDate = new Date(endMillis);
      const endIso = endDate.toISOString();

      const event: TimelineEvent = {
        id: `evt-${sequence}`,
        type,
        status,
        start_time: startIso,
        end_time: endIso,
        duration_hours: Math.round(durationHours * 100) / 100,
        distance_miles: Math.round(distanceMiles * 10) / 10,
        location_name: location.name,
        city: location.city,
        state: location.state,
        lat: location.lat,
        lng: location.lng,
        reason,
        sequence: sequence++
      };

      events.push(event);
      currentTime = endDate;
      return event;
    };

    // Helper to calculate window elapsed hours
    const getWindowElapsed = (): number => {
      if (!windowStartTime) return 0;
      return (currentTime.getTime() - windowStartTime.getTime()) / (3600 * 1000);
    };

    // 1. Initial Pre-Trip Inspection (15 mins = 0.25h ON_DUTY_NOT_DRIVING)
    windowStartTime = new Date(currentTime.getTime());
    currentCycleUsed += 0.25;
    recordEvent(
      'OFF_DUTY',
      'ON_DUTY_NOT_DRIVING',
      0.25,
      0,
      request.current_location,
      'Pre-trip vehicle inspection & dispatch'
    );

    // Record origin stop
    stops.push({
      id: 'stop-origin',
      type: 'CURRENT',
      location: request.current_location,
      arrival_time: startTimeStr,
      departure_time: currentTime.toISOString(),
      duration_hours: 0.25,
      reason: 'Trip origin / Pre-trip inspection',
      hos_impact: 'On-duty 15m; starts 14h window',
      distance_from_start_miles: 0
    });

    // Helper for scheduling driving along a route leg
    const executeLegDriving = async (
      leg: RouteLeg,
      legName: string,
      destStopType: 'PICKUP' | 'DROPOFF',
      destStopDuration: number,
      destReason: string
    ) => {
      let remainingLegMiles = leg.distance_miles;
      let remainingLegHours = leg.driving_hours;
      const legSpeedMph = leg.driving_hours > 0 ? leg.distance_miles / leg.driving_hours : 55;

      let legDistanceProgress = 0;

      while (remainingLegHours > 0.01) {
        const windowElapsed = getWindowElapsed();

        // 1. Check 70-hour cycle limit
        if (currentCycleUsed >= HOS_CONSTANTS.CYCLE_LIMIT_HOURS) {
          // Mandatory 34-hour restart
          const restLoc = await resolveRouteLocation(leg.geometry, legDistanceProgress / leg.distance_miles, leg.from);
          recordEvent(
            'SLEEPER_BERTH',
            'SLEEPER_BERTH',
            HOS_CONSTANTS.MIN_CYCLE_RESTART_HOURS,
            0,
            restLoc,
            'Mandatory 34-Hour Restart (70-Hour Cycle reached)'
          );
          currentCycleUsed = 0;
          drivingInWindow = 0;
          cumulativeDrivingSinceBreak = 0;
          windowStartTime = new Date(currentTime.getTime());
          stops.push({
            id: `stop-restart-${stops.length + 1}`,
            type: 'SLEEPER',
            location: restLoc,
            arrival_time: events[events.length - 1].start_time,
            departure_time: currentTime.toISOString(),
            duration_hours: HOS_CONSTANTS.MIN_CYCLE_RESTART_HOURS,
            reason: '34-Hour Cycle Restart',
            hos_impact: 'Resets 70h cycle to 0, resets 11h driving and 14h window',
            distance_from_start_miles: totalMilesDriven
          });
          continue;
        }

        // 2. Check 11-hour driving or 14-hour window limit
        if (drivingInWindow >= HOS_CONSTANTS.MAX_DAILY_DRIVING_HOURS || windowElapsed >= HOS_CONSTANTS.MAX_DAILY_WINDOW_HOURS) {
          const restLoc = await resolveRouteLocation(leg.geometry, legDistanceProgress / leg.distance_miles, leg.from);
          recordEvent(
            'SLEEPER_BERTH',
            'SLEEPER_BERTH',
            HOS_CONSTANTS.MIN_DAILY_RESET_HOURS,
            0,
            restLoc,
            '10-Hour Daily Rest (Exhausted 11h driving / 14h window)'
          );
          drivingInWindow = 0;
          cumulativeDrivingSinceBreak = 0;
          windowStartTime = new Date(currentTime.getTime());
          stops.push({
            id: `stop-rest-${stops.length + 1}`,
            type: 'SLEEPER',
            location: restLoc,
            arrival_time: events[events.length - 1].start_time,
            departure_time: currentTime.toISOString(),
            duration_hours: HOS_CONSTANTS.MIN_DAILY_RESET_HOURS,
            reason: '10-Hour Sleeper Berth Daily Reset',
            hos_impact: 'Resets 11-hour driving limit and 14-hour window',
            distance_from_start_miles: totalMilesDriven
          });
          continue;
        }

        // 3. Check 8-hour cumulative driving 30-min break
        if (cumulativeDrivingSinceBreak >= HOS_CONSTANTS.MAX_CUMULATIVE_DRIVING_BEFORE_BREAK) {
          const breakLoc = await resolveRouteLocation(leg.geometry, legDistanceProgress / leg.distance_miles, leg.from);
          recordEvent(
            'REST_BREAK',
            'OFF_DUTY',
            HOS_CONSTANTS.MIN_REST_BREAK_HOURS,
            0,
            breakLoc,
            'Mandatory 30-Minute Rest Break (8h cumulative driving reached)'
          );
          cumulativeDrivingSinceBreak = 0;
          stops.push({
            id: `stop-break-${stops.length + 1}`,
            type: 'REST_BREAK',
            location: breakLoc,
            arrival_time: events[events.length - 1].start_time,
            departure_time: currentTime.toISOString(),
            duration_hours: HOS_CONSTANTS.MIN_REST_BREAK_HOURS,
            reason: 'Mandatory 30-Minute Break after 8h Driving',
            hos_impact: 'Fulfills FMCSA § 395.3(a)(3)(ii) rest break; counts against 14h window',
            distance_from_start_miles: totalMilesDriven
          });
          continue;
        }

        // 4. Check fuel threshold (fuel every 1,000 miles, trigger at ~920 miles)
        if (distanceSinceLastFuel >= HOS_CONSTANTS.FUELING_TRIGGER_MILES) {
          const fuelLoc = await resolveRouteLocation(leg.geometry, legDistanceProgress / leg.distance_miles, leg.from);
          recordEvent(
            'FUEL',
            'ON_DUTY_NOT_DRIVING',
            HOS_CONSTANTS.FUELING_DURATION_HOURS,
            0,
            fuelLoc,
            'Scheduled Fuel Stop (< 1,000-mile interval requirement)'
          );
          distanceSinceLastFuel = 0;
          currentCycleUsed += HOS_CONSTANTS.FUELING_DURATION_HOURS;
          // Fuel stop is >= 30 min on-duty non-driving, satisfies 30m break under 2020 FMCSA revision
          cumulativeDrivingSinceBreak = 0;
          stops.push({
            id: `stop-fuel-${stops.length + 1}`,
            type: 'FUEL',
            location: fuelLoc,
            arrival_time: events[events.length - 1].start_time,
            departure_time: currentTime.toISOString(),
            duration_hours: HOS_CONSTANTS.FUELING_DURATION_HOURS,
            reason: 'Fueling Stop',
            hos_impact: 'On-duty 30m; also fulfills 30m rest break requirement',
            distance_from_start_miles: totalMilesDriven
          });
          continue;
        }

        // Calculate maximum permissible driving duration in this chunk
        const availDrive = HOS_CONSTANTS.MAX_DAILY_DRIVING_HOURS - drivingInWindow;
        const availWindow = HOS_CONSTANTS.MAX_DAILY_WINDOW_HOURS - getWindowElapsed();
        const availBreak = HOS_CONSTANTS.MAX_CUMULATIVE_DRIVING_BEFORE_BREAK - cumulativeDrivingSinceBreak;
        const availCycle = HOS_CONSTANTS.CYCLE_LIMIT_HOURS - currentCycleUsed;
        const availFuelDistance = HOS_CONSTANTS.FUELING_TRIGGER_MILES - distanceSinceLastFuel;
        const availFuelHours = availFuelDistance > 0 && legSpeedMph > 0 ? availFuelDistance / legSpeedMph : 0;

        const maxDriveChunk = Math.min(
          remainingLegHours,
          availDrive,
          availWindow,
          availBreak,
          availCycle,
          availFuelHours
        );

        // If the chunk is negligible due to tight constraint, force constraint check
        if (maxDriveChunk <= 0.03) {
          // Trigger closest threshold
          if (availDrive <= 0.03 || availWindow <= 0.03) {
            drivingInWindow = HOS_CONSTANTS.MAX_DAILY_DRIVING_HOURS; // triggers reset in next loop
          } else if (availBreak <= 0.03) {
            cumulativeDrivingSinceBreak = HOS_CONSTANTS.MAX_CUMULATIVE_DRIVING_BEFORE_BREAK; // triggers break
          } else if (availFuelHours <= 0.03) {
            distanceSinceLastFuel = HOS_CONSTANTS.FUELING_TRIGGER_MILES; // triggers fuel
          } else {
            currentCycleUsed = HOS_CONSTANTS.CYCLE_LIMIT_HOURS; // triggers 34h restart
          }
          continue;
        }

        // Drive this chunk
        const driveMiles = Math.min(remainingLegMiles, maxDriveChunk * legSpeedMph);
        legDistanceProgress += driveMiles;
        totalMilesDriven += driveMiles;
        distanceSinceLastFuel += driveMiles;

        const chunkFraction = Math.min(1.0, legDistanceProgress / leg.distance_miles);
        const chunkLoc = await resolveRouteLocation(leg.geometry, chunkFraction, leg.to);

        recordEvent(
          'DRIVING',
          'DRIVING',
          maxDriveChunk,
          driveMiles,
          chunkLoc,
          `Driving along ${legName} (${Math.round(driveMiles)} mi)`
        );

        drivingInWindow += maxDriveChunk;
        cumulativeDrivingSinceBreak += maxDriveChunk;
        currentCycleUsed += maxDriveChunk;
        remainingLegHours -= maxDriveChunk;
        remainingLegMiles -= driveMiles;
      }

      // Leg complete - Arrive at destination stop (PICKUP or DROPOFF)
      currentCycleUsed += destStopDuration;
      // 1 hour non-driving satisfies 30m break
      cumulativeDrivingSinceBreak = 0;

      recordEvent(
        destStopType,
        'ON_DUTY_NOT_DRIVING',
        destStopDuration,
        0,
        leg.to,
        destReason
      );

      stops.push({
        id: `stop-${(destStopType || 'dropoff').toLowerCase()}`,
        type: destStopType,
        location: leg.to,
        arrival_time: events[events.length - 1].start_time,
        departure_time: currentTime.toISOString(),
        duration_hours: destStopDuration,
        reason: destReason,
        hos_impact: `On-duty ${destStopDuration}h; counts toward 14h window and 70h cycle`,
        distance_from_start_miles: totalMilesDriven
      });
    };

    // 2. Leg 1: Current -> Pickup
    await executeLegDriving(
      routeData.legs[0],
      `${request.current_location.name} → ${request.pickup_location.name}`,
      'PICKUP',
      HOS_CONSTANTS.PICKUP_DURATION_HOURS,
      'Freight pickup & bill of lading verification (1 hr on-duty)'
    );

    // 3. Leg 2: Pickup -> Dropoff
    await executeLegDriving(
      routeData.legs[1],
      `${request.pickup_location.name} → ${request.dropoff_location.name}`,
      'DROPOFF',
      HOS_CONSTANTS.DROPOFF_DURATION_HOURS,
      'Freight dropoff, unloading & proof of delivery (1 hr on-duty)'
    );

    // 4. Post-trip conclusion: 15 mins post-trip inspection
    currentCycleUsed += 0.25;
    recordEvent(
      'OFF_DUTY',
      'ON_DUTY_NOT_DRIVING',
      0.25,
      0,
      request.dropoff_location,
      'Post-trip inspection and completion paperwork'
    );

    // Transition to off-duty
    recordEvent(
      'OFF_DUTY',
      'OFF_DUTY',
      0.5,
      0,
      request.dropoff_location,
      'Released from work / Off-duty'
    );

    // Calculate total duration
    const totalDurationHours = Math.round(((currentTime.getTime() - startDate.getTime()) / (3600 * 1000)) * 100) / 100;
    const tripOnDutyHours = Math.round((currentCycleUsed - initialCycleUsed) * 100) / 100;
    const cycleRemaining = Math.max(0, Math.round((HOS_CONSTANTS.CYCLE_LIMIT_HOURS - currentCycleUsed) * 100) / 100);

    // Validate the trip
    const validationResult = validateTrip(events, initialCycleUsed);

    // Generate daily logs
    const dailyLogs = generateDailyLogs(events, {
      trip_id: `TRIP-${Date.now()}`,
      carrier_name: request.carrier_name || "John Doe's Transportation",
      carrier_office: request.carrier_office || 'Washington, D.C.',
      home_terminal: request.carrier_office || 'Chicago, IL',
      driver_name: request.driver_name || 'John E. Doe',
      driver_signature: request.driver_name || 'John E. Doe',
      truck_number: request.truck_number || '123',
      trailer_number: request.trailer_number || '20544',
      from_location: request.current_location.name,
      to_location: request.dropoff_location.name,
      shipping_doc_number: request.shipping_doc_number || '101601',
      shipper: request.shipper || 'Standard Freight Inc.',
      commodity: request.commodity || 'General Freight'
    });

    const hosSummary: HosSummary = {
      cycle_limit: HOS_CONSTANTS.CYCLE_LIMIT_HOURS,
      cycle_used_before_trip: initialCycleUsed,
      trip_on_duty_hours: tripOnDutyHours,
      cycle_used_after_trip: Math.round(currentCycleUsed * 100) / 100,
      cycle_remaining: cycleRemaining,
      current_cycle_used: Math.round(currentCycleUsed * 100) / 100,
      cycle_hours_remaining: cycleRemaining,
      compliant: validationResult.compliant,
      driving_remaining: Math.max(0, Math.round((HOS_CONSTANTS.MAX_DAILY_DRIVING_HOURS - drivingInWindow) * 100) / 100),
      window_remaining: Math.max(0, Math.round((HOS_CONSTANTS.MAX_DAILY_WINDOW_HOURS - getWindowElapsed()) * 100) / 100),
      break_required_in: Math.max(0, Math.round((HOS_CONSTANTS.MAX_CUMULATIVE_DRIVING_BEFORE_BREAK - cumulativeDrivingSinceBreak) * 100) / 100),
      total_rest_hours: Math.round(events.filter(e => e.status === 'OFF_DUTY' || e.status === 'SLEEPER_BERTH').reduce((acc, e) => acc + e.duration_hours, 0) * 100) / 100
    };

    return {
      id: `trip-${Date.now()}`,
      trip: {
        distance_miles: routeData.total_distance_miles,
        driving_hours: routeData.total_driving_hours,
        total_duration_hours: totalDurationHours,
        current_location: request.current_location,
        pickup_location: request.pickup_location,
        dropoff_location: request.dropoff_location,
        start_time: startTimeStr,
        end_time: currentTime.toISOString(),
        route_legs: routeData.legs,
        all_coordinates: routeData.all_coordinates
      },
      hos: hosSummary,
      events,
      stops,
      daily_logs: dailyLogs,
      violations: validationResult.violations,
      compliance_checks: validationResult.checks,
      meta: {
        rules_applied: [
          'Property-Carrying CMV Driver',
          '70-Hour / 8-Day Rolling Cycle Limit',
          '11-Hour Maximum Driving Limit',
          '14-Hour Consecutive Driving Window',
          '30-Minute Break after 8 Cumulative Driving Hours',
          '10 Consecutive Hours Sleeper Berth / Off Duty Reset',
          'Fueling Interval <= 1,000 Miles (Scheduled at ~920 mi)',
          '1 Hour Pickup On-Duty Not Driving',
          '1 Hour Dropoff On-Duty Not Driving'
        ],
        assumptions: [
          'Property-carrying CMV',
          '70-hour / 8-day rule',
          'No adverse driving conditions',
          'Fueling frequency: at least once every 1,000 miles',
          'Fueling duration: 30 minutes on-duty not driving',
          '1 hour pickup time (on-duty not driving)',
          '1 hour dropoff time (on-duty not driving)',
          'Overnight rest: 10 consecutive hours in sleeper berth'
        ]
      }
    };
  }
}

async function resolveRouteLocation(
  geometry: [number, number][],
  fraction: number,
  fallback: LocationPoint
): Promise<LocationPoint> {
  const coord = interpolateCoordinate(geometry, fraction);
  if (!coord || (coord[0] === 0 && coord[1] === 0)) {
    return fallback;
  }
  const geo = await reverseGeocode(coord[0], coord[1]);
  return {
    name: geo.name,
    city: geo.city,
    state: geo.state,
    lat: Math.round(coord[0] * 10000) / 10000,
    lng: Math.round(coord[1] * 10000) / 10000
  };
}
