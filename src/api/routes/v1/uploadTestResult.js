var express = require('express');
var router = express.Router();
import { upload } from "../../../helpers/attachments";
import uploadTestResultController from '../../../controllers/uploadTestResult';

router.post('/', upload.single('file') ,uploadTestResultController.upload_test_result);

router.get('/', uploadTestResultController.fetch_all_upload_test_result);

router.get('/:id', uploadTestResultController.fetch_upload_test_result_by_id);

module.exports = router;
