const express = require('express');
const urljoin = require('urljoin');

const db = require('../db');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');
const retrieveUser = require('../middleware/retrieveUser');
const { getRandomString } = require('../utils');
const { sendMails } = require('../services/mail');

const router = express.Router();
router.use(ensureAuthenticated);

// New campaign
router.post('/', retrieveUser, async (req, res, next) => {
  const { name, subject, body, leads } = req.body;

  let campaign;
  try {
    campaign = await db.models.Campaign.create({ name, subject, body, user_id: req.user.id });
  } catch (e) {
    return next(e);
  }

  res.end(); // no need to keep user waiting until all mails are sent

  // insert rows for Leads not already in DB
  await db.models.Lead.bulkCreate(leads.map(l => ({ email: l })), { ignoreDuplicates: true });

  // get the Lead objects for all leads involved in this campaign
  const allLeads = await db.models.Lead.findAll({ where: { email: leads } })
  executeCampaign(req.user, campaign, allLeads);
});

function executeCampaign(user, campaign, leads) {
  const { subject, body } = campaign;
  const trackers = {};

  // see type definition of mailsToSend in services/mail.js
  const mailsToSend = leads.map(lead => {
    const tracker = getRandomString(20);
    trackers[lead.id] = tracker;
    return ({
      subject,
      body: injectTracker(body, tracker),
      lead,
    });
  });

  sendMails(user, mailsToSend, ({ success, failure }) => {
    // create CampaignLead records as appropriate

    db.models.CampaignLead.bulkCreate(success.map(lead => ({
      campaign_id: campaign.id,
      lead_id: lead.id,
      delivered: true,
      tracker: trackers[lead.id],
    })));

    db.models.CampaignLead.bulkCreate(failure.map(lead => ({
      campaign_id: campaign.id,
      lead_id: lead.id,
      delivered: false,
      tracker: trackers[lead.id],
    })));
  });
}

function injectTracker(mailBody, tracker) {
  const trackerEndpoint = urljoin(process.env.BACKEND_URL, `/tracker/${tracker}`);
  return mailBody += `<img src="${trackerEndpoint}" />`;
}
