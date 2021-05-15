const { google } = require("googleapis");

const { models } = require("../common/db");
const { getTmpOauthClient } = require("./oauthClient");

const { API_URL } = process.env;
const { User } = models;

async function sendEmails(senderEmail, subject, body, recipients) {
  const user = await User.findOne({ email: senderEmail });
  const { firstname, lastname, accessToken, accessTokenExpiresAt } = user;
  const formattedFromAddress =
    [firstname, lastname].join(" ") + `<${senderEmail}>`;

  if (Number(new Date()) >= accessTokenExpiresAt - 120) {
    throw new Error(`Your access token has expired. Please log in again.`);
  }

  const tmpOauthClient = getTmpOauthClient({ access_token: accessToken });
  const gmail = google.gmail({ version: "v1", auth: tmpOauthClient });

  for (let i = 0; i < recipients.length; i++) {
    const { email: toAddress, trackingId } = recipients[i];

    const bodyForCurrentRecipient =
      body + `<img src="${API_URL}/tracker/${trackingId}" />`;

    const encodedMessage = prepareMessageForSending(
      formattedFromAddress,
      toAddress,
      subject,
      bodyForCurrentRecipient
    );

    await gmail.users.messages.send({
      userId: senderEmail,
      requestBody: { raw: encodedMessage },
    });
  }
}

// This code comes from the google api email sending sample
// See: https://github.com/googleapis/google-api-nodejs-client/blob/master/samples/gmail/send.js
function prepareMessageForSending(from, to, subject, body) {
  const message = [
    `From: ${from}`,
    `To: ${to}`,
    `Content-Type: text/html; charset=utf-8`,
    `Subject: ${subject}`,
    "",
  ]
    .concat(body.replace(/\n/g, "<br />"))
    .join("\n");

  // base64url encoding
  const encodedMessage = Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  return encodedMessage;
}

module.exports = { sendEmails };
