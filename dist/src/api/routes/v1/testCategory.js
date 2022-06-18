'use strict';

var _testCategory = require('../../../controllers/testCategory');

var _testCategory2 = _interopRequireDefault(_testCategory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');
var router = express.Router();


router.get('/', _testCategory2.default.fetch_all_test_categories);

module.exports = router;