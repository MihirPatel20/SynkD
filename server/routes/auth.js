import express from "express";
import {
  getGoogleAuthURL,
  handleGoogleCallback,
  getCurrentUser,
} from "../controllers/authController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// @route   GET /api/auth/google
// @desc    Get Google OAuth URL
// @access  Public
router.get("/google", getGoogleAuthURL);

// @route   POST /api/auth/google/callback
// @desc    Handle Google OAuth callback
// @access  Public
router.post("/google/callback", handleGoogleCallback);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get("/me", auth, getCurrentUser);

export default router;
