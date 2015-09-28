'use strict';

var udp = require('../udp');

module.exports = {
  on: function(output) {
    this.send(output, true);
  },
  off: function(output) {
    this.send(output, false);
  },
  send: function(output, value) {
    // Lookup host/port for output
    var relay = {
      host: '127.0.0.1',
      port: 4000,
      relay: 3,
    };
    var msg = relay.relay + ':';
    msg += value ? '1' : '0';
    udp.send(msg, relay.port, relay.host);
  },
};
