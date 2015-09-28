'use strict';
var udp = require('../udp');
var uid = require('./uid');
var handlers = {};

module.exports = {
  on: function(eventName, handler) {
    handlers[eventName] = handlers[eventName] || [];
    handlers[eventName].push(handler);
  },
  start: function(server) {
    udp.on('message', function(msg, rinfo) {
      // Determine Message Type

      // Message Type: uid read
      uid.trigger(uid.parse(msg, rinfo), handlers.uid);
    });
    udp.startDaemon(server);
  },
  stop: udp.stopDaemon,
};
