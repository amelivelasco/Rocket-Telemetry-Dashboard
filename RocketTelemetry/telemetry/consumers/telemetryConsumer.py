from channels.generic.websocket import AsyncWebsocketConsumer
from telemetry.schemas.packetSchema import decode_packet
import json

class TelemetryConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print("CONNECT METHOD REACHED")
        await self.accept()
        print("WebSocket connected")

    async def disconnect(self, close_code):
        print("WebSocket disconnected")

    async def receive(self, bytes_data=None, text_data=None):
        if bytes_data:
            # binary path (real radio hardware)
            radio_id = f"0x{bytes_data[0]:02x}"
            payload = bytes_data[1:]
            decoded = decode_packet(radio_id, payload)
            await self.send(json.dumps({
                "type": "telemetry",
                "data": decoded
            }))

        elif text_data:
            # JSON path (frontend simulator / dashboard)
            data = json.loads(text_data)
            await self.send(json.dumps({
                "type": "telemetry",
                "last_updated": data.get("timeLabel"),
                "received": data
            }))