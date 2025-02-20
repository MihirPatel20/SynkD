import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';

const VideoCard = ({ video }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/watch/${video.id.videoId}`);
  };

  return (
    <Card 
      onClick={handleClick}
      sx={{ 
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3,
          transition: 'all 0.2s ease-in-out'
        }
      }}
    >
      <CardMedia
        component="img"
        height="180"
        image={video.snippet.thumbnails.medium.url}
        alt={video.snippet.title}
      />
      <CardContent>
        <Typography variant="subtitle1" noWrap>
          {video.snippet.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {video.snippet.description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default VideoCard;