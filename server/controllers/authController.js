import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const cookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: "none",
};

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export const handleGoogleCallback = async (req, res) => {
  const { code } = req.body;

  try {
    const { tokens } = await client.getToken(code);

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    let expiryDate;
    if (tokens.expires_in && typeof tokens.expires_in === "number") {
      expiryDate = new Date(Date.now() + tokens.expires_in * 1000);
    } else {
      // Set a default expiry (e.g., 1 hour from now)
      expiryDate = new Date(Date.now() + 3600000);
    }

    let user = await User.findOne({ googleId: payload.sub });

    if (user) {
      user.accessToken = tokens.access_token;
      user.refreshToken = tokens.refresh_token || user.refreshToken;
      user.tokenExpiry = expiryDate;
      console.log(`User ${user.email} authenticated successfully`);
    } else {
      user = new User({
        googleId: payload.sub,
        email: payload.email,
        name: payload.name,
        profileImage: payload.picture,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token || "", // Handle case where refresh_token might be undefined
        tokenExpiry: expiryDate,
      });
      console.log(`New user created: ${user.email}`);
    }

    await user.save();

    const sessionToken = jwt.sign({ user: user }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res
      .cookie("access_token", tokens.access_token, cookieOptions)
      .cookie("refresh_token", tokens.refresh_token || "", cookieOptions)
      .json({
        token: sessionToken,
        user: { id: user._id, email: user.email, name: user.name },
      });
  } catch (error) {
    console.error("Authentication error:", error);
    if (error.message.includes("invalid_grant")) {
      return res
        .status(400)
        .json({ error: "Invalid or expired authorization code" });
    }
    res
      .status(500)
      .json({ error: "Authentication failed", details: error.message });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-accessToken -refreshToken"
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching current user:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};
