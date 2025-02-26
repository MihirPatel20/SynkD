// src/components/playlists/PlaylistManager.jsx
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
  Fab,
  Zoom,
  ButtonGroup,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import MergeIcon from "@mui/icons-material/MergeType";
import ShareIcon from "@mui/icons-material/Share";
import { getUserPlaylists } from "../../services/api/youtubeDataApi";
import PlaylistCard from "./PlaylistCard";
import { useSnackbar } from "../../context/SnackbarContext";

const PlaylistManager = () => {
  const { showSnackbar } = useSnackbar();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("recent");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPlaylists, setFilteredPlaylists] = useState([]);
  const [selectedPlaylists, setSelectedPlaylists] = useState(new Set());
  const [selectionMode, setSelectionMode] = useState(false);

  // Fetch playlists (same as in Playlists.jsx)
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        const userPlaylists = await getUserPlaylists(accessToken);
        setPlaylists(userPlaylists);
        setFilteredPlaylists(userPlaylists);
      } catch (error) {
        console.error("Error fetching playlists:", error);
        showSnackbar("Failed to load playlists", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylists();
  }, []);

  // Filter and sort playlists (same as in Playlists.jsx)
  useEffect(() => {
    const filtered = playlists.filter(
      (playlist) =>
        playlist.snippet.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        playlist.snippet.description
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())
    );
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.snippet.title.localeCompare(b.snippet.title);
        case "date":
          return (
            new Date(b.snippet.publishedAt) - new Date(a.snippet.publishedAt)
          );
        case "recent":
          return (
            new Date(b.snippet.publishedAt) - new Date(a.snippet.publishedAt)
          );
        default:
          return 0;
      }
    });
    setFilteredPlaylists(sorted);
  }, [searchQuery, sortBy, playlists]);

  // Toggle selection for a playlist
  const handleToggleSelect = (playlistId) => {
    const newSelected = new Set(selectedPlaylists);
    if (newSelected.has(playlistId)) {
      newSelected.delete(playlistId);
    } else {
      newSelected.add(playlistId);
    }
    setSelectedPlaylists(newSelected);
    
    // If we have selections, enter selection mode
    if (newSelected.size > 0 && !selectionMode) {
      setSelectionMode(true);
    } else if (newSelected.size === 0 && selectionMode) {
      setSelectionMode(false);
    }
  };

  // Batch operations
  const handleDeleteSelected = () => {
    // Implementation for deleting selected playlists
    showSnackbar(`Deleting ${selectedPlaylists.size} playlists`, "info");
    // In a real implementation, you would call your API here
    console.log("Deleting playlists:", Array.from(selectedPlaylists));
  };

  const handleMergeSelected = () => {
    // Implementation for merging selected playlists
    showSnackbar(`Merging ${selectedPlaylists.size} playlists`, "info");
    // In a real implementation, you would call your API here
    console.log("Merging playlists:", Array.from(selectedPlaylists));
  };

  const handleShareSelected = () => {
    // Implementation for sharing selected playlists
    showSnackbar(`Sharing ${selectedPlaylists.size} playlists`, "info");
    // In a real implementation, you would call your API here
    console.log("Sharing playlists:", Array.from(selectedPlaylists));
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Your Playlists
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <TextField
            placeholder="Search playlists..."
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1, mr: 2 }}
          />
          <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Sort by</InputLabel>
            <Select
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
      </Box>

      {filteredPlaylists.length > 0 ? (
        <Grid container spacing={3}>
          {filteredPlaylists.map((playlist) => (
            <Grid item xs={12} sm={6} md={4} key={playlist.id}>
              <PlaylistCard 
                playlist={playlist} 
                selectable={true}
                selected={selectedPlaylists.has(playlist.id)}
                onToggleSelect={() => handleToggleSelect(playlist.id)}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            bgcolor: "background.paper",
            borderRadius: 2,
          }}
        >
          <Typography variant="h6">No playlists found</Typography>
          <Typography variant="body2" color="text.secondary">
            {searchQuery
              ? "Try adjusting your search"
              : "Create your first playlist to get started"}
          </Typography>
        </Box>
      )}

      {/* Floating Action Bar */}
      <Zoom in={selectionMode}>
        <Box
          sx={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 3,
            p: 1,
          }}
        >
          <Typography variant="body2" sx={{ mb: 1, textAlign: "center" }}>
            {selectedPlaylists.size} playlists selected
          </Typography>
          <ButtonGroup variant="contained" aria-label="playlist actions">
            <Button 
              startIcon={<DeleteIcon />}
              onClick={handleDeleteSelected}
              color="error"
            >
              Delete
            </Button>
            <Button 
              startIcon={<MergeIcon />}
              onClick={handleMergeSelected}
              color="primary"
            >
              Merge
            </Button>
            <Button 
              startIcon={<ShareIcon />}
              onClick={handleShareSelected}
              color="secondary"
            >
              Share
            </Button>
          </ButtonGroup>
        </Box>
      </Zoom>
    </Container>
  );
};

export default PlaylistManager;
