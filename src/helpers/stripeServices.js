import { STRIPE_SECRET_KEY, NY_STRIPE_SECRET_KEY, CLIENT_DOMAIN } from "./constants";
import db from "../models";
import { Op } from "sequelize";
import moment from "moment";
import _ from "underscore";
const Stripe = require("stripe");

module.exports = {
	/**
	 * creates a payment session for donor supervisor
	 * @function
	 */
	createSessionForPayment: (testType, isLoggedIn, location_code) => {
		return new Promise(async (resolve, reject) => {
			try {

				// console.log(`Data ==> ${JSON.stringify(data)}`);
				let success_url = `${CLIENT_DOMAIN}payment-status?success=true&session_id={CHECKOUT_SESSION_ID}`;
				let cancel_url = `${CLIENT_DOMAIN}payment-status?canceled=true&session_id={CHECKOUT_SESSION_ID}`;

				if (isLoggedIn === true) {
					success_url = `${CLIENT_DOMAIN}user/payment-status?success=true&session_id={CHECKOUT_SESSION_ID}`;
					cancel_url = `${CLIENT_DOMAIN}user/payment-status?canceled=true&session_id={CHECKOUT_SESSION_ID}`;
				}

				let lineItems = [];

				let item = {};
				let priceObj = {};
				let productObj = {};

				productObj.name = testType.name;

				priceObj.currency = 'usd';
				priceObj.product_data = productObj;
				priceObj.unit_amount = (parseFloat(testType.price) * 100);

				item.price_data = priceObj;
				item.quantity = 1;
				lineItems.push(item);

				// console.log(`lineItems ==> ${JSON.stringify(lineItems)}`);
				const stripe = location_code === "NY" ? Stripe(NY_STRIPE_SECRET_KEY) : Stripe(STRIPE_SECRET_KEY)

				const session = await stripe.checkout.sessions.create({
					payment_method_types: ['card'],
					line_items: lineItems,
					mode: 'payment',
					success_url: `${success_url}`,
					cancel_url: `${cancel_url}`,
				});

				// console.log(`session ==> ${JSON.stringify(session)}`);
				resolve(session);
			} catch (error) {
				reject(error);
			}
		});
	},

	/**
	  * creates a payment session for donor supervisor
	  * @function
	  */
	retrieveSessionForPayment: (session_id, location_code) => {
		return new Promise(async (resolve, reject) => {
			try {
				const stripe = location_code === "NY" ? Stripe(NY_STRIPE_SECRET_KEY) : Stripe(STRIPE_SECRET_KEY)

				const session = await stripe.checkout.sessions.retrieve(session_id);
				resolve(session);
			} catch (error) {
				reject(error);
			}
		});
	},

	updateCancelledPayments: () => {
		return new Promise(async (resolve, reject) => {
			try {
				let fetchTestResult = await db.TestResult.findAll({
					where: {
						result_status: {
							[Op.in]: ["Pending Payment"]
						}
					}
				});

				let filterByTimeSince = _.filter(fetchTestResult, (result) =>
					(moment().diff(moment(result.registration_date), 'minutes')) >= 5
				);

				// console.log(`Filtered by time since ---> ${JSON.stringify(filterByTimeSince)}`)

				let fetchTestResultIds = _.pluck(filterByTimeSince, 'id');
				// console.log(`Failed Payment Ids --> ${JSON.stringify(fetchTestResultIds)}`)

				await db.TestResult.update({
					result_status: 'Payment Cancelled'
				}, {
					where: {
						id: fetchTestResultIds
					}
				});

				resolve('success');

			} catch (error) {
				resolve(error);
			}
		});
	}
}