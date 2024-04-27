const express = require('express');
const {
  getAllOrdersByUserId,
  createOrder,
  deleteOrder,
  updateOrder,
  getAllOrders,
} = require('../controllers/orderController');

const router = express.Router();

router.get('/my-orders', getAllOrdersByUserId);
router.get('/', getAllOrders);
router.post('/create-order', createOrder);
router.delete('/delete-order/:id', deleteOrder);
router.patch('/update-order/:id', updateOrder);

module.exports = router;
