const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product must have a name.'],
  },
  price: {
    type: Number,
    required: [true, 'Product must have a price.'],
  },
  discountPercentage: {
    type: Number,
    min: [1, 'Discount must be at least 1%'],
    max: [99, 'Discount must be at most 99'],
    default: 0,
  },
  description: {
    type: String,
    required: [true, 'Product must have a description.'],
  },
  images: {
    type: [String],
    required: [true],
  },
  imageSrc: {
    type: String,
    required: [true, 'Product must have a thumbnail URL.'],
  },
  colors: {
    type: [String],
    // required: [true],
  },
  sizes: {
    type: [
      {
        name: {
          type: String,
          required: [true],
        },
        inStock: {
          type: Boolean,
        },
      },
    ],
    required: [true],
    _id: false,
  },
  details: {
    type: String,
    // required: [true],
  },
  rating: {
    type: Number,
    min: [0, 'Reviews must be atleast 1'],
    max: [5, 'Reviews can at max be 5'],
    default: 0,
  },
  stock: {
    type: Number,
    min: [0, 'Stock must be atleast 0'],
  },
  category: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
});

const virtual = productSchema.virtual('id');
virtual.get(function () {
  return this._id;
});

productSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const Product = mongoose.model('products', productSchema);

module.exports = Product;
