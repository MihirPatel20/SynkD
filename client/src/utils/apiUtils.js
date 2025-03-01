// src/utils/apiUtils.js

import axios from "axios";
import cacheService, { CacheService } from "../services/cache/cacheService";

// Error handler
export const handleApiError = (error, operation) => {
  if (axios.isCancel(error)) {
    console.log("Request canceled:", error.message);
    return null;
  }

  console.error(`Error ${operation}:`, error.response?.data || error.message);
  throw new Error(`Failed to ${operation}`);
};

export const fetchWithCache = async (
  fetchFunction,
  cacheKey,
  params = {},
  signal = null,
  cacheDuration = null // Optional parameter to override default cache duration
) => {
  // Check cache first
  const cached = cacheService.get(cacheKey);
  if (cached) {
    console.log(`Cache hit for key: ${cacheKey}`);
    return cached;
  }

  console.log(`Cache miss for key: ${cacheKey}, fetching from API...`);
  try {
    // If not in cache, make the API call
    const result = await fetchFunction();

    // Cache the result with custom duration if provided
    if (cacheDuration) {
      // Create a custom cache service instance with the specified duration
      const customCacheService = new CacheService(cacheDuration);
      customCacheService.set(cacheKey, result);
    } else {
      // Use default cache duration
      cacheService.set(cacheKey, result);
    }

    return result;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Request canceled:", error.message);
      return null;
    }

    throw error;
  }
};

// Add a utility function to clear specific cache entries
export const clearCache = (keyPattern) => {
  // If keyPattern is provided, clear only matching keys
  if (keyPattern) {
    const matchingKeys = cacheService.getKeysByPattern(keyPattern);
    for (const key of matchingKeys) {
      cacheService.delete(key);
    }
  } else {
    // Clear all cache
    cacheService.clear();
  }
};
