// src/services/api/youtubeAnalyticsApi.js
import axios from "axios";

const ANALYTICS_BASE_URL = "https://youtubeanalytics.googleapis.com/v2/reports";

// Create a YouTube Analytics API instance
const createYTAnalyticsInstance = (accessToken) => {
  if (!accessToken) {
    throw new Error("Access token is required for YouTube Analytics API");
  }

  return axios.create({
    baseURL: ANALYTICS_BASE_URL,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export default createYTAnalyticsInstance;

// Get playlist analytics data
export const getPlaylistAnalytics = async (playlistId, startDate, endDate) => {
  try {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      throw new Error("No access token available");
    }

    const api = createYTAnalyticsInstance(accessToken);

    // Format dates if not provided
    const formattedStartDate = startDate || "2010-01-01";
    const formattedEndDate = endDate || new Date().toISOString().split("T")[0];

    const response = await api.get("", {
      params: {
        ids: "channel==MINE",
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        metrics:
          "views,estimatedMinutesWatched,playlistStarts,playlistViews,viewsPerPlaylistStart",
        dimensions: "playlist",
        filters: `playlist==${playlistId}`,
      },
    });

    return processAnalyticsData(response.data);
  } catch (error) {
    console.error(
      "Error fetching playlist analytics:",
      error.response?.data || error.message
    );
    throw new Error("Failed to fetch playlist analytics");
  }
};

// Helper functions to process API response data
const processAnalyticsData = (data) => {
  if (!data.rows || data.rows.length === 0) {
    return {
      views: 0,
      estimatedMinutesWatched: 0,
      playlistStarts: 0,
      playlistViews: 0,
      viewsPerPlaylistStart: 0,
    };
  }

  const row = data.rows[0];
  const headers = data.columnHeaders.map((header) => header.name);

  const result = {};
  headers.forEach((header, index) => {
    result[header] = row[index];
  });

  return result;
};

// Get video analytics data
export const getVideoAnalytics = async (videoIds, startDate, endDate) => {
  try {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      throw new Error("No access token available");
    }

    const api = createYTAnalyticsInstance(accessToken);

    // Format dates if not provided
    const formattedStartDate = startDate || "2010-01-01";
    const formattedEndDate = endDate || new Date().toISOString().split("T")[0];

    // Join video IDs with commas for the filter
    const videoIdsFilter = videoIds.join(",");

    const response = await api.get("", {
      params: {
        ids: "channel==MINE",
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        metrics:
          "views,estimatedMinutesWatched,likes,dislikes,comments,shares,averageViewDuration,averageViewPercentage",
        dimensions: "video",
        filters: `video==${videoIdsFilter}`,
        sort: "-views", // Sort by views in descending order
      },
    });

    return processVideoAnalyticsData(response.data);
  } catch (error) {
    console.error(
      "Error fetching video analytics:",
      error.response?.data || error.message
    );
    throw new Error("Failed to fetch video analytics");
  }
};

// Helper function to process video analytics data
const processVideoAnalyticsData = (data) => {
  if (!data.rows || data.rows.length === 0) {
    return [];
  }

  return data.rows.map((row) => {
    const result = {};
    data.columnHeaders.forEach((header, index) => {
      result[header.name] = row[index];
    });
    return result;
  });
};
