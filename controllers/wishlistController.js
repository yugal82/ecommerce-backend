const Wishlist = require('../models/wishlistModel');
const { sendResponse } = require('../utils/utils');

const getWishlistItemsOfUser = async (req, res) => {
  try {
    // we have to get all the items of a particular user. this can be done by filtering out the products of a certain userId
    const wishlistItems = await Wishlist.find({ userId: req.user.id });
    if (wishlistItems.length) {
      sendResponse(res, 'Success', 200, 'Products fetched from cart', null, wishlistItems, wishlistItems.length);
    } else {
      const error = new Error('Wishlist is empty.');
      sendResponse(res, 'Success', 200, 'Wishlist is empty.', error, [], 0);
    }
  } catch (error) {
    sendResponse(res, 'Error', 400, 'Something went wrong', error, null, null);
  }
};

const addToWishlist = async (req, res) => {
  try {
    const wishlistItem = new Wishlist({
      productId: req.body.productId,
      userId: req.user.id,
    });
    const doc = await wishlistItem.save();
    // // we need to find the product after it is saved, becuase we cannot populate before saving the product.
    const item = await Wishlist.findOne({ _id: doc.id });
    sendResponse(res, 'Success', 200, 'Product added to cart', null, item, null);
  } catch (error) {
    sendResponse(res, 'Error', 400, 'Something went wrong', error, null, null);
  }
};

const deleteItemFromWishlist = async (req, res) => {
  try {
    // get item id to delete from cart
    await Wishlist.findByIdAndDelete(req.params.id);
    sendResponse(res, 'Success', 200, 'Item deleted from cart', null, {}, null);
  } catch (error) {
    sendResponse(res, 'Error', 400, 'Something went wrong', error, null, null);
  }
};

module.exports = { addToWishlist, getWishlistItemsOfUser, deleteItemFromWishlist };
