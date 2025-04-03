// controllers/playlistController.js

import { executeYTMusicFunction } from "../utils/pythonExecutor.js";

// @desc    Get user's YouTube playlists
// @route   GET /api/playlists
// @access  Private
export const getPlaylists = async (req, res) => {
  try {
    const result = await executeYTMusicFunction(
      req,
      res,
      "get_library_playlists"
    );

    if (result && result.success) {
      res.json({
        message: "Playlists fetched successfully",
        playlists: result.data,
      });
    } else if (result) {
      res.status(500).json({ error: result.error });
    }
  } catch (error) {
    console.error("Error in getPlaylists controller:", error.message);
    if (!res.headersSent) {
      res.status(500).json({
        error: "An unexpected error occurred while fetching playlists",
      });
    }
  }
};

// @desc    Get playlist details with tracks
// @route   GET /api/playlists/:id
// @access  Private
export const getPlaylistDetailsWithTracks = async (req, res) => {
  try {
    const playlistId = req.params.id;
    if (!playlistId) {
      return res.status(400).json({ error: "Playlist ID is required" });
    }

    // Extract query parameters with defaults
    const limit = parseInt(req.query.limit) || 100;
    // const limit = 1000;

    const related = req.query.related === "true";
    const suggestionsLimit = parseInt(req.query.suggestions_limit) || 0;

    // Validate input parameters
    if (isNaN(limit) || limit <= 0) {
      return res.status(400).json({ error: "Invalid limit parameter" });
    }
    if (isNaN(suggestionsLimit) || suggestionsLimit < 0) {
      return res
        .status(400)
        .json({ error: "Invalid suggestions_limit parameter" });
    }

    // Pass parameters as additional arguments
    const result = await executeYTMusicFunction(req, res, "get_playlist", [
      playlistId,
      limit,
      // related,
      // suggestionsLimit,
    ]);

    if (!result) {
      return; // Response already sent by executeYTMusicFunction
    }

    if (result.success) {
      res.json({
        message: `Details for playlist ${result.data.title} fetched successfully`,
        playlist: result.data,
      });
    } else {
      res.status(500).json({ error: result.error || "Unknown error occurred" });
    }
  } catch (error) {
    console.error("Error in getPlaylistDetailsWithTracks controller:", error);
    if (!res.headersSent) {
      res.status(500).json({
        error: "An unexpected error occurred while fetching playlist details",
        details: error.message,
      });
    }
  }
};

// @desc    Create a new playlist and add songs
// @route   POST /api/playlists
// @access  Private
export const createNewPlaylist = async (req, res) => {
  try {
    const {
      title,
      description = "",
      privacy_status = "PRIVATE",
      videoIds = [],
    } = req.body;

    console.log("Request body:", req.body);

    // Validate input
    if (!title) {
      return res.status(400).json({ error: "Playlist title is required" });
    }

    // Validate privacy_status
    const validPrivacyStatuses = ["PUBLIC", "PRIVATE", "UNLISTED"];
    if (!validPrivacyStatuses.includes(privacy_status)) {
      return res.status(400).json({ error: "Invalid privacy status" });
    }

    // Validate videoIds
    if (!Array.isArray(videoIds)) {
      return res.status(400).json({ error: "videoIds must be an array" });
    }

    const video_ids = videoIds;
    console.log("Video IDs:", video_ids);
    // Execute YTMusic function to create playlist
    const createPlaylistResult = await executeYTMusicFunction(
      req,
      res,
      "create_playlist",
      [title, description, privacy_status, video_ids]
    );

    console.log("Create playlist result:", createPlaylistResult);

    if (!createPlaylistResult || !createPlaylistResult.success) {
      return res.status(500).json({
        error: createPlaylistResult.error || "Failed to create playlist",
      });
    }

    res.status(201).json({
      message: "Playlist created successfully and songs added",
      playlistId: createPlaylistResult.data,
    });
  } catch (error) {
    console.error("Error in createNewPlaylist controller:", error);
    if (!res.headersSent) {
      res.status(500).json({
        error: "An unexpected error occurred while creating the playlist",
        details: error.message,
      });
    }
  }
};
