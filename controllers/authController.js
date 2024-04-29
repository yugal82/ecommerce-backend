const User = require('../models/userModel');
const { sendResponse, sanitizeUser } = require('../utils/utils');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
  try {
    const isExisting = await User.findOne({ email: req.body.email });
    if (isExisting) {
      const error = new Error("User already exists. Can't sign up with the same email address");
      sendResponse(res, 'Fail', 400, 'User already exists', error, null, null);
    }

    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', async (err, hashedPassword) => {
      const userData = req.body;
      let user = new User({ ...userData, password: hashedPassword, salt: salt });
      const doc = await user.save();

      req.login(sanitizeUser(user), (err) => {
        if (err) sendResponse(res, 'Fail', 400, 'Something went wrong', err, null, null);
        else {
          const jwtToken = jwt.sign(sanitizeUser(user), process.env.SECRET_KEY);
          res
            .cookie('jwt', jwtToken, { expires: new Date(Date.now() + 3600000), httpOnly: true })
            .status(201)
            .json({ id: doc.id, role: doc.role });
        }
      });
    });
  } catch (error) {
    sendResponse(res, 'Error', 400, 'Error while signing up.', error, null, null);
  }
};

const login = async (req, res) => {
  try {
    // login locgic here.
    // passportJs auth implementation done in app.js file
    res
      .cookie('jwt', req.user.jwtToken, { expires: new Date(Date.now() + 3600000), httpOnly: true })
      .json({ status: 'Success', user: req.user });
  } catch (error) {
    sendResponse(res, 'Error', 400, 'Error while logging in.', error, null, null);
  }
};

const logout = async (req, res) => {
  try {
    req.logout(function (err) {
      if (err) return next(err);
      res.redirect('/');
    });
  } catch (error) {
    sendResponse(res, 'Fail', 400, 'Error while logging out.', error, null, null);
  }
};

module.exports = { signup, login, logout };
