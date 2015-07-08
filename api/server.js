'use strict'
var express = require('express'),
    app = express(),
    config = require('./libs/config'),
    router = require('./routes'),
    SerialPort = require('serialport').SerialPort,
    serialPort = new SerialPort(config.serialPort, {
      baudrate: config.buadRate
    }, false),
    bodyParser = require('body-parser');

app.use(bodyParser.json())

app.get('/', function(req, res){
  res.send({
    active: true,
    timestamp: new Date().getTime()
  })
})

app.use('/api/v1', router)

// Server Listener
app.listen(config.app.port, config.app.host, function(e) {
  console.log('Listening on http://%s:%s', config.app.host, config.app.port)
  serialPort.open(function (error) {
    if ( error ) {
      console.log('failed to open: '+error);
    } else {
      console.log('open');
      serialPort.on('data', function(data) {
        console.log('data received: ' + data);
      });
    }
  });
})
