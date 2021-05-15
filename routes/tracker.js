const express = require("express");
const tz = require("moment-timezone");
const path = require("path");

const db = require("../common/db");

const router = express.Router();

router.get("/:tracker", async (req, res) => {
  res.sendFile(path.join(__dirname, "../pixel.png"));

  const { tracker } = req.params;
  await db.models.CampaignLead.update(
    {
      openedAt: tz(new Date()).format("YYYY-MM-DD HH:mm:ss"),
    },
    { where: { tracker } }
  );
});

module.exports = router;
