import os

import adafruit_requests
import socketpool
import ssl
from wifi import radio

from src.logger import logger


class Wifi:
    ssid: str = os.getenv("network.ssid")
    password: str = os.getenv("network.password")
    base_url: str = os.getenv("network.base_url")
    location: str = os.getenv("config.location")

    media_cache: set[str] = set(os.getenv("config.default_media_cache", "").split(","))

    def __init__(self):
        if self.base_url is None:
            raise RuntimeError("'base_url' setting not found")
        if self.location is None:
            raise RuntimeError("'location' setting not found")

        try:
            radio.connect(self.ssid, self.password)
        except Exception as e:
            print(e)

        pool = socketpool.SocketPool(radio)
        self.requests = adafruit_requests.Session(pool, ssl.create_default_context())

    def check_access(self, media_code: str) -> bool:

        url = f"{self.base_url}/api/access/{media_code}"
        logger.debug("POST %s", url)

        try:
            response = self.requests.post(
                url,
                headers={"x-location-code": self.location},
                timeout=2
            )

            is_allowed = response.status_code == 200
            if is_allowed:
                self.media_cache.add(media_code)
            else:
                self.media_cache.remove(media_code)

            return is_allowed

        except Exception as exc:
            logger.error("Fetching badge access failed: %s", exc)
            logger.warn("Using local cache")
            return media_code in self.media_cache
