import React from "react";
import {
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Paper,
  Divider,
  Grid,
  useTheme,
  alpha,
} from "@mui/material";
import {
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  DragIndicator as DragIndicatorIcon,
} from "@mui/icons-material";
import { Droppable, Draggable, DragDropContext } from "@hello-pangea/dnd";
import { format, formatDistanceToNow, formatDuration } from "date-fns";

const TrackList = ({
  tracks,
  currentlyPlaying,
  onTogglePlay,
  onToggleSelect,
  selectedItems,
  onDragEnd,
}) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        mb: 10, // Space for player controls
      }}
    >
      <Box sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
        <Grid container sx={{ px: 2, py: 1 }}>
          <Grid item xs={1}>
            #
          </Grid>
          <Grid item xs={5}>
            TITLE
          </Grid>
          <Grid item xs={3}>
            ARTIST
          </Grid>
          <Grid item xs={2}>
            ADDED
          </Grid>
          <Grid item xs={1}>
            DURATION
          </Grid>
        </Grid>
      </Box>
      <Divider />

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="playlist-tracks">
          {(provided) => (
            <List
              {...provided.droppableProps}
              ref={provided.innerRef}
              sx={{ py: 0 }}
            >
              {tracks.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <React.Fragment>
                      <ListItem
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        sx={{
                          py: 1,
                          borderRadius: 1,
                          bgcolor: selectedItems.has(item.id)
                            ? alpha(theme.palette.primary.main, 0.1)
                            : currentlyPlaying === item.id
                            ? alpha(theme.palette.primary.main, 0.05)
                            : "transparent",
                          "&:hover": {
                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                          },
                        }}
                      >
                        <Grid container alignItems="center">
                          <Grid
                            item
                            xs={1}
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <Box
                              {...provided.dragHandleProps}
                              sx={{ mr: 1, color: "text.secondary" }}
                            >
                              <DragIndicatorIcon fontSize="small" />
                            </Box>
                            {currentlyPlaying === item.id ? (
                              <Typography
                                variant="body2"
                                color="primary"
                                fontWeight="bold"
                              >
                                {index + 1}
                              </Typography>
                            ) : (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {index + 1}
                              </Typography>
                            )}
                          </Grid>

                          <Grid
                            item
                            xs={5}
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <ListItemAvatar>
                              <Box sx={{ position: "relative" }}>
                                <Avatar
                                  variant="rounded"
                                  src={item.thumbnail}
                                  sx={{ width: 40, height: 40 }}
                                >
                                  {item.title[0]}
                                </Avatar>
                                <Avatar
                                  sx={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    bgcolor: "rgba(0,0,0,0.5)",
                                    opacity: 0,
                                    transition: "opacity 0.2s",
                                    "&:hover": {
                                      opacity: 1,
                                      cursor: "pointer",
                                    },
                                  }}
                                  onClick={() => onTogglePlay(item.id)}
                                >
                                  {currentlyPlaying === item.id ? (
                                    <PauseIcon sx={{ color: "white" }} />
                                  ) : (
                                    <PlayArrowIcon sx={{ color: "white" }} />
                                  )}
                                </Avatar>
                              </Box>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Typography
                                  variant="body1"
                                  fontWeight={
                                    currentlyPlaying === item.id
                                      ? "bold"
                                      : "regular"
                                  }
                                  color={
                                    currentlyPlaying === item.id
                                      ? "primary"
                                      : "text.primary"
                                  }
                                >
                                  {item.title}
                                </Typography>
                              }
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <Typography variant="body2" color="text.secondary">
                              {item.channelTitle.replace(" - Topic", "")}
                            </Typography>
                          </Grid>

                          <Grid item xs={2}>
                            <Chip
                              size="small"
                              label={format(
                                new Date(item.videoPublishedAt),
                                "PP"
                              )}
                              sx={{
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                color: theme.palette.text.primary,
                                fontWeight: "medium",
                                borderRadius: 1,
                              }}
                            />
                          </Grid>

                          <Grid
                            item
                            xs={1}
                            sx={{ display: "flex", justifyContent: "flex-end" }}
                          >
                            <Typography variant="body2" color="text.secondary">
                              {formatDuration(item?.duration || 0)}
                            </Typography>
                          </Grid>
                        </Grid>
                      </ListItem>
                      {index < tracks.length - 1 && <Divider component="li" />}
                    </React.Fragment>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </DragDropContext>
    </Paper>
  );
};

export default TrackList;
