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
  var body = req.body
  var inserts =
    [ body.name
    , body.email
    ]
  db.run('INSERT INTO members (name, email, enabled) VALUES (?,?, 1)', inserts, function(e, row){
    if(e) {
      res.send(e);
      return console.error('Error - Member Create: ', e.stack || e);
    }

    res.status(201).send({success: true})
  })
};

Members.updateById = function(req, res) {
  var body = req.body
  var inserts =
  [ body.name
  , body.email
  , body.enabled
  , req.params.id
  ]
  var stmt = 'UPDATE members SET name = ?, email = ?, enabled = ? WHERE ROWID = ?'
  db.run(stmt, inserts, function(e, row){
    if(e) {
      res.send(e);
      return console.error('Error - Member Update: ', e.stack || e)
    }
    res.send({success: true})
  })
};

Members.deleteById = function(req, res) {
  db.run('DELETE FROM members WHERE ROWID = $id', [req.params.id], function(err) {
      if (err) { res.send(err); throw err; }
      else res.status(200).end()
  });
};

module.exports = Members;
