import React from 'react';
import { Grid } from '@mui/material';
import VideoCard from './VideoCard';

const VideoGrid = ({ videos }) => {
  return (
    <Grid container spacing={2}>
      {videos.map((video) => (
        <Grid item key={video.id.videoId} xs={12} sm={6} md={4} lg={3}>
          <VideoCard video={video} />
        </Grid>
      ))}
    </Grid>
  );
};

export default VideoGrid;