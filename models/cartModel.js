const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
  productId: {
    type: mongoose.Types.ObjectId,
    ref: 'products',
    required: true,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
});

const virtual = cartSchema.virtual('id');
virtual.get(function () {
  return this._id;
});

cartSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

cartSchema.pre(/^find/, function (next) {
  this.populate({ path: 'userId', select: '-password -role' }).populate({
    path: 'productId',
    select: '-sizes -colors -images -stock -deleted',
  });
  next();
});

const Cart = mongoose.model('carts', cartSchema);

module.exports = Cart;
