const Cart = require('../models/cartModel');
const { sendResponse } = require('../utils/utils');

const getAllItemsFromCart = async (req, res) => {
  try {
    // we have to get all the items of a particular user. this can be done by filtering out the products of a certain userId
    const cartProducts = await Cart.find({ userId: req.query.id });
    if (cartProducts.length) {
      sendResponse(res, 'Success', 200, 'Products fetched from cart', null, cartProducts, cartProducts.length);
    } else {
      const error = new Error('Cart is empty.');
      sendResponse(res, 'Success', 401, 'Cart is empty.', error.message, null, 0);
    }
  } catch (error) {
    sendResponse(res, 'Error', 400, 'Something went wrong', error, null, null);
  }
};

const addToCart = async (req, res) => {
  try {
    const cartItem = new Cart(req.body);
    const doc = await cartItem.save();
    // we need to find the product after it is saved, becuase we cannot populate before saving the product.
    const item = await Cart.findOne({ _id: cartItem.id });
    sendResponse(res, 'Success', 200, 'Product added to cart', null, item, null);
  } catch (error) {
    sendResponse(res, 'Error', 400, 'Something went wrong', error, null, null);
  }
};

const deleteItemFromCart = async (req, res) => {
  try {
    // get item id to delete from cart
    await Cart.findByIdAndDelete(req.params.id);
    sendResponse(res, 'Success', 200, 'Item deleted from cart', null, {}, null);
  } catch (error) {
    sendResponse(res, 'Error', 400, 'Something went wrong', error, null, null);
  }
};

const updateCart = async (req, res) => {
  try {
    const updatedCart = await Cart.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
    const result = await updatedCart.populate('productId');
    sendResponse(res, 'Success', 200, 'Cart updated successfully', null, result, result.length);
  } catch (error) {
    sendResponse(res, 'Fail', 400, 'Failed to update cart', error, null, null);
  }
};

module.exports = { addToCart, getAllItemsFromCart, deleteItemFromCart, updateCart };
