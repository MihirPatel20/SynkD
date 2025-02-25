// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import createYoutubeApiInstance from "../services/youtube/youtubeApi";

const Profile = () => {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const tokens = JSON.parse(localStorage.getItem("yt_tokens"));
        const youtubeApi = createYoutubeApiInstance(tokens.access_token);
        const userPlaylists = await youtubeApi.getUserPlaylists();
        setPlaylists(userPlaylists);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Welcome, {user.name}
      </Typography>

      <Typography variant="h6" gutterBottom mt={4}>
        Your Playlists
      </Typography>

      {playlists.map((playlist) => (
        <Box key={playlist.id} mb={2}>
          <Typography variant="subtitle1">{playlist.snippet.title}</Typography>
          <Typography variant="body2" color="text.secondary">
            {playlist.snippet.description}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default Profile;
