const Cart = require('../models/cartModel');
const { sendResponse } = require('../utils/utils');

const getCartItemsOfUser = async (req, res) => {
  try {
    // we have to get all the items of a particular user. this can be done by filtering out the products of a certain userId
    const cartProducts = await Cart.find({ userId: req.user.id });
    if (cartProducts.length) {
      sendResponse(res, 'Success', 200, 'Products fetched from cart', null, cartProducts, cartProducts.length);
    } else {
      const error = new Error('Cart is empty.');
      sendResponse(res, 'Success', 200, 'Cart is empty.', error, [], 0);
    }
  } catch (error) {
    sendResponse(res, 'Error', 400, 'Something went wrong', error, null, null);
  }
};

const addToCart = async (req, res) => {
  try {
    const cartItem = new Cart({
      productId: req.body.productId,
      userId: req.user.id,
      quantity: req.body.quantity,
      size: req.body.size,
    });
    const doc = await cartItem.save();
    // // we need to find the product after it is saved, becuase we cannot populate before saving the product.
    const item = await Cart.findOne({ _id: doc.id });
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
    // the id will be of item in the cart.
    const updatedCart = await Cart.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
    const result = await updatedCart.populate({ path: 'productId', select: '-deleted -stock -sizes -colors -images' });
    sendResponse(res, 'Success', 200, 'Cart updated successfully', null, result, result.length);
  } catch (error) {
    sendResponse(res, 'Fail', 400, 'Failed to update cart', error, null, null);
  }
};

module.exports = { addToCart, getCartItemsOfUser, deleteItemFromCart, updateCart };
