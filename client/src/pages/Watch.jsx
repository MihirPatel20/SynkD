import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Grid, Typography, Box } from '@mui/material';
import MusicPlayer from '../components/video/MusicPlayer';
import VideoList from '../components/video/VideoList';
import { fetchVideos } from '../services/youtube/youtubeApi.js';

const Watch = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);

  useEffect(() => {
    const loadVideo = async () => {
      try {
        // In a real app, we would fetch the specific video details
        // For now, we'll just create a minimal video object
        setVideo({
          id: { videoId },
          snippet: {
            title: 'Video Title', // This would come from the API
            description: 'Video Description' // This would come from the API
          }
        });

        // Fetch related videos
        const results = await fetchVideos('music'); // In a real app, use video tags/category
        setRelatedVideos(results.filter(v => v.id.videoId !== videoId));
      } catch (error) {
        console.error('Error loading video:', error);
      }
    };

    loadVideo();
  }, [videoId]);

  if (!video) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="xl">
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <MusicPlayer video={video} />
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">{video.snippet.title}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {video.snippet.description}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" gutterBottom>Up Next</Typography>
          <Box sx={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
            <VideoList videos={relatedVideos} compact />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Watch;