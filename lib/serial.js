var debug = require('debug')('FamiLAB:Serial');
var SerialPort = require('serialport').SerialPort;

var serial = {
  config: null,
  serialPort: null
};

module.exports = function(config) {
  serial.config = config;
  serial.serialPort = new SerialPort(config.serialPort.path, config.serialPort.options);
  serial.serialPort.on('open', function() {
    return serial.serialPort;
  });
};
