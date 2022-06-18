'use strict';
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('TestValueEnums', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			test_value_type_id: {
				allowNull: false,
				type: Sequelize.INTEGER
			},
			value: {
				allowNull: false,
				type: Sequelize.STRING
			},
			sort_order: {
				allowNull: true,
				type: Sequelize.INTEGER
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
			queryInterface.addIndex("TestValueEnums", ["test_value_type_id"]);
		});
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('TestValueEnums');
	}
};