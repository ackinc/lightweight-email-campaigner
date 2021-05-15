const { google } = require("googleapis");

const { CLIENT_ID, CLIENT_SECRET } = process.env;
const client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET);

async function getUserDetailsFromIdToken(idToken) {
  const ticket = await client.verifyIdToken({ idToken, audience: CLIENT_ID });
  const payload = await ticket.getPayload();

  return {
    firstname: payload.given_name,
    lastname: payload.family_name,
    email: payload.email,
  };
}

const getTmpOauthClient = (credentials) => {
  const client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET);
  client.setCredentials(credentials);
  return client;
};

module.exports = {
  getTmpOauthClient,
  getUserDetailsFromIdToken,
};
