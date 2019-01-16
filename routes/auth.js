const express = require('express');

const db = require('../db');
const tokenService = require('../services/jwt');
const oauthClientService = require('../services/oauthClient');

const router = express.Router();

// This route is hit when a user signs-in with Google in the front-end
router.post('/', async (req, res, next) => {
  const { authCode } = req.body;

  try {
    const { accessToken, refreshToken, idToken } =
      await oauthClientService.exchangeAuthCodeForTokens(authCode);

    // Create the user if not already in DB
    const { firstname, lastname, email } =
      await oauthClientService.getUserDetailsFromIdToken(idToken);

    const [user] = await db.models.User
      .findOrCreate({ where: { email }, defaults: { firstname, lastname } });

    const token = await tokenService.generate({ id: user.id, email })
    res.json({ token });

    // if this user has already authorized our app,
    //   google will not supply another refresh token
    user.refreshToken = refreshToken || user.refreshToken;
    user.accessToken = accessToken;

    // TODO: if this call fails for a new user, we'll need to find
    //   some other way of getting a refresh token for him/her
    user.save();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
