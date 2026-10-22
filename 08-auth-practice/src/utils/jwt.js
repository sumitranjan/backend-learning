const jwt = require("jsonwebtoken");

// Use env variables with local defaults
const ISSUER = process.env.JWT_ISSUER || "auth-dev";
const API_AUDIENCE = process.env.JWT_AUDIENCE || "api-dev";

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      sub: user._id.toString(),
      name: user.name,
      role: user.role,
    },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "15m", issuer: ISSUER, audience: API_AUDIENCE },
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      sub: user._id.toString(),
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d", issuer: ISSUER, audience: ISSUER },
  );
};

const verifyAccessToken = (accessToken) => {
  return jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET, {
    algorithms: ["HS256"],
    issuer: ISSUER,
    audience: API_AUDIENCE,
  });
};

const verifyRefreshToken = (refreshToken) => {
  return jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, {
    algorithms: ["HS256"],
    issuer: ISSUER,
    audience: ISSUER,
  });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
