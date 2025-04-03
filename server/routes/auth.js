import express from "express";
import {
  // getGoogleAuthURL,
  getCurrentUser,
  handleOAuthCallback,
} from "../controllers/authController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// @route   GET /api/auth/google
// @desc    Get Google OAuth URL
// @access  Public
// router.get("/google", getGoogleAuthURL);

// @route   POST /api/auth/google/callback
// @desc    Handle Google OAuth callback
// @access  Public
router.post("/google/callback", handleOAuthCallback);

// @route   POST /api/auth/youtube/callback
// @desc    Handle YouTube OAuth callback
// @access  Public
router.post("/youtube/callback", handleOAuthCallback);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get("/me", auth, getCurrentUser);

export default router;
