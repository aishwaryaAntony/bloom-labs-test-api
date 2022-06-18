var express = require('express');
var router = express.Router();
import testTypeController from '../../../controllers/testType';


/**
 * @swagger
 *  /test-type:
 *    get:
 *     summary: Get the Test Types 
 *     description: "Fetch the Test Types data Created_by: Gopinath"
 *     tags: [TestType]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: offset
 *         in: query
 *         required: false
 *         type: number
 *     responses:
 *       200:
 *        description: "A successful response"
 *        application/json:
 *        schema:
 *          type: object
 *          properties:
 *            status:
 *              type: string
 *              example: "success"
 *            payload:
 *               type: array
 *               items:
 *                 $ref: "#/definitions/TestType"
 *            message:
 *              type: string
 *              example: "Test Types fetched successfully"
 *       500:
 *        description: "Internal Server Error"
 *        application/json:
 *        schema:
 *          type: object
 *          properties:
 *            status:
 *              type: string
 *            payload:
 *              type: string
 *              nullable: true
 *            message:
 *              type: string
 *          example:
 *            status: "failed"
 *            payload: null
 *            message: "Error while fetching Test Types"
 */
router.get('/', testTypeController.fetch_all_test_type);


router.get('/preloaded/test-value-types', testTypeController.get_all_test_type);

/**
 * @swagger
 *  /test-type/{id}:
 *    get:
 *     summary: Get the test type By id 
 *     description: "Fetch the test type by id data Created_by: Gopinath"
 *     tags: [TestType]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: number
 *     responses:
 *       200:
 *        description: "A successful response"
 *        application/json:
 *        schema:
 *          type: object
 *          properties:
 *            status:
 *              type: string
 *              example: "success"
 *            payload:
 *                $ref: "#/definitions/TestType"
 *            message:
 *              type: string
 *              example: "Test type fetched successfully"
 *       500:
 *        description: "Internal Server Error"
 *        application/json:
 *        schema:
 *          type: object
 *          properties:
 *            status:
 *              type: string
 *            payload:
 *              type: string
 *              nullable: true
 *            message:
 *              type: string
 *          example:
 *            status: "failed"
 *            payload: null
 *            message: "Error while fetching Test type"
 */
router.get('/:id', testTypeController.fetch_test_type_by_id);


/**
 * @swagger
 *  /test-type:
 *    post:
 *     summary: Create a new test type
 *     description: "Create a new test type Created_by: Gopinath"
 *     tags: [TestType]
 *     parameters:
 *       - in: body
 *         name: test_type
 *         required: true
 *         description: Test type details
 *         schema:
 *          type: object
 *          properties:
 *            code:
 *              type: string
 *            lab_code:
 *              type: string
 *            name:
 *              type: string
 *            device_id:
 *              type: string
 *            loinc_code:
 *              type: string
 *            loinc_description:
 *              type: string
 *            specimen_site:
 *              type: string
 *            specimen_date:
 *              type: string
 *            test_code:
 *              type: string
 *            test_type_name:
 *              type: string
 *            description:
 *              type: string
 *            status:
 *              type: string
 *          example:
 *            code: "ASD"
 *            lab_code: "ASD"
 *            name: "PCR"
 *            device_id: "pcr"
 *            loinc_code: "FGG"
 *            loinc_description: "loinc code"
 *            specimen_site: "site"
 *            specimen_date: "12/12/2021"
 *            test_code: "FGF"
 *            test_type_name: "PCR TEST"
 *            description: "PCR TEST"
 *            status: "ACTIVE"
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *        description: "A successful response"
 *        application/json:
 *        schema:
 *          type: object
 *          properties:
 *            status:
 *              type: string
 *              example: "success"
 *            payload:
 *                $ref: "#/definitions/TestType"
 *            message:
 *              type: string
 *              example: "Test type created successfully"
 *       500:
 *        description: "Internal Server Error"
 *        application/json:
 *        schema:
 *          type: object
 *          properties:
 *            status:
 *              type: string
 *            payload:
 *              type: string
 *              nullable: true
 *            message:
 *              type: string
 *          example:
 *            status: "failed"
 *            payload: null
 *            message: "Error while creating test type"
 */
router.post('/', testTypeController.create_new_test_type);


/**
 * @swagger
 *  /test-type/{id}:
 *    put:
 *     summary: Update a test type
 *     description: "Update a test type Created_by: Gopinath"
 *     tags: [TestType]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: number
 *         description: The test type details to update by id
 *       - in: body
 *         name: test_type
 *         required: true
 *         description: Test type details
 *         schema:
 *          type: object
 *          properties:
 *            code:
 *              type: string
 *            lab_code:
 *              type: string
 *            name:
 *              type: string
 *            device_id:
 *              type: string
 *            loinc_code:
 *              type: string
 *            loinc_description:
 *              type: string
 *            specimen_site:
 *              type: string
 *            specimen_date:
 *              type: string
 *            test_code:
 *              type: string
 *            test_type_name:
 *              type: string
 *            description:
 *              type: string
 *            status:
 *              type: string
 *          example:
 *            code: "ASD"
 *            lab_code: "ASD"
 *            name: "PCR"
 *            device_id: "pcr"
 *            loinc_code: "FGG"
 *            loinc_description: "loinc code"
 *            specimen_site: "site"
 *            specimen_date: "12/12/2021"
 *            test_code: "FGF"
 *            test_type_name: "PCR TEST"
 *            description: "PCR TEST"
 *            status: "ACTIVE"
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *        description: "A successful response"
 *        application/json:
 *        schema:
 *          type: object
 *          properties:
 *            status:
 *              type: string
 *              example: "success"
 *            payload:
 *                $ref: "#/definitions/TestType"
 *            message:
 *              type: string
 *              example: "Test type updated successfully"
 *       500:
 *        description: "Internal Server Error"
 *        application/json:
 *        schema:
 *          type: object
 *          properties:
 *            status:
 *              type: string
 *            payload:
 *              type: string
 *              nullable: true
 *            message:
 *              type: string
 *          example:
 *            status: "failed"
 *            payload: null
 *            message: "Error while updating test type"
 */
router.put('/:id', testTypeController.update_test_type);

router.get('/location-test-type/:id', testTypeController.fetch_test_type_by_location_test_type_id);

module.exports = router;