const User = require('../models/userModel');
const { sendResponse } = require('../utils/utils');

const getUserById = async (req, res) => {
  try {
    const user = await User.findOneById({ _id: req.params.id });
    if (user) sendResponse(res, 'Success', 200, 'User found.', null, user, user.length);
    else {
      const error = new Error('Invalid id');
      sendResponse(res, 'Error', 404, 'User not found.', error, null, null);
    }
  } catch (error) {
    sendResponse(res, 'Error', 400, 'Something went wrong.', error, null, null);
  }
};

module.exports = { getUserById };
