function errorHandler(error, req, res, next) {
  logger.error(error.message);
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
}

module.exports = errorHandler;
