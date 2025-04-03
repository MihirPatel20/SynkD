// controllers/libraryController.js

import { executeYTMusicFunction } from "../utils/pythonExecutor.js";

// @desc    Get user's YouTube library
// @route   GET /api/library
// @access  Private
export const getLibrary = async (req, res) => {
  try {
    const libraryPlaylists = await executeYTMusicFunction(
      req,
      res,
      "get_library_playlists"
    );
    const libraryAlbums = await executeYTMusicFunction(
      req,
      res,
      "get_library_albums"
    );
    const librarySongs = await executeYTMusicFunction(
      req,
      res,
      "get_library_songs"
    );
    const libraryArtists = await executeYTMusicFunction(
      req,
      res,
      "get_library_artists"
    );
    const librarySubscriptions = await executeYTMusicFunction(
      req,
      res,
      "get_library_subscriptions"
    );

    res.json({
      message: "Library fetched successfully",
      library: {
        playlists: libraryPlaylists,
        albums: libraryAlbums,
        songs: librarySongs,
        artists: libraryArtists,
        subscriptions: librarySubscriptions,
      },
    });
  } catch (error) {
    console.error("Error in getLibrary controller:", error.message);
    res.status(500).json({
      error: "An unexpected error occurred while fetching library",
    });
  }
};

// @desc    Get user's play history
// @route   GET /api/library/history
// @access  Private
export const getHistory = async (req, res) => {
  try {
    const history = await executeYTMusicFunction(req, res, "get_history");
    res.json({
      message: "Play history fetched successfully",
      history: history,
    });
  } catch (error) {
    console.error("Error in getHistory controller:", error.message);
    res.status(500).json({
      error: "An unexpected error occurred while fetching play history",
    });
  }
};

// @desc    Rate a song
// @route   POST /api/library/rate-song
// @access  Private
export const rateSong = async (req, res) => {
  const { videoId, rating } = req.body;
  try {
    const result = await executeYTMusicFunction(req, res, "rate_song", [
      videoId,
      rating,
    ]);
    res.json({
      message: "Song rated successfully",
      result: result,
    });
  } catch (error) {
    console.error("Error in rateSong controller:", error.message);
    res.status(500).json({
      error: "An unexpected error occurred while rating the song",
    });
  }
};

// @desc    Subscribe to artists
// @route   POST /api/library/subscribe-artists
// @access  Private
export const subscribeArtists = async (req, res) => {
  const { channelIds } = req.body;
  try {
    const result = await executeYTMusicFunction(req, res, "subscribe_artists", [
      channelIds,
    ]);
    res.json({
      message: "Subscribed to artists successfully",
      result: result,
    });
  } catch (error) {
    console.error("Error in subscribeArtists controller:", error.message);
    res.status(500).json({
      error: "An unexpected error occurred while subscribing to artists",
    });
  }
};
