import React, { useState, useEffect } from "react";
import { Container, Typography, Box, CircularProgress } from "@mui/material";

import VideoGrid from "../../components/video/VideoGrid";
import sessionManager from "../../services/auth/sessionManager";
import { useAuth } from "../../context/AuthContext";
import { getHomeRecommendations } from "../../services/recommendations/recommendationsService";
import { getHomeFeedVideos } from "../../api/historyApi";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        setLoading(true);
        const response = await getHomeFeedVideos();
        console.log("Home feed response:", response);
        setVideos(response.videos);
      } catch (error) {
        console.error("Error fetching playlists:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylists();
  }, []);

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
