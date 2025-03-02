import { google } from "googleapis";
import User from "../models/User.js";
import Playlist from "../models/Playlist.js";

// @desc    Get user's YouTube playlists
// @route   GET /api/playlists
// @access  Private
export const getPlaylists = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // Set up YouTube API with user's access token
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: user.accessToken });

    const youtube = google.youtube({
      version: "v3",
      auth: oauth2Client,
    });

    // Get playlists from YouTube API
    const response = await youtube.playlists.list({
      part: "snippet,contentDetails",
      mine: true,
      maxResults: 5,
    });

    // Store playlists in database
    for (const item of response.data.items) {
      await Playlist.findOneAndUpdate(
        { user: user._id, youtubePlaylistId: item.id },
        {
          user: user._id,
          youtubePlaylistId: item.id,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails.default.url,
          itemCount: item.contentDetails.itemCount,
          channelId: item.snippet.channelId,
          channelTitle: item.snippet.channelTitle,
          lastSynced: new Date(),
        },
        { upsert: true, new: true }
      );
    }

    // Get updated playlists from database
    const playlists = await Playlist.find({ user: user._id });

    res.json({
      playlists,
      nextPageToken: response.data.nextPageToken,
      prevPageToken: response.data.prevPageToken,
    });
  } catch (error) {
    console.error("Error fetching playlists:", error);
    res.status(500).json({ error: "Failed to fetch playlists" });
  }
};

// @desc    Get playlist details with tracks
// @route   GET /api/playlists/:id
// @access  Private
export const getPlaylistDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const playlistId = req.params.id;

    // Set up YouTube API with user's access token
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: user.accessToken });

    const youtube = google.youtube({
      version: "v3",
      auth: oauth2Client,
    });

    // Get playlist items
    let nextPageToken = null;
    let allItems = [];

    do {
      const response = await youtube.playlistItems.list({
        part: "snippet,contentDetails",
        playlistId: playlistId,
        maxResults: 50,
        pageToken: nextPageToken || undefined,
      });

      allItems = [...allItems, ...response.data.items];
      nextPageToken = response.data.nextPageToken;
    } while (nextPageToken);

    // Format the response
    const tracks = allItems.map((item) => ({
      id: item.id,
      videoId: item.contentDetails.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails?.default?.url || "",
      position: item.snippet.position,
      channelTitle: item.snippet.channelTitle,
    }));

    res.json(tracks);
  } catch (error) {
    console.error("Error fetching playlist details:", error);
    res.status(500).json({ error: "Failed to fetch playlist details" });
  }
};
