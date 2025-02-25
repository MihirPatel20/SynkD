import React, { useState, useEffect } from "react";
import { Container, Typography, Box, CircularProgress } from "@mui/material";
import { NewVideoGrid } from "../components/video/VideoGrid";
import recommendationsService from "../services/youtube/recommendationsService";
import sessionManager from "../services/auth/sessionManager";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Initialize session management
    sessionManager.initialize();
    sessionManager.logActivity("Accessed homepage");

    const loadRecommendations = async () => {
      try {
        setLoading(true);
        const recommendations =
          await recommendationsService.getHomeRecommendations();
        setVideos(recommendations);
        setError(null);
      } catch (error) {
        console.error("Error loading recommendations:", error);
        setError("Failed to load recommendations. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      loadRecommendations();
      // Refresh recommendations every 5 minutes
      const refreshInterval = setInterval(loadRecommendations, 5 * 60 * 1000);
      return () => clearInterval(refreshInterval);
    } else {
      // Load non-personalized recommendations for non-authenticated users
      recommendationsService
        .getPopularMusicVideos()
        .then(setVideos)
        .catch((err) => setError("Failed to load popular videos"))
        .finally(() => setLoading(false));
    }
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
        <NewVideoGrid videos={videos} />
      </Box>
    </Container>
  );
};

export default Home;
