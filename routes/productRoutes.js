const express = require('express');
const { createProduct, getAllProducts, getProductById, updateProduct } = require('../controllers/productController');

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/create-product', createProduct);
router.patch('/:id', updateProduct);

module.exports = router;
