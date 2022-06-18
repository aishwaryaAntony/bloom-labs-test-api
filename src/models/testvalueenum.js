'use strict';
const {
  Model
} = require('sequelize');

/**
 * @swagger
 * definitions:
 *   TestValueEnum:
 *     type: object
 *     required:
 *       - id
 *       - test_value_type_id
 *       - value
 *       - status
 *     properties:
 *       id:
 *         type: number
 *       test_value_type_id:
 *         type: number
 *       value:
 *         type: string
 *       status:
 *         type: string
 *     example:
 *        id: 1
 *        test_value_type_id: 1
 *        value: "Gopi"
 *        status: "ACTIVE"
 */
module.exports = (sequelize, DataTypes) => {
  class TestValueEnum extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TestValueEnum.belongsTo(models.TestValueType, { as: 'testValueType', foreignKey: 'test_value_type_id', targetKey: 'id' });
    }
  };
  TestValueEnum.init({
    test_value_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sort_order: {
      allowNull: true,
      type: DataTypes.INTEGER
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'TestValueEnum',
  });
  return TestValueEnum;
};