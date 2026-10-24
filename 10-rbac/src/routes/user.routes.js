const express = require("express");
const authenticate = require("../middleware/authenticate.middleware");
const {
  getUsers,
  getUserById,
  deleteUser,
  getMyProfile,
} = require("../controllers/user.controller");
const { authorizeRoles } = require("../middleware/authorize.middleware");

const router = express.Router();

// router.get("/me", authenticate, (req, res) => {
//   res.json({
//     message: "Authenticated successfully",
//     user: req.user,
//   });
// });

router.get("/me", authenticate, getMyProfile);
// ------------------------------------------
// Admin + Manager
// ------------------------------------------

router.get(
  "/",
  authenticate,
  authorizeRoles("admin", "manager", "employee"),
  getUsers,
);

// ------------------------------------------
// Admin + Manager
// ------------------------------------------

router.get(
  "/:id",
  authenticate,
  authorizeRoles("admin", "manager"),
  getUserById,
);

// ------------------------------------------
// Admin only
// ------------------------------------------

router.delete("/:id", authenticate, authorizeRoles("admin"), deleteUser);

module.exports = router;
