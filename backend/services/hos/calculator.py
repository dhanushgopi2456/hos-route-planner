"""
Core pure HOS calculation utilities based on FMCSA CFR Part 395
Interstate Truck Driver's Guide to Hours of Service (April 2022)
"""

CYCLE_LIMIT_HOURS = 70.0
CYCLE_DAYS = 8
MAX_DAILY_DRIVING_HOURS = 11.0
MAX_DAILY_WINDOW_HOURS = 14.0
MAX_CUMULATIVE_DRIVING_BEFORE_BREAK = 8.0
MIN_REST_BREAK_HOURS = 0.5   # 30 minutes
MIN_DAILY_RESET_HOURS = 10.0  # 10 consecutive hours
MIN_CYCLE_RESTART_HOURS = 34.0
MAX_FUELING_INTERVAL_MILES = 1000.0
FUELING_TRIGGER_MILES = 920.0
FUELING_DURATION_HOURS = 0.5
PICKUP_DURATION_HOURS = 1.0
DROPOFF_DURATION_HOURS = 1.0


def calculate_remaining_cycle(current_cycle_used: float, limit: float = CYCLE_LIMIT_HOURS) -> float:
    return max(0.0, round(limit - current_cycle_used, 2))


def calculate_driving_remaining(driving_in_window: float, limit: float = MAX_DAILY_DRIVING_HOURS) -> float:
    return max(0.0, round(limit - driving_in_window, 2))


def calculate_window_remaining(window_elapsed_time: float, limit: float = MAX_DAILY_WINDOW_HOURS) -> float:
    return max(0.0, round(limit - window_elapsed_time, 2))


def calculate_break_remaining(cumulative_driving_since_break: float, limit: float = MAX_CUMULATIVE_DRIVING_BEFORE_BREAK) -> float:
    return max(0.0, round(limit - cumulative_driving_since_break, 2))


def can_drive(driving_rem: float, window_rem: float, cycle_rem: float, break_rem: float) -> bool:
    return driving_rem > 0 and window_rem > 0 and cycle_rem > 0 and break_rem > 0


def requires_30_minute_break(cumulative_driving_since_break: float) -> bool:
    return cumulative_driving_since_break >= MAX_CUMULATIVE_DRIVING_BEFORE_BREAK


def requires_daily_reset(driving_in_window: float, window_elapsed_time: float) -> bool:
    return (
        driving_in_window >= MAX_DAILY_DRIVING_HOURS or
        window_elapsed_time >= MAX_DAILY_WINDOW_HOURS
    )


def requires_fuel_stop(distance_since_last_fuel: float, threshold: float = FUELING_TRIGGER_MILES) -> bool:
    return distance_since_last_fuel >= threshold
