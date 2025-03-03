import React, { useState } from "react";
import {
  Typography,
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  CardMedia,
  CardContent,
  useTheme,
} from "@mui/material";
import {
  PlayArrow as PlayArrowIcon,
  Share as ShareIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { format, formatDistanceToNow } from "date-fns";

// Playlist Header Component
const PlaylistHeader = ({ playlist, onPlayAll, onShare }) => {
  const theme = useTheme();
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <Box sx={{ display: "flex", mb: 4 }}>
      <CardMedia
        component="img"
        sx={{
          maxWidth: 300,
          maxHeight: 200,
          borderRadius: 2,
          alignSelf: "center",
        }}
        image={playlist?.thumbnail || "https://via.placeholder.com/200"}
        alt={playlist?.title}
      />
      <CardContent sx={{ flex: "1 0 auto", pl: 3 }}>
        <Typography variant="overline" color="text.secondary">
          PLAYLIST
        </Typography>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          {playlist?.title || "Playlist Name"}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {playlist?.description || "No description available"}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {playlist?.itemCount || 0} songs • Created on{" "}
          {format(new Date(playlist?.publishedAt || 0), "PP")}
        </Typography>
        <Box sx={{ display: "flex", mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PlayArrowIcon />}
            onClick={onPlayAll}
            sx={{
              borderRadius: 28,
              px: 3,
              py: 1,
              textTransform: "none",
              fontWeight: "bold",
            }}
          >
            Play All
          </Button>
          <IconButton
            onClick={() => setIsFavorite(!isFavorite)}
            sx={{
              color: isFavorite ? "error.main" : "inherit",
              border: `1px solid ${theme.palette.divider}`,
              ml: 2,
            }}
          >
            {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
          <IconButton
            onClick={onShare}
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              ml: 1,
            }}
          >
            <ShareIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Box>
  );
};
// Search and Filter Component
export const SearchAndFilter = ({ searchQuery, onSearchChange }) => {
  return (
    <Box sx={{ mb: 3 }}>
      <TextField
        fullWidth
        placeholder="Search in playlist"
        value={searchQuery}
        onChange={(e) => onSearchChange(e)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          sx: {
            borderRadius: 28,
            bgcolor: "background.paper",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "divider",
            },
          },
        }}
        variant="outlined"
      />
    </Box>
  );
};

export default PlaylistHeader;
