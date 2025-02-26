import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
} from '@mui/material';
import {
  Search as SearchIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  DragIndicator as DragIndicatorIcon,
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { formatDistanceToNow, formatDuration } from 'date-fns';
import { getPlaylistDetails } from '../services/youtube/youtubeApi'; // Import the function

const PlaylistDetail = () => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);

  useEffect(() => {
    const fetchPlaylistDetails = async () => {
      try {
        const playlistDetails = await getPlaylistDetails(id);
        setPlaylist(playlistDetails);
        setItems(playlistDetails.items); // Assuming the items are part of the playlist details
        setLoading(false);
      } catch (error) {
        console.error('Error fetching playlist:', error);
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
    setCurrentlyPlaying(currentlyPlaying === itemId ? null : itemId);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" fontWeight="bold">
            {playlist?.snippet?.title || 'Playlist Name'}
          </Typography>
          
          <Box>
            <Button variant="contained" color="primary" sx={{ mr: 2 }}>
              Play All
            </Button>
            <Button variant="outlined">
              Share
            </Button>
          </Box>
        </Box>

        <Paper sx={{ mb: 4, p: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Search in playlist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="playlist-items">
              {(provided) => (
                <List {...provided.droppableProps} ref={provided.innerRef}>
                  {items.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided) => (
                        <ListItem
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          sx={{
                            bgcolor: selectedItems.has(item.id) ? 'action.selected' : 'transparent',
                            '&:hover': {
                              bgcolor: 'action.hover',
                            },
                          }}
                        >
                          <Box {...provided.dragHandleProps} sx={{ mr: 2 }}>
                            <DragIndicatorIcon />
                          </Box>
                          
                          <ListItemAvatar>
                            <Avatar variant="rounded" src={item.thumbnail}>
                              {item.title[0]}
                            </Avatar>
                          </ListItemAvatar>
                          
                          <ListItemText
                            primary={item.title}
                            secondary={
                              <Box component="span" sx={{ display: 'flex', gap: 2 }}>
                                <Typography variant="body2" component="span">
                                  {item.artist}
                                </Typography>
                                <Typography variant="body2" component="span" color="text.secondary">
                                  {formatDuration(item.duration)}
                                </Typography>
                              </Box>
                            }
                          />
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip
                              size="small"
                              label={formatDistanceToNow(new Date(item.dateAdded), { addSuffix: true })}
                            />
                            <IconButton onClick={() => togglePlay(item.id)}>
                              {currentlyPlaying === item.id ? <PauseIcon /> : <PlayArrowIcon />}
                            </IconButton>
                          </Box>
                        </ListItem>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </List>
              )}
            </Droppable>
          </DragDropContext>
        </Paper>
      </Box>
    </Container>
  );
};

export default PlaylistDetail;