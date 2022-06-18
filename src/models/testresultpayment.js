'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TestResultPayment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TestResultPayment.belongsTo(models.TestResult, { as: 'testPayment', foreignKey: 'test_result_id', targetKey: 'id' });
    }
  };
  TestResultPayment.init({
    member_token:  {
      type: DataTypes.STRING,
      allowNull: false
    },
    test_result_id:  {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price:  {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    transaction_reference:  {
      type: DataTypes.STRING,
      allowNull: true
    },
    transaction_date:  {
      type: DataTypes.DATE,
      allowNull: true
    },
    transaction_type:{
      type: DataTypes.STRING,
      allowNull: true
    },
    sessionId:{
      type: DataTypes.STRING,
      allowNull: true
    },
    status:  {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'TestResultPayment',
  });
  return TestResultPayment;
};