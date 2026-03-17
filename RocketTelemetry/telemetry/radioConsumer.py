import json
from datetime import datetime
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import RadioConfig
import logging

logger = logging.getLogger(__name__)

class RadioConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        logger.info("Radio WebSocket connection attempt")
        await self.accept()
        logger.info("Radio WebSocket connection accepted")

    async def disconnect(self, close_code):
        logger.info(f"Radio WebSocket disconnected with code {close_code}")

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            logger.info(f"Received radio config: {data}")

            if not isinstance(data, list):
                logger.error("Expected list of radios, got: " + str(type(data)))
                await self.send(text_data=json.dumps({
                    "status": "error",
                    "message": "Expected list of radios"
                }))
                return

            for radio in data:
                await self.save_radio(radio)

            response = {
                "status": "ok",
                "last_updated": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "received": data,
            }
            await self.send(text_data=json.dumps(response))
            logger.info("Radio config saved and response sent")
        except json.JSONDecodeError as e:
            logger.error(f"Invalid JSON received: {e}")
            await self.send(text_data=json.dumps({
                "status": "error",
                "message": "Invalid JSON"
            }))
        except Exception as e:
            logger.error(f"Error processing radio config: {e}", exc_info=True)
            await self.send(text_data=json.dumps({
                "status": "error",
                "message": str(e)
            }))

    @database_sync_to_async
    def save_radio(self, radio):
        try:
            RadioConfig.objects.create(
                radio_id=radio.get("idVal", "unknown"),
                status=radio.get("status", "offline"),
                p1=radio.get("p1", ""),
                p2=radio.get("p2", ""),
                p3=radio.get("p3", ""),
            )
            logger.debug(f"Saved radio config: {radio.get('idVal')}")
        except Exception as e:
            logger.error(f"Failed to save radio {radio.get('idVal')}: {e}")