from busio import SPI
from microcontroller import Pin

from mfrc522 import MFRC522, NTAGCommands, Status


class Reader:
    reader: MFRC522
    spi: SPI

    def __init__(self, spi: SPI, cs: Pin, rst: Pin):
        self.spi = spi
        self.reader = MFRC522(self.spi, cs=cs, rst=rst)

    def do_read(self) -> str | None:
        """
        Attempt to read RFID card.

        Communication flow is described in
        https://www.nxp.com/docs/en/data-sheet/NTAG213_215_216.pdf
        Section 8.4: Communication principle

        Originally build referencing
        https://gitlab.com/christopher_m/circuitpython-mfrc522/-/blob/master/examples/read.py

        :return: UID or None
        """
        try:
            while not self.spi.try_lock():
                pass

            # Some badges have longer UIDs than others, so we may need to call ANTICOLL and SELECT more than once.
            (stat, tag_type, uid_len) = self.reader.request(NTAGCommands.SENS_REQ)
            if stat != Status.OK:
                # Probably there's no card currently, return None
                return None
            print("UID Length: %d" % uid_len)

            (stat, uid1) = self.reader.anticoll()
            if stat != Status.OK:
                print("anticoll1 not ok: %x" % stat)
                return None

            stat = self.reader.select_tag(uid1)
            if stat != Status.OK:
                print("Failed to select1 tag")
                return None

            c0, b0, b1, b2, *a1 = uid1

            # If the UID is only 3 bytes, return now.
            if uid_len == 1:
                return self._get_uid([b0, b1, b2])

            (stat, uid2) = self.reader.anticoll(2)
            if stat != Status.OK:
                print("anticoll2 not ok: %x" % stat)
                return None

            b3, b4, b5, b6, *a2 = uid2

            stat = self.reader.select_tag(uid2, 2)
            if stat != Status.OK:
                print("Failed to select2 tag")
                return None

            # Return double-length UID.
            return self._get_uid([b0, b1, b2, b3, b4, b5, b6])
        finally:
            self.spi.unlock()

    def _get_uid(self, byte_array):
        return "".join(["%02x" % x for x in byte_array])
