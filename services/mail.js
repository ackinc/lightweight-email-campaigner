const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function sendMails(sender, recipients, subject, body) {
  const msg = {
    from: sender,
    to: recipients,
    subject,
    text: body,
  };
  sgMail.sendMultiple(msg)
    .catch(e => console.error(e)); // eslint-disable-line no-console
}

module.exports = { sendMails };
