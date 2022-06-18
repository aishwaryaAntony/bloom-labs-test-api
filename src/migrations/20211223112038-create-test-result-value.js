'use strict';
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('TestResultValues', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			test_result_id: {
				allowNull: false,
				type: Sequelize.INTEGER
			},
			test_category_ref: {
				type: Sequelize.INTEGER,
				allowNull: true
			},
			result: {
				type: Sequelize.STRING,
				allowNull: true
			},
			// test_value_type_id: {
			//   allowNull: false,
			//   type: Sequelize.INTEGER
			// },
			result_value: {
				allowNull: true,
				type: Sequelize.JSONB
			},
			result_type: {
				allowNull: true,
				type: Sequelize.STRING
			},
			status: {
				allowNull: false,
				type: Sequelize.STRING
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE
			}
		}).then(function () {
			queryInterface.addIndex("TestResultValues", ["test_result_id", "result_value", "test_category_ref"]);
		});
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('TestResultValues');
	}
};