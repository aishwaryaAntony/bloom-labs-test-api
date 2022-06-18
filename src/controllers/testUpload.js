import db from "../models";

exports.fetch_all_test_upload = async (req, res, next) => {
    try {
        let fetchTestUploads = await db.TestUpload.findAll({
            order: [
                ['id', 'DESC']],
            include:[{               
                model: db.UploadTestResult,
                as: "uploadTestResult"
            }]
        });
        res.status(200).json({
            status: "success",
            message: "successfully fetched all test uploads",
            payload: fetchTestUploads
        })
    } catch (error) {
        console.log("Error at fetching all test uploads" + `${error}`);
        res.status(500).json({
            status: "failed",
            message: "Error at fetching all test uploads",
            payload: null
        })
    }
};

exports.fetch_test_upload_by_id = async (req, res, next) => {
    try {
        let { id } = req.params;   
        let fetchTestUploads = await db.TestUpload.findOne({
            include:[{               
                model: db.UploadTestResult,
                as: "uploadTestResult"
            }],
            where:{
                id: id
            }
        });
        res.status(200).json({
            status: "success",
            message: "successfully fetched test upload by id",
            payload: fetchTestUploads
        })
    } catch (error) {
        console.log("Error at fetching test upload by id" + `${error}`);
        res.status(500).json({
            status: "failed",
            message: "Error at fetching test upload by id",
            payload: null
        })
    }
};