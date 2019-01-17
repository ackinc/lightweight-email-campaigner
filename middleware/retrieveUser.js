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
    return next(new Error('retrieveUser was called without ensureAuthenticated check'));
  }

  try {
    req.user = await User.findById(req.decoded.id);
  } catch (e) {
    return next(e);
  }

  return next();
}

module.exports = retrieveUser;
