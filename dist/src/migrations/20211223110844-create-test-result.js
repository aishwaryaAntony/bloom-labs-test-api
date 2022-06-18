'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('TestResults', {
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
      first_name: {
        allowNull: true,
        type: Sequelize.STRING

      },
      last_name: {
        allowNull: true,
        type: Sequelize.STRING
      },
      location_test_type_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      lab_code: {
        type: Sequelize.STRING,
        allowNull: false
      },
      location_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      location_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      test_type_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      test_type_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      test_id: {
        allowNull: true,
        type: Sequelize.STRING
        //defaultValue: short.generate()
      },
      test_sequence_number: {
        allowNull: true,
        type: Sequelize.STRING
      },
      tube_number: {
        allowNull: true,
        type: Sequelize.STRING
      },
      tested_lab_name: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'Saguaro Bloom'
      },
      tested_machine_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      registration_date: {
        allowNull: true,
        type: Sequelize.DATE
      },
      collection_date: {
        allowNull: true,
        type: Sequelize.DATE
      },
      common_pass_qr_code: {
        allowNull: true,
        type: Sequelize.STRING
      },
      result_status: {
        allowNull: true,
        type: Sequelize.STRING
      },
      result_date: {
        allowNull: true,
        type: Sequelize.DATE
      },
      pre_registration_date: {
        allowNull: true,
        type: Sequelize.DATE
      },
      customer_signature: {
        allowNull: true,
        type: Sequelize.STRING
      },
      is_acceptance: {
        allowNull: true,
        type: Sequelize.BOOLEAN
      },
      test_sub_type_name: {
        allowNull: true,
        type: Sequelize.STRING
      },
      patient_county: {
        allowNull: true,
        type: Sequelize.STRING
      },
      referring_physician: {
        allowNull: true,
        type: Sequelize.STRING
      },
      referring_physician_npi: {
        allowNull: true,
        type: Sequelize.STRING
      },
      attestations: {
        allowNull: true,
        type: Sequelize.STRING
      },
      status: {
        allowNull: false,
        type: Sequelize.STRING
      },
      test_sub_type_ref: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      test_sub_type_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      physician_ref: {
        allowNull: true,
        type: Sequelize.INTEGER
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
      queryInterface.addIndex("TestResults", ["test_type_id", "location_test_type_id", "status", "tube_number"]);
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('TestResults');
  }
};