import api from ".";

export const getUserPlaylists = async () => {
  try {
    const response = await api.get("/playlists");
    return response.data;
  } catch (error) {
    console.error("Error fetching playlists:", error);
    throw error;
  }
};

export const getPlaylistDetailsWithTracks = async (playlistId) => {
  try {
    const response = await api.get(`/playlists/${playlistId}`);
    return response.data.playlist;
  } catch (error) {
    console.error("Error fetching playlist details:", error);
    throw error;
  }
};
