import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { getUserPlaylists } from "../../api";
import PlaylistCard from "./PlaylistCard";
import { useSnackbar } from "../../context/SnackbarContext";
import { useNavigate } from "react-router-dom";

const Playlists = () => {
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("recent");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await getUserPlaylists();
        setPlaylists(response.playlists);
      } catch (error) {
        console.error("Error fetching playlists:", error);
        if (error.response && error.response.status === 401) {
          showSnackbar("Please login again", "error");
          navigate("/login"); // Redirect to login page if unauthorized
        } else {
          showSnackbar("Failed to load playlists", "error");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylists();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 3, mb: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Your Playlists
      </Typography>

      <Box sx={{ display: "flex", mb: 2 }}>
        <TextField
          variant="outlined"
          placeholder="Search playlists"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ flex: 1 }}
        />

        <FormControl variant="outlined" sx={{ ml: 2, minWidth: 120 }}>
          <InputLabel id="sort-select-label">Sort by</InputLabel>
          <Select
            labelId="sort-select-label"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            label="Sort by"
          >
            <MenuItem value="recent">Recently Played</MenuItem>
            <MenuItem value="date">Date Created</MenuItem>
            <MenuItem value="name">Name</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {playlists?.length > 0 ? (
          playlists?.map((playlist) => (
            <Grid item xs={12} sm={6} md={4} key={playlist?.youtubePlaylistId}>
              <PlaylistCard playlist={playlist} />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="h6" align="center">
              No playlists found
            </Typography>
            <Typography variant="body1" align="center">
              Create your first playlist to get started
            </Typography>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Playlists;
