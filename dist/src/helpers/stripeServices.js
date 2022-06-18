"use strict";

var _constants = require("./constants");

const stripe = require("stripe")(_constants.STRIPE_SECRET_KEY);

module.exports = {
  /**
   * creates a payment session for donor supervisor
   * @function
   */
  createSessionForPayment: (testType, isLoggedIn) => {
    return new Promise(async (resolve, reject) => {
      try {

        // console.log(`Data ==> ${JSON.stringify(data)}`);
        let success_url = `${_constants.CLIENT_DOMAIN}payment-status?success=true&session_id={CHECKOUT_SESSION_ID}`;
        let cancel_url = `${_constants.CLIENT_DOMAIN}payment-status?canceled=true&session_id={CHECKOUT_SESSION_ID}`;

        if (isLoggedIn === true) {
          success_url = `${_constants.CLIENT_DOMAIN}user/payment-status?success=true&session_id={CHECKOUT_SESSION_ID}`;
          cancel_url = `${_constants.CLIENT_DOMAIN}user/payment-status?canceled=true&session_id={CHECKOUT_SESSION_ID}`;
        }

        let lineItems = [];

        let item = {};
        let priceObj = {};
        let productObj = {};

        productObj.name = testType.name;

        priceObj.currency = 'usd';
        priceObj.product_data = productObj;
        priceObj.unit_amount = parseFloat(testType.price) * 100;

        item.price_data = priceObj;
        item.quantity = 1;
        lineItems.push(item);

        // console.log(`lineItems ==> ${JSON.stringify(lineItems)}`);

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: lineItems,
          mode: 'payment',
          success_url: `${success_url}`,
          cancel_url: `${cancel_url}`
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
  retrieveSessionForPayment: session_id => {
    return new Promise(async (resolve, reject) => {
      try {
        const session = await stripe.checkout.sessions.retrieve(session_id);
        resolve(session);
      } catch (error) {
        reject(error);
      }
    });
  }
};