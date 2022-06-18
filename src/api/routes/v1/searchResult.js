var express = require('express');
var router = express.Router();
import searchResultController from "../../../controllers/searchResult";

router.get('/', searchResultController.search_test_result);

router.post('/query-search', searchResultController.query_search);

module.exports = router;