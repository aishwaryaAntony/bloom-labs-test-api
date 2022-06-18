var express = require('express');
var router = express.Router();
import testValueTypeController from '../../../controllers/testValueType';

router.get('/', testValueTypeController.fetch_all_test_value_type);

router.get('/:id', testValueTypeController.fetch_test_value_type_by_id);

router.post('/', testValueTypeController.create_new_test_value_type);

router.put('/:id', testValueTypeController.update_test_value_type);

module.exports = router;