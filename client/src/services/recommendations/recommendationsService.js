// src/services/recommendationsService.js

import { processResponseData } from "../../utils/formatters";
import createYTDataInstance from "../api/youtubeDataApi";
import cacheService from "../cache/cacheService";
import { fetchWithCache, handleApiError } from "../../utils/apiUtils";
import axios from "axios";

// Rate limit service
class RateLimitService {
  constructor(tokensPerMinute = 100) {
    this.rateLimit = {
      tokens: tokensPerMinute,
      lastRefill: Date.now(),
      refillRate: tokensPerMinute / (60 * 1000),
    };
  }

  checkRateLimit() {
    const now = Date.now();
    const timePassed = now - this.rateLimit.lastRefill;
    const tokensToAdd = timePassed * this.rateLimit.refillRate;

    this.rateLimit.tokens = Math.min(100, this.rateLimit.tokens + tokensToAdd);
    this.rateLimit.lastRefill = now;

    if (this.rateLimit.tokens < 1) return false;

    this.rateLimit.tokens -= 1;
    return true;
  }

  async waitForRateLimit() {
    while (!this.checkRateLimit()) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    return true;
  }
}

const rateLimitService = new RateLimitService();

export const getHomeRecommendations = async (signal = null) => {
  const cacheKey = "home_recommendations";

  return fetchWithCache(
    async () => {
      await rateLimitService.waitForRateLimit();

      const accessToken = localStorage.getItem("access_token");
      const api = createYTDataInstance(accessToken);
      const popularResponse = await api.get("/videos", {
        params: {
          part: "snippet,statistics",
          chart: "mostPopular",
          videoCategoryId: "10",
          maxResults: 5,
        },
        signal,
      });

      return processResponseData(popularResponse.data.items, []);
    },
    cacheKey,
    {},
    signal
  ).catch((error) => handleApiError(error, "fetch recommendations"));
};

export default {
  getHomeRecommendations,
};
