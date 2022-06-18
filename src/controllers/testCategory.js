import db from "../models";
import Sequelize from "sequelize";
const Op = Sequelize.Op;

exports.fetch_all_test_categories = async (req, res, next) => {
    try {
        let fetchAllTestCategory = await db.TestCategory.findAll({
            where: {
                code: {
                    [Op.ne]: 'GRP'
                }
            }
        });

        res.status(200).json({
            status: 'success',
            payload: fetchAllTestCategory,
            message: 'Test Category fetched successfully'
        });

    } catch (error) {
        console.log("Error at Test Category method- GET / :" + error);
        res.status(500).json({
            status: 'failed',
            payload: {},
            message: 'Error while Test Category'
        });
    }
};


exports.create_test_category = async (req, res, next) => {
    try {

        let { name, code, short_code, description, sequence_number, status } = req.body


        let findTestCategory = await db.TestCategory.findOne({
            where: {
                code: code
            }
        });

        if(findTestCategory !== null){
            return res.status(200).json({
                status: 'failed',
                payload: null,
                message: 'Test Category already exist'
            });
        }

        let newTestCategory = await db.TestCategory.create({
            name,
            code,
            short_code,
            description,
            sequence_number,
            status
        });

        res.status(200).json({
            status: 'success',
            payload: newTestCategory,
            message: 'Test Category created successfully'
        });

    } catch (error) {
        console.log("Error at Creating Test Category method- POST / :" + error);
        res.status(500).json({
            status: 'failed',
            payload: {},
            message: 'Error while Creating Test Category'
        });
    }
};
