import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URI,
  withCredentials: true,
});

export const getUserPlaylists = async () => {
  try {
    const accessToken = localStorage.getItem("access_token");

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

export default api;
