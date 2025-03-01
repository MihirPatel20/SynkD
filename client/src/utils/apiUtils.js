// src/utils/apiUtils.js
import axios from "axios";
import cacheService from "../services/cache/cacheService";

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
    const result = Array.isArray(params)
      ? await fetchFunction(...params, signal)
      : await fetchFunction(params, signal);

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
    // This is a simple implementation - for a more advanced approach,
    // you would need to iterate through all keys in the cache
    cacheService.delete(keyPattern);
  } else {
    // Clear all cache
    cacheService.clear();
  }
};
