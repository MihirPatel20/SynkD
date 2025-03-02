import { google } from "googleapis";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Create OAuth2 client
const createOAuth2Client = () => {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
};

// @desc    Get Google OAuth URL
// @route   GET /api/auth/google
// @access  Public
export const getGoogleAuthURL = (req, res) => {
  const oauth2Client = createOAuth2Client();

  const scopes = [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/youtube.readonly",
  ];

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: scopes,
  });

  res.json({ url });
};

// @desc    Handle Google OAuth callback
// @route   POST /api/auth/google/callback
// @access  Public
export const handleGoogleCallback = async (req, res) => {
  const { code } = req.body;
  const oauth2Client = createOAuth2Client();

  try {
    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get user info
    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: "v2",
    });

    const userInfo = await oauth2.userinfo.get();

    // Calculate token expiry
    const expiryDate = new Date();
    expiryDate.setSeconds(expiryDate.getSeconds() + tokens.expires_in);

    // Find or create user
    let user = await User.findOne({ googleId: userInfo.data.id });

    if (user) {
      // Update existing user
      user.accessToken = tokens.access_token;
      user.refreshToken = tokens.refresh_token || user.refreshToken; // Only update if new refresh token provided
      user.tokenExpiry = expiryDate;
      await user.save();
    } else {
      // Create new user
      user = await User.create({
        googleId: userInfo.data.id,
        email: userInfo.data.email,
        name: userInfo.data.name,
        profileImage: userInfo.data.picture,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        tokenExpiry: expiryDate,
      });
    }

    // Create JWT
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    console.error("Auth error:", error);
    res.status(500).json({ error: "Authentication failed" });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-accessToken -refreshToken"
    );
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// @desc    Handle Google OAuth token
// @route   POST /api/auth/google/token
// @access  Public
export const handleGoogleToken = async (req, res) => {
  const { accessToken } = req.body;

  if (!accessToken) {
    return res.status(400).json({ error: "Access token is required" });
  }

  try {
    // Set up Google OAuth client
    const oauth2Client = createOAuth2Client();

    // Set credentials with the provided access token
    oauth2Client.setCredentials({ access_token: accessToken });

    // Get user info from Google
    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: "v2",
    });

    const userInfo = await oauth2.userinfo.get();

    // Calculate token expiry (typically 1 hour for Google tokens)
    const expiryDate = new Date();
    expiryDate.setSeconds(expiryDate.getSeconds() + 3600); // 1 hour

    // Find or create user
    let user = await User.findOne({ googleId: userInfo.data.id });

    if (user) {
      // Update existing user
      user.accessToken = accessToken;
      user.tokenExpiry = expiryDate;
      await user.save();
    } else {
      // Create new user
      user = await User.create({
        googleId: userInfo.data.id,
        email: userInfo.data.email,
        name: userInfo.data.name,
        profileImage: userInfo.data.picture,
        accessToken: accessToken,
        refreshToken: "", // Note: Implicit flow doesn't provide refresh tokens
        tokenExpiry: expiryDate,
      });
    }

    // Create JWT
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            picture: user.profileImage,
          },
        });
      }
    );
  } catch (error) {
    console.error("Auth error:", error);
    res.status(500).json({ error: "Authentication failed" });
  }
};
