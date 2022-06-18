import db from "../models";

exports.fetch_test_sub_type_by_test_type_id = async (req, res, next) => {
	try {
		let { id } = req.params;

		let findTestSubType = await db.TestSubType.findAll({
			where: {
				test_type_id: id
			}
		});
		res.status(200).json({
			status: 'success',
			payload: findTestSubType,
			message: 'Test Sub Type fetched successfully'
		});

	} catch (error) {
		console.log("Error at Test Sub Type By Id method- GET / :id " + error);
		res.status(500).json({
			status: 'failed',
			payload: {},
			message: 'Error while fetching test sub type by id'
		});
	}
};

exports.create_test_sub_type = async (req, res, next) => {
	try {
		let { name, test_type_id, description, status } = req.body;
		
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

		let createTestSubType = await db.TestSubType.create({
			name,
			test_type_id,
			description,
			status
		});
		res.status(200).json({
			status: 'success',
			payload: createTestSubType,
			message: 'Test Sub Type created successfully'
		});

	} catch (error) {
		console.log("Error at Creating Test Sub Type method- POST / " + error);
		res.status(500).json({
			status: 'failed',
			payload: {},
			message: 'Error while Creating test sub type'
		});
	}
};


exports.update_test_sub_type = async (req, res, next) => {
	try {
		let { name, test_type_id, description, status } = req.body;
		let { id } = req.params;


		let findTestSubType = await db.TestSubType.findOne({
			where: {
				id: id
			}
		});

		if (findTestSubType == null) {
			res.status(200).json({
				status: 'failed',
				payload: null,
				message: 'Test Sub Type dost not exist'
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

		let updateTestSubType = await db.TestSubType.update({
			name: name !== undefined ? name : findTestSubType.name,
			test_type_id: test_type_id !== undefined ? test_type_id : findTestSubType.test_type_id,
			description: description !== undefined ? description : findTestSubType.description,
			status: status !== undefined ? status : findTestSubType.status
		}, {
			where: {
				id: findTestSubType.id
			}
		});

		res.status(200).json({
			status: 'success',
			payload: updateTestSubType,
			message: 'Test Sub Type updated successfully'
		});

	} catch (error) {
		console.log("Error at updating Test Sub Type method- PUT / :id " + error);
		res.status(500).json({
			status: 'failed',
			payload: {},
			message: 'Error while updating test sub type'
		});
	}
};