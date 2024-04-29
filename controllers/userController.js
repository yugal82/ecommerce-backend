const User = require('../models/userModel');
const { sendResponse } = require('../utils/utils');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password -role');
    sendResponse(res, 'Success', 200, 'Users fetched.', null, users, users.length);
  } catch (error) {
    sendResponse(res, 'Error', 400, 'Something went wrong.', error, null, null);
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.params.id }, '-password -salt');
    if (user) sendResponse(res, 'Success', 200, 'User found.', null, user, user.length);
    else {
      const error = new Error('Invalid id');
      sendResponse(res, 'Error', 404, 'User not found.', error, null, null);
    }
  } catch (error) {
    sendResponse(res, 'Error', 400, 'Something went wrong.', error, null, null);
  }
};

const updateUser = async (req, res) => {
  try {
    // first check if the user exists.
    const user = await User.findById({ _id: req.user.id });
    if (!user) {
      const error = new Error('Invalid Id');
      sendResponse(res, 'Fail', 404, 'User not found', error, null, null);
    }

    const updatedUser = await User.findByIdAndUpdate({ _id: req.user.id }, req.body, { new: true }).select(
      '-password -salt'
    );
    sendResponse(res, 'Success', 200, 'User updated', null, updatedUser, updatedUser.length);
  } catch (error) {
    sendResponse(res, 'Error', 400, 'Something went wrong.', error, null, null);
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete({ _id: req.user.id });
    sendResponse(res, 'Success', 200, 'User deleted', null, user, null);
  } catch (error) {
    sendResponse(res, 'Error', 400, 'Something went wrong.', error, null, null);
  }
};

module.exports = { getUserById, getAllUsers, updateUser, deleteUser };
