import axios from "axios";

const BASE_URL = "https://www.googleapis.com/youtube/v3";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
const CLIENT_SECRET = import.meta.env.VITE_GOOGLE_CLIENT_SECRET;

// Create a new axios instance for Google API
const createGapiInstance = (accessToken = null) => {
  const headers = accessToken
    ? { Authorization: `Bearer ${accessToken}` }
    : { "X-Goog-Api-Key": import.meta.env.VITE_YOUTUBE_API_KEY };

  return axios.create({
    baseURL: BASE_URL,
    headers,
  });
};

export default createGapiInstance;

// Get tokens from authorization code
const getTokens = async (code) => {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to get tokens");
  }

  return response.json();
};

// Fetch user profile
const fetchUserProfile = async (accessToken) => {
  try {
    // You can use your existing axios instance factory
    const api = createGapiInstance(accessToken);

    // Make request to Google's userinfo endpoint
    const response = await api.get(
      "https://www.googleapis.com/oauth2/v3/userinfo"
    );

    console.log("User profile:", response.data);

    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export { getTokens, fetchUserProfile };
