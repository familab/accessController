'use strict'
var express = require('express'),
    app = express(),
    config = require('./libs/config'),
    router = require('./routes'),
    SerialPort = require('serialport').SerialPort,
    serialPort = new SerialPort(config.serial.path, {
      baudrate: config.serial.buadRate
    }, false),
    cards = require('./routes/cards'),
    door = require('./libs/door'),
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
  if(process.env.PROD) {
    door.setup(function() {
      serialPort.open(function (error) {
        if ( error ) {
          console.log('failed to open: '+ error);
        } else {
          serialPort.on('data', function(data) {
            cards.isUIDAllowed(data, function(err, test) {
              if (err) throw err;
              door.open();
            });
          });
        }
      });
    });
  }
})
