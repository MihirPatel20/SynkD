```
src/
├── assets/                      # Static assets like images, icons, fonts
│   ├── icons/
│   └── images/
├── components/
│   ├── auth/                    # Authentication components
│   │   ├── GoogleSignInButton.jsx
│   │   ├── LogoutButton.jsx
│   │   └── ProtectedRoute.jsx
│   ├── common/                  # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Loader.jsx
│   │   └── Modal.jsx
│   ├── layout/                  # Layout components
│   │   ├── Footer.jsx
│   │   ├── MainLayout.jsx
│   │   ├── Navbar.jsx
│   │   └── Sidebar.jsx
│   ├── playlists/               # Playlist-related components
│   │   ├── CreatePlaylistForm.jsx
│   │   ├── PlaylistCard.jsx
│   │   ├── PlaylistGrid.jsx
│   │   └── PlaylistStats.jsx
│   ├── recommendations/         # Recommendation-related components
│   │   ├── RecommendationCard.jsx
│   │   └── RecommendationList.jsx
│   └── video/                   # Video-related components
│       ├── MusicPlayer.jsx
│       ├── VideoCard.jsx
│       ├── VideoGrid.jsx
│       └── VideoList.jsx
├── context/                     # React context providers
│   ├── AuthContext.jsx
│   ├── PlayerContext.jsx
│   ├── PlaylistContext.jsx
│   └── SnackbarContext.jsx
├── features/                    # Feature-specific modules
│   ├── analytics/               # User listening analytics
│   │   ├── components/
│   │   ├── hooks/
│   │   └── utils/
│   ├── playlist-generation/     # AI/algorithm-based playlist generation
│   │   ├── components/
│   │   ├── hooks/
│   │   └── utils/
│   └── user-preferences/        # User preference management
│       ├── components/
│       ├── hooks/
│       └── utils/
├── hooks/                       # Custom React hooks
│   ├── useAuth.js
│   ├── usePlaylists.js
│   ├── useRecommendations.js
│   └── useYoutubeApi.js
├── pages/                       # Page components
│   ├── analytics/
│   │   └── ListeningStats.jsx
│   ├── auth/
│   │   ├── Callback.jsx
│   │   └── Login.jsx
│   ├── home/
│   │   └── Home.jsx
│   ├── playlists/
│   │   ├── CreatePlaylist.jsx
│   │   ├── PlaylistDetail.jsx
│   │   └── Playlists.jsx
│   ├── profile/
│   │   └── Profile.jsx
│   ├── search/
│   │   └── Search.jsx
│   └── watch/
│       └── Watch.jsx
├── services/                    # API and service integrations
│   ├── api/                     # API clients
│   │   ├── apiClient.js         # Base API client with interceptors
│   │   ├── googleApi.js
│   │   └── youtubeApi.js
│   ├── auth/                    # Authentication services
│   │   ├── authService.js
│   │   └── sessionManager.js
│   ├── analytics/               # Analytics services
│   │   └── listeningAnalytics.js
│   └── recommendations/         # Recommendation algorithms
│       └── recommendationEngine.js
├── store/                       # State management (if using Redux/Zustand)
│   ├── actions/
│   ├── reducers/
│   └── store.js
├── styles/                      # Global styles
│   ├── globalStyles.css
│   ├── theme.js
│   └── variables.css
├── utils/                       # Utility functions
│   ├── dateUtils.js
│   ├── formatters.js
│   ├── localStorage.js
│   └── validators.js
├── App.jsx
└── main.jsx
```

To generate folder structure
``` # Navigate to src directory
Set-Location src

# Create all directories

$directories = @(
"assets/icons",
"assets/images",
"components/auth",
"components/common",
"components/layout",
"components/playlists",
"components/recommendations",
"components/video",
"context",
"features/analytics/components",
"features/analytics/hooks",
"features/analytics/utils",
"features/playlist-generation/components",
"features/playlist-generation/hooks",
"features/playlist-generation/utils",
"features/user-preferences/components",
"features/user-preferences/hooks",
"features/user-preferences/utils",
"hooks",
"pages/analytics",
"pages/auth",
"pages/home",
"pages/playlists",
"pages/profile",
"pages/search",
"pages/watch",
"services/api",
"services/auth",
"services/analytics",
"services/recommendations",
"store/actions",
"store/reducers",
"styles",
"utils"
)

foreach ($dir in $directories) {
New-Item -Path $dir -ItemType Directory -Force
}

# Create all files

$files = @(
"components/auth/GoogleSignInButton.jsx",
"components/auth/LogoutButton.jsx",
"components/auth/ProtectedRoute.jsx",
"components/common/Button.jsx",
"components/common/Card.jsx",
"components/common/Loader.jsx",
"components/common/Modal.jsx",
"components/layout/Footer.jsx",
"components/layout/MainLayout.jsx",
"components/layout/Navbar.jsx",
"components/layout/Sidebar.jsx",
"components/playlists/CreatePlaylistForm.jsx",
"components/playlists/PlaylistCard.jsx",
"components/playlists/PlaylistGrid.jsx",
"components/playlists/PlaylistStats.jsx",
"components/recommendations/RecommendationCard.jsx",
"components/recommendations/RecommendationList.jsx",
"components/video/MusicPlayer.jsx",
"components/video/VideoCard.jsx",
"components/video/VideoGrid.jsx",
"components/video/VideoList.jsx",
"context/AuthContext.jsx",
"context/PlayerContext.jsx",
"context/PlaylistContext.jsx",
"context/SnackbarContext.jsx",
"hooks/useAuth.js",
"hooks/usePlaylists.js",
"hooks/useRecommendations.js",
"hooks/useYoutubeApi.js",
"pages/analytics/ListeningStats.jsx",
"pages/auth/Callback.jsx",
"pages/auth/Login.jsx",
"pages/home/Home.jsx",
"pages/playlists/CreatePlaylist.jsx",
"pages/playlists/PlaylistDetail.jsx",
"pages/playlists/Playlists.jsx",
"pages/profile/Profile.jsx",
"pages/search/Search.jsx",
"pages/watch/Watch.jsx",
"services/api/apiClient.js",
"services/api/googleApi.js",
"services/api/youtubeApi.js",
"services/auth/authService.js",
"services/auth/sessionManager.js",
"services/analytics/listeningAnalytics.js",
"services/recommendations/recommendationEngine.js",
"store/store.js",
"styles/globalStyles.css",
"styles/theme.js",
"styles/variables.css",
"utils/dateUtils.js",
"utils/formatters.js",
"utils/localStorage.js",
"utils/validators.js",
"App.jsx",
"main.jsx"
)

foreach ($file in $files) {
New-Item -Path $file -ItemType File -Force
}

Write-Host "Folder structure created successfully!" -ForegroundColor Green
```
