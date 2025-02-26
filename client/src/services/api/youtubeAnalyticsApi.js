// src/services/api/youtubeAnalyticsApi.js
import axios from "axios";

const ANALYTICS_BASE_URL = "https://youtubeanalytics.googleapis.com/v2/reports";

// Create a YouTube Analytics API instance
export const createYTAnalyticsInstance = (accessToken) => {
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

// Get top videos in a playlist
export const getPlaylistTopVideos = async (
  playlistId,
  startDate,
  endDate,
  maxResults = 10
) => {
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
        metrics: "views,estimatedMinutesWatched",
        dimensions: "video",
        filters: `playlist==${playlistId}`,
        sort: "-views",
        maxResults: maxResults,
      },
    });

    return processTopVideosData(response.data);
  } catch (error) {
    console.error(
      "Error fetching playlist top videos:",
      error.response?.data || error.message
    );
    throw new Error("Failed to fetch playlist top videos");
  }
};

// Get playlist traffic sources
export const getPlaylistTrafficSources = async (
  playlistId,
  startDate,
  endDate
) => {
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
        metrics: "views,playlistStarts,playlistViews",
        dimensions: "insightTrafficSourceType",
        filters: `playlist==${playlistId}`,
        sort: "-playlistViews",
      },
    });

    return processTrafficSourcesData(response.data);
  } catch (error) {
    console.error(
      "Error fetching playlist traffic sources:",
      error.response?.data || error.message
    );
    throw new Error("Failed to fetch playlist traffic sources");
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

const processTopVideosData = (data) => {
  if (!data.rows || data.rows.length === 0) {
    return [];
  }

  const headers = data.columnHeaders.map((header) => header.name);

  return data.rows.map((row) => {
    const result = {};
    headers.forEach((header, index) => {
      result[header] = row[index];
    });
    return result;
  });
};

const processTrafficSourcesData = (data) => {
  if (!data.rows || data.rows.length === 0) {
    return [];
  }

  const headers = data.columnHeaders.map((header) => header.name);

  return data.rows.map((row) => {
    const result = {};
    headers.forEach((header, index) => {
      result[header] = row[index];
    });
    return result;
  });
};
