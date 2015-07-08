'use strict'

var db = require('../../db');
var Cards = {}

// ID
// UID
// MemberId
// Enabled

Cards.getAll = function(req, res) {
  if(req.params.memberId) {
    db.all('SELECT ROWID as id, uid, memberId, enabled FROM cards WHERE memberId = $memberId', [req.params.memberId], function(err, rows) {
      if (err) { res.send(err); throw err; }
      else res.send(rows);
    });
  }
  else {
    db.all('SELECT ROWID as id, uid, memberId, enabled FROM cards', function(err, rows) {
      if (err) { res.send(err); throw err; }
      else res.send(rows);
    });
  }
}

Cards.getById = function(req, res) {
  if(req.params.memberId) {
    db.get('SELECT ROWID as id, uid, memberId, enabled FROM cards WHERE ROWID = $id AND memberId = $memberId', [req.params.id, req.params.memberId], function(err, row) {
      if (err) { res.send(err); throw err; }
      else res.send(row);
    });
  }
  else {
    db.get('SELECT ROWID as id, uid, memberId, enabled FROM cards WHERE ROWID = $id', [req.params.id], function(err, row) {
      if (err) { res.send(err); throw err; }
      else res.send(row);
    });
  }
}

Cards.create = function(req, res) {
  res.status(200).end()
}

Cards.updateById = function(req, res) {
  res.status(200).end()
}

Cards.deleteById = function(req, res) {
  db.run('DELETE FROM cards WHERE ROWID = $id', [req.params.id], function(err) {
      if (err) { res.send(err); throw err; }
      else res.status(200).end()
  });
};

Cards.isUIDAllowed = function(uid, cb) {
  db.get('SELECT cards.UID FROM cards JOIN members on members.ROWID = cards.memberId WHERE cards.enabled = "1" AND members.enabled = "1" AND cards.uid = "$uid"', [uid], function(err, row) {
    if(err) return cb(err);
    if(row) return cb(null, true);
    else return cb(null, false);
  });
}

module.exports = Cards;
