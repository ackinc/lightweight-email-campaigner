const express = require("express");
const tz = require("moment-timezone");

const db = require("../common/db");

const router = express.Router();

// This route is the webhook we're providing to sendgrid for event capturing
// Input
//   req.body - an array of event objects; each event has this shape { event, tracker, timestamp }
router.post("/", (req, res) => {
  res.end();

  const events = req.body;
  const allowedEvents = ["delivered", "open"];
  events.forEach(({ event, tracker, timestamp }) => {
    if (!allowedEvents.includes(event)) return;
    if (!tracker) return;

    const fieldToUpdate = event === "delivered" ? "deliveredAt" : "openedAt";
    const eventTime = tz(timestamp * 1000)
      .utc()
      .format("YYYY-MM-DD HH:mm:ss");

    db.query(
      `
      UPDATE campaignleads
      SET "${fieldToUpdate}" =:eventTime, "updatedAt"=now()
      WHERE tracker=:tracker AND "${fieldToUpdate}" IS NULL
    `,
      { replacements: { eventTime, tracker } }
    );
  });
});

module.exports = router;
