import db from "../models";

exports.fetch_all_location_test_type = async (req, res, next) => {
    try {
        let fetchAllLocationTestType = await db.LocationTestType.findAll({
            include: [
                {
                    model: db.Location,
                    as: "location",
                },
                {
                    model: db.TestType,
                    as: "testType",
                },
                {
                    model: db.TestGroup,
                    as: 'testGroup'
                }
            ]
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

        let findLocationTestType = await db.LocationTestType.findOne({
            where: {
                id: id
            },
            include: [
                {
                    model: db.TestType,
                    as: "testType",
                    include: [
                        {
                            model: db.TestValueType,
                            as: "testValueTypes",
                            required: false,
                            include: [
                                {
                                    model: db.TestValueEnum,
                                    as: 'testValueEnum'
                                }
                            ]
                        }
                    ]
                },
                {
                    model: db.TestGroup,
                    as: 'testGroup'
                }
            ]
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
        let { test_type_id, location_id, bill_type, description, price, is_paid_type, is_insurance_test, acuity_ref, rank_order, display_name, salesforce_id, is_group, test_group_ref } = req.body;

        let findLocation = await db.Location.findOne({
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

        let findTestType = null;
        let fetchTestGroup = null;
        if(test_type_id !== null && test_group_ref === null){
            findTestType = await db.TestType.findOne({
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
        }else{
            if(test_group_ref !== null){
                fetchTestGroup = await db.TestGroup.findOne({
                    where: {
                        id: test_group_ref
                    }
                })

                if (fetchTestGroup === null) {
                    return res.status(200).json({
                        status: 'success',
                        payload: null,
                        message: 'Invalid Test Group'
                    });
                }
            }
        }
        

        let new_location_test_type = await db.LocationTestType.create({
            test_type_id: !!test_type_id ? test_type_id : null,
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
            test_group_ref: !!test_group_ref ? test_group_ref : null,
            is_group: is_group === true || is_group === "true" ? is_group : false,
            qr_code: is_group === true || is_group === "true" ? `${findLocation.code}-${fetchTestGroup.code}` : `${findLocation.code}-${findTestType.code}`,
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

        let { test_type_id, location_id, bill_type, description, price, is_paid_type, is_insurance_test, acuity_ref, status, rank_order, display_name, salesforce_id, is_group, test_group_ref  } = req.body;

        let findLocationTestType = await db.LocationTestType.findOne({
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

        // let findTestType = await db.TestType.findOne({
        //     where: {
        //         id: test_type_id
        //     }
        // });

        // if (findTestType === null) {
        //     return res.status(200).json({
        //         status: 'success',
        //         payload: null,
        //         message: 'Invalid Test Type'
        //     });
        // }

        let findLocation = await db.Location.findOne({
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

        let findTestType = null;
        let fetchTestGroup = null;
        if(test_type_id !== null && test_group_ref === null){
            findTestType = await db.TestType.findOne({
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
        }else{
            if(test_group_ref !== null){
                fetchTestGroup = await db.TestGroup.findOne({
                    where: {
                        id: test_group_ref
                    }
                })

                if (fetchTestGroup === null) {
                    return res.status(200).json({
                        status: 'success',
                        payload: null,
                        message: 'Invalid Test Group'
                    });
                }
            }
        }

        await db.LocationTestType.update({
            test_type_id: !!test_type_id ? test_type_id : null,
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
            test_group_ref: !!test_group_ref ? test_group_ref : null,
            is_group: is_group === true || is_group === "true" ? is_group : false,
            status
        }, {
            where: {
                id: id
            }
        });

        let updatedLocationTestType = await db.LocationTestType.findOne({
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

        let findLocation = await db.Location.findOne({
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
        let fetchLocationTestType = await db.LocationTestType.findAll({
            // include: [                
            //     {
            //         model: db.TestType,
            //         as: "testType",
            //     }
            // ],
            include: [
                {
                    model: db.TestType,
                    as: "testType",
                    include: [
                        {
                            model: db.TestValueType,
                            as: "testValueTypes",
                            required: false,
                            include: [
                                {
                                    model: db.TestValueEnum,
                                    as: 'testValueEnum'
                                }
                            ]
                        }
                    ]
                },
                {
                    model: db.TestGroup,
                    as: 'testGroup'
                }
            ],
            where: {
                location_id: findLocation.id
            }
        })
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

