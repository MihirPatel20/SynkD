import api from ".";

export const getPlayHistory = async () => {
  try {
    const response = await api.get(`/history`);
    return response.data;
  } catch (error) {
    console.error("Error fetching playlist details:", error);
    throw error;
  }
};
