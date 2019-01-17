const express = require('express');

const db = require('../db');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');
const { executeCampaign } = require('../services/campaign');

const router = express.Router();
router.use(ensureAuthenticated);

// Gets a single campaign's detailed view, or a summarized view of all campaigns
router.get('/:id?', async (req, res) => {
  const showCampaignList = req.params.id === undefined;

  if (showCampaignList) {
    const campaigns = await db.models.Campaign.findAll();
    res.json({ campaigns });
  } else {
    res.end();
  }
});

// New campaign
router.post('/', async (req, res, next) => {
  const {
    name, subject, body, leads,
  } = req.body;

  if (!name || !subject || !body || !leads.length) {
    return res.status(400).json({ error: 'REQUIRED_INPUT_MISSING' });
  }

  const { id: userId, email: userEmail } = req.decoded;

  let campaign;
  try {
    campaign = await db.models.Campaign.create({
      name, subject, body, userId,
    });
  } catch (e) {
    // if there was an error creating the campaign, we
    //   bail out without sending any emails
    return next(e);
  }

  res.end(); // no need to keep user waiting until all mails are sent

  // insert rows for Leads not already in DB
  await db.models.Lead.bulkCreate(leads.map(l => ({ email: l })), { ignoreDuplicates: true });

  // get the Lead objects for all leads involved in this campaign
  const allLeads = await db.models.Lead.findAll({ where: { email: leads } });
  executeCampaign(userEmail, campaign, allLeads);

  return undefined;
});

module.exports = router;
