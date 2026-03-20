import asyncio
from asyncio.log import logger
from datetime import datetime
import random

from channels.generic.websocket import AsyncWebsocketConsumer
from telemetry.schemas.packetSchema import decode_packet
import json

class TelemetryConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print("CONNECT METHOD REACHED")
        await self.accept()
        print("WebSocket connected")
        self.sending_task = asyncio.create_task(self.periodic_send())

    async def disconnect(self, close_code):
        print("WebSocket disconnected")
        self.sending_task.cancel()
    
    async def periodic_send(self):
        while True:
            await self.send_telemetry_data()
            await asyncio.sleep(1)
            
    async def send_telemetry_data(self):
        try:
            await self.send(json.dumps({
                "timeLabel": datetime.now().strftime("%H:%M:%S"),
                "altitude": round(random.uniform(0, 3000), 2),
                "velocity": round(random.uniform(0, 400), 2),
                "temperature": random.randint(-30, 80),
                "battery_voltage": round(random.uniform(11, 14), 2),
            }))
        except Exception as e:
            logger.error(f"Error sending telemetry: {e}")