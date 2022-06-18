'use strict';

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.fetch_all_test_categories = async (req, res, next) => {
    try {

        let fetchAllTestCategory = await _models2.default.TestCategory.findAll();

        res.status(200).json({
            status: 'success',
            payload: fetchAllTestCategory,
            message: 'Test Category fetched successfully'
        });
    } catch (error) {
        console.log("Error at Test Category method- GET / :" + error);
        res.status(500).json({
            status: 'failed',
            payload: {},
            message: 'Error while Test Category'
        });
    }
};