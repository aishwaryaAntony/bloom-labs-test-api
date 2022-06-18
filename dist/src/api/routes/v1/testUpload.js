'use strict';

var _testUpload = require('../../../controllers/testUpload');

var _testUpload2 = _interopRequireDefault(_testUpload);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');
var router = express.Router();


router.get('/', _testUpload2.default.fetch_all_test_upload);

router.get('/:id', _testUpload2.default.fetch_test_upload_by_id);

module.exports = router;