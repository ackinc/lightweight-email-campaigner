/* This module abstracts dealing with Google OAuth */

const { OAuth2Client } = require('google-auth-library');

const { CLIENT_ID, CLIENT_SECRET } = process.env;
const client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET);

async function exchangeAuthCodeForTokens(authCode) {
  const r = await client.getToken(authCode);

  return {
    accessToken: r.tokens.access_token,
    refreshToken: r.tokens.refresh_token,
    idToken: r.tokens.id_token,
  };
}

async function getUserDetailsFromIdToken(idToken) {
  const ticket = await client.verifyIdToken({ idToken, audience: CLIENT_ID });
  const payload = await ticket.getPayload();

  return {
    firstname: payload.given_name,
    lastname: payload.family_name,
    email: payload.email,
  };
}

module.exports = {
  exchangeAuthCodeForTokens,
  getUserDetailsFromIdToken,
};
