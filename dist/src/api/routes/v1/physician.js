'use strict';

var _physician = require('../../../controllers/physician');

var _physician2 = _interopRequireDefault(_physician);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');
var router = express.Router();


router.get('/', _physician2.default.fetch_all_physician);

router.get('/:id', _physician2.default.fetch_physician_by_id);

router.post('/', _physician2.default.create_new_physician);

router.put('/:id', _physician2.default.update_physician);

module.exports = router;