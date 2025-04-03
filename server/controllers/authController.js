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
  process.env.REDIRECT_URI
);

const youtubeClient = new OAuth2Client(
  process.env.GOOGLE_TV_CLIENT_ID,
  process.env.GOOGLE_TV_CLIENT_SECRET,
  process.env.REDIRECT_URI
);

export const handleOAuthCallback = async (req, res) => {
  const authType = req.path.split("/")[1]; // Extract 'google' or 'youtube' from the path
  let tokens, payload;

  try {
    if (authType === "youtube") {
      const { tokens: ytTokens } = req.body;

      const ticket = await youtubeClient.verifyIdToken({
        idToken: ytTokens.id_token,
        audience: process.env.GOOGLE_TV_CLIENT_ID,
      });

      tokens = ytTokens;
      payload = ticket.getPayload();
    } else if (authType === "google") {
      const { code } = req.body;
      const { tokens: googleTokens } = await client.getToken(code);

      const ticket = await client.verifyIdToken({
        idToken: googleTokens.id_token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      tokens = googleTokens;
      payload = ticket.getPayload();
    } else {
      return res.status(400).json({ error: "Invalid authentication type" });
    }

    const expiryDate =
      tokens.expires_in && typeof tokens.expires_in === "number"
        ? new Date(Date.now() + tokens.expires_in * 1000)
        : new Date(Date.now() + 3600000);

    let user = await User.findOne({ googleId: payload.sub });

    if (!user) {
      user = new User({
        googleId: payload.sub,
        email: payload.email,
        name: payload.name,
        profileImage: payload.picture,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token || "",
        tokenExpiry: expiryDate,
      });
      console.log(`New user created: ${user.email}`);
    } else {
      user.accessToken = tokens.access_token;
      user.refreshToken = tokens.refresh_token || user.refreshToken;
      user.tokenExpiry = expiryDate;
      console.log(`User ${user.email} authenticated successfully`);
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
    res
      .status(error.message.includes("invalid_grant") ? 400 : 500)
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
