import React, { useState, useEffect } from 'react';
import { Box, Button } from '@mui/material';

const MusicPlayer = ({ videoId }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [player, setPlayer] = useState(null);

    useEffect(() => {
        if (videoId && !player) {
            const newPlayer = new window.YT.Player('player', {
                height: '390',
                width: '640',
                videoId: videoId,
                events: {
                    onReady: onPlayerReady,
                    onStateChange: onPlayerStateChange,
                },
            });
            setPlayer(newPlayer);
        }
    }, [videoId, player]);

    const onPlayerReady = (event) => {
        if (isPlaying) {
            event.target.playVideo();
        }
    };

    const onPlayerStateChange = (event) => {
        if (event.data === window.YT.PlayerState.ENDED) {
            setIsPlaying(false);
        }
    };

    const handlePlayPause = () => {
        if (player) {
            if (isPlaying) {
                player.pauseVideo();
            } else {
                player.playVideo();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <Box>
            <div id="player"></div>
            <Button variant="contained" onClick={handlePlayPause}>
                {isPlaying ? 'Pause' : 'Play'}
            </Button>
        </Box>
    );
};

export default MusicPlayer;