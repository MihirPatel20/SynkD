# SynkD - YouTube Music Playlist Manager

SynkD is a modern music streaming application that enhances your YouTube Music experience by providing unbiased playlist shuffling and analytics. The application allows users to access their entire music collection with smart shuffling that prioritizes least-played songs, ensuring you rediscover forgotten tracks in your playlists.

## Features

- **Google Authentication**: Secure sign-in with Google OAuth
- **Playlist Management**: View and manage all your YouTube Music playlists in one place
- **Smart Shuffle**: Intelligent shuffling algorithm that prioritizes least-played songs
- **Play History Tracking**: Track and analyze your listening habits
- **Responsive Design**: Seamless experience across desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Google Cloud Platform account with YouTube Data API enabled

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/synkd.git
   cd synkd
   ```

2. **Install dependencies for both client and server:**

   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the server directory:

   ```plaintext
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # MongoDB Connection
   MONGO_URI=mongodb://localhost:27017/synkd

   # JWT Secret
   JWT_SECRET=your_jwt_secret_key_here

   # Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id_here
   GOOGLE_CLIENT_SECRET=your_google_client_secret_here
   GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback

   # YouTube API
   YOUTUBE_API_KEY=your_youtube_api_key_here
   ```

   Create a `.env` file in the client directory:

   ```plaintext
   VITE_API_URL=http://localhost:5000/api
   VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
   ```

4. **Run the application:**

   ```bash
   # Start the server (from server directory)
   npm run dev

   # Start the client (from client directory)
   npm run dev
   ```

   The client application will be available at `http://localhost:3000` and the server at `http://localhost:5000`.

## Project Structure

```
server/
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   ├── playlistController.js
│   └── historyController.js
├── middleware/
│   ├── auth.js
│   └── errorHandler.js
├── models/
│   ├── User.js
│   ├── Playlist.js
│   └── PlayHistory.js
├── routes/
│   ├── auth.js
│   ├── playlists.js
│   └── history.js
├── services/
│   └── youtubeService.js
├── utils/
│   └── ytMusicHelper.js
├── .env
├── package.json
└── server.js

client/
├── public/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   └── GoogleSignInButton.jsx
│   │   └── ...
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── SnackbarContext.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   └── ...
│   ├── services/
│   │   ├── api/
│   │   │   └── googleApi.js
│   │   └── auth/
│   │       └── sessionManager.js
│   ├── App.jsx
│   └── main.jsx
├── .env
└── package.json
```

## Authentication Flow

SynkD uses Google OAuth 2.0 for authentication. The frontend implements the OAuth flow using the `@react-oauth/google` library, which securely handles the authentication process and provides access tokens for interacting with Google APIs.

## Technologies Used

### Frontend

- React.js
- Material-UI
- @react-oauth/google for authentication
- Vite for build tooling

### Backend

- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Google APIs for YouTube integration