'use strict';

const {
  Model
} = require('sequelize');

/**
 * @swagger
 * definitions:
 *   TestSubType:
 *     type: object
 *     required:
 *       - id
 *       - test_type_id
 *       - code
 *       - name
 *       - status
 *     properties:
 *       id:
 *         type: number
 *       test_type_id:
 *         type: number
 *       code:
 *         type: string
 *       name:
 *         type: string
 *       status:
 *         type: string
 *     example:
 *        id: 1
 *        test_type_id: 1
 *        code: "PP1"
 *        name: "COVID"
 *        status: "ACTIVE"
 */

module.exports = (sequelize, DataTypes) => {
  class TestSubType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  TestSubType.init({
    test_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
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
    modelName: 'TestSubType'
  });
  return TestSubType;
};