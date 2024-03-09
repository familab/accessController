import time
from os import uname

import board
from busio import SPI
from digitalio import DigitalInOut, Direction
from microcontroller import Pin

from src.display import Display
from src.reader import Reader
from src.wifi import Wifi


# region Classes
class Config:
    spi: tuple[Pin, Pin, Pin]
    reader: tuple[Pin, Pin]
    display: tuple[Pin, Pin] | None
    relay: Pin
# endregion


# region Colors
class colors:
    OFF = (0, 0, 0)
    RED = (255, 0, 0)
    YELLOW = (255, 150, 0)
    GREEN = (0, 255, 0)
    # CYAN = (0, 255, 255)
    # BLUE = (0, 0, 255)
    # PURPLE = (180, 0, 255)
    FAMILAB_BLUE = 0x3399FF
# endregion


# region Board Configurations
board_id = uname()[0]
if board_id == 'ESP32S3':
    config = Config()
    config.spi = (board.SCLK, board.MOSI, board.MISO)
    config.reader = (board.SDA, board.D5)
    config.display = (board.TFT_CS, board.TFT_DC)
    config.relay = board.D13

elif board_id == 'rp2040':
    config = Config()
    config.spi = (board.GP18, board.GP19, board.GP16)
    config.reader = (board.GP17, board.GP20)
    config.relay = board.GP22

else:
    raise RuntimeError(f"Unsupported platform {board_id}")
# endregion


# region Setup
print("#####################")
print("# Access Controller #")
print("#####################")

## Init SPI
spi: SPI = SPI(*config.spi)

## Init Display
display: Display | None = None
if config.display:
    display = Display(spi, *config.display)

## Init Reader
if display:
    display.draw_text("Initializing\nNFC Reader")

reader: Reader = Reader(spi, *config.reader)

## Init Wi-Fi
if display:
    display.draw_text("Connecting\nto WiFi")

wifi: Wifi = Wifi()

## Init Relay
relay: DigitalInOut = DigitalInOut(config.relay)
relay.direction = Direction.OUTPUT

# endregion


# region Main Loop
while True:

    # Waiting for a badge...
    print("Scan Badge")
    if display:
        display.draw_text("Familab\nScan Badge")

    media_code = None
    while media_code is None:
        media_code = reader.do_read()

    # Got a badge! Checking access...
    print("Scanned media:", media_code)
    print("Authenticating...")
    if display:
        display.draw_text("Authenticating...", 0x00FFFF)

    can_access = wifi.check_access(media_code)

    # Got badge status
    if can_access:
        # Door open!
        print("Access Granted")
        relay.value = 1
        if display:
            display.draw_text("Access Granted", 0x00FF00)
        time.sleep(10)
        relay.value = 0

    else:
        # Door not open
        print("Access Denied")
        if display:
            display.draw_text("Access Denied", 0xFF0000)
        time.sleep(3)

# endregion
