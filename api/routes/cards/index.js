'use strict';

/**
 * Module dependencies.
 */
var db = require('../../models');

/**
 * @swagger
 * definition:
 *   Card:
 *     type: object
 *     required:
 *       - name
 *       - uid
 *       - memberId
 *     properties:
 *       id:
 *         type: UUIDV1
 *       name:
 *         type: string
 *       uid:
 *         type: string
 *       memberId:
 *         type: UUIDV1
 *       enabled:
 *         type: boolean
 *       createdAt:
 *         type: date
 *       updatedAt:
 *         type: date
 */

/**
 * @swagger
 * definition:
 *   CardEx:
 *     allOf:
 *       - $ref: '#/definitions/Card'
 *       - properties:
 *           member:
 *             $ref: '#/definitions/Member'
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
 * GET all cards for a member.
 * @swagger
 * /members/{memberId}/cards:
 *   get:
 *     operationId: getMemberCards
 *     summary: Get all cards
 *     parameters:
 *       - name: memberId
 *         description: member id
 *         in: path
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       default:
 *         description: unexpected error
 *         schema:
 *           $ref: '#/definitions/Error'
 *       200:
 *         description: all cards
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/CardEx'
 * /cards:
 *   get:
 *     operationId: getCards
 *     summary: Get all cards
 *     produces:
 *       - application/json
 *     responses:
 *       default:
 *         description: unexpected error
 *         schema:
 *           $ref: '#/definitions/Error'
 *       200:
 *         description: all cards
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/CardEx'
 */
exports.index = function* (next) {
  this.body = yield db.Card.findAll({where: this.params, include: [
    { model: db.Member, as: 'member'},
  ], });
  yield next;
};

/**
 * GET card by :id and :memberId.
 * @swagger
 * /members/{memberId}/cards/{id}:
 *   get:
 *     operationId: getMemberCard
 *     summary: Get card by {id}
 *     parameters:
 *       - name: memberId
 *         description: member id
 *         in: path
 *         required: true
 *         type: string
 *       - name: id
 *         description: card id
 *         in: path
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: card
 *         schema:
 *           $ref: '#/definitions/CardEx'
 *       400:
 *         description: validation error
 *         schema:
 *           $ref: '#/definitions/Error'
 *       default:
 *         description: unexpected error
 *         schema:
 *           $ref: '#/definitions/Error'
 * /cards/{id}:
 *   get:
 *     operationId: getCard
 *     summary: Get card by {id}
 *     parameters:
 *       - name: id
 *         description: card id
 *         in: path
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: card
 *         schema:
 *           $ref: '#/definitions/CardEx'
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

  this.body = yield db.Card.findOne({ where: this.params, include: [
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
 * POST a new card.
 * @swagger
 * /members/{memberId}/cards:
 *   post:
 *     operationId: createMemberCard
 *     summary: Create a new card
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: memberId
 *         description: member id
 *         in: path
 *         required: true
 *         type: string
 *       - name: card
 *         description: card to add to the system
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Card'
 *     responses:
 *       201:
 *         description: created card
 *         schema:
 *           $ref: '#/definitions/Card'
 *       400:
 *         description: validation error
 *         schema:
 *           $ref: '#/definitions/Error'
 *       default:
 *         description: unexpected error
 *         schema:
 *           $ref: '#/definitions/Error'
 * /cards:
 *   post:
 *     operationId: createCard
 *     summary: Create a new card
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: card
 *         description: card to add to the system
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Card'
 *     responses:
 *       201:
 *         description: created card
 *         schema:
 *           $ref: '#/definitions/Card'
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
  if (!this.request.body.name) {
    this.throw(400, 'name required');
  }
  if (!this.request.body.uid) {
    this.throw(400, 'uid required');
  }
  if (this.params.memberId) {
    this.request.body.memberId = this.params.memberId;
  }
  if (!this.request.body.memberId) {
    this.throw(400, 'memberId required');
  }

  this.status = 201;
  this.body = yield db.Card.create(this.request.body);
  yield next;
};

/**
 * PUT a card
 * @swagger
 * /members/{memberId}/cards/{id}:
 *   put:
 *     operationId: updateMemberCard
 *     summary: Update a card
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: memberId
 *         description: member id
 *         in: path
 *         required: true
 *         type: string
 *       - name: id
 *         description: card id
 *         in: path
 *         required: true
 *         type: string
 *       - name: card
 *         description: card to update
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Card'
 *     responses:
 *       200:
 *         description: updated card
 *         schema:
 *           $ref: '#/definitions/Card'
 *       400:
 *         description: validation error
 *         schema:
 *           $ref: '#/definitions/Error'
 *       default:
 *         description: unexpected error
 *         schema:
 *           $ref: '#/definitions/Error'
 * /cards/{id}:
 *   put:
 *     operationId: updateCard
 *     summary: Update a card
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: card id
 *         in: path
 *         required: true
 *         type: string
 *       - name: card
 *         description: card to update
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Card'
 *     responses:
 *       200:
 *         description: updated card
 *         schema:
 *           $ref: '#/definitions/Card'
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
  if (this.params.memberId) {
    this.request.body.memberId = this.params.memberId;
  }
  if (!this.params.id) {
    this.throw(400, 'id required');
  }
  var card = yield db.Card.findOne({ where: {id: this.params.id} });

  this.body = yield card.update(this.request.body);
  yield next;
};

/**
 * DELETE a card
 * @swagger
 * /members/{memberId}/cards/{id}:
 *   delete:
 *     operationId: deleteMemberCard
 *     summary: Delete a card
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: memberId
 *         description: member id
 *         in: path
 *         required: true
 *         type: string
 *       - name: id
 *         description: card id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       204:
 *         description: card deleted
 *       400:
 *         description: validation error
 *         schema:
 *           $ref: '#/definitions/Error'
 *       default:
 *         description: unexpected error
 *         schema:
 *           $ref: '#/definitions/Error'
 * /cards/{id}:
 *   delete:
 *     operationId: deleteCard
 *     summary: Delete a card
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: card id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       204:
 *         description: card deleted
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
  var card = yield db.Card.findOne({ where: this.params });
  if (card) {
    yield card.destroy();
  }

  this.status = 204;
  this.body = '';
  yield next;
};
