import express from "express";
import auth from "../middleware/auth.js";
import { shuffleAndUpdatePlaylist } from "../controllers/youtubeController.js";

const router = express.Router();

// @route   PATCH /api/youtube/playlist/shuffle
// @desc    Shuffle and update playlist
// @access  Private
router.patch("/playlist/shuffle", auth, shuffleAndUpdatePlaylist);

export default router;
