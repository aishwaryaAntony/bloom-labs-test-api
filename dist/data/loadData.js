"use strict";

var _exceljs = require("exceljs");

var _exceljs2 = _interopRequireDefault(_exceljs);

var _models = require("../src/models");

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Parse command line arguments using yargs
var argv = require("yargs").command("master", "Load DB", function (yargs) {}).help("help").argv;
var command = argv._[0];


const loadMasterTable = filename => {
	return new Promise(async (resolve, reject) => {
		try {
			let workbook = new _exceljs2.default.Workbook();
			console.log("File name => " + filename);
			await workbook.xlsx.readFile(filename);
			console.log("\n**********Master tables started loading**********\n");
			await loadLocations(workbook);
			console.log("\u2714 location data loaded \u2705 \n");
			await loadTestCategories(workbook);
			console.log("\u2714 Test Category data loaded \u2705 \n");
			await loadTestTypes(workbook);
			console.log("\u2714 test types data loaded \u2705 \n");
			await loadTestSubTypes(workbook);
			console.log("\u2714 test sub types data loaded \u2705 \n");
			await loadLocationTestTypes(workbook);
			console.log("\u2714 location test types data loaded \u2705 \n");
			await loadTestValueTypes(workbook);
			console.log("\u2714 test value types data loaded \u2705 \n");
			await loadTestValueEnums(workbook);
			console.log("\u2714 test value enums data loaded \u2705 \n");
			await loadPhysicians(workbook);
			console.log("\u2714 physician data loaded \u2705 \n");
			console.log("\n**********Master tables loaded successfully**********\n");
			resolve("Success");
		} catch (error) {
			console.log("\u274c Error ==> " + error);
			reject(error);
		}
	});
};

const loadTestCategories = workbook => {
	return new Promise((resolve, reject) => {
		let worksheet = workbook.getWorksheet("TestCategories");
		let lastRow = worksheet.lastRow;
		let isRejected = false;
		let testCategoryArray = [];

		try {
			worksheet.eachRow({ includeEmpty: true }, async (row, rowNumber) => {
				if (rowNumber > 1) {
					let testCategoryObj = {};
					testCategoryObj.code = row.getCell(1).value;
					testCategoryObj.short_code = row.getCell(2).value;
					testCategoryObj.name = row.getCell(3).value;

					testCategoryObj.description = row.getCell(4).value;
					testCategoryObj.sequence_number = row.getCell(5).value;
					testCategoryObj.status = row.getCell(6).value;

					testCategoryArray.push(testCategoryObj);

					if (row === lastRow) {
						if (!isRejected === true) {

							for (let testCategory of testCategoryArray) {
								const { name, code, short_code, description, sequence_number, status } = testCategory;
								try {
									if (code !== null) {
										await _models2.default.TestCategory.create({
											name,
											code,
											short_code,
											description,
											sequence_number,
											status: status
										});
									}
								} catch (error) {
									console.log(`\nError at TestCategory ==> ${error}`);
								}
							}
							resolve("TestCategory table loaded successfully");
						}
					}
				}
			});
		} catch (error) {
			console.log("\u274c Error ==> " + error);
			resolve(error);
		}
	});
};

