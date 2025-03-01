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
