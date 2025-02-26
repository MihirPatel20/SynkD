import React from "react";
import Grid from "@mui/material/Grid2";
import VideoCard from "./VideoCard";

const NewVideoGrid = ({ videos = [] }) => {

  console.log("videos", videos);
  return (
    <Grid container spacing={2}>
      {videos.map((video) => (
        <Grid key={video.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <VideoCard
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

export default NewVideoGrid;
