const passport = require('passport');

const sendResponse = (res, status, statusCode, message, error = null, data = null, dataLength) => {
  if (data !== null) {
    return res.status(statusCode).json({
      status: status,
      message: message,
      data: data,
      length: dataLength,
    });
  } else if (error !== null) {
    return res.status(statusCode).json({
      status: status,
      message: message,
      error: error.message,
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
    name: user.name,
    addresses: user.addresses,
    orders: user.orders,
    role: user.role,
    phone: user.phone,
  };
};

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) token = req.cookies.jwt;
  return token;
};

module.exports = { sendResponse, isAuthenticated, sanitizeUser, cookieExtractor };
