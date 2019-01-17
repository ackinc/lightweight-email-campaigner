const express = require('express');

const db = require('../db');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');
const { executeCampaign } = require('../services/campaign');

const router = express.Router();
router.use(ensureAuthenticated);

// Responds with a summary view of all campaigns executed by the logged-in user
// Fails with 500 response if
//   database error
router.get('/', async (req, res, next) => {
  try {
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
    return res.json({ campaigns });
  } catch (e) {
    res.status(500).error({ error: 'SERVER_ERROR' });
    return next(e);
  }
});

// Responds with the leads who were sent emails for the specified campaign
// Input
//   req.params.campaign_id - the ID of the campaign whose leads are wanted
// Fails with
//   403 response if
//     current user is not allowed access to specified campaign
//   404 response if
//     no campaign was found with supplied ID
//   500 response if
//     database error
router.get('/:campaign_id/leads', async (req, res, next) => {
  try {
    const leads = await db.query(`
      SELECT t1.userId userId, t3.id leadId, email, deliveredAt, openedAt
      FROM campaigns t1
      INNER JOIN campaignleads t2 ON t2.campaignId = t1.id
      INNER JOIN leads t3 ON t2.leadId = t3.id
      WHERE t1.id = ${req.params.campaign_id}
    `, { type: db.QueryTypes.SELECT });

    if (leads.length === 0) {
      return res.status(404).json({ error: 'NOT_FOUND' });
    }

    // check if current user is allowed access to this campaign
    if (leads[0].userId !== req.decoded.id) {
      return res.status(403).json({ error: 'NOT_ALLOWED' });
    }

    leads.forEach(l => delete l.userId); // eslint-disable-line no-param-reassign

    return res.json({ leads });
  } catch (e) {
    res.status(500).error({ error: 'SERVER_ERROR' });
    return next(e);
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
