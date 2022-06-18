'use strict';

var _testResult = require('../helpers/testResult');

const {
	Model
} = require('sequelize');


/**
 * @swagger
 * definitions:
 *   TestUpload:
 *     type: object
 *     required:
 *       - id
 *       - source_name
 *       - location_test_type_id
 *       - upload_date
 *       - upload_by
 *       - status
 *     properties:
 *       id:
 *         type: number
 *       location_test_type_id:
 *         type: number
 *       source_name:
 *         type: string
 *       upload_date:
 *         type: date
 *       upload_by:
 *         type: string
 *       status:
 *         type: string
 *     example:
 *        id: 1
 *        location_test_type_id: 1
 *        source_name: "Gopi"
 *        upload_date: "12-22-2021"
 *        upload_by: "Gopi"
 *        status: "ACTIVE"
 */
module.exports = (sequelize, DataTypes) => {
	class TestUpload extends Model {
		/**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
		static associate(models) {
			TestUpload.belongsTo(models.UploadTestResult, { as: 'uploadTestResult', foreignKey: 'upload_test_result_ref', targetKey: 'id' });
		}
	};
	TestUpload.init({
		upload_test_result_ref: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		test_upload_name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		test_result_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		tube_number: {
			type: DataTypes.STRING,
			allowNull: false
		},
		result: {
			type: DataTypes.STRING,
			allowNull: true
		},
		result_value: {
			type: DataTypes.JSONB,
			allowNull: true
		},
		result_upload_by_file: {
			type: DataTypes.STRING,
			allowNull: false
		},
		created_by: {
			type: DataTypes.STRING,
			allowNull: false
		},
		created_date: {
			type: DataTypes.DATE,
			allowNull: false
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		status: {
			type: DataTypes.STRING,
			allowNull: false
		}
	}, {
		sequelize,
		modelName: 'TestUpload',
		hooks: {
			afterCreate: (TestUpload, options) => {
				let testUploadNumber = `T-${String(TestUpload.id).padStart(8, '0')}`;
				// updateTestResult(TestUpload, sequelize);
				return TestUpload.update({
					test_upload_name: testUploadNumber
				});
			}
		}
	});
	return TestUpload;
};