"use strict";

var _exceljs = require("exceljs");

var _exceljs2 = _interopRequireDefault(_exceljs);

var _constants = require("./constants");

var _attachments = require("./attachments");

var _testResult = require("./testResult");

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

var _models = require("../models");

var _models2 = _interopRequireDefault(_models);

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = require('fs');

const axios = require('axios');


module.exports = {

    read_cab_result_from_excel: (filePath, labName, originalFileName) => {
        return new Promise(async (resolve, reject) => {
            try {
                let workbook = new _exceljs2.default.Workbook();
                await workbook.csv.readFile(filePath);
                let worksheet = workbook.getWorksheet(1);
                let lastRow = worksheet.lastRow;
                let isRejected = false;
                let dataArray = [];
                // let tubeNumberColId = 0;
                // let resultColId = 0;

                worksheet.eachRow({ includeEmpty: true }, async (row, rowNumber) => {
                    if (rowNumber > 1) {
                        if ((row.getCell(3).value === "" || row.getCell(3).value === null || !!row.getCell(3).value && (row.getCell(3).value.toLowerCase().trim() === 'pass' || row.getCell(3).value.toLowerCase().trim() === 'fail')) && !!row.getCell(5).value) {
                            console.log(`${row.getCell(5).value}`);
                            let dataObj = {};
                            dataObj.id = rowNumber;
                            dataObj.tube_number = row.getCell(5).value;
                            dataObj.file_name = originalFileName;
                            if (row.getCell(7).value === 'Flu A') {
                                dataObj.code = 'FLUA';
                            } else if (row.getCell(7).value === 'Flu B') {
                                dataObj.code = 'FLUB';
                            } else if (row.getCell(7).value === 'COVID-19') {
                                dataObj.code = 'COVID19';
                            } else {
                                dataObj.code = 'MS2';
                            }
                            // dataObj.code = row.getCell(7).value === '' ;
                            if (!!row.getCell(8).value && row.getCell(8).value.toLowerCase().indexOf('negative') > -1) {
                                dataObj.result = "Negative";
                            } else if (!!row.getCell(8).value && row.getCell(8).value.toLowerCase().indexOf('positive') > -1) {
                                dataObj.result = "Positive";
                            }
                            if (row.getCell(5).value !== null && row.getCell(5).value !== "" && dataObj.tube_number !== null && dataObj.result !== null) {
                                dataArray.push(dataObj);
                            }
                        }
                        console.log("dataArray============>" + JSON.stringify(dataArray));
                        if (row === lastRow) {
                            if (!isRejected === true) {
                                fs.unlink(filePath, err => {
                                    if (err) return console.log(err);
                                    console.log('file deleted successfully');
                                });
                            }
                        }
                    }
                });

                let processedDataArray = [];
                let groupedData = _underscore2.default.groupBy(dataArray, 'tube_number');

                for (const key in groupedData) {
                    let constructDataObj = {};
                    constructDataObj.tube_number = key;
                    constructDataObj.file_name = originalFileName;

                    let resultObj = {};
                    for (let data of groupedData[key]) {
                        resultObj[data.code] = data.result;
                    }
                    constructDataObj.result_value = resultObj;
                    processedDataArray.push(constructDataObj);
                }

                // console.log(`Pr --> ${JSON.stringify(processedDataArray)}`);
                resolve(processedDataArray);
            } catch (error) {
                console.log("error=========>" + error);
                reject(null);
            }
        });
    },
    updateCovidTestResult: (testResult, data, testUpload) => {
        return new Promise(async (resolve, reject) => {
            try {
                const { result_value } = data;
                console.log(`Data ---> ${JSON.stringify(data)}`);
                console.log(`Step 1`);
                if (!!result_value && Object.keys(result_value).length > 0) {
                    let ff = await _models2.default.TestResultValue.findAll({});
                    // console.log(`ff --> ${JSON.stringify(ff)}`)
                    // console.log(`Step 2`)
                    let fetchTestResultValue = await _models2.default.TestResultValue.findOne({
                        where: {
                            test_result_id: testResult.id
                        }
                    });
                    // console.log(`Step 2`)

                    let qrImage = null;
                    let constructQRCodeObj = {};
                    if (testResult.member_token !== null) {
                        let fetchUserDetail = await (0, _testResult.fetchMemberDetails)(testResult.member_token);
                        constructQRCodeObj.id = fetchUserDetail.member_token;
                        constructQRCodeObj.name = `${fetchUserDetail.first_name} ${fetchUserDetail.last_name !== null ? fetchUserDetail.last_name : ''}`;
                        constructQRCodeObj.firstName = fetchUserDetail.first_name;
                        constructQRCodeObj.lastName = fetchUserDetail.last_name;
                        constructQRCodeObj.gender = fetchUserDetail.gender !== null ? fetchUserDetail.gender : '';
                        constructQRCodeObj.birthDate = `${fetchUserDetail.birth_date !== null ? (0, _moment2.default)(fetchUserDetail.birth_date, 'YYYY-MM-DD').format('YYYY-MM-DD') : (0, _moment2.default)().format('YYYY-MM-DD')}`;
                        constructQRCodeObj.passportNumber = fetchUserDetail.passport_number !== null ? fetchUserDetail.passport_number : '';

                        constructQRCodeObj.effectiveDateTime = `${(0, _moment2.default)().utc().format('YYYY-MM-DD\THH:mm:ss')}+00:00`;
                        constructQRCodeObj.patientRef = fetchUserDetail.member_token;
                        constructQRCodeObj.test = testResult.test_type_name;
                        constructQRCodeObj.result = result_value['COVID19'] !== undefined && result_value['COVID19'] !== null ? result_value['COVID19'] : "";
                    }

                    // console.log(`Step 3`)
                    let findTestValueType = await _models2.default.TestValueType.findAll({
                        where: {
                            test_type_id: testResult.test_type_id
                        }
                    });

                    let resultObj = {};
                    for (let valueType of findTestValueType) {
                        resultObj[valueType.code] = result_value[valueType.code];
                    }

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
                            if (testResult.common_pass_qr_code !== null) {
                                await (0, _attachments.deleteDocument)(testResult.common_pass_qr_code, _constants.S3_USER_BUCKET_NAME);
                            }
                            qrImage = await (0, _attachments.uploadBase64Image)(base64QRCode.base64, _constants.S3_USER_BUCKET_NAME);
                        }

                        currentQR = qrImage !== null ? qrImage : testResult.common_pass_qr_code;
                    } else {
                        if (testResult.common_pass_qr_code !== null) {
                            await (0, _attachments.deleteDocument)(testResult.common_pass_qr_code, _constants.S3_USER_BUCKET_NAME);
                        }
                        currentQR = null;
                    }

                    let fetchTestCategory = await _models2.default.TestCategory.findOne({
                        where: {
                            id: testResult.testResultTestType.test_category_id
                        }
                    });

                    let testCategoryRef = fetchTestCategory !== null ? fetchTestCategory.id : null;
                    // console.log(`Step 4`)
                    if (fetchTestResultValue === null) {
                        await _models2.default.TestResultValue.create({
                            result_value: resultObj,
                            result_type: 'JSON',
                            test_category_ref: testCategoryRef,
                            result: !!resultObj["COVID19"] ? resultObj["COVID19"] : null,
                            test_result_id: testResult.id,
                            status: "ACTIVE"
                        });
                    } else {
                        // console.log(`Result Obj --> ${JSON.stringify(resultObj)}`)
                        await _models2.default.TestResultValue.update({
                            result_value: resultObj,
                            test_category_ref: testCategoryRef,
                            result: !!resultObj["COVID19"] ? resultObj["COVID19"] : null
                        }, {
                            where: {
                                test_result_id: testResult.id
                            }
                        });
                    }

                    // console.log(`Step 5`)
                    await _models2.default.TestResult.update({
                        result_date: currentDate,
                        common_pass_qr_code: currentQR,
                        result_status: 'Result available'
                    }, {
                        where: {
                            id: testResult.id
                        }
                    });

                    console.log(`Step 6`);
                    await _models2.default.TestUpload.update({
                        test_result_id: testResult.id,
                        description: null,
                        status: "SUCCESS"
                    }, {
                        where: {
                            id: testUpload.id
                        }
                    });
                    // resolve("success");
                }

                console.log(`Step 7`);
                resolve('success');
            } catch (error) {
                console.log("update test result error==========>" + error);
                reject(error);
            }
        });
    },
    updateCabTestResult: (testResult, data, testUpload) => {
        return new Promise(async (resolve, reject) => {
            try {
                const { result_value } = data;
                if (!!result_value && Object.keys(result_value).length > 0) {
                    let ff = await _models2.default.TestResultValue.findAll({});
                    let fetchTestResultValue = await _models2.default.TestResultValue.findOne({
                        where: {
                            test_result_id: testResult.id
                        }
                    });
                    // console.log(`Step 2`)

                    let qrImage = null;
                    let constructQRCodeObj = {};
                    if (testResult.member_token !== null) {
                        let fetchUserDetail = await (0, _testResult.fetchMemberDetails)(testResult.member_token);
                        constructQRCodeObj.id = fetchUserDetail.member_token;
                        constructQRCodeObj.name = `${fetchUserDetail.first_name} ${fetchUserDetail.last_name !== null ? fetchUserDetail.last_name : ''}`;
                        constructQRCodeObj.firstName = fetchUserDetail.first_name;
                        constructQRCodeObj.lastName = fetchUserDetail.last_name;
                        constructQRCodeObj.gender = fetchUserDetail.gender !== null ? fetchUserDetail.gender : '';
                        constructQRCodeObj.birthDate = `${fetchUserDetail.birth_date !== null ? (0, _moment2.default)(fetchUserDetail.birth_date, 'YYYY-MM-DD').format('YYYY-MM-DD') : (0, _moment2.default)().format('YYYY-MM-DD')}`;
                        constructQRCodeObj.passportNumber = fetchUserDetail.passport_number !== null ? fetchUserDetail.passport_number : '';

                        constructQRCodeObj.effectiveDateTime = `${(0, _moment2.default)().utc().format('YYYY-MM-DD\THH:mm:ss')}+00:00`;
                        constructQRCodeObj.patientRef = fetchUserDetail.member_token;
                        constructQRCodeObj.test = testResult.test_type_name;
                        constructQRCodeObj.result = result_value['COVID19'] !== undefined && result_value['COVID19'] !== null ? result_value['COVID19'] : "";
                    }

                    // console.log(`Step 3`)
                    let findTestValueType = await _models2.default.TestValueType.findAll({
                        where: {
                            test_type_id: testResult.test_type_id
                        }
                    });

                    let resultObj = {};
                    for (let valueType of findTestValueType) {
                        resultObj[valueType.code] = result_value[valueType.code];
                    }

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
                            if (testResult.common_pass_qr_code !== null) {
                                await (0, _attachments.deleteDocument)(testResult.common_pass_qr_code, _constants.S3_USER_BUCKET_NAME);
                            }
                            qrImage = await (0, _attachments.uploadBase64Image)(base64QRCode.base64, _constants.S3_USER_BUCKET_NAME);
                        }

                        currentQR = qrImage !== null ? qrImage : testResult.common_pass_qr_code;
                    } else {
                        if (testResult.common_pass_qr_code !== null) {
                            await (0, _attachments.deleteDocument)(testResult.common_pass_qr_code, _constants.S3_USER_BUCKET_NAME);
                        }
                        currentQR = null;
                    }

                    let fetchTestCategory = await _models2.default.TestCategory.findOne({
                        where: {
                            id: testResult.testResultTestType.test_category_id
                        }
                    });

                    let testCategoryRef = fetchTestCategory !== null ? fetchTestCategory.id : null;
                    // console.log(`Step 4`)
                    if (fetchTestResultValue === null) {
                        await _models2.default.TestResultValue.create({
                            result_value: resultObj,
                            result_type: 'JSON',
                            test_category_ref: testCategoryRef,
                            result: !!resultObj["COVID19"] ? resultObj["COVID19"] : null,
                            test_result_id: testResult.id,
                            status: "ACTIVE"
                        });
                    } else {
                        // console.log(`Result Obj --> ${JSON.stringify(resultObj)}`)
                        await _models2.default.TestResultValue.update({
                            result_value: resultObj,
                            test_category_ref: testCategoryRef,
                            result: !!resultObj["COVID19"] ? resultObj["COVID19"] : null
                        }, {
                            where: {
                                test_result_id: testResult.id
                            }
                        });
                    }

                    // console.log(`Step 5`)
                    await _models2.default.TestResult.update({
                        result_date: currentDate,
                        common_pass_qr_code: currentQR,
                        result_status: 'Result available'
                    }, {
                        where: {
                            id: testResult.id
                        }
                    });

                    console.log(`Step 6`);
                    await _models2.default.TestUpload.update({
                        test_result_id: testResult.id,
                        description: null,
                        status: "SUCCESS"
                    }, {
                        where: {
                            id: testUpload.id
                        }
                    });
                    // resolve("success");
                }

                console.log(`Step 7`);
                resolve('success');
            } catch (error) {
                console.log("update test result error==========>" + error);
                reject(error);
            }
        });
    }
};