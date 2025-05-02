// controllers/playlistController.js

import { google } from "googleapis";
import User from "../models/User.js";
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

// @desc    Create shuffled playlist with advanced options
// @route   POST /api/playlists/shuffle
// @access  Private
export const createShufflePlaylist = async (req, res) => {
  try {
    const {
      playlistId,
      limit = 1000,
      title,
      description = "",
      privacy_status = "PRIVATE",
      recentlyPlayedBehavior = "include", // "skip", "move_to_end", "include"
      excludedVideoIds = [],
    } = req.body;

    console.log("Request body:", req.body);

    if (!playlistId) {
      return res.status(400).json({ error: "playlistId is required" });
    }

    const validPrivacyStatuses = ["PUBLIC", "PRIVATE", "UNLISTED"];
    if (!validPrivacyStatuses.includes(privacy_status)) {
      return res.status(400).json({ error: "Invalid privacy status" });
    }

    // 1. Fetch playlist tracks
    const playlistRes = await executeYTMusicFunction(req, res, "get_playlist", [
      playlistId,
      limit,
    ]);

    if (!playlistRes?.success) {
      return res
        .status(500)
        .json({ error: playlistRes.error || "Failed to fetch playlist" });
    }

    const playlistTracks = playlistRes.data?.tracks || [];

    // 2. Fetch history
    const historyRes = await executeYTMusicFunction(req, res, "get_history");

    if (!historyRes?.success) {
      return res
        .status(500)
        .json({ error: historyRes.error || "Failed to fetch history" });
    }

    const historyTracks = historyRes.data || [];

    const historyVideoIds = new Set(
      historyTracks.filter((t) => t?.videoId).map((t) => t.videoId)
    );

    const _shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

    // 3. Filter out excluded tracks
    const filteredTracks = playlistTracks.filter(
      (track) => track.videoId && !excludedVideoIds.includes(track.videoId)
    );

    // 4. Apply recently played handling logic
    let finalTrackList = [];

    if (recentlyPlayedBehavior === "skip") {
      finalTrackList = _shuffle(
        filteredTracks.filter((track) => !historyVideoIds.has(track.videoId))
      );
    } else if (recentlyPlayedBehavior === "move_to_end") {
      const recent = filteredTracks.filter((track) =>
        historyVideoIds.has(track.videoId)
      );
      const rest = filteredTracks.filter(
        (track) => !historyVideoIds.has(track.videoId)
      );
      finalTrackList = [..._shuffle(rest), ...recent];
    } else {
      finalTrackList = _shuffle(filteredTracks);
    }

    const shuffledVideoIds = finalTrackList
      .map((track) => track.videoId)
      .filter(Boolean);

    // 5. Create the new shuffled playlist
    const createPlaylistResult = await executeYTMusicFunction(
      req,
      res,
      "create_playlist",
      [
        title || `${playlistRes.data.title} - Smart Shuffle`,
        description || "Smart shuffled playlist",
        privacy_status,
        shuffledVideoIds,
      ]
    );

    if (!createPlaylistResult?.success) {
      return res.status(500).json({
        error:
          createPlaylistResult.error || "Failed to create shuffled playlist",
      });
    }

    res.status(201).json({
      message: "Smart shuffled playlist created",
      playlistId: createPlaylistResult.data,
      totalTracks: shuffledVideoIds.length,
    });
  } catch (error) {
    console.error("Error in createShufflePlaylist controller:", error);
    if (!res.headersSent) {
      res.status(500).json({
        error: "Unexpected error while creating shuffled playlist",
        details: error.message,
      });
    }
  }
};

// @desc    Move a playlist item to a new position
// @route   POST /api/playlists/move
// @access  Private
// @param   {string} playlistId - The ID of the playlist
export const movePlaylistItem = async (req, res) => {
  try {
    const { playlistId, title, itemToMoveId, itemBeforeId } = req.body;

    if (!playlistId) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const moveItemArg = itemBeforeId
      ? [itemToMoveId, itemBeforeId]
      : itemToMoveId; // a string if moving to end

    console.log("Move item argument:", moveItemArg);

    const result = await executeYTMusicFunction(
      req,
      res,
      "edit_playlist",
      [playlistId, title || null, null, null, moveItemArg || null] // fill `None` (null) for title/desc/privacy
    );

    if (result && result.success) {
      res.json({ message: "Track moved successfully", data: result.data });
    } else if (result) {
      res.status(500).json({ error: result.error });
    }
  } catch (error) {
    console.error("Error in movePlaylistItem controller:", error.message);
    if (!res.headersSent) {
      res.status(500).json({
        error: "An unexpected error occurred while moving the playlist item",
      });
    }
  }
};
