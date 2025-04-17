import express from "express";
import auth from "../middleware/auth.js";
import {
  getHomeFeedVideos,
  getLibrary,
  getPlayHistory,
} from "../controllers/musicController.js";

const router = express.Router();

// @route   GET /api/home
// @desc    This route is used to fetch the home feed music videos for the user
// @access  Private
router.get("/home", auth, getHomeFeedVideos);

// @route   GET /api/library
// @desc    Get user's YouTube library
// @access  Private
router.get("/library", auth, getLibrary);

// @route   GET /api/history
// @desc    Get user's play history
// @access  Private
router.get("/history", auth, getPlayHistory);

export default router;
