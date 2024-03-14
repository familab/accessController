import asyncio

import countio
from adafruit_pn532.i2c import PN532_I2C
from busio import I2C
from digitalio import DigitalInOut
from microcontroller import Pin


class Reader:
    pn532: PN532_I2C
    irq: countio.Counter

    def __init__(self, i2c: I2C, irq: Pin, rst: Pin):
        self.pn532 = PN532_I2C(
            i2c,
            reset=DigitalInOut(rst),
            debug=False)
        self.pn532.SAM_configuration()
        self.irq = countio.Counter(irq)

    async def do_read(self) -> str:
        # Start listening
        self.pn532.listen_for_passive_target()

        # Wait for card to be present...
        while True:
            if self.irq.count > 0:
                self.irq.count = 0
                break
            await asyncio.sleep(0)

        response: bytearray = self.pn532.get_passive_target()

        # Return card
        return "".join(["%02x" % x for x in response])
