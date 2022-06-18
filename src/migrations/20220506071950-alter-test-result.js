'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    try {
      await queryInterface.addColumn('TestResults', 'gclid', {
        type: Sequelize.STRING,
        allowNull: true
      });

      await queryInterface.addColumn('TestResults', 'is_exported', {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
      });
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(e);
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    try {
      await queryInterface.removeColumn('TestResults', 'gclid');
      await queryInterface.removeColumn('TestResults', 'is_exported');
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(e);
    }
  }
};
