// controller/musicController.js
import { google } from "googleapis";
import User from "../models/User.js";
import { executeYTMusicFunction } from "../utils/pythonExecutor.js";

// @desc    Fetch videos for the user's home page feed (recommendations/history)
// @route   GET /api/home
// @access  Private
export const getHomeFeedVideos = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const accessToken = user.accessToken;

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    oauth2Client.setCredentials({ access_token: accessToken });

    const youtube = google.youtube({
      version: "v3",
      auth: oauth2Client,
    });

    const response = await youtube.videos.list({
      part: "snippet,contentDetails,statistics",
      chart: "mostPopular",
      regionCode: "IN",
      videoCategoryId: "10",
      maxResults: 20,
    });

    // ✅ Reshape videos to fit NewVideoGrid
    const videos = response.data.items.map((item) => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails?.high?.url || "",
      videoId: item.id, // redundant but useful for clarity
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      viewCount: item.statistics?.viewCount || "0",
      likeCount: item.statistics?.likeCount || "0",
      fromSubscription: false, // You can set this true if fetching from subs
    }));

    res.status(200).json({ videos });
  } catch (err) {
    console.error("Error fetching YouTube feed:", err);
    res.status(500).json({ error: "Failed to fetch home feed" });
  }
};

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
// @route   GET /api/history
// @access  Private
export const getPlayHistory = async (req, res) => {
  try {
    const result = await executeYTMusicFunction(req, res, "get_history");

    if (result && result.success) {
      // Extract only the important data from each history item
      const structuredHistory = result.data.map((item) => ({
        song_name: item.title,
        artist:
          item.artists && item.artists.length > 0 ? item.artists[0].name : null,
        video_id: item.videoId,
        thumbnail:
          item.thumbnails && item.thumbnails.length > 0
            ? item.thumbnails[0].url
            : null,
      }));

      res.json({
        message: "Play history fetched successfully",
        history: structuredHistory,
      });
    } else if (result) {
      res.status(500).json({ error: result.error });
    }
  } catch (error) {
    console.error("Error in getPlayHistory controller:", error.message);
    if (!res.headersSent) {
      res.status(500).json({
        error: "An unexpected error occurred while fetching play history",
      });
    }
  }
};
