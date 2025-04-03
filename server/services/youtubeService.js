import { google } from "googleapis";

// Create OAuth2 client with user's access token
export const createYoutubeClient = (accessToken) => {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });

  return google.youtube({
    version: "v3",
    auth: oauth2Client,
  });
};

// Refresh access token if expired
export const refreshAccessToken = async (user) => {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    oauth2Client.setCredentials({
      refresh_token: user.refreshToken,
    });

    const { credentials } = await oauth2Client.refreshAccessToken();

    // Calculate new expiry time
    const expiryDate = new Date();
    expiryDate.setSeconds(expiryDate.getSeconds() + credentials.expires_in);

    // Update user's tokens
    user.accessToken = credentials.access_token;
    user.tokenExpiry = expiryDate;
    await user.save();

    return credentials.access_token;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    throw new Error("Failed to refresh access token");
  }
};
