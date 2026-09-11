export type DutyStatus = 'OFF_DUTY' | 'SLEEPER_BERTH' | 'DRIVING' | 'ON_DUTY_NOT_DRIVING';

export type EventType =
  | 'DRIVING'
  | 'PICKUP'
  | 'DROPOFF'
  | 'FUEL'
  | 'REST_BREAK'
  | 'SLEEPER_BERTH'
  | 'OFF_DUTY';

export interface LocationPoint {
  name: string;
  lat: number;
  lng: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
}

export interface RouteLeg {
  from: LocationPoint;
  to: LocationPoint;
  distance_miles: number;
  driving_hours: number;
  geometry: [number, number][]; // [lat, lng] array for Leaflet
}

export interface RouteData {
  total_distance_miles: number;
  total_driving_hours: number;
  legs: RouteLeg[];
  all_coordinates: [number, number][];
}

export interface TimelineEvent {
  id: string;
  type: EventType;
  status: DutyStatus;
  start_time: string; // ISO 8601
  end_time: string;   // ISO 8601
  duration_hours: number;
  distance_miles: number;
  location_name: string;
  city?: string;
  state?: string;
  lat?: number;
  lng?: number;
  reason: string;
  sequence: number;
  day_index?: number;
  is_split?: boolean;
  original_event_id?: string;
}

export interface Stop {
  id: string;
  type: 'CURRENT' | 'PICKUP' | 'DROPOFF' | 'FUEL' | 'REST_BREAK' | 'SLEEPER';
  location: LocationPoint;
  arrival_time: string;
  departure_time: string;
  duration_hours: number;
  reason: string;
  hos_impact: string;
  distance_from_start_miles: number;
}

export interface Violation {
  type: string;
  severity: 'ERROR' | 'WARNING';
  message: string;
  start_time?: string;
  end_time?: string;
  affected_event_id?: string;
}

export interface ComplianceCheck {
  id: string;
  title: string;
  passed: boolean;
  detail: string;
}

export interface HosSummary {
  cycle_limit: number;
  cycle_used_before_trip: number;
  trip_on_duty_hours: number;
  cycle_used_after_trip: number;
  cycle_remaining: number;
  current_cycle_used?: number;
  cycle_hours_remaining?: number;
  compliant: boolean;
  driving_remaining: number;
  window_remaining: number;
  break_required_in: number;
  total_rest_hours: number;
}

export interface LogRemark {
  time: string;
  location: string;
  note: string;
  status: DutyStatus;
  minutes_from_midnight: number;
}

export interface DailyLog {
  id: string;
  trip_id: string;
  day_number: number;
  date: string; // YYYY-MM-DD
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
  off_duty_hours: number;
  sleeper_berth_hours: number;
  driving_hours: number;
  on_duty_not_driving_hours: number;
  total_hours: number; // Must equal 24.00
  total_miles_driving_today: number;
  total_mileage_today: number;
  events: TimelineEvent[];
  remarks: LogRemark[];
  validation_status: 'VALID' | 'INVALID';
  validation_errors: string[];
  recap: {
    on_duty_today: number;
    total_last_7_days: number;
    total_last_8_days: number;
    available_tomorrow: number;
  };
}

export interface TripPlanRequest {
  current_location: LocationPoint;
  pickup_location: LocationPoint;
  dropoff_location: LocationPoint;
  current_cycle_used: number;
  start_time?: string;
  carrier_name?: string;
  carrier_office?: string;
  driver_name?: string;
  truck_number?: string;
  trailer_number?: string;
  shipping_doc_number?: string;
  shipper?: string;
  commodity?: string;
}

export interface TripPlanResponse {
  id: string;
  trip: {
    distance_miles: number;
    driving_hours: number;
    total_duration_hours: number;
    current_location: LocationPoint;
    pickup_location: LocationPoint;
    dropoff_location: LocationPoint;
    start_time: string;
    end_time: string;
    route_legs: RouteLeg[];
    all_coordinates: [number, number][];
  };
  hos: HosSummary;
  events: TimelineEvent[];
  stops: Stop[];
  daily_logs: DailyLog[];
  violations: Violation[];
  compliance_checks: ComplianceCheck[];
  meta: {
    rules_applied: string[];
    assumptions: string[];
  };
}
