const bcrypt = require("bcrypt");
const saltRound = process.env.SALT_ROUND || 5;

const encryptPass = (password) => {
  return bcrypt.hashSync(String(password), +saltRound);
};

const decryptPass = (password, hashSyncPass) => {
  return bcrypt.compareSync(String(password), hashSyncPass);
};

module.exports = { encryptPass, decryptPass };
