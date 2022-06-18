'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UploadTestResult extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UploadTestResult.hasMany(models.TestUpload, { as: 'testUploads', foreignKey: 'upload_test_result_ref', sourceKey: 'id' });
    }
  };
  UploadTestResult.init({
    lab_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    file_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    uploaded_by: {
      type:DataTypes.STRING,
      allowNull: false
    },
    uploaded_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'UploadTestResult',
  });
  return UploadTestResult;
};