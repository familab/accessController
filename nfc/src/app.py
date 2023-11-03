import board

from .display import Display
from .reader import Reader

display = Display(board.SPI())

# Colors
FAMILAB_BLUE = 0x3399FF

# # Setup
display.draw_text(0xCCCCCC, FAMILAB_BLUE, 0xFFFFFF, "Connecting...")
display.draw_text(0x00FF00, FAMILAB_BLUE, 0xFFFFFF, "Connected!")
display.draw_text(0xFFFFFF, FAMILAB_BLUE, 0xFFFFFF, "Familab")

reader = Reader(board.SPI())

while True:
    result = reader.do_read()
    if (result == None):
        continue
    print("Scan result: ", result)
    display.draw_text(0xFFFFFF, FAMILAB_BLUE, 0xFFFFFF, "Scanned!")
    display.draw_text(0xFFFFFF, FAMILAB_BLUE, 0xFFFFFF, "Familab")

# while True:
#     continue
