'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('TestUploads', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      upload_test_result_ref: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      test_upload_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      test_result_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      tube_number: {
        type: Sequelize.STRING,
        allowNull: false
      },
      result: {
        type: Sequelize.STRING,
        allowNull: true
      },
      result_value: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      result_upload_by_file: {
        type: Sequelize.STRING,
        allowNull: false
      },
      created_by: {
        type: Sequelize.STRING,
        allowNull: false
      },
      created_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false
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
      queryInterface.addIndex("TestUploads", ["created_date", "status"]);
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('TestUploads');
  }
};