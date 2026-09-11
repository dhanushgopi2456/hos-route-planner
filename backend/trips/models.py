import uuid
from django.db import models


class Location(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=50, blank=True, null=True)
    country = models.CharField(max_length=50, default="USA")
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)

    def __str__(self):
        return self.name


class Trip(models.Model):
    STATUS_CHOICES = [
        ("PLANNED", "Planned"),
        ("COMPLIANT", "Compliant"),
        ("VIOLATION", "Violation"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    current_location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name="trips_origin")
    pickup_location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name="trips_pickup")
    dropoff_location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name="trips_dropoff")
    current_cycle_used = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    total_distance_miles = models.DecimalField(max_digits=8, decimal_places=2, default=0.0)
    total_driving_hours = models.DecimalField(max_digits=6, decimal_places=2, default=0.0)
    total_duration_hours = models.DecimalField(max_digits=6, decimal_places=2, default=0.0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="COMPLIANT")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Trip {self.id} ({self.current_location.name} -> {self.dropoff_location.name})"


class TripEvent(models.Model):
    DUTY_STATUS_CHOICES = [
        ("OFF_DUTY", "Off Duty"),
        ("SLEEPER_BERTH", "Sleeper Berth"),
        ("DRIVING", "Driving"),
        ("ON_DUTY_NOT_DRIVING", "On Duty (Not Driving)"),
    ]

    EVENT_TYPE_CHOICES = [
        ("DRIVING", "Driving"),
        ("PICKUP", "Pickup"),
        ("DROPOFF", "Dropoff"),
        ("FUEL", "Fuel"),
        ("REST_BREAK", "Rest Break"),
        ("SLEEPER_BERTH", "Sleeper Berth"),
        ("OFF_DUTY", "Off Duty"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name="events")
    event_type = models.CharField(max_length=30, choices=EVENT_TYPE_CHOICES)
    duty_status = models.CharField(max_length=30, choices=DUTY_STATUS_CHOICES)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    duration_hours = models.DecimalField(max_digits=5, decimal_places=2)
    location = models.ForeignKey(Location, on_delete=models.SET_NULL, null=True, blank=True)
    distance_miles = models.DecimalField(max_digits=7, decimal_places=2, default=0.0)
    reason = models.TextField()
    sequence = models.IntegerField(default=1)

    class Meta:
        ordering = ["sequence", "start_time"]


class FuelStop(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name="fuel_stops")
    location = models.ForeignKey(Location, on_delete=models.CASCADE)
    arrival_time = models.DateTimeField()
    departure_time = models.DateTimeField()
    duration = models.DecimalField(max_digits=4, decimal_places=2, default=0.5)


class RestStop(models.Model):
    REST_TYPE_CHOICES = [
        ("30_MIN_BREAK", "30-Minute Break"),
        ("10_HOUR_SLEEPER", "10-Hour Sleeper Berth"),
        ("34_HOUR_RESTART", "34-Hour Restart"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name="rest_stops")
    location = models.ForeignKey(Location, on_delete=models.CASCADE)
    arrival_time = models.DateTimeField()
    departure_time = models.DateTimeField()
    duration = models.DecimalField(max_digits=5, decimal_places=2)
    rest_type = models.CharField(max_length=30, choices=REST_TYPE_CHOICES)


class DailyLog(models.Model):
    VALIDATION_CHOICES = [
        ("VALID", "Valid"),
        ("INVALID", "Invalid"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name="daily_logs")
    date = models.DateField()
    off_duty_hours = models.DecimalField(max_digits=4, decimal_places=2, default=0.0)
    sleeper_berth_hours = models.DecimalField(max_digits=4, decimal_places=2, default=0.0)
    driving_hours = models.DecimalField(max_digits=4, decimal_places=2, default=0.0)
    on_duty_not_driving_hours = models.DecimalField(max_digits=4, decimal_places=2, default=0.0)
    total_miles = models.DecimalField(max_digits=7, decimal_places=2, default=0.0)
    remarks = models.JSONField(default=list)
    validation_status = models.CharField(max_length=20, choices=VALIDATION_CHOICES, default="VALID")
