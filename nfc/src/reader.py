import board
from mfrc522 import MFRC522
from os import uname


class Reader:
    reader: MFRC522
    spi: board.SPI

    def __init__(self, spi: board.SPI):
        self.spi = spi
        if uname()[0] == 'ESP32S3':
            self.reader = MFRC522(spi, cs=board.SDA, rst=board.D5)
        else:
            raise RuntimeError("Unsupported platform")

        print("")
        print("Place card before reader to read from address 0x08")
        print("")

    # https://gitlab.com/christopher_m/circuitpython-mfrc522/-/blob/master/examples/read.py
    def do_read(self):
        while not self.spi.try_lock():
            pass
        try:
            (stat, tag_type) = self.reader.request(self.reader.REQIDL)
            if stat != self.reader.OK:
                return None

            (stat, raw_uid) = self.reader.anticoll()
            if stat != self.reader.OK:
                return None

            print("New card detected")
            print("  - tag type: 0x%02x" % tag_type)
            print("  - uid     : 0x%02x%02x%02x%02x" % (raw_uid[0], raw_uid[1], raw_uid[2], raw_uid[3]))
            print("")

            if self.reader.select_tag(raw_uid) == self.reader.OK:
                key = [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]
                if self.reader.auth(self.reader.AUTHENT1A, 8, key, raw_uid) == self.reader.OK:
                    print("Address 8 data: %s" % self.reader.read(8))
                    self.reader.stop_crypto1()
                else:
                    print("Authentication error")
            else:
                print("Failed to select tag")

            return raw_uid

        except KeyboardInterrupt:
            print("Bye")
        finally:
            self.spi.unlock()