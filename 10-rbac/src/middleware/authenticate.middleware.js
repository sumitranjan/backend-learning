const { verifyAccessToken } = require("../utils/jwt");

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // console.log("Auth Header:", authHeader);

  if (!authHeader) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }
  const [schema, token] = authHeader.split(" ");

  if (schema !== "Bearer" || !token) {
    return res.status(401).json({
      message: "Invalid authorization header",
    });
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (error) {
    console.error("JWT Verification failed:", error.message);
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

module.exports = authenticate;
