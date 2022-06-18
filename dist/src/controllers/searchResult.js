"use strict";

var _models = require("../models");

var _models2 = _interopRequireDefault(_models);

var _sequelize = require("sequelize");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.search_test_result = async (req, res, next) => {
    try {
        let { search } = req.query;
        // console.log("====search=====" + search)

        let searchAllTestResult = await _models2.default.TestResult.findAll({
            where: {
                [_sequelize.Op.or]: [{
                    test_type_name: {
                        [_sequelize.Op.iLike]: `%${search}%`
                    }
                }, {
                    test_sequence_number: {
                        [_sequelize.Op.iLike]: `%${search}%`
                    }
                }, {
                    tube_number: {
                        [_sequelize.Op.iLike]: `%${search}%`
                    }
                }]
            }
        });

        let searchLocations = await _models2.default.Location.findAll({
            where: {
                name: {
                    [_sequelize.Op.iLike]: `%${search}%`
                }
            }
        });

        let resultObj = {};
        resultObj.testResults = searchAllTestResult;
        resultObj.locations = searchLocations;

        console.log("========searchAllTestResult==========" + JSON.stringify(searchAllTestResult));

        res.status(200).json({
            status: 'success',
            payload: resultObj,
            message: 'search all test results fetched successfully'
        });
    } catch (error) {
        console.log("Error at  searching test results method- GET / :" + error);
        res.status(500).json({
            status: 'failed',
            payload: {},
            message: 'Error while searching test results'
        });
    }
};