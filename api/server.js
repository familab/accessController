'use strict'
var express = require('express'),
    app = express(),
    config = require('./libs/config'),
    router = require('./routes')

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
})
