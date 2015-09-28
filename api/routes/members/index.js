'use strict';

/**
 * Module dependencies.
 */
var db = require('../../models');

/**
 * @swagger
 * definition:
 *   Member:
 *     type: object
 *     required:
 *       - name
 *       - email
 *     properties:
 *       id:
 *         type: UUIDV1
 *       name:
 *         type: string
 *       email:
 *         type: string
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
 *   MemberEx:
 *     allOf:
 *       - $ref: '#/definitions/Member'
 *       - properties:
 *           cards:
 *             type: array
 *             items:
 *               $ref: '#/definitions/Card'
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
 * GET all members.
 * @swagger
 * /members:
 *   get:
 *     operationId: getMembers
 *     summary: Get all members
 *     produces:
 *       - application/json
 *     responses:
 *       default:
 *         description: unexpected error
 *         schema:
 *           $ref: '#/definitions/Error'
 *       200:
 *         description: all members
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/MemberEx'
 */
exports.index = function* (next) {
  this.body = yield db.Member.findAll({ include: [
    { model: db.Card, as: 'cards' },
  ], });
  yield next;
};

/**
 * GET member by :id.
 * @swagger
 * /members/{id}:
 *   get:
 *     operationId: getMember
 *     summary: Get member by {id}
 *     parameters:
 *       - name: id
 *         description: member id
 *         in: path
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: member
 *         schema:
 *           $ref: '#/definitions/MemberEx'
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
  this.body = yield db.Member.findOne({
    where: {id: this.params.id},
    include: [{ model: db.Card, as: 'cards' }],
  });
  if (!this.body) {
    this.status = 404;
  }
  yield next;
};

/**
 * POST a new member.
 * @swagger
 * /members:
 *   post:
 *     operationId: createMember
 *     summary: Create a new member
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: member
 *         description: member to add to the system
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Member'
 *     responses:
 *       201:
 *         description: created member
 *         schema:
 *           $ref: '#/definitions/Member'
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
  if (!this.request.body.email) {
    this.throw(400, 'email required');
  }

  this.status = 201;
  var member = yield db.Member.create(this.request.body)
    .then(function(member) {
      return member.get({
        plain: true,
      });
    });

  if (this.request.body.cards) {
    this.request.body.cards.forEach(function(card) {
      card.memberId = member.id;
    });
    yield db.Card.bulkCreate(this.request.body.cards);
    member.cards = yield db.Card.findAll({ where: {memberId: member.id} });
  }

  this.body = member;
  console.log(member);
  yield next;
};

/**
 * PUT a member
 * @swagger
 * /members/{id}:
 *   put:
 *     operationId: updateMember
 *     summary: Update a member
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: member id
 *         in: path
 *         required: true
 *         type: string
 *       - name: member
 *         description: member to update
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Member'
 *     responses:
 *       200:
 *         description: updated member
 *         schema:
 *           $ref: '#/definitions/Member'
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
  var member = yield db.Member.findOne({ where: {id: this.params.id} });

  this.body = yield member.update(this.request.body);
  yield next;
};

/**
 * DELETE a member
 * @swagger
 * /members/{id}:
 *   delete:
 *     operationId: deleteMember
 *     summary: Delete a member
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: member id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       204:
 *         description: member deleted
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
  var member = yield db.Member.findOne({ where: {id: this.params.id} });
  if (member) {
    yield db.Card.destroy({ where: { memberId: member.id } });
    yield member.destroy();
  }

  this.status = 204;
  this.body = '';
  yield next;
};
