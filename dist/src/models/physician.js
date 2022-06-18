'use strict';

const {
  Model
} = require('sequelize');

/**
 * @swagger
 * definitions:
 *   Physician:
 *     type: object
 *     required:
 *       - id
 *       - lab_token
 *       - name
 *       - is_default
 *       - status
 *     properties:
 *       id:
 *         type: number
 *       lab_token:
 *         type: string
 *       name:
 *         type: string
 *       npi_number:
 *         type: string
 *       location_ref:
 *         type: number
 *       is_default:
 *         type: boolean
 *       status:
 *         type: string
 *     example:
 *        id: 1
 *        lab_token: "4rt4rt5gt6665r"
 *        name: "Gopi"
 *        npi_number: "4rt4rt5gt6665r"
 *        location_ref: 1
 *        is_default: true
 *        status: "ACTIVE"
 */
module.exports = (sequelize, DataTypes) => {
  class Physician extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Physician.init({
    lab_code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    npi_number: {
      type: DataTypes.STRING,
      allowNull: true
    },
    location_ref: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    is_default: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Physician'
  });
  return Physician;
};