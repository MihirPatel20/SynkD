// src/services/api/googleApi.js
import cacheService from "../cache/cacheService";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;

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

// Fetch user profile with caching
const fetchUserProfile = async (accessToken) => {
  // Create a cache key based on the access token
  const cacheKey = `user_profile_${accessToken.substring(0, 10)}`;
  const cachedData = cacheService.get(cacheKey);

  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }

    const userData = await response.json();

    // Cache the result (user profiles don't change often, so we could use a longer cache duration)
    cacheService.set(cacheKey, userData);

    return userData;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export { getTokens, fetchUserProfile };
