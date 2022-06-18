'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('LocationTestTypes', {
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
      location_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      bill_type: {
        allowNull: true,
        type: Sequelize.STRING
      },
      description :{
        type: Sequelize.TEXT,
        allowNull: true
      },
      is_paid_type: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      price: {
        allowNull: true,
        type: Sequelize.DOUBLE
      },
      is_insurance_test:{
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      acuity_ref :{
        type: Sequelize.STRING,
        allowNull: true
      },
      qr_code: {
        type: Sequelize.STRING,
        allowNull: true
      },
      rank_order: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      display_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      salesforce_id: {
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
			queryInterface.addIndex("LocationTestTypes", ["test_type_id","location_id"]);
		});
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('LocationTestTypes');
  }
};