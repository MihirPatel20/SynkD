// src/services/cache/cacheService.js

const DEFAULT_CACHE_DURATION = 5 * 60 * 1000;
const MAX_CACHE_SIZE = 100;
const CACHE_STORAGE_KEY = "app_cache_data";

class CacheService {
  constructor(cacheDuration = DEFAULT_CACHE_DURATION) {
    this.cacheDuration = cacheDuration;
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0
    };
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
      this.stats.hits++;
      this._saveCacheToStorage();
      return cached.data;
    }

    // Remove expired item
    if (cached) {
      this.cache.delete(key);
      this._saveCacheToStorage();
    }
    this.stats.misses++;
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
    this.stats.sets++;
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
    this.stats.deletes += this.cache.size;
    localStorage.removeItem(CACHE_STORAGE_KEY);
  }

  delete(key) {
    this.cache.delete(key);
    this.stats.deletes++;
    this._saveCacheToStorage();
  }

  getKeysByPattern(pattern) {
    const regex = new RegExp(pattern);
    const matchingKeys = [];
    
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        matchingKeys.push(key);
      }
    }
    
    return matchingKeys;
  }

  invalidateByAge(maxAge) {
    const now = Date.now();
    let deletedCount = 0;
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > maxAge) {
        this.cache.delete(key);
        deletedCount++;
      }
    }
    if (deletedCount > 0) {
      this.stats.deletes += deletedCount;
      this._saveCacheToStorage();
    }
    return deletedCount;
  }
}

// Create a singleton instance
const cacheService = new CacheService();

export default cacheService;
export { CacheService };
