var express = require('express');
var router = express.Router();
import testValueEnumController from '../../../controllers/testValueEnum';

router.get('/', testValueEnumController.fetch_all_test_value_enum);

router.get('/:id', testValueEnumController.fetch_test_value_enum_by_id);

router.post('/', testValueEnumController.create_new_test_value_enum);

router.put('/:id', testValueEnumController.update_test_value_enum);

module.exports = router;