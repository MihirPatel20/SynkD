import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  TextField,
  InputAdornment,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Paper,
  CircularProgress,
  Button,
  Divider,
  Card,
  CardMedia,
  CardContent,
  Slider,
  Grid,
  useTheme,
  alpha,
  Tooltip,
} from "@mui/material";
import {
  Search as SearchIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  DragIndicator as DragIndicatorIcon,
  SkipPrevious as SkipPreviousIcon,
  SkipNext as SkipNextIcon,
  Shuffle as ShuffleIcon,
  Repeat as RepeatIcon,
  VolumeUp as VolumeUpIcon,
  Share as ShareIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  PlaylistAdd as PlaylistAddIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { formatDistanceToNow, formatDuration } from "date-fns";
import { getPlaylistDetails } from "../services/youtube/youtubeApi";

// Player Controls Component
const PlayerControls = ({
  currentTrack,
  onPlayPause,
  isPlaying,
  onNext,
  onPrevious,
}) => {
  const theme = useTheme();
  const [volume, setVolume] = useState(70);
  const [position, setPosition] = useState(30);
  const duration = 180; // Example duration in seconds

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <Card
      elevation={3}
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        borderRadius: "16px 16px 0 0",
        bgcolor:
          theme.palette.mode === "dark"
            ? alpha(theme.palette.background.paper, 0.95)
            : alpha(theme.palette.background.paper, 0.95),
        backdropFilter: "blur(10px)",
      }}
    >
      <Box sx={{ p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          {/* Track Info */}
          <Grid item xs={12} sm={3}>
            {currentTrack && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <CardMedia
                  component="img"
                  sx={{ width: 60, height: 60, borderRadius: 1, mr: 2 }}
                  image={currentTrack.thumbnail}
                  alt={currentTrack.title}
                />
                <Box>
                  <Typography
                    variant="subtitle1"
                    noWrap
                    sx={{ fontWeight: "bold" }}
                  >
                    {currentTrack.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {currentTrack.artist}
                  </Typography>
                </Box>
              </Box>
            )}
          </Grid>

          {/* Player Controls */}
          <Grid item xs={12} sm={6}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Tooltip title="Shuffle">
                  <IconButton size="small">
                    <ShuffleIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Previous">
                  <IconButton onClick={onPrevious}>
                    <SkipPreviousIcon />
                  </IconButton>
                </Tooltip>
                <IconButton
                  onClick={onPlayPause}
                  sx={{
                    mx: 1,
                    bgcolor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    "&:hover": {
                      bgcolor: theme.palette.primary.dark,
                    },
                    width: 48,
                    height: 48,
                  }}
                >
                  {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                </IconButton>
                <Tooltip title="Next">
                  <IconButton onClick={onNext}>
                    <SkipNextIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Repeat">
                  <IconButton size="small">
                    <RepeatIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box
                sx={{ display: "flex", alignItems: "center", width: "100%" }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mr: 1 }}
                >
                  {formatTime(position)}
                </Typography>
                <Slider
                  size="small"
                  value={position}
                  max={duration}
                  onChange={(_, value) => setPosition(value)}
                  sx={{ mx: 1 }}
                />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ ml: 1 }}
                >
                  {formatTime(duration)}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Volume Control */}
          <Grid item xs={12} sm={3}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <VolumeUpIcon sx={{ mr: 1 }} />
              <Slider
                size="small"
                value={volume}
                onChange={(_, value) => setVolume(value)}
                sx={{ width: 100 }}
              />
              <Tooltip title="More options">
                <IconButton sx={{ ml: 2 }}>
                  <MoreVertIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
};

