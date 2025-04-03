import { getVideoDetails } from "./api/youtubeAnalyticsApi";
import { getPlaylistDetails } from "./api/youtubeDataApi";

export const getPlaylistVideoDetails = async (
  playlistId,
  startDate,
  endDate
) => {
  try {
    // First, get the playlist details and videos from the Data API
    const playlistDetails = await getPlaylistDetails(playlistId);
    console.log("Playlist details:", playlistDetails);

    // Extract video IDs from the playlist items
    const videoIds = playlistDetails.items.map((item) => item.id);

    console.log("Video IDs:", videoIds);

    // Fetch analytics for all videos in the playlist
    const videoAnalytics = await getVideoDetails(videoIds, startDate, endDate);

    // Map analytics data to each video in the playlist
    const itemsWithAnalytics = playlistDetails.items.map((item) => {
      const videoId = item.snippet.resourceId.videoId;
      const analytics =
        videoAnalytics.find((analytics) => analytics.video === videoId) || {};

      return {
        id: videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high.url,
        publishedAt: item.snippet.publishedAt,
        position: item.snippet.position,
        analytics: analytics,
      };
    });

    return {
      id: playlistId,
      snippet: playlistDetails.snippet,
      items: itemsWithAnalytics,
    };
  } catch (error) {
    console.error("Error fetching playlist video details:", error);
    throw error;
  }
};
