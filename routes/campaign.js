const express = require('express');

const db = require('../db');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');
const retrieveUser = require('../middleware/retrieveUser');
const { executeCampaign } = require('../services/campaign');

const router = express.Router();
router.use(ensureAuthenticated);

// New campaign
router.post('/', retrieveUser, async (req, res, next) => {
  const {
    name, subject, body, leads,
  } = req.body;

  let campaign;
  try {
    campaign = await db.models.Campaign.create({
      name, subject, body, user_id: req.user.id,
    });
  } catch (e) {
    return next(e);
  }

  res.end(); // no need to keep user waiting until all mails are sent

  // insert rows for Leads not already in DB
  await db.models.Lead.bulkCreate(leads.map(l => ({ email: l })), { ignoreDuplicates: true });

  // get the Lead objects for all leads involved in this campaign
  const allLeads = await db.models.Lead.findAll({ where: { email: leads } });
  executeCampaign(req.user, campaign, allLeads);

  return undefined;
});
