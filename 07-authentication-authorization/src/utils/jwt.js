const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      sub: user._id.toString(),
      name: user.name,
      role: user.role,
    },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: "15m",
      issuer: "auth-project",
      audience: "project-api",
    },
  );
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET, {
    issuer: "auth-project",
    audience: "project-api",
  });
};

module.exports = { generateAccessToken, verifyAccessToken };
