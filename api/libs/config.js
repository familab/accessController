'use strict'

module.exports = {
  app: {
    host: process.env.HOST || '0.0.0.0',
    port: process.env.PORT || 8888
  },
  serial: {
    path: process.env.SERIALPORT || '/dev/ttyUSB0',
    buadRate: process.env.BUADRATE || 9600
  },
  door: {
    pin: 7,
    delay: 5000
  }
};
