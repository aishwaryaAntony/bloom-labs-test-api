var express = require('express');
var router = express.Router();
import physicianController from '../../../controllers/physician';

router.get('/', physicianController.fetch_all_physician);

router.get('/:id', physicianController.fetch_physician_by_id);

router.post('/', physicianController.create_new_physician);

router.put('/:id', physicianController.update_physician);

module.exports = router;
