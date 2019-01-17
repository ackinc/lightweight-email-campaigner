const db = require('../db');
const { sendMails } = require('./mail');

function executeCampaign(user, campaign, leads) {
  const { subject, body } = campaign;

  sendMails(user.email, leads.map(l => l.email), subject, body);

  db.models.CampaignLead.bulkCreate(leads.map(lead => ({
    campaignId: campaign.id,
    leadId: lead.id,
  })));
}

module.exports = { executeCampaign };