// Playlist Header Component
const PlaylistHeader = ({ playlist, onPlayAll, onShare }) => {
  const theme = useTheme();
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <Box sx={{ mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
            <CardMedia
              component="img"
              height="300"
              image={
                playlist?.snippet?.thumbnails?.high?.url ||
                "https://via.placeholder.com/300"
              }
              alt={playlist?.snippet?.title}
              sx={{ objectFit: "cover" }}
            />
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Box
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography variant="overline" color="text.secondary">
                PLAYLIST
              </Typography>
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                {playlist?.snippet?.title || "Playlist Name"}
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                {playlist?.snippet?.description || "No description available"}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  {playlist?.contentDetails?.itemCount || 0} songs • Created{" "}
                  {formatDistanceToNow(
                    new Date(playlist?.snippet?.publishedAt || new Date()),
                    { addSuffix: true }
                  )}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
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
                }}
              >
                {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
              <IconButton
                onClick={onShare}
                sx={{
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <ShareIcon />
              </IconButton>
              <IconButton
                sx={{
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <PlaylistAddIcon />
              </IconButton>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

// Search and Filter Component
const SearchAndFilter = ({ searchQuery, onSearchChange }) => {
  return (
    <Box sx={{ mb: 3 }}>
      <TextField
        fullWidth
        placeholder="Search in playlist..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
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

// Track List Component
const TrackList = ({
  items,
  currentlyPlaying,
  onTogglePlay,
  onToggleSelect,
  selectedItems,
  onDragEnd,
}) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        mb: 10, // Space for player controls
      }}
    >
      <Box sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
        <Grid container sx={{ px: 2, py: 1 }}>
          <Grid item xs={1}>
            #
          </Grid>
          <Grid item xs={5}>
            TITLE
          </Grid>
          <Grid item xs={3}>
            ARTIST
          </Grid>
          <Grid item xs={2}>
            ADDED
          </Grid>
          <Grid item xs={1}>
            DURATION
          </Grid>
        </Grid>
      </Box>
      <Divider />

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="playlist-items">
          {(provided) => (
            <List
              {...provided.droppableProps}
              ref={provided.innerRef}
              sx={{ py: 0 }}
            >
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <React.Fragment>
                      <ListItem
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        sx={{
                          py: 1,
                          borderRadius: 1,
                          bgcolor: selectedItems.has(item.id)
                            ? alpha(theme.palette.primary.main, 0.1)
                            : currentlyPlaying === item.id
                            ? alpha(theme.palette.primary.main, 0.05)
                            : "transparent",
                          "&:hover": {
                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                          },
                        }}
                      >
                        <Grid container alignItems="center">
                          <Grid
                            item
                            xs={1}
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <Box
                              {...provided.dragHandleProps}
                              sx={{ mr: 1, color: "text.secondary" }}
                            >
                              <DragIndicatorIcon fontSize="small" />
                            </Box>
                            {currentlyPlaying === item.id ? (
                              <Typography
                                variant="body2"
                                color="primary"
                                fontWeight="bold"
                              >
                                {index + 1}
                              </Typography>
                            ) : (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {index + 1}
                              </Typography>
                            )}
                          </Grid>

                          <Grid
                            item
                            xs={5}
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <ListItemAvatar>
                              <Box sx={{ position: "relative" }}>
                                <Avatar
                                  variant="rounded"
                                  src={item.thumbnail}
                                  sx={{ width: 40, height: 40 }}
                                >
                                  {item.title[0]}
                                </Avatar>
                                <Box
                                  sx={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    bgcolor: "rgba(0,0,0,0.5)",
                                    opacity: 0,
                                    transition: "opacity 0.2s",
                                    "&:hover": {
                                      opacity: 1,
                                      cursor: "pointer",
                                    },
                                  }}
                                  onClick={() => onTogglePlay(item.id)}
                                >
                                  {currentlyPlaying === item.id ? (
                                    <PauseIcon sx={{ color: "white" }} />
                                  ) : (
                                    <PlayArrowIcon sx={{ color: "white" }} />
                                  )}
                                </Box>
                              </Box>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Typography
                                  variant="body1"
                                  fontWeight={
                                    currentlyPlaying === item.id
                                      ? "bold"
                                      : "regular"
                                  }
                                  color={
                                    currentlyPlaying === item.id
                                      ? "primary"
                                      : "text.primary"
                                  }
                                >
                                  {item.title}
                                </Typography>
                              }
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <Typography variant="body2" color="text.secondary">
                              {item.artist}
                            </Typography>
                          </Grid>

                          <Grid item xs={2}>
                            <Chip
                              size="small"
                              label={formatDistanceToNow(
                                new Date(item.dateAdded),
                                { addSuffix: true }
                              )}
                              sx={{
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                color: theme.palette.text.primary,
                                fontWeight: "medium",
                                borderRadius: 1,
                              }}
                            />
                          </Grid>

                          <Grid
                            item
                            xs={1}
                            sx={{ display: "flex", justifyContent: "flex-end" }}
                          >
                            <Typography variant="body2" color="text.secondary">
                              {formatDuration(item.duration)}
                            </Typography>
                          </Grid>
                        </Grid>
                      </ListItem>
                      {index < items.length - 1 && <Divider component="li" />}
                    </React.Fragment>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </DragDropContext>
    </Paper>
  );
};

// Main PlaylistDetail Component
const PlaylistDetail = () => {
  const { id } = useParams();
  const theme = useTheme();
  const [playlist, setPlaylist] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const fetchPlaylistDetails = async () => {
      try {
        const playlistDetails = await getPlaylistDetails(id);
        setPlaylist(playlistDetails);
        setItems(playlistDetails.items);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching playlist:", error);
        setLoading(false);
      }
    };

    fetchPlaylistDetails();
  }, [id]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedItems = Array.from(items);
    const [reorderedItem] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, reorderedItem);

    setItems(reorderedItems);
  };

  const toggleItemSelection = (itemId) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const togglePlay = (itemId) => {
    if (currentlyPlaying === itemId) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentlyPlaying(itemId);
      setIsPlaying(true);
    }
  };

  const handlePlayAll = () => {
    if (items.length > 0) {
      setCurrentlyPlaying(items[0].id);
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    if (!currentlyPlaying || items.length === 0) return;

    const currentIndex = items.findIndex(
      (item) => item.id === currentlyPlaying
    );
    if (currentIndex < items.length - 1) {
      setCurrentlyPlaying(items[currentIndex + 1].id);
      setIsPlaying(true);
    }
  };

  const handlePrevious = () => {
    if (!currentlyPlaying || items.length === 0) return;

    const currentIndex = items.findIndex(
      (item) => item.id === currentlyPlaying
    );
    if (currentIndex > 0) {
      setCurrentlyPlaying(items[currentIndex - 1].id);
      setIsPlaying(true);
    }
  };

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const currentTrack = currentlyPlaying
    ? items.find((item) => item.id === currentlyPlaying)
    : null;

  return (
    <Box
      sx={{
        bgcolor:
          theme.palette.mode === "dark"
            ? alpha(theme.palette.background.default, 0.9)
            : alpha(theme.palette.grey[50], 0.9),
        minHeight: "100vh",
        pt: 3,
        pb: 10,
      }}
    >
      <Container maxWidth="xl">
        {/* Playlist Header */}
        <PlaylistHeader
          playlist={playlist}
          onPlayAll={handlePlayAll}
          onShare={() => console.log("Share clicked")}
        />

        {/* Search and Filter */}
        <SearchAndFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Track List */}
        <TrackList
          items={filteredItems}
          currentlyPlaying={currentlyPlaying}
          onTogglePlay={togglePlay}
          onToggleSelect={toggleItemSelection}
          selectedItems={selectedItems}
          onDragEnd={handleDragEnd}
        />

        {/* Player Controls */}
        {currentTrack && (
          <PlayerControls
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onPlayPause={() => setIsPlaying(!isPlaying)}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )}
      </Container>
    </Box>
  );
};

export default PlaylistDetail;
