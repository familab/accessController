# based on code found at:
#   https://learn.adafruit.com/adafruit-1-14-240x135-color-tft-breakout/circuitpython-displayio-quickstart
#   https://learn.adafruit.com/adafruit-1-14-240x135-color-tft-breakout/circuitpython-displayio-quickstart
#   https://gitlab.com/christopher_m/circuitpython-mfrc522/-/blob/master/examples/read.py

# VERY WIP, code written for Adafruit ESP32-S3 TFT Feather
# Proof of concept for connecting to wifi, drawing to built-in screen
# TODO: read from nfc
# SPDX-License-Identifier: MIT

import ipaddress
import ssl
import wifi
import socketpool
import adafruit_requests

import board
import displayio
import terminalio
from adafruit_display_text import label
from adafruit_st7789 import ST7789

import mfrc522
from os import uname

# https://gitlab.com/christopher_m/circuitpython-mfrc522/-/blob/master/examples/read.py
def do_read():
    spi=board.SPI()

    if uname()[0] == 'ESP32S3':
        rdr = mfrc522.MFRC522(spi, cs=board.SDA, rst=board.D5)
    else:
        raise RuntimeError("Unsupported platform")

    print("")
    print("Place card before reader to read from address 0x08")
    print("")

    try:
        while True:
            (stat, tag_type) = rdr.request(rdr.REQIDL)
            if stat == rdr.OK:
                (stat, raw_uid) = rdr.anticoll()
                if stat == rdr.OK:
                    print("New card detected")
                    print("  - tag type: 0x%02x" % tag_type)
                    print("  - uid     : 0x%02x%02x%02x%02x" % (raw_uid[0], raw_uid[1], raw_uid[2], raw_uid[3]))
                    print("")

                    if rdr.select_tag(raw_uid) == rdr.OK:
                        key = [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]
                        if rdr.auth(rdr.AUTHENT1A, 8, key, raw_uid) == rdr.OK:
                            print("Address 8 data: %s" % rdr.read(8))
                            rdr.stop_crypto1()
                        else:
                            print("Authentication error")
                    else:
                        print("Failed to select tag")

    except KeyboardInterrupt:
        print("Bye")

def setup_display():
    BORDER = 20
    FONTSCALE = 2

    displayio.release_displays()
    spi = board.SPI()
    tft_cs = board.TFT_CS
    tft_dc = board.TFT_DC

    display_bus = displayio.FourWire(spi, command=tft_dc, chip_select=tft_cs)
    # display = ST7789(display_bus, rotation=270, width 240, height=135, rowstart = 40, colstart=53)
    display = ST7789(
        display_bus, rotation=270, width=240, height=135, rowstart=40, colstart=53
    )

    return display

def draw_text(display, bg_color, fg_color, text_color, text):
    BORDER = 20
    FONTSCALE = 2

    splash = displayio.Group()
    display.show(splash)

    color_bitmap = displayio.Bitmap(display.width, display.height, 1)
    color_palette = displayio.Palette(1)
    color_palette[0] = bg_color

    bg_sprite = displayio.TileGrid(color_bitmap, pixel_shader=color_palette, x=0, y=0)
    splash.append(bg_sprite)

    inner_bitmap = displayio.Bitmap(
        display.width - BORDER * 2, display.height - BORDER * 2, 1
    )
    inner_palette = displayio.Palette(1)
    inner_palette[0] = fg_color
    inner_sprite = displayio.TileGrid(inner_bitmap, pixel_shader=inner_palette, x=BORDER, y=BORDER)
    splash.append(inner_sprite)

    text = text
    text_area = label.Label(terminalio.FONT, text=text, color=text_color)
    text_width = text_area.bounding_box[2] * FONTSCALE
    text_group = displayio.Group(scale=FONTSCALE, x=display.width // 2 - text_width // 2, y=display.height // 2,)
    text_group.append(text_area)
    splash.append(text_group)

# URLs to fetch from
TEXT_URL = "http://wifitest.adafruit.com/testwifi/index.html"
JSON_QUOTES_URL = "https://www.adafruit.com/api/quotes.php"
JSON_STARS_URL = "https://api.github.com/repos/adafruit/circuitpython"

# Colors
FAMILAB_BLUE = 0x3399FF

# Setup
display = setup_display()

# Get wifi details and more from a secrets.py file
try:
    from secrets import secrets
except ImportError:
    print("WiFi secrets are kept in secrets.py, please add them there!")
    raise

# print("ESP32-S2 WebClient Test")

# print("My MAC addr:", [hex(i) for i in wifi.radio.mac_address])

# print("Available WiFi networks:")
for network in wifi.radio.start_scanning_networks():
    print("\t%s\t\tRSSI: %d\tChannel: %d" % (str(network.ssid, "utf-8"),
            network.rssi, network.channel))
wifi.radio.stop_scanning_networks()

draw_text(display, 0xCCCCCC, FAMILAB_BLUE, 0xFFFFFF, "Connecting...")
wifi.radio.connect(secrets["ssid"], secrets["password"])
draw_text(display, 0x00FF00, FAMILAB_BLUE, 0xFFFFFF, "Connected!")
# print("Connected to %s!"%secrets["ssid"])
# print("My IP address is", wifi.radio.ipv4_address)

ipv4 = ipaddress.ip_address("8.8.4.4")
# print("Ping google.com: %f ms" % (wifi.radio.ping(ipv4)*1000))

pool = socketpool.SocketPool(wifi.radio)
requests = adafruit_requests.Session(pool, ssl.create_default_context())

draw_text(display, 0xFFFFFF, FAMILAB_BLUE, 0xFFFFFF, "Familab")
do_read()

# print("Fetching text from", TEXT_URL)
# response = requests.get(TEXT_URL)
# print("-" * 40)
# print(response.text)
# print("-" * 40)

# print("Fetching json from", JSON_QUOTES_URL)
# response = requests.get(JSON_QUOTES_URL)
# print("-" * 40)
# print(response.json())
# print("-" * 40)

# print()

# print("Fetching and parsing json from", JSON_STARS_URL)
# response = requests.get(JSON_STARS_URL)
# print("-" * 40)
# print("CircuitPython GitHub Stars", response.json()["stargazers_count"])
# print("-" * 40)

# print("done")

# while True:
#     do_read()
#     pass