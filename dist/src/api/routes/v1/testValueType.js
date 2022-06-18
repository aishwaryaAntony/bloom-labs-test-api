'use strict';

var _testValueType = require('../../../controllers/testValueType');

var _testValueType2 = _interopRequireDefault(_testValueType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');
var router = express.Router();


router.get('/', _testValueType2.default.fetch_all_test_value_type);

router.get('/:id', _testValueType2.default.fetch_test_value_type_by_id);

router.post('/', _testValueType2.default.create_new_test_value_type);

router.put('/:id', _testValueType2.default.update_test_value_type);

module.exports = router;