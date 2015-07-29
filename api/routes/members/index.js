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
    var lastId = this.lastID
    var cards = body.cards
    var cardLength = cards.length
    var completed = 0
    var errored = 0
    for(var i = 0; i < cardLength; i++) {
      var card = cards[i]
      var params =
      [ card.uid
      , lastId
      , card.name
      ]
      db.run('INSERT INTO cards (uid, memberId, name, enabled) VALUES (?, ?, ?, 1)', params, function(e, row){
        if(e) {
          console.error("Error inserting card: ", e.stack || e)
          errored++
        }
        completed++

        if(completed === cardLength) {
          var out = {}
          out.success = true
          if(errored) {
            out.cardsNotInserted = errored
          }
          res.status(201).send(out)
        }
      })
    }

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
    var cards = body.cards
    var cardLength = cards.length
    var completed = 0
    var errored = 0
    for(var i = 0; i < cardLength; i++) {
      var card = cards[i]
      var params =
      [ card.uid
      , card.name
      , card.id
      ]
      db.run('UPDATE cards SET uid = ?, name = ? WHERE ROWID = ?', params, function(e, row){
        if(e) {
          console.error("Error inserting card: ", e.stack || e)
          errored++
        }
        completed++

        if(completed === cardLength) {
          var out = {}
          out.success = true
          if(errored) {
            out.cardsNotInserted = errored
          }
          res.status(200).send(out)
        }
      })
    }
  })
};

Members.deleteById = function(req, res) {
  db.run('DELETE FROM members WHERE ROWID = $id', [req.params.id], function(err) {
      if (err) {
        res.send(err); throw err;
      }
      db.run('DELETE FROM cards WHERE memberId = $id', [req.params.id], function(err){
        if(err) {
          console.error('Could not delete cards for: ', req.params.id, err.stack || err)
          res.send(err)
        }

        res.status(204).end()
      })
  });
};

module.exports = Members;
