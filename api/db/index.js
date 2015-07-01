'use strict'

var path = require('path');
var config = require('./config.js');
var sqlite3 = require('sqlite3');

if (config.sqlite3 && config.sqlite3.verbose) {
  sqlite3 = require('sqlite3').verbose();
}

var db = new sqlite3.Database(path.resolve(__dirname, config.sqlite3.filename) );

module.exports = db
