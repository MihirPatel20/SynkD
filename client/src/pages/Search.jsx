import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container, Typography, Alert } from '@mui/material';
import VideoGrid from '../components/video/VideoGrid';
import { fetchVideos } from '../services/youtube/youtubeApi.js';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchVideos = async () => {
      if (!query) return;
      
      setLoading(true);
      try {
        const results = await fetchVideos(query);
        setVideos(results);
        setError(null);
      } catch (err) {
        setError('Failed to fetch videos. Please try again later.');
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    searchVideos();
  }, [query]);

  if (!query) {
    return (
      <Container maxWidth="xl">
        <Typography variant="h5">Please enter a search term</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Typography variant="h5" gutterBottom>
        Search results for: {query}
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <VideoGrid videos={videos} />
      )}
    </Container>
  );
};

export default Search;