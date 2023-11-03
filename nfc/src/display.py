import board
import displayio
import terminalio
from adafruit_display_text import label
from adafruit_st7789 import ST7789

BORDER = 20
FONTSCALE = 2


class Display:
    display: ST7789
    spi: board.SPI

    def __init__(self, spi: board.SPI):
        self.spi = spi
        displayio.release_displays()
        tft_cs = board.TFT_CS
        tft_dc = board.TFT_DC

        display_bus = displayio.FourWire(spi, command=tft_dc, chip_select=tft_cs)
        # display = ST7789(display_bus, rotation=270, width 240, height=135, rowstart = 40, colstart=53)
        self.display = ST7789(
            display_bus, rotation=270, width=240, height=135, rowstart=40, colstart=53
        )

    def draw_text(self, bg_color, fg_color, text_color, text):
        while not self.spi.try_lock():
            pass

        splash = displayio.Group()

        color_bitmap = displayio.Bitmap(self.display.width, self.display.height, 1)
        color_palette = displayio.Palette(1)
        color_palette[0] = bg_color

        bg_sprite = displayio.TileGrid(color_bitmap, pixel_shader=color_palette, x=0, y=0)
        splash.append(bg_sprite)

        inner_bitmap = displayio.Bitmap(
            self.display.width - BORDER * 2, self.display.height - BORDER * 2, 1
        )
        inner_palette = displayio.Palette(1)
        inner_palette[0] = fg_color
        inner_sprite = displayio.TileGrid(inner_bitmap, pixel_shader=inner_palette, x=BORDER, y=BORDER)
        splash.append(inner_sprite)

        text_area = label.Label(terminalio.FONT, text=text, color=text_color)
        text_width = text_area.bounding_box[2] * FONTSCALE
        text_group = displayio.Group(
            scale=FONTSCALE,
            x=self.display.width // 2 - text_width // 2,
            y=self.display.height // 2, )
        text_group.append(text_area)
        splash.append(text_group)

        self.display.show(splash)

        self.spi.unlock()
