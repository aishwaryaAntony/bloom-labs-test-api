'use strict';

const {
  Model
} = require('sequelize');

/**
 * @swagger
 * definitions:
 *   TestValueType:
 *     type: object
 *     required:
 *       - id
 *       - test_type_id
 *       - value_type
 *       - status
 *     properties:
 *       id:
 *         type: number
 *       test_type_id:
 *         type: number
 *       value_type:
 *         type: string
 *       min:
 *         type: string
 *       max:
 *         type: string
 *       status:
 *         type: string
 *     example:
 *        id: 1
 *        test_type_id: 1
 *        value_type: "57"
 *        min: "50"
 *        max: "50"
 *        status: "ACTIVE"
 */
module.exports = (sequelize, DataTypes) => {
  class TestValueType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TestValueType.hasMany(models.TestValueEnum, { as: 'testValueEnum', foreignKey: 'test_value_type_id', sourceKey: 'id' });
      TestValueType.belongsTo(models.TestType, { as: 'testType', foreignKey: 'test_type_id', targetKey: 'id' });
      // TestValueType.hasOne(models.TestResultValue, { as: 'testResultValue', foreignKey: 'test_value_type_id', sourceKey: 'id' });
    }
  };
  TestValueType.init({
    test_type_id: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    code: {
      allowNull: true,
      type: DataTypes.STRING
    },
    display_name: {
      allowNull: true,
      type: DataTypes.STRING
    },
    value_type: {
      allowNull: true,
      type: DataTypes.STRING
    },
    min: {
      allowNull: true,
      type: DataTypes.STRING
    },
    max: {
      allowNull: true,
      type: DataTypes.STRING
    },
    unit: {
      allowNull: true,
      type: DataTypes.STRING
    },
    biological_reference: {
      allowNull: true,
      type: DataTypes.TEXT
    },
    status: {
      allowNull: false,
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'TestValueType'
  });
  return TestValueType;
};