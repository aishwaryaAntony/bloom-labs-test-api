'use strict';

var _payment = require('../../../controllers/payment');

var _payment2 = _interopRequireDefault(_payment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');
var router = express.Router();


router.post('/create-session', _payment2.default.createSession);

router.put('/update-session', _payment2.default.update_payment_status);

module.exports = router;