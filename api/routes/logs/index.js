'use strict'

var db = require('../../db');
var Logs = {}

// Timestamp
// MemberID
// CardID

Logs.getAll = function(req, res) {
  var data = [];
  db.each('SELECT ROWID as id, timestamp, uid, allowed FROM logs LIMIT 100 ORDER BY id desc', function(err, row) {
    if (err) { res.send(err); throw err; }
    else {
      data.push({
        id: row.id,
        timestamp: new Date(Date.parse(row.timestamp)),
        uid: row.uid,
        allowed: row.allowed == 1 ? true : false
      });
    }
  }, function(err) {
    if (err) { res.send(err); throw err; }
    res.send(data);
  });
};

Logs.getById = function(req, res) {
  db.get('SELECT ROWID as id, timestamp, uid, allowed FROM logs WHERE ROWID = $id', [req.params.id], function(err, row) {
    if (err) { res.send(err); throw err; }
    else res.send(
      {
        id: row.id,
        timestamp: new Date(Date.parse(row.timestamp)),
        uid: row.uid,
        allowed: row.allowed == 1 ? true : false
      }
    );
  });
};

Logs.create = function(uid, allowed) {
  var now = new Date();
  db.run('INSERT INTO logs (timestamp, uid, allowed) VALUES (?, ?, ?)', [now.toUTCString(), uid, allowed], function(e, row){
    if(e) {
      return console.error('Error - Logs Create: ', e.stack || e);
    }
  });
}

module.exports = Logs;
