import axios from "axios";

const BASE_URL = "https://www.googleapis.com/youtube/v3";

// Create axios instance factory with token support
const createYoutubeApiInstance = (accessToken = null) => {
  const headers = accessToken
    ? { Authorization: `Bearer ${accessToken}` }
    : { "X-Goog-Api-Key": import.meta.env.VITE_YOUTUBE_API_KEY };

  return axios.create({
    baseURL: BASE_URL,
    headers,
  });
};

export default createYoutubeApiInstance;

// Modified existing functions to use the factory
export const fetchVideos = async (query, maxResults = 10) => {
  try {
    const api = createYoutubeApiInstance();
    const response = await api.get("/search", {
      params: {
        part: "snippet",
        maxResults,
        q: query,
        type: "video",
        videoCategoryId: "10", // Music category
        order: "relevance",
        videoEmbeddable: true,
        key: import.meta.env.VITE_YOUTUBE_API_KEY,
      },
    });
    return response.data.items;
  } catch (error) {
    console.error(
      "Error fetching videos:",
      error.response?.data || error.message
    );
    throw new Error("Failed to fetch videos");
  }
};

// Get user's liked videos (requires OAuth)
export const getLikedVideos = async (accessToken, maxResults = 50) => {
  try {
    const api = createYoutubeApiInstance(accessToken);
    const response = await api.get("/videos", {
      params: {
        part: "snippet,contentDetails",
        myRating: "like",
        maxResults,
      },
    });
    return response.data.items;
  } catch (error) {
    console.error(
      "Error fetching liked videos:",
      error.response?.data || error.message
    );
    throw new Error("Failed to fetch liked videos");
  }
};

// Get popular music videos
export const getPopularMusicVideos = async (maxResults = 10) => {
  try {
    const api = createYoutubeApiInstance();
    const response = await api.get("/videos", {
      params: {
        part: "snippet,statistics",
        chart: "mostPopular",
        videoCategoryId: "10",
        maxResults,
        regionCode: "US",
        key: import.meta.env.VITE_YOUTUBE_API_KEY,
      },
    });
    return response.data.items;
  } catch (error) {
    console.error(
      "Error fetching popular videos:",
      error.response?.data || error.message
    );
    throw new Error("Failed to fetch popular videos");
  }
};

// Search playlists
export const searchPlaylists = async (query, maxResults = 10) => {
  try {
    const api = createYoutubeApiInstance();
    const response = await api.get("/search", {
      params: {
        part: "snippet",
        maxResults,
        q: query,
        type: "playlist",
        key: import.meta.env.VITE_YOUTUBE_API_KEY,
      },
    });
    return response.data.items;
  } catch (error) {
    console.error(
      "Error searching playlists:",
      error.response?.data || error.message
    );
    throw new Error("Failed to search playlists");
  }
};

// Get user's playlists (requires OAuth)
export const getUserPlaylists = async (accessToken, maxResults = 10) => {
  try {
    const api = createYoutubeApiInstance(accessToken);
    let allPlaylists = [];
    let nextPageToken = null;

    do {
      const response = await api.get("/playlists", {
        params: {
          part: "snippet,contentDetails",
          mine: true,
          maxResults,
          pageToken: nextPageToken,
        },
      });

      allPlaylists = [...allPlaylists, ...response.data.items];
      nextPageToken = response.data.nextPageToken;
    } while (nextPageToken);

    return allPlaylists;
  } catch (error) {
    console.error(
      "Error fetching user playlists:",
      error.response?.data || error.message
    );
    throw new Error("Failed to fetch user playlists");
  }
};

// Get playlist details and items
export const getPlaylistDetails = async (playlistId) => {
  console.log("playlistId:", playlistId);
  try {
    const api = createYoutubeApiInstance();

    // Get playlist metadata
    const playlistResponse = await api.get("/playlists", {
      params: {
        part: "snippet,contentDetails",
        id: playlistId,
      },
    });

    console.log("playlistResponse:", playlistResponse && playlistResponse.data);

    if (
      !playlistResponse.data.items ||
      playlistResponse.data.items.length === 0
    ) {
      throw new Error("Playlist not found");
    }

    const playlistData = playlistResponse.data.items[0];

    // Get playlist items (videos)
    const itemsResponse = await api.get("/playlistItems", {
      params: {
        part: "snippet,contentDetails",
        playlistId: playlistId,
        maxResults: 50,
      },
    });

    console.log("itemsResponse:", itemsResponse.data);

    // Process items to match your component's expected format
    const formattedItems = itemsResponse.data.items.map((item) => ({
      id: item.id,
      videoId: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      artist: item.snippet.videoOwnerChannelTitle || "Unknown artist",
      thumbnail: item.snippet.thumbnails?.default?.url || "",
      dateAdded: item.snippet.publishedAt,
      duration: 0, // YouTube API doesn't provide duration in playlistItems, would need separate video API call
    }));

    // Return combined data
    return {
      ...playlistData,
      items: formattedItems,
    };
  } catch (error) {
    console.error(
      "Error fetching playlist details:",
      error.response?.data || error.message
    );
    throw new Error("Failed to fetch playlist details");
  }
};
