'use strict';

var _location = require('../../../controllers/location');

var _location2 = _interopRequireDefault(_location);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');
var router = express.Router();


router.get('/', _location2.default.fetch_all_location);

router.get('/:id', _location2.default.fetch_location_by_id);

router.post('/', _location2.default.create_new_location);

router.put('/:id', _location2.default.update_location);

module.exports = router;