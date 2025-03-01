import React, { useState, useEffect } from "react";
import { Container, Typography, Box, CircularProgress } from "@mui/material";

import VideoGrid from "../../components/video/VideoGrid";
import sessionManager from "../../services/auth/sessionManager";
import { useAuth } from "../../context/AuthContext";
import { getHomeRecommendations } from "../../services/recommendations/recommendationsService";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Initialize session management
    sessionManager.initialize();
    sessionManager.logActivity("Accessed homepage");

    // Create a new AbortController for this request
    const controller = new AbortController();

    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const data = await getHomeRecommendations(controller.signal);
        setVideos(data);
        setError(null);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("Failed to load recommendations");
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };  

    if (isAuthenticated) {
      fetchRecommendations();
      // Refresh recommendations every 5 minutes
      const refreshInterval = setInterval(fetchRecommendations, 5 * 60 * 1000);
      return () => clearInterval(refreshInterval);
    } else {
      // Load non-personalized recommendations for non-authenticated users
      recommendationsService
        .getPopularMusicVideos()
        .then(setVideos)
        .catch((err) => setError("Failed to load popular videos"))
        .finally(() => setLoading(false));
    }

    // Cleanup function to abort the request when component unmounts
    return () => {
      controller.abort();
    };
  }, [isAuthenticated]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl">
        <Box textAlign="center" mt={4}>
          <Typography color="error" gutterBottom>
            {error}
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ textAlign: "center", flexGrow: 1 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          Recommended for You
        </Typography>
        <VideoGrid videos={videos} />
      </Box>
    </Container>
  );
};

export default Home;
