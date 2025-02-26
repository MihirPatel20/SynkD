import React, { useState, useEffect } from 'react';
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
  Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { getUserPlaylists } from '../services/youtube/youtubeApi';
import PlaylistCard from '../components/playlists/PlaylistCard';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';

const Playlists = () => {
  const { showSnackbar } = useSnackbar();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPlaylists, setFilteredPlaylists] = useState([]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        const userPlaylists = await getUserPlaylists(accessToken);
        console.log('userPlaylists:', userPlaylists);
        setPlaylists(userPlaylists);
        setFilteredPlaylists(userPlaylists);
      } catch (error) {
        console.error('Error fetching playlists:', error);
        showSnackbar('Failed to load playlists', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  useEffect(() => {
    const filtered = playlists.filter(playlist => 
      playlist.snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      playlist.snippet.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.snippet.title.localeCompare(b.snippet.title);
        case 'date':
          return new Date(b.snippet.publishedAt) - new Date(a.snippet.publishedAt);
        case 'recent':
          // In a real app, you'd track last played date
          return new Date(b.snippet.publishedAt) - new Date(a.snippet.publishedAt);
        default:
          return 0;
      }
    });

    setFilteredPlaylists(sorted);
  }, [searchQuery, sortBy, playlists]);

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
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Your Playlists
        </Typography>

        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          mb: 4,
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' }
        }}>
          <TextField
            placeholder="Search playlists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1 }}
          />
          
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Sort by</InputLabel>
            <Select
              value={sortBy}
              label="Sort by"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="recent">Recently Played</MenuItem>
              <MenuItem value="date">Date Created</MenuItem>
              <MenuItem value="name">Name</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {filteredPlaylists.length > 0 ? (
          <Grid container spacing={3}>
            {filteredPlaylists.map((playlist) => (
              <Grid item key={playlist.id} xs={12} sm={6} md={4} lg={3}>
                <PlaylistCard playlist={playlist} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box textAlign="center" py={8}>
            <Typography variant="h6" color="text.secondary">
              No playlists found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchQuery ? 'Try adjusting your search' : 'Create your first playlist to get started'}
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Playlists;