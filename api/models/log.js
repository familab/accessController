'use strict';
module.exports = function(sequelize, DataTypes) {
  var Log = sequelize.define('Log', {
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    uid: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Card',
        key: 'uid',
      },
    },
    success: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  }, {
    paranoid: true,
    classMethods: {
      associate: function(models) {
        // Associations can be defined here
      },
    },
  });

  return Log;
};
