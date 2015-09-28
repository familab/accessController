'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Cards', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      uid: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING,
      },
      memberId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Members',
          key: 'id',
        },
      },
      enabled: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Cards');
  },
};
