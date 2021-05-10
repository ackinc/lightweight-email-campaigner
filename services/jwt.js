/* This module abstracts dealing with JWTs */

const jwt = require("jsonwebtoken");

const { JWT_SECRET } = process.env;

// Calling jwt.sign and jwt.verify without supplying a callback
//   causes them to run synchronously, which we don't want

function generate(payload, expiresIn = "14 days") {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, JWT_SECRET, { expiresIn }, (err, token) => {
      if (err) reject(err);
      else resolve(token);
    });
  });
}

function decode(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) reject(err);
      else resolve(decoded);
    });
  });
}

module.exports = {
  generate,
  decode,
};
