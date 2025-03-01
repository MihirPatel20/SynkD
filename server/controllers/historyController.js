import axios from "axios";
import User from "../models/User.js";
import PlayHistory from "../models/PlayHistory.js";

// @desc    Get user's play history
// @route   GET /api/history
// @access  Private
export const getPlayHistory = async (req, res) => {
  try {
    const history = await PlayHistory.find({ user: req.user.id }).sort({
      lastPlayed: -1,
    });

    res.json(history);
  } catch (error) {
    console.error("Error fetching play history:", error);
    res.status(500).json({ error: "Failed to fetch play history" });
  }
};

// @desc    Sync play history from YouTube Music
// @route   POST /api/history/sync
// @access  Private
export const syncPlayHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // This is where you would integrate with ytmusicapi
    // Since we can't directly use the Python library in Node.js,
    // we'll need to either:
    // 1. Create a Python microservice
    // 2. Use a Node.js port of ytmusicapi if available
    // 3. Implement the API calls directly

    // For now, we'll simulate a response with a placeholder
    // In a real implementation, you would replace this with actual API calls

    // Example implementation using a hypothetical API endpoint
    // This is just a placeholder - you'll need to implement the actual API call
    const headers = {
      Authorization: `Bearer ${user.accessToken}`,
      "Content-Type": "application/json",
    };

    // This is a placeholder URL - you would need to implement a service
    // that interfaces with ytmusicapi
    const response = await axios.get(
      "http://your-ytmusic-api-service/history",
      { headers }
    );

    // Process and store the history data
    // This is just example code - adjust based on actual response format
    for (const item of response.data) {
      await PlayHistory.findOneAndUpdate(
        { user: user._id, videoId: item.videoId },
        {
          user: user._id,
          videoId: item.videoId,
          title: item.title,
          artist: item.artist,
          thumbnail: item.thumbnail,
          playCount: item.playCount,
          lastPlayed: new Date(item.lastPlayed),
          playlists: item.playlists,
        },
        { upsert: true, new: true }
      );
    }

    res.json({ message: "Play history synced successfully" });
  } catch (error) {
    console.error("Error syncing play history:", error);
    res.status(500).json({ error: "Failed to sync play history" });
  }
};

// @desc    Update play count for a song
// @route   PUT /api/history/:videoId
// @access  Private
export const updatePlayCount = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { title, artist, thumbnail, playlists } = req.body;

    const playHistory = await PlayHistory.findOneAndUpdate(
      { user: req.user.id, videoId },
      {
        $inc: { playCount: 1 },
        $set: {
          lastPlayed: new Date(),
          title,
          artist,
          thumbnail,
          playlists,
        },
      },
      { upsert: true, new: true }
    );

    res.json(playHistory);
  } catch (error) {
    console.error("Error updating play count:", error);
    res.status(500).json({ error: "Failed to update play count" });
  }
};
