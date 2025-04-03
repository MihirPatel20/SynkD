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
  Skeleton, // Import Skeleton
} from "@mui/material";
import {
  PlayArrow as PlayArrowIcon,
  Share as ShareIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

// Playlist Header Component
const PlaylistHeader = ({ isLoading, playlist, onPlayAll, onShare }) => {
  const theme = useTheme();
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <Box sx={{ display: "flex", mb: 4 }}>
      {isLoading ? (
        <Skeleton
          variant="rectangular"
          width={192}
          height={192}
          sx={{ borderRadius: 2 }}
        />
      ) : (
        <CardMedia
          component="img"
          sx={{
            maxWidth: 192,
            maxHeight: 192,
            borderRadius: 2,
            alignSelf: "center",
          }}
          image={
            playlist?.thumbnails?.find(
              (thumb) => thumb.height > 150
            )?.url || "https://via.placeholder.com/200"
          }
          alt={playlist?.title}
        />
      )}
      <CardContent sx={{ flex: "1 0 auto", pl: 3 }}>
        {isLoading ? (
          <>
            <Skeleton variant="text" height={40} width="60%" sx={{ mb: 1 }} />
            <Skeleton variant="text" height={20} width="80%" sx={{ mb: 1 }} />
            <Skeleton variant="text" height={20} width="50%" sx={{ mb: 1 }} />
            <Skeleton variant="text" height={20} width="50%" sx={{ mb: 1 }} />
          </>
        ) : (
          <>
            <Typography
              variant="h4"
              component="h1"
              fontWeight="bold"
              gutterBottom
            >
              {playlist?.title || "Playlist Name"}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {playlist?.description || "No description available"}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Playlist • {playlist?.privacy} • {playlist?.year}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {playlist?.trackCount || 0} songs • {playlist?.duration}
            </Typography>
          </>
        )}
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
