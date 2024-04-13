const Product = require('../models/productModel');
const { sendResponse } = require('../utils/utils');

// controllers for creating a product, fetching all products, updating a particular product, deleting a product, etc. will be defined in this module.

const getAllProducts = async (req, res) => {
  try {
    // if there are any queries such as sort, category, brand, etc. then apply respective queries and then fetch all products from the database.
    // based on the model of the product, user can query through the following parameters:
    // -category - Jeans/Shirts/Tshirts/Shorts, etc. --------DONE
    // -brand - Roadster, Jack&Jones, etc --------DONE
    // -rating - more than 4, less than 3, etc --------DONE
    // -colors - white, black, etc --------DONE
    // -price range - 500 to 800, 800 to 1000, etc.
    const queryObj = { ...req?.query };
    const excludeFields = ['sort', 'order', 'price', 'rating'];
    excludeFields.forEach((field) => delete queryObj[field]);

    let query = Product.find({ ...queryObj, deleted: { $ne: true } });

    // sorting can be done on the basis of - High to low, Low to high, Best Rating.
    // for sorting, the sorting parameter would be either price or rating.
    // And with sorting, there shall follow order parameter - ascending or descending.
    // sorting is done here
    if (req?.query?.sort) {
      let sortParams = { [req?.query?.sort]: req?.query?.order };
      query = query.sort(sortParams);
    }

    // once all the query are chained onto the find(), we call exec() method to execute the query.
    const products = await query.exec();
    sendResponse(res, 'Success', 200, 'Succesfully fetched products', null, products, products.length);
  } catch (error) {
    sendResponse(res, 'Fail', 400, 'Something went wrong while fetching the products.', error, null, null);
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById({ _id: req.params.id });
    if (product === null) {
      const error = new Error('Invalid product Id');
      sendResponse(res, 'Fail', 400, 'Invalid Product Id!', error.message, null, null);
    } else {
      sendResponse(res, 'Success', 200, 'Product found!', null, product, product.length);
    }
  } catch (error) {
    sendResponse(res, 'Fail', 400, 'Something went wrong while fetching the product', error, null, null);
  }
};

const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const createdProduct = await product.save();
    sendResponse(res, 'Success', 201, 'Product created successfully', null, createdProduct, createdProduct.length);
  } catch (error) {
    sendResponse(res, 'Success', 201, 'Something went wrong while creating the product.', error, null, null);
  }
};

const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
    sendResponse(res, 'Success', 200, 'Product updated successfully', null, updatedProduct, updatedProduct.length);
  } catch (error) {
    sendResponse(res, 'Fail', 400, 'Failed to update product', error, null, null);
  }
};

module.exports = { createProduct, getAllProducts, getProductById, updateProduct };
