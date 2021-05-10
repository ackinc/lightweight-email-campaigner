const CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const CHARS_LENGTH = CHARS.length;

function randIntBetween(lo, hi) {
  return Math.floor(lo + Math.random() * (hi - lo));
}

function getRandomString(len) {
  const ret = new Array(len);
  for (let i = 0; i < len; i += 1)
    ret[i] = CHARS[randIntBetween(0, CHARS_LENGTH)];
  return ret.join("");
}

module.exports = {
  randIntBetween,
  getRandomString,
};
