from rest_framework import serializers
from .models import Location, Trip, TripEvent, FuelStop, RestStop, DailyLog


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = "__all__"


class TripEventSerializer(serializers.ModelSerializer):
    location_name = serializers.CharField(source="location.name", read_only=True)

    class Meta:
        model = TripEvent
        fields = "__all__"


class FuelStopSerializer(serializers.ModelSerializer):
    location = LocationSerializer(read_only=True)

    class Meta:
        model = FuelStop
        fields = "__all__"


class RestStopSerializer(serializers.ModelSerializer):
    location = LocationSerializer(read_only=True)

    class Meta:
        model = RestStop
        fields = "__all__"


class DailyLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyLog
        fields = "__all__"


class TripDetailSerializer(serializers.ModelSerializer):
    current_location = LocationSerializer(read_only=True)
    pickup_location = LocationSerializer(read_only=True)
    dropoff_location = LocationSerializer(read_only=True)
    events = TripEventSerializer(many=True, read_only=True)
    fuel_stops = FuelStopSerializer(many=True, read_only=True)
    rest_stops = RestStopSerializer(many=True, read_only=True)
    daily_logs = DailyLogSerializer(many=True, read_only=True)

    class Meta:
        model = Trip
        fields = "__all__"
