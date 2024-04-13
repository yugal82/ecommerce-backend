const express = require('express');
const { getAllOrdersByUserId, createOrder, deleteOrder } = require('../controllers/orderController');

const router = express.Router();

router.get('/:id', getAllOrdersByUserId);
router.post('/create-order', createOrder);
router.delete('/delete-order/:id', deleteOrder);

module.exports = router;
