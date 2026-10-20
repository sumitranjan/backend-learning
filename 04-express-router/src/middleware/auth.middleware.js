// Authentication Middleware
function authenticate(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  req.user = {
    id: 1,
    name: "Sumit",
    role: "admin",
  };

  next();
}

// Authorization Middleware
function isAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access required",
    });
  }

  next();
}

module.exports = { authenticate, isAdmin };
