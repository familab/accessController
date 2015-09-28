'use strict';
var udp = require('dgram');
var config = require('../../config/udp.json');
var handlers = {};
var socket = false;

config.host = process.env.UDP_HOST || config.host;
config.port = process.env.UDP_PORT || config.port;

module.exports = {
  on: function(eventName, handler) {
    handlers[eventName] = handlers[eventName] || [];
    handlers[eventName].push(handler);
  },
  send: function(msg, port, host) {
    console.log('Sending msg: ', msg);
    console.log('Sending %d bytes to %s:%d\n', msg.length, host, port);
    socket.send(msg, 0, msg.length, port, host);
  },
  startDaemon: function(server) {
    if (socket) {
      return socket;
    }
    socket = udp.createSocket('udp4');
    socket.on('message', function(msg, rinfo) {
      console.log('Received %d bytes from %s:%d\n',
                  msg.length, rinfo.address, rinfo.port);
      if (handlers.message) {
        handlers.message.forEach(function(handler) {
          handler(msg, rinfo);
        });
      }
    });
    socket.on('listening', function() {
      var address = socket.address();
      console.log('server listening ' +
          address.address + ':' + address.port);
      if (handlers.listening) {
        handlers.listening.forEach(function(handler) {
          handler();
        });
      }
    });
    socket.on('close', function() {
      console.log('server stopped');
      if (handlers.close) {
        handlers.close.forEach(function(handler) {
          handler();
        });
      }
    });
    socket.on('error', function(err) {
      console.log('Error: ', err);
      if (handlers.error) {
        handlers.error.forEach(function(handler) {
          handler(err);
        });
      }
    });

    socket.bind(config.port, config.host);

    server.on('close', socket.close);

    return socket;
  },
  stopDaemon: function() {
    socket.close();
    socket = false;
  },
};
