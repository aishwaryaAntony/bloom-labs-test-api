import db from "../models";

exports.fetch_all_test_value_type = async (req, res, next) => {
	try {
		let fetchAllTestValueType = await db.TestValueType.findAll({
			include:[
				{
					model: db.TestValueEnum,
					as: "testValueEnum"
				}
			]
		});

		res.status(200).json({
			status: 'success',
			payload: fetchAllTestValueType,
			message: 'Test Value Type fetched successfully'
		});

	} catch (error) {
		console.log("Error at Test Value Type method- GET / :" + error);
		res.status(500).json({
			status: 'failed',
			payload: {},
			message: 'Error while fetching test value types'
		});
	}
};

exports.fetch_test_value_type_by_id = async (req, res, next) => {
	try {
		let { id } = req.params;

		let findTestValueType = await db.TestValueType.findOne({
			where: {
				id: id
			},
			include:[
				{
					model: db.TestValueEnum,
					as: "testValueEnum"
				}
			]
		});

		if (findTestValueType === null) {
			return res.status(200).json({
				status: 'success',
				payload: null,
				message: 'Invalid Test Value Type'
			});
		}

		res.status(200).json({
			status: 'success',
			payload: findTestValueType,
			message: 'Test Value Type fetched successfully'
		});

	} catch (error) {
		console.log("Error at Test Value Type By Id method- GET / :id" + error);
		res.status(500).json({
			status: 'failed',
			payload: {},
			message: 'Error while fetching test Value type by id'
		});
	}
};

exports.create_new_test_value_type = async (req, res, next) => {
	try {
		let { test_type_id, display_name, value_type, min, max, unit, status,code } = req.body;

		let findTestType = await db.TestType.findOne({
			where: {
				id: test_type_id
			}
		});

		if (findTestType === null) {
			return res.status(200).json({
				status: 'success',
				payload: null,
				message: 'Invalid Test Type'
			});
		}


		let newTestValueType = await db.TestValueType.create({
			test_type_id,
			code,
			display_name,
			value_type,
			min,
			max,
			unit,
			status
		});

		let findTestValueType = await db.TestValueType.findOne({
			where: {
				id: newTestValueType.id
			},
			include:[
				{
					model: db.TestValueEnum,
					as: "testValueEnum"
				}
			]
		});

		res.status(200).json({
			status: 'success',
			payload: findTestValueType,
			message: 'Test Value Type created successfully'
		});

	} catch (error) {
		console.log("Error at created new test value type method- POST / :" + error);
		res.status(500).json({
			status: 'failed',
			payload: {},
			message: 'Error while creating test value type'
		});
	}
};

exports.update_test_value_type = async (req, res, next) => {
	try {
		let { id } = req.params;

		let { test_type_id, display_name, value_type, min, max,unit, status,code } = req.body;

		let findTestValueType = await db.TestValueType.findOne({
			where: {
				id: id
			}
		});

		if (findTestValueType === null) {
			return res.status(200).json({
				status: 'success',
				payload: null,
				message: 'Invalid Test Value Type'
			});
		}

		let findTestType = await db.TestType.findOne({
			where: {
				id: test_type_id
			}
		});

		if (findTestType === null) {
			return res.status(200).json({
				status: 'success',
				payload: null,
				message: 'Invalid Test Type'
			});
		}


		await db.TestValueType.update({
			test_type_id: test_type_id !== undefined ? test_type_id : findTestValueType.test_type_id,
			code: code !== undefined ? code : findTestValueType.code,
			display_name: display_name !== undefined ? display_name : findTestValueType.display_name,
			value_type: value_type !== undefined ? value_type : findTestValueType.value_type,
			min: min !== undefined ? min : findTestValueType.min,
			max: max !== undefined ? max : findTestValueType.max,
			unit: unit !== undefined ? unit: findTestValueType.unit,
			status: status !== undefined ? status : findTestValueType.status
		}, {
			where: {
				id: findTestValueType.id
			}
		});


		let updatedTestValueType = await db.TestValueType.findOne({
			where: {
				id: findTestValueType.id
			},
			include:[
				{
					model: db.TestValueEnum,
					as: "testValueEnum"
				}
			]
		});

		res.status(200).json({
			status: 'success',
			payload: updatedTestValueType,
			message: 'Test Value Type fetched successfully'
		});

	} catch (error) {
		console.log("Error at updated Test Value Type By Id method- PUT / :id" + error);
		res.status(500).json({
			status: 'failed',
			payload: {},
			message: 'Error while updating test value type'
		});
	}
};