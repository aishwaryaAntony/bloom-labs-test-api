"use strict";

var _testResult = require("../helpers/testResult");

var _uploadTestResultHelper = require("../helpers/uploadTestResultHelper");

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _models = require("../models");

var _models2 = _interopRequireDefault(_models);

var _sequelize = require("sequelize");

var _sequelize2 = _interopRequireDefault(_sequelize);

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Op = _sequelize2.default.Op;

exports.upload_test_result = async (req, res, next) => {
    try {
        let { lab_name, test_code } = req.body;
        let filePath = _path2.default.resolve(__dirname, `../../uploads/${req.file.filename}`);
        let originalName = req.file.originalname;
        // console.log("filename=========>" + filePath);
        let test_data = [];
        // console.log("data=========>" + JSON.stringify(test_data));
        switch (test_code) {
            case "COV":
                test_data = await (0, _testResult.read_from_excel)(filePath, lab_name, originalName);
                // test_data = [];
                break;
            case "CAB":
                test_data = await (0, _uploadTestResultHelper.read_cab_result_from_excel)(filePath, lab_name, originalName);
                break;
            case "ALG":
                test_data = [];
                break;
            default:
                break;
        }

        // console.log(`test --> ${JSON.stringify(test_data)}`)

        // return res.status(200).json({
        //     status: 'success',
        //     payload: null,
        //     message: 'File Uploaded Successfully'
        // });

        if (test_data.length > 0) {
            let uploadTestResult = await _models2.default.UploadTestResult.create({
                lab_name: lab_name,
                file_name: originalName,
                uploaded_by: "admin",
                uploaded_at: new Date()
            });

            let fetchTestResults = await _models2.default.TestResult.findAll({
                where: {
                    result_status: {
                        [Op.or]: ["Result unavailable", "Result available"]
                    },
                    tube_number: {
                        [Op.not]: null
                    }
                },
                include: [{
                    model: _models2.default.TestType,
                    as: 'testResultTestType'
                }]
                // attributes: [
                //     'id', 'tube_number', 'test_sequence_number', 'location_id', 'member_token', 'test_type_name'
                // ]
            });

            let testResultMap = _underscore2.default.indexBy(fetchTestResults, 'tube_number');
            // console.log(`TestResult --> ${JSON.stringify(testResultMap)}`);

            for (let data of test_data) {
                let fetchResult = testResultMap[data.tube_number];
                if (!!fetchResult) {
                    let addNewTestUpload = await _models2.default.TestUpload.create({
                        upload_test_result_ref: uploadTestResult.id,
                        tube_number: data.tube_number,
                        test_upload_name: "001234",
                        test_result_id: fetchResult.id,
                        result: data.result,
                        result_value: data.result_value,
                        result_upload_by_file: data.file_name,
                        created_by: "",
                        created_date: new Date(),
                        status: "PROCESSING"
                    });

                    await (0, _uploadTestResultHelper.updateCovidTestResult)(fetchResult, data, addNewTestUpload);
                }
            }

            return res.status(200).json({
                status: 'success',
                payload: null,
                message: 'File Uploaded Successfully'
            });
        } else {
            return res.status(200).json({
                status: 'failed',
                payload: null,
                message: 'Uploaded csv sheet are not relevant to selected lab'
            });
        }

        /*
        if(test_data.length > 0) {
            let uploadTestResult = await db.UploadTestResult.create({
                lab_name: lab_name,
                file_name: originalName,
                uploaded_by: "admin",
                uploaded_at: new Date()
            });
                 for (let data of test_data) {
                await db.TestUpload.create({
                    upload_test_result_ref: uploadTestResult.id,
                    tube_number: data.tube_number,
                    test_upload_name: "001234",
                    result: data.result,
                    result_value: data.result_value,
                    result_upload_by_file: data.file_name,
                    created_by: "",
                    created_date: new Date(),
                    status: "PROCESSING"
                })
            }
             return res.status(200).json({
                status: 'success',
                payload: null,
                message: 'upload successfully'
            });
        } else {            
            return res.status(200).json({
                status: 'failed',
                payload: null,
                message: 'Uploaded csv sheet are not relevant to selected lab'
            });
        }
        */
    } catch (error) {
        console.log("Error at upload method- POST / :" + error);
        res.status(500).json({
            status: 'failed',
            payload: {},
            message: 'Error while upload'
        });
    }
};

exports.fetch_all_upload_test_result = async (req, res, next) => {
    try {
        let fetchUploadTestResults = await _models2.default.UploadTestResult.findAll({});
        res.status(200).json({
            status: "success",
            message: "successfully fetched all upload test results",
            payload: fetchUploadTestResults
        });
    } catch (error) {
        console.log("Error at fetching all upload test results" + `${error}`);
        res.status(500).json({
            status: "failed",
            message: "Error at fetching all upload test results",
            payload: null
        });
    }
};

exports.fetch_upload_test_result_by_id = async (req, res, next) => {
    try {
        const { id } = req.params;
        let fetchUploadTestResult = await _models2.default.UploadTestResult.findOne({
            where: {
                id: id
            },
            include: [{
                model: _models2.default.TestUpload,
                as: "testUploads"
            }]
        });
        if (fetchUploadTestResult === null) {
            res.status(200).json({
                status: "success",
                message: "fetching upload test result by id not found",
                payload: null
            });
        } else {
            res.status(200).json({
                status: "success",
                message: "successfully fetched upload test result by id",
                payload: fetchUploadTestResult
            });
        }
    } catch (error) {
        console.log("Error at fetching upload test result by id" + `${error}`);
        res.status(500).json({
            status: "failed",
            message: "Error at fetching upload test result by id",
            payload: null
        });
    }
};