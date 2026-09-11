from django.urls import path
from .views import (
    HealthCheckView,
    HosRulesView,
    TripListView,
    TripDetailView,
    TripTimelineView,
    TripLogsView,
    ValidateTripView
)

urlpatterns = [
    path("health/", HealthCheckView.as_view(), name="health"),
    path("hos/rules/", HosRulesView.as_view(), name="hos-rules"),
    path("trips/", TripListView.as_view(), name="trip-list"),
    path("trips/<uuid:id>/", TripDetailView.as_view(), name="trip-detail"),
    path("trips/<uuid:id>/timeline/", TripTimelineView.as_view(), name="trip-timeline"),
    path("trips/<uuid:id>/logs/", TripLogsView.as_view(), name="trip-logs"),
    path("validate-trip/", ValidateTripView.as_view(), name="validate-trip"),
]
