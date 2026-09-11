from datetime import datetime
from typing import List, Dict, Any
from .calculator import (
    CYCLE_LIMIT_HOURS,
    MAX_DAILY_DRIVING_HOURS,
    MAX_DAILY_WINDOW_HOURS,
    MAX_CUMULATIVE_DRIVING_BEFORE_BREAK,
    MIN_REST_BREAK_HOURS,
    MIN_DAILY_RESET_HOURS,
    MIN_CYCLE_RESTART_HOURS,
    MAX_FUELING_INTERVAL_MILES
)


def validate_trip(events: List[Dict[str, Any]], initial_cycle_used: float = 0.0) -> Dict[str, Any]:
    violations = []
    checks = []

    max_driving_in_window = 0.0
    max_window_elapsed = 0.0
    max_cumulative_driving = 0.0
    max_distance_between_fuel = 0.0
    has_overlap = False
    has_gap = False
    has_negative_duration = False

    current_driving_in_window = 0.0
    current_window_start_ts = None
    current_cumulative_driving = 0.0
    current_distance_since_fuel = 0.0
    cycle_used = initial_cycle_used

    pickup_count = 0
    pickup_duration = 0.0
    dropoff_count = 0
    dropoff_duration = 0.0

    def parse_iso(ts: str) -> float:
        clean = ts.replace('Z', '+00:00')
        return datetime.fromisoformat(clean).timestamp()

    for i, ev in enumerate(events):
        start_ts = parse_iso(ev["start_time"])
        end_ts = parse_iso(ev["end_time"])
        duration = float(ev["duration_hours"])
        status = ev["status"]
        ev_type = ev.get("type", status)

        if duration < 0 or end_ts < start_ts:
            has_negative_duration = True
            violations.append({
                "type": "NEGATIVE_DURATION",
                "severity": "ERROR",
                "message": f"Event {ev.get('id')} has negative duration: {duration} hours",
                "affected_event_id": ev.get("id")
            })

        if i > 0:
            prev_end_ts = parse_iso(events[i - 1]["end_time"])
            diff = start_ts - prev_end_ts
            if diff < -60:
                has_overlap = True
                violations.append({
                    "type": "TIMELINE_OVERLAP",
                    "severity": "ERROR",
                    "message": f"Event {ev.get('id')} overlaps with previous event",
                    "affected_event_id": ev.get("id")
                })
            elif diff > 60:
                has_gap = True
                violations.append({
                    "type": "TIMELINE_GAP",
                    "severity": "ERROR",
                    "message": f"Unexplained timeline gap of {int(diff/60)} minutes before event {ev.get('id')}",
                    "affected_event_id": ev.get("id")
                })

        if status in ("DRIVING", "ON_DUTY_NOT_DRIVING"):
            cycle_used += duration
            if current_window_start_ts is None:
                current_window_start_ts = start_ts

        if status in ("OFF_DUTY", "SLEEPER_BERTH") and duration >= MIN_DAILY_RESET_HOURS:
            current_driving_in_window = 0.0
            current_window_start_ts = None
            current_cumulative_driving = 0.0

        if status in ("OFF_DUTY", "SLEEPER_BERTH") and duration >= MIN_CYCLE_RESTART_HOURS:
            cycle_used = 0.0
            current_driving_in_window = 0.0
            current_window_start_ts = None
            current_cumulative_driving = 0.0

        if status == "DRIVING":
            current_driving_in_window += duration
            current_cumulative_driving += duration
            current_distance_since_fuel += float(ev.get("distance_miles", 0))

            if current_driving_in_window > max_driving_in_window:
                max_driving_in_window = current_driving_in_window
            if current_cumulative_driving > max_cumulative_driving:
                max_cumulative_driving = current_cumulative_driving
            if current_distance_since_fuel > max_distance_between_fuel:
                max_distance_between_fuel = current_distance_since_fuel

            if current_driving_in_window > MAX_DAILY_DRIVING_HOURS + 0.01:
                violations.append({
                    "type": "11_HOUR_LIMIT",
                    "severity": "ERROR",
                    "message": f"Driving time reached {current_driving_in_window:.2f}h, exceeding 11-hour limit",
                    "affected_event_id": ev.get("id")
                })

            if current_window_start_ts is not None:
                elapsed = (end_ts - current_window_start_ts) / 3600.0
                if elapsed > max_window_elapsed:
                    max_window_elapsed = elapsed
                if elapsed > MAX_DAILY_WINDOW_HOURS + 0.01:
                    violations.append({
                        "type": "14_HOUR_WINDOW",
                        "severity": "ERROR",
                        "message": f"Driving occurred at {elapsed:.2f}h from window start, exceeding 14-hour window",
                        "affected_event_id": ev.get("id")
                    })

            if current_cumulative_driving > MAX_CUMULATIVE_DRIVING_BEFORE_BREAK + 0.01:
                violations.append({
                    "type": "30_MINUTE_BREAK",
                    "severity": "ERROR",
                    "message": f"Cumulative driving reached {current_cumulative_driving:.2f}h without 30-min break",
                    "affected_event_id": ev.get("id")
                })

        if status != "DRIVING" and duration >= MIN_REST_BREAK_HOURS:
            current_cumulative_driving = 0.0

        if ev_type == "FUEL":
            current_distance_since_fuel = 0.0
        elif ev_type == "PICKUP":
            pickup_count += 1
            pickup_duration += duration
        elif ev_type == "DROPOFF":
            dropoff_count += 1
            dropoff_duration += duration

        if cycle_used > CYCLE_LIMIT_HOURS + 0.01:
            violations.append({
                "type": "70_HOUR_CYCLE",
                "severity": "ERROR",
                "message": f"Total on-duty hours reached {cycle_used:.2f}h, exceeding 70-hour cycle",
                "affected_event_id": ev.get("id")
            })

    if max_distance_between_fuel > MAX_FUELING_INTERVAL_MILES:
        violations.append({
            "type": "FUEL_INTERVAL",
            "severity": "ERROR",
            "message": f"Fueling interval reached {max_distance_between_fuel} miles (limit: 1,000 mi)"
        })

    checks.append({
        "id": "check-11h",
        "title": "11-Hour Driving Limit",
        "passed": max_driving_in_window <= MAX_DAILY_DRIVING_HOURS + 0.01,
        "detail": f"Max driving in window was {max_driving_in_window:.2f}h"
    })
    checks.append({
        "id": "check-14h",
        "title": "14-Hour Consecutive Window",
        "passed": max_window_elapsed <= MAX_DAILY_WINDOW_HOURS + 0.01,
        "detail": f"Max window driving span was {max_window_elapsed:.2f}h"
    })
    checks.append({
        "id": "check-break",
        "title": "30-Minute Break after 8h Driving",
        "passed": max_cumulative_driving <= MAX_CUMULATIVE_DRIVING_BEFORE_BREAK + 0.01,
        "detail": f"Max cumulative driving before break was {max_cumulative_driving:.2f}h"
    })
    checks.append({
        "id": "check-cycle",
        "title": "70-Hour / 8-Day Limit",
        "passed": cycle_used <= CYCLE_LIMIT_HOURS + 0.01,
        "detail": f"Projected cycle usage is {cycle_used:.2f}h"
    })
    checks.append({
        "id": "check-fuel",
        "title": "Fueling Interval <= 1,000 Miles",
        "passed": max_distance_between_fuel <= MAX_FUELING_INTERVAL_MILES,
        "detail": f"Max distance between fuel stops was {max_distance_between_fuel:.0f} miles"
    })
    checks.append({
        "id": "check-pickup",
        "title": "Pickup Stop (1 Hour On-Duty)",
        "passed": pickup_count >= 1 and pickup_duration >= 0.99,
        "detail": f"Scheduled {pickup_duration:.1f}h on-duty at pickup"
    })
    checks.append({
        "id": "check-dropoff",
        "title": "Dropoff Stop (1 Hour On-Duty)",
        "passed": dropoff_count >= 1 and dropoff_duration >= 0.99,
        "detail": f"Scheduled {dropoff_duration:.1f}h on-duty at dropoff"
    })
    checks.append({
        "id": "check-integrity",
        "title": "Timeline Integrity & Continuity",
        "passed": not has_overlap and not has_gap and not has_negative_duration,
        "detail": "No overlaps, gaps, or negative durations"
    })

    return {
        "compliant": len(violations) == 0,
        "violations": violations,
        "checks": checks
    }


def validate_daily_log(log: Dict[str, Any]) -> Dict[str, Any]:
    errors = []
    total = (
        float(log.get("off_duty_hours", 0)) +
        float(log.get("sleeper_berth_hours", 0)) +
        float(log.get("driving_hours", 0)) +
        float(log.get("on_duty_not_driving_hours", 0))
    )
    if abs(round(total, 2) - 24.0) > 0.02:
        errors.append(f"Daily log total {total:.2f}h does not equal 24.00 hours")

    return {
        "valid": len(errors) == 0,
        "errors": errors
    }
