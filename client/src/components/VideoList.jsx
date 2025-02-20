import React from 'react';
import { Grid, Card, CardContent, Typography, CardMedia, Box } from '@mui/material';

const VideoList = ({ videos, onVideoSelect, compact = false }) => {
    if (compact) {
        return (
            <Box>
                {videos.map((video) => (
                    <Card 
                        key={video.id.videoId} 
                        onClick={() => onVideoSelect(video)}
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
                            sx={{ width: 168 }}
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
    }

    return (
        <Grid container spacing={2}>
            {videos.map((video) => (
                <Grid item key={video.id.videoId} xs={12} sm={6} md={4}>
                    <Card 
                        onClick={() => onVideoSelect(video)}
                        sx={{ 
                            cursor: 'pointer',
                            '&:hover': {
                                backgroundColor: 'action.hover'
                            }
                        }}
                    >
                        <CardMedia
                            component="img"
                            alt={video.snippet.title}
                            height="180"
                            image={video.snippet.thumbnails.medium.url}
                        />
                        <CardContent>
                            <Typography variant="h6" noWrap>{video.snippet.title}</Typography>
                            <Typography variant="body2" color="textSecondary" noWrap>
                                {video.snippet.description}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default VideoList;