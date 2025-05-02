import express from "express";
import auth from "../middleware/auth.js";
import {
  getYoutubePlaylistItems,
  reorderPlaylist,
  shuffleAndUpdatePlaylist,
} from "../controllers/youtubeController.js";

const router = express.Router();

// @desc    Get playlist details and tracks
// @route   GET /api/youtube/playlist/:id
// @access  Private
router.get("/playlist/:id", auth, getYoutubePlaylistItems);

// @route   PATCH /api/youtube/playlist/shuffle
// @desc    Shuffle and update playlist
// @access  Private
router.patch("/playlist/shuffle", auth, shuffleAndUpdatePlaylist);

// @route   PATCH /api/youtube/playlist/update
// @desc    Update playlist order
// @access  Private
router.patch("/playlist/reorder", auth, reorderPlaylist);

export default router;
