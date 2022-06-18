var express = require('express');
var router = express.Router();
import testResultController from '../../../controllers/testResult';


router.get('/:id', testResultController.fetch_test_result);

router.get('/member/:member_token', testResultController.fetch_member_test_result);

router.get('/unassigned-test-tube/:member_token', testResultController.fetch_unassigned_test_tube);

router.post('/', testResultController.create_new_test_result);

router.put('/update-test-tube/:member_token', testResultController.update_test_tube);

router.get('/', testResultController.fetch_all_test_result);

router.put('/update/:id', testResultController.update_test_result);

router.post('/add-new-test-result', testResultController.add_new_test_result);

router.get('/report/get-test-report', testResultController.fetch_test_report);

router.get('/reports/get-all-reports', testResultController.fetch_all_test_reports)

router.get('/filter/result-status', testResultController.fetch_test_results_by_result_status)

router.post('/send-test-result', testResultController.send_test_result);

router.put('/change-patient/:id', testResultController.change_patient);

router.delete('/:id', testResultController.delete_test_result);

router.get('/lead/reports', testResultController.fetch_lead_test_results);

router.post('/lead/export-report', testResultController.download_lead_test_results);

module.exports = router;
