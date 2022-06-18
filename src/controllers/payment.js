import db from "../models";
import { createSessionForPayment, retrieveSessionForPayment } from "../helpers/stripeServices";

exports.createSession = async (req, res, next) => {
    try {
        let { member_token, test_result_id, testType, isLoggedIn, location_code } = req.body;

        let testResult = await db.TestResult.findOne({
            where: {
                id: test_result_id
            }
        });
       // console.log("testResult=======>"+JSON.stringify(testResult))
        if (testResult === null) {
            return res.status(200).json({
                status: "failed",
                payload: null,
                message: "test result unavailable",
            });
        }
        
        if (testType === null && testType === undefined) {
            return res.status(200).json({
                status: "failed",
                payload: null,
                message: "invalid test type",
            });
        }

        let createSession = await createSessionForPayment(testType, isLoggedIn, location_code);
        //console.log("createSession=======>"+JSON.stringify(createSession))
        if (createSession === null) {
            return res.status(200).json({
                status: "failed",
                payload: null,
                message: "Unable to create payment session",
            });
        }
        //console.log("price=======>"+parseFloat(testType.price).toFixed(2))
        await db.TestResultPayment.create({
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
        console.log("error=======>"+error)
        res.status(500).json({
            status: "failed",
            payload: null,
            message: "Unable to create payment session",
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

        let fetchTestResultPayment = await db.TestResultPayment.findOne({
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

        let testResult = await db.TestResult.findOne({
            where: {
                id: fetchTestResultPayment.test_result_id
            },
            include: [
                {
                    attributes: ['code'],
                    model: db.Location,
                    as: 'testResultLocation'
                }
            ]
        });

        if (testResult === null) {
            return res.status(200).json({
                status: "failed",
                payload: null,
                message: "test result unavailable",
            });
        }

        let retrieveSession = await retrieveSessionForPayment(session_id, testResult.testResultLocation.code);

        let showMessage = true;

        if (retrieveSession !== null && Object.keys(retrieveSession).length > 0) {
            if (fetchTestResultPayment.status !== 'paid' && retrieveSession.payment_status === 'paid') {
                await db.TestResultPayment.update({
                    transaction_reference: retrieveSession.payment_intent,
                    status: retrieveSession.payment_status
                }, {
                    where: {
                        id: fetchTestResultPayment.id
                    }
                });

                await db.TestResult.update({
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
            payload: testResult,
            showMessage: showMessage,
            message: 'payment updated successfully'
        });
    } catch (error) {
        console.log("error at update payment transaction===========>" + error)
        res.status(500).json({
            status: 'failed',
            payload: {},
            message: 'Error while updating a payment status'
        });
    }
}
