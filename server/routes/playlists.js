import express from 'express';
import { getPlaylists, getPlaylistDetails } from '../controllers/playlistController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/playlists
// @desc    Get user's YouTube playlists
// @access  Private
router.get('/', auth, getPlaylists);

// @route   GET /api/playlists/:id
// @desc    Get playlist details with tracks
// @access  Private
router.get('/:id', auth, getPlaylistDetails);

export default router;
