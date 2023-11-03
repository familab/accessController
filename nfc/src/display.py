import board
import displayio
import terminalio
from adafruit_display_text import label
from adafruit_st7789 import ST7789

BORDER = 20
FONTSCALE = 2

# Colors
FAMILAB_BLUE = 0x3399FF


class Display:
    display: ST7789

    def __init__(self):
        spi = board.SPI()
        displayio.release_displays()
        tft_cs = board.TFT_CS
        tft_dc = board.TFT_DC

        display_bus = displayio.FourWire(spi, command=tft_dc, chip_select=tft_cs)
        # display = ST7789(display_bus, rotation=270, width 240, height=135, rowstart = 40, colstart=53)
        self.display = ST7789(
            display_bus, rotation=270, width=240, height=135, rowstart=40, colstart=53
        )

    def draw_text(self,
                  text,
                  border_color=None,
                  text_color=0xFFFFFF,
                  foreground_color=FAMILAB_BLUE):
        print("Display: ", text)

        if border_color == None:
            border_color = foreground_color

        splash = displayio.Group()

        border_bitmap = displayio.Bitmap(self.display.width, self.display.height, 1)
        border_palette = displayio.Palette(1)
        border_palette[0] = border_color

        border_sprite = displayio.TileGrid(border_bitmap, pixel_shader=border_palette, x=0, y=0)
        splash.append(border_sprite)

        foreground_bitmap = displayio.Bitmap(self.display.width - BORDER * 2, self.display.height - BORDER * 2, 1)
        foreground_palette = displayio.Palette(1)
        foreground_palette[0] = foreground_color
        foreground_sprite = displayio.TileGrid(foreground_bitmap, pixel_shader=foreground_palette, x=BORDER, y=BORDER)
        splash.append(foreground_sprite)

        text_area = label.Label(terminalio.FONT, text=text, color=text_color)
        text_width = text_area.bounding_box[2] * FONTSCALE
        text_group = displayio.Group(
            scale=FONTSCALE,
            x=self.display.width // 2 - text_width // 2,
            y=self.display.height // 2, )
        text_group.append(text_area)
        splash.append(text_group)

        self.display.show(splash)
