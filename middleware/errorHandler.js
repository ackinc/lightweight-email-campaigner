function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  console.error(err); // eslint-disable-line no-console
  if (!res.headersSent) res.status(500).json({ error: 'SERVER_ERROR' });
}

module.exports = errorHandler;
