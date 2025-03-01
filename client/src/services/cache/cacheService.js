// src/services/cache/cacheService.js

const DEFAULT_CACHE_DURATION = 5 * 60 * 1000;
const MAX_CACHE_SIZE = 100;
const CACHE_STORAGE_KEY = "app_cache_data";

class CacheService {
  constructor(cacheDuration = DEFAULT_CACHE_DURATION) {
    this.cacheDuration = cacheDuration;
    this._loadCacheFromStorage();
  }

  _loadCacheFromStorage() {
    try {
      const storedCache = localStorage.getItem(CACHE_STORAGE_KEY);
      this.cache = storedCache ? new Map(JSON.parse(storedCache)) : new Map();
    } catch (error) {
      console.error("Error loading cache from storage:", error);
      this.cache = new Map();
    }
  }

  _saveCacheToStorage() {
    try {
      localStorage.setItem(
        CACHE_STORAGE_KEY,
        JSON.stringify(Array.from(this.cache.entries()))
      );
    } catch (error) {
      console.error("Error saving cache to storage:", error);
    }
  }

  get(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
      // Update access timestamp for LRU implementation
      cached.lastAccessed = Date.now();
      this._saveCacheToStorage();
      return cached.data;
    }

    // Remove expired item
    if (cached) {
      this.cache.delete(key);
      this._saveCacheToStorage();
    }

    return null;
  }

  set(key, data) {
    // Clean cache if it's too large
    if (this.cache.size >= MAX_CACHE_SIZE) {
      this._cleanCache();
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      lastAccessed: Date.now(),
    });

    this._saveCacheToStorage();
  }

  _cleanCache() {
    // Find least recently used item
    let oldestKey = null;
    let oldestTime = Date.now();

    for (const [k, v] of this.cache.entries()) {
      if (v.lastAccessed < oldestTime) {
        oldestTime = v.lastAccessed;
        oldestKey = k;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
      this._saveCacheToStorage();
    }
  }

  clear() {
    this.cache.clear();
    localStorage.removeItem(CACHE_STORAGE_KEY);
  }

  delete(key) {
    this.cache.delete(key);
    this._saveCacheToStorage();
  }
}

// Create a singleton instance
const cacheService = new CacheService();
export default cacheService;
