'use strict';
module.exports = function(sequelize, DataTypes) {
  var Member = sequelize.define('Member', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV1,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
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

  return Member;
};
