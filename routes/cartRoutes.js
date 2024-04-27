const express = require('express');
const { getCartItemsOfUser, addToCart, deleteItemFromCart, updateCart } = require('../controllers/cartController');

const router = express.Router();

router.get('/cart-items', getCartItemsOfUser);
router.post('/add-item', addToCart);
router.delete('/delete-item/:id', deleteItemFromCart);
router.patch('/update-item/:id', updateCart);

module.exports = router;