const loadLocations = workbook => {
	return new Promise((resolve, reject) => {
		let worksheet = workbook.getWorksheet("Locations");
		let lastRow = worksheet.lastRow;
		let isRejected = false;
		let locationArray = [];

		try {
			worksheet.eachRow({ includeEmpty: true }, async (row, rowNumber) => {
				if (rowNumber > 1) {
					let locationObj = {};
					locationObj.lab_code = row.getCell(1).value;
					locationObj.code = row.getCell(2).value;
					locationObj.name = row.getCell(3).value;
					locationObj.street_address_line1 = row.getCell(4).value;
					locationObj.street_address_line2 = row.getCell(5).value;
					locationObj.city = row.getCell(6).value;
					locationObj.state = row.getCell(7).value;
					locationObj.country = row.getCell(8).value;
					locationObj.zipcode = row.getCell(9).value;
					locationObj.phone_number = row.getCell(10).value;
					locationObj.acuity_ref = row.getCell(11).value;
					locationObj.timezone = row.getCell(12).value;
					locationObj.clia = row.getCell(13).value;
					locationObj.branding = row.getCell(14).value;
					locationObj.display_name = row.getCell(15).value;
					locationObj.lab_name = row.getCell(16).value;

					locationArray.push(locationObj);

					if (row === lastRow) {
						if (!isRejected === true) {

							for (let location of locationArray) {
								const { name, code, acuity_ref, lab_code, timezone, lab_name, branding, display_name, street_address_line1, street_address_line2, city, state, country, zipcode, phone_number, clia } = location;
								try {
									if (lab_code !== null) {
										await _models2.default.Location.create({
											display_name,
											lab_code,
											lab_name,
											name,
											code,
											street_address_line1,
											street_address_line2,
											city,
											state,
											country,
											zipcode,
											phone_number,
											acuity_ref,
											timezone,
											branding,
											clia,
											status: "ACTIVE"
										});
									}
								} catch (error) {
									console.log(`\nError at Location ==> ${error}`);
								}
							}
							resolve("Location table loaded successfully");
						}
					}
				}
			});
		} catch (error) {
			console.log("\u274c Error ==> " + error);
			resolve(error);
		}
	});
};

const loadTestTypes = workbook => {
	return new Promise((resolve, reject) => {
		let worksheet = workbook.getWorksheet("TestTypes");
		let lastRow = worksheet.lastRow;
		let isRejected = false;
		let testTypeArray = [];

		try {
			worksheet.eachRow({ includeEmpty: true }, async (row, rowNumber) => {
				if (rowNumber > 1) {
					let testTypeObj = {};
					testTypeObj.code = row.getCell(1).value;
					testTypeObj.name = row.getCell(2).value;
					testTypeObj.description = row.getCell(3).value;
					testTypeObj.lab_code = row.getCell(4).value;
					testTypeObj.category_code = row.getCell(5).value;
					testTypeObj.device_id = row.getCell(6).value;
					testTypeObj.loinc_code = row.getCell(7).value;
					testTypeObj.loinc_description = row.getCell(8).value;
					testTypeObj.specimen_site = row.getCell(9).value;
					testTypeObj.display_name = row.getCell(10).value;
					testTypeArray.push(testTypeObj);

					if (row === lastRow) {
						if (!isRejected === true) {
							for (let testType of testTypeArray) {
								const { name, code, description, lab_code, category_code, device_id, loinc_code, loinc_description, specimen_site, display_name } = testType;
								let testCategory = await _models2.default.TestCategory.findOne({
									where: {
										short_code: category_code
									}
								});
								try {
									if (testCategory !== null) {
										await _models2.default.TestType.create({
											test_category_id: testCategory.id,
											lab_code,
											name,
											code,
											description: description.toString(),
											device_id,
											loinc_code,
											loinc_description,
											specimen_site,
											display_name,
											status: "ACTIVE"
										});
									}
								} catch (error) {
									console.log(`\nError at Test Type ==> ${error}`);
								}
							}
							resolve("Test Type table loaded successfully");
						}
					}
				}
			});
		} catch (error) {
			console.log("\u274c Error ==> " + error);
			resolve(error);
		}
	});
};

