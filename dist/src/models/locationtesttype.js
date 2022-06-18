'use strict';

const {
  Model
} = require('sequelize');

/**
 * @swagger
 * definitions:
 *   LocationTestType:
 *     type: object
 *     required:
 *       - id
 *       - test_type_id
 *       - location_id
 *       - bill_type
 *       - is_paid_type
 *       - status
 *     properties:
 *       id:
 *         type: number
 *       test_type_id:
 *         type: number
 *       location_id:
 *         type: number
 *       bill_type:
 *         type: string
 *       is_paid_type:
 *         type: boolean
 *       price:
 *         type: number
 *       status:
 *         type: string
 *     example:
 *        id: 1
 *        test_type_id: 1
 *        location_id: 1
 *        bill_type: "INSURANCE"
 *        is_paid_type: false
 *        price: 0.00
 *        status: "ACTIVE"
 */
module.exports = (sequelize, DataTypes) => {
  class LocationTestType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      LocationTestType.belongsTo(models.Location, { as: 'location', foreignKey: 'location_id', targetKey: 'id' });
      LocationTestType.belongsTo(models.TestType, { as: 'testType', foreignKey: 'test_type_id', targetKey: 'id' });
      LocationTestType.hasMany(models.TestResult, { as: 'locationTestResults', foreignKey: 'location_test_type_id', sourceKey: 'id' });
    }
  };
  LocationTestType.init({
    test_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    location_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    bill_type: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    is_paid_type: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    is_insurance_test: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    acuity_ref: {
      type: DataTypes.STRING,
      allowNull: true
    },
    qr_code: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rank_order: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    display_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    salesforce_id: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'LocationTestType'
  });
  return LocationTestType;
};