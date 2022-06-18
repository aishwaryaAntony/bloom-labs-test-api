'use strict';
const {
  Model
} = require('sequelize');
const short = require('short-uuid');

/**
 * @swagger
 * definitions:
 *   TestResult:
 *     type: object
 *     required:
 *       - id
 *       - location_test_type_id
 *       - status
 *     properties:
 *       id:
 *         type: number
 *       location_test_type_id:
 *         type: number
 *       test_id:
 *         type: string
 *       tube_number:
 *         type: string
 *       registration_date:
 *         type: date
 *       physician_ref:
 *         type: number
 *       collection_date:
 *         type: date
 *       common_pass_qr_code:
 *         type: string
 *       result_status:
 *         type: string
 *       result_date:
 *         type: date
 *       pre_registration_date:
 *         type: date
 *       customer_signature:
 *         type: string
 *       is_acceptance:
 *         type: boolean
 *       test_type_name:
 *         type: string
 *       patient_county:
 *         type: string
 *       referring_physician:
 *         type: string
 *       referring_physician_npi:
 *         type: string
 *       attestations:
 *         type: string
 *       test_sub_type_ref:
 *         type: number
 *       test_sub_type_name:
 *         type: string
 *       status:
 *         type: string
 *     example:
 *        id: 1
 *        location_test_type_id: 1
 *        test_id: "1"
 *        tube_number: "454GP"
 *        registration_date: "22-12-2021"
 *        physician_ref: 1
 *        collection_date: "22-12-2021"
 *        common_pass_qr_code: "454GP"
 *        result_status: "ACTIVE"
 *        result_date: "22-12-2021"
 *        pre_registration_date: "22-12-2021"
 *        customer_signature: "s3-key-name"
 *        is_acceptance: true
 *        test_type_name: "covid"
 *        patient_county: "USA"
 *        referring_physician: "Gopi"
 *        referring_physician_npi: "45GP"
 *        attestations: "FFF"
 *        test_sub_type_ref: 1
 *        test_sub_type_name: "Nasal"
 *        status: "ACTIVE"
 */
module.exports = (sequelize, DataTypes) => {
  class TestResult extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // TestResult.hasMany(models.MemberResult, { as: 'testResultMembers', foreignKey: 'test_result_id', sourceKey: 'id' });
      TestResult.hasMany(models.TestResultPayment, { as: 'testResultPayments', foreignKey: 'test_result_id', sourceKey: 'id' });
      // TestResult.hasMany(models.TestResultValue, { as: 'testResultValues', foreignKey: 'test_result_id', sourceKey: 'id' });
      TestResult.hasOne(models.TestResultValue, { as: 'testResultValue', foreignKey: 'test_result_id', sourceKey: 'id' });
      TestResult.belongsTo(models.LocationTestType, { as: 'testResultLocationTestType', foreignKey: 'location_test_type_id', targetKey: 'id' });
      TestResult.belongsTo(models.Location, { as: 'testResultLocation', foreignKey: 'location_id', targetKey: 'id' });
      TestResult.belongsTo(models.TestType, { as: 'testResultTestType', foreignKey: 'test_type_id', targetKey: 'id' });

    }
  };
  TestResult.init({
    member_token: {
      type: DataTypes.STRING,
      allowNull: false
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    location_test_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    lab_code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    location_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    location_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    test_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    test_type_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    test_id: {
      type: DataTypes.STRING,
      allowNull: true,
      // defaultValue: short.generate()
    },
    test_sequence_number: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tube_number: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tested_lab_name: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'Saguaro Bloom'
    },
    tested_machine_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    registration_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    physician_ref: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    collection_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    common_pass_qr_code: {
      type: DataTypes.STRING,
      allowNull: true
    },
    result_status: {
      type: DataTypes.STRING,
      allowNull: true
    },
    result_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    pre_registration_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    customer_signature: {
      type: DataTypes.STRING,
      allowNull: true
    },
    is_acceptance: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    patient_county: {
      type: DataTypes.STRING,
      allowNull: true
    },
    referring_physician: {
      type: DataTypes.STRING,
      allowNull: true
    },
    referring_physician_npi: {
      type: DataTypes.STRING,
      allowNull: true
    },
    attestations: {
      type: DataTypes.STRING,
      allowNull: true
    },
    test_sub_type_ref: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    test_sub_type_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    gclid: {
			allowNull: true,
			type: DataTypes.STRING
		},
    is_exported: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false
    },
    test_group_name:{
      type: DataTypes.STRING,
      allowNull: true
    },
    test_group_ref:{
      type: DataTypes.INTEGER,
      allowNull: true
    },
    test_group_sequence:{
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'TestResult',
    hooks: {
      afterCreate: (test, options) => {
        // let testSequenceNumber = `COV-${String(test.id).padStart(6, '0')}`;
        // let testSequenceNumber = `${test.test_sequence_number}${String(test.id).padStart(6, '0')}`
        let collection_date = test.collection_date !== null ? test.collection_date : (test.tube_number !== null && test.tube_number !== "" ? new Date() : null);
        // console.log(`After create --> Called -> ${test.tube_number} -- ${test.collection_date} --> ${collection_date}`)
        let resultStatus = test.result_status !== null && test.result_status !== "" ? test.result_status : 'Result unavailable';
        let testId = short.generate();
        return test.update({
          registration_date: new Date(),
          // test_sequence_number: testSequenceNumber,
          collection_date: collection_date,
          result_status: resultStatus,
          test_id: testId
        });
      },
      afterUpdate: (test, options) => {
        if (test.tube_number !== null && test.tube_number !== "" && test.collection_date === null) {
          // console.log(`After Update --> Called -> ${test.tube_number} -- ${test.collection_date}`)
          return test.update({
            collection_date: new Date()
          });
        }
      }
    }
  });
  return TestResult;
};