const User = require('../models/userModel');
const { sendResponse } = require('../utils/utils');

const signup = async (req, res) => {
  try {
    const userData = req.body;
    let user = new User(userData);
    user = await user.save();
    sendResponse(res, 'Success', 201, 'User successfully signed up', null, user, user.length);
  } catch (error) {
    sendResponse(res, 'Error', 400, 'Error while signing up.', error, null, null);
  }
};

const login = async (req, res) => {
  try {
    // login locgic here.
    sendResponse(res, 'Success', 201, 'User logged in', null, null, null);
  } catch (error) {
    sendResponse(res, 'Error', 400, 'Error while logging in.', error, null, null);
  }
};

module.exports = { signup, login };
