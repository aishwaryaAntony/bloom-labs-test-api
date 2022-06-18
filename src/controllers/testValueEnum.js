import db from "../models";

exports.fetch_all_test_value_enum = async (req, res, next) => {
    try {
        let fetchAllTestValueEnum = await db.TestValueEnum.findAll({});

        res.status(200).json({
            status: 'success',
            payload: fetchAllTestValueEnum,
            message: 'Test Value Enum fetched successfully'
        });

    } catch (error) {
        console.log("Error at Test Value Enum method- GET / :" + error);
        res.status(500).json({
            status: 'failed',
            payload: {},
            message: 'Error while fetching test value enums'
        });
    }
};

exports.fetch_test_value_enum_by_id = async (req, res, next) => {
    try {
        let { id } = req.params;

        let findTestValueEnum = await db.TestValueEnum.findOne({
            where: {
                id: id
            }
        });

        if (findTestValueEnum === null) {
            return res.status(200).json({
                status: 'success',
                payload: null,
                message: 'Invalid Test Value Enum'
            });
        }

        res.status(200).json({
            status: 'success',
            payload: findTestValueEnum,
            message: 'Test Value Enum fetched successfully'
        });

    } catch (error) {
        console.log("Error at Test Value Enum By Id method- GET / :id" + error);
        res.status(500).json({
            status: 'failed',
            payload: {},
            message: 'Error while fetching test Value enum by id'
        });
    }
};

exports.create_new_test_value_enum = async (req, res, next) => {
    try {
        let { test_value_type_id, value, status } = req.body;

        let findTestValueType = await db.TestValueType.findOne({
            where: {
                id: test_value_type_id
            }
        });

        if (findTestValueType === null) {
            return res.status(200).json({
                status: 'success',
                payload: null,
                message: 'Invalid test value type'
            });
        }


        let newTestValueEnum = await db.TestValueEnum.create({
            test_value_type_id,
            value,
            status
        });

        res.status(200).json({
            status: 'success',
            payload: newTestValueEnum,
            message: 'Test Value Enum created successfully'
        });

    } catch (error) {
        console.log("Error at created new test value enum method- POST / :" + error);
        res.status(500).json({
            status: 'failed',
            payload: {},
            message: 'Error while creating test value enum'
        });
    }
};

exports.update_test_value_enum = async (req, res, next) => {
    try {
        let { id } = req.params;

        let { test_value_type_id, name, value, status } = req.body;

        let findTestValueEnum = await db.TestValueEnum.findOne({
            where: {
                id: id
            }
        });

        if (findTestValueEnum === null) {
            return res.status(200).json({
                status: 'success',
                payload: null,
                message: 'Invalid Test Value Enum'
            });
        }

        let findTestValueType = await db.TestValueType.findOne({
            where: {
                id: test_value_type_id
            }
        });

        if (findTestValueType === null) {
            return res.status(200).json({
                status: 'success',
                payload: null,
                message: 'Invalid test value type'
            });
        }


        await db.TestValueEnum.update({
            test_value_type_id: test_value_type_id !== undefined ? test_value_type_id : findTestValueEnum.test_value_type_id,
            value: value !== undefined ? value : findTestValueEnum.value,
            status: status !== undefined ? status : findTestValueEnum.status
        }, {
            where: {
                id: findTestValueEnum.id
            }
        });

        let updatedTestValueEnum = await db.TestValueEnum.findOne({
            where: {
                id: findTestValueEnum.id
            }
        });

        res.status(200).json({
            status: 'success',
            payload: updatedTestValueEnum,
            message: 'Test Value Enum fetched successfully'
        });

    } catch (error) {
        console.log("Error at updated Test Value Enum By Id method- PUT / :id" + error);
        res.status(500).json({
            status: 'failed',
            payload: {},
            message: 'Error while updating test value enum'
        });
    }
};