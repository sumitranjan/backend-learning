const User = require("../models/user.model");
const { generateAccessToken, generateRefreshToken } = require("../utils/jwt");
const { hashPassword, comparePassword } = require("../utils/password");

const registerUser = async (name, email, password) => {
  console.log(name, email, password);
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const error = new Error("User already exist");
    error.status = 409;
    throw error;
  }

  const hashedPassword = await hashPassword(password);

  console.log("Hashed Password : ", hashedPassword);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");

  console.log("user : ", user);

  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.name,
      role: user.role,
    },
  };
};

module.exports = {
  registerUser,
  loginUser,
};
