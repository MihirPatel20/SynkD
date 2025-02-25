import createYoutubeApiInstance from './youtubeApi';

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

// Create a cache using closure instead of class property
const cache = new Map();

// Rate limit state
let rateLimit = {
  tokens: 100,
  lastRefill: Date.now(),
  refillRate: 100 / (60 * 1000) // 100 tokens per minute
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
    timestamp: Date.now()
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

const processRecommendations = (activities, popular, subscriptions = []) => {
  // Process activities and popular videos
  const processed = [...activities, ...popular].map(item => ({
    id: item.id.videoId || item.id,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnail: item.snippet.thumbnails.high.url,
    channelTitle: item.snippet.channelTitle,
    publishedAt: item.snippet.publishedAt,
    viewCount: item.statistics?.viewCount,
    likeCount: item.statistics?.likeCount,
    fromSubscription: subscriptions.some(sub => 
      sub.snippet.resourceId.channelId === item.snippet.channelId
    )
  }));

  return deduplicateAndSort(processed);
};

const deduplicateAndSort = (items) => {
  const seen = new Set();
  return items
    .filter(item => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    })
    .sort((a, b) => {
      // Prioritize videos from subscribed channels
      if (a.fromSubscription && !b.fromSubscription) return -1;
      if (!a.fromSubscription && b.fromSubscription) return 1;

      const dateA = new Date(a.publishedAt);
      const dateB = new Date(b.publishedAt);
      const viewsA = parseInt(a.viewCount) || 0;
      const viewsB = parseInt(b.viewCount) || 0;
      
      // Weighted score combining recency, popularity and subscription status
      const scoreA = dateA.getTime() * 0.6 + viewsA * 0.4;
      const scoreB = dateB.getTime() * 0.6 + viewsB * 0.4;
      
      return scoreB - scoreA;
    });
};

export const getHomeRecommendations = async () => {
  const cacheKey = 'home_recommendations';
  const cached = getCached(cacheKey);
  if (cached) return cached;

  if (!checkRateLimit()) {
    throw new Error('Rate limit exceeded. Please try again later.');
  }

  try {
    const accessToken = localStorage.getItem('access_token');
    const api = createYoutubeApiInstance(accessToken);

    const [activitiesResponse, popularResponse, subscriptionsResponse] = await Promise.all([
      api.get('/activities', {
        params: {
          part: 'snippet,contentDetails',
          mine: true,
          maxResults: 25
        }
      }),
      api.get('/videos', {
        params: {
          part: 'snippet,statistics',
          chart: 'mostPopular',
          videoCategoryId: '10',
          maxResults: 25
        }
      }),
      api.get('/subscriptions', {
        params: {
          part: 'snippet',
          mine: true,
          maxResults: 25
        }
      })
    ]);

    const recommendations = processRecommendations(
      activitiesResponse.data.items,
      popularResponse.data.items,
      subscriptionsResponse.data.items
    );

    console.log('activities:', activitiesResponse.data.items);

    console.log('Fetched recommendations:', recommendations);

    setCache(cacheKey, recommendations);
    return recommendations;

  } catch (error) {
    console.error('Error fetching recommendations:', error);
    throw new Error('Failed to fetch recommendations');
  }
};

export const getPopularMusicVideos = async () => {
  try {
    const api = createYoutubeApiInstance();
    const response = await api.get('/videos', {
      params: {
        part: 'snippet,statistics',
        chart: 'mostPopular',
        videoCategoryId: '10',
        maxResults: 25
      }
    });
    return response.data.items;
  } catch (error) {
    console.error('Error fetching popular videos:', error);
    throw new Error('Failed to fetch popular videos');
  }
};

export default {
  getHomeRecommendations,
  getPopularMusicVideos
};