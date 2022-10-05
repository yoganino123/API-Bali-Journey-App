const jwt = require("jsonwebtoken");
const secretCode = process.env.SECRET_CODE || "bebas";

const tokenGenerator = (data) => {
  const { id, name, email, level, status } = data;
  return jwt.sign({ id, name, email, level, status }, secretCode);
};

const tokenVerify = (data) => {
  return jwt.verify(data, secretCode);
};

module.exports = { tokenGenerator, tokenVerify };
