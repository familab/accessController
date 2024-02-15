from busio import SPI

from mfrc522 import MFRC522, NTAGCommands, Status


class Reader:
    reader: MFRC522
    spi: SPI

    def __init__(self, spi: SPI, cs, rst):
        self.spi = spi
        self.reader = MFRC522(self.spi, cs=cs, rst=rst)

        print("")
        print("Place card before reader to read from address 0x08")
        print("")

    # https://gitlab.com/christopher_m/circuitpython-mfrc522/-/blob/master/examples/read.py
    def do_read(self) -> str | None:
        try:
            while not self.spi.try_lock():
                pass

            (stat, tag_type) = self.reader.request(NTAGCommands.SENS_REQ)
            if stat != Status.OK:
                return None

            (stat, raw_uid) = self.reader.anticoll()
            if stat != Status.OK:
                return None

            uid = "0x%02x%02x%02x%02x" % (raw_uid[0], raw_uid[1], raw_uid[2], raw_uid[3])
            print("New card detected")
            print("  - tag type: 0x%02x" % tag_type)
            print("  - uid     : %s" % uid)
            print("")

            if self.reader.select_tag(raw_uid) == Status.OK:
                key = [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]
                if self.reader.auth(NTAGCommands.GET_VERSION, 8, key, raw_uid) == Status.OK:
                    print("Address 8 data: %s" % self.reader.read(8))
                    self.reader.stop_crypto1()
                else:
                    print("Authentication error")
            else:
                print("Failed to select tag")

            return uid

        except KeyboardInterrupt:
            print("Bye")
        finally:
            self.spi.unlock()
