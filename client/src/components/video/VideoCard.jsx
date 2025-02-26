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
import VisibilityIcon from "@mui/icons-material/Visibility";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

import { formatDate } from "../../utils/dateUtils";

const VideoCard = ({
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

      <Stack
        direction="row"
        spacing={2}
        sx={{
          p: 1.5,
          pb: 0,
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

      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "top", mb: 1.5 }}>
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
            variant="subtitle1"
            align="left"
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
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          align="left"
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

export default VideoCard;
