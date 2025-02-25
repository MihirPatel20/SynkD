import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";

const VideoCard = ({ video }) => {
  console.log("Video:", video);

  const navigate = useNavigate();

  // Guard against undefined video data
  if (!video?.snippet) {
    return null;
  }

  const handleClick = () => {
    const videoId = video?.id || video?.id?.videoId;
    if (videoId) {
      navigate(`/watch/${videoId}`);
    }
  };

  return (
    <Card
      onClick={handleClick}
      sx={{
        cursor: "pointer",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 3,
          transition: "all 0.2s ease-in-out",
        },
      }}
    >
      <CardMedia
        component="img"
        height="180"
        image={
          video.snippet.thumbnails?.medium?.url ||
          video.snippet.thumbnails?.default?.url
        }
        alt={video.snippet.title || "Video thumbnail"}
      />
      <CardContent>
        <Typography variant="subtitle1" noWrap>
          {video.snippet.title || "Untitled"}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {video.snippet.description || "No description available"}
        </Typography>
      </CardContent>
    </Card>
  );
};

export const NewVideoCard = ({ title, description, thumbnail, videoId }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/watch/${videoId}`);
  };

  return (
    <Card
      onClick={handleClick}
      sx={{
        cursor: "pointer",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 3,
          transition: "all 0.2s ease-in-out",
        },
      }}
    >
      <CardMedia component="img" height="180" image={thumbnail} alt={title} />
      <CardContent>
        <Typography variant="subtitle1" noWrap>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default VideoCard;
