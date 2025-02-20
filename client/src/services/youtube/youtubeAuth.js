import { google } from 'googleapis';
const OAuth2 = google.auth.OAuth2;

class YouTubeAuth {
  constructor() {
    // Load from environment variables or config
    this.clientId = import.meta.env.VITE_YOUTUBE_CLIENT_ID;
    this.clientSecret = import.meta.env.VITE_YOUTUBE_CLIENT_SECRET;
    this.redirectUri = import.meta.env.VITE_YOUTUBE_REDIRECT_URI;
    
    this.oauth2Client = new OAuth2(
      this.clientId,
      this.clientSecret,
      this.redirectUri
    );
  }

  getAuthUrl() {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/youtube.readonly']
    });
  }

  async getToken(code) {
    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);
    return tokens;
  }
}

export default new YouTubeAuth();
