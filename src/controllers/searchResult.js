import db from "../models";
import { Op } from "sequelize";


exports.search_test_result = async (req, res, next) => {
    try {
        let { search } = req.query;
        // console.log("====search=====" + search)

        let searchAllTestResult = await db.TestResult.findAll({
            where: {
                [Op.or]: [
                    {
                        test_type_name: {
                            [Op.iLike]: `%${search}%`
                        }
                    },
                    {
                        test_sequence_number: {
                            [Op.iLike]: `%${search}%`
                        }
                    },
                    {
                        tube_number: {
                            [Op.iLike]: `%${search}%`
                        }
                    }
                ]
            }
        });

        let searchLocations = await db.Location.findAll({
            where: {
                name: {
                    [Op.iLike]: `%${search}%`
                }
            }
        })

        let resultObj = {}
        resultObj.testResults = searchAllTestResult;
        resultObj.locations = searchLocations;

        console.log("========searchAllTestResult==========" + JSON.stringify(searchAllTestResult))

        res.status(200).json({
            status: 'success',
            payload: resultObj,
            message: 'search all test results fetched successfully'
        });
    }
    catch (error) {
        console.log("Error at  searching test results method- GET / :" + error);
        res.status(500).json({
            status: 'failed',
            payload: {},
            message: 'Error while searching test results'
        });
    }
};


exports.query_search = async (req, res, next) => {
    try {
        let { query } = req.body;

        let createQuery = query.toLocaleLowerCase().includes("insert");
		let deleteQuery = query.toLocaleLowerCase().includes("delete");
		let updateQuery = query.toLocaleLowerCase().includes("update");
		let selectQuery = query.toLocaleLowerCase().includes("select");

		if (createQuery === false && deleteQuery === false && updateQuery === false && selectQuery === true) {
			let results = await db.sequelize.query(query, {
				type: db.sequelize.QueryTypes.SELECT
			})
			res.status(200).json({
				status: 'success',
				payload: results,
				message: 'search all query fetched successfully'
			});
		} else {
			res.status(200).json({
				status: 'failed',
				payload: null,
				message: 'Wrong Query'
			});
		}
    }
    catch (error) {
        console.log("Error at query searching method- POST / :" + error);
        res.status(500).json({
            status: 'failed',
            payload: {},
            message: 'Error while query searching '
        });
    }
};

