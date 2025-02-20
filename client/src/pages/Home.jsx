import React, { useState, useEffect } from "react";
import { Container, Typography, Box } from "@mui/material";
import VideoGrid from "../components/video/VideoGrid";
import { fetchVideos } from "../services/api/youtube";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const results = await fetchVideos("music"); // Fetch recommended music videos
        setVideos(results);
      } catch (error) {
        console.error("Error fetching recommended videos:", error);
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, []);

  return (
    <Container maxWidth="xl">
      <Box sx={{ textAlign: "center" }}>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          <VideoGrid videos={videos} />
        )}
      </Box>
    </Container>
  );
};

export default Home;
