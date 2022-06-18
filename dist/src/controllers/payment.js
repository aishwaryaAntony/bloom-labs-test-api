"use strict";

var _models = require("../models");

var _models2 = _interopRequireDefault(_models);

var _stripeServices = require("../helpers/stripeServices");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.createSession = async (req, res, next) => {
    try {
        let { member_token, test_result_id, testType, isLoggedIn } = req.body;

        let testResult = await _models2.default.TestResult.findOne({
            where: {
                id: test_result_id
            }
        });
        // console.log("testResult=======>"+JSON.stringify(testResult))
        if (testResult === null) {
            return res.status(200).json({
                status: "failed",
                payload: null,
                message: "test result unavailable"
            });
        }

        if (testType === null && testType === undefined) {
            return res.status(200).json({
                status: "failed",
                payload: null,
                message: "invalid test type"
            });
        }

        let createSession = await (0, _stripeServices.createSessionForPayment)(testType, isLoggedIn);
        //console.log("createSession=======>"+JSON.stringify(createSession))
        if (createSession === null) {
            return res.status(200).json({
                status: "failed",
                payload: null,
                message: "Unable to create payment session"
            });
        }
        //console.log("price=======>"+parseFloat(testType.price).toFixed(2))
        await _models2.default.TestResultPayment.create({
            member_token,
            test_result_id,
            price: parseFloat(testType.price).toFixed(2),
            transaction_reference: null,
            transaction_type: 'card',
            transaction_date: new Date(),
            sessionId: createSession.id,
            status: 'created'
        });

        res.status(200).json({
            status: 'success',
            payload: createSession,
            message: 'Session created successfully'
        });
    } catch (error) {
        console.log("error=======>" + error);
        res.status(500).json({
            status: "failed",
            payload: null,
            message: "Unable to create payment session"
        });
    }
};

/**
 * This function will update transaction ref once the payment made successful
 * @function
 */
exports.update_payment_status = async (req, res, next) => {
    try {
        const { session_id } = req.query;

        let fetchTestResultPayment = await _models2.default.TestResultPayment.findOne({
            where: {
                sessionId: session_id
            }
        });

        if (fetchTestResultPayment === null) {
            return res.status(200).json({
                status: 'failed',
                payload: {},
                message: 'Error while adding Credit'
            });
        }

        let testResult = await _models2.default.TestResult.findOne({
            where: {
                id: fetchTestResultPayment.test_result_id
            }
        });

        if (testResult === null) {
            return res.status(200).json({
                status: "failed",
                payload: null,
                message: "test result unavailable"
            });
        }

        let retrieveSession = await (0, _stripeServices.retrieveSessionForPayment)(session_id);

        let showMessage = true;

        if (retrieveSession !== null && Object.keys(retrieveSession).length > 0) {
            if (fetchTestResultPayment.status !== 'paid' && retrieveSession.payment_status === 'paid') {
                await _models2.default.TestResultPayment.update({
                    transaction_reference: retrieveSession.payment_intent,
                    status: retrieveSession.payment_status
                }, {
                    where: {
                        id: fetchTestResultPayment.id
                    }
                });

                await _models2.default.TestResult.update({
                    result_status: "Result unavailable"
                }, {
                    where: {
                        id: testResult.id
                    }
                });
            } else {
                showMessage = false;
            }
        }

        res.status(200).json({
            status: 'success',
            payload: null,
            showMessage: showMessage,
            message: 'payment updated successfully'
        });
    } catch (error) {
        console.log("error at update payment transaction===========>" + error);
        res.status(500).json({
            status: 'failed',
            payload: {},
            message: 'Error while updating a payment status'
        });
    }
};