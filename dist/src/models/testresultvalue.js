'use strict';

const {
	Model
} = require('sequelize');

/**
 * @swagger
 * definitions:
 *   TestResultValue:
 *     type: object
 *     required:
 *       - id
 *       - test_result_id
 *       - test_value_type_id
 *       - status
 *     properties:
 *       id:
 *         type: number
 *       result_string:
 *         type: string
 *       result_integer:
 *         type: number
 *       result_type:
 *         type: string
 *       test_result_id:
 *         type: number
 *       test_value_type_id:
 *         type: number
 *       status:
 *         type: string
 *     example:
 *        id: 1
 *        result_string: "4rt4rt5gt6665r"
 *        result_integer: 1
 *        result_type: "P"
 *        test_result_id: 1
 *        test_value_type_id: 1
 *        status: "ACTIVE"
 */
module.exports = (sequelize, DataTypes) => {
	class TestResultValue extends Model {
		/**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
		static associate(models) {
			// define association here
			TestResultValue.belongsTo(models.TestResult, { as: 'testResult', foreignKey: 'test_result_id', targetKey: 'id' });
			TestResultValue.belongsTo(models.TestCategory, { as: 'testCategory', foreignKey: 'test_category_ref', targetKey: 'id' });
			// TestResultValue.belongsTo(models.TestValueType, { as: 'testValueType', foreignKey: 'test_value_type_id', targetKey: 'id' });
		}
	};
	TestResultValue.init({
		result_value: {
			type: DataTypes.JSONB,
			allowNull: true
		},
		result_type: {
			type: DataTypes.STRING,
			allowNull: true
		},
		test_result_id: {
			type: DataTypes.STRING,
			allowNull: false
		},
		test_category_ref: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		result: {
			type: DataTypes.STRING,
			allowNull: true
		},
		// test_value_type_id:{
		//   type:DataTypes.STRING,
		//   allowNull: false
		// },
		status: {
			type: DataTypes.STRING,
			allowNull: true
		}
	}, {
		sequelize,
		modelName: 'TestResultValue'
	});
	return TestResultValue;
};