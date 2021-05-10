const tokenService = require("../services/jwt");

// Ensures token sent in request is valid, decodes it, and attaches
//   it to the request object at req.decoded
// Responds with status code 401 if:
//   token missing
//   token expired
//   token invalid
async function ensureAuthenticated(req, res, next) {
  req.token = req.header("authorization") || req.query.token || req.body.token;

  if (!req.token) return res.status(401).json({ error: "TOKEN_MISSING" });

  try {
    req.decoded = await tokenService.decode(req.token);
  } catch (e) {
    const error =
      e.name === "TokenExpiredError" ? "TOKEN_EXPIRED" : "TOKEN_INVALID";
    return res.status(401).json({ error });
  }

  return next();
}

module.exports = ensureAuthenticated;
