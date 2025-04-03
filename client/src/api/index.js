import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URI,
  withCredentials: true,
});

// Request interceptor to include the token with every request
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      config.headers["x-auth-token"] = accessToken;
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle unauthorized responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");

      // Redirect to login page
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const googleLoginCallback = async (code) => {
  try {
    const response = await api.post("/auth/google/callback", { code });

    // Store token securely
    localStorage.setItem("access_token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));

    return response.data;
  } catch (error) {
    console.error("Error during Google login:", error);
    throw error;
  }
};

export default api;
