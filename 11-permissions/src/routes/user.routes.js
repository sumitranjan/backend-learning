const express = require("express");
const authenticate = require("../middleware/authenticate.middleware");
const {
  getUsers,
  getUserById,
  deleteUser,
  getMyProfile,
} = require("../controllers/user.controller");
const { authorizePermission } = require("../middleware/authorize.middleware");

const router = express.Router();

// router.get("/me", authenticate, (req, res) => {
//   res.json({
//     message: "Authenticated successfully",
//     user: req.user,
//   });
// });

// ------------------------------------------
// Own profile
// ------------------------------------------

router.get(
  "/me",
  authenticate,
  authorizePermission("profile:read"),
  getMyProfile,
);

// ------------------------------------------
// Read users
// ------------------------------------------

router.get("/", authenticate, authorizePermission("user:read"), getUsers);

// ------------------------------------------
// Get user
// ------------------------------------------

router.get("/:id", authenticate, authorizePermission("user:read"), getUserById);

// ------------------------------------------
// Delete user
// ------------------------------------------

router.delete(
  "/:id",
  authenticate,
  authorizePermission("user:delete"),
  deleteUser,
);

module.exports = router;
