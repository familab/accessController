'use strict'

var db = require('../../db');
var Logs = {}

// Timestamp
// MemberID
// CardID

Logs.getAll = function(req, res) {
  var data = [];
  db.each('SELECT ROWID as id, timestamp, memberId, cardId FROM logs', function(err, row) {
    if (err) { res.send(err); throw err; }
    else {
      data.push({
        id: row.id,
        timestamp: new Date(Date.parse(row.timestamp)),
        memberId: row.memberId,
        cardId: row.cardId
      });
    }
  }, function(err) {
    if (err) { res.send(err); throw err; }
    res.send(data);
  });
};

Logs.getById = function(req, res) {
  db.get('SELECT ROWID as id, timestamp, memberId, cardId FROM logs WHERE ROWID = $id', [req.params.id], function(err, row) {
    if (err) { res.send(err); throw err; }
    else res.send(
      {
        id: row.id,
        timestamp: new Date(Date.parse(row.timestamp)),
        memberId: row.memberId,
        cardId: row.cardId
      }
    );
  });
};

Logs.create = function(req, res) {
  res.status(200).end()
}

Logs.updateById = function(req, res) {
  res.status(200).end()
}

Logs.deleteById = function(req, res) {
  res.status(200).end()
}

module.exports = Logs;
