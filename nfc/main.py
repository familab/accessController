import time

from src.display import Display
from src.reader import Reader
from src.wifi import Wifi

# Setup
display = Display()

display.draw_text("Connecting\nto WiFi")
wifi = Wifi()

display.draw_text("Initializing\nNFC Reader")
reader = Reader()


# Loop
while True:
    print("Waiting to scan...")
    display.draw_text("Familab\nScan Badge")
    media_code = None

    while media_code == None:
        media_code = reader.do_read()

    print("Scanned media: ", media_code)

    display.draw_text("Authenticating...", 0x00FFFF)
    time.sleep(0.3)

    can_access = wifi.check_access(media_code)

    if can_access:
        display.draw_text("Access Granted", 0x00FF00)
    else:
        display.draw_text("Access Denied", 0xFF0000)

    time.sleep(5)
