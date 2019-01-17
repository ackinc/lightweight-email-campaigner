const after = require('lodash/after');
const nodemailer = require('nodemailer');

// Purpose: Send emails and report on delivery success
// Params:
//   sender      -> User
//   mailsToSend -> array | [mailToSend]
//   mailToSend  -> dict | { lead: Lead, subject: string, body: string }
//   cb will be called with a dict | {
//     success: [Lead],
//     failure: [Lead]
//   }
function sendMails(sender, mailsToSend, cb) {
  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: sender.email,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: sender.refreshToken,
      accessToken: sender.accessToken,
    },
  });

  const success = []; // Leads to which mail delivery succeeded
  const failure = []; // Leads to which mail delivery failed
  const complete = after(mailsToSend.length, () => cb({ success, failure }));

  mailsToSend.forEach(({ lead, subject, body }) => {
    const mailOpts = {
      from: sender.email,
      to: lead.email,
      subject,
      html: body,
    };
    transport.sendMail(mailOpts, (err) => {
      if (err) {
        failure.push(lead);
        console.error(err); // eslint-disable-line no-console
      } else {
        success.push(lead);
      }
      complete();
    });
  });
}

module.exports = {
  sendMails,
};
