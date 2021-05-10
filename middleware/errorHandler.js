// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error(err); // eslint-disable-line no-console
  if (!res.headersSent) res.status(500).json({ error: "SERVER_ERROR" });
}

module.exports = errorHandler;
