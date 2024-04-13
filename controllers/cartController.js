const Cart = require('../models/cartModel');
const { sendResponse } = require('../utils/utils');

const getAllItemsFromCart = async (req, res) => {
  try {
    // we have to get all the items of a particular user. this can be done by filtering out the products of a certain userId
    const cartProducts = await Cart.find({ userId: req.body.userId });
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
    // add the product id to cart schema
    const cartItem = new Cart(req.body);
    const item = await cartItem.save();
    sendResponse(res, 'Success', 200, 'Product added to cart', null, item, null);
  } catch (error) {
    sendResponse(res, 'Error', 400, 'Something went wrong', error, null, null);
  }
};

module.exports = { addToCart, getAllItemsFromCart };
