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

const generateRefreshToken = (user) => {
  return jwt.sign(
    { sub: user._id.toString() },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "7d",
      issuer: "auth-project",
      audience: "auth-refresh",
    },
  );
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET, {
    algorithms: ["HS256"],
    issuer: "auth-project",
    audience: "project-api",
  });
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET, {
    algorithms: ["HS256"],
    issuer: "auth-project",
    audience: "auth-refresh",
  });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
