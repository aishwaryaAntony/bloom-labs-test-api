'use strict';

var _testResult = require('../../../controllers/testResult');

var _testResult2 = _interopRequireDefault(_testResult);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');
var router = express.Router();


router.get('/:id', _testResult2.default.fetch_test_result);

router.get('/member/:member_token', _testResult2.default.fetch_member_test_result);

router.get('/unassigned-test-tube/:member_token', _testResult2.default.fetch_unassigned_test_tube);

router.post('/', _testResult2.default.create_new_test_result);

router.put('/update-test-tube/:member_token', _testResult2.default.update_test_tube);

router.get('/', _testResult2.default.fetch_all_test_result);

router.put('/update/:id', _testResult2.default.update_test_result);

router.post('/add-new-test-result', _testResult2.default.add_new_test_result);

router.get('/report/get-test-report', _testResult2.default.fetch_test_report);

router.get('/reports/get-all-reports', _testResult2.default.fetch_all_test_reports);

router.get('/filter/result-status', _testResult2.default.fetch_test_results_by_result_status);

router.post('/send-test-result', _testResult2.default.send_test_result);

router.put('/change-patient/:id', _testResult2.default.change_patient);

module.exports = router;