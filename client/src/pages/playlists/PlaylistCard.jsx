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
      if (playlist && playlist.youtubePlaylistId) {
        const history = await getPlaylistHistory(playlist.youtubePlaylistId);
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
    console.log(`${action} playlist:`, playlist.youtubePlaylistId);
    event.stopPropagation();
    handleClose();
  };

  const handleCardClick = () => {
    navigate(`/playlist/${playlist.youtubePlaylistId}`);
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
          cursor: "pointer",
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
          playlist.thumbnail ||
          "https://via.placeholder.com/320x180?text=No+Thumbnail"
        }
        alt={playlist.title}
      />

      <CardContent>
        <Typography variant="h6" component="div" noWrap>
          {playlist.title}
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "space-between", my: 1 }}>
          <Chip
            icon={<MusicNoteIcon />}
            label={`${playlist.itemCount || 0} items`}
            size="small"
          />
          <Chip
            icon={<HeadphonesIcon />}
            label={`${playCount} plays`}
            size="small"
            sx={{ ml: 1 }}
          />
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          noWrap
          sx={{ mt: 1 }}
        >
          {playlist.description || "No description"}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
          Created{" "}
          {formatDistanceToNow(new Date(playlist.createdAt), {
            addSuffix: true,
          })}
        </Typography>
      </CardContent>

      <Box
        sx={{ display: "flex", justifyContent: "space-between", p: 1, pt: 0 }}
      >
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            // Implement play functionality
          }}
          sx={{ mr: 1 }}
        >
          <PlayArrowIcon />
        </IconButton>
        <IconButton
          onClick={(e) => {
            handleClick(e);
            e.stopPropagation();
          }}
        >
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
