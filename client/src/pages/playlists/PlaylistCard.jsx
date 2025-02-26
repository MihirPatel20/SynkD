// src/components/playlists/PlaylistCard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  CardActionArea,
  Checkbox,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  MusicNote as MusicNoteIcon,
  PlayArrow as PlayArrowIcon,
  Share as ShareIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Headphones as HeadphonesIcon,
} from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";
import { getPlaylistHistory } from "../../services/analytics/listeningHistoryDB";

const PlaylistCard = ({
  playlist,
  selectable = false,
  selected = false,
  onToggleSelect = () => {},
}) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [playCount, setPlayCount] = useState(0);
  const open = Boolean(anchorEl);

  useEffect(() => {
    const fetchPlayCount = async () => {
      if (playlist && playlist.id) {
        const history = await getPlaylistHistory(playlist.id);
        setPlayCount(history.length);
      }
    };

    fetchPlayCount();
  }, [playlist]);

  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (action) => (event) => {
    event.stopPropagation();
    handleClose();
    console.log(`${action} playlist:`, playlist.id);
  };

  const handleCardClick = () => {
    navigate(`/playlist/${playlist.id}`);
  };

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        position: "relative",
        bgcolor: "background.paper",
        transition: "transform 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: 6,
        },
      }}
      onClick={handleCardClick}
    >
      {selectable && (
        <Checkbox
          checked={selected}
          sx={{ position: "absolute", top: 8, left: 8, zIndex: 1 }}
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelect();
          }}
        />
      )}

      <CardMedia
        component="img"
        sx={{ height: 140, objectFit: "cover" }}
        image={
          playlist.snippet.thumbnails?.high?.url ||
          "https://via.placeholder.com/320x180?text=No+Thumbnail"
        }
        alt={playlist.snippet.title}
      />

      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Chip
            icon={<MusicNoteIcon />}
            label={`${playlist.contentDetails?.itemCount || 0} items`}
            size="small"
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.2)",
              color: "white",
              "& .MuiChip-icon": {
                color: "white",
              },
            }}
          />

          <Chip
            icon={<HeadphonesIcon />}
            label={`${playCount} plays`}
            size="small"
            color="secondary"
            sx={{ ml: 1 }}
          />
        </Box>

        <Typography variant="h6" component="div" noWrap>
          {playlist.snippet.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 1 }}
          noWrap
        >
          {playlist.snippet.description || "No description"}
        </Typography>

        <Typography variant="caption" color="text.secondary">
          Created{" "}
          {formatDistanceToNow(new Date(playlist.snippet.publishedAt), {
            addSuffix: true,
          })}
        </Typography>
      </CardContent>

      <Box
        sx={{ display: "flex", justifyContent: "space-between", p: 1, pt: 0 }}
      >
        <IconButton
          size="small"
          color="primary"
          onClick={(e) => {
            e.stopPropagation();
            // Implement play functionality
          }}
          sx={{ mr: 1 }}
        >
          <PlayArrowIcon />
        </IconButton>

        <IconButton size="small" onClick={handleClick}>
          <MoreVertIcon />
        </IconButton>

        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          <MenuItem onClick={handleAction("share")}>
            <ShareIcon fontSize="small" sx={{ mr: 1 }} />
            Share
          </MenuItem>
          <MenuItem onClick={handleAction("edit")}>
            <EditIcon fontSize="small" sx={{ mr: 1 }} />
            Edit
          </MenuItem>
          <MenuItem onClick={handleAction("delete")}>
            <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
            Delete
          </MenuItem>
        </Menu>
      </Box>
    </Card>
  );
};

export default PlaylistCard;
