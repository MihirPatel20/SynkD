// src/services/authService.js
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;

// Scope for YouTube Data API
const SCOPES = [
  'https://www.googleapis.com/auth/youtube.readonly',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email'
];

// Initialize Google OAuth
export const initializeGoogleOAuth = () => {
  return window.gapi.client.init({
    clientId: CLIENT_ID,
    scope: SCOPES.join(' ')
  });
};

// Load Google API Client
export const loadGoogleApi = () => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => {
      window.gapi.load('client:auth2', () => {
        initializeGoogleOAuth()
          .then(resolve)
          .catch(reject);
      });
    };
    script.onerror = reject;
    document.body.appendChild(script);
  });
};

// Sign in function
export const signIn = async () => {
  const auth2 = window.gapi.auth2.getAuthInstance();
  const user = await auth2.signIn();
  return user;
};

// Sign out function
export const signOut = async () => {
  const auth2 = window.gapi.auth2.getAuthInstance();
  await auth2.signOut();
};

// Get access token
export const getAccessToken = () => {
  const auth2 = window.gapi.auth2.getAuthInstance();
  if (auth2.isSignedIn.get()) {
    return auth2.currentUser.get().getAuthResponse().access_token;
  }
  return null;
};
