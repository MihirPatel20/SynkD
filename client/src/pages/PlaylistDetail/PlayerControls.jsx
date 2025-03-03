import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Slider,
  Card,
  CardMedia,
  CardContent,
  useTheme,
} from "@mui/material";
import {
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  SkipPrevious as SkipPreviousIcon,
  SkipNext as SkipNextIcon,
  VolumeUp as VolumeUpIcon,
} from "@mui/icons-material";

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
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        display: "flex",
        alignItems: "center",
        p: 1,
        zIndex: 10,
        borderRadius: 0,
      }}
    >
      {/* Track Info */}
      <Box sx={{ display: "flex", width: "30%", alignItems: "center" }}>
        {currentTrack && (
          <>
            <CardMedia
              component="img"
              sx={{ width: 56, height: 56, borderRadius: 1 }}
              image={currentTrack.thumbnail || "https://via.placeholder.com/56"}
              alt={currentTrack.title}
            />
            <CardContent sx={{ flex: "1 0 auto", py: 1 }}>
              <Typography variant="subtitle1" component="div">
                {currentTrack.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {currentTrack.channelTitle.replace(" - Topic", "")}
              </Typography>
            </CardContent>
          </>
        )}
      </Box>

      {/* Player Controls */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "40%",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <IconButton onClick={onPrevious} size="small">
            <SkipPreviousIcon />
          </IconButton>
          <IconButton onClick={onPlayPause} sx={{ mx: 1 }}>
            {isPlaying ? (
              <PauseIcon fontSize="large" />
            ) : (
              <PlayArrowIcon fontSize="large" />
            )}
          </IconButton>
          <IconButton onClick={onNext} size="small">
            <SkipNextIcon />
          </IconButton>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
          <Typography variant="caption" sx={{ mr: 1 }}>
            {formatTime(position)}
          </Typography>
          <Slider
            size="small"
            value={position}
            max={duration}
            onChange={(_, value) => setPosition(value)}
            sx={{ mx: 1 }}
          />
          <Typography variant="caption" sx={{ ml: 1 }}>
            {formatTime(duration)}
          </Typography>
        </Box>
      </Box>

      {/* Volume Control */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "30%",
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
      </Box>
    </Card>
  );
};

export default PlayerControls;
