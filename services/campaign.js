const db = require('../db');
const { sendMails } = require('./mail');

function executeCampaign(userEmail, campaign, leads) {
  const { subject, body } = campaign;

  sendMails(userEmail, leads.map(l => l.email), subject, body);

  db.models.CampaignLead.bulkCreate(leads.map(lead => ({
    campaignId: campaign.id,
    leadId: lead.id,
  })));
}

module.exports = { executeCampaign };
