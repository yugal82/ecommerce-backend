const express = require('express');
const { createProduct, getAllProducts, getProductById } = require('../controllers/productController');

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/create-product', createProduct);

module.exports = router;
