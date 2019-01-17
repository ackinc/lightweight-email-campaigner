const { CampaignLead } = require('../common/db').models;
const { sendPersonalizedMails } = require('./mail');
const { getRandomString } = require('../common/utils');

// Adds trackers for each mail, inserts appropriate campaign-lead links in DB
//   and sends the emails
async function executeCampaign(userEmail, campaign, leads) {
  const { id: campaignId, subject, body } = campaign;
  const trackers = {};
  const trackerSize = 20;

  leads.forEach((l) => { trackers[l.id] = getRandomString(trackerSize); });

  await CampaignLead.bulkCreate(leads.map(l => ({
    campaignId,
    leadId: l.id,
    tracker: trackers[l.id],
  })));

  await sendPersonalizedMails(
    userEmail,
    leads.map(l => ({ to: l.email, customArgs: { tracker: trackers[l.id] } })),
    subject,
    body,
  );
}

module.exports = { executeCampaign };
