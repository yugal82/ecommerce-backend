const Product = require('../models/productModel');

// controllers for creating a product, fetching all products, updating a particular product, deleting a product, etc. will be defined in this module.

const getAllProducts = async (req, res) => {
    try {
        // if there are any queries such as sort, category, brand, etc. then apply respective queries and then fetch all products from the database.
        const products = await Product.find();
        res.status(200).json({
            status: 'Success',
            message: 'Succesfully fetched all products',
            data: products,
            length: products.length,
        });
    } catch (error) {
        res.status(400).json({
            stats: 'Fail',
            message: 'Something went wrong while fetching the products.',
            error: error,
        });
    }
};

const createProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        const createdProduct = await product.save();
        res.status(201).json({
            status: 'Success',
            message: 'Product created successfully',
            product: createdProduct,
        });
    } catch (error) {
        res.status(400).json({
            stats: 'Fail',
            message: 'Something went wrong while creating the product.',
            error: error,
        });
    }
};

module.exports = { createProduct, getAllProducts };
