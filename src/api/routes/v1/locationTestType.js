var express = require('express');
var router = express.Router();
import locationTestTypeController from '../../../controllers/locationTestType';

router.get('/', locationTestTypeController.fetch_all_location_test_type);

router.get('/:id', locationTestTypeController.fetch_location_test_type_by_id);

router.post('/', locationTestTypeController.create_new_location_test_type);

router.put('/:id', locationTestTypeController.update_location_test_type);

router.get('/location/:id', locationTestTypeController.fetch_location_test_type_by_location_id);

module.exports = router;
