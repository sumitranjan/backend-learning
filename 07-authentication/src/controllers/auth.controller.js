const User = require("../models/user.model");
const { registerUser, loginUser } = require("../services/auth.service");
const { verifyRefreshToken, generateAccessToken } = require("../utils/jwt");

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    console.log(name, email, password);

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const user = await registerUser(name, email, password);

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const result = await loginUser({
      email,
      password,
    });

    res.cookie("refresh-token", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      accessToken: result.accessToken,
      user: result.user,
    });
  } catch (error) {
    next(error);
  }
};

const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies["refresh-token"];
    console.log("Refresh token:", refreshToken);

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token required",
      });
    }

    const payload = verifyRefreshToken(refreshToken);

    const user = await User.findById(payload.sub);

    if (!user) {
      return res.status(401).json({
        message: "User no longer exists",
      });
    }

    const accessToken = generateAccessToken(user);

    res.status(200).json({
      accessToken,
    });
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired refresh token",
    });
  }
};

module.exports = { register, login, refresh };
