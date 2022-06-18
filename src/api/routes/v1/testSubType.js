var express = require('express');
var router = express.Router();
import testSubTypeController from '../../../controllers/testSubType';


/**
 * @swagger
 *  /test-sub-type/test-type/{id}:
 *    get:
 *     summary: Get the test sub type By test type id 
 *     description: "Fetch the test sub type by test type id data Created_by: Gopinath"
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
 *                $ref: "#/definitions/TestSubType"
 *            message:
 *              type: string
 *              example: "Test Sub type fetched successfully"
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
 *            message: "Error while fetching Test sub type"
 */
router.get('/test-type/:id', testSubTypeController.fetch_test_sub_type_by_test_type_id);

router.post('/', testSubTypeController.create_test_sub_type);

router.put('/:id', testSubTypeController.update_test_sub_type);

module.exports = router;