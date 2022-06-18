'use strict';

const {
  Model
} = require('sequelize');

/**
 * @swagger
 * definitions:
 *   TestType:
 *     type: object
 *     required:
 *       - id
 *       - code
 *       - lab_code
 *       - name
 *       - status
 *     properties:
 *       id:
 *         type: number
 *       code:
 *         type: string
 *       lab_code:
 *         type: string
 *       name:
 *         type: string
 *       device_id:
 *         type: string
 *       loinc_code:
 *         type: string
 *       loinc_description:
 *         type: string
 *       specimen_site:
 *         type: string
 *       specimen_date:
 *         type: string
 *       test_code:
 *         type: string
 *       test_type_name:
 *         type: string
 *       status:
 *         type: string
 *     example:
 *        id: 1
 *        code: "PP1"
 *        lab_code: "ABC"
 *        name: "COVID"
 *        device_id: "COVID"
 *        loinc_code: "COVID"
 *        loinc_description: "COVID"
 *        specimen_site: "COVID"
 *        specimen_date: "12/12/2021"
 *        test_code: "CO90"
 *        test_type_name: "COVID"
 *        status: "ACTIVE"
 */

module.exports = (sequelize, DataTypes) => {
  class TestType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TestType.belongsTo(models.TestCategory, { as: 'testCategory', foreignKey: 'test_category_id', targetKey: 'id' });
      TestType.hasMany(models.LocationTestType, { as: 'testTypeLocations', foreignKey: 'test_type_id', sourceKey: 'id' });
      TestType.hasMany(models.TestValueType, { as: 'testValueTypes', foreignKey: 'test_type_id', sourceKey: 'id' });
      TestType.hasMany(models.TestResult, { as: 'testResults', foreignKey: 'test_type_id', sourceKey: 'id' });
    }
  };
  TestType.init({
    test_category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'TestCategories',
        key: 'id'
      }
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lab_code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    display_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    device_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    loinc_code: {
      type: DataTypes.STRING,
      allowNull: true
    },
    loinc_description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    specimen_site: {
      type: DataTypes.STRING,
      allowNull: true
    },
    specimen_date: {
      type: DataTypes.STRING,
      allowNull: true
    },
    test_code: {
      type: DataTypes.STRING,
      allowNull: true
    },
    test_type_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'TestType'
  });
  return TestType;
};