const loadTestSubTypes = workbook => {
	return new Promise((resolve, reject) => {
		let worksheet = workbook.getWorksheet("TestSubTypes");
		let lastRow = worksheet.lastRow;
		let isRejected = false;
		let testSubTypeArray = [];

		try {
			worksheet.eachRow({ includeEmpty: true }, async (row, rowNumber) => {
				if (rowNumber > 1) {
					let testSubTypeObj = {};
					testSubTypeObj.test_type_code = row.getCell(1).value;
					testSubTypeObj.name = row.getCell(2).value;
					testSubTypeObj.description = row.getCell(3).value;
					testSubTypeArray.push(testSubTypeObj);

					if (row === lastRow) {
						if (!isRejected === true) {
							for (let testSub of testSubTypeArray) {
								const { test_type_code, name, description } = testSub;
								try {
									let findTestType = await _models2.default.TestType.findOne({
										where: {
											code: test_type_code
										}
									});
									if (findTestType !== null) {
										await _models2.default.TestSubType.create({
											test_type_id: findTestType.id,
											name,
											description,
											status: "ACTIVE"
										});
									}
								} catch (error) {
									console.log(`\nError at Test Sub Type ==> ${error}`);
								}
							}
							resolve("Test Sub Type table loaded successfully");
						}
					}
				}
			});
		} catch (error) {
			console.log("\u274c Error ==> " + error);
			resolve(error);
		}
	});
};

const loadLocationTestTypes = workbook => {
	return new Promise((resolve, reject) => {
		let worksheet = workbook.getWorksheet("LocationTestTypes");
		let lastRow = worksheet.lastRow;
		let isRejected = false;
		let locationTestArray = [];

		try {
			worksheet.eachRow({ includeEmpty: true }, async (row, rowNumber) => {
				if (rowNumber > 1) {
					let locationTestObj = {};
					locationTestObj.location_code = row.getCell(1).value;
					locationTestObj.test_type_code = row.getCell(2).value;
					locationTestObj.display_name = row.getCell(3).value;
					locationTestObj.price = row.getCell(4).value;
					locationTestObj.is_paid_type = row.getCell(5).value;
					locationTestObj.is_insurance_test = row.getCell(6).value;
					locationTestObj.status = row.getCell(7).value;
					locationTestObj.acuity_ref = row.getCell(8).value;
					locationTestObj.rank_order = row.getCell(9).value;
					locationTestArray.push(locationTestObj);

					if (row === lastRow) {
						if (!isRejected === true) {
							for (let locationTestType of locationTestArray) {
								const { location_code, test_type_code, display_name, price, is_paid_type, is_insurance_test, status, acuity_ref, rank_order } = locationTestType;
								try {
									let findTestType = await _models2.default.TestType.findOne({
										where: {
											code: test_type_code
										}
									});
									let findLocation = await _models2.default.Location.findOne({
										where: {
											code: location_code
										}
									});
									if (findTestType !== null && findLocation !== null) {
										await _models2.default.LocationTestType.create({
											test_type_id: findTestType.id,
											location_id: findLocation.id,
											display_name,
											price,
											is_paid_type,
											is_insurance_test,
											rank_order,
											qr_code: `${location_code}-${test_type_code}`,
											status,
											acuity_ref
										});
									}
								} catch (error) {
									console.log(`\nError at Test Sub Type ==> ${error}`);
								}
							}
							resolve("Test Sub Type table loaded successfully");
						}
					}
				}
			});
		} catch (error) {
			console.log("\u274c Error ==> " + error);
			resolve(error);
		}
	});
};

const loadTestValueTypes = workbook => {
	return new Promise((resolve, reject) => {
		let worksheet = workbook.getWorksheet("TestValueTypes");
		let lastRow = worksheet.lastRow;
		let isRejected = false;
		let testValueTypeArray = [];

		try {
			worksheet.eachRow({ includeEmpty: true }, async (row, rowNumber) => {
				if (rowNumber > 1) {
					let testValueTypeObj = {};
					testValueTypeObj.test_type_code = row.getCell(1).value;
					testValueTypeObj.value_type = row.getCell(2).value;
					testValueTypeObj.min = row.getCell(3).value;
					testValueTypeObj.max = row.getCell(4).value;
					testValueTypeObj.code = row.getCell(5).value;
					testValueTypeObj.display_name = row.getCell(6).value;
					testValueTypeArray.push(testValueTypeObj);

					if (row === lastRow) {
						if (!isRejected === true) {
							// console.log("testValueTypeArray========>" + JSON.stringify(testValueTypeArray))
							for (let testValue of testValueTypeArray) {
								const { value_type, test_type_code, min, max, code, display_name } = testValue;
								try {
									let findTestType = await _models2.default.TestType.findOne({
										where: {
											code: test_type_code
										}
									});
									if (findTestType !== null) {
										await _models2.default.TestValueType.create({
											test_type_id: findTestType.id,
											value_type,
											code,
											display_name,
											min,
											max,
											status: "Active"
										});
									}
								} catch (error) {
									console.log(`\nError at Test Value Types ==> ${error}`);
								}
							}
							resolve("Test Value Types table loaded successfully");
						}
					}
				}
			});
		} catch (error) {
			console.log("\u274c Error ==> " + error);
			resolve(error);
		}
	});
};

