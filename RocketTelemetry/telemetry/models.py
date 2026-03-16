from django.db import models

# Create your models here.

class Telemetry(models.Model):
    timestamp = models.DateTimeField()
    altitude = models.FloatField()
    velocity = models.FloatField()
    temperature = models.FloatField()
    battery_voltage = models.FloatField()

    def __str__(self):
        return f"Telemetry @ {self.timestamp}"