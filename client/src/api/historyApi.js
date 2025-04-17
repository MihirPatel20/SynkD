import api from ".";

export const getPlayHistory = async () => {
  try {
    const response = await api.get(`/music/history`);
    return response.data;
  } catch (error) {
    console.error("Error fetching playlist details:", error);
    throw error;
  }
};

export const getHomeFeedVideos = async () => {
  try {
    const response = await api.get(`/music/home`);
    return response.data;
  } catch (error) {
    console.error("Error fetching playlist details:", error);
    throw error;
  }
};
