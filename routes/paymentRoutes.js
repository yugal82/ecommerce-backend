const express = require('express');
const { paymentCheckout, verifyPayment, getRazorpayKey } = require('../controllers/paymentController');
const router = express.Router();

router.get('/get-key', getRazorpayKey);
router.post('/checkout', paymentCheckout);
router.post('/verify', verifyPayment);

module.exports = router;
