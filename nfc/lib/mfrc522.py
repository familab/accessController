# https://gitlab.com/christopher_m/circuitpython-mfrc522

import digitalio
from busio import SPI


class Registers:
    """
    MFRC522 Data Sheet
    9.2 Register overview

    https://www.nxp.com/docs/en/data-sheet/MFRC522.pdf
    """
    Reserved00     = 0x00
    CommandReg     = 0x01
    CommIEnReg     = 0x02
    DivlEnReg      = 0x03
    CommIrqReg     = 0x04
    DivIrqReg      = 0x05
    ErrorReg       = 0x06
    Status1Reg     = 0x07
    Status2Reg     = 0x08
    FIFODataReg    = 0x09
    FIFOLevelReg   = 0x0A
    WaterLevelReg  = 0x0B
    ControlReg     = 0x0C
    BitFramingReg  = 0x0D
    CollReg        = 0x0E
    Reserved01     = 0x0F

    Reserved10     = 0x10
    ModeReg        = 0x11
    TxModeReg      = 0x12
    RxModeReg      = 0x13
    TxControlReg   = 0x14
    TxAutoReg      = 0x15
    TxSelReg       = 0x16
    RxSelReg       = 0x17
    RxThresholdReg = 0x18
    DemodReg       = 0x19
    Reserved11     = 0x1A
    Reserved12     = 0x1B
    MifareReg      = 0x1C
    Reserved13     = 0x1D
    Reserved14     = 0x1E
    SerialSpeedReg = 0x1F

    Reserved20        = 0x20
    CRCResultRegM     = 0x21
    CRCResultRegL     = 0x22
    Reserved21        = 0x23
    ModWidthReg       = 0x24
    Reserved22        = 0x25
    RFCfgReg          = 0x26
    GsNReg            = 0x27
    CWGsPReg          = 0x28
    ModGsPReg         = 0x29
    TModeReg          = 0x2A
    TPrescalerReg     = 0x2B
    TReloadRegH       = 0x2C
    TReloadRegL       = 0x2D
    TCounterValueRegH = 0x2E
    TCounterValueRegL = 0x2F

    Reserved30      = 0x30
    TestSel1Reg     = 0x31
    TestSel2Reg     = 0x32
    TestPinEnReg    = 0x33
    TestPinValueReg = 0x34
    TestBusReg      = 0x35
    AutoTestReg     = 0x36
    VersionReg      = 0x37
    AnalogTestReg   = 0x38
    TestDAC1Reg     = 0x39
    TestDAC2Reg     = 0x3A
    TestADCReg      = 0x3B
    Reserved31      = 0x3C
    Reserved32      = 0x3D
    Reserved33      = 0x3E
    Reserved34      = 0x3F


class Commands:
    """
    MFRC522 Data Sheet
    10. MFRC522 command set

    https://www.nxp.com/docs/en/data-sheet/MFRC522.pdf
    """
    PCD_IDLE       = 0x00
    PCD_AUTHENT    = 0x0E
    PCD_RECEIVE    = 0x08
    PCD_TRANSMIT   = 0x04
    PCD_TRANSCEIVE = 0x0C
    PCD_RESETPHASE = 0x0F
    PCD_CALCCRC    = 0x03


class Status:
    OK = 0
    NOTAGERR = 1
    ERR = 2


class NTAGCommands:
    """
    NTAG21x Data Sheet
    Section 9.1: NTAG21x command overview

    https://www.nxp.com/docs/en/data-sheet/NTAG213_215_216.pdf
    """
    SENS_REQ = 0x26
    ALL_REQ = 0x52
    ANTICOLL_1 = [0x93, 0x20]
    SEL_REQ_1 = [0x93, 0x70]
    GET_VERSION = 0x60
    READ = 0x30


