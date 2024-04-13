const express = require('express');
const { getAllItemsFromCart, addToCart, deleteItemFromCart } = require('../controllers/cartController');

const router = express.Router();

router.get('/cart-items', getAllItemsFromCart);
router.post('/add-item', addToCart);
router.delete('/delete-item/:id', deleteItemFromCart);

module.exports = router;
