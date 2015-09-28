'use strict';

/**
 * Module dependencies.
 */
var db = require('../../models');

/**
 * @swagger
 * definition:
 *   Log:
 *     type: object
 *     required:
 *       - action
 *       - uid
 *       - success
 *     properties:
 *       id:
 *         type: integer
 *       action:
 *         type: string
 *       uid:
 *         type: string
 *       success:
 *         type: boolean
 *       createdAt:
 *         type: date
 *       updatedAt:
 *         type: date
 *       deletedAt:
 *         type: date
 */

/**
 * @swagger
 * definition:
 *   LogEx:
 *     allOf:
 *       - $ref: '#/definitions/Log'
 *       - properties:
 *           card:
 *             $ref: '#/definitions/CardEx'
 */

/**
 *@swagger
 * definition:
 *   Error:
 *     type: object
 *     properties:
 *       error:
 *         type: string
 */

/**
 * GET all logs.
 * @swagger
 * /logs:
 *   get:
 *     operationId: getlogs
 *     summary: Get all logs
 *     produces:
 *       - application/json
 *     responses:
 *       default:
 *         description: unexpected error
 *         schema:
 *           $ref: '#/definitions/Error'
 *       200:
 *         description: all logs
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/LogEx'
 */
exports.index = function* (next) {
  var logs = yield db.Log.findAll({ include: [
    { model: db.Card, as: 'card', include: [
      { model: db.Member, as: 'member'},
    ], },
  ], });

  this.body = logs;
  yield next;
};

/**
 * GET log by :id.
 * @swagger
 * /logs/{id}:
 *   get:
 *     operationId: getlog
 *     summary: Get log by {id}
 *     parameters:
 *       - name: id
 *         description: log id
 *         in: path
 *         required: true
 *         type: integer
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: log
 *         schema:
 *           $ref: '#/definitions/LogEx'
 *       400:
 *         description: validation error
 *         schema:
 *           $ref: '#/definitions/Error'
 *       default:
 *         description: unexpected error
 *         schema:
 *           $ref: '#/definitions/Error'
 */
exports.show = function* (next) {
  if (!this.params.id) {
    this.throw(400, 'id required');
  }
  this.body = yield db.Log.findOne({ where: {id: this.params.id}, include: [
    { model: db.Card, as: 'card', include: [
      { model: db.Member, as: 'member'},
    ], },
  ], });
  if (!this.body) {
    this.status = 404;
  }
  yield next;
};

/**
 * POST a new log.
 * @swagger
 * /logs:
 *   post:
 *     operationId: createlog
 *     summary: Create a new log
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: log
 *         description: log to add to the system
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Log'
 *     responses:
 *       201:
 *         description: created log
 *         schema:
 *           $ref: '#/definitions/Log'
 *       400:
 *         description: validation error
 *         schema:
 *           $ref: '#/definitions/Error'
 *       default:
 *         description: unexpected error
 *         schema:
 *           $ref: '#/definitions/Error'
 */
exports.create = function* (next) {
  if (!this.request.body.action) {
    this.throw(400, 'action required');
  }
  if (!this.request.body.uid) {
    this.throw(400, 'uid required');
  }
  if (!this.request.body.success) {
    this.throw(400, 'success required');
  }

  this.status = 201;
  this.body = yield db.Log.create(this.request.body);
  yield next;
};

/**
 * PUT a log
 * @swagger
 * /logs/{id}:
 *   put:
 *     operationId: updatelog
 *     summary: Update a log
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: log id
 *         in: path
 *         required: true
 *         type: integer
 *       - name: log
 *         description: log to update
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Log'
 *     responses:
 *       200:
 *         description: updated log
 *         schema:
 *           $ref: '#/definitions/Log'
 *       400:
 *         description: validation error
 *         schema:
 *           $ref: '#/definitions/Error'
 *       default:
 *         description: unexpected error
 *         schema:
 *           $ref: '#/definitions/Error'
 */
exports.update = function* (next) {
  if (!this.params.id) {
    this.throw(400, 'id required');
  }
  var log = yield db.Log.findOne({ where: {id: this.params.id} });

  this.body = yield log.update(this.request.body);
  yield next;
};

/**
 * DELETE a log
 * @swagger
 * /logs/{id}:
 *   delete:
 *     operationId: deletelog
 *     summary: Delete a log
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: log id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       204:
 *         description: log deleted
 *       400:
 *         description: validation error
 *         schema:
 *           $ref: '#/definitions/Error'
 *       default:
 *         description: unexpected error
 *         schema:
 *           $ref: '#/definitions/Error'
 */
exports.destroy = function* (next) {
  if (!this.params.id) {
    this.throw(400, 'id required');
  }
  var log = yield db.Log.findOne({ where: {id: this.params.id} });
  if (log) {
    yield log.destroy();
  }

  this.status = 204;
  this.body = '';
  yield next;
};
