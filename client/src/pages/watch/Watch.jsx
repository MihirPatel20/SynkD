import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Grid,
  Typography,
  Box,
  Chip,
  Divider,
  Avatar,
  IconButton,
  Tooltip,
  Paper,
  CircularProgress,
} from "@mui/material";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";

import MusicPlayer from "../../components/video/MusicPlayer";
import VideoList from "../../components/video/UpNextVideoList.jsx";
import {
  fetchVideos,
  getVideoDetails,
} from "../../services/api/youtubeDataApi.js";
import {
  formatDate,
  formatCount,
  formatDuration,
} from "../../utils/formatters";
import { dummyUpNextData } from "../../utils/dummyData.js";

const Watch = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadVideo = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get video details using YouTube Data API
        const videoData = await getVideoDetails(videoId);
        setVideo(videoData);

        // Fetch related videos
        // const relatedData = await fetchVideos(
        //   videoData.snippet.tags?.[0] ||
        //     videoData.snippet.categoryId ||
        //     "related",
        //   {
        //     relatedToVideoId: videoId,
        //     type: "video",
        //   }
        // );

        setRelatedVideos(
          dummyUpNextData.filter((v) => {
            console.log("Comparing:", v.id, "with", videoId);
            return v.id !== videoId;
          })
        );
      } catch (error) {
        console.error("Error loading video:", error);
        setError("Failed to load video details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadVideo();
  }, [videoId]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
        }}
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!video) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
        }}
      >
        <Typography>Video not found</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {/* Video Player */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: 2,
              overflow: "hidden",
              bgcolor: "black",
              position: "relative",
            }}
          >
            <Box
              sx={{
                position: "relative",
                paddingTop: "56.25%" /* 16:9 Aspect Ratio */,
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                }}
              >
                <MusicPlayer videoId={videoId} />
              </Box>
            </Box>
          </Paper>

          {/* Video Title and Stats */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="h5" fontWeight="500" gutterBottom>
              {video.snippet.title}
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                mb: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  color: "text.secondary",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <VisibilityOutlinedIcon fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="body2">
                    {formatCount(video.statistics?.viewCount)} views
                  </Typography>
                </Box>
                <Typography variant="body2">•</Typography>
                <Typography variant="body2">
                  {formatDate(video.snippet.publishedAt)}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 1, mt: { xs: 1, sm: 0 } }}>
                <Tooltip title="Like">
                  <IconButton size="small">
                    <ThumbUpOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Typography variant="body2" sx={{ alignSelf: "center" }}>
                  {formatCount(video.statistics?.likeCount)}
                </Typography>

                <Tooltip title="Comments">
                  <IconButton size="small">
                    <CommentOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Typography variant="body2" sx={{ alignSelf: "center" }}>
                  {formatCount(video.statistics?.commentCount)}
                </Typography>

                <Tooltip title="Share">
                  <IconButton size="small">
                    <ShareOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Save">
                  <IconButton size="small">
                    <BookmarkBorderOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Channel Info */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar
                src={video.snippet.thumbnails?.default?.url || ""}
                alt={video.snippet.channelTitle}
                sx={{ width: 48, height: 48, mr: 2 }}
              />
              <Box>
                <Typography variant="subtitle1" fontWeight="500">
                  {video.snippet.channelTitle}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {/* Subscriber count would need a separate API call */}
                </Typography>
              </Box>
            </Box>

            {/* Video Description */}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                bgcolor: "background.paper",
                borderRadius: 2,
                mb: 3,
              }}
            >
              <Box>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                  {video.snippet.tags?.slice(0, 5).map((tag, index) => (
                    <Chip
                      key={index}
                      label={`#${tag}`}
                      size="small"
                      variant="outlined"
                      sx={{ borderRadius: 1 }}
                    />
                  ))}
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    whiteSpace: expanded ? "normal" : "nowrap",
                    overflow: expanded ? "visible" : "hidden",
                    textOverflow: expanded ? "clip" : "ellipsis",
                    maxHeight: expanded ? "none" : "80px",
                  }}
                >
                  {video.snippet.description || "No description available"}
                </Typography>

                {video.snippet.description &&
                  video.snippet.description.length > 80 && (
                    <Typography
                      variant="body2"
                      color="primary"
                      sx={{
                        mt: 1,
                        cursor: "pointer",
                        fontWeight: 500,
                      }}
                      onClick={() => setExpanded(!expanded)}
                    >
                      {expanded ? "Show less" : "Show more"}
                    </Typography>
                  )}
              </Box>
            </Paper>
          </Box>
        </Grid>

        {/* Related Videos */}
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle1" fontWeight="500" sx={{ mb: 2 }}>
            Up Next
          </Typography>

          <Box
            sx={{
              maxHeight: { md: "calc(100vh - 120px)" },
              overflowY: "auto",
              pr: 1,
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "rgba(0,0,0,0.2)",
                borderRadius: "3px",
              },
            }}
          >
            {relatedVideos.length > 0 ? (
              <VideoList videos={relatedVideos} compact />
            ) : (
              <Typography variant="body2" color="text.secondary">
                No related videos found
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Watch;
