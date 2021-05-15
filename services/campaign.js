/* This module contains helpers for creating a new campaign */

const Isemail = require("isemail");
const Joi = require("joi");

const { Campaign, CampaignLead, Lead } = require("../common/db").models;
const { sendEmails } = require("./mail");
const { getRandomString } = require("../common/utils");

const validNewCampaignInput = Joi.object().keys({
  name: Joi.string()
    .min(1)
    .required()
    .error(new Error("Campaign name must be a non-empty string")),

  subject: Joi.string()
    .min(1)
    .required()
    .error(new Error("Campaign subject must be a non-empty string")),

  body: Joi.string()
    .min(1)
    .required()
    .error(new Error("Campaign body must be a non-empty string")),

  leads: Joi.array()
    .min(1)
    .required()
    .error(new Error("A campaign must have at least one recipient")),
});

function validateNewCampaignInput(data) {
  return Joi.validate(data, validNewCampaignInput);
}

// inserts campaign and any new leads into DB, then
// returns Campaign and list of Leads
async function recordCampaignRequest(
  userId,
  { name, subject, body },
  recipientEmails
) {
  const campaign = await Campaign.create({
    name,
    subject,
    body,
    userId,
  });

  // insert rows for leads not already in DB
  // we could continue executing the campaign if this query failed,
  //   leads that were not already in the DB would not be sent the email
  // but it is probably better to let the user re-try the campaign again
  await Lead.bulkCreate(
    recipientEmails
      .filter((email) => Isemail.validate(email))
      .map((email) => ({ email })),
    { ignoreDuplicates: true }
  );

  // we need the full lead objects to be able to insert campaign-lead links later
  const leads = await Lead.findAll({ where: { email: recipientEmails } });

  return { campaign, leads };
}

// Adds trackers for each mail, inserts appropriate campaign-lead links in DB
//   and sends the emails
async function executeCampaign(userEmail, campaign, leads) {
  const { id: campaignId, subject, body } = campaign;
  const trackers = {};
  const trackerSize = 20;

  leads.forEach((l) => {
    trackers[l.id] = getRandomString(trackerSize);
  });

  await CampaignLead.bulkCreate(
    leads.map((l) => ({
      campaignId,
      leadId: l.id,
      tracker: trackers[l.id],
    }))
  );

  await sendEmails(
    userEmail,
    subject,
    body,
    leads.map((l) => ({
      email: l.email,
      trackingId: trackers[l.id],
    }))
  );
}

module.exports = {
  validateNewCampaignInput,
  recordCampaignRequest,
  executeCampaign,
};
