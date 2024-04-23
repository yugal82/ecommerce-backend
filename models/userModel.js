const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: Buffer, required: true },
  addresses: { type: [mongoose.Schema.Types.Mixed] },
  role: { type: String, required: true, default: 'user' },
  orders: { type: [mongoose.Schema.Types.Mixed] },
  salt: { type: Buffer },
});

const virtual = userSchema.virtual('id');
virtual.get(function () {
  return this._id;
});

userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const User = mongoose.model('users', userSchema);

module.exports = User;
