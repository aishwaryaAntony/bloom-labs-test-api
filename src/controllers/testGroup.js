import db from "../models";

exports.fetch_all_test_groups = async (req, res, next) => {
    try {
        
        let fetchAllTestGroup = await db.TestGroup.findAll({});

        res.status(200).json({
            status: 'success',
            payload: fetchAllTestGroup,
            message: 'Test Group fetched successfully'
        });

    } catch (error) {
        console.log("Error at Test Group method- GET / :" + error);
        res.status(500).json({
            status: 'failed',
            payload: {},
            message: 'Error while Test Group'
        });
    }
};


exports.fetch_test_group_by_id = async (req, res, next) => {
    try {
        let { id } = req.params;

        let findTestGroup = await db.TestGroup.findOne({
            where: {
                id: id
            }
        });

        if (findTestGroup === null) {
            return res.status(200).json({
                status: 'success',
                payload: null,
                message: 'Invalid Test Group'
            });
        }

        res.status(200).json({
            status: 'success',
            payload: findTestGroup,
            message: 'Test Group fetched successfully'
        });

    } catch (error) {
        console.log("Error at Test Group By Id method- GET / :" + error);
        res.status(500).json({
            status: 'failed',
            payload: {},
            message: 'Error while Test Group'
        });
    }
};

exports.create_new_test_group = async (req, res, next) => {
    try {
        let { code, lab_code, name, description, test_type_ids, status } = req.body;
    
        let findTestGroup = await db.TestGroup.findOne({
            where: {
                test_type_ids: test_type_ids
            }
        });
        
        if (findTestGroup !== null) {
            return res.status(200).json({
                status: 'failed',
                payload: null,
                message: 'Test group already exist'
            });
        }

        let findGroup = await db.TestGroup.findOne({
            where: {
                code: code
            }
        });
        
        if (findGroup !== null) {
            return res.status(200).json({
                status: 'failed',
                payload: null,
                message: 'Code already exist'
            });
        }

        let new_test_group = await db.TestGroup.create({
            code, 
            lab_code, 
            name, 
            description, 
            test_type_ids,
            status
        });
       
        res.status(200).json({
            status: 'success',
            payload: new_test_group,
            message: 'Test Group created successfully'
        });

    } catch (error) {
        console.log("Error at created new Test Group method- GET / :" + error);
        res.status(500).json({
            status: 'failed',
            payload: {},
            message: 'Error while Test Group'
        });
    }
};

exports.update_test_group = async (req, res, next) => {
    try {

        let { id } = req.params;

        let { name, description, test_type_ids, status } = req.body;
      
        let findTestGroup = await db.TestGroup.findOne({
            where: {
                id: id
            }
        });

        if (findTestGroup === null) {
            return res.status(200).json({
                status: 'success',
                payload: null,
                message: 'Invalid Test Group'
            });
        }

        await db.TestGroup.update({
            name, 
            description, 
            test_type_ids,
            status
        },{
            where:{
                id: id
            }
        });

        let updatedTestGroup = await db.TestGroup.findOne({
            where: {
                id: id
            }
        });


        res.status(200).json({
            status: 'success',
            payload: updatedTestGroup,
            message: 'Test Group updated successfully'
        });

    } catch (error) {
        console.log("Error at updated new Test Group method- GET / :" + error);
        res.status(500).json({
            status: 'failed',
            payload: {},
            message: 'Error while updated Test Group'
        });
    }
};

