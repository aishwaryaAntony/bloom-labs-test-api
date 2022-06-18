'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('TestValueTypes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      test_type_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      code:{
        allowNull: true,
        type: Sequelize.STRING
      },
      display_name:{
        allowNull: true,
        type: Sequelize.STRING
      },
      value_type: {
        allowNull: true,
        type: Sequelize.STRING
      },
      min: {
        allowNull: true,
        type: Sequelize.STRING
      },
      max: {
        allowNull: true,
        type: Sequelize.STRING
      },
      unit: {
        allowNull: true,
        type: Sequelize.STRING
      },
      biological_reference: {
        allowNull: true,
        type: Sequelize.TEXT
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
			queryInterface.addIndex("TestValueTypes", ["test_type_id"]);
		});
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('TestValueTypes');
  }
};