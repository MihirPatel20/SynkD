import { processResponseData } from "../../utils/formatters.js";
import axios from "axios";

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

export const fetchVideos = async (query, maxResults = 10) => {
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
    });

    // format the response data
    const formattedData = processResponseData(response.data.items);

    return formattedData;
  } catch (error) {
    console.error(
      "Error fetching videos:",
      error.response?.data || error.message
    );
    throw new Error("Failed to fetch videos");
  }
};

export const getVideoDetails = async (videoId) => {
  try {
    const api = createYTDataInstance();
    const response = await api.get("/videos", {
      params: {
        part: "snippet,statistics,contentDetails",
        id: videoId,
      },
    });

    return response.data.items[0];
  } catch (error) {
    console.error("Error fetching video details:", error);
    throw error;
  }
};

// Get user's playlists (requires OAuth)
export const getUserPlaylists = async (accessToken, maxResults = 10) => {
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
      duration: 0, // YouTube API doesn't provide duration in playlistItems, would need separate video API call
    }));

    // Return combined data
    return {
      ...playlistData,
      items: formattedItems,
    };
  } catch (error) {
    console.error(
      "Error fetching playlist details:",
      error.response?.data || error.message
    );
    throw new Error("Failed to fetch playlist details");
  }
};
