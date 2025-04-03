import { google } from "googleapis";
import User from "../models/User.js";

/**
 * Controller to fetch playlist analytics reports
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getPlaylistVideoAnalytics = async (req, res) => {
  try {
    // Get playlist ID from request parameters or query
    const playlistId = req.params.playlistId || req.query.playlistId;

    if (!playlistId) {
      return res.status(400).json({ error: "Playlist ID is required" });
    }

    // Get date range from query parameters or use defaults
    const startDate = req.query.startDate || "2023-01-01";
    const endDate = req.query.endDate || "2025-03-15";

    // Find user and get access token
    const user = await User.findById(req.user.id);
    const accessToken = user.accessToken;

    if (!accessToken) {
      return res
        .status(401)
        .json({ error: "User not authenticated with YouTube" });
    }

    // Create OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    // Set credentials
    oauth2Client.setCredentials({ access_token: accessToken });

    // Initialize YouTube Analytics API
    const youtubeAnalytics = google.youtubeAnalytics({
      version: "v2",
      auth: oauth2Client,
    });

    // Make API request to get playlist analytics
    const response = await youtubeAnalytics.reports.query({
      ids: "channel==MINE",
      startDate,
      endDate,
      dimensions: "playlist",
      metrics:
        "views,estimatedMinutesWatched,playlistStarts,playlistViews,viewsPerPlaylistStart",
      filters: `playlist==${playlistId}`,
    });

    return res.status(200).json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error("Error fetching playlist reports:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch playlist reports",
    });
  }
};

// For fetching multiple playlists at once
const getMultiplePlaylistReports = async (req, res) => {
  try {
    // Get comma-separated playlist IDs
    const playlistIds = req.query.playlistIds;

    if (!playlistIds) {
      return res.status(400).json({ error: "Playlist IDs are required" });
    }

    const startDate = req.query.startDate || "2023-01-01";
    const endDate = req.query.endDate || "2025-03-15";

    // Find user and get access token
    const user = await User.findById(req.user.id);
    const accessToken = user.accessToken;

    if (!accessToken) {
      return res
        .status(401)
        .json({ error: "User not authenticated with YouTube" });
    }

    // Create OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    // Set credentials
    oauth2Client.setCredentials({ access_token: accessToken });

    // Initialize YouTube Analytics API
    const youtubeAnalytics = google.youtubeAnalytics({
      version: "v2",
      auth: oauth2Client,
    });

    // Make API request to get playlist analytics for multiple playlists
    const response = await youtubeAnalytics.reports.query({
      ids: "channel==MINE",
      startDate,
      endDate,
      dimensions: "playlist",
      metrics:
        "views,estimatedMinutesWatched,playlistStarts,playlistViews,viewsPerPlaylistStart",
      filters: `playlist==${playlistIds}`,
      sort: "-playlistViews",
    });

    return res.status(200).json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error("Error fetching multiple playlist reports:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch playlist reports",
    });
  }
};

// Get top playlists by views
const getTopPlaylists = async (req, res) => {
  try {
    const maxResults = req.query.maxResults || 10;
    const startDate = req.query.startDate || "2023-01-01";
    const endDate = req.query.endDate || "2025-03-15";

    // Find user and get access token
    const user = await User.findById(req.user.id);
    const accessToken = user.accessToken;

    if (!accessToken) {
      return res
        .status(401)
        .json({ error: "User not authenticated with YouTube" });
    }

    // Create OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    // Set credentials
    oauth2Client.setCredentials({ access_token: accessToken });

    // Initialize YouTube Analytics API
    const youtubeAnalytics = google.youtubeAnalytics({
      version: "v2",
      auth: oauth2Client,
    });

    // Make API request to get top playlists
    const response = await youtubeAnalytics.reports.query({
      ids: "channel==MINE",
      startDate,
      endDate,
      dimensions: "playlist",
      metrics:
        "playlistViews,playlistEstimatedMinutesWatched,playlistStarts,averageTimeInPlaylist",
      maxResults,
      sort: "-playlistViews",
    });

    return res.status(200).json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error("Error fetching top playlists:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch top playlists",
    });
  }
};

export {  getMultiplePlaylistReports, getTopPlaylists };
