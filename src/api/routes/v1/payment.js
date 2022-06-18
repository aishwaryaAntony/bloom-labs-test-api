var express = require('express');
var router = express.Router();
import paymentController from '../../../controllers/payment';

router.post('/create-session', paymentController.createSession);

router.put('/update-session', paymentController.update_payment_status);

module.exports = router;
