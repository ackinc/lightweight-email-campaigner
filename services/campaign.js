const urljoin = require('urljoin');

const db = require('../db');
const { sendMails } = require('./mail');
const { getRandomString } = require('../util');

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

module.exports = { executeCampaign };
