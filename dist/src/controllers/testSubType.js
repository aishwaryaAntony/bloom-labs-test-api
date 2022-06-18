'use strict';

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.fetch_test_sub_type_by_test_type_id = async (req, res, next) => {
	try {
		let { id } = req.params;

		let findTestSubType = await _models2.default.TestSubType.findAll({
			where: {
				test_type_id: id
			}
		});
		res.status(200).json({
			status: 'success',
			payload: findTestSubType,
			message: 'Test Sub Type fetched successfully'
		});
	} catch (error) {
		console.log("Error at Test Sub Type By Id method- GET / :id " + error);
		res.status(500).json({
			status: 'failed',
			payload: {},
			message: 'Error while fetching test sub type by id'
		});
	}
};