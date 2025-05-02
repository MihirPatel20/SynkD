// controllers/youtubeController.js

import { google } from "googleapis";
import User from "../models/User.js";

// @desc    Get user's YouTube playlist with video details
// @route   GET /api/youtube/playlist
// @access  Private
export const getYoutubePlaylistItems = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user?.accessToken) {
      return res.status(401).json({ error: "Unauthorized: No access token" });
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    oauth2Client.setCredentials({ access_token: user.accessToken });

    const youtube = google.youtube({ version: "v3", auth: oauth2Client });

    const playlistId = req.params.id;

    if (!playlistId) {
      return res.status(400).json({ error: "playlistId is required" });
    }

    let items = [];
    let nextPageToken = null;

    do {
      const response = await youtube.playlistItems.list({
        part: ["id", "snippet", "contentDetails"],
        playlistId,
        maxResults: 50,
        pageToken: nextPageToken,
      });

      if (response?.data?.items?.length) {
        items.push(...response.data.items);
      }

      nextPageToken = response.data.nextPageToken;
    } while (nextPageToken);

    return res.status(200).json({ total: items.length, tracks: items });
  } catch (error) {
    console.error("Error fetching playlist items:", error);
    res.status(500).json({
      error: "Failed to fetch playlist items",
      details: error.message,
    });
  }
};

// @desc    Shuffle and update YouTube playlist order
// @route   POST /api/youtube/playlist/shuffle
// @access  Private
export const shuffleAndUpdatePlaylist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user?.accessToken) {
      return res.status(401).json({ error: "Unauthorized: No access token" });
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    oauth2Client.setCredentials({ access_token: user.accessToken });

    const youtube = google.youtube({ version: "v3", auth: oauth2Client });

    const { playlistId, skipVideoIds = [], randomize = true } = req.body;

    if (!playlistId) {
      return res.status(400).json({ error: "playlistId is required" });
    }

    // 1. Fetch all playlist items
    let items = [];
    let nextPageToken = null;

    do {
      const resItems = await youtube.playlistItems.list({
        part: ["id", "snippet", "contentDetails"],
        playlistId,
        maxResults: 50,
        pageToken: nextPageToken,
      });

      if (resItems?.data?.items?.length) {
        items.push(...resItems.data.items);
      }

      nextPageToken = resItems.data.nextPageToken;
    } while (nextPageToken);

    const videoList = items.map((item) => ({
      playlistItemId: item.id,
      videoId: item.contentDetails.videoId,
      title: item.snippet.title,
      position: item.snippet.position,
    }));

    // 2. Shuffle logic
    const _shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

    let toShuffle = videoList.filter((v) => !skipVideoIds.includes(v.videoId));
    let toPushEnd = videoList.filter((v) => skipVideoIds.includes(v.videoId));

    if (randomize) toShuffle = _shuffle(toShuffle);
    if (randomize && toPushEnd.length) toPushEnd = _shuffle(toPushEnd);

    const finalOrder = [...toShuffle, ...toPushEnd];

    // 3. Reorder items
    for (let i = 0; i < finalOrder.length; i++) {
      const item = finalOrder[i];

      try {
        await youtube.playlistItems.update({
          part: ["snippet"],
          requestBody: {
            id: item.playlistItemId,
            snippet: {
              playlistId,
              resourceId: {
                kind: "youtube#video",
                videoId: item.videoId,
              },
              position: i,
            },
          },
        });
      } catch (err) {
        console.error(
          `❌ Failed to update ${item.title} (${item.videoId}) to position ${i}`
        );
        console.error("Reason:", err?.response?.data?.error || err.message);
      }
    }

    // 4. Fetch updated playlist info
    const playlistRes = await youtube.playlists.list({
      part: ["snippet", "contentDetails"],
      id: [playlistId],
    });

    const playlistInfo = playlistRes.data.items?.[0];

    return res.status(200).json({
      message: "Playlist reordered successfully",
      playlist: {
        id: playlistInfo.id,
        title: playlistInfo.snippet.title,
        description: playlistInfo.snippet.description,
        itemCount: playlistInfo.contentDetails.itemCount,
        thumbnail: playlistInfo.snippet.thumbnails?.default?.url,
      },
      reorderedVideos: finalOrder.map((v, idx) => ({
        videoId: v.videoId,
        title: v.title,
        newPosition: idx,
      })),
    });
  } catch (error) {
    console.error("🔥 Error in shuffleAndUpdatePlaylist:", error);
    res.status(500).json({
      error: "Failed to reorder playlist",
      details: error.message,
    });
  }
};

// @desc    Reorder YouTube playlist based on given video positions
// @route   POST /api/youtube/playlist/reorder
// @access  Private
export const reorderPlaylist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user?.accessToken) {
      return res.status(401).json({ error: "Unauthorized: No access token" });
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    oauth2Client.setCredentials({ access_token: user.accessToken });

    const youtube = google.youtube({ version: "v3", auth: oauth2Client });

    const { playlistId, videos = [] } = req.body;

    if (!playlistId || !videos.length) {
      return res
        .status(400)
        .json({ error: "playlistId and videos are required" });
    }

    // Step 1: Fetch current playlist items
    let items = [];
    let nextPageToken = null;

    do {
      const resItems = await youtube.playlistItems.list({
        part: ["id", "snippet", "contentDetails"],
        playlistId,
        maxResults: 50,
        pageToken: nextPageToken,
      });

      if (resItems?.data?.items?.length) {
        items.push(...resItems.data.items);
      }

      nextPageToken = resItems.data.nextPageToken;
    } while (nextPageToken);

    // Step 2: Build a map of videoId => playlistItemId
    const videoMap = {};
    items.forEach((item) => {
      videoMap[item.contentDetails.videoId] = {
        playlistItemId: item.id,
        title: item.snippet.title,
      };
    });

    // Step 3: Reorder based on given positions
    for (const { videoId, position } of videos) {
      const data = videoMap[videoId];
      if (!data) continue; // videoId not found in playlist

      try {
        await youtube.playlistItems.update({
          part: ["snippet"],
          requestBody: {
            id: data.playlistItemId,
            snippet: {
              playlistId,
              resourceId: {
                kind: "youtube#video",
                videoId,
              },
              position,
            },
          },
        });
      } catch (err) {
        console.error(
          `❌ Failed to move ${data.title} (${videoId}) to ${position}`
        );
        console.error("Reason:", err?.response?.data?.error || err.message);
      }
    }

    return res.status(200).json({ message: "Playlist reordered successfully" });
  } catch (error) {
    console.error("🔥 Error in reorderPlaylist:", error);
    res.status(500).json({
      error: "Failed to reorder playlist",
      details: error.message,
    });
  }
};
