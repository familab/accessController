'use strict'
var express = require('express'),
    app = express(),
    config = require('./libs/config'),
    router = require('./routes'),
    serialport = require('serialport'),
    SerialPort = serialport.SerialPort,
    serialPort = new SerialPort(config.serial.path, {
      parser: serialport.parsers.readline("\n"),
      baudrate: config.serial.buadRate
    }, false),
    cards = require('./routes/cards'),
    logs = require('./routes/logs'),
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
          return console.log('failed to open: '+ error);
        }
        serialPort.on('data', function(data) {
          var uid = data.toString().replace(/(\r\n|\n|\r)/gm,"");
          cards.isUIDAllowed(uid, function(err, allowed) {
            if (err) throw err;
            logs.create(uid, allowed);
            if (allowed) door.open();
            else console.log('Card ' + uid + ' denied' );
          });
        });
      });
    });
  }
});
