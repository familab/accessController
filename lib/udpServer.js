var debug = require('debug')('FamiLAB:UDPServer');
var dgram = require('dgram');

var service = {
  config: null,
  start: function() {
    var server = this.server = dgram.createSocket('udp4');

    server.on('listening', function() {
      var address = server.address();
      debug('UDP Server listening on ' + address.address + ':' + address.port);
    });

    server.bind(this.config.UDPPort, this.config.UDPHost);
  },
  on: function(eventName, handler) {
    var server = this.server;
    server.on(eventName, function(message, remote) {
      handler(message, remote, server);
    });
  }
};

module.exports = function(config) {
  service.config = config;
  return service;
};
