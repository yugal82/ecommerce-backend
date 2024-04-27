const Order = require('../models/orderModel');
const { sendResponse } = require('../utils/utils');

const getAllOrdersByUserId = async (req, res) => {
  try {
    // we have to get all the orders of a particular user. this can be done by filtering out the orders of a certain user id
    const orders = await Order.find({ userId: req.user.id }).select('-userId');
    if (orders.length) {
      sendResponse(res, 'Success', 200, 'Orders fetched.', null, orders, orders.length);
    } else {
      const error = new Error('You have 0 orders');
      sendResponse(res, 'Success', 401, 'No orders.', error, null, 0);
    }
  } catch (error) {
    sendResponse(res, 'Error', 400, 'Something went wrong', error, null, null);
  }
};

const createOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    sendResponse(res, 'Success', 200, 'Order created.', null, order, null);
  } catch (error) {
    sendResponse(res, 'Error', 400, 'Something went wrong', error, null, null);
  }
};

const deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    sendResponse(res, 'Success', 200, 'Order deleted', null, {}, null);
  } catch (error) {
    sendResponse(res, 'Error', 400, 'Something went wrong', error, null, null);
  }
};

const updateOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
    sendResponse(res, 'Success', 200, 'Order updated successfully', null, updatedOrder, updatedOrder.length);
  } catch (error) {
    sendResponse(res, 'Fail', 400, 'Failed to update order', error, null, null);
  }
};

// there will be a controller `getAllOrders()` which can only be called if an admin has logged in.
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    if (orders.length) {
      sendResponse(res, 'Success', 200, 'Orders fetched.', null, orders, orders.length);
    } else sendResponse(res, 'Success', 200, 'You have not ordered anything.', null, orders, 0);
  } catch (error) {
    sendResponse(res, 'Error', 400, 'Something went wrong', error, null, null);
  }
};

module.exports = { createOrder, getAllOrdersByUserId, deleteOrder, updateOrder, getAllOrders };
