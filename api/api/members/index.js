'use strict'

var Members = {}

Members.getAll = function(req, res) {
  res.send('Members')
}

Members.getById = function(req, res) {
  res.send('Member')
}

Members.create = function(req, res) {

}

Members.updateById = function(req, res) {

}

Members.deleteById = function(req, res) {

}

module.exports = Members;
