import { createYoutubeApi } from '../youtube/youtubeApi';

// Session timeout in milliseconds (30 minutes)
const SESSION_TIMEOUT = 30 * 60 * 1000;

class SessionManager {
  constructor() {
    this.sessionTimer = null;
    this.lastActivity = Date.now();
  }

  initialize() {
    this.resetSessionTimer();
    this.setupActivityListeners();
  }

  resetSessionTimer() {
    if (this.sessionTimer) {
      clearTimeout(this.sessionTimer);
    }
    this.sessionTimer = setTimeout(this.handleSessionTimeout, SESSION_TIMEOUT);
  }

  setupActivityListeners() {
    ['mousedown', 'keydown', 'scroll', 'touchstart'].forEach(event => {
      window.addEventListener(event, () => {
        this.lastActivity = Date.now();
        this.resetSessionTimer();
      });
    });
  }

  handleSessionTimeout = () => {
    // Clear session data
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('yt_tokens');
    
    // Redirect to login
    window.location.href = '/login';
  }

  logActivity(action) {
    console.log(`User activity: ${action} at ${new Date().toISOString()}`);
    // In production, send to security monitoring service
  }
}

export default new SessionManager();