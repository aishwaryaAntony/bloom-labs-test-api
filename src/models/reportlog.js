
/**
 * @swagger
 * definitions:
 *   ReportLog:
 *     type: object
 *     required:
 *       - id
 *       - name
 *       - created_date
 *       - status
 *     properties:
 *       id:
 *         type: number
 *       name:
 *         type: string
 *       created_date:
 *         type: date
 *       created_by:
 *         type: string
 *       status:
 *         type: string
 *     example:
 *        id: 1
 *        name: "Gopi"
 *        created_date: "12/22/2021"
 *        created_by: "Gopi"
 *        status: "ACTIVE"
 */'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReportLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  ReportLog.init({
    name:{
      type: DataTypes.STRING,
      allowNull: false
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    created_by: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status:{
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'ReportLog',
  });
  return ReportLog;
};