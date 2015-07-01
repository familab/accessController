'use strict'

var db = require('../../db');
var Members = {};

  // ID
  // Name
  // Email
  // Enabled

Members.getAll = function(req, res) {
  var data = [];
  db.each('SELECT ROWID as id, name, email, enabled FROM members', function(err, row) {
    if (err) { res.send(err); throw err; }
    else {
      data.push({
        id: row.id,
        name: row.name,
        email: row.email,
        enabled: row.enabled == 1 ? true : false
      });
    }
  }, function(err) {
    if (err) { res.send(err); throw err; }
    res.send(data);
  });
};

Members.getById = function(req, res) {
  db.get('SELECT ROWID as id, name, email, enabled FROM members WHERE ROWID = $id', [req.params.id], function(err, row) {
    if (err) { res.send(err); throw err; }
    else res.send(
      {
        id: row.id,
        name: row.name,
        email: row.email,
        enabled: row.enabled == 1 ? true : false
      }
    );
  });
};

Members.create = function(req, res) {
  res.status(200).end()
};

Members.updateById = function(req, res) {
  res.status(200).end()
};

Members.deleteById = function(req, res) {
  db.run('DELETE FROM members WHERE ROWID = $id', [req.params.id], function(err) {
      if (err) { res.send(err); throw err; }
      else res.status(200).end()
  });
};

module.exports = Members;
