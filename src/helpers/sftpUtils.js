import Excel from "exceljs";
import { NODE_ENV } from "./constants";
import MessageUtils from "./MessageUtils";
import moment from "moment";
let Client = require('ssh2-sftp-client');
let sftp = new Client();
let path = require('path');
let fs = require('fs');
let FormData = require('form-data');
import { updateCovidTestResult } from "./uploadTestResultHelper";
import db from "../models";
import _ from "underscore";
import Sequelize from "sequelize";
const Op = Sequelize.Op;


let configurationSetting = {
    host: 'sftp.corepoint.one',
    port: '22',
    username: NODE_ENV === 'production' ? 'SaguaroBloom' : 'SaguaroBloom_test',
    password: NODE_ENV === 'production' ? 'wvZs^6gsLSbF#FnYUofwm2jGE5Oz' : '4to$ZKRY5S4^dTukalbTTg686jaj' 
};

module.exports = {
    connectSFTP: () => {
		return new Promise(async (resolve, reject) => {
			// console.log(`configurationSetting ==> ${JSON.stringify(configurationSetting)}`)
			sftp.connect(configurationSetting, 'once').then(() => {
				resolve("success")
			}).catch((err) => {
				console.log(err, 'Connection Failed ');
				sftp.end();
				resolve(null);
			});
		})
	},

	disconnectSFTP: ()=> {
		return new Promise(async (resolve, reject) => {
			await sftp.end();
			resolve("success")
		})
	},

    fetchRemoteFileThroughSFTP: ()=> {
        return new Promise(async (resolve, reject) => {
            const remotePath = `./out`;
            const localePath = path.resolve(__dirname, '../../uploads/TestResultFile.csv');
            sftp.fastGet(remotePath, localePath, {}).then(() => {
				// sftp.delete(remotePath).then(() => {
				// 	sftp.end();
				// 	resolve(localePath)
				// }).catch((err) => {
				// 	console.log(`sftp delete method error====>@${new Date} ${err}`);
				// 	sftp.end();
				// 	resolve(null);
				// })

                // sftp.end();
				resolve(localePath);
			}).catch((err) => {
				console.log(`fetchRemoteFileThroughSFTP error====>@${new Date} ${err}`);
				// sftp.end();
				resolve(null);
			})
        });
    },

	fetchSingleRemoteFileThroughSFTP: (fileName)=> {
        return new Promise(async (resolve, reject) => {
            const remotePath = `./out/${fileName}`;
            const localePath = path.resolve(__dirname, `../../uploads/${fileName}`);
            sftp.fastGet(remotePath, localePath, {}).then(async () => {

				let emailList = [];
				
				// emailList.push('jeevananthamr@kenlasystems.com');
				emailList.push('jared@shsllc.co');
                emailList.push('lukas@shsllc.co');
                emailList.push('selinay@bloomlabs.co');
                emailList.push('lexi@bloomlabs.co');
				emailList.push('jenelle@bloomlabs.co');
				emailList.push('sonila@bloomlabs.co');
				emailList.push('miracle@bloomlabs.co');
				emailList.push('haris@bloomlabs.co');
				emailList.push('nia@bloomlabs.co')
                
				// let data = {};
				// data.fileName = fileName;				
				// data.downloadedAt = moment().format('MM-DD-YYYY hh:mm:ss a');
				// data.environment = NODE_ENV;
				console.log(`LocalPath --> ${localePath}`)
                var form = new FormData();
                form.append('fileName', fileName);
                form.append('downloadedAt', moment().format('MM-DD-YYYY hh:mm:ss a'));
                form.append('environment', NODE_ENV);
                form.append('emailList', JSON.stringify(emailList));
                form.append('file', fs.createReadStream(localePath), fileName)

                await MessageUtils.sendPRLEmailAttachment(form);
				// await send_email_with_attachment('SFTP', emailList, null, data, localePath);

				// sftp.delete(remotePath).then(() => {
				// 	// sftp.end();
				// 	resolve(localePath)
				// }).catch((err) => {
				// 	console.log(`fetchSingleRemoteFileThroughSFTP error====>@${new Date} ${err}`);
				// 	// sftp.end();
				// 	resolve(null);
				// })

                // sftp.end();
				resolve(localePath);
			}).catch((err) => {
				console.log(`fetchSingleRemoteFileThroughSFTP error====>@${new Date} ${err}`);
				// sftp.end();
				resolve(null);
			})
        });
    },

	deleteFileFromSFTP: (fileName)=> {
		return new Promise(async (resolve, reject) => {
			const remotePath = `./out/${fileName}`;
			sftp.delete(remotePath).then(() => {
				// sftp.end();
				resolve("success");
			}).catch((err) => {
				console.log(`deleteFileFromSFTP error====>@${new Date} ${err}`);
				// sftp.end();
				resolve(null);
			})
		});
	},

	downloadDynamicFilesFromSftp: () =>{
		return new Promise(async (resolve, reject) =>{
			try {
				const remotePath = `./out`;
				const files = await sftp.list(remotePath);
				let filterCSVFile = files.filter((currentFile) => currentFile.name.endsWith('.csv'));
				// console.log(`Filter ==> ${JSON.stringify(filterCSVFile)}`);
				let sortFiles = filterCSVFile.sort((a, b) => parseFloat(b.modifyTime) - parseFloat(a.modifyTime));
				resolve(sortFiles)
			} catch (error) {
				console.log('connect method error');
				resolve([]);
			}
		})
	},

	fetchTestResultFromPRL: (fileName)=> {
		return new Promise(async (resolve, reject) =>{
			
			let workbook = new Excel.Workbook();
			console.log(`File name => ${fileName}`);
			await workbook.csv.readFile(path.resolve(__dirname, `../../uploads/${fileName}`)).then(() => {
				let worksheet = workbook.getWorksheet(1);
				let lastRow = worksheet.lastRow;
				let isRejected = false;
				let dataArray = [];

				let tubeNumberColId = 0;
				let resultColId = 0;
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
						dataObj.file_name = fileName;

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
					}
				});

				resolve(dataArray);
			});			
		});
	},

	putPRLFileThroughSFTP: ()=> {
		return new Promise(async (resolve, reject) =>{
			try {
				let data = fs.createReadStream(path.resolve(__dirname, `../../sftpFiles/TestSaguaroBloom-12-23-2021-16-27-07.csv`));
				const remotePath = `./out/TestSaguaroBloom-12-23-2021-20-27-07.csv`;
				await sftp.put(data, remotePath);
				// await sftp.end();
				resolve("success")
			} catch (error) {
				console.log('putPRLFileThroughSFTP method error');
				resolve([]);
			}
		});
	},

	processFilesFromSFTP: ()=> {
		return new Promise(async (resolve, reject) =>{
			try {
				let makeConnection = await module.exports.connectSFTP();
				if(makeConnection !== null){					
					let makeConnectionAndFetchFolder = await module.exports.downloadDynamicFilesFromSftp();
					if(makeConnectionAndFetchFolder.length > 0){
						for(let dynamicFile of makeConnectionAndFetchFolder){
							let isFetched = await module.exports.fetchSingleRemoteFileThroughSFTP(dynamicFile.name);
                            console.log(`isFetched --> ${isFetched}`)
							if(isFetched !== null){
								let testResultArray = await module.exports.fetchTestResultFromPRL(dynamicFile.name);
								// console.log(`Dynamic ==> ${JSON.stringify(dynamicFile)} ==> ${JSON.stringify(testResultArray)}`);
								await module.exports.deleteFileFromSFTP(dynamicFile.name);
								await module.exports.updatePRLReport(testResultArray, dynamicFile.name);
								// console.log(`Dynamic ==> ${JSON.stringify(dynamicFile)} ==> ${JSON.stringify(testResultArray)}`);
								//delete the file
								fs.unlink(path.resolve(__dirname, `../../uploads/${dynamicFile.name}`), (err => {
									if (err) console.log(err);
									else {
										console.log(`\nDeleted file: ${dynamicFile.name}`);
									}
								}));
								console.log(`Finished Processing the file ${dynamicFile.name}`);								
							}else{
								console.log(`Unable to download file ${dynamicFile.name} from SFTP`);
							}							
						}
						await module.exports.disconnectSFTP();
						resolve(`Processed all files in SFTP successfully`);
					}else{
						await module.exports.disconnectSFTP();
						resolve(`No file in SFTP for Processing`);
					}
				}else{
					await module.exports.disconnectSFTP();
					resolve(`Unable to connect SFTP`);
				}
			} catch (error) {
				console.log(`Error at SFTP process ${error}`)
				module.exports.disconnectSFTP();
				resolve(`Getting error while processing files from SFTP. Error => ${error}`);
			}
		});
	},
	updatePRLReport: (test_data, file_name) => {
		return new Promise(async (resolve, reject) =>{
			try {
				if(test_data.length > 0){
					let uploadTestResult = await db.UploadTestResult.create({
						lab_name: "Pandemic Response Lab",
						file_name: file_name,
						uploaded_by: "sftp",
						uploaded_at: new Date()
					});
		
					let fetchTestResults = await db.TestResult.findAll({
						where: {
							result_status: {
								[Op.or]: ["Result unavailable", "Result available"]
							},
							tube_number: {
								[Op.not]: null
							}
						},
						include: [
							{
								model: db.TestType,
								as: 'testResultTestType'
							}
						]
					});
		
					let testResultMap = _.indexBy(fetchTestResults, 'tube_number');

					for (let data of test_data) {
						let fetchResult = testResultMap[data.tube_number]
						if(!!fetchResult){

							let addNewTestUpload = await db.TestUpload.create({
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
							await updateCovidTestResult(fetchResult, data, addNewTestUpload, "Pandemic Response Lab");
						}
					}					
				}
				resolve("success")
			} catch (error) {
				console.log('updatePRLReport method error');
				console.log(error)
				resolve([]);
			}
		});
	}
};