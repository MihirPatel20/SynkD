// src/utils/formatters.js

/**
 * Formats a date string to a readable format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
export const formatDate = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Formats a number to K/M format
 * @param {number|string} count - The count to format
 * @returns {string} Formatted count
 */
export const formatCount = (count) => {
  if (!count) return "0";

  const num = parseInt(count);
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
};

/**
 * Formats ISO 8601 duration to readable time
 * @param {string} duration - ISO 8601 duration format
 * @returns {string} Formatted duration
 */
export const formatDuration = (duration) => {
  if (!duration) return "0:00";

  // ISO 8601 duration format parsing (simplified)
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

  const hours = (match[1] && match[1].replace("H", "")) || 0;
  const minutes = (match[2] && match[2].replace("M", "")) || 0;
  const seconds = (match[3] && match[3].replace("S", "")) || 0;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

/**
 * Processes video data from YouTube API response
 * @param {array} items - Video items from YouTube API
 * @param {array} subscriptions - User's subscriptions
 * @returns {array} Processed video data
 */

export const processResponseData = (items, subscriptions = []) => {
  const processed = items.map((item) => ({
    id: item.id.videoId || item.id,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnail: item.snippet.thumbnails.high.url,
    channelTitle: item.snippet.channelTitle,
    publishedAt: item.snippet.publishedAt,
    viewCount: item.statistics?.viewCount,
    likeCount: item.statistics?.likeCount,
    fromSubscription: subscriptions.some(
      (sub) => sub.snippet.resourceId.channelId === item.snippet.channelId
    ),
  }));

  return deduplicateAndSort(processed);
};

const deduplicateAndSort = (items) => {
  const seen = new Set();
  return items
    .filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    })
    .sort((a, b) => {
      if (a.fromSubscription && !b.fromSubscription) return -1;
      if (!a.fromSubscription && b.fromSubscription) return 1;

      const dateA = new Date(a.publishedAt);
      const dateB = new Date(b.publishedAt);
      const viewsA = parseInt(a.viewCount) || 0;
      const viewsB = parseInt(b.viewCount) || 0;

      const scoreA = dateA.getTime() * 0.6 + viewsA * 0.4;
      const scoreB = dateB.getTime() * 0.6 + viewsB * 0.4;

      return scoreB - scoreA;
    });
};
