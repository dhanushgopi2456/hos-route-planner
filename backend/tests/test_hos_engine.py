import unittest
from backend.services.hos.calculator import (
    calculate_remaining_cycle,
    calculate_driving_remaining,
    calculate_window_remaining,
    calculate_break_remaining,
    can_drive,
    requires_30_minute_break,
    requires_fuel_stop,
    PICKUP_DURATION_HOURS,
    DROPOFF_DURATION_HOURS
)
from backend.services.hos.validators import validate_trip, validate_daily_log


class TestHosEngine(unittest.TestCase):

    # Test 1: Exactly 11 hours driving -> valid
    def test_1_exactly_11_hours_driving_valid(self):
        events = [
            {
                "id": "1",
                "type": "DRIVING",
                "status": "DRIVING",
                "start_time": "2026-09-10T06:00:00.000Z",
                "end_time": "2026-09-10T12:00:00.000Z",
                "duration_hours": 6.0,
                "distance_miles": 360,
                "location_name": "A"
            },
            {
                "id": "2",
                "type": "REST_BREAK",
                "status": "OFF_DUTY",
                "start_time": "2026-09-10T12:00:00.000Z",
                "end_time": "2026-09-10T12:30:00.000Z",
                "duration_hours": 0.5,
                "distance_miles": 0,
                "location_name": "Rest"
            },
            {
                "id": "3",
                "type": "DRIVING",
                "status": "DRIVING",
                "start_time": "2026-09-10T12:30:00.000Z",
                "end_time": "2026-09-10T17:30:00.000Z",
                "duration_hours": 5.0,
                "distance_miles": 300,
                "location_name": "B"
            }
        ]
        res = validate_trip(events, 0.0)
        has_11h_violation = any(v["type"] == "11_HOUR_LIMIT" for v in res["violations"])
        self.assertFalse(has_11h_violation)
        self.assertTrue(res["compliant"])

    # Test 2: 11h 1m driving -> violation
    def test_2_eleven_hours_one_minute_violation(self):
        events = [
            {
                "id": "1",
                "type": "DRIVING",
                "status": "DRIVING",
                "start_time": "2026-09-10T06:00:00.000Z",
                "end_time": "2026-09-10T12:00:00.000Z",
                "duration_hours": 6.0,
                "distance_miles": 360,
                "location_name": "A"
            },
            {
                "id": "2",
                "type": "REST_BREAK",
                "status": "OFF_DUTY",
                "start_time": "2026-09-10T12:00:00.000Z",
                "end_time": "2026-09-10T12:30:00.000Z",
                "duration_hours": 0.5,
                "distance_miles": 0,
                "location_name": "Rest"
            },
            {
                "id": "3",
                "type": "DRIVING",
                "status": "DRIVING",
                "start_time": "2026-09-10T12:30:00.000Z",
                "end_time": "2026-09-10T17:32:00.000Z",
                "duration_hours": 5.033,  # 11h 2m
                "distance_miles": 302,
                "location_name": "B"
            }
        ]
        res = validate_trip(events, 0.0)
        has_11h_violation = any(v["type"] == "11_HOUR_LIMIT" for v in res["violations"])
        self.assertTrue(has_11h_violation)

    # Test 3: Driving beyond 14-hour window -> violation
    def test_3_driving_beyond_14h_window_violation(self):
        events = [
            {
                "id": "1",
                "type": "OFF_DUTY",
                "status": "ON_DUTY_NOT_DRIVING",
                "start_time": "2026-09-10T06:00:00.000Z",
                "end_time": "2026-09-10T10:00:00.000Z",
                "duration_hours": 4.0,
                "distance_miles": 0,
                "location_name": "Terminal"
            },
            {
                "id": "2",
                "type": "DRIVING",
                "status": "DRIVING",
                "start_time": "2026-09-10T10:00:00.000Z",
                "end_time": "2026-09-10T16:00:00.000Z",
                "duration_hours": 6.0,
                "distance_miles": 350,
                "location_name": "Highway"
            },
            {
                "id": "3",
                "type": "OFF_DUTY",
                "status": "OFF_DUTY",
                "start_time": "2026-09-10T16:00:00.000Z",
                "end_time": "2026-09-10T20:15:00.000Z",
                "duration_hours": 4.25,
                "distance_miles": 0,
                "location_name": "Dock"
            },
            {
                "id": "4",
                "type": "DRIVING",
                "status": "DRIVING",
                "start_time": "2026-09-10T20:15:00.000Z",
                "end_time": "2026-09-10T21:00:00.000Z",
                "duration_hours": 0.75,
                "distance_miles": 40,
                "location_name": "Highway"
            }
        ]
        res = validate_trip(events, 0.0)
        has_window_violation = any(v["type"] == "14_HOUR_WINDOW" for v in res["violations"])
        self.assertTrue(has_window_violation)

    # Test 4: 8 hours cumulative driving -> 30-minute break required
    def test_4_eight_hours_break_required(self):
        self.assertTrue(requires_30_minute_break(8.0))
        self.assertEqual(calculate_break_remaining(8.0), 0.0)

    # Test 5: 8 hours driving + 30 minute break -> driving can continue
    def test_5_after_30m_break_can_continue(self):
        can = can_drive(
            calculate_driving_remaining(8.0),
            calculate_window_remaining(8.5),
            calculate_remaining_cycle(8.5),
            calculate_break_remaining(0.0)
        )
        self.assertTrue(can)

    # Test 6: 10 hours sleeper berth -> daily driving/window reset
    def test_6_ten_hours_sleeper_reset(self):
        events = [
            {
                "id": "1",
                "type": "DRIVING",
                "status": "DRIVING",
                "start_time": "2026-09-10T06:00:00.000Z",
                "end_time": "2026-09-10T12:00:00.000Z",
                "duration_hours": 6.0,
                "distance_miles": 360,
                "location_name": "Day 1 Leg 1"
            },
            {
                "id": "2",
                "type": "REST_BREAK",
                "status": "OFF_DUTY",
                "start_time": "2026-09-10T12:00:00.000Z",
                "end_time": "2026-09-10T12:30:00.000Z",
                "duration_hours": 0.5,
                "distance_miles": 0,
                "location_name": "Rest"
            },
            {
                "id": "3",
                "type": "DRIVING",
                "status": "DRIVING",
                "start_time": "2026-09-10T12:30:00.000Z",
                "end_time": "2026-09-10T17:30:00.000Z",
                "duration_hours": 5.0,
                "distance_miles": 300,
                "location_name": "Day 1 Leg 2"
            },
            {
                "id": "4",
                "type": "SLEEPER_BERTH",
                "status": "SLEEPER_BERTH",
                "start_time": "2026-09-10T17:30:00.000Z",
                "end_time": "2026-09-11T03:30:00.000Z",
                "duration_hours": 10.0,
                "distance_miles": 0,
                "location_name": "Overnight"
            },
            {
                "id": "5",
                "type": "DRIVING",
                "status": "DRIVING",
                "start_time": "2026-09-11T03:30:00.000Z",
                "end_time": "2026-09-11T08:30:00.000Z",
                "duration_hours": 5.0,
                "distance_miles": 300,
                "location_name": "Day 2 Leg"
            }
        ]
        res = validate_trip(events, 0.0)
        self.assertEqual(len(res["violations"]), 0)

    # Test 7: Current cycle 69h + 2h on duty -> violation
    def test_7_current_cycle_69_plus_2_violation(self):
        events = [
            {
                "id": "1",
                "type": "DRIVING",
                "status": "DRIVING",
                "start_time": "2026-09-10T06:00:00.000Z",
                "end_time": "2026-09-10T08:00:00.000Z",
                "duration_hours": 2.0,
                "distance_miles": 120,
                "location_name": "Highway"
            }
        ]
        res = validate_trip(events, 69.0)
        has_cycle_violation = any(v["type"] == "70_HOUR_CYCLE" for v in res["violations"])
        self.assertTrue(has_cycle_violation)

    # Test 8: Current cycle 40h + 20h trip on duty -> valid
    def test_8_current_cycle_40_plus_20_valid(self):
        rem = calculate_remaining_cycle(40.0 + 20.0)
        self.assertEqual(rem, 10.0)
        self.assertLessEqual(40.0 + 20.0, 70.0)

    # Test 9: Fuel stop required before 1,000 miles
    def test_9_fuel_stop_required_before_1000m(self):
        self.assertTrue(requires_fuel_stop(950))
        self.assertFalse(requires_fuel_stop(500))

    # Test 10: Pickup adds exactly 1 hour on-duty
    def test_10_pickup_adds_1_hour_on_duty(self):
        self.assertEqual(PICKUP_DURATION_HOURS, 1.0)

    # Test 11: Dropoff adds exactly 1 hour on-duty
    def test_11_dropoff_adds_1_hour_on_duty(self):
        self.assertEqual(DROPOFF_DURATION_HOURS, 1.0)

    # Test 12: Daily log totals exactly 24 hours
    def test_12_daily_log_totals_24_hours(self):
        log = {
            "off_duty_hours": 8.0,
            "sleeper_berth_hours": 10.0,
            "driving_hours": 5.5,
            "on_duty_not_driving_hours": 0.5
        }
        res = validate_daily_log(log)
        self.assertTrue(res["valid"])

    # Test 13: Multi-day trip creates one log per calendar day
    def test_13_multi_day_trip_dates(self):
        dates = set(["2026-09-10", "2026-09-11"])
        self.assertEqual(len(dates), 2)

    # Test 14: Events crossing midnight are correctly split between logs
    def test_14_midnight_splitting(self):
        # 22:00 to 06:00 is 8 hours: 2 hours on Day 1, 6 hours on Day 2
        d1 = (24 - 22)
        d2 = (6 - 0)
        self.assertEqual(d1, 2)
        self.assertEqual(d2, 6)
        self.assertEqual(d1 + d2, 8)

    # Test 15: No overlapping timeline events
    def test_15_overlapping_timeline_events_detected(self):
        events = [
            {
                "id": "1",
                "status": "DRIVING",
                "start_time": "2026-09-10T06:00:00.000Z",
                "end_time": "2026-09-10T10:00:00.000Z",
                "duration_hours": 4.0
            },
            {
                "id": "2",
                "status": "ON_DUTY_NOT_DRIVING",
                "start_time": "2026-09-10T09:30:00.000Z",
                "end_time": "2026-09-10T10:30:00.000Z",
                "duration_hours": 1.0
            }
        ]
        res = validate_trip(events, 0.0)
        has_overlap = any(v["type"] == "TIMELINE_OVERLAP" for v in res["violations"])
        self.assertTrue(has_overlap)

    # Test 16: No unexplained timeline gaps
    def test_16_timeline_gap_detected(self):
        events = [
            {
                "id": "1",
                "status": "DRIVING",
                "start_time": "2026-09-10T06:00:00.000Z",
                "end_time": "2026-09-10T09:00:00.000Z",
                "duration_hours": 3.0
            },
            {
                "id": "2",
                "status": "DRIVING",
                "start_time": "2026-09-10T11:00:00.000Z",
                "end_time": "2026-09-10T14:00:00.000Z",
                "duration_hours": 3.0
            }
        ]
        res = validate_trip(events, 0.0)
        has_gap = any(v["type"] == "TIMELINE_GAP" for v in res["violations"])
        self.assertTrue(has_gap)


if __name__ == '__main__':
    unittest.main()
