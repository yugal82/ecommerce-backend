const express = require('express');
const { getAllItemsFromCart, addToCart, deleteItemFromCart, updateCart } = require('../controllers/cartController');

const router = express.Router();

router.get('/cart-items', getAllItemsFromCart);
router.post('/add-item', addToCart);
router.delete('/delete-item/:id', deleteItemFromCart);
router.patch('/update-cart/:id', updateCart);

module.exports = router;
