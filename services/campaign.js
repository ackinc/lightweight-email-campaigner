const db = require('../db');
const { sendPersonalizedMails } = require('./mail');
const { getRandomString } = require('../utils');

function executeCampaign(userEmail, campaign, leads) {
  const { subject, body } = campaign;
  const trackers = {};
  const trackerSize = 20;

  leads.forEach((l) => { trackers[l.id] = getRandomString(trackerSize); });

  sendPersonalizedMails(
    userEmail,
    leads.map(l => ({ to: l.email, customArgs: { tracker: trackers[l.id] } })),
    subject,
    body,
  );

  db.models.CampaignLead.bulkCreate(leads.map(l => ({
    campaignId: campaign.id,
    leadId: l.id,
    tracker: trackers[l.id],
  })));
}

module.exports = { executeCampaign };
