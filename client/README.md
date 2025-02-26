# SynkD - Music Streaming App

SynkD is a modern music streaming application built with React and Vite. It leverages the YouTube Data API to provide users with a seamless experience for discovering and playing music videos. The app includes features such as user authentication, personalized recommendations, and playlist management.

## Getting Started

To get started with SynkD, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/synkd.git
   cd synkd
   ```

2. **Install dependencies:**

   Ensure you have Node.js and npm installed. Then, run:

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the `client` directory and add the following variables:

   ```plaintext
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   VITE_GOOGLE_CLIENT_SECRET=your_google_client_secret
   VITE_YOUTUBE_API_KEY=your_youtube_api_key
   VITE_YOUTUBE_CLIENT_ID=your_youtube_client_id
   VITE_YOUTUBE_CLIENT_SECRET=your_youtube_client_secret
   VITE_YOUTUBE_REDIRECT_URI=your_redirect_uri
   ```

4. **Run the development server:**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`.

## Folder Structure

Here's an overview of the project's folder structure:

```
client/
│
├── public/                     # Public assets
│   └── index.html              # Main HTML file
│
├── src/                        # Source files
│   ├── components/             # React components
│   ├── context/                # Context providers
│   ├── pages/                  # Page components
│   ├── services/               # API and authentication services
│   │
│   ├── App.jsx                 # Main app component
│   ├── main.jsx                # Entry point
│   └── theme.js                # Custom theme configuration
│
├── .gitignore                  # Git ignore file
├── package.json                # Project metadata and dependencies
└── vite.config.js              # Vite configuration
```

## Project Overview

SynkD is designed to provide users with a rich music streaming experience. Key features include:

- **User Authentication:** Secure login using Google OAuth.
- **Music Discovery:** Search and play music videos from YouTube.
- **Personalized Recommendations:** Get video recommendations based on user activity and preferences.
- **Playlist Management:** Create and manage playlists of favorite music videos.
- **Responsive Design:** Optimized for both desktop and mobile devices.

## Future Enhancements

Here are some ideas for future improvements:


- **Playlist Manager:**
  - Allow users to view all their playlists in one place.
  - Enable users to select multiple playlists and perform actions on them.
  - Access analytics for the selected playlists, allowing users to sort songs from least played to most played. This feature will help users discover new songs within their playlists and avoid repetitive listening.
  - Research and implement a way to access the user's YouTube Music history to prevent playing the same songs again within a 4-hour window. This could enhance the listening experience by ensuring variety in song selection.
- **Social Features:** Enable users to share playlists and follow other users.
- **Integration with Other Services:** Connect with other music services for a more comprehensive library.
- **Enhanced Recommendations:** Use machine learning to improve recommendation accuracy.
- **Offline Mode:** Allow users to download and play music offline.
