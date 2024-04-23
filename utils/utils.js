const passport = require('passport');

const sendResponse = (res, status, statusCode, message, error = null, data = null, dataLength) => {
  if (data !== null) {
    return res.status(statusCode).json({
      stats: status,
      message: message,
      data: data,
      length: dataLength,
    });
  } else if (error !== null) {
    return res.status(statusCode).json({
      stats: status,
      message: message,
      error: error,
    });
  }
};

const isAuthenticated = () => {
  return passport.authenticate('jwt');
};

const sanitizeUser = (user) => {
  return {
    id: user.id,
    email: user.email,
    name: user.firstName,
    addresses: user.addresses,
    orders: user.orders,
  };
};

module.exports = { sendResponse, isAuthenticated, sanitizeUser };
