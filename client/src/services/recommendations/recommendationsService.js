import { processResponseData } from "../../utils/formatters";
import createYTDataInstance from "../api/youtubeDataApi";

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

// Create a cache using closure instead of class property
const cache = new Map();

// Rate limit state
let rateLimit = {
  tokens: 100,
  lastRefill: Date.now(),
  refillRate: 100 / (60 * 1000), // 100 tokens per minute
};

// Helper functions
const getCached = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

const setCache = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
};

const checkRateLimit = () => {
  const now = Date.now();
  const timePassed = now - rateLimit.lastRefill;
  const tokensToAdd = timePassed * rateLimit.refillRate;

  rateLimit.tokens = Math.min(100, rateLimit.tokens + tokensToAdd);
  rateLimit.lastRefill = now;

  if (rateLimit.tokens < 1) return false;

  rateLimit.tokens -= 1;
  return true;
};

export const getHomeRecommendations = async () => {
  const cacheKey = "home_recommendations";
  const cached = getCached(cacheKey);
  if (cached) return cached;

  if (!checkRateLimit()) {
    throw new Error("Rate limit exceeded. Please try again later.");
  }

  try {
    const accessToken = localStorage.getItem("access_token");
    const api = createYTDataInstance(accessToken);

    /**
    const [activitiesResponse, popularResponse, subscriptionsResponse] =
      await Promise.all([
        api.get("/activities", {
          params: {
            part: "snippet,contentDetails",
            mine: true,
            maxResults: 05,
          },
        }),
        api.get("/videos", {
          params: {
            part: "snippet,statistics",
            chart: "mostPopular",
            videoCategoryId: "10",
            maxResults: 05,
          },
        }),
        api.get("/subscriptions", {
          params: {
            part: "snippet",
            mine: true,
            maxResults: 05,
          },
        }),
      ]);

    const recommendations = processResponseData(
      [...activitiesResponse.data.items, ...popularResponse.data.items],
      subscriptionsResponse.data.items
    );
    */

    const popularResponse = await api.get("/videos", {
      params: {
        part: "snippet,statistics",
        chart: "mostPopular",
        videoCategoryId: "10",
        maxResults: 5,
      },
    });

    const recommendations = processResponseData(popularResponse.data.items, []);

    setCache(cacheKey, recommendations);
    return recommendations;
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    throw new Error("Failed to fetch recommendations");
  }
};

export default {
  getHomeRecommendations,
};
