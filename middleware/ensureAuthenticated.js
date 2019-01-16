const tokenService = require('../services/jwt');

// Checks that the user who sent the request has a valid token
// If yes, the decoded token is made available
//   to next middleware at req.decoded
// else, a 401 response is immediately sent
async function ensureAuthenticated(req, res, next) {
  req.token = req.headers.authorization ||
    req.query.token ||
    req.cookies.token ||
    req.body.token;

  if (!req.token) return res.status(401).json({ error: 'TOKEN_MISSING' });

  try {
    req.decoded = await tokenService.decode(req.token);
    next();
  } catch (e) {
    res.status(401).json({
      error: e.name === 'TokenExpiredError' ? 'TOKEN_EXPIRED' : 'TOKEN_INVALID',
    });
  }
}

module.exports = ensureAuthenticated;
