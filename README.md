# SynkD

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Google Cloud Platform account with YouTube Data API enabled

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/MihirPatel20/SynkD.git
   cd SynkD
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
   npm start

   # Start the client (from client directory)
   npm start
   ```

   The client application will be available at `http://localhost:3000` and the server at `http://localhost:5000`.

## Project Structure

```
root/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── .env
│   └── package.json
└── README.md
```

## Problem Statement

YouTube Music's shuffle algorithm tends to favor songs at the top of playlists, resulting in a limited rotation of tracks even in large collections. Users with extensive playlists (e.g., 600+ songs) experience repetitive playback of approximately 30-50 songs, creating a frustrating listening experience that fails to utilize their full music library. This platform aims to create an unbiased shuffle mechanism that prioritizes least-heard songs, ensuring users experience their entire music collection and discover forgotten tracks in their own playlists.

## Core Functionality Requirements

### User Authentication & Integration

- Implement OAuth 2.0 authentication with YouTube/Google accounts
- Request appropriate scopes for accessing user's YouTube Music data
- Store refresh tokens securely for maintaining persistent access
- Implement token refresh mechanism to maintain uninterrupted service

### Playlist Management

- Retrieve and display all user playlists from YouTube Music
- Support playlist filtering and searching capabilities
- Enable playlist metadata viewing (creation date, song count, total duration)
- Implement playlist statistics visualization (most/least played songs, genres, artists)

### Play History Tracking

- Develop a system to track and store user's listening history
- Create a database schema to efficiently store song play counts and timestamps
- Implement algorithms to calculate "freshness" scores for each track
- Design a mechanism to synchronize with YouTube Music's native history API

### Smart Shuffle Algorithm

- Develop a weighted randomization algorithm favoring least-played songs
- Implement configurable "freshness" parameters (e.g., avoiding repeats within 4-hour windows)
- Create a bias correction mechanism to counteract YouTube Music's native tendencies
- Support user-defined shuffle rules and preferences

### User Interface

- Design a clean, intuitive dashboard for playlist management
- Create visualizations for play history and song rotation statistics
- Implement responsive design for mobile and desktop usage
- Provide user preference settings for algorithm customization

## Technical Architecture

### Frontend

- **Framework**: React.js with TypeScript for type safety
- **State Management**: Redux or Context API for application state
- **UI Components**: Material-UI or Tailwind CSS for consistent styling
- **Data Visualization**: D3.js or Chart.js for analytics displays

### Backend

- **Server**: Node.js with Express.js framework
- **API Design**: RESTful API architecture with proper documentation
- **Authentication**: JWT-based auth flow with secure token management
- **Database**: MongoDB for flexible schema or PostgreSQL for relational data

### Integration Points

- YouTube Data API v3 for playlist access and management
- YouTube Music unofficial APIs (research required) for extended functionality
- Google OAuth 2.0 for authentication and authorization

### Deployment & Infrastructure

- Containerized application using Docker
- CI/CD pipeline using GitHub Actions or similar
- Cloud hosting on AWS, Google Cloud, or Heroku
- HTTPS encryption for all data transmission

## Implementation Challenges & Research Areas

### YouTube Music API Limitations

- YouTube Music lacks a comprehensive official API
- Research needed into unofficial APIs or web scraping alternatives
- Potential rate limiting and terms of service considerations

### History Data Acquisition

- Determining if YouTube Music history is accessible via API
- Alternatives for tracking play history if API access is limited
- Synchronization strategies between platform and YouTube Music

### Algorithm Development

- Testing and refining shuffle algorithms for perceived randomness
- Balancing least-played prioritization with user enjoyment
- Handling edge cases (new songs, playlist changes)

## Development Roadmap

### Phase 1: Research & Proof of Concept

- Investigate YouTube Music API capabilities and limitations
- Develop authentication flow prototype
- Create simple playlist retrieval functionality
- Test basic shuffle algorithm concepts

### Phase 2: Core Platform Development

- Implement complete authentication system
- Develop playlist management interface
- Create database schema and history tracking
- Build basic shuffle algorithm

### Phase 3: Advanced Features & Refinement

- Implement analytics and visualization components
- Refine shuffle algorithm based on user testing
- Add customization options for user preferences
- Optimize performance and responsiveness

### Phase 4: Testing & Deployment

- Conduct comprehensive testing across devices
- Implement security best practices
- Deploy beta version for limited user testing
- Gather feedback for improvements

## Success Metrics

- User retention and engagement statistics
- Playlist diversity measurements (unique songs played over time)
- User satisfaction surveys and feedback
- Technical performance metrics (load times, API reliability)
