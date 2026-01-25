const jwt = require("jsonwebtoken");

const ACCESS_SECRET = "ACCESS_SECRET_KEY";
const REFRESH_SECRET = "REFRESH_SECRET_KEY";

function generateAccessToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role },
    ACCESS_SECRET,
    { expiresIn: "30s" }
  );
}

function generateRefreshToken(user) {
  return jwt.sign(
    { id: user.id },
    REFRESH_SECRET,
    { expiresIn: "7d" }
  );
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  ACCESS_SECRET,
  REFRESH_SECRET
};
