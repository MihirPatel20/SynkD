// src/services/api/googleApi.js

import cacheService from "../cache/cacheService";
import { fetchWithCache, handleApiError } from "../../utils/apiUtils";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;

// Get tokens from authorization code
const getTokens = async (code) => {
  try {
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
  } catch (error) {
    return handleApiError(error, "get tokens");
  }
};

// Fetch user profile with caching
const fetchUserProfile = async (accessToken) => {
  const cacheKey = `user_profile_${accessToken.substring(0, 10)}`;
  
  return fetchWithCache(
    async () => {
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
      
      return response.json();
    },
    cacheKey
  ).catch(error => handleApiError(error, "fetch user profile"));
};

export { getTokens, fetchUserProfile };
