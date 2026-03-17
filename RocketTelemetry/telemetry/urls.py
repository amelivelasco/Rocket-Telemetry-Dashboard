from django.urls import path
from .views import TelemetryListView
from .radioViews import RadioConfigListView

urlpatterns = [
    path("telemetry/", TelemetryListView.as_view(), name="telemetry-list"),
    path("radio/", RadioConfigListView.as_view(), name="radio-list"),
]