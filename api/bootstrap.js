'use strict'

var System = require('es6-module-loader').System
System.import('./server').then( function(index) {
    index.main(__dirname)
}).catch( function(err) {
    console.error('Error: ', err)
})
