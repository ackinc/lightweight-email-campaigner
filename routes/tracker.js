const express = require('express');

const db = require('../db');

const router = express.Router();

// This route is hit whenever a lead opens an email we sent them
router.get('/:id', (req, res) => {
  const now = new Date();
  db.query(`UPDATE campaignleads
            SET openAt=${now}, updatedAt=${now}
            WHERE tracker=${req.params.id}
            AND openAt IS NULL`);
  res.end();
});

module.exports = router;
