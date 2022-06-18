'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('TestResultPayments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      member_token: {
        allowNull: false,
        type: Sequelize.STRING
      },
      test_result_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      price: {
        allowNull: true,
        type: Sequelize.DOUBLE
      },
      transaction_reference: {
        allowNull: true,
        type: Sequelize.STRING
      },
      transaction_date: {
        allowNull: true,
        type: Sequelize.DATE
      },
      transaction_type: {
        type: Sequelize.STRING,
        allowNull: true
      },
      sessionId: {
        type: Sequelize.STRING,
        allowNull: true
      },
      status: {
        allowNull: false,
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }).then(function () {
      queryInterface.addIndex("TestResultPayments", ["member_token", "test_result_id"]);
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('TestResultPayments');
  }
};