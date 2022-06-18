var express = require('express');
var router = express.Router();
import testCategoryController from '../../../controllers/testCategory';

router.get('/', testCategoryController.fetch_all_test_categories);

router.post('/', testCategoryController.create_test_category);


module.exports = router;