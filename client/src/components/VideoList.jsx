import React from 'react';
import { Grid, Card, CardContent, Typography, CardMedia } from '@mui/material';

const VideoList = ({ videos, onVideoSelect }) => {
    return (
        <Grid container spacing={2}>
            {videos.map((video) => (
                <Grid item key={video.id} xs={12} sm={6} md={4}>
                    <Card onClick={() => onVideoSelect(video)}>
                        <CardMedia
                            component="img"
                            alt={video.title}
                            height="140"
                            image={video.thumbnail}
                        />
                        <CardContent>
                            <Typography variant="h6">{video.title}</Typography>
                            <Typography variant="body2" color="textSecondary">
                                {video.description}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default VideoList;