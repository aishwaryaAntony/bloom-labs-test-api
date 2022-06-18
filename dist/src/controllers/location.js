"use strict";

var _models = require("../models");

var _models2 = _interopRequireDefault(_models);

var _sequelize = require("sequelize");

var _sequelize2 = _interopRequireDefault(_sequelize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.fetch_all_location = async (req, res, next) => {
    try {
        const { branding } = req.query;
        let whereObj = {};

        if (branding !== undefined && branding !== null && branding !== "") {
            whereObj.branding = branding;
        }
        let fetchAllLocation = await _models2.default.Location.findAll({
            where: whereObj
        });

        // let fetchAllLocation = await db.Location.findAll({
        //     where: {
        //         // lab_name: {
        //         //     [Op.ne]: 'Saguaro Bloom'
        //         // }
        //     },
        //     // attributes: [
        //     //     'id', 'lab_name',
        //     //     [
        //     //         sequelize.fn(
        //     //           'PGP_SYM_DECRYPT',
        //     //           sequelize.cast(sequelize.col('lab_name'), 'bytea'), 
        //     //           'AES_KEY'
        //     //         ), 
        //     //         "name"
        //     //       ]
        //     // ],

        //     // where: {
        //     //     lab_name: {
        //     //         [Op.ne]: 'Saguaro Bloom'
        //     //     },
        //     //     [Op.and]: [
        //     //         sequelize.where(sequelize.fn('PGP_SYM_DECRYPT', sequelize.cast(sequelize.col('lab_name'), 'bytea'), 'AES_KEY'), {
        //     //             [Op.iLike]: `%bloom%`,
        //     //         }),

        //     //     ]
        //     // }
        // });

        res.status(200).json({
            status: 'success',
            payload: fetchAllLocation,
            message: 'Location fetched successfully'
        });
    } catch (error) {
        console.log("Error at Location method- GET / :" + error);
        res.status(500).json({
            status: 'failed',
            payload: {},
            message: 'Error while location'
        });
    }
};

exports.fetch_location_by_id = async (req, res, next) => {
    try {
        let { id } = req.params;

        let findLocation = await _models2.default.Location.findOne({
            where: {
                id: id
            },
            include: [{
                model: _models2.default.LocationTestType,
                as: 'locationTestTypes',
                include: [{
                    model: _models2.default.TestType,
                    as: 'testType'
                }]

            }]

        });

        if (findLocation === null) {
            return res.status(200).json({
                status: 'success',
                payload: null,
                message: 'Invalid Location'
            });
        }

        res.status(200).json({
            status: 'success',
            payload: findLocation,
            message: 'Location fetched successfully'
        });
    } catch (error) {
        console.log("Error at Location By Id method- GET / :" + error);
        res.status(500).json({
            status: 'failed',
            payload: {},
            message: 'Error while location'
        });
    }
};

exports.create_new_location = async (req, res, next) => {
    try {
        let { lab_code, code, name, lab_name, clia, street_address_line1, street_address_line2, city, state, country, zipcode,
            phone_number, timezone, ordering_facility, acuity_ref, status, display_name, branding } = req.body;

        let new_location = await _models2.default.Location.create({
            lab_code,
            code,
            name,
            lab_name,
            branding,
            clia,
            street_address_line1,
            street_address_line2,
            city,
            state,
            country,
            zipcode,
            phone_number,
            timezone,
            ordering_facility,
            acuity_ref,
            display_name,
            status
        });
        res.status(200).json({
            status: 'success',
            payload: new_location,
            message: 'Location created successfully'
        });
    } catch (error) {
        console.log("Error at created new location method- GET / :" + error);
        res.status(500).json({
            status: 'failed',
            payload: {},
            message: 'Error while location'
        });
    }
};

exports.update_location = async (req, res, next) => {
    try {
        let { id } = req.params;

        let { lab_code, code, name, lab_name, clia, street_address_line1, street_address_line2, city, state, country, zipcode,
            phone_number, timezone, ordering_facility, acuity_ref, status, display_name, branding } = req.body;

        let findLocation = await _models2.default.Location.findOne({
            where: {
                id: id
            }
        });

        if (findLocation === null) {
            return res.status(200).json({
                status: 'success',
                payload: null,
                message: 'Invalid Location'
            });
        }

        console.log(`Going to encrypt`);
        // const [results, metadata] = await db.sequelize.query('CREATE EXTENSION IF NOT EXISTS pgcrypto;');
        // console.log(`Result ${results}`)
        // sequelize.fn('PGP_SYM_ENCRYPT','thename', 'AES_KEY')
        await _models2.default.Location.update({
            lab_code,
            name,
            code,
            // lab_name: sequelize.fn('PGP_SYM_ENCRYPT', lab_name, 'AES_KEY'),
            lab_name,
            branding,
            clia,
            street_address_line1,
            street_address_line2,
            city,
            state,
            country,
            zipcode,
            phone_number,
            timezone,
            ordering_facility,
            acuity_ref,
            display_name,
            status
        }, {
            where: {
                id: id
            }
        });

        let updatedLocation = await _models2.default.Location.findOne({
            where: {
                id: id
            }
        });

        res.status(200).json({
            status: 'success',
            payload: updatedLocation,
            message: 'Location fetched successfully'
        });
    } catch (error) {
        console.log("Error at updated Location By Id method- GET / :" + error);
        res.status(500).json({
            status: 'failed',
            payload: {},
            message: 'Error while location'
        });
    }
};