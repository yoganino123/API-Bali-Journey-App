const { tokenVerify } = require("../helpers");

const valAdmin = (req, res, next) => {
  const { access_token } = req.headers;
  const { level } = tokenVerify(access_token);
  if (level === "admin") {
    try {
      req.user = tokenVerify(access_token);
      next();
    } catch (error) {
      res.status(401).json({ message: "Cannot auth the token!" });
    }
  } else {
    res.status(403).json({ message: `Forbidden! Login as admin to access this route!` });
  }
};

module.exports = valAdmin;
