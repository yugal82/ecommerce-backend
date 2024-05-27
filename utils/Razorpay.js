const Razorpay = require('razorpay');
const razorpay_instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

module.exports = razorpay_instance;