class MFRC522:

    def __init__(self, spi: SPI, cs, rst):

        self.cs = digitalio.DigitalInOut(cs)
        self.cs.direction = digitalio.Direction.OUTPUT
        self.rst = digitalio.DigitalInOut(rst)
        self.rst.direction = digitalio.Direction.OUTPUT

        self.rst.value = False
        self.cs.value = True

        self.spi = spi
        while not self.spi.try_lock():
            pass
        self.spi.configure(baudrate=100000, phase=0, polarity=0)

        self.rst.value = True

        self.init()
        self.spi.unlock()

    def _wreg(self, reg, val):

        self.cs.value = False
        self.spi.write(b'%c' % int(0xff & ((reg << 1) & 0x7e)))
        self.spi.write(b'%c' % int(0xff & val))
        self.cs.value = True

    def _rreg(self, reg):

        self.cs.value = False
        self.spi.write(b'%c' % int(0xff & (((reg << 1) & 0x7e) | 0x80)))
        val = bytearray(1)
        self.spi.readinto(val)
        self.cs.value = True

        return val[0]

    def _sflags(self, reg, mask):
        self._wreg(reg, self._rreg(reg) | mask)

    def _cflags(self, reg, mask):
        self._wreg(reg, self._rreg(reg) & (~mask))

    def _tocard(self, cmd, send):

        recv = []
        bits = irq_en = wait_irq = n = 0
        stat = Status.ERR

        if cmd == 0x0E:
            irq_en = 0x12
            wait_irq = 0x10
        elif cmd == 0x0C:
            irq_en = 0x77
            wait_irq = 0x30

        self._wreg(0x02, irq_en | 0x80)
        self._cflags(0x04, 0x80)
        self._sflags(0x0A, 0x80)
        self._wreg(0x01, 0x00)

        for c in send:
            self._wreg(Registers.FIFODataReg, c)
        self._wreg(Registers.CommandReg, cmd)

        if cmd == 0x0C:
            self._sflags(0x0D, 0x80)

        i = 2000
        while True:
            n = self._rreg(0x04)
            i -= 1
            if ~((i != 0) and ~(n & 0x01) and ~(n & wait_irq)):
                break

        self._cflags(0x0D, 0x80)

        if i:
            if (self._rreg(0x06) & 0x1B) == 0x00:
                stat = Status.OK

                if n & irq_en & 0x01:
                    stat = Status.NOTAGERR
                elif cmd == 0x0C:
                    n = self._rreg(0x0A)
                    lbits = self._rreg(0x0C) & 0x07
                    if lbits != 0:
                        bits = (n - 1) * 8 + lbits
                    else:
                        bits = n * 8

                    if n == 0:
                        n = 1
                    elif n > 16:
                        n = 16

                    for _ in range(n):
                        recv.append(self._rreg(Registers.FIFODataReg))
            else:
                stat = Status.ERR

        return stat, recv, bits

    def _crc(self, data):

        self._cflags(0x05, 0x04)
        self._sflags(0x0A, 0x80)

        for c in data:
            self._wreg(0x09, c)

        self._wreg(0x01, 0x03)

        i = 0xFF
        while True:
            n = self._rreg(0x05)
            i -= 1
            if not ((i != 0) and not (n & 0x04)):
                break

        return [self._rreg(0x22), self._rreg(0x21)]

    def init(self):

        self.reset()
        self._wreg(Registers.TModeReg, 0x8D)
        self._wreg(Registers.TPrescalerReg, 0x3E)
        self._wreg(Registers.TReloadRegL, 30)
        self._wreg(Registers.TReloadRegH, 0)
        self._wreg(Registers.TxAutoReg, 0x40)
        self._wreg(Registers.ModeReg, 0x3D)
        self.antenna_on()

    def reset(self):
        self._wreg(0x01, 0x0F)

    def antenna_on(self, on=True):

        if on and ~(self._rreg(Registers.TxControlReg) & 0x03):
            self._sflags(Registers.TxControlReg, 0x03)
        else:
            self._cflags(Registers.TxControlReg, 0x03)

    def request(self, mode):

        self._wreg(Registers.BitFramingReg, 0x07)
        (stat, recv, bits) = self._tocard(Commands.PCD_TRANSCEIVE, [mode])

        if (stat != Status.OK) | (bits != 0x10):
            stat = Status.ERR

        return stat, bits

    def anticoll(self):

        ser_chk = 0
        ser = NTAGCommands.ANTICOLL_1

        self._wreg(Registers.BitFramingReg, 0x00)
        (stat, recv, bits) = self._tocard(Commands.PCD_TRANSCEIVE, ser)

        if stat == Status.OK:
            if len(recv) == 5:
                for i in range(4):
                    ser_chk = ser_chk ^ recv[i]
                if ser_chk != recv[4]:
                    stat = Status.ERR
            else:
                stat = Status.ERR

        return stat, recv

    def select_tag(self, ser):

        buf = NTAGCommands.SEL_REQ_1 + ser[:5]
        buf += self._crc(buf)
        (stat, recv, bits) = self._tocard(Commands.PCD_TRANSCEIVE, buf)
        return Status.OK if (stat == Status.OK) and (bits == 0x18) else Status.ERR

    def auth(self, mode, addr, sect, ser):
        return self._tocard(Commands.PCD_AUTHENT, [mode, addr] + sect + ser[:4])[0]

    def stop_crypto1(self):
        self._cflags(0x08, 0x08)

    def read(self, addr):

        data = [NTAGCommands.READ, addr]
        data += self._crc(data)
        (stat, recv, _) = self._tocard(Commands.PCD_TRANSCEIVE, data)
        return recv if stat == Status.OK else None

    def write(self, addr, data):

        buf = [0xA0, addr]
        buf += self._crc(buf)
        (stat, recv, bits) = self._tocard(Commands.PCD_TRANSCEIVE, buf)

        if not (stat == Status.OK) or not (bits == 4) or not ((recv[0] & 0x0F) == 0x0A):
            stat = Status.ERR
        else:
            buf = []
            for i in range(16):
                buf.append(data[i])
            buf += self._crc(buf)
            (stat, recv, bits) = self._tocard(Commands.PCD_TRANSCEIVE, buf)
            if not (stat == Status.OK) or not (bits == 4) or not ((recv[0] & 0x0F) == 0x0A):
                stat = Status.ERR

        return stat
