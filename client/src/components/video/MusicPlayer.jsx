import React, { useState, useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';

const MusicPlayer = ({ video }) => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Load the YouTube IFrame Player API
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }

        // Reset loading state when video changes
        setIsLoading(true);
    }, [video]);

    useEffect(() => {
        if (!video) return;

        const loadPlayer = () => {
            new window.YT.Player('player', {
                height: '100%',
                width: '100%',
                videoId: video.id.videoId,
                playerVars: {
                    autoplay: 1,
                    modestbranding: 1,
                    rel: 0
                },
                events: {
                    onReady: () => setIsLoading(false)
                }
            });
        };

        if (window.YT && window.YT.Player) {
            loadPlayer();
        } else {
            window.onYouTubeIframeAPIReady = loadPlayer;
        }
    }, [video]);

    return (
        <Box sx={{ 
            position: 'relative',
            paddingTop: '56.25%', // 16:9 Aspect Ratio
            bgcolor: 'black',
            borderRadius: 1,
            overflow: 'hidden'
        }}>
            {isLoading && (
                <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <CircularProgress />
                </Box>
            )}
            <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            }}>
                <div id="player" />
            </Box>
        </Box>
    );
};

export default MusicPlayer;