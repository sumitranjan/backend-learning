const express = require("express");
const authenticate = require("../middleware/authenticate.middleware");

const router = express.Router();

router.get("/me", authenticate, (req, res) => {
  res.json({
    message: "Authenticated successfully",
    user: req.user,
  });
});

module.exports = router;
