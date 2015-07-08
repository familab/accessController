'use strict'

module.exports = {
  app: {
    host: process.env.HOST || '0.0.0.0',
    port: process.env.PORT || 8888,
    serialPort: process.env.SERIALPORT || '/dev/ttyACM0',
    buadRate: process.env.BUADRATE || 115200
  }
};
