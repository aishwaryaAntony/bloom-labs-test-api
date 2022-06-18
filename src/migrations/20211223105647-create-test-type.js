'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('TestTypes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      test_category_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lab_code: {
        type: Sequelize.STRING,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      display_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      device_id: {
        type: Sequelize.STRING,
        allowNull: true
      },
      loinc_code: {
        type: Sequelize.STRING,
        allowNull: true
      },
      loinc_description: {
        type: Sequelize.STRING,
        allowNull: true
      },
      specimen_site: {
        type: Sequelize.STRING,
        allowNull: true
      },
      specimen_date: {
        type: Sequelize.STRING,
        allowNull: true
      },
      test_code: {
        type: Sequelize.STRING,
        allowNull: true
      },
      test_type_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      description:{
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
			queryInterface.addIndex("TestTypes", ["lab_code","code"]);
		});
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('TestTypes');
  }
};