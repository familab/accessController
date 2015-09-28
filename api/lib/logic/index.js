'use strict';

var sensor = require('../sensor');
var output = require('../output');

module.exports = {
  start: function(server) {
    sensor.on('uid', function(obj) {
      console.log('Read UID: ', obj.uid);
      output.on('front door');
    });
    sensor.start(server);
  },
  stop: function() {
    sensor.stop();
  },
};
