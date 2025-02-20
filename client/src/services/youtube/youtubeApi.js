import axios from "axios";

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = "https://www.googleapis.com/youtube/v3";

// Create axios instance factory with token support
export const createYoutubeApi = (accessToken = null) => {
  return axios.create({
    baseURL: BASE_URL,
    headers: accessToken
      ? {
          Authorization: `Bearer ${accessToken}`,
        }
      : {
          "X-Goog-Api-Key": import.meta.env.VITE_YOUTUBE_API_KEY,
        },
  });
};

// Get user's playlists (requires OAuth)
export const getUserPlaylists = async (accessToken, maxResults = 50) => {
  try {
    const api = createYoutubeApi(accessToken);
    const response = await api.get("/playlists", {
      params: {
        part: "snippet,contentDetails",
        mine: true,
        maxResults,
      },
    });
    return response.data.items;
  } catch (error) {
    console.error(
      "Error fetching user playlists:",
      error.response?.data || error.message
    );
    throw new Error("Failed to fetch user playlists");
  }
};

// Get user's liked videos (requires OAuth)
export const getLikedVideos = async (accessToken, maxResults = 50) => {
  try {
    const api = createYoutubeApi(accessToken);
    const response = await api.get("/videos", {
      params: {
        part: "snippet,contentDetails",
        myRating: "like",
        maxResults,
      },
    });
    return response.data.items;
  } catch (error) {
    console.error(
      "Error fetching liked videos:",
      error.response?.data || error.message
    );
    throw new Error("Failed to fetch liked videos");
  }
};

// Modified existing functions to use the factory
export const fetchVideos = async (query, maxResults = 10) => {
  try {
    const api = createYoutubeApi();
    const response = await api.get("/search", {
      params: {
        part: "snippet",
        maxResults,
        q: query,
        type: "video",
        videoCategoryId: "10",
        order: "relevance",
        videoEmbeddable: true,
      },
    });
    return response.data.items;
  } catch (error) {
    console.error(
      "Error fetching videos:",
      error.response?.data || error.message
    );
    throw new Error("Failed to fetch videos");
  }
};

// Get popular music videos
export const getPopularMusicVideos = async (maxResults = 10) => {
  try {
    const response = await youtubeApi.get("/videos", {
      params: {
        part: "snippet,statistics",
        chart: "mostPopular",
        videoCategoryId: "10",
        maxResults,
        regionCode: "US", // Can be changed based on user's location
      },
    });
    return response.data.items;
  } catch (error) {
    console.error(
      "Error fetching popular videos:",
      error.response?.data || error.message
    );
    throw new Error("Failed to fetch popular videos");
  }
};

// Search playlists
export const searchPlaylists = async (query, maxResults = 10) => {
  try {
    const response = await youtubeApi.get("/search", {
      params: {
        part: "snippet",
        maxResults,
        q: query,
        type: "playlist",
      },
    });
    return response.data.items;
  } catch (error) {
    console.error(
      "Error searching playlists:",
      error.response?.data || error.message
    );
    throw new Error("Failed to search playlists");
  }
};
