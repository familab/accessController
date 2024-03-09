import os

import adafruit_requests
import socketpool
import ssl
from wifi import radio


class Wifi:
    ssid = os.getenv("ssid")
    password = os.getenv("password")
    base_url = os.getenv("base_url")
    location = os.getenv("location")

    def __init__(self):
        if self.base_url is None:
            raise RuntimeError("'base_url' setting not found")
        if self.location is None:
            raise RuntimeError("'location' setting not found")

        radio.connect(self.ssid, self.password)

        pool = socketpool.SocketPool(radio)
        self.requests = adafruit_requests.Session(pool, ssl.create_default_context())

    def check_access(self, media_code: str) -> bool:

        url = f"{self.base_url}/api/access/{media_code}"
        print("Post:", url)

        try:
            response = self.requests.post(
                url,
                headers={"x-location-code": self.location},
                timeout=5
            )

            return response.status_code == 200

        except Exception as exc:
            print(exc)
            return False
