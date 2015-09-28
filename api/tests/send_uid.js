'use strict';

var udp = require('dgram');
var config = require('../config/udp.json');
var msg = 'test';

config.host = process.env.UDP_HOST || config.host;
config.port = process.env.UDP_PORT || config.port;

var socket = udp.createSocket('udp4');

socket.send(msg, 0, msg.length, config.port, config.host, function() {
  socket.close();
});
