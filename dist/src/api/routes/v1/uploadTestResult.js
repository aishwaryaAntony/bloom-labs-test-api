'use strict';

var _attachments = require('../../../helpers/attachments');

var _uploadTestResult = require('../../../controllers/uploadTestResult');

var _uploadTestResult2 = _interopRequireDefault(_uploadTestResult);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');
var router = express.Router();


router.post('/', _attachments.upload.single('file'), _uploadTestResult2.default.upload_test_result);

router.get('/', _uploadTestResult2.default.fetch_all_upload_test_result);

router.get('/:id', _uploadTestResult2.default.fetch_upload_test_result_by_id);

module.exports = router;