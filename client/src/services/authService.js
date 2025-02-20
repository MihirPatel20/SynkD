const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
const CLIENT_SECRET = import.meta.env.VITE_GOOGLE_CLIENT_SECRET;

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
    if (window.gapi && window.gapi.auth2) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => {
      window.gapi.load('client:auth2', () => {
        window.gapi.client.init({
          clientId: CLIENT_ID,
          scope: SCOPES.join(' ')
        }).then(() => {
          resolve();
        }).catch((error) => {
          reject(error);
        });
      });
    };
    script.onerror = reject;
    document.body.appendChild(script);
  });
};

// Sign in function
export const signIn = async () => {
  const auth2 = window.gapi.auth2.getAuthInstance();
  if (!auth2) {
    throw new Error('Google Auth instance not initialized');
  }
  const user = await auth2.signIn();
  return user;
};

// Sign out function
export const signOut = async () => {
  const auth2 = window.gapi.auth2.getAuthInstance();
  if (!auth2) {
    throw new Error('Google Auth instance not initialized');
  }
  await auth2.signOut();
};

// Get access token
export const getAccessToken = () => {
  const auth2 = window.gapi.auth2.getAuthInstance();
  if (auth2 && auth2.isSignedIn.get()) {
    return auth2.currentUser.get().getAuthResponse().access_token;
  }
  return null;
};

// Get tokens from authorization code
export const getTokens = async (code) => {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to get tokens');
  }

  return response.json();
};

// Get auth URL for redirect
export const getAuthUrl = () => {
  return `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    access_type: 'offline',
    scope: SCOPES.join(' '),
    prompt: 'consent',
  }).toString()}`;
};