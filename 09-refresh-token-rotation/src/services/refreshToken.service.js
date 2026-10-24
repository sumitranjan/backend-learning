const crypto = require("crypto");
const { hashRefreshToken, generateFamilyId } = require("../utils/refreshToken");
const RefreshToken = require("../models/refreshToken.modal");
const User = require("../models/user.modal");
const { generateAccessToken } = require("../utils/jwt");

const generateRefreshToken = () => {
  return crypto.randomBytes(64).toString("hex");
};

// ------------------------------------------
// Create Refresh Token
// ------------------------------------------

const createRefreshToken = async ({
  userId,
  familyId = generateFamilyId(),
}) => {
  const rawToken = generateRefreshToken();

  const tokenHash = hashRefreshToken(rawToken);

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await RefreshToken.create({
    userId,
    tokenHash,
    familyId,
    expiresAt,
  });

  return {
    rawToken,
    familyId,
    expiresAt,
  };
};

// ------------------------------------------
// Refresh Access Token
// ------------------------------------------

const refreshAccessToken = async (rawToken) => {
  const tokenHash = hashRefreshToken(rawToken);

  const storedToken = await RefreshToken.findOne({
    tokenHash,
  });

  // Token doesn't exist
  if (!storedToken) {
    const error = new Error("Invalid refresh token");

    error.statusCode = 401;

    throw error;
  }

  // ------------------------------------------
  // Reuse Detection
  // ------------------------------------------

  if (storedToken.usedAt || storedToken.revokedAt) {
    // Revoke entire token family
    await RefreshToken.updateMany(
      {
        familyId: storedToken.familyId,

        revokedAt: null,
      },
      {
        $set: {
          revokedAt: new Date(),
        },
      },
    );

    const error = new Error("Refresh token reuse detected");

    error.statusCode = 401;

    throw error;
  }

  // ------------------------------------------
  // Expiration
  // ------------------------------------------

  if (storedToken.expiresAt < new Date()) {
    const error = new Error("Refresh token expired");

    error.statusCode = 401;

    throw error;
  }

  // ------------------------------------------
  // Find User
  // ------------------------------------------

  const user = await User.findById(storedToken.userId);

  if (!user) {
    const error = new Error("User no longer exists");

    error.statusCode = 401;

    throw error;
  }

  // ------------------------------------------
  // Generate NEW Refresh Token
  // ------------------------------------------

  const newRefreshToken = await createRefreshToken({
    userId: user._id,

    familyId: storedToken.familyId,
  });

  // ------------------------------------------
  // Mark OLD token as USED
  // ------------------------------------------

  const newTokenHash = hashRefreshToken(newRefreshToken.rawToken);

  storedToken.usedAt = new Date();

  storedToken.replacedByTokenHash = newTokenHash;

  await storedToken.save();

  // ------------------------------------------
  // Generate NEW Access Token
  // ------------------------------------------

  const accessToken = generateAccessToken(user);

  return {
    accessToken,

    refreshToken: newRefreshToken.rawToken,
  };
};

const revokeRefreshToken = async (rawToken) => {
  const tokenHash = hashRefreshToken(rawToken);

  await RefreshToken.updateOne(
    {
      tokenHash,
      revokedAt: null,
    },
    {
      $set: {
        revokedAt: new date(),
      },
    },
  );
};

module.exports = {
  createRefreshToken,
  refreshAccessToken,
  revokeRefreshToken,
};
