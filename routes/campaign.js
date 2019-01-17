const express = require('express');

const db = require('../db');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');
const { executeCampaign } = require('../services/campaign');

const router = express.Router();
router.use(ensureAuthenticated);

// Gets a summarized view of all campaigns
router.get('/', async (req, res) => {
  const campaigns = await db.query(`
    SELECT t1.id, name, subject, body, t1.createdAt
            COUNT(*) n_leads,
            COUNT(deliveredAt IS NOT NULL) n_delivered,
            COUNT(openedAt IS NOT NULL) n_opened
    FROM khonvo_test.campaigns t1
    INNER JOIN khonvo_test.campaignleads t2 ON t1.id = t2.campaignId
    WHERE t1.userId = ${req.decoded.id}
    GROUP BY t1.id
  `, { type: db.QueryTypes.SELECT });
  res.json({ campaigns });
});

// Get the leads who were sent emails for the specified campaign
router.get('/:campaign_id/leads', async (req, res) => {
  const leads = await db.query(`
    SELECT t1.id, email, deliveredAt, openedAt
    FROM leads t1
    INNER JOIN campaignleads t2 ON t2.leadId = t1.id
    WHERE t2.campaignId = ${req.params.campaign_id}
  `, { type: db.QueryTypes.SELECT });
  res.json({ leads });
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
