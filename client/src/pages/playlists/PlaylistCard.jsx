import React from 'react';
import { useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  MusicNote as MusicNoteIcon,
  PlayArrow as PlayArrowIcon,
  Share as ShareIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';

const PlaylistCard = ({ playlist }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

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
    // Implement actions
    console.log(`${action} playlist:`, playlist.id);
  };

  const handlePlaylistClick = () => {
    navigate(`/playlist/${playlist.id}`);
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <CardActionArea onClick={handlePlaylistClick}>
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="160"
            image={playlist.snippet.thumbnails?.high?.url || 'https://via.placeholder.com/320x160?text=No+Thumbnail'}
            alt={playlist.snippet.title}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              bgcolor: 'rgba(0, 0, 0, 0.6)',
              color: 'white',
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="caption">
              {playlist.contentDetails?.itemCount || 0} items
            </Typography>
            <Chip
              icon={<MusicNoteIcon sx={{ color: 'inherit' }} />}
              label="Music"
              size="small"
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                '& .MuiChip-icon': {
                  color: 'white',
                },
              }}
            />
          </Box>
        </Box>
      </CardActionArea>

      <CardContent sx={{ flexGrow: 1, position: 'relative' }}>
        <Typography variant="h6" noWrap>
          {playlist.snippet.title}
        </Typography>
        
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            mb: 1,
          }}
        >
          {playlist.snippet.description || 'No description'}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Created {formatDistanceToNow(new Date(playlist.snippet.publishedAt), { addSuffix: true })}
          </Typography>
          
          <Box>
            <IconButton 
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                // Implement play functionality
              }}
              sx={{ mr: 1 }}
            >
              <PlayArrowIcon />
            </IconButton>
            
            <IconButton
              size="small"
              onClick={handleClick}
              aria-controls={open ? 'playlist-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <MoreVertIcon />
            </IconButton>
          </Box>
        </Box>

        <Menu
          id="playlist-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          onClick={(e) => e.stopPropagation()}
        >
          <MenuItem onClick={handleAction('share')}>
            <ShareIcon fontSize="small" sx={{ mr: 1 }} />
            Share
          </MenuItem>
          <MenuItem onClick={handleAction('edit')}>
            <EditIcon fontSize="small" sx={{ mr: 1 }} />
            Edit
          </MenuItem>
          <MenuItem onClick={handleAction('delete')} sx={{ color: 'error.main' }}>
            <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
            Delete
          </MenuItem>
        </Menu>
      </CardContent>
    </Card>
  );
};

export default PlaylistCard;