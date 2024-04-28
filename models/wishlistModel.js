const mongoose = require('mongoose');

const wishlistSchema = mongoose.Schema({
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
});

const virtual = wishlistSchema.virtual('id');
virtual.get(function () {
  return this._id;
});

wishlistSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

wishlistSchema.pre(/^find/, function (next) {
  this.populate({ path: 'userId', select: '-password -role -salt' }).populate({
    path: 'productId',
    select: '-sizes -colors -images -stock -deleted',
  });
  next();
});

const Wishlist = mongoose.model('wishlist', wishlistSchema);

module.exports = Wishlist;
