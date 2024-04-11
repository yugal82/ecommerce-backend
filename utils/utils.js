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

module.exports = { sendResponse };
