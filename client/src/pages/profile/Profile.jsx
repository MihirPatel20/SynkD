// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Avatar,
  Paper,
  Grid,
  Divider,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import EmailIcon from "@mui/icons-material/Email";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PlaylistPlayIcon from "@mui/icons-material/PlaylistPlay";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";

import { useAuth } from "../../context/AuthContext";
import { getUserPlaylists } from "../../services/api/youtubeDataApi";

// Styled components for enhanced aesthetics
const ProfileHeader = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  background: `linear-gradient(120deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
  color: theme.palette.primary.contrastText,
  position: "relative",
  overflow: "hidden",
}));

const LargeAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  border: `4px solid ${theme.palette.background.paper}`,
  boxShadow: theme.shadows[3],
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  fontWeight: 600,
  textTransform: "none",
  minHeight: 48,
}));

const PlaylistCard = styled(Card)(({ theme }) => ({
  display: "flex",
  marginBottom: theme.spacing(2),
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[4],
  },
}));

const Profile = () => {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        const userPlaylists = await getUserPlaylists(accessToken, 50);
        setPlaylists(userPlaylists);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <ProfileHeader elevation={3}>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <LargeAvatar src={user.picture} alt={user.name} />
          </Grid>
          <Grid item xs>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {user.name}
            </Typography>
            <Box display="flex" alignItems="center" mb={1}>
              <EmailIcon fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="body1">{user.email}</Typography>
            </Box>
            <Box display="flex" gap={1} mt={2}>
              <Chip
                icon={<PlaylistPlayIcon />}
                label={`${playlists.length} Playlists`}
                color="secondary"
                variant="outlined"
              />
              {user.locale && (
                <Chip label={`Locale: ${user.locale}`} variant="outlined" />
              )}
            </Box>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              sx={{ borderRadius: 28 }}
            >
              Edit Profile
            </Button>
          </Grid>
        </Grid>
      </ProfileHeader>

      <Paper elevation={2} sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          aria-label="profile tabs"
        >
          <StyledTab
            icon={<AccountCircleIcon />}
            iconPosition="start"
            label="Overview"
          />
          <StyledTab
            icon={<PlaylistPlayIcon />}
            iconPosition="start"
            label="Playlists"
          />
          <StyledTab
            icon={<VideoLibraryIcon />}
            iconPosition="start"
            label="Saved Videos"
          />
        </Tabs>

        <Divider />

        <Box p={3}>
          {tabValue === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Paper elevation={1} sx={{ p: 3, height: "100%" }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Account Information
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Box my={2}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Full Name
                    </Typography>
                    <Typography variant="body1">{user.name}</Typography>
                  </Box>
                  <Box my={2}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1">{user.email}</Typography>
                  </Box>
                  {user.given_name && (
                    <Box my={2}>
                      <Typography variant="subtitle2" color="text.secondary">
                        First Name
                      </Typography>
                      <Typography variant="body1">{user.given_name}</Typography>
                    </Box>
                  )}
                  {user.family_name && (
                    <Box my={2}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Last Name
                      </Typography>
                      <Typography variant="body1">
                        {user.family_name}
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </Grid>
              <Grid item xs={12} md={8}>
                <Paper elevation={1} sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Recent Activity
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  {playlists.slice(0, 3).map((playlist) => (
                    <Box
                      key={playlist.id}
                      mb={2}
                      display="flex"
                      alignItems="center"
                    >
                      <Avatar sx={{ mr: 2, bgcolor: "primary.main" }}>
                        <PlaylistPlayIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1">
                          {playlist.snippet.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(
                            playlist.snippet.publishedAt
                          ).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                  {playlists.length === 0 && (
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      align="center"
                      py={4}
                    >
                      No recent activity found
                    </Typography>
                  )}
                </Paper>
              </Grid>
            </Grid>
          )}

          {tabValue === 1 && (
            <Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Your Playlists ({playlists.length})
              </Typography>
              <Divider sx={{ my: 2 }} />

              {playlists.length > 0 ? (
                playlists.map((playlist) => (
                  <PlaylistCard key={playlist.id}>
                    <CardMedia
                      component="img"
                      sx={{ width: 140 }}
                      image={
                        playlist.snippet.thumbnails?.medium?.url ||
                        "https://via.placeholder.com/140x80?text=No+Thumbnail"
                      }
                      alt={playlist.snippet.title}
                    />
                    <CardContent sx={{ flex: "1 0 auto" }}>
                      <Typography variant="h6" component="div">
                        {playlist.snippet.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {playlist.snippet.description ||
                          "No description available"}
                      </Typography>
                      <Box mt={1}>
                        <Chip
                          size="small"
                          label={`Created: ${new Date(
                            playlist.snippet.publishedAt
                          ).toLocaleDateString()}`}
                          variant="outlined"
                          sx={{ mr: 1 }}
                        />
                      </Box>
                    </CardContent>
                  </PlaylistCard>
                ))
              ) : (
                <Box py={4} textAlign="center">
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    gutterBottom
                  >
                    You don't have any playlists yet
                  </Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<PlaylistPlayIcon />}
                    sx={{ mt: 2 }}
                  >
                    Create Your First Playlist
                  </Button>
                </Box>
              )}
            </Box>
          )}

          {tabValue === 2 && (
            <Box py={4} textAlign="center">
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Saved Videos Coming Soon
              </Typography>
              <Typography variant="body1" color="text.secondary">
                This feature is currently under development
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile;
