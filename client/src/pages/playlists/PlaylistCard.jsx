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
  Checkbox,
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

const PlaylistCard = ({ 
  playlist, 
  selectable = false, 
  selected = false, 
  onToggleSelect = () => {} 
}) => {
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
    console.log(`${action} playlist:`, playlist.id);
  };

  const handleCardClick = () => {
    // Always navigate to playlist detail when card is clicked
    navigate(`/playlist/${playlist.id}`);
  };

  return (
    <Card 
      sx={{ 
        position: 'relative',
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
        border: selected ? '2px solid #3f51b5' : 'none',
      }}
      onClick={handleCardClick}
    >
      {selectable && (
        <Checkbox 
          checked={selected}
          sx={{ 
            position: 'absolute', 
            top: 8, 
            left: 8, 
            zIndex: 1,
            bgcolor: 'rgba(255, 255, 255, 0.7)',
            borderRadius: '50%',
            p: 0.5,
            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' },
          }}
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click
            onToggleSelect();
          }}
        />
      )}
      <CardMedia
        component="img"
        height="140"
        image={playlist.snippet.thumbnails?.high?.url || '/placeholder-playlist.jpg'}
        alt={playlist.snippet.title}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Chip
            icon={<MusicNoteIcon />}
            label={`${playlist.contentDetails?.itemCount || 0} items`}
            size="small"
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              '& .MuiChip-icon': {
                color: 'white',
              },
            }}
          />
          <IconButton
            aria-label="more"
            aria-controls="playlist-menu"
            aria-haspopup="true"
            onClick={handleClick}
            size="small"
          >
            <MoreVertIcon />
          </IconButton>
        </Box>
        <Typography variant="h6" component="div" noWrap>
          {playlist.snippet.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {playlist.snippet.description || 'No description'}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Created {formatDistanceToNow(new Date(playlist.snippet.publishedAt), { addSuffix: true })}
        </Typography>
      </CardContent>
      <Box sx={{ display: 'flex', p: 1 }}>
        <IconButton
          color="primary"
          aria-label="play playlist"
          onClick={(e) => {
            e.stopPropagation();
            // Implement play functionality
          }}
          sx={{ mr: 1 }}
        >
          <PlayArrowIcon />
        </IconButton>
      </Box>
      <Menu
        id="playlist-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={(e) => e.stopPropagation()}
      >
        <MenuItem onClick={handleAction('share')}><ShareIcon sx={{ mr: 1 }} /> Share</MenuItem>
        <MenuItem onClick={handleAction('edit')}><EditIcon sx={{ mr: 1 }} /> Edit</MenuItem>
        <MenuItem onClick={handleAction('delete')}><DeleteIcon sx={{ mr: 1 }} /> Delete</MenuItem>
      </Menu>
    </Card>
  );
};

export default PlaylistCard;
