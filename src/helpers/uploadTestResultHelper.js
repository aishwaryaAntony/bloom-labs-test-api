import Excel from "exceljs";
var fs = require('fs');
import { ACCOUNT_API_DOMAIN, FHIR_API_END_POINT, S3_USER_BUCKET_NAME } from "./constants";
import { deleteDocument, uploadBase64Image } from "./attachments";
import { fetchMemberDetails, createQRCode } from "./testResult";
import moment from "moment";
const axios = require('axios');
import db from "../models";
import _ from "underscore";

module.exports = {

    read_cab_result_from_excel: (filePath, labName, originalFileName) => {
        return new Promise(async (resolve, reject) => {
            try {
                let workbook = new Excel.Workbook();
                await workbook.csv.readFile(filePath);
                let worksheet = workbook.getWorksheet(1);
                let lastRow = worksheet.lastRow;
                let isRejected = false;
                let dataArray = [];
                // let tubeNumberColId = 0;
                // let resultColId = 0;

                worksheet.eachRow({ includeEmpty: true }, async (row, rowNumber) => {
                    if (rowNumber > 1) {
                        if ((row.getCell(3).value === "" || row.getCell(3).value === null || (!!row.getCell(3).value && (row.getCell(3).value.toLowerCase().trim() === 'pass' || row.getCell(3).value.toLowerCase().trim() === 'fail'))) && !!row.getCell(5).value) {
                            console.log(`${row.getCell(5).value}`)
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
                                dataObj.result = "Positive"
                            } else if (!!row.getCell(8).value && row.getCell(8).value.toLowerCase().indexOf('inconclusive') > -1) {
                                dataObj.result = "Inconclusive"
                            }
                            if (row.getCell(5).value !== null && row.getCell(5).value !== "" && dataObj.tube_number !== null && dataObj.result !== null) {
                                dataArray.push(dataObj);
                            }
                        }
                        console.log("dataArray============>" + JSON.stringify(dataArray))
                        if (row === lastRow) {
                            if (!isRejected === true) {
                                fs.unlink(filePath, (err) => {
                                    if (err) return console.log(err);
                                    console.log('file deleted successfully');
                                });
                            }
                        }
                    }
                });

                let processedDataArray = [];
                let groupedData = _.groupBy(dataArray, 'tube_number')

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
                console.log("error=========>" + error)
                reject(null);
            }
        });
    },

    read_allergy_result_from_excel: (filePath, labName, originalFileName) => {
        return new Promise(async (resolve, reject) => {
            try {
                console.log(`Enters -->`)
                let workbook = new Excel.Workbook();
                await workbook.csv.readFile(filePath);
                let worksheet = workbook.getWorksheet(1);
                let lastRow = worksheet.lastRow;
                let isRejected = false;
                let dataArray = [];

                let constructAlgObj = {};
                let resultObj = {};
                worksheet.eachRow({ includeEmpty: true }, async (row, rowNumber) => {
                    // console.log(`${row.getCell(1).value} -- ${row.getCell(1).value.match(/strip [0-9]/i)}`)
                    switch (row.getCell(1).value) {
                        case String(row.getCell(1).value.match(/strip [0-9]/i)):
                            if (Object.keys(constructAlgObj).length > 0) {
                                if (Object.keys(resultObj).length > 0) {
                                    constructAlgObj.result_value = resultObj;
                                    dataArray.push(constructAlgObj);
                                }
                            }

                            constructAlgObj = {};
                            resultObj = {};
                            let fetchRow = worksheet.getRow((rowNumber + 2));
                            // console.log(`Value --> ${(row.getCell(1).value)} ---> ${rowNumber} ---> ${fetchRow.getCell(1).value}`)
                            constructAlgObj.tube_number = fetchRow.getCell(1).value;
                            constructAlgObj.file_name = originalFileName;
                            break;
                        case "m6":
                            resultObj.m6 = row.getCell(3).value;
                            break;
                        case "m3":
                            resultObj.m3 = row.getCell(3).value;
                            break;
                        case "m2":
                            resultObj.m2 = row.getCell(3).value;
                            break;
                        case "m1":
                            resultObj.m1 = row.getCell(3).value;
                            break;
                        case "i6":
                            resultObj.i6 = row.getCell(3).value;
                            break;
                        case "d2":
                            resultObj.d2 = row.getCell(3).value;
                            break;
                        case "d1":
                            resultObj.d1 = row.getCell(3).value;
                            break;
                        case "e72":
                            resultObj.e72 = row.getCell(3).value;
                            break;
                        case "e5":
                            resultObj.e5 = row.getCell(3).value;
                            break;
                        case "e1":
                            resultObj.e1 = row.getCell(3).value;
                            break;
                        case "w103":
                            resultObj.w103 = row.getCell(3).value;
                            break;
                        case "w100":
                            resultObj.w100 = row.getCell(3).value;
                            break;
                        case "w43":
                            resultObj.w43 = row.getCell(3).value;
                            break;
                        case "w14":
                            resultObj.w14 = row.getCell(3).value;
                            break;
                        case "w11":
                            resultObj.w11 = row.getCell(3).value;
                            break;
                        case "w10":
                            resultObj.w10 = row.getCell(3).value;
                            break;
                        case "w9":
                            resultObj.w9 = row.getCell(3).value;
                            break;
                        case "w6":
                            resultObj.w6 = row.getCell(3).value;
                            break;
                        case "w1":
                            resultObj.w1 = row.getCell(3).value;
                            break;
                        case "t70":
                            resultObj.t70 = row.getCell(3).value;
                            break;
                        case "t19":
                            resultObj.t19 = row.getCell(3).value;
                            break;
                        case "t16":
                            resultObj.t16 = row.getCell(3).value;
                            break;
                        case "t15":
                            resultObj.t15 = row.getCell(3).value;
                            break;
                        case "t14":
                            resultObj.t14 = row.getCell(3).value;
                            break;
                        case "t12":
                            resultObj.t12 = row.getCell(3).value;
                            break;
                        case "t11":
                            resultObj.t11 = row.getCell(3).value;
                            break;
                        case "t10":
                            resultObj.t10 = row.getCell(3).value;
                            break;
                        case "t9":
                            resultObj.t9 = row.getCell(3).value;
                            break;
                        case "t8":
                            resultObj.t8 = row.getCell(3).value;
                            break;
                        case "t7":
                            resultObj.t7 = row.getCell(3).value;
                            break;
                        case "t5":
                            resultObj.t5 = row.getCell(3).value;
                            break;
                        case "t3":
                            resultObj.t3 = row.getCell(3).value;
                            break;
                        case "t1":
                            resultObj.t1 = row.getCell(3).value;
                            break;
                        case "g10":
                            resultObj.g10 = row.getCell(3).value;
                            break;
                        case "g8":
                            resultObj.g8 = row.getCell(3).value;
                            break;
                        case "g6":
                            resultObj.g6 = row.getCell(3).value;
                            break;
                        case "g5":
                            resultObj.g5 = row.getCell(3).value;
                            break;
                        case "g3":
                            resultObj.g3 = row.getCell(3).value;
                            break;
                        case "g2":
                            resultObj.g2 = row.getCell(3).value;
                            break;
                        case "g1":
                            resultObj.g1 = row.getCell(3).value;
                            break;
                        default:
                            break;
                    }
                });

                if (Object.keys(constructAlgObj).length > 0) {
                    if (Object.keys(resultObj).length > 0) {
                        constructAlgObj.result_value = resultObj;
                        dataArray.push(constructAlgObj);
                    }
                }

                resolve(dataArray);

            } catch (error) {
                console.log("error=========>" + error)
                reject(null);
            }
        });
    },
    updateCovidTestResult: (testResult, data, testUpload, lab_name) => {
        return new Promise(async (resolve, reject) => {
            try {
                const { result_value } = data;
                console.log(`Data ---> ${JSON.stringify(data)}`)
                console.log(`Step 1`)
                if (!!result_value && Object.keys(result_value).length > 0) {
                    let ff = await db.TestResultValue.findAll({});
                    // console.log(`ff --> ${JSON.stringify(ff)}`)
                    // console.log(`Step 2`)
                    let fetchTestResultValue = await db.TestResultValue.findOne({
                        where: {
                            test_result_id: testResult.id
                        }
                    });
                    // console.log(`Step 2`)

                    let qrImage = null;
                    let constructQRCodeObj = {};
                    if (testResult.member_token !== null) {
                        let fetchUserDetail = await fetchMemberDetails(testResult.member_token);
                        constructQRCodeObj.id = fetchUserDetail.member_token;
                        constructQRCodeObj.name = `${fetchUserDetail.first_name} ${fetchUserDetail.last_name !== null ? fetchUserDetail.last_name : ''}`;
                        constructQRCodeObj.firstName = fetchUserDetail.first_name;
                        constructQRCodeObj.lastName = fetchUserDetail.last_name;
                        constructQRCodeObj.gender = fetchUserDetail.gender !== null ? fetchUserDetail.gender : '';
                        constructQRCodeObj.birthDate = `${fetchUserDetail.birth_date !== null ? moment(fetchUserDetail.birth_date, 'YYYY-MM-DD').format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')}`;
                        constructQRCodeObj.passportNumber = fetchUserDetail.passport_number !== null ? fetchUserDetail.passport_number : '';

                        constructQRCodeObj.effectiveDateTime = `${moment().utc().format('YYYY-MM-DD\THH:mm:ss')}+00:00`;
                        constructQRCodeObj.patientRef = fetchUserDetail.member_token;
                        constructQRCodeObj.test = testResult.test_type_name;
                        constructQRCodeObj.result = result_value['COVID19'] !== undefined && result_value['COVID19'] !== null ? result_value['COVID19'] : "";
                    }

                    // console.log(`Step 3`)
                    let findTestValueType = await db.TestValueType.findAll({
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
                        constructQRCodeObj.effectiveDateTime = `${moment(currentDate).utc().format('YYYY-MM-DD\THH:mm:ss')}+00:00`;
                    }

                    let currentQR = null;
                    let currentTestResult = result_value['COVID19'] !== undefined && result_value['COVID19'] !== null ? result_value['COVID19'] : ""
                    if (!!currentTestResult && currentTestResult !== "Inconclusive") {
                        let base64QRCode = await createQRCode(constructQRCodeObj);

                        if (qrImage === null && base64QRCode.status === 'success') {
                            if (testResult.common_pass_qr_code !== null) {
                                await deleteDocument(testResult.common_pass_qr_code, S3_USER_BUCKET_NAME)
                            }
                            qrImage = await uploadBase64Image(base64QRCode.base64, S3_USER_BUCKET_NAME);
                        }

                        currentQR = qrImage !== null ? qrImage : testResult.common_pass_qr_code;
                    } else {
                        if (testResult.common_pass_qr_code !== null) {
                            await deleteDocument(testResult.common_pass_qr_code, S3_USER_BUCKET_NAME)
                        }
                        currentQR = null;
                    }

                    let fetchTestCategory = await db.TestCategory.findOne({
                        where: {
                            id: testResult.testResultTestType.test_category_id
                        }
                    });

                    let testCategoryRef = fetchTestCategory !== null ? fetchTestCategory.id : null;
                    // console.log(`Step 4`)
                    if (fetchTestResultValue === null) {
                        await db.TestResultValue.create({
                            result_value: resultObj,
                            result_type: 'JSON',
                            test_category_ref: testCategoryRef,
                            result: !!resultObj["COVID19"] ? resultObj["COVID19"] : null,
                            test_result_id: testResult.id,
                            status: "ACTIVE"
                        });
                    } else {
                        // console.log(`Result Obj --> ${JSON.stringify(resultObj)}`)
                        await db.TestResultValue.update({
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
                    if (fetchTestCategory.code === "CAB") {
                        let checkResult = Object.values(resultObj).find(x => x === "Inconclusive")
                        await db.TestResult.update({
                            result_date: currentDate,
                            common_pass_qr_code: currentQR,
                            tested_lab_name: lab_name,
                            result_status: !!checkResult ? "Result unavailable" : 'Result available'
                        }, {
                            where: {
                                id: testResult.id
                            }
                        });
                    } else {
                        await db.TestResult.update({
                            result_date: currentDate,
                            common_pass_qr_code: currentQR,
                            tested_lab_name: lab_name,
                            result_status: resultObj["COVID19"] === "Inconclusive" ? "Result unavailable" : 'Result available'
                        }, {
                            where: {
                                id: testResult.id
                            }
                        });
                    }

                    console.log(`Step 6`)
                    await db.TestUpload.update({
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

                console.log(`Step 7`)
                resolve('success')

            } catch (error) {
                console.log("update test result error==========>" + error)
                reject(error);
            }
        });
    },
    updateCabTestResult: (testResult, data, testUpload) => {
        return new Promise(async (resolve, reject) => {
            try {
                const { result_value } = data;
                if (!!result_value && Object.keys(result_value).length > 0) {
                    let ff = await db.TestResultValue.findAll({});
                    let fetchTestResultValue = await db.TestResultValue.findOne({
                        where: {
                            test_result_id: testResult.id
                        }
                    });
                    // console.log(`Step 2`)

                    let qrImage = null;
                    let constructQRCodeObj = {};
                    if (testResult.member_token !== null) {
                        let fetchUserDetail = await fetchMemberDetails(testResult.member_token);
                        constructQRCodeObj.id = fetchUserDetail.member_token;
                        constructQRCodeObj.name = `${fetchUserDetail.first_name} ${fetchUserDetail.last_name !== null ? fetchUserDetail.last_name : ''}`;
                        constructQRCodeObj.firstName = fetchUserDetail.first_name;
                        constructQRCodeObj.lastName = fetchUserDetail.last_name;
                        constructQRCodeObj.gender = fetchUserDetail.gender !== null ? fetchUserDetail.gender : '';
                        constructQRCodeObj.birthDate = `${fetchUserDetail.birth_date !== null ? moment(fetchUserDetail.birth_date, 'YYYY-MM-DD').format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')}`;
                        constructQRCodeObj.passportNumber = fetchUserDetail.passport_number !== null ? fetchUserDetail.passport_number : '';

                        constructQRCodeObj.effectiveDateTime = `${moment().utc().format('YYYY-MM-DD\THH:mm:ss')}+00:00`;
                        constructQRCodeObj.patientRef = fetchUserDetail.member_token;
                        constructQRCodeObj.test = testResult.test_type_name;
                        constructQRCodeObj.result = result_value['COVID19'] !== undefined && result_value['COVID19'] !== null ? result_value['COVID19'] : "";
                    }

                    // console.log(`Step 3`)
                    let findTestValueType = await db.TestValueType.findAll({
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
                        constructQRCodeObj.effectiveDateTime = `${moment(currentDate).utc().format('YYYY-MM-DD\THH:mm:ss')}+00:00`;
                    }

                    let currentQR = null;
                    let currentTestResult = result_value['COVID19'] !== undefined && result_value['COVID19'] !== null ? result_value['COVID19'] : ""
                    if (!!currentTestResult && currentTestResult !== "Inconclusive") {
                        let base64QRCode = await createQRCode(constructQRCodeObj);

                        if (qrImage === null && base64QRCode.status === 'success') {
                            if (testResult.common_pass_qr_code !== null) {
                                await deleteDocument(testResult.common_pass_qr_code, S3_USER_BUCKET_NAME)
                            }
                            qrImage = await uploadBase64Image(base64QRCode.base64, S3_USER_BUCKET_NAME);
                        }

                        currentQR = qrImage !== null ? qrImage : testResult.common_pass_qr_code;
                    } else {
                        if (testResult.common_pass_qr_code !== null) {
                            await deleteDocument(testResult.common_pass_qr_code, S3_USER_BUCKET_NAME)
                        }
                        currentQR = null;
                    }

                    let fetchTestCategory = await db.TestCategory.findOne({
                        where: {
                            id: testResult.testResultTestType.test_category_id
                        }
                    });

                    let testCategoryRef = fetchTestCategory !== null ? fetchTestCategory.id : null;
                    // console.log(`Step 4`)
                    if (fetchTestResultValue === null) {
                        await db.TestResultValue.create({
                            result_value: resultObj,
                            result_type: 'JSON',
                            test_category_ref: testCategoryRef,
                            result: !!resultObj["COVID19"] ? resultObj["COVID19"] : null,
                            test_result_id: testResult.id,
                            status: "ACTIVE"
                        });
                    } else {
                        // console.log(`Result Obj --> ${JSON.stringify(resultObj)}`)
                        await db.TestResultValue.update({
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
                    await db.TestResult.update({
                        result_date: currentDate,
                        common_pass_qr_code: currentQR,
                        result_status: resultObj["COVID19"] === "Inconclusive" ? "Result unavailable" : 'Result available'
                    }, {
                        where: {
                            id: testResult.id
                        }
                    });

                    console.log(`Step 6`)
                    await db.TestUpload.update({
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

                console.log(`Step 7`)
                resolve('success')

            } catch (error) {
                console.log("update test result error==========>" + error)
                reject(error);
            }
        });
    },
}