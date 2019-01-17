const express = require('express');

const db = require('../db');

const router = express.Router();

// This route is hit whenever a lead opens an email we sent them
router.get('/:id', (req, res) => {
  db.query(`UPDATE campaignleads
            SET delivered=true, openAt=NOW(), updatedAt=NOW()
            WHERE tracker='${req.params.id}'
            AND openAt IS NULL`);
  res.end();
});

module.exports = router;
