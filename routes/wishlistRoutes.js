const express = require('express');
const { getWishlistItemsOfUser, addToWishlist, deleteItemFromWishlist } = require('../controllers/wishlistController');

const router = express.Router();

router.get('/', getWishlistItemsOfUser);
router.post('/add-item', addToWishlist);
router.delete('/delete-item/:id', deleteItemFromWishlist);

module.exports = router;
