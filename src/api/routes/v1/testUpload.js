var express = require('express');
var router = express.Router();
import testUploadController from '../../../controllers/testUpload';

router.get('/', testUploadController.fetch_all_test_upload);

router.get('/:id', testUploadController.fetch_test_upload_by_id);

module.exports = router;
