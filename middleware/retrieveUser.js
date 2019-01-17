const { User } = require('../common/db').models;

// Retrieves the current logged-in user from DB and makes
//   it available at req.user
// This middleware relies on ensureAuthenticated putting the
//   decoded token at req.decode
// Input
//   req.decoded - the decoded JWT
// Fails with 500 response if
//   called before ensureAuthenticated
//   database error
async function retrieveUser(req, res, next) {
  if (!req.decoded) {
    res.status(500).json({ error: 'SERVER_ERROR' });
    return next(new Error('retrieveUser was called without ensureAuthenticated check'));
  }

  try {
    req.user = await User.findById(req.decoded.id);
  } catch (e) {
    res.status(500).json({ error: 'SERVER_ERROR' });
    return next(e);
  }

  return next();
}

module.exports = retrieveUser;
