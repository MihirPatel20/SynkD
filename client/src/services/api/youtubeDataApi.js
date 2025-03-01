// src/services/api/youtubeDataApi.js
import { processResponseData } from "../../utils/formatters.js";
import axios from "axios";
import cacheService from "../cache/cacheService";

const BASE_URL = "https://www.googleapis.com/youtube/v3";
const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

// Create a new axios instance for YouTube Data API
const createYTDataInstance = (accessToken = null) => {
  const headers = accessToken
    ? { Authorization: `Bearer ${accessToken}` }
    : { "X-Goog-Api-Key": API_KEY };

  return axios.create({
    baseURL: BASE_URL,
    headers,
  });
};

export default createYTDataInstance;

export const fetchVideos = async (query, maxResults = 10, signal = null) => {
  // Create a cache key based on the query parameters
  const cacheKey = `videos_${query}_${maxResults}`;
  const cachedData = cacheService.get(cacheKey);

  if (cachedData) {
    return cachedData;
  }

  try {
    const api = createYTDataInstance();
    const response = await api.get("/search", {
      params: {
        part: "snippet",
        maxResults,
        q: query,
        type: "video",
        videoCategoryId: "10", // Music category
        order: "relevance",
        videoEmbeddable: true,
        key: API_KEY,
      },
      signal,
    });

    // Format the response data
    const formattedData = processResponseData(response.data.items);

    // Cache the result
    cacheService.set(cacheKey, formattedData);

    return formattedData;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Request canceled:", error.message);
      return [];
    }

    console.error(
      "Error fetching videos:",
      error.response?.data || error.message
    );
    throw new Error("Failed to fetch videos");
  }
};

export const getVideoDetails = async (videoId, signal = null) => {
  // Create a cache key based on the video ID
  const cacheKey = `video_details_${videoId}`;
  const cachedData = cacheService.get(cacheKey);

  if (cachedData) {
    return cachedData;
  }

  try {
    const api = createYTDataInstance();
    const response = await api.get("/videos", {
      params: {
        part: "snippet,statistics,contentDetails",
        id: videoId,
      },
      signal,
    });

    const videoData = response.data.items[0];

    // Cache the result
    cacheService.set(cacheKey, videoData);

    return videoData;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Request canceled:", error.message);
      return null;
    }

    console.error("Error fetching video details:", error);
    throw error;
  }
};

// Get user's playlists (requires OAuth)
export const getUserPlaylists = async (accessToken, maxResults = 10) => {
  // Create a cache key based on the access token (or user ID if available)
  const cacheKey = `user_playlists_${accessToken.substring(0, 10)}`;
  const cachedData = cacheService.get(cacheKey);

  if (cachedData) {
    return cachedData;
  }

  try {
    const api = createYTDataInstance(accessToken);
    let allPlaylists = [];
    let nextPageToken = null;

    do {
      const response = await api.get("/playlists", {
        params: {
          part: "snippet,contentDetails",
          mine: true,
          maxResults,
          pageToken: nextPageToken,
        },
      });

      allPlaylists = [...allPlaylists, ...response.data.items];
      nextPageToken = response.data.nextPageToken;
    } while (nextPageToken);

    // Cache the result
    cacheService.set(cacheKey, allPlaylists);

    return allPlaylists;
  } catch (error) {
    console.error(
      "Error fetching user playlists:",
      error.response?.data || error.message
    );
    throw new Error("Failed to fetch user playlists");
  }
};

// Get playlist details and items
export const getPlaylistDetails = async (playlistId) => {
  // Create a cache key based on the playlist ID
  const cacheKey = `playlist_details_${playlistId}`;
  const cachedData = cacheService.get(cacheKey);

  if (cachedData) {
    return cachedData;
  }

  try {
    const api = createYTDataInstance();

    // Get playlist metadata
    const playlistResponse = await api.get("/playlists", {
      params: {
        part: "snippet,contentDetails",
        id: playlistId,
      },
    });

    if (
      !playlistResponse.data.items ||
      playlistResponse.data.items.length === 0
    ) {
      throw new Error("Playlist not found");
    }

    const playlistData = playlistResponse.data.items[0];

    // Get playlist items (videos)
    const itemsResponse = await api.get("/playlistItems", {
      params: {
        part: "snippet,contentDetails",
        playlistId: playlistId,
        maxResults: 50,
      },
    });

    // Process items to match your component's expected format
    const formattedItems = itemsResponse.data.items.map((item) => ({
      id: item.id,
      videoId: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      artist: item.snippet.videoOwnerChannelTitle || "Unknown artist",
      thumbnail: item.snippet.thumbnails?.default?.url || "",
      dateAdded: item.snippet.publishedAt,
      duration: 0, // YouTube API doesn't provide duration in playlistItems
    }));

    // Return combined data
    const result = {
      ...playlistData,
      items: formattedItems,
    };

    // Cache the result
    cacheService.set(cacheKey, result);

    return result;
  } catch (error) {
    console.error(
      "Error fetching playlist details:",
      error.response?.data || error.message
    );
    throw new Error("Failed to fetch playlist details");
  }
};
