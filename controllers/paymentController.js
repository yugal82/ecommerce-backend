const razorpay_instance = require('../Razorpay.js');
const crypto = require('crypto');
const { sendResponse } = require('../utils/utils.js');

const paymentCheckout = async (req, res) => {
  try {
    var options = {
      amount: Number(req.body.amount * 100), // amount in the smallest currency unit - 50,000 paise i.e. 500 rupees
      currency: 'INR',
      //   receipt: 'order_rcptid_11',
    };
    const order = await razorpay_instance.orders.create(options);
    sendResponse(res, 'Success', 200, 'Payment successful', null, order, null);
  } catch (error) {
    sendResponse(res, 'Error', 400, 'Something went wrong', error, null, null);
  }
};
const getRazorpayKey = async (req, res) => {
  try {
    res.status(200).json({
      key: process.env.RAZORPAY_API_KEY,
    });
  } catch (error) {
    sendResponse(res, 'Error', 400, 'Something went wrong', error, null, null);
  }
};
const verifyPayment = (req, res, next) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET_KEY)
      .update(body.toString())
      .digest('hex');

    const isPaymentSuccess = expectedSignature === razorpay_signature;
    if (isPaymentSuccess) {
      res.status(200).json({ status: 'Success', message: 'Payment Successful' });
    } else {
      res.status(400).json({ status: 'Fail', message: 'Payment Fail' });
    }
  } catch (error) {
    sendResponse(res, 'Error', 400, 'Something went wrong', error, null, null);
  }
};

module.exports = { paymentCheckout, verifyPayment, getRazorpayKey };
