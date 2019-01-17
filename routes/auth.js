const express = require('express');

const db = require('../db');
const tokenService = require('../services/jwt');
const oauthClientService = require('../services/oauthClient');

const router = express.Router();

// This route is hit when a user signs-in with Google in the front-end
router.post('/', async (req, res, next) => {
  const { idToken } = req.body;

  try {
    // Create the user if not already in DB
    const {
      firstname, lastname, email,
    } = await oauthClientService.getUserDetailsFromIdToken(idToken);

    const [user] = await db.models.User
      .findOrCreate({ where: { email }, defaults: { firstname, lastname } });

    const token = await tokenService.generate({ id: user.id, email });
    res.json({ token });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
