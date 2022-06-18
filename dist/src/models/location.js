'use strict';

const {
  Model
} = require('sequelize');

/**
 * @swagger
 * definitions:
 *   Location:
 *     type: object
 *     required:
 *       - id
 *       - code
 *       - lab_code
 *       - name
 *       - lab_name
 *       - timezone
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
 *       lab_name:
 *         type: string
 *       clia:
 *         type: string
 *       street_address_line1:
 *         type: string
 *       street_address_line2:
 *         type: string
 *       city:
 *         type: string
 *       state:
 *         type: string
 *       country:
 *         type: string
 *       zipcode:
 *         type: string
 *       phone_number:
 *         type: string
 *       timezone:
 *         type: string
 *       ordering_facility:
 *         type: string
 *       acuity_ref:
 *         type: string
 *       status:
 *         type: string
 *     example:
 *        id: 1
 *        code: "LAB01"
 *        lab_code: "ABC"
 *        name: "Kenla Lab"
 *        lab_name: "Kenla"
 *        clia: "FGT09"
 *        street_address_line1: "A"
 *        street_address_line2: "A"
 *        city: "LA"
 *        state: "CA"
 *        country: "USA"
 *        zipcode: "50000"
 *        phone_number: "1234567890"
 *        timezone: "NewYork"
 *        ordering_facility: "Yes"
 *        acuity_ref: "456456"
 *        status: "ACTIVE"
 */

module.exports = (sequelize, DataTypes) => {
  class Location extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Location.hasMany(models.LocationTestType, { as: 'locationTestTypes', foreignKey: 'location_id', sourceKey: 'id' });
      Location.hasMany(models.TestResult, { as: 'locations', foreignKey: 'location_id', sourceKey: 'id' });
    }
  };
  Location.init({
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
    lab_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    display_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    clia: {
      type: DataTypes.STRING,
      allowNull: true
    },
    street_address_line1: {
      type: DataTypes.STRING,
      allowNull: true
    },
    street_address_line2: {
      type: DataTypes.STRING,
      allowNull: true
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true
    },
    zipcode: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: true
    },
    timezone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ordering_facility: {
      type: DataTypes.STRING,
      allowNull: true
    },
    acuity_ref: {
      type: DataTypes.STRING,
      allowNull: true
    },
    branding: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Location'
  });
  return Location;
};