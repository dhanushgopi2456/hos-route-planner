import json
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import ListAPIView, RetrieveAPIView
from .models import Trip, DailyLog, TripEvent
from .serializers import TripDetailSerializer, DailyLogSerializer, TripEventSerializer
from backend.services.hos.calculator import (
    calculate_remaining_cycle,
    calculate_driving_remaining,
    calculate_window_remaining,
    calculate_break_remaining,
    HOS_CONSTANTS
)
from backend.services.hos.validators import validate_trip, validate_daily_log


class HealthCheckView(APIView):
    def get(self, request):
        return Response({"status": "ok", "service": "Django DRF HOS Backend"})


class HosRulesView(APIView):
    def get(self, request):
        return Response({
            "rule_set": "FMCSA 49 CFR Part 395 (Property-Carrying CMV)",
            "limits": {
                "max_driving_hours": 11.0,
                "driving_window_hours": 14.0,
                "break_threshold_driving_hours": 8.0,
                "break_duration_minutes": 30,
                "daily_rest_hours": 10.0,
                "cycle_limit_hours": 70.0,
                "cycle_days": 8,
                "fueling_interval_miles": 1000.0,
                "pickup_hours": 1.0,
                "dropoff_hours": 1.0
            },
            "assumptions": [
                "Property-carrying CMV driver",
                "70-hour / 8-day rolling cycle rule",
                "No adverse driving conditions applied",
                "Fuel at least once every 1,000 miles (30 min duration)",
                "1 hour pickup (on-duty not driving)",
                "1 hour dropoff (on-duty not driving)",
                "10 consecutive hours sleeper berth reset"
            ]
        })


class TripListView(ListAPIView):
    queryset = Trip.objects.all().order_by("-created_at")
    serializer_class = TripDetailSerializer


class TripDetailView(RetrieveAPIView):
    queryset = Trip.objects.all()
    serializer_class = TripDetailSerializer
    lookup_field = "id"


class TripTimelineView(APIView):
    def get(self, request, id):
        events = TripEvent.objects.filter(trip_id=id).order_by("sequence")
        serializer = TripEventSerializer(events, many=True)
        return Response({"events": serializer.data})


class TripLogsView(APIView):
    def get(self, request, id):
        logs = DailyLog.objects.filter(trip_id=id).order_by("date")
        serializer = DailyLogSerializer(logs, many=True)
        return Response({"daily_logs": serializer.data})


class ValidateTripView(APIView):
    def post(self, request):
        events = request.data.get("events", [])
        initial_cycle = float(request.data.get("initial_cycle_used", 0.0))
        result = validate_trip(events, initial_cycle)
        return Response(result)
