var express = require('express');
var router = express.Router();
import locationController from '../../../controllers/location';

router.get('/', locationController.fetch_all_location);

router.get('/:id', locationController.fetch_location_by_id);

router.post('/', locationController.create_new_location);

router.put('/:id', locationController.update_location);

module.exports = router;
