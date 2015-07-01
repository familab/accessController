'use strict'

var Logs = {}

// Timestamp
// MemberID
// CardID

Logs.getAll = function(req, res) {
  res.send([
    {timestamp: Date.now, memberId: 1, cardId: 1}
  ])
}

Logs.getById = function(req, res) {
  res.send([
    {timestamp: Date.now, memberId: 1, cardId: 1}
  ])
}

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
