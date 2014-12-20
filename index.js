"use strict";

(function() {
  var config = require('./config.json');
  var udpServer = require('./lib/udpServer.js')(config);
  var db = require('./lib/db.js')(config);
  var serial = require('./lib/serial.js')(config);
  var app = require('./lib/app.js')(config, db, serial);

  udpServer.start();
  db.start();
  udpServer.on('message', app.messageHandler);
})();
