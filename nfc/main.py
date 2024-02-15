import time
from os import uname

import board
from busio import SPI

from src.display import Display
from src.reader import Reader
from src.wifi import Wifi

board_id = uname()[0]

# Setup
print("Initializing")
if board_id == 'ESP32S3':
    spi = board.SPI()
    display = Display(spi)

    display.draw_text("Connecting\nto WiFi")
    wifi = Wifi()

    display.draw_text("Initializing\nNFC Reader")
    reader = Reader(spi, board.SDA, board.D5)

elif board_id == 'rp2040':
    spi = SPI(board.GP18, board.GP19, board.GP16)
    reader = Reader(spi, board.GP17, board.GP20)
    display = None
    wifi = None
else:
    raise RuntimeError(f"Unsupported platform {board_id}")

# Loop
while True:
    print("Waiting to scan...")
    if display:
        display.draw_text("Familab\nScan Badge")

    media_code = None
    while media_code is None:
        media_code = reader.do_read()

    print("Scanned media: ", media_code)

    if display:
        display.draw_text("Authenticating...", 0x00FFFF)

    time.sleep(0.3)

    can_access = wifi.check_access(media_code)

    if can_access:
        if display:
            display.draw_text("Access Granted", 0x00FF00)
    else:
        if display:
            display.draw_text("Access Denied", 0xFF0000)

    time.sleep(5)
