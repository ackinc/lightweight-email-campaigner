const db = require('../db');

// Retrieves the current logged-in user from DB and makes
//   him/her available at req.user
async function retrieveUser(req, res, next) {
  if (!req.decoded) {
    console.error('retrieveUser was called without ensureAuthenticated check');
    return res.status(500).json({ error: 'SERVER_ERROR' });
  }

  try {
    req.user = await db.models.User.findById(req.decoded.id);
    next();
  } catch (e) {
    res.status(500).json({ error: 'SERVER_ERROR' });
  }
}

module.exports = retrieveUser;
