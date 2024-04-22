const User = require('../models/userModel');
const { sendResponse } = require('../utils/utils');

const signup = async (req, res) => {
  try {
    const isExisting = await User.findOne({ email: req.body.email });
    if (isExisting) {
      const error = new Error("User already exists. Can't sign up with the same email address");
      sendResponse(res, 'Fail', 400, 'User already exists', error.message, null, null);
    }
    const userData = req.body;
    let user = new User(userData);
    user = await user.save();
    sendResponse(res, 'Success', 201, 'User successfully signed up', null, user, user.length);
  } catch (error) {
    sendResponse(res, 'Error', 400, 'Error while signing up.', error.message, null, null);
  }
};

const login = async (req, res) => {
  try {
    // login locgic here.
    // passportJs auth implementation done in app.js file
    res.json({ status: 'Success', user: req.user });
  } catch (error) {
    sendResponse(res, 'Error', 400, 'Error while logging in.', error.message, null, null);
  }
};

module.exports = { signup, login };
