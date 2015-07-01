'use strict'
var express = require('express'),
    router = express.Router(),
    members = require('./api/members/index'),
    cards = require('./api/cards/index')

// Members
router.get('/members', members.getAll)
router.post('/members', members.create)
router.get('/members/:id', members.getById)
router.put('/members/:id', members.updateById)
router.delete('/members:id', members.deleteById)

// Cards
router.get('/cards', cards.getAll)
router.post('/cards', cards.create)
router.get('/cards/:id', cards.getById)
router.put('/cards/:id', cards.updateById)
router.delete('/cards/:id', cards.deleteById)

module.exports = router
