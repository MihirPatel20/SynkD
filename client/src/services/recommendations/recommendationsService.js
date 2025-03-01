import { processResponseData } from "../../utils/formatters";
import createYTDataInstance from "../api/youtubeDataApi";
import cacheService from "../cache/cacheService";

// Rate limit state
let rateLimit = {
  tokens: 100,
  lastRefill: Date.now(),
  refillRate: 100 / (60 * 1000), // 100 tokens per minute
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

export const getHomeRecommendations = async (signal = null) => {
  const cacheKey = "home_recommendations";
  const cached = cacheService.get(cacheKey);

  if (cached) return cached;

  if (!checkRateLimit()) {
    throw new Error("Rate limit exceeded. Please try again later.");
  }

  try {
    const accessToken = localStorage.getItem("access_token");
    const api = createYTDataInstance(accessToken);

    const popularResponse = await api.get("/videos", {
      params: {
        part: "snippet,statistics",
        chart: "mostPopular",
        videoCategoryId: "10",
        maxResults: 5,
      },
      signal, // Add signal parameter
    });

    const recommendations = processResponseData(popularResponse.data.items, []);
    cacheService.set(cacheKey, recommendations);
    return recommendations;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Request canceled:", error.message);
      return [];
    }
    console.error("Error fetching recommendations:", error);
    throw new Error("Failed to fetch recommendations");
  }
};

export default {
  getHomeRecommendations,
};
