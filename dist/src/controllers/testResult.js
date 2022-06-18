"use strict";

var _models = require("../models");

var _models2 = _interopRequireDefault(_models);

var _sequelize = require("sequelize");

var _sequelize2 = _interopRequireDefault(_sequelize);

var _constants = require("../helpers/constants");

var _testResult = require("../helpers/testResult");

var _attachments = require("../helpers/attachments");

var _MessageUtils = require("../helpers/MessageUtils");

var _MessageUtils2 = _interopRequireDefault(_MessageUtils);

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _sequenceNumberUtils = require("../helpers/sequenceNumberUtils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { gzipSync, gunzipSync } = require('zlib');
const Op = _sequelize2.default.Op;

exports.fetch_test_result = async (req, res, next) => {
    try {
        let { id } = req.params;

        let findTestResult = await _models2.default.TestResult.findOne({
            where: {
                id: id
            },
            //attributes: ['tube_number', 'registration_date', 'collection_date', 'common_pass_qr_code', 'result_status', 'result_date', 'pre_registration_date', 'test_type_name'],
            include: [{
                attributes: ['result_value', 'result_type'],
                model: _models2.default.TestResultValue,
                as: 'testResultValue'
            }, {
                attributes: ['test_type_id', 'location_id', 'price'],
                model: _models2.default.LocationTestType,
                as: 'testResultLocationTestType'
            }, {
                attributes: ['test_category_id'],
                model: _models2.default.TestType,
                as: 'testResultTestType'
            }]
        });
        if (findTestResult === null) {
            return res.status(200).json({
                status: 'success',
                payload: null,
                message: 'Invalid Test Result'
            });
        }

        res.status(200).json({
            status: 'success',
            payload: findTestResult,
            message: 'Test Result fetched successfully'
        });
    } catch (error) {
        console.log("Error at Test Result By Id method- GET / :" + error);
        res.status(500).json({
            status: 'failed',
            payload: {},
            message: 'Error while test result'
        });
    }
};

exports.fetch_member_test_result = async (req, res, next) => {
    try {
        let { member_token } = req.params;

        let findTestResult = await _models2.default.TestResult.findAll({
            where: {
                member_token: member_token
            },
            include: [{
                attributes: ['result_value', 'result_type'],
                model: _models2.default.TestResultValue,
                as: 'testResultValue'
            }, {
                attributes: ['test_type_id', 'location_id', 'price'],
                model: _models2.default.LocationTestType,
                as: 'testResultLocationTestType'
            }]
        });

        if (findTestResult === null) {
            return res.status(200).json({
                status: 'success',
                payload: null,
                message: 'Invalid Test Result'
            });
        }

        res.status(200).json({
            status: 'success',
            payload: findTestResult,
            message: 'Test Result fetched successfully'
        });
    } catch (error) {
        console.log("Error at Test Result By Id method- GET / :" + error);
        res.status(500).json({
            status: 'failed',
            payload: {},
            message: 'Error while test result'
        });
    }
};

exports.create_new_test_result = async (req, res, next) => {
    try {
        console.log(`Hit -->`);
        let { member_token, location_test_type_id, lab_code, is_paid, first_name, last_name, test_sub_type_name } = req.body;

        let locationTestType = await _models2.default.LocationTestType.findOne({
            where: {
                id: location_test_type_id
            },
            include: [{
                model: _models2.default.Location,
                as: 'location'
            }, {
                model: _models2.default.TestType,
                as: 'testType'
            }]
        });

        if (locationTestType === null) {
            return res.status(200).json({
                status: 'failed',
                payload: null,
                message: 'Invalid Location Test Type'
            });
        }

        let testedMachineName = null;
        if (locationTestType.testType.name.indexOf('Antigen') > -1) {
            testedMachineName = 'InBios';
        } else if (locationTestType.testType.name.indexOf('NAAT') > -1) {
            testedMachineName = 'ID Now';
        } else if (locationTestType.testType.name.indexOf('PCR') > -1) {
            if (locationTestType.testType.name.indexOf('Same Day') > -1) {
                testedMachineName = 'Accula';
            } else {
                testedMachineName = 'TaqPath';
            }
        }

        let payment_option = is_paid === "true" || is_paid === true ? true : false;

        let gzippedFirstNameBuffer = gzipSync(first_name.toLowerCase());
        let hashedFirstName = gzippedFirstNameBuffer.toString('base64');

        let gzippedLastNameBuffer = gzipSync(last_name.toLowerCase());
        let hashedLastName = gzippedLastNameBuffer.toString('base64');

        let fetchTestCategory = await _models2.default.TestCategory.findOne({
            where: {
                id: locationTestType.testType.test_category_id
            }
        });

        let fetchShortCode = fetchTestCategory !== null ? fetchTestCategory.short_code : '';
        // let fetchSequenceNumber = await sequenceNumber(fetchTestCategory.id);

        // console.log(`Sequence Num --> ${fetchSequenceNumber}`);
        // console.log(`Code --> ${fetchShortCode}-000${fetchSequenceNumber}`)


        // let testSequenceNumber = `${fetchShortCode}-${String(fetchSequenceNumber).padStart(6, '0')}`;
        let testSequenceNumber = `${fetchShortCode}-`;

        let newTestResult = await _models2.default.TestResult.create({
            member_token,
            first_name: hashedFirstName,
            last_name: hashedLastName,
            location_test_type_id: locationTestType.id,
            lab_code,
            test_sequence_number: testSequenceNumber,
            location_id: locationTestType.location_id,
            location_name: locationTestType.location.name,
            test_type_id: locationTestType.test_type_id,
            test_type_name: locationTestType.testType.name,
            tested_machine_name: testedMachineName,
            test_sub_type_name: !!test_sub_type_name ? test_sub_type_name : null,
            result_status: payment_option ? "Pending Payment" : "Result unavailable",
            status: "ACTIVE"
        });

        // await db.MemberResult.create({
        //     member_token,
        //     lab_code,
        //     test_result_id: newTestResult.id,
        //     status: "ACTIVE"
        // });

        let testResult = await _models2.default.TestResult.findOne({
            where: {
                id: newTestResult.id
            },
            //attributes: ['tube_number', 'registration_date', 'collection_date', 'common_pass_qr_code', 'result_status', 'result_date', 'pre_registration_date', 'test_type_name'],
            include: [{
                attributes: ['result_value', 'result_type'],
                model: _models2.default.TestResultValue,
                as: 'testResultValue'
            }, {
                attributes: ['test_type_id', 'location_id', 'price'],
                model: _models2.default.LocationTestType,
                as: 'testResultLocationTestType'
            }]
        });

        res.status(200).json({
            status: 'success',
            payload: testResult,
            message: 'Test result created successfully'
        });
    } catch (error) {
        console.log("Error at Test Schedule method- POST / :" + error);
        res.status(500).json({
            status: 'failed',
            payload: {},
            message: 'Error while Test Schedule'
        });
    }
};

exports.fetch_unassigned_test_tube = async (req, res, next) => {
    try {
        let { member_token } = req.params;
        let findTestResult = await _models2.default.TestResult.findAll({
            where: {
                tube_number: {
                    [Op.or]: [null, "", "null"]
                },
                result_status: "Result unavailable",
                member_token: member_token
            }
            //attributes: ['member_token', 'test_result_id'],
        });

        if (findTestResult === null) {
            return res.status(200).json({
                status: 'success',
                payload: null,
                message: 'Invalid Test Result'
            });
        }

        res.status(200).json({
            status: 'success',
            payload: findTestResult,
            message: 'Test Result fetched successfully'
        });
    } catch (error) {
        console.log("Error at Test Result By Id method- GET / :" + error);
        res.status(500).json({
            status: 'failed',
            payload: {},
            message: 'Error while test result'
        });
    }
};

exports.update_test_tube = async (req, res, next) => {
    try {
        let { member_token } = req.params;

        let { tube_number, test_result_id } = req.body;

        let findTestResult = await _models2.default.TestResult.findOne({
            where: {
                member_token: member_token,
                id: test_result_id
            }
        });

        if (findTestResult === null) {
            return res.status(200).json({
                status: 'success',
                payload: null,
                message: 'Invalid Test Result'
            });
        }

        let existTubeTestResult = await _models2.default.TestResult.findOne({
            where: {
                tube_number: tube_number
            }
        });

        if (existTubeTestResult !== null) {
            return res.status(200).json({
                status: 'failed',
                payload: null,
                message: 'Tube number already exist'
            });
        }

        await _models2.default.TestResult.update({
            tube_number: tube_number,
            collection_date: new Date()
        }, {
            where: {
                id: test_result_id
            }
        });

        let testResult = await _models2.default.TestResult.findOne({
            where: {
                id: test_result_id
            },
            //attributes: ['tube_number', 'registration_date', 'collection_date', 'common_pass_qr_code', 'result_status', 'result_date', 'pre_registration_date', 'test_type_name'],
            include: [{
                attributes: ['result_value', 'result_type'],
                model: _models2.default.TestResultValue,
                as: 'testResultValue'
            }, {
                attributes: ['test_type_id', 'location_id', 'price'],
                model: _models2.default.LocationTestType,
                as: 'testResultLocationTestType'
            }]
        });
        res.status(200).json({
            status: 'success',
            payload: testResult,
            message: 'Test Result fetched successfully'
        });
    } catch (error) {
        console.log("Error at Test Result By Id method- GET / :" + error);
        res.status(500).json({
            status: 'failed',
            payload: {},
            message: 'Error while test result'
        });
    }
};

exports.fetch_all_test_result = async (req, res, next) => {
    try {
        let limit = 50;
        let offset = req.query.offset ? parseInt(req.query.offset) : 0;
        let fetchTestResults = await _models2.default.TestResult.findAll({
            limit: limit,
            offset: offset,
            order: [['id', 'ASC']],
            attributes: ['id', 'test_id', 'test_sequence_number', 'location_name', 'test_type_name', 'location_test_type_id'],
            include: [{
                attributes: ['price'],
                model: _models2.default.LocationTestType,
                as: 'testResultLocationTestType'
            }, {
                attributes: ['result_value', 'result_type'],
                model: _models2.default.TestResultValue,
                as: 'testResultValue'
            }]
        });

        res.status(200).json({
            status: 'success',
            payload: fetchTestResults,
            message: 'Test Result fetched successfully'
        });
    } catch (error) {
        console.log("Error at Test Result method- GET / :" + error);
        res.status(500).json({
            status: 'failed',
            payload: {},
            message: 'Error while fetching test result'
        });
    }
};

exports.update_test_result = async (req, res, next) => {
    try {
        let { id } = req.params;

        let { status, tube_number, test_sub_type_name, test_sub_type_ref, collection_date, result_date, result_status, patient_county, result_value, tested_machine_name, location_test_type_id } = req.body;

        // console.log(`BOdy ===> ${JSON.stringify(req.body)}`)

        let findTestResult = await _models2.default.TestResult.findOne({
            where: {
                id: id
            },
            include: [{
                model: _models2.default.TestType,
                as: 'testResultTestType'
            }]
        });

        // console.log(`Location ttid --> ${findTestResult.location_test_type_id} ---> ${location_test_type_id}`)

        if (findTestResult === null) {
            return res.status(200).json({
                status: 'success',
                payload: null,
                message: 'Invalid Test Result'
            });
        }

        let currentCollectionDate = null;
        if (findTestResult.collection_date === null && tube_number !== null && tube_number !== "") {
            currentCollectionDate = new Date();
        } else {
            currentCollectionDate = collection_date !== undefined && collection_date !== null ? collection_date : findTestResult.collection_date;
        }

        let fetchLocationTestType = await _models2.default.LocationTestType.findOne({
            where: {
                id: location_test_type_id
            },
            include: [{
                model: _models2.default.TestType,
                as: "testType"
            }]
        });

        let testTypeName = findTestResult.test_type_name;

        if (fetchLocationTestType !== null) {
            testTypeName = fetchLocationTestType.testType.name;
        }

        let resulStatus = findTestResult.result_status;
        let resultDate = result_date !== undefined && result_date !== null ? result_date : findTestResult.result_date;
        if (!!result_value && Object.keys(result_value).length > 0 && !Object.values(result_value).includes(null)) {
            resulStatus = 'Result available';
        }

        // console.log(`Status --> ${status} -------- ${status !== undefined && status !== null ? status : findTestResult.status}`)

        await _models2.default.TestResult.update({
            status: status !== undefined && status !== null ? status : findTestResult.status,
            test_sub_type_name: test_sub_type_name !== undefined ? test_sub_type_name : findTestResult.test_sub_type_name,
            test_sub_type_ref: test_sub_type_ref !== undefined ? test_sub_type_ref : findTestResult.test_sub_type_ref,
            // collection_date: collection_date !== undefined && collection_date !== null ? collection_date : findTestResult.collection_date,
            collection_date: currentCollectionDate,
            result_date: resultDate,
            result_status: resulStatus,
            patient_county: patient_county !== undefined && patient_county !== null ? patient_county : findTestResult.patient_county,
            tube_number: tube_number !== undefined ? tube_number : findTestResult.tube_number,
            tested_machine_name: tested_machine_name !== undefined && tested_machine_name !== null ? tested_machine_name : findTestResult.tested_machine_name,
            location_test_type_id: location_test_type_id !== undefined && location_test_type_id !== null ? location_test_type_id : findTestResult.location_test_type_id,
            test_type_name: testTypeName,
            test_type_id: fetchLocationTestType !== null ? fetchLocationTestType.test_type_id : findTestResult.test_type_id
        }, {
            where: {
                id: findTestResult.id
            }
        });

        findTestResult = await _models2.default.TestResult.findOne({
            where: {
                id: id
            },
            include: [{
                model: _models2.default.TestType,
                as: 'testResultTestType'
            }]
        });

        if (!!result_value && Object.keys(result_value).length > 0) {
            let fetchTestResultValue = await _models2.default.TestResultValue.findOne({
                where: {
                    test_result_id: id
                }
            });

            let qrImage = null;
            let constructQRCodeObj = {};
            if (findTestResult.member_token !== null) {
                let fetchUserDetail = await (0, _testResult.fetchMemberDetails)(findTestResult.member_token);

                constructQRCodeObj.id = fetchUserDetail.member_token;
                constructQRCodeObj.name = `${fetchUserDetail.first_name} ${fetchUserDetail.last_name !== null ? fetchUserDetail.last_name : ''}`;
                constructQRCodeObj.firstName = fetchUserDetail.first_name;
                constructQRCodeObj.lastName = fetchUserDetail.last_name;
                constructQRCodeObj.gender = fetchUserDetail.gender !== null ? fetchUserDetail.gender : '';
                constructQRCodeObj.birthDate = `${fetchUserDetail.birth_date !== null ? (0, _moment2.default)(fetchUserDetail.birth_date, 'YYYY/MM/DD').format('YYYY-MM-DD') : (0, _moment2.default)().format('YYYY-MM-DD')}`;
                constructQRCodeObj.passportNumber = fetchUserDetail.passport_number !== null ? fetchUserDetail.passport_number : '';

                constructQRCodeObj.effectiveDateTime = `${(0, _moment2.default)().utc().format('YYYY-MM-DD\THH:mm:ss')}+00:00`;
                constructQRCodeObj.patientRef = fetchUserDetail.member_token;
                // constructQRCodeObj.test = findTestResult.test_type_name;
                constructQRCodeObj.test = findTestResult.test_type_name;
                constructQRCodeObj.result = result_value['COVID19'] !== undefined && result_value['COVID19'] !== null ? result_value['COVID19'] : "";
            }

            let findTestValueType = await _models2.default.TestValueType.findAll({
                where: {
                    test_type_id: findTestResult.test_type_id
                }
            });

            let resultObj = {};
            for (let valueType of findTestValueType) {
                resultObj[valueType.code] = result_value[valueType.code];
            }

            // let currentDate = new Date();
            // constructQRCodeObj.effectiveDateTime = `${moment(currentDate).utc().format('YYYY-MM-DD\THH:mm:ss')}+00:00`;

            let currentDate = null;
            if (!Object.values(result_value).includes(null)) {
                currentDate = new Date();
                constructQRCodeObj.effectiveDateTime = `${(0, _moment2.default)(currentDate).utc().format('YYYY-MM-DD\THH:mm:ss')}+00:00`;
            }

            let currentQR = null;
            let currentTestResult = result_value['COVID19'] !== undefined && result_value['COVID19'] !== null ? result_value['COVID19'] : "";
            if (!!currentTestResult && currentTestResult !== "Inconclusive") {
                let base64QRCode = await (0, _testResult.createQRCode)(constructQRCodeObj);

                if (qrImage === null && base64QRCode.status === 'success') {
                    if (findTestResult.common_pass_qr_code !== null) {
                        await (0, _attachments.deleteDocument)(findTestResult.common_pass_qr_code, _constants.S3_USER_BUCKET_NAME);
                    }
                    qrImage = await (0, _attachments.uploadBase64Image)(base64QRCode.base64, _constants.S3_USER_BUCKET_NAME);
                }

                currentQR = qrImage !== null ? qrImage : findTestResult.common_pass_qr_code;
            } else {
                if (findTestResult.common_pass_qr_code !== null) {
                    await (0, _attachments.deleteDocument)(findTestResult.common_pass_qr_code, _constants.S3_USER_BUCKET_NAME);
                }
                currentQR = null;
            }

            let fetchTestCategory = await _models2.default.TestCategory.findOne({
                where: {
                    id: findTestResult.testResultTestType.test_category_id
                }
            });

            let testCategoryRef = fetchTestCategory !== null ? fetchTestCategory.id : null;

            if (fetchTestResultValue === null) {
                await _models2.default.TestResultValue.create({
                    result_value: resultObj,
                    result_type: 'JSON',
                    test_category_ref: testCategoryRef,
                    result: !!resultObj["COVID19"] ? resultObj["COVID19"] : null,
                    test_result_id: findTestResult.id,
                    status: "ACTIVE"
                });
            } else {
                console.log(`Result Obj --> ${JSON.stringify(resultObj)}`);
                await _models2.default.TestResultValue.update({
                    result_value: resultObj,
                    test_category_ref: testCategoryRef,
                    result: !!resultObj["COVID19"] ? resultObj["COVID19"] : null
                }, {
                    where: {
                        test_result_id: findTestResult.id
                    }
                });
            }

            await _models2.default.TestResult.update({
                result_date: currentDate,
                common_pass_qr_code: currentQR
            }, {
                where: {
                    id: findTestResult.id
                }
            });
        }

        /*
        //If result value available
        if (result_value !== undefined && result_value !== null && result_value !== "") {
            let fetchTestResultValues = await db.TestResultValue.findOne({
                where: {
                    test_result_id: id
                }
            });
             let qrImage = null;
            let constructQRCodeObj = {};
            if (findTestResult.member_token !== null) {
                let fetchUserMemberToken = findTestResult.member_token;
                let fetchUserDetail = await fetchMemberDetails(fetchUserMemberToken);
                  constructQRCodeObj.id = fetchUserDetail.member_token;
                constructQRCodeObj.name = `${fetchUserDetail.first_name} ${fetchUserDetail.last_name !== null ? fetchUserDetail.last_name : ''}`;
                constructQRCodeObj.firstName = fetchUserDetail.first_name;
                constructQRCodeObj.lastName = fetchUserDetail.last_name;
                constructQRCodeObj.gender = fetchUserDetail.gender !== null ? fetchUserDetail.gender : '';
                constructQRCodeObj.birthDate = `${fetchUserDetail.birth_date !== null ? moment(fetchUserDetail.birth_date, 'YYYY/MM/DD').format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')}`;
                constructQRCodeObj.passportNumber = fetchUserDetail.passport_number !== null ? fetchUserDetail.passport_number : '';
                 constructQRCodeObj.effectiveDateTime = `${moment(resultDate).utc().format('YYYY-MM-DD\THH:mm:ss')}+00:00`;
                constructQRCodeObj.patientRef = fetchUserDetail.member_token;
                // constructQRCodeObj.test = findTestResult.test_type_name;
                constructQRCodeObj.test = testTypeName;
                constructQRCodeObj.result = result_value;
            }
              if (fetchTestResultValues.length === 0) {
                let findTestValueType = await db.TestValueType.findAll({
                    where: {
                        test_type_id: findTestResult.test_type_id
                    }
                });
                 if (findTestValueType.length > 0) {
                    if (result_value !== null) {
                        for (let valueType of findTestValueType) {
                            await db.TestResultValue.create({
                                result_value: result_value,
                                result_type: valueType.value_type,
                                test_result_id: findTestResult.id,
                                test_value_type_id: valueType.id,
                                status: "ACTIVE"
                            });
                             let currentDate = new Date();
                            constructQRCodeObj.effectiveDateTime = `${moment(currentDate).utc().format('YYYY-MM-DD\THH:mm:ss')}+00:00`;
                            
                            let currentQR = null;
                            if(result_value !== "Inconclusive"){
                                let base64QRCode = await createQRCode(constructQRCodeObj);
                                 if (qrImage === null && base64QRCode.status === 'success') {
                                    // console.log(`Signature --> \n${signature_image}`)
                                    if(findTestResult.common_pass_qr_code !== null){
                                        await deleteDocument(findTestResult.common_pass_qr_code, S3_USER_BUCKET_NAME)
                                    }
                                    qrImage = await uploadBase64Image(base64QRCode.base64, S3_USER_BUCKET_NAME);
                                    // console.log(`QR 1 --> ${qrImage}`)
                                }
                                
                                currentQR = qrImage !== null ? qrImage : findTestResult.common_pass_qr_code;
                            } else {
                                if(findTestResult.common_pass_qr_code !== null){
                                    await deleteDocument(findTestResult.common_pass_qr_code, S3_USER_BUCKET_NAME)
                                }
                                currentQR = null;
                            }
                             await db.TestResult.update({
                                result_date: currentDate,
                                common_pass_qr_code: currentQR
                            }, {
                                where: {
                                    id: findTestResult.id
                                }
                            });
                        }
                    }
                }
            } else {
                let currentTestResultValue = fetchTestResultValues[0];
                // console.log(`currentTestResultValue -->${JSON.stringify(currentTestResultValue)}--------- result_value -->${result_value}--`)
                if (result_value !== '' && result_value !== null && result_value !== currentTestResultValue.result_value) {
                    await db.TestResultValue.update({
                        result_value: result_value
                    }, {
                        where: {
                            id: currentTestResultValue.id
                        }
                    });
                      let currentDate1 = new Date();
                    constructQRCodeObj.effectiveDateTime = `${moment(currentDate1).utc().format('YYYY-MM-DD\THH:mm:ss')}+00:00`;
                    let currentQR1 = null;
                     if(result_value !== 'Inconclusive'){
                        let base64QRCode1 = await createQRCode(constructQRCodeObj);
                         if (qrImage === null && base64QRCode1.status === 'success') {
                            // console.log(`Signature --> \n${signature_image}`)
                            if(findTestResult.common_pass_qr_code !== null){
                                await deleteDocument(findTestResult.common_pass_qr_code, S3_USER_BUCKET_NAME)
                            }
                            qrImage = await uploadBase64Image(base64QRCode1.base64, S3_USER_BUCKET_NAME);
                            // console.log(`QR 21 --> ${qrImage}`)
                        }
                         currentQR1 = qrImage !== null ? qrImage : findTestResult.common_pass_qr_code
                     }else{
                        if(findTestResult.common_pass_qr_code !== null){
                            await deleteDocument(findTestResult.common_pass_qr_code, S3_USER_BUCKET_NAME)
                        }
                        currentQR1 = null;
                    }
                    
                    await db.TestResult.update({
                        result_date: currentDate1,
                        common_pass_qr_code: currentQR1
                    }, {
                        where: {
                            id: findTestResult.id
                        }
                    });
                }
            }
        }
        */

        let testResult = await _models2.default.TestResult.findOne({
            where: {
                id: findTestResult.id
            },
            include: [{
                attributes: ['result_value', 'result_type'],
                model: _models2.default.TestResultValue,
                as: 'testResultValue'
            }, {
                attributes: ['test_type_id', 'location_id', 'price'],
                model: _models2.default.LocationTestType,
                as: 'testResultLocationTestType'
            }, {
                attributes: ['test_category_id'],
                model: _models2.default.TestType,
                as: 'testResultTestType'
            }]
        });
        res.status(200).json({
            status: 'success',
            payload: testResult,
            message: 'Test Result updated successfully'
        });
    } catch (error) {
        console.log("Error at update Test Result By Id method- PUT / :id" + error);
        res.status(500).json({
            status: 'failed',
            payload: {},
            message: 'Error while updating test result'
        });
    }
};

exports.add_new_test_result = async (req, res, next) => {
    try {
        // console.log(`\n\n ${JSON.stringify(req.body)}\n`)
        let { member_token, location_test_type_id, lab_code, tube_number, collection_date, registration_date, physician_ref, result_status, result_date, is_acceptance, patient_county, referring_physician, referring_physician_npi, result_value, test_sub_type_ref, test_sub_type_name, signature_image, first_name, last_name } = req.body;

        let locationTestType = await _models2.default.LocationTestType.findOne({
            where: {
                id: location_test_type_id
            },
            include: [{
                model: _models2.default.Location,
                as: 'location'
            }, {
                model: _models2.default.TestType,
                as: 'testType'
            }]
        });

        if (locationTestType === null) {
            return res.status(200).json({
                status: 'failed',
                payload: null,
                message: 'Invalid Location Test Type'
            });
        }

        let signature_image_name = null;

        if (signature_image !== undefined && signature_image !== null && signature_image !== "") {
            // console.log(`Signature --> \n${signature_image}`)
            signature_image_name = await (0, _attachments.uploadBase64Image)(signature_image, _constants.S3_USER_BUCKET_NAME);
        }

        let testedMachineName = null;
        if (locationTestType.testType.name.indexOf('Antigen') > -1) {
            testedMachineName = 'InBios';
        } else if (locationTestType.testType.name.indexOf('NAAT') > -1) {
            testedMachineName = 'ID Now';
        } else if (locationTestType.testType.name.indexOf('PCR') > -1) {
            if (locationTestType.testType.name.indexOf('Same Day') > -1) {
                testedMachineName = 'Accula';
            } else {
                testedMachineName = 'TaqPath';
            }
        }

        let gzippedFirstNameBuffer = gzipSync(first_name.toLowerCase());
        let hashedFirstName = gzippedFirstNameBuffer.toString('base64');

        let gzippedLastNameBuffer = gzipSync(last_name.toLowerCase());
        let hashedLastName = gzippedLastNameBuffer.toString('base64');

        let fetchTestCategory = await _models2.default.TestCategory.findOne({
            where: {
                id: locationTestType.testType.test_category_id
            }
        });

        let fetchShortCode = fetchTestCategory !== null ? fetchTestCategory.short_code : '';
        // let fetchSequenceNumber = await sequenceNumber(fetchTestCategory.id);

        // console.log(`Sequence Num --> ${fetchSequenceNumber}`);
        // console.log(`Code --> ${fetchShortCode}-000${fetchSequenceNumber}`)

        // let testSequenceNumber = `COV-${String(test.id).padStart(6, '0')}`;
        // let testSequenceNumber = `${fetchShortCode}-${String(fetchSequenceNumber).padStart(6, '0')}`
        let testSequenceNumber = `${fetchShortCode}-`;

        let newTestResult = await _models2.default.TestResult.create({
            location_test_type_id: locationTestType.id,
            first_name: hashedFirstName,
            last_name: hashedLastName,
            lab_code,
            member_token,
            test_sequence_number: testSequenceNumber,
            location_id: locationTestType.location_id,
            location_name: locationTestType.location.name,
            test_type_id: locationTestType.test_type_id,
            test_type_name: locationTestType.testType.name,
            test_sub_type_name,
            test_sub_type_ref,
            result_status: !!result_status ? result_status : 'Result unavailable',
            tube_number,
            collection_date,
            registration_date,
            result_date,
            is_acceptance,
            patient_county,
            physician_ref,
            referring_physician,
            referring_physician_npi,
            customer_signature: signature_image_name,
            tested_machine_name: testedMachineName,
            status: "ACTIVE"
        });

        // await db.MemberResult.create({
        //     member_token,
        //     lab_code,
        //     test_result_id: newTestResult.id,
        //     status: "ACTIVE"
        // });

        if (!!result_value && Object.keys(result_value).length > 0) {
            let findTestValueType = await _models2.default.TestValueType.findAll({
                where: {
                    test_type_id: newTestResult.test_type_id
                }
            });

            let qrImage = null;
            let constructQRCodeObj = {};
            if (member_token !== null) {
                let fetchUserDetail = await (0, _testResult.fetchMemberDetails)(member_token);

                constructQRCodeObj.id = fetchUserDetail.member_token;
                constructQRCodeObj.name = `${fetchUserDetail.first_name} ${fetchUserDetail.last_name !== null ? fetchUserDetail.last_name : ''}`;
                constructQRCodeObj.firstName = fetchUserDetail.first_name;
                constructQRCodeObj.lastName = fetchUserDetail.last_name;
                constructQRCodeObj.gender = fetchUserDetail.gender !== null ? fetchUserDetail.gender : '';
                constructQRCodeObj.birthDate = `${fetchUserDetail.birth_date !== null ? (0, _moment2.default)(fetchUserDetail.birth_date, 'YYYY/MM/DD').format('YYYY-MM-DD') : (0, _moment2.default)().format('YYYY-MM-DD')}`;
                constructQRCodeObj.passportNumber = fetchUserDetail.passport_number !== null ? fetchUserDetail.passport_number : '';

                constructQRCodeObj.effectiveDateTime = `${(0, _moment2.default)().utc().format('YYYY-MM-DD\THH:mm:ss')}+00:00`;
                constructQRCodeObj.patientRef = fetchUserDetail.member_token;
                // constructQRCodeObj.test = findTestResult.test_type_name;
                constructQRCodeObj.test = locationTestType.testType.name;
                constructQRCodeObj.result = result_value['COVID19'] !== undefined && result_value['COVID19'] !== null ? result_value['COVID19'] : "";
            }

            if (findTestValueType.length > 0) {
                let resultObj = {};
                for (let valueType of findTestValueType) {
                    resultObj[valueType.code] = result_value[valueType.code];
                }

                let fetchTestType = await _models2.default.TestType.findOne({
                    where: {
                        id: newTestResult.test_type_id
                    }
                });
                let fetchTestCategory = await _models2.default.TestCategory.findOne({
                    where: {
                        id: fetchTestType.test_category_id
                    }
                });

                let testCategoryRef = fetchTestCategory !== null ? fetchTestCategory.id : null;

                await _models2.default.TestResultValue.create({
                    result_value: resultObj,
                    result_type: 'JSON',
                    test_category_ref: testCategoryRef,
                    result: !!resultObj["COVID19"] ? resultObj["COVID19"] : null,
                    test_result_id: newTestResult.id,
                    status: "ACTIVE"
                });

                let currentDate = null;
                if (!Object.values(result_value).includes(null)) {
                    currentDate = new Date();
                    constructQRCodeObj.effectiveDateTime = `${(0, _moment2.default)(currentDate).utc().format('YYYY-MM-DD\THH:mm:ss')}+00:00`;
                }

                let currentQR = null;
                let currentTestResult = result_value['COVID19'] !== undefined && result_value['COVID19'] !== null ? result_value['COVID19'] : "";
                if (!!currentTestResult && currentTestResult !== "Inconclusive") {
                    let base64QRCode = await (0, _testResult.createQRCode)(constructQRCodeObj);

                    if (qrImage === null && base64QRCode.status === 'success') {
                        if (newTestResult.common_pass_qr_code !== null) {
                            await (0, _attachments.deleteDocument)(newTestResult.common_pass_qr_code, _constants.S3_USER_BUCKET_NAME);
                        }
                        qrImage = await (0, _attachments.uploadBase64Image)(base64QRCode.base64, _constants.S3_USER_BUCKET_NAME);
                    }

                    currentQR = qrImage !== null ? qrImage : newTestResult.common_pass_qr_code;
                } else {
                    if (newTestResult.common_pass_qr_code !== null) {
                        await (0, _attachments.deleteDocument)(newTestResult.common_pass_qr_code, _constants.S3_USER_BUCKET_NAME);
                    }
                    currentQR = null;
                }

                await _models2.default.TestResult.update({
                    result_date: currentDate,
                    common_pass_qr_code: currentQR
                }, {
                    where: {
                        id: newTestResult.id
                    }
                });
            }
        }

        /*
        if (result_value !== undefined && result_value !== null && result_value !== "") {
            let qrImage = null;
            let constructQRCodeObj = {};
            if (member_token !== null) {
                let fetchUserDetail = await fetchMemberDetails(member_token);
                  constructQRCodeObj.id = fetchUserDetail.member_token;
                constructQRCodeObj.name = `${fetchUserDetail.first_name} ${fetchUserDetail.last_name !== null ? fetchUserDetail.last_name : ''}`;
                constructQRCodeObj.firstName = fetchUserDetail.first_name;
                constructQRCodeObj.lastName = fetchUserDetail.last_name;
                constructQRCodeObj.gender = fetchUserDetail.gender !== null ? fetchUserDetail.gender : '';
                constructQRCodeObj.birthDate = `${fetchUserDetail.birth_date !== null ? moment(fetchUserDetail.birth_date, 'YYYY/MM/DD').format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')}`;
                constructQRCodeObj.passportNumber = fetchUserDetail.passport_number !== null ? fetchUserDetail.passport_number : '';
                 constructQRCodeObj.effectiveDateTime = `${moment().utc().format('YYYY-MM-DD\THH:mm:ss')}+00:00`;
                constructQRCodeObj.patientRef = fetchUserDetail.member_token;
                // constructQRCodeObj.test = findTestResult.test_type_name;
                constructQRCodeObj.test = locationTestType.testType.name;
                constructQRCodeObj.result = result_value;
            }
              if (findTestValueType.length > 0) {
                if (result_value !== null) {
                    for (let valueType of findTestValueType) {
                        await db.TestResultValue.create({
                            result_value: result_value,
                            result_type: valueType.value_type,
                            test_result_id: newTestResult.id,
                            test_value_type_id: valueType.id,
                            status: "ACTIVE"
                        });
                         let currentDate = new Date();
                        constructQRCodeObj.effectiveDateTime = `${moment(currentDate).utc().format('YYYY-MM-DD\THH:mm:ss')}+00:00`;
                        
                        let currentQR = null;
                        if(result_value !== "Inconclusive"){
                            let base64QRCode = await createQRCode(constructQRCodeObj);
                             if (qrImage === null && base64QRCode.status === 'success') {
                                // console.log(`Signature --> \n${signature_image}`)
                                if(newTestResult.common_pass_qr_code !== null){
                                    await deleteDocument(newTestResult.common_pass_qr_code, S3_USER_BUCKET_NAME)
                                }
                                qrImage = await uploadBase64Image(base64QRCode.base64, S3_USER_BUCKET_NAME);
                                // console.log(`QR 1 --> ${qrImage}`)
                            }
                            
                            currentQR = qrImage !== null ? qrImage : newTestResult.common_pass_qr_code;
                        } else {
                            if(newTestResult.common_pass_qr_code !== null){
                                await deleteDocument(newTestResult.common_pass_qr_code, S3_USER_BUCKET_NAME)
                            }
                            currentQR = null;
                        }
                         await db.TestResult.update({
                            result_date: currentDate,
                            common_pass_qr_code: currentQR
                        }, {
                            where: {
                                id: newTestResult.id
                            }
                        });
                        
                    }
                }
            }
        }
         */

        let testResult = await _models2.default.TestResult.findOne({
            where: {
                id: newTestResult.id
            },
            include: [{
                attributes: ['result_value', 'result_type'],
                model: _models2.default.TestResultValue,
                as: 'testResultValue'
            }, {
                attributes: ['test_type_id', 'location_id', 'price'],
                model: _models2.default.LocationTestType,
                as: 'testResultLocationTestType'
            }]
        });

        res.status(200).json({
            status: 'success',
            payload: testResult,
            message: 'Test result created successfully'
        });
    } catch (error) {
        console.log("Error at Add Test Result method- POST / :" + error);
        res.status(500).json({
            status: 'failed',
            payload: {},
            message: 'Error while adding new test result'
        });
    }
};

exports.fetch_test_report = async (req, res, next) => {
    try {
        const { test_id } = req.query;
        if (!!test_id) {

            let fetchTestResult = await _models2.default.TestResult.findOne({
                where: {
                    test_id: test_id
                },
                include: [{
                    attributes: ['result_value', 'result_type'],
                    model: _models2.default.TestResultValue,
                    as: 'testResultValue'
                }, {
                    attributes: ['id', 'name', 'test_category_id'],
                    model: _models2.default.TestType,
                    as: 'testResultTestType'
                }]
            });

            if (fetchTestResult === null) {
                // return res.sendFile(path.resolve(__dirname, '../views/error.html'));
                return res.status(200).json({
                    status: 'failed',
                    payload: null,
                    message: 'No Test Result found'
                });
            }

            // let reportResult = fetchTestResult.testResultValues.length > 0 ? fetchTestResult.testResultValues[0].result_value : null;
            let reportResult = fetchTestResult.testResultValue !== null && Object.keys(fetchTestResult.testResultValue).length > 0 ? fetchTestResult.testResultValue.result_value : null;

            if (reportResult === null) {
                return res.status(200).json({
                    status: 'failed',
                    payload: null,
                    message: 'Result yet To be updated'
                });
            }

            let memberToken = fetchTestResult.member_token;
            if (memberToken === null) {
                return res.status(200).json({
                    status: 'failed',
                    payload: null,
                    message: 'UnAuthorized access'
                });
            }

            // let fetchTestCategory = await db.TestCategory.findOne({
            //     where: {
            //         id: fetchTestResult.testResultTestType.test_category_id
            //     }
            // });

            let fetchLocation = await _models2.default.Location.findOne({
                where: {
                    id: fetchTestResult.location_id
                }
            });

            let fetchUserDetails = await (0, _testResult.fetchMemberDetails)(memberToken);

            // console.log(`fetchTestResult --> ${JSON.stringify(fetchTestResult)}`)

            let testTypeName = fetchTestResult.testResultTestType !== null ? fetchTestResult.testResultTestType.name : '';
            let testLocation = fetchTestResult.location_name;
            let testedMachineName = '';
            let isSecondPage = true;
            let negativeDescription = '';
            let positiveDescription = '';
            let clia = '03D2188271';
            let address_line1 = '4165 N Craftsman Ct.';
            let address_line2 = 'Scottsdale, AZ 85251.';
            let labname = fetchTestResult.tested_lab_name;
            let currentTest = 'RT-PCR';

            // console.log(`Step 1 --> ${testTypeName} --- ${fetchTestResult.tested_machine_name}`)

            if (fetchTestResult.tested_machine_name != null && fetchTestResult.tested_machine_name.indexOf('ID Now') >= 0) {
                testedMachineName = 'Abbott ID NOW COVID-19 Combo SARS-CoV-2 NAAT';
            } else if (fetchTestResult.tested_machine_name != null && fetchTestResult.tested_machine_name.indexOf('Accula') >= 0) {
                testedMachineName = 'Accula SARS-CoV-2 Test performed on the Accula Dock';
            } else if (fetchTestResult.tested_machine_name != null && fetchTestResult.tested_machine_name.indexOf('TaqPath') >= 0) {
                testedMachineName = 'Thermo Fisher Scientific TaqPath COVID-19 Combo SARS-CoV-2 RT-PCR';
            } else if (fetchTestResult.tested_machine_name != null && fetchTestResult.tested_machine_name.indexOf('InBios') >= 0) {
                testedMachineName = 'InBios SCoV-2 Ag Detect™ Rapid Test';
            } else if (fetchTestResult.tested_machine_name != null && fetchTestResult.tested_machine_name.indexOf('QuickVue') >= 0) {
                testedMachineName = 'The QuickVue COVID-19 Test';
            } else if (fetchTestResult.tested_machine_name != null && fetchTestResult.tested_machine_name.indexOf('BinaxNOW') >= 0) {
                testedMachineName = 'BinaxNOW™ System for Rapid Detection of SARS-CoV-2';
            }

            // negativeDescription and Second Page 
            if (testTypeName.indexOf('Same Day') >= 0) {
                isSecondPage = true;
                negativeDescription = 'This letter is to certify that the above person is fit to fly. This test was performed on an FDA EUA authorized platform and assay: ' + testedMachineName + '. For questions or verification, please call Saguaro Bloom Diagnostics at (856) 502-0781.';
                positiveDescription = 'The ' + testedMachineName + ' is intended for detection of RNA from SARS-CoV-2 in nasal swab samples from patients with signs and symptoms who are suspected of COVID-19.';

                if (testLocation.indexOf('New York') >= 0) {
                    //negativeDescription = 'This letter is to certify that the above person is fit to fly. This test was performed on an FDA EUA authorized platform and assay: Accula SARS-CoV-2 Test performed on the Accula Dock. For questions or verification, please call Bloom Labs at (917) 456-4033.';
                    negativeDescription = 'This letter is to certify that the above person is fit to fly. This test was performed on an FDA EUA authorized platform and assay: ' + testedMachineName + '. For questions or verification, please call Bloom Labs at (917) 456-4033.';
                }
            } else if (testTypeName.indexOf('Rapid') >= 0 || testTypeName.indexOf('Paid') >= 0 || testTypeName.indexOf('RT-PCR') >= 0) {
                isSecondPage = true;
                if (testTypeName.indexOf('West Valley') >= 0 || testTypeName.indexOf('Antigen') >= 0) {
                    isSecondPage = false;
                }

                negativeDescription = 'This letter is to certify that the above person is fit to fly. This test was performed on an FDA EUA authorized platform and assay: ' + testedMachineName + '. For questions or verification, please call Saguaro Bloom Diagnostics at (856) 502-0781.';
                positiveDescription = 'The ' + testedMachineName + ' for Rapid Detection of SARS-CoV-2 is a chromatographic immunoassay for the direct and qualitative detection of SARS-CoV-2 antigens in nasal swabs from patients with signs and symptoms who are suspected of COVID-19.';

                if (testTypeName.indexOf('Paid') >= 0 || testTypeName.indexOf('Old Town') >= 0) {
                    isSecondPage = true;
                }

                if (testLocation.indexOf('New York') >= 0) {
                    negativeDescription = 'This letter is to certify that the above person is fit to fly. This test was performed on an FDA EUA authorized platform and assay: ' + testedMachineName + ' System for Rapid Detection of SARS-CoV-2. For questions or verification, please call Bloom Labs at (917) 456-4033.';
                }
            } else if (testTypeName.indexOf('NAAT') >= 0) {
                isSecondPage = true;
                negativeDescription = 'This letter is to certify that the above person is fit to fly. This test was performed on an FDA EUA authorized platform and assay: ' + testedMachineName + '. For questions or verification, please call Bloom Labs at (917) 456-4033.';
                positiveDescription = 'The ' + testedMachineName + ' is intended for detection of RNA from SARS-CoV-2 in nasal swab samples from patients with signs and symptoms who are suspected of COVID-19.';
            } else {
                negativeDescription = 'This letter is to certify that the above person is fit to fly. This test was performed on an FDA EUA authorized platform and assay: ' + testedMachineName + '. For questions or verification, please call Saguaro Bloom Diagnostics at (856) 502-0781.';
                positiveDescription = 'The ' + testedMachineName + ' is intended for detection of RNA from SARS-CoV-2 in nasal swab samples from patients with signs and symptoms who are suspected of COVID-19.';

                if (testLocation.indexOf('New York') >= 0) {
                    if (testTypeName.indexOf('HRSA') >= 0 || testTypeName.indexOf('Insurance') >= 0) {
                        isSecondPage = false;
                    } else {
                        isSecondPage = true;
                    }
                    //negativeDescription = 'This letter is to certify that the above person is fit to fly. This test was performed on an FDA EUA authorized platform and assay: Thermo Fisher Scientific TaqPath COVID-19 Combo SARS-CoV-2 RT-PCR. For questions or verification, please call Bloom Labs at (917) 456-4033.';
                    negativeDescription = 'This letter is to certify that the above person is fit to fly. This test was performed on an FDA EUA authorized platform and assay: ' + testedMachineName + '. For questions or verification, please call Bloom Labs at (917) 456-4033.';
                }
            }

            if (testTypeName.indexOf('Antigen') >= 0) {
                currentTest = 'Antigen';
            }

            // console.log(`Step 2 --> ${testTypeName} --- ${fetchTestResult.tested_lab_name}`)

            if (fetchTestResult.tested_lab_name.indexOf('Pandemic') >= 0) {
                clia = '33D2196459';
                // address = '45-18 Ct Square W, Long Island City, NY 11101';
                address_line1 = '45-18 Ct Square W';
                address_line2 = 'Long Island City, NY 11101';
                labname = 'Pandemic Response Lab';
            }

            if (fetchTestResult.tested_lab_name.indexOf('Prorenata') >= 0) {
                clia = '03D2147626';
                // address = '8222 S 48th ST STE 210, PHOENIX, AZ 85044';
                address_line1 = '8222 S 48th ST STE 210';
                address_line2 = 'PHOENIX, AZ 85044';
                labname = 'Prorenata Labs';
            }

            let constructData = {};

            let fetchTestCategoryCode = 'COV';
            if (fetchTestResult.test_sequence_number.includes('ALG') === true) {
                fetchTestCategoryCode = 'ALG';
                constructData.result_value = reportResult;
            } else if (fetchTestResult.test_sequence_number.includes('CAB') === true) {
                fetchTestCategoryCode = 'CAB';
                constructData.result_value = reportResult;
            } else {
                fetchTestCategoryCode = 'COV';
                constructData.result_value = !!reportResult['COVID19'] ? reportResult['COVID19'] : '-';
            }

            // constructData.result_date = fetchTestResult.result_date !== null ? moment(fetchTestResult.result_date).format('MM-DD-YYYY hh:mm a') : "";
            constructData.test_number = fetchTestResult.tube_number;
            constructData.patient_name = fetchUserDetails.full_name;
            constructData.date_of_birth = fetchUserDetails.birth_date !== null ? (0, _moment2.default)(fetchUserDetails.birth_date).format('MM-DD-YYYY') : '';

            if (fetchUserDetails.passport_number !== null && fetchUserDetails.passport_number !== "") {
                constructData.id_number = fetchUserDetails.passport_number;
            } else if (fetchUserDetails.driver_license_number !== null && fetchUserDetails.driver_license_number !== "") {
                constructData.id_number = fetchUserDetails.driver_license_number;
            } else {
                constructData.id_number = "";
            }

            // constructData.id_number = "";
            constructData.email = fetchUserDetails.email;

            constructData.signature = `${_constants.TEST_API_END_POINT}1640037385714.jpg`;
            // constructData.qr_code = `${TEST_API_END_POINT}sampleQRCode.png`;
            constructData.qr_code = `${_constants.ACCOUNT_API_DOMAIN}image/u/${fetchTestResult.common_pass_qr_code}`;
            constructData.seal = `${_constants.TEST_API_END_POINT}Saguaro_Bloom_Seal.png`;
            constructData.logo = `${_constants.TEST_API_END_POINT}logo.png`;
            constructData.logo_white = `${_constants.TEST_API_END_POINT}logoWhite.png`;
            constructData.top_corner = `${_constants.TEST_API_END_POINT}Saguaro_Bloom_Top_Corner.png`;
            constructData.bottom_corner = `${_constants.TEST_API_END_POINT}Saguaro_Bloom_Bottom_Corner.png`;
            constructData.seal = `${_constants.TEST_API_END_POINT}Saguaro_Bloom_Seal.png`;

            // constructData.collected_date = fetchTestResult.collected_date !== null ? moment(fetchTestResult.collected_date).format('MM-DD-YYYY hh:mm a') : '';
            // constructData.result_date = fetchTestResult.result_date !== null ? moment(fetchTestResult.result_date).format('MM-DD-YYYY hh:mm a') : '';

            if (fetchTestResult.collection_date !== null) {
                if (fetchLocation.timezone !== null) {
                    constructData.collected_date = (0, _moment2.default)(fetchTestResult.collection_date).tz(fetchLocation.timezone).format('MM-DD-YYYY hh:mm a');
                } else {
                    constructData.collected_date = (0, _moment2.default)(fetchTestResult.collection_date).format('MM-DD-YYYY hh:mm a');
                }
            } else {
                constructData.collected_date = '';
            }

            if (fetchTestResult.result_date !== null) {
                if (fetchLocation.timezone !== null) {
                    constructData.result_date = (0, _moment2.default)(fetchTestResult.result_date).tz(fetchLocation.timezone).format('MM-DD-YYYY hh:mm a');
                } else {
                    constructData.result_date = (0, _moment2.default)(fetchTestResult.result_date).format('MM-DD-YYYY hh:mm a');
                }
            } else {
                constructData.result_date = '';
            }

            constructData.technician_name = "J.G";
            constructData.test_name = "SARS-CoV-2";
            constructData.test_type = fetchTestResult.test_type_name !== null ? fetchTestResult.test_type_name : '';

            // constructData.result_value = !!reportResult['COVID19'] ? reportResult['COVID19'] : '-';
            constructData.tested_lab = labname;
            constructData.address_line1 = address_line1;
            constructData.address_line2 = address_line2;
            constructData.clia = clia;
            constructData.is_second_page = isSecondPage;
            constructData.negative_description = negativeDescription;
            constructData.positive_description = positiveDescription;
            constructData.tested_machine_name = testedMachineName;
            constructData.collection_method = fetchTestResult.test_sub_type_name;
            constructData.test = currentTest;
            constructData.location = fetchTestResult.location_name;
            constructData.category = fetchTestCategoryCode;

            // console.log(`Data --> ${JSON.stringify(constructData)}`);

            res.status(200).json({
                status: 'success',
                payload: constructData,
                message: 'Test Result Data'
            });
        } else {
            return res.status(200).json({
                status: 'failed',
                payload: null,
                message: 'No Test Result found'
            });
        }
    } catch (error) {
        console.log(`Error ==> ${error}`);
        res.status(500).json({
            status: 'failed',
            payload: null,
            message: 'Error while fetching test result'
        });
    }
};

exports.fetch_all_test_reports = async (req, res, next) => {
    try {
        const { result_date, report_type } = req.query;
        let whereObj = {};
        let whereResultObj = {};
        let fetchTestResult = [];

        if (!!result_date && result_date !== "null" && result_date !== "undefined") {
            whereObj.result_date = _sequelize2.default.where(_sequelize2.default.fn('date', _sequelize2.default.col('result_date')), '=', (0, _moment2.default)(result_date, 'MM/DD/YYYY').format('YYYY-MM-DD'));
        }

        whereObj.result_status = {
            [Op.or]: ["Result available", "Result sent"]
        };

        // whereResultObj.result_value = {
        //     [Op.or]: ["Positive", "Negative"]
        // };

        whereResultObj.result = {
            [Op.or]: ["Positive", "Negative"]
        };

        if (report_type === "ADHS") {
            let whereLocationObj = {};
            whereLocationObj.code = { [Op.ne]: "NY" };
            fetchTestResult = await _models2.default.TestResult.findAll({
                where: whereObj,
                include: [{
                    attributes: ['result_value', 'result_type', 'result'],
                    model: _models2.default.TestResultValue,
                    as: 'testResultValue',
                    where: whereResultObj
                }, {
                    model: _models2.default.Location,
                    as: 'testResultLocation',
                    where: whereLocationObj
                }, {
                    model: _models2.default.LocationTestType,
                    as: 'testResultLocationTestType'
                }, {
                    model: _models2.default.TestType,
                    as: 'testResultTestType'
                }]
            });

            // console.log(`Test --> ${JSON.stringify(fetchTestResult)}`)
        }

        if (report_type === "ECLRS") {
            let whereLocationObj = {};
            whereLocationObj.code = "NY";
            fetchTestResult = await _models2.default.TestResult.findAll({
                where: whereObj,
                include: [{
                    attributes: ['result_value', 'result_type', 'result'],
                    model: _models2.default.TestResultValue,
                    as: 'testResultValue',
                    where: whereResultObj
                }, {
                    model: _models2.default.Location,
                    as: 'testResultLocation',
                    where: whereLocationObj
                }, {
                    model: _models2.default.LocationTestType,
                    as: 'testResultLocationTestType'
                }, {
                    model: _models2.default.TestType,
                    as: 'testResultTestType'
                }]
            });
        }

        if (report_type === "NATH") {
            let whereLocationTestTypeObj = {};
            whereLocationTestTypeObj.is_insurance_test = true;
            fetchTestResult = await _models2.default.TestResult.findAll({
                where: whereObj,
                include: [{
                    attributes: ['result_value', 'result_type', 'result'],
                    model: _models2.default.TestResultValue,
                    as: 'testResultValue',
                    where: whereResultObj
                }, {
                    model: _models2.default.Location,
                    as: 'testResultLocation'
                }, {
                    model: _models2.default.LocationTestType,
                    as: 'testResultLocationTestType',
                    where: whereLocationTestTypeObj
                }, {
                    model: _models2.default.TestType,
                    as: 'testResultTestType'
                }]
            });
        }

        res.status(200).json({
            status: 'success',
            payload: fetchTestResult,
            message: 'Test result reports fetched successfully'
        });
    } catch (error) {
        console.log(`Error at test result reports GET / ==> ${error}`);
        res.status(500).json({
            status: 'failed',
            payload: null,
            message: 'Error while fetching test result reports'
        });
    }
};

exports.fetch_test_results_by_result_status = async (req, res, next) => {
    try {
        let { offset, result_status, location_id, test_type_id } = req.query;
        let limit = 50;
        offset = offset ? parseInt(offset) : 0;
        let whereObj = {};
        if (!!result_status) {
            whereObj.result_status = result_status;
        }
        if (!!test_type_id) {
            whereObj.test_type_id = test_type_id;
        }
        if (!!location_id) {
            whereObj.location_id = location_id;
        }

        let fetchTestResults = await _models2.default.TestResult.findAll({
            where: whereObj,
            limit: limit,
            offset: offset,
            order: [['id', 'DESC']],
            include: [{
                attributes: ['price'],
                model: _models2.default.LocationTestType,
                as: 'testResultLocationTestType'
            }, {
                attributes: ['result_value', 'result_type'],
                model: _models2.default.TestResultValue,
                as: 'testResultValue'
            }]
        });

        res.status(200).json({
            status: 'success',
            payload: fetchTestResults,
            message: 'Test Results by result status fetched successfully'
        });
    } catch (error) {
        console.log("Error at Fetching Test Results by result status method- GET / :" + error);
        res.status(500).json({
            status: 'failed',
            payload: {},
            message: 'Error while fetching test result by result status'
        });
    }
};

exports.send_test_result = async (req, res, next) => {
    try {
        const { testResultIds } = req.body;
        // console.log(`Test Result Ids --> ${JSON.stringify(testResultIds)}`)

        // member_token, name, phone_number, country_code, email, type, message_purpose, description, email_content

        let testResults = await _models2.default.TestResult.findAll({
            where: {
                id: testResultIds
            }
        });

        // console.log(`\nResults --> ${JSON.stringify(testResults)}`)

        if (testResults.length > 0) {
            let fetchMemberTokens = _underscore2.default.pluck(testResults, 'member_token');
            // console.log(`MemTok --> ${JSON.stringify(fetchMemberTokens)}`);
            let data = {};
            data.member_tokens = _underscore2.default.uniq(fetchMemberTokens);
            let members = await _MessageUtils2.default.fetchMemberDetails(data);

            // console.log(`Members --> ${JSON.stringify(members)}`);
            let processedTestResultIds = [];

            for (let result of testResults) {
                let fetchMember = members[result.member_token];
                if (fetchMember !== undefined) {
                    processedTestResultIds.push(result.id);
                    let message_data = {};
                    message_data.member_token = result.member_token;
                    message_data.name = `${fetchMember.first_name.charAt(0).toUpperCase() + fetchMember.first_name.slice(1)} ${fetchMember.last_name.charAt(0).toUpperCase() + fetchMember.last_name.slice(1)}`;
                    message_data.phone_number = fetchMember.phone_number;
                    message_data.country_code = fetchMember.country_code;
                    // message_data.phone_number = '7904294094';
                    // message_data.country_code = '+91';
                    message_data.email = fetchMember.email;
                    message_data.type = "SMS";
                    message_data.description = `Hi ${fetchMember.first_name.charAt(0).toUpperCase() + fetchMember.first_name.slice(1)} ${fetchMember.last_name.charAt(0).toUpperCase() + fetchMember.last_name.slice(1)},\nYour Saguaro Bloom test results have been updated. Please visit ${_constants.CLIENT_DOMAIN}login to access your results\nReply STOP to unsubscribe.`;
                    message_data.message_purpose = "SEND RESULT";
                    message_data.email_content = null;
                    _MessageUtils2.default.sendMessage(message_data);

                    let emailContentData = {};
                    // emailContentData.newyork = false
                    emailContentData.link = `${_constants.CLIENT_DOMAIN}`;
                    emailContentData.newyork = false;
                    if (fetchMember.email !== null) {
                        let email_message_data = {};
                        email_message_data.member_token = result.member_token;
                        email_message_data.name = `${fetchMember.first_name.charAt(0).toUpperCase() + fetchMember.first_name.slice(1)} ${fetchMember.last_name.charAt(0).toUpperCase() + fetchMember.last_name.slice(1)}`;
                        email_message_data.phone_number = null;
                        email_message_data.country_code = null;
                        // message_data.phone_number = '7904294094';
                        // message_data.country_code = '+91';
                        email_message_data.email = fetchMember.email;
                        email_message_data.type = "EMAIL";
                        email_message_data.description = `Send Test Result`;
                        email_message_data.message_purpose = "TEST_RESULT";
                        email_message_data.email_content = emailContentData;
                        _MessageUtils2.default.sendMessage(email_message_data);
                    }
                }
            }

            // console.log(`processedTestResultIds --> ${JSON.stringify(processedTestResultIds)}`)
            if (processedTestResultIds.length > 0) {
                await _models2.default.TestResult.update({
                    result_status: 'Result sent',
                    result_date: new Date()
                }, {
                    where: {
                        id: testResultIds
                    }
                });
            }
        }

        res.status(200).json({
            status: 'success',
            payload: [],
            message: 'Test Result sent successfully'
        });
    } catch (error) {
        console.log("Error while sending Test Results POST / :" + error);
        res.status(500).json({
            status: 'failed',
            payload: {},
            message: 'Error while sending Test Results'
        });
    }
};

exports.change_patient = async (req, res, next) => {
    try {
        let { id } = req.params;

        let { member_token, first_name, last_name } = req.body;

        if (member_token === null || member_token === undefined || first_name === null || first_name === undefined || last_name === null || last_name === null) {
            return res.status(200).json({
                status: 'success',
                payload: null,
                message: 'Invalid first name or last name'
            });
        }

        let findTestResult = await _models2.default.TestResult.findOne({
            where: {
                id: id
            }
        });

        if (findTestResult === null) {
            return res.status(200).json({
                status: 'success',
                payload: null,
                message: 'Invalid Test Result'
            });
        }
        let gzippedFirstNameBuffer = gzipSync(first_name.toLowerCase());
        let hashedFirstName = gzippedFirstNameBuffer.toString('base64');

        let gzippedLastNameBuffer = gzipSync(last_name.toLowerCase());
        let hashedLastName = gzippedLastNameBuffer.toString('base64');

        await _models2.default.TestResult.update({
            member_token: member_token,
            first_name: hashedFirstName,
            last_name: hashedLastName
        }, {
            where: {
                id: id
            }
        });

        res.status(200).json({
            status: 'success',
            payload: null,
            message: 'Test Result updated successfully'
        });
    } catch (error) {
        console.log("Error at update Test Result By Id method- PUT / :id" + error);
        res.status(500).json({
            status: 'failed',
            payload: {},
            message: 'Error while updating test result'
        });
    }
};