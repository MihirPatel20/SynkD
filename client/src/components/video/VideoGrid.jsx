import React from "react";
import Grid from "@mui/material/Grid2";
import VideoCard, { NewVideoCard } from "./VideoCard";

const VideoGrid = ({ videos = [] }) => {
  return (
    <Grid container spacing={2}>
      {videos.map((video) => (
        <Grid key={video.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <VideoCard video={video} />
        </Grid>
      ))}
    </Grid>
  );
};

export const NewVideoGrid = ({ videos = [] }) => {
  return (
    <Grid container spacing={2}>
      {videos.map((video) => (
        <Grid key={video.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <NewVideoCard
            title={video.title}
            description={video.description}
            thumbnail={video.thumbnail}
            videoId={video.id}
            channelTitle={video.channelTitle}
            publishedAt={video.publishedAt}
            viewCount={video.viewCount}
            likeCount={video.likeCount}
            fromSubscription={video.fromSubscription}
            
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default VideoGrid;
