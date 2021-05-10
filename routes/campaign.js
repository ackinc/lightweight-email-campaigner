const express = require('express');

const db = require('../common/db');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');
const {
  validateNewCampaignInput,
  recordCampaignRequest,
  executeCampaign,
} = require('../services/campaign');

const router = express.Router();
router.use(ensureAuthenticated);

// Responds with a summary view of all campaigns executed by the logged-in user
// Fails with 500 response if
//   database error
router.get('/', async (req, res, next) => {
  try {
    const campaigns = await db.query(`
      SELECT t1.id, name, subject, body, t1."createdAt",
              COUNT(*) n_leads,
              COUNT("deliveredAt") n_delivered,
              COUNT("openedAt") n_opened
      FROM campaigns t1
      INNER JOIN campaignleads t2 ON t1.id = t2."campaignId"
      WHERE t1."userId" = ?
      GROUP BY t1.id
    `, { replacements: [req.decoded.id], type: db.QueryTypes.SELECT });
    return res.json({ campaigns });
  } catch (e) {
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
      SELECT t1."userId" "userId", t3.id "leadId", email, "deliveredAt", "openedAt"
      FROM campaigns t1
      INNER JOIN campaignleads t2 ON t2."campaignId" = t1.id
      INNER JOIN leads t3 ON t2."leadId" = t3.id
      WHERE t1.id = ?
    `, { replacements: [req.params.campaign_id], type: db.QueryTypes.SELECT });

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
    return next(e);
  }
});

// Creates and executes a new campaign
// Input
//   req.body.name - name for campaign (for internal reference)
//   req.body.subject - subject of email to be sent
//   req.body.body - body of email to be sent
//   req.body.leads - array of emails to which this campaign must be sent
// Fails with
//   400
//     inputs missing
//   500
//     database error
//     sendgrid error
router.post('/', (req, res, next) => {
  if (req.decoded.role !== 'marketer') return res.status(403).json({ error: 'NOT_AUTHORIZED' });

  const { error } = validateNewCampaignInput(req.body);
  if (error) return res.status(400).json({ error: error.message });

  return next();
}, async (req, res, next) => {
  const { id: userId, email: userEmail } = req.decoded;
  const campaignDetails = req.body;
  const recipients = req.body.leads;

  try {
    const { campaign, leads } = await recordCampaignRequest(userId, campaignDetails, recipients);
    if (leads.length === 0) return res.status(400).json({ error: 'NO_LEADS_VALID' });
    await executeCampaign(userEmail, campaign, leads);
    return res.json();
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
