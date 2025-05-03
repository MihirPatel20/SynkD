import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  useTheme,
  Skeleton,
} from "@mui/material";
import { getUserPlaylists } from "../../api/playlistApi";
import { useNavigate } from "react-router-dom";

const Library = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        setLoading(true);
        const response = await getUserPlaylists();
        setPlaylists(response.playlists);
      } catch (error) {
        console.error("Error fetching playlists:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylists();
  }, []);

  const PlaylistCard = ({ playlist }) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
      navigate(`/playlist/${playlist.playlistId}`);
    };

    return (
      <Card
        variant="outlined"
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          transition: "transform 0.2s",
          "&:hover": {
            transform: "scale(1.05)",
            boxShadow: theme.shadows[4],
            cursor: "pointer",
          },
        }}
        onClick={handleCardClick}
      >
        <CardMedia
          component="img"
          height="200"
          image={playlist.thumbnails[1].url}
          alt={playlist.title}
          sx={{ objectFit: "cover" }}
        />
        <CardContent
          sx={{ flexGrow: 1, bgcolor: theme.palette.background.paper }}
        >
          <Typography gutterBottom variant="h6" component="div" noWrap>
            {playlist.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {playlist.description}
          </Typography>
        </CardContent>
      </Card>
    );
  };

  const SkeletonCard = () => (
    <Card
      variant="outlined"
      sx={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <Skeleton variant="rectangular" height={200} animation="wave" />
      <CardContent sx={{ flexGrow: 1 }}>
        <Skeleton animation="wave" height={32} width="80%" sx={{ mb: 1 }} />
        <Skeleton animation="wave" height={18} width="60%" />
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 1, mb: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        mb={4}
        sx={{ fontWeight: "bold", color: theme.palette.primary.main }}
      >
        Your Library
      </Typography>
      <Grid container spacing={3}>
        {loading
          ? Array.from(new Array(8)).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <SkeletonCard />
              </Grid>
            ))
          : playlists.map((playlist) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={playlist.playlistId}>
                <PlaylistCard playlist={playlist} />
              </Grid>
            ))}
      </Grid>
    </Container>
  );
};

export default Library;
