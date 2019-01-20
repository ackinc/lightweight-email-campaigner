const express = require('express');

const { User } = require('../common/db').models;
const jwtService = require('../services/jwt');
const oauthClientService = require('../services/oauthClient');

const router = express.Router();

// This route is hit when a user signs-in with Google in the front-end
// Input
//   [INACTIVE] req.body.authCode - the authorization code received on signing-in with Google
//   req.body.idToken - the id token received on signing-in with Google
// We add the user to the DB if not already present, and send a JWT in the response
// Fails with
//   500 response if
//     supplied ID Token (or auth code) is invalid
//       TODO: should be a 400 response; figure out how to catch the right error
//     database error
//     error generating JWT
router.post('/', async (req, res, next) => {
  const { idToken } = req.body;

  try {
    // INACTIVE
    // const {
    //   refreshToken, idToken,
    // } = await oauthClientService.exchangeAuthCodeForTokens(authCode);

    const {
      firstname, lastname, email,
    } = await oauthClientService.getUserDetailsFromIdToken(idToken);

    const [user] = await User.findOrCreate({ where: { email }, defaults: { firstname, lastname } });

    // INACTIVE
    // if (refreshToken) {
    //   user.refreshToken = refreshToken;
    //   await user.save();
    // }

    const token = await jwtService.generate({ id: user.id, email });

    return res.json({ token });
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
