/* jscs:disable requireCamelCaseOrUpperCaseIdentifiers */
/* jscs:disable requireCapitalizedComments */
/* jshint -W106 */

'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(module.filename);
var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/../config/config.json')[env];
var db        = {};
var sequelize = false;

if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  sequelize = new Sequelize(config.database, config.username,
                            config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename);
  })
  .forEach(function(file) {
    if (file.slice(-3) !== '.js') { return; }
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.Card.belongsTo(db.Member, {as: 'member', foreignKey: 'memberId'});
db.Member.hasMany(db.Card, {as: 'cards', foreignKey: 'memberId'});
db.Log.belongsTo(db.Card, {as: 'card', foreignKey: 'uid', targetKey: 'uid'});
db.Card.hasMany(db.Log, {as: 'logs', foreignKey: 'uid', targetKey: 'uid'});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
