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

export const createShufflePlaylist = async (playlistId, formData) => {
  console.log("Creating shuffle playlist with data:", formData);
  try {
    const response = await api.post("/playlists/shuffle", {
      ...formData,
      playlistId,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating shuffle playlist:", error);
    throw error;
  }
};
