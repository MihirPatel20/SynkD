import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URI,
  withCredentials: true,
});

const accessToken = localStorage.getItem("access_token");

export const getUserPlaylists = async () => {
  try {
    const response = await api.get("/playlists", {
      headers: {
        "x-auth-token": accessToken,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching playlists:", error);
    throw error;
  }
};

/**
 * Fetch playlist details and tracks by playlist ID
 * @param {string} playlistId - The ID of the playlist
 * @returns {Promise<Object>} - Playlist details and tracks
 */
export const getPlaylistDetailsWithTracks = async (playlistId) => {
  try {
    const response = await api.get(`/playlists/${playlistId}`, {
      headers: {
        "x-auth-token": accessToken,
        "Content-Type": "application/json",
      },
    });

    return response.data; // Return the playlist details and tracks
  } catch (error) {
    console.error("Error fetching playlist details:", error);
    throw error;
  }
};

export default api;
