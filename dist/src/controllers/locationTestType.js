"use strict";

var _models = require("../models");

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.fetch_all_location_test_type = async (req, res, next) => {
    try {
        let fetchAllLocationTestType = await _models2.default.LocationTestType.findAll({
            include: [{
                model: _models2.default.Location,
                as: "location"
            }, {
                model: _models2.default.TestType,
                as: "testType"
            }]
        });

        res.status(200).json({
            status: 'success',
            payload: fetchAllLocationTestType,
            message: 'Location Test Type fetched successfully'
        });
    } catch (error) {
        console.log("Error at Location Test Type method- GET / :" + error);
        res.status(500).json({
            status: 'failed',
            payload: {},
            message: 'Error while location test type'
        });
    }
};

exports.fetch_location_test_type_by_id = async (req, res, next) => {
    try {
        let { id } = req.params;

        let findLocationTestType = await _models2.default.LocationTestType.findOne({
            where: {
                id: id
            },
            include: [{
                model: _models2.default.TestType,
                as: "testType",
                include: [{
                    model: _models2.default.TestValueType,
                    as: "testValueTypes",
                    required: false,
                    include: [{
                        model: _models2.default.TestValueEnum,
                        as: 'testValueEnum'
                    }]
                }]
            }]
        });

        if (findLocationTestType === null) {
            return res.status(200).json({
                status: 'success',
                payload: null,
                message: 'Invalid Location Test Type'
            });
        }

        res.status(200).json({
            status: 'success',
            payload: findLocationTestType,
            message: 'Location Test Type fetched successfully'
        });
    } catch (error) {
        console.log("Error at Location Test Type By Id method- GET / :" + error);
        res.status(500).json({
            status: 'failed',
            payload: {},
            message: 'Error while location test type'
        });
    }
};

exports.create_new_location_test_type = async (req, res, next) => {
    try {
        let { test_type_id, location_id, bill_type, description, price, is_paid_type, is_insurance_test, acuity_ref, rank_order, display_name, salesforce_id } = req.body;

        let findTestType = await _models2.default.TestType.findOne({
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

        let findLocation = await _models2.default.Location.findOne({
            where: {
                id: location_id
            }
        });

        if (findLocation === null) {
            return res.status(200).json({
                status: 'success',
                payload: null,
                message: 'Invalid Location'
            });
        }

        let new_location_test_type = await _models2.default.LocationTestType.create({
            test_type_id,
            location_id,
            bill_type,
            description,
            price,
            is_paid_type,
            is_insurance_test,
            acuity_ref,
            rank_order,
            display_name,
            salesforce_id,
            qr_code: `${findLocation.code}-${findTestType.code}`,
            status: "ACTIVE"
        });

        res.status(200).json({
            status: 'success',
            payload: new_location_test_type,
            message: 'Location Test Type created successfully'
        });
    } catch (error) {
        console.log("Error at created new location test type method- GET / :" + error);
        res.status(500).json({
            status: 'failed',
            payload: {},
            message: 'Error while location test type'
        });
    }
};

exports.update_location_test_type = async (req, res, next) => {
    try {
        let { id } = req.params;

        let { test_type_id, location_id, bill_type, description, price, is_paid_type, is_insurance_test, acuity_ref, status, rank_order, display_name, salesforce_id } = req.body;

        let findLocationTestType = await _models2.default.LocationTestType.findOne({
            where: {
                id: id
            }
        });

        if (findLocationTestType === null) {
            return res.status(200).json({
                status: 'success',
                payload: null,
                message: 'Invalid Location Test Type'
            });
        }

        let findTestType = await _models2.default.TestType.findOne({
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

        let findLocation = await _models2.default.Location.findOne({
            where: {
                id: location_id
            }
        });

        if (findLocation === null) {
            return res.status(200).json({
                status: 'success',
                payload: null,
                message: 'Invalid Location'
            });
        }

        await _models2.default.LocationTestType.update({
            test_type_id,
            location_id,
            bill_type,
            description,
            price,
            is_paid_type,
            is_insurance_test,
            acuity_ref,
            rank_order,
            display_name,
            salesforce_id,
            status
        }, {
            where: {
                id: id
            }
        });

        let updatedLocationTestType = await _models2.default.LocationTestType.findOne({
            where: {
                id: id
            }
        });

        res.status(200).json({
            status: 'success',
            payload: updatedLocationTestType,
            message: 'Location Test Type fetched successfully'
        });
    } catch (error) {
        console.log("Error at updated Location Test Type By Id method- GET / :" + error);
        res.status(500).json({
            status: 'failed',
            payload: {},
            message: 'Error while location test type'
        });
    }
};

exports.fetch_location_test_type_by_location_id = async (req, res, next) => {
    try {
        let { id } = req.params;

        let findLocation = await _models2.default.Location.findOne({
            where: {
                id: id
            }
        });

        if (findLocation === null) {
            return res.status(200).json({
                status: 'failed',
                payload: null,
                message: 'Invalid Location at fetching location test type by location id'
            });
        }
        let fetchLocationTestType = await _models2.default.LocationTestType.findAll({
            // include: [                
            //     {
            //         model: db.TestType,
            //         as: "testType",
            //     }
            // ],
            include: [{
                model: _models2.default.TestType,
                as: "testType",
                include: [{
                    model: _models2.default.TestValueType,
                    as: "testValueTypes",
                    required: false,
                    include: [{
                        model: _models2.default.TestValueEnum,
                        as: 'testValueEnum'
                    }]
                }]
            }],
            where: {
                location_id: findLocation.id
            }
        });
        // console.log("fetchLocationTestType ==>"+ JSON.stringify(fetchLocationTestType))

        res.status(200).json({
            status: 'success',
            payload: fetchLocationTestType,
            message: 'Location Test Type by Location fetched successfully'
        });
    } catch (error) {
        console.log("Error at Location Test Type By Location Id method- GET / :" + error);
        res.status(500).json({
            status: 'failed',
            payload: {},
            message: 'Error while location test type by location id'
        });
    }
};