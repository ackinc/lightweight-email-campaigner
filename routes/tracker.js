const tz = require('moment-timezone');
const express = require('express');

const db = require('../db');

const router = express.Router();

// This route is the webhook we're providing to sendgrid for event capturing
router.get('/', (req, res) => {
  res.end();

  const events = req.body;
  events.forEach(({ event, tracker, timestamp }) => {
    const fieldToUpdate = event === 'delivered' ? 'deliveredAt' : 'openedAt';
    const eventTime = tz(timestamp * 1000).utc().format('YYYY-MM-DD HH:mm:ss');
    db.query(`UPDATE campaignleads
              SET ${fieldToUpdate}='${eventTime}', updatedAt=UTC_TIMESTAMP()
              WHERE tracker='${tracker}' AND ${fieldToUpdate} IS NULL`);
  });
});

module.exports = router;
