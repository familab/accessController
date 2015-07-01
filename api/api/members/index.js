'use strict'

var db = require('../../db');
var Members = {};

Members.getAll = function(req, res) {

  // ID
  // Name
  // Email
  // Enabled

  //db.all('')
  //function(err, rows) {}
  res.send([
    {id: 1, name: 'John Doe', email: 'jon@familab.org', enabled: true},
    {id: 2, name: 'Jane Doe', email: 'jane@familab.org', enabled: false}
  ]);
};

Members.getById = function(req, res) {
  res.send({id: 1, name: 'John Doe', email: 'jon@familab.org', enabled: true});
};

Members.create = function(req, res) {
  res.status(200).end()
};

Members.updateById = function(req, res) {
  res.status(200).end()
};

Members.deleteById = function(req, res) {
  res.status(200).end()
};

module.exports = Members;