const loadTestValueEnums = workbook => {
	return new Promise((resolve, reject) => {
		let worksheet = workbook.getWorksheet("TestValueEnums");
		let lastRow = worksheet.lastRow;
		let isRejected = false;
		let testValueEnumArray = [];

		try {
			worksheet.eachRow({ includeEmpty: true }, async (row, rowNumber) => {
				if (rowNumber > 1) {
					let testValueEnumObj = {};
					testValueEnumObj.test_type_code = row.getCell(1).value;
					testValueEnumObj.value_type = row.getCell(2).value;
					testValueEnumObj.value = row.getCell(3).value;
					testValueEnumObj.code = row.getCell(4).value;
					testValueEnumArray.push(testValueEnumObj);

					if (row === lastRow) {
						if (!isRejected === true) {
							for (let testEnum of testValueEnumArray) {
								const { value_type, test_type_code, value, code } = testEnum;
								try {
									let findTestType = await _models2.default.TestType.findOne({
										where: {
											code: test_type_code
										}
									});
									if (findTestType !== null) {
										let findTestValueType = await _models2.default.TestValueType.findOne({
											where: {
												test_type_id: findTestType.id,
												value_type: value_type,
												code: code
											}
										});
										if (findTestValueType !== null) {
											await _models2.default.TestValueEnum.create({
												test_value_type_id: findTestValueType.id,
												value,
												status: "Active"
											});
										}
									}
								} catch (error) {
									console.log(`\nError at Test Value Enum ==> ${error}`);
								}
							}
							resolve("Test Value Enum table loaded successfully");
						}
					}
				}
			});
		} catch (error) {
			console.log("\u274c Error ==> " + error);
			resolve(error);
		}
	});
};

const loadPhysicians = workbook => {
	return new Promise((resolve, reject) => {
		let worksheet = workbook.getWorksheet("Physicians");
		let lastRow = worksheet.lastRow;
		let isRejected = false;
		let physicianArray = [];

		try {
			worksheet.eachRow({ includeEmpty: true }, async (row, rowNumber) => {
				if (rowNumber > 1) {
					let physicianObj = {};
					physicianObj.lab_code = row.getCell(1).value;
					physicianObj.name = row.getCell(2).value;
					physicianObj.npi_number = row.getCell(3).value;
					physicianArray.push(physicianObj);

					if (row === lastRow) {
						if (!isRejected === true) {
							for (let physician of physicianArray) {
								const { lab_code, name, npi_number } = physician;
								await _models2.default.Physician.create({
									lab_code,
									name,
									npi_number,
									is_default: true,
									status: "ACTIVE"
								});
							}
							resolve("Physician table loaded successfully");
						}
					}
				}
			});
		} catch (error) {
			resolve(error);
			console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!===> " + error);
		}
	});
};

if (command === "master") {
	try {
		console.log("Loading data from " + argv._[1]);
		if (argv._[1] !== undefined && argv._[1] !== "") {
			loadMasterTable(argv._[1]).then(result => {
				process.exit();
			});
		}
	} catch (error) {
		console.log("error=================>" + error);
	}
}