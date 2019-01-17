const express = require('express');

const db = require('../db');
const tokenService = require('../services/jwt');
const oauthClientService = require('../services/oauthClient');

const router = express.Router();

// This route is hit when a user signs-in with Google in the front-end
// Input
//   req.body.idToken - the idToken received from signing-in with Google in the front-end
// We add the user to the DB if not already present, and send a JWT in the response
// Fails with
//   400 response if
//     supplied ID Token is invalid
//   500 response if
//     database error
//     error generating JWT
router.post('/', async (req, res, next) => {
  const { idToken } = req.body;

  try {
    const {
      firstname, lastname, email,
    } = await oauthClientService.getUserDetailsFromIdToken(idToken);

    const [user] = await db.models.User
      .findOrCreate({ where: { email }, defaults: { firstname, lastname } });

    const token = await tokenService.generate({ id: user.id, email });

    return res.json({ token });
  } catch (e) {
    if (/token/i.test(e.message)) { // error due to bad ID Token
      return res.status(400).json({ error: 'TOKEN_INVALID' });
    }

    res.status(500).json({ error: 'SERVER_ERROR' });
    return next(e);
  }
});

module.exports = router;
