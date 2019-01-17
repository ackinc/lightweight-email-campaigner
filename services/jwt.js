const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

function generate(payload, expiresIn = '14 days') {
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
