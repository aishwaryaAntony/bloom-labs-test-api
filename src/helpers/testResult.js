
import Excel from "exceljs";
var fs = require('fs');
import { ACCOUNT_API_DOMAIN, FHIR_API_END_POINT, S3_USER_BUCKET_NAME } from "./constants";
import { deleteDocument, uploadBase64Image } from "./attachments";
import moment from "moment";
const axios = require('axios');


module.exports = {
    /**
     * update test result when data inserted in upload test result table
     * @function
     */
    updateTestResult: (testUpload, sequelize) => {
        return new Promise(async (resolve, reject) => {
            try {
                let { id, tube_number, result, result_value } = testUpload;

                let findTestResult = await sequelize.models.TestResult.findOne({
                    where: {
                        tube_number: tube_number
                    },
                    include: [
                        {
                            model: sequelize.models.TestType,
                            as: 'testResultTestType'
                        }
                    ]
                });
                console.log("findTestResult========>" + JSON.stringify(findTestResult))
                if (findTestResult === null) {
                    await sequelize.models.TestUpload.update({
                        description: "Invalid test tube number",
                        status: "FAILED"
                    }, {
                        where: {
                            id: id
                        }
                    });

                    return resolve("failed");
                }

                if (findTestResult.result_status === "Result available") {
                    await sequelize.models.TestUpload.update({
                        test_result_id: findTestResult.id,
                        description: "Result already available for this tubeNumber",
                        status: "FAILED"
                    }, {
                        where: {
                            id: id
                        }
                    });
                    console.log(`Resolved here`)
                    return resolve("failed");
                }

                if (!!result_value && Object.keys(result_value).length > 0) {
                    let fetchTestResultValue = await sequelize.models.TestResultValue.findOne({
                        where: {
                            test_result_id: findTestResult.id
                        }
                    });
        
                    let qrImage = null;
                    let constructQRCodeObj = {};
                    if (findTestResult.member_token !== null) {
                        let fetchUserDetail = await module.exports.fetchMemberDetails(findTestResult.member_token);    
        
                        constructQRCodeObj.id = fetchUserDetail.member_token;
                        constructQRCodeObj.name = `${fetchUserDetail.first_name} ${fetchUserDetail.last_name !== null ? fetchUserDetail.last_name : ''}`;
                        constructQRCodeObj.firstName = fetchUserDetail.first_name;
                        constructQRCodeObj.lastName = fetchUserDetail.last_name;
                        constructQRCodeObj.gender = fetchUserDetail.gender !== null ? fetchUserDetail.gender : '';
                        constructQRCodeObj.birthDate = `${fetchUserDetail.birth_date !== null ? moment(fetchUserDetail.birth_date, 'YYYY-MM-DD').format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')}`;
                        constructQRCodeObj.passportNumber = fetchUserDetail.passport_number !== null ? fetchUserDetail.passport_number : '';
        
                        constructQRCodeObj.effectiveDateTime = `${moment().utc().format('YYYY-MM-DD\THH:mm:ss')}+00:00`;
                        constructQRCodeObj.patientRef = fetchUserDetail.member_token;
                        // constructQRCodeObj.test = findTestResult.test_type_name;
                        constructQRCodeObj.test = findTestResult.test_type_name;
                        constructQRCodeObj.result = result_value['COVID19'] !== undefined && result_value['COVID19'] !== null ? result_value['COVID19'] : "";
                    }
        
                    let findTestValueType = await sequelize.models.TestValueType.findAll({
                        where: {
                            test_type_id: findTestResult.test_type_id
                        }
                    });
        
                    let resultObj = {};            
                    for (let valueType of findTestValueType) {
                        resultObj[valueType.code] = result_value[valueType.code];
                    }

                    let currentDate = null;
                    if(!Object.values(result_value).includes(null)){
                        currentDate = new Date();
                        constructQRCodeObj.effectiveDateTime = `${moment(currentDate).utc().format('YYYY-MM-DD\THH:mm:ss')}+00:00`;
                    }

                    let currentQR = null;
                    let currentTestResult = result_value['COVID19'] !== undefined && result_value['COVID19'] !== null ? result_value['COVID19'] : ""
                    if(!!currentTestResult && currentTestResult !== "Inconclusive"){
                        let base64QRCode = await module.exports.createQRCode(constructQRCodeObj);

                        if (qrImage === null && base64QRCode.status === 'success') {
                            if(findTestResult.common_pass_qr_code !== null){
                                await deleteDocument(findTestResult.common_pass_qr_code, S3_USER_BUCKET_NAME)
                            }
                            qrImage = await uploadBase64Image(base64QRCode.base64, S3_USER_BUCKET_NAME);
                        }
                        
                        currentQR = qrImage !== null ? qrImage : findTestResult.common_pass_qr_code;
                    }else{
                        if(findTestResult.common_pass_qr_code !== null){
                            await deleteDocument(findTestResult.common_pass_qr_code, S3_USER_BUCKET_NAME)
                        }
                        currentQR = null;
                    }

                    let fetchTestCategory = await sequelize.models.TestCategory.findOne({
                        where: {
                            id: findTestResult.testResultTestType.test_category_id
                        }
                    });

                    let testCategoryRef = fetchTestCategory !== null ? fetchTestCategory.id : null;

                    if(fetchTestResultValue === null){
                        await sequelize.models.TestResultValue.create({
                            result_value: resultObj,
                            result_type: 'JSON',
                            test_category_ref: testCategoryRef,
                            result: !!resultObj["COVID19"] ? resultObj["COVID19"] : null,
                            test_result_id: findTestResult.id,
                            status: "ACTIVE"
                        });
                    }else{
                        console.log(`Result Obj --> ${JSON.stringify(resultObj)}`)
                        await sequelize.models.TestResultValue.update({
                            result_value: resultObj,
                            test_category_ref: testCategoryRef,
                            result: !!resultObj["COVID19"] ? resultObj["COVID19"] : null
                        }, {
                            where: {
                                test_result_id: findTestResult.id
                            }
                        });
                    }

                    await sequelize.models.TestResult.update({
                        result_date: currentDate,
                        common_pass_qr_code: currentQR,
                        result_status: 'Result available'
                    }, {
                        where: {
                            id: findTestResult.id
                        }
                    });
                }
                
                /*
                // console.log(`Continued`)
                if (result !== undefined && result !== null && result !== "") {
                    let fetchTestResultValues = await sequelize.models.TestResultValue.findAll({
                        where: {
                            test_result_id: findTestResult.id
                        }
                    });

                    let qrImage = null;
                    let constructQRCodeObj = {};
                    if (findTestResult.member_token !== null) {
                        let fetchUserDetail = await module.exports.fetchMemberDetails(findTestResult.member_token);        
        
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
                        constructQRCodeObj.test = findTestResult.test_type_name;
                        constructQRCodeObj.result = result;
                    }

                    if(fetchTestResultValues.length === 0){
                        let findTestValueType = await sequelize.models.TestValueType.findAll({
                            where: {
                                test_type_id: findTestResult.test_type_id
                            }
                        });

                        if (findTestValueType.length > 0) {
                            for (let valueType of findTestValueType) {
                                await sequelize.models.TestResultValue.create({
                                    result_value: result,
                                    result_type: "STRING",
                                    test_result_id: findTestResult.id,
                                    test_value_type_id: valueType.id,
                                    status: "ACTIVE"
                                });
    
                                let currentDate = new Date();
                                constructQRCodeObj.effectiveDateTime = `${moment(currentDate).utc().format('YYYY-MM-DD\THH:mm:ss')}+00:00`;
                                
                                let currentQR = null;
                                if(result !== "Inconclusive"){
                                    let base64QRCode = await module.exports.createQRCode(constructQRCodeObj);
    
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
    
                                await sequelize.models.TestResult.update({
                                    result_date: new Date(),
                                    result_status: "Result available",
                                    common_pass_qr_code: currentQR
                                }, {
                                    where: {
                                        id: findTestResult.id
                                    }
                                });
    
                            }
                        }
                    }
                }
                */

                await sequelize.models.TestUpload.update({
                    test_result_id: findTestResult.id,
                    description: null,
                    status: "SUCCESS"
                }, {
                    where: {
                        id: id
                    }
                });

                resolve("success");
            } catch (error) {
                console.log("update test result error==========>" + error)
                await sequelize.models.TestUpload.update({
                    description: JSON.stringify(error),
                    status: "FAILED"
                }, {
                    where: {
                        id: testUpload.id
                    }
                })
                reject(error);
            }
        });
    },
    read_from_excel: (filePath, labName, originalFileName) => {
        return new Promise(async (resolve, reject) => {
            try {
                let workbook = new Excel.Workbook();
                await workbook.csv.readFile(filePath);
                let worksheet = workbook.getWorksheet(1);
                let lastRow = worksheet.lastRow;
                let isRejected = false;
                let dataArray = [];
                let tubeNumberColId = 0;
                let resultColId = 0;

                switch (labName) {
                    case "Saguaro Bloom":
                        worksheet.eachRow({ includeEmpty: true }, async (row, rowNumber) => {
                            if (rowNumber > 1) {
                                let dataObj = {};
                                dataObj.tube_number = row.getCell(4).value;
                                // dataObj.result = row.getCell(5).value;
                                dataObj.file_name = originalFileName;

                                /*
                                if (row.getCell(5).value !== null && row.getCell(5).value !== "" && row.getCell(5).value.toLowerCase().trim() === 'positive') {
                                    dataObj.result = 'Positive';
                                } else if (row.getCell(5).value !== null && row.getCell(5).value !== "" && (row.getCell(5).value.toLowerCase().trim() === 'negative')) {
                                    dataObj.result = 'Negative';
                                } else if (row.getCell(5).value !== null && row.getCell(5).value !== "" && (row.getCell(5).value.toLowerCase().trim() === 'undetermined')) {
                                    dataObj.result = 'Inconclusive';
                                } else {
                                    dataObj.result = 'Inconclusive';
                                }
                                */

                                if (row.getCell(6).value !== null && row.getCell(6).value !== "" && (row.getCell(6).value.toLowerCase().indexOf('positive') > -1)) {
                                    dataObj.result = 'Positive';
                                } else if (row.getCell(6).value !== null && row.getCell(6).value !== "" && (row.getCell(6).value.toLowerCase().indexOf('negative') > -1)) {
                                    dataObj.result = 'Negative';
                                } else if (row.getCell(6).value !== null && row.getCell(6).value !== "" && (row.getCell(6).value.toLowerCase().indexOf('undetermined') > -1)) {
                                    dataObj.result = 'Inconclusive';
                                } else {
                                    dataObj.result = 'Inconclusive';
                                }

                                if (row.getCell(3).value !== null && row.getCell(3).value !== "" && (row.getCell(3).value.toLowerCase().trim() === 'pass' || row.getCell(3).value.toLowerCase().trim() === 'fail') && dataObj.tube_number !== null && dataObj.result !== null) {
                                    dataObj.result_value = {
                                        "COVID19": dataObj.result
                                    }
                                    
                                    dataArray.push(dataObj);
                                }
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
                        break;
                    case "Pandemic Response Lab":
                        worksheet.getRow(1).eachCell((cell, colNumber) => {
                            if (cell.text === 'Requisition#') {
                                tubeNumberColId = colNumber;
                            }

                            if (cell.text === 'Result') {
                                resultColId = colNumber;
                            }
                        });
                        worksheet.eachRow({ includeEmpty: true }, async (row, rowNumber) => {
                            if (rowNumber > 1) {
                                let dataObj = {};
                                dataObj.tube_number = row.getCell(tubeNumberColId).value;
                                dataObj.file_name = originalFileName;

                                if (row.getCell(resultColId).value !== null && row.getCell(resultColId).value !== "" && row.getCell(resultColId).value.toLowerCase().trim() === 'detected') {
                                    dataObj.result = 'Positive';
                                } else if (row.getCell(resultColId).value !== null && row.getCell(resultColId).value !== "" && (row.getCell(resultColId).value.toLowerCase().trim() === 'notdetected' || row.getCell(resultColId).value.toLowerCase().trim() === 'not detected')) {
                                    dataObj.result = 'Negative';
                                } else if (row.getCell(resultColId).value !== null && row.getCell(resultColId).value !== "" && (row.getCell(resultColId).value.toLowerCase().trim() === 'inconclusive')) {
                                    dataObj.result = 'Inconclusive';
                                } else {
                                    dataObj.result = 'Inconclusive';
                                }

                                if ((dataObj.tube_number !== null) && (dataObj.result !== null)) {
                                    dataObj.result_value = {
                                        "COVID19": dataObj.result
                                    }
                                    dataArray.push(dataObj);
                                }
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
                        break;
                    case "Prorenata Labs":
                        worksheet.getRow(1).eachCell((cell, colNumber) => {
                            if (cell.text === 'Barcode') {
                                tubeNumberColId = colNumber;
                            }

                            if (cell.text === 'Result') {
                                resultColId = colNumber;
                            }
                        });
                        worksheet.eachRow({ includeEmpty: true }, async (row, rowNumber) => {
                            if (rowNumber > 1) {
                                let dataObj = {};
                                dataObj.tube_number = row.getCell(tubeNumberColId).value;
                                dataObj.file_name = originalFileName;

                                if (row.getCell(resultColId).value !== null && row.getCell(resultColId).value !== "" && row.getCell(resultColId).value.toLowerCase().trim() === 'p') {
                                    dataObj.result = 'Positive';
                                } else {
                                    dataObj.result = 'Negative';
                                }

                                if ((dataObj.tube_number !== null) && (dataObj.result !== null)) {
                                    dataObj.result_value = {
                                        "COVID19": dataObj.result
                                    }
                                    dataArray.push(dataObj);
                                }
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
                        break;
                    default:
                        break;
                }
                resolve(dataArray);
            } catch (error) {
                console.log("error=========>" + error)
                reject(null);
            }
        })
    },
    fetchMemberDetails: (memberToken) => {
        return new Promise(async (resolve, reject) => {
            try {
                axios.get(`${ACCOUNT_API_DOMAIN}members/member-token/${memberToken}`).then(resp => {

                    // console.log(resp.data);
                    resolve(resp.data.payload);
                }).catch((e) => {
                    console.log(`Error -- ${e}`)
                    resolve(null);
                });
            } catch (error) {
                console.log(`Error Catch --> ${error}`)
                resolve(null);
            }
        });
    },
    createQRCode: (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                axios.post(`${FHIR_API_END_POINT}generate-qr`, data).then(resp => {

                    // console.log(resp.data);
                    resolve(resp.data);
                }).catch((e) => {
                    console.log(`Error -- ${e}`)
                    resolve(null);
                });
            } catch (error) {
                console.log(`Error Catch --> ${error}`)
                resolve(null);
            }
        });
    },    
}

