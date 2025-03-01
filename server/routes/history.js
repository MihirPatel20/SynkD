import express from "express";
import {
  getPlayHistory,
  syncPlayHistory,
  updatePlayCount,
} from "../controllers/historyController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// @route   GET /api/history
// @desc    Get user's play history
// @access  Private
router.get("/", auth, getPlayHistory);

// @route   POST /api/history/sync
// @desc    Sync play history from YouTube Music
// @access  Private
router.post("/sync", auth, syncPlayHistory);

// @route   PUT /api/history/:videoId
// @desc    Update play count for a song
// @access  Private
router.put("/:videoId", auth, updatePlayCount);

export default router;
