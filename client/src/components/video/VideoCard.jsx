import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
  Stack,
  Tooltip,
} from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import VerifiedIcon from "@mui/icons-material/Verified";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

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

export default VideoCard;

export const NewVideoCard = ({
  title,
  description,
  thumbnail,
  videoId,
  channelTitle,
  publishedAt,
  viewCount,
  likeCount,
  fromSubscription,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/watch/${videoId}`);
  };

  // Format view count (e.g., 1.2M, 4.5K)
  const formatCount = (count) => {
    if (!count) return "0";

    const num = parseInt(count);
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  // Format date as "2 days ago", "3 months ago", etc.
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return "";
    }
  };

  // Get channel initial for avatar fallback
  const getChannelInitial = () => {
    return channelTitle ? channelTitle.charAt(0).toUpperCase() : "?";
  };

  return (
    <Card
      onClick={handleClick}
      sx={{
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        transition: "all 0.3s ease-in-out",
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 12px 20px rgba(0,0,0,0.15)",
        },
      }}
    >
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height="180"
          image={thumbnail}
          alt={title}
          sx={{
            objectFit: "cover",
            backgroundColor: "rgba(0,0,0,0.05)",
          }}
        />

        {fromSubscription && (
          <Chip
            label="Subscribed"
            size="small"
            color="primary"
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              fontSize: "0.7rem",
              height: 24,
            }}
          />
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            mb: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            lineHeight: 1.3,
            height: "2.6em",
          }}
        >
          {title}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
          <Avatar
            sx={{
              width: 28,
              height: 28,
              mr: 1,
              bgcolor: "primary.main",
              fontSize: "0.875rem",
            }}
          >
            {getChannelInitial()}
          </Avatar>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "flex",
              alignItems: "center",
              fontWeight: 500,
            }}
          >
            {channelTitle}
            {fromSubscription && (
              <VerifiedIcon
                sx={{ ml: 0.5, fontSize: 14, color: "primary.main" }}
              />
            )}
          </Typography>
        </Box>

        <Stack
          direction="row"
          spacing={2}
          sx={{
            mb: 1.5,
            color: "text.secondary",
            fontSize: "0.75rem",
          }}
        >
          {viewCount && (
            <Tooltip title={`${viewCount} views`}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <VisibilityIcon sx={{ fontSize: 14, mr: 0.5 }} />
                {formatCount(viewCount)}
              </Box>
            </Tooltip>
          )}

          {likeCount && (
            <Tooltip title={`${likeCount} likes`}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <ThumbUpIcon sx={{ fontSize: 14, mr: 0.5 }} />
                {formatCount(likeCount)}
              </Box>
            </Tooltip>
          )}

          {publishedAt && (
            <Typography variant="caption" color="text.secondary">
              {formatDate(publishedAt)}
            </Typography>
          )}
        </Stack>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            lineHeight: 1.3,
            height: "2.6em",
            opacity: 0.8,
          }}
        >
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};
