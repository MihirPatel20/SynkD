import express from "express";
import {
  getPlaylists,
  getPlaylistDetailsWithTracks,
  createNewPlaylist,
} from "../controllers/playlistController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// @route   GET /api/playlists
// @desc    Get user's YouTube playlists
// @access  Private
router.get("/", auth, getPlaylists);

// @route   GET /api/playlists/:id
// @desc    Get playlist details with tracks
// @access  Private
router.get("/:id", auth, getPlaylistDetailsWithTracks);

// @route   POST /api/playlists/:id
// @desc    Create a new playlist
// @access  Private
router.post("/", auth, createNewPlaylist);

export default router;
