'use strict'

var Cards = {}

// ID
// UID
// MemberId
// Enabled

Cards.getAll = function(req, res) {
  res.send([{id: 1, uid: '5BAE23', memberId: 1, enabled: true}]);
}

Cards.getById = function(req, res) {
  res.send({id: 1, uid: '5BAE23', memberId: 1, enabled: true});
}

Cards.create = function(req, res) {
  res.status(200).end()
}

Cards.updateById = function(req, res) {
  res.status(200).end()
}

Cards.deleteById = function(req, res) {
  res.status(200).end()
}

module.exports = Cards;
