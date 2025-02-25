import createYoutubeApiInstance from "../youtube/youtubeApi";

// Add this function to your existing API service file
export const fetchUserProfile = async (accessToken) => {
    try {
      // You can use your existing axios instance factory
      const api = createYoutubeApiInstance(accessToken);
      
      // Make request to Google's userinfo endpoint
      const response = await api.get('https://www.googleapis.com/oauth2/v3/userinfo');
      
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }; 
  