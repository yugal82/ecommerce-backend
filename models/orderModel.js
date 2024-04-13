const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  items: { type: [mongoose.SchemaTypes.Mixed], required: true },
  totalAmount: { type: Number },
  totalItems: { type: Number },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  paymentMethod: { type: String, required: true },
  status: { type: String, default: 'pending' },
  selectedAddress: {
    type: mongoose.SchemaTypes.Mixed,
    required: true,
  },
});

const virtual = orderSchema.virtual('id');
virtual.get(function () {
  return this._id;
});

orderSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

// orderSchema.pre(/^find/, function (next) {
//   this.populate({ path: 'userId', select: '-password -role' });
//   next();
// });

const Order = mongoose.model('orders', orderSchema);

module.exports = Order;
