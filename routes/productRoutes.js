const express = require('express');
const {
    createProduct,
    getAllProducts,
} = require('../controllers/productController');

const router = express.Router();

router.get('/', getAllProducts);
router.post('/create-product', createProduct);

module.exports = router;
