/* eslint-disable */

const { google } = require("googleapis");
const gmail = google.gmail("v1");

const User = require("../models/user");

const { API_URL } = process.env;

async function sendEmails(senderEmail, subject, body, recipients) {
  const user = await User.findOne({ email: senderEmail });
  const { firstname, lastname, accessToken, accessTokenExpiresAt } = user;
  const formattedFromAddress =
    [firstname, lastname].join(" ") + `<${senderEmail}>`;

  if (Number(new Date()) >= accessTokenExpiresAt - 120) {
    throw new Error(`Your access token has expired. Please log in again.`);
  }

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
  ]
    .concat(body)
    .join("\n");

  const encodedMessage = Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  return encodedMessage;
}

module.exports = { sendEmails };
