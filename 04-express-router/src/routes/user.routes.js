const express = require("express");
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/user.controller");

const { authenticate, isAdmin } = require("../middleware/auth.middleware");

const router = express.Router();

router.use(authenticate);

router.get("/", getAllUsers);

router.get("/:id", getUserById);

router.post("/", createUser);

router.patch("/:id", updateUser);

router.use(isAdmin);

router.delete("/:id", deleteUser);

module.exports = router;
