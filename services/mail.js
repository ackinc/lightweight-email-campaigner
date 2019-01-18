/* This module abstracts email sending */

const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function sendPersonalizedMails(sender, personalizations, subject, body) {
  const msg = {
    from: sender,
    personalizations,
    subject,
    text: body,
  };
  return sgMail.sendMultiple(msg);
}

module.exports = { sendPersonalizedMails };
