'use strict'
var express = require('express'),
    router = express.Router(),
    members = require('./routes/members/index'),
    cards = require('./routes/cards/index'),
    logs = require('./routes/logs/index')

// Members
router.get('/members', members.getAll)
router.post('/members', members.create)
router.get('/members/:id', members.getById)
router.put('/members/:id', members.updateById)
router.delete('/members/:id', members.deleteById)

// Member Cards
router.get('/members/:memberId/cards', cards.getAll)
router.post('/members/:memberId/cards', cards.create)
router.get('/members/:memberId/cards/:id', cards.getById)
router.put('/members/:memberId/cards/:id', cards.updateById)
router.delete('/members/:memberId/cards/:id', cards.deleteById)

// Cards
router.get('/cards', cards.getAll)
router.post('/cards', cards.create)
router.get('/cards/:id', cards.getById)
router.put('/cards/:id', cards.updateById)
router.delete('/cards/:id', cards.deleteById)

// Logs
router.get('/logs', logs.getAll)
//router.post('/logs', logs.create)
router.get('/logs/:id', logs.getById)
//router.put('/logs/:id', logs.updateById)
//router.delete('/logs/:id', logs.deleteById)

module.exports = router
