const express = require('express');

const { User } = require('../common/db').models;
const jwtService = require('../services/jwt');
const oauthClientService = require('../services/oauthClient');

const router = express.Router();

// This route is hit when a user signs-in with Google in the front-end
// Input
//   req.body.authCode - the authorization code received on signing-in with Google
// We add the user to the DB if not already present, and send a JWT in the response
// Fails with
//   400 response if
//     supplied ID Token is invalid
//   500 response if
//     database error
//     error generating JWT
router.post('/', async (req, res, next) => {
  const { authCode } = req.body;

  try {
    const { refreshToken, idToken } = await oauthClientService.exchangeAuthCodeForTokens(authCode);

    const {
      firstname, lastname, email,
    } = await oauthClientService.getUserDetailsFromIdToken(idToken);

    const [user] = await User.findOrCreate({ where: { email }, defaults: { firstname, lastname } });

    if (refreshToken) {
      user.refreshToken = refreshToken;
      await user.save();
    }

    const token = await jwtService.generate({ id: user.id, email });

    return res.json({ token });
  } catch (e) {
    if (/token/i.test(e.message)) { // error due to bad ID Token
      return res.status(400).json({ error: 'TOKEN_INVALID' });
    }

    return next(e);
  }
});

module.exports = router;
