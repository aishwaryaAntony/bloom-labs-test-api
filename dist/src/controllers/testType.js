"use strict";

var _models = require("../models");

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.fetch_all_test_type = async (req, res, next) => {
	try {

		let { offset } = req.query;
		let fetchAllTestTypes = [];
		if (offset !== undefined && offset !== null && offset !== "null" && offset !== "undefined") {
			let limit = 50;
			fetchAllTestTypes = await _models2.default.TestType.findAll({
				limit: limit,
				offset: offset,
				order: [['id', 'DESC']],
				include: [{
					model: _models2.default.LocationTestType,
					as: "testTypeLocations",
					include: [{
						model: _models2.default.Location,
						as: "location"
					}]
				}]
			});
		} else {
			fetchAllTestTypes = await _models2.default.TestType.findAll({
				order: [['id', 'DESC']],
				include: [{
					model: _models2.default.LocationTestType,
					as: "testTypeLocations",
					include: [{
						model: _models2.default.Location,
						as: "location"
					}]
				}]
			});
		}

		res.status(200).json({
			status: 'success',
			payload: fetchAllTestTypes,
			message: 'Test Type fetched successfully'
		});
	} catch (error) {
		console.log("Error at Test Type method- GET / :" + error);
		res.status(500).json({
			status: 'failed',
			payload: {},
			message: 'Error while fetching test type'
		});
	}
};

exports.fetch_test_type_by_id = async (req, res, next) => {
	try {
		let { id } = req.params;

		let findTestType = await _models2.default.TestType.findOne({
			where: {
				id: id
			},
			include: [{
				model: _models2.default.LocationTestType,
				as: "testTypeLocations",
				include: [{
					model: _models2.default.Location,
					as: "location"
				}]
			}]
		});

		if (findTestType === null) {
			return res.status(200).json({
				status: 'success',
				payload: null,
				message: "Test Type doesn't exist"
			});
		}

		res.status(200).json({
			status: 'success',
			payload: findTestType,
			message: 'Test Type fetched successfully'
		});
	} catch (error) {
		console.log("Error at Test Type By Id method- GET / :id " + error);
		res.status(500).json({
			status: 'failed',
			payload: {},
			message: 'Error while fetching test type by id'
		});
	}
};

exports.create_new_test_type = async (req, res, next) => {
	try {
		let { code, lab_code, name, device_id, loinc_code, loinc_description, specimen_site, specimen_date, test_code, test_type_name, description, status, display_name, test_category_id } = req.body;

		let new_test_type = await _models2.default.TestType.create({
			code,
			lab_code,
			name,
			device_id,
			loinc_code,
			loinc_description,
			specimen_site,
			specimen_date,
			test_code,
			test_type_name,
			description,
			display_name,
			test_category_id,
			status
		});

		res.status(200).json({
			status: 'success',
			payload: new_test_type,
			message: 'Test Type created successfully'
		});
	} catch (error) {
		console.log("Error at created new test type method- POST / :" + error);
		res.status(500).json({
			status: 'failed',
			payload: {},
			message: 'Error while creating test type'
		});
	}
};

exports.update_test_type = async (req, res, next) => {
	try {
		let { id } = req.params;

		let { code, lab_code, name, device_id, loinc_code, loinc_description, specimen_site, specimen_date, test_code, test_type_name, description, display_name, status, test_category_id } = req.body;

		let findTestType = await _models2.default.TestType.findOne({
			where: {
				id: id
			}
		});

		if (findTestType === null) {
			return res.status(200).json({
				status: 'success',
				payload: null,
				message: "Test Type doesn't exist"
			});
		}

		await _models2.default.TestType.update({
			code: code !== undefined ? code : findTestType.code,
			lab_code: lab_code !== undefined ? lab_code : findTestType.lab_code,
			name: name !== undefined ? name : findTestType.name,
			device_id: device_id !== undefined ? device_id : findTestType.device_id,
			loinc_code: loinc_code !== undefined ? loinc_code : findTestType.loinc_code,
			loinc_description: loinc_description !== undefined ? loinc_description : findTestType.loinc_description,
			specimen_site: specimen_site !== undefined ? specimen_site : findTestType.specimen_site,
			specimen_date: specimen_date !== undefined ? specimen_date : findTestType.specimen_date,
			test_code: test_code !== undefined ? test_code : findTestType.test_code,
			test_type_name: test_type_name !== undefined ? test_type_name : findTestType.test_type_name,
			description: description !== undefined ? description : findTestType.description,
			display_name: display_name !== undefined ? display_name : findTestType.display_name,
			status: status !== undefined ? status : findTestType.status,
			test_category_id: test_category_id !== undefined ? test_category_id : findTestType.test_category_id
		}, {
			where: {
				id: findTestType.id
			}
		});

		let updatedTestType = await _models2.default.TestType.findOne({
			where: {
				id: findTestType.id
			}
		});

		res.status(200).json({
			status: 'success',
			payload: updatedTestType,
			message: 'Test Type updated successfully'
		});
	} catch (error) {
		console.log("Error at updated Test Type By Id method- PUT / :id" + error);
		res.status(500).json({
			status: 'failed',
			payload: {},
			message: 'Error while updating test type'
		});
	}
};