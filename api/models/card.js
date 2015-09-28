'use strict';
module.exports = function(sequelize, DataTypes) {
  var Card = sequelize.define('Card', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV1,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    uid: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    memberId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Member',
        key: 'id',
      },
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  }, {
    classMethods: {
      associate: function(models) {
        // Associations can be defined here
      },
    },
  });

  return Card;
};
