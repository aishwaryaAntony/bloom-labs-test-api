'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TestGroup extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TestGroup.hasMany(models.LocationTestType, { as: 'locationTestTypes', foreignKey: 'test_group_ref', sourceKey: 'id' });
    }
  };
  TestGroup.init({
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
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    test_type_ids:{
      allowNull: true,
      type: DataTypes.ARRAY(DataTypes.INTEGER)
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'TestGroup',
  });
  return TestGroup;
};