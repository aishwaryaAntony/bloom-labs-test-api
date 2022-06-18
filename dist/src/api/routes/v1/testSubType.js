'use strict';

var _testSubType = require('../../../controllers/testSubType');

var _testSubType2 = _interopRequireDefault(_testSubType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');
var router = express.Router();


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
router.get('/test-type/:id', _testSubType2.default.fetch_test_sub_type_by_test_type_id);
module.exports = router;