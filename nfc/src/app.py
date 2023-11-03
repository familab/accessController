import time

from .display import Display
from .reader import Reader

display = Display()
reader = Reader()

# Setup
display.draw_text("Connecting...", 0xCCCCCC)
display.draw_text("Connected!", 0x00FF00)
display.draw_text("Familab", 0xFFFFFF)

# Loop
while True:
    result = reader.do_read()
    if (result == None):
        continue
    print("Scan result: ", result)

    display.draw_text("Scanned!", 0xFFFFFF)
    time.sleep(3)
    display.draw_text("Familab", 0xFFFFFF)

# while True:
#     continue
