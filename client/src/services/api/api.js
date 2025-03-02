// src/api/api.js
import axios from "axios";

// Create axios instance with base URL
const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers["x-auth-token"] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Here you would typically refresh the token
        // For simplicity, we'll just redirect to login
        window.location.href = "/login";
        return Promise.reject(error);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        localStorage.removeItem("access_token");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  getGoogleAuthURL: () => api.get("/auth/google"),
  handleCallback: (code) => api.post("/auth/google/callback", { code }),
  getCurrentUser: () => api.get("/auth/me"),
  googleLogin: (accessToken) => api.post("/auth/google/token", { accessToken }),
};

// Playlists API
export const playlistsAPI = {
  getPlaylists: () => api.get("/playlists"),
  getPlaylistDetails: (id) => api.get(`/playlists/${id}`),
};

// History API
export const historyAPI = {
  getHistory: () => api.get("/history"),
  syncHistory: () => api.post("/history/sync"),
  updatePlayCount: (videoId, data) => api.put(`/history/${videoId}`, data),
};

export default api;
