import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Typography, CardMedia } from '@mui/material';

const VideoList = ({ videos, compact = false }) => {
    const navigate = useNavigate();

    const handleVideoSelect = (videoId) => {
        navigate(`/watch/${videoId}`);
    };

    return (
        <Box>
            {videos.map((video) => (
                <Card 
                    key={video.id.videoId} 
                    onClick={() => handleVideoSelect(video.id.videoId)}
                    sx={{ 
                        display: 'flex', 
                        mb: 1, 
                        cursor: 'pointer',
                        '&:hover': {
                            backgroundColor: 'action.hover'
                        }
                    }}
                >
                    <CardMedia
                        component="img"
                        sx={{ width: compact ? 168 : 200 }}
                        image={video.snippet.thumbnails.medium.url}
                        alt={video.snippet.title}
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <CardContent sx={{ flex: '1 0 auto', py: 1 }}>
                            <Typography variant="subtitle1" component="div" noWrap>
                                {video.snippet.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" noWrap>
                                {video.snippet.description}
                            </Typography>
                        </CardContent>
                    </Box>
                </Card>
            ))}
        </Box>
    );
};

export default VideoList;