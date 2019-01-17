const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function sendPersonalizedMails(sender, personalizations, subject, body) {
  const msg = {
    from: sender,
    personalizations,
    subject,
    text: body,
  };
  sgMail.sendMultiple(msg)
    .catch(e => console.error(e)); // eslint-disable-line no-console
}

module.exports = { sendPersonalizedMails };
