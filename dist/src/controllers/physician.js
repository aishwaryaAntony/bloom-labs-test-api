'use strict';

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.fetch_all_physician = async (req, res, next) => {
    try {
        let fetchAllPhysician = await _models2.default.Physician.findAll({});

        res.status(200).json({
            status: 'success',
            payload: fetchAllPhysician,
            message: 'Physician fetched successfully'
        });
    } catch (error) {
        console.log("Error at Physician method- GET / :" + error);
        res.status(500).json({
            status: 'failed',
            payload: {},
            message: 'Error while Physician'
        });
    }
};

exports.fetch_physician_by_id = async (req, res, next) => {
    try {
        let { id } = req.params;

        let findPhysician = await _models2.default.Physician.findOne({
            where: {
                id: id
            }
        });

        if (findPhysician === null) {
            return res.status(200).json({
                status: 'success',
                payload: null,
                message: 'Invalid physician'
            });
        }

        res.status(200).json({
            status: 'success',
            payload: findPhysician,
            message: 'physician fetched successfully'
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

exports.create_new_physician = async (req, res, next) => {
    try {
        let { lab_code, name, npi_number, location_ref, status } = req.body;

        let new_physician = await _models2.default.Physician.create({
            lab_code,
            name,
            npi_number,
            location_ref,
            is_default: false,
            status
        });

        res.status(200).json({
            status: 'success',
            payload: new_physician,
            message: 'physician created successfully'
        });
    } catch (error) {
        console.log("Error at created new physician method- GET / :" + error);
        res.status(500).json({
            status: 'failed',
            payload: {},
            message: 'Error while physician'
        });
    }
};

exports.update_physician = async (req, res, next) => {
    try {
        let { id } = req.params;

        let { name, npi_number, location_ref, status } = req.body;

        let findPhysician = await _models2.default.Physician.findOne({
            where: {
                id: id
            }
        });

        if (findPhysician === null) {
            return res.status(200).json({
                status: 'success',
                payload: null,
                message: 'Invalid Physician'
            });
        }

        await _models2.default.Physician.update({
            name: name ? name : findPhysician.name,
            npi_number: npi_number ? npi_number : findPhysician.npi_number,
            location_ref: location_ref ? location_ref : findPhysician.location_ref,
            status: status ? status : findPhysician.status
        }, {
            where: {
                id: id
            }
        });

        let updatedPhysician = await _models2.default.Physician.findOne({
            where: {
                id: id
            }
        });

        res.status(200).json({
            status: 'success',
            payload: updatedPhysician,
            message: 'physician fetched successfully'
        });
    } catch (error) {
        console.log("Error at updated physician By Id method- GET / :" + error);
        res.status(500).json({
            status: 'failed',
            payload: {},
            message: 'Error while physician'
        });
    }
};