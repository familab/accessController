import os
import time

import rtc
from time import struct_time

# Log levels by priority
_log_levels = {
    "error": 0,
    "warn": 1,
    "info": 2,
    "debug": 3,
    "trace": 4
}

# Create RTC to get timestamps for logs
r = rtc.RTC()
r.datetime = time.localtime()


class Logger:
    log_level: str = os.getenv("log.level", "info")

    def __init__(self):
        print("\n\n")

    def log(self, level: str, message: str, args: tuple = ()):
        if _log_levels[level] <= _log_levels[self.log_level]:
            print(f"{_to_iso(r.datetime)} [{level:>5}] : {str(message) % args}")

    def error(self, message: str, *args):
        self.log("error", message, *args)

    def warn(self, message: str, *args):
        self.log("warn", message, args)

    def info(self, message: str, *args):
        self.log("info", message, args)

    def debug(self, message: str, *args):
        self.log("debug", message, *args)

    def trace(self, message: str, *args):
        self.log("trace", message, *args)


def _to_iso(ts: struct_time):
    return f"{ts.tm_year:04}-{ts.tm_mon:02}-{ts.tm_mday:02}T{ts.tm_hour:02}:{ts.tm_min:02}:{ts.tm_sec:02}Z"


logger = Logger()
