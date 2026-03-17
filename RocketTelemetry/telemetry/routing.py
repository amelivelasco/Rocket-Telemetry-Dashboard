from django.urls import re_path
from telemetry.consumers import TelemetryConsumer
from telemetry.radioConsumer import RadioConsumer

websocket_urlpatterns = [
    re_path(r"^ws/telemetry/$", TelemetryConsumer.as_asgi()),
    re_path(r"^ws/radio/$", RadioConsumer.as_asgi()),
]