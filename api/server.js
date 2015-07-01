'use strict'
var express = require('express'),
    app = express(),
    config = require('./libs/config')

app.get('/', function(req, res){
  res.send({active: true})
})

// Server Listener
app.listen(config.app.port, config.app.host, function(e) {
  console.log('Listening on http://%s:%s', config.app.host, config.app.port)
})
