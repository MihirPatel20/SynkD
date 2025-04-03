import User from "../models/User.js";
import { executeYTMusicFunction } from "../utils/pythonExecutor.js";

// @desc    Get user's play history
// @route   GET /api/history
// @access  Private
export const getPlayHistory = async (req, res) => {
  try {
    const result = await executeYTMusicFunction(req, res, "get_history");

    if (result && result.success) {
      // Extract only the important data from each history item
      const structuredHistory = result.data.map(item => ({
        song_name: item.title,
        artist: item.artists && item.artists.length > 0 ? item.artists[0].name : null,
        video_id: item.videoId,
        thumbnail: item.thumbnails && item.thumbnails.length > 0 ? item.thumbnails[0].url : null
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
