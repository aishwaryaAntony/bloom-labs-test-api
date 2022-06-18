'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addColumn('LocationTestTypes', 'test_group_ref', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
					model: 'TestGroups',
					key: 'id'
				}
      }); 
      await queryInterface.addColumn('LocationTestTypes', 'is_group', {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue:false
      }); 
      await queryInterface.changeColumn('LocationTestTypes', 'test_type_id', {
        type: Sequelize.INTEGER,
        allowNull: true
      }); 
      await queryInterface.addColumn('TestResults', 'test_group_name', {
        type: Sequelize.STRING,
        allowNull: true
      }); 
      await queryInterface.addColumn('TestResults', 'test_group_ref', {
        type: Sequelize.INTEGER,
        allowNull: true
      }); 
      await queryInterface.addColumn('TestResults', 'test_group_sequence', {
        type: Sequelize.STRING,
        allowNull: true
      });
      await queryInterface.addIndex("LocationTestTypes", ["test_group_ref"]);
      await queryInterface.addIndex("TestResults", ["test_group_ref"]); 
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.removeColumn('LocationTestTypes', 'test_group_ref');
      await queryInterface.removeColumn('LocationTestTypes', 'is_group');
      await queryInterface.changeColumn('LocationTestTypes', 'test_type_id', {
        type: Sequelize.INTEGER,
        allowNull: false,
      });
      await queryInterface.removeColumn('TestResults', 'test_group_name');
      await queryInterface.removeColumn('TestResults', 'test_group_ref');
      await queryInterface.removeColumn('TestResults', 'test_group_sequence');
      await queryInterface.removeIndex("LocationTestTypes", ["test_group_ref"]);
      await queryInterface.removeIndex("TestResults", ["test_group_ref"]);
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  }
};
