var express = require('express');
var router = express.Router();
import testGroupController from '../../../controllers/testGroup';

router.get('/', testGroupController.fetch_all_test_groups);

router.get('/:id', testGroupController.fetch_test_group_by_id);

router.post('/', testGroupController.create_new_test_group);

router.put('/:id', testGroupController.update_test_group);

module.exports = router;
