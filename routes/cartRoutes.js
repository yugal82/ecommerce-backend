const express = require('express');
const { getAllItemsFromCart, addToCart } = require('../controllers/cartController');

const router = express.Router();

router.get('/cart-items', getAllItemsFromCart);
router.post('/add-item', addToCart);

module.exports = router;
