// Send Auth packet to server

var config = require('../config.json');

var dgram = require('dgram');
// READER_ID|CARD_ID|NONCE
var message = new Buffer('1|8546970329867|' + Date.now());

var client = dgram.createSocket('udp4');

client.on('message', function(message, remote) {
  console.log(remote.address + ':' + remote.port + ' - ' + message);
  client.close();
});

client.bind(function() {
  client.setBroadcast(true);
  client.send(message, 0, message.length, config.UDPPort, config.UDPBroadcastAddress, function(err, bytes) {
    if (err) throw err;
    console.log('UDP message sent to ' + config.UDPBroadcastAddress + ':' + config.UDPPort + ': ' + message);
  });
});
