'use strict';

var _locationTestType = require('../../../controllers/locationTestType');

var _locationTestType2 = _interopRequireDefault(_locationTestType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');
var router = express.Router();


router.get('/', _locationTestType2.default.fetch_all_location_test_type);

router.get('/:id', _locationTestType2.default.fetch_location_test_type_by_id);

router.post('/', _locationTestType2.default.create_new_location_test_type);

router.put('/:id', _locationTestType2.default.update_location_test_type);

router.get('/location/:id', _locationTestType2.default.fetch_location_test_type_by_location_id);

module.exports = router;