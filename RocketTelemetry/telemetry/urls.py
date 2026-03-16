from django.urls import path
from .views import TelemetryListView

urlpatterns = [
    path("telemetry/", TelemetryListView.as_view(), name="telemetry-list"),
]