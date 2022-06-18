'use strict';

var _testValueEnum = require('../../../controllers/testValueEnum');

var _testValueEnum2 = _interopRequireDefault(_testValueEnum);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');
var router = express.Router();


router.get('/', _testValueEnum2.default.fetch_all_test_value_enum);

router.get('/:id', _testValueEnum2.default.fetch_test_value_enum_by_id);

router.post('/', _testValueEnum2.default.create_new_test_value_enum);

router.put('/:id', _testValueEnum2.default.update_test_value_enum);

module.exports = router;