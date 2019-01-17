const db = require('../db');

// Retrieves the current logged-in user from DB and makes
//   him/her available at req.user
async function retrieveUser(req, res, next) {
  if (!req.decoded) {
    res.status(500).json({ error: 'SERVER_ERROR' });
    throw new Error('retrieveUser was called without ensureAuthenticated check');
  }

  try {
    req.user = await db.models.User.findById(req.decoded.id);
    next();
  } catch (e) {
    res.status(500).json({ error: 'SERVER_ERROR' });
  }

  return undefined;
}

module.exports = retrieveUser;
