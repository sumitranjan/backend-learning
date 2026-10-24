const User = require("../models/user.modal");

// ------------------------------------------
// Get all users
// Admin + Manager
// ------------------------------------------

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    return res.status(200).json({
      users,
    });
  } catch (error) {
    next(error);
  }
};

// ------------------------------------------
// Get user by ID
// Admin + Manager
// ------------------------------------------

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      user,
    });
  } catch (error) {
    next(error);
  }
};

// ------------------------------------------
// Delete user
// Admin only
// ------------------------------------------

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ------------------------------------------
// Get own profile
// All authenticated users
// ------------------------------------------

const getMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.sub).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  deleteUser,
  getMyProfile,
};
