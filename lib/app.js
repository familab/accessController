var debug = require('debug')('FamiLAB:App');

var app = {
  config: null,
  db: null,
  serial: null,
  messageHandler: function(message, remote, server) {
    debug('Received message from ' + remote.address + ':' + remote.port + ' - ' + message);
    var data = message.toString().split('|');
    app.db.canUserEnter(data[0], data[1], function(err, result) {
      debug(result);
      // READER_ID|CARD_ID|STATUS|NONCE
      var response = new Buffer(data[0] + '|' + data[1] + '|' + (result ? 'SUCCESS' : 'FAIL') + '|' + data[2]);

      server.send(response, 0, response.length, remote.port, remote.address, function(err, bytes) {
        debug('UDP message sent to ' + remote.address + ':' + remote.port + ': ' + response);
      });
      config.readerMapping[data[0]].forEach(function(relayId) {
        serial.write('OPEN ' + relayId);
        setTimeout(function() {
          serial.write('CLOSE ' + relayId);
        }, config.doorTimeout);
      });
    });
  }
};

module.exports = function(config, db, serial) {
  app.config = config;
  app.db = db;
  app.serial = serial;
  return app;
};
