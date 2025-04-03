import React from "react";
import {
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Paper,
  Divider,
  Grid,
  useTheme,
  alpha,
  Skeleton,
} from "@mui/material";
import {
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  DragIndicator as DragIndicatorIcon,
} from "@mui/icons-material";
import { Droppable, Draggable, DragDropContext } from "@hello-pangea/dnd";

const SkeletonTrack = () => {
  return (
    <ListItem sx={{ py: 1 }}>
      <Grid container alignItems="center">
        <Grid item xs={1} sx={{ display: "flex", alignItems: "center" }}>
          <Skeleton variant="text" width={20} height={20} sx={{ mr: 1 }} />
          <Skeleton variant="text" width={20} />
        </Grid>
        <Grid item xs={10} sx={{ display: "flex", alignItems: "center" }}>
          <ListItemAvatar>
            <Skeleton variant="rectangular" width={40} height={40} />
          </ListItemAvatar>
          <ListItemText
            primary={<Skeleton variant="text" width="80%" />}
            secondary={<Skeleton variant="text" width="60%" />}
          />
        </Grid>
        <Grid item xs={1} sx={{ display: "flex", justifyContent: "center" }}>
          <Skeleton variant="text" width={30} />
        </Grid>
      </Grid>
    </ListItem>
  );
};

const TrackList = ({
  tracks,
  currentlyPlaying,
  onTogglePlay,
  onToggleSelect,
  selectedItems,
  onDragEnd,
  isLoading,
}) => {
  const theme = useTheme();

  const renderContent = () => {
    if (isLoading) {
      return (
        <List sx={{ py: 0 }}>
          {[...Array(10)].map((_, index) => (
            <React.Fragment key={index}>
              <SkeletonTrack />
              {index < 9 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
      );
    }

    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="playlist-tracks">
          {(provided) => (
            <List
              {...provided.droppableProps}
              ref={provided.innerRef}
              sx={{ py: 0 }}
            >
              {tracks.map((item, index) => (
                <Draggable
                  key={item.videoId + index}
                  draggableId={item.videoId + index}
                  index={index}
                >
                  {(provided) => (
                    <React.Fragment>
                      <ListItem
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        sx={{
                          py: 1,
                          borderRadius: 1,
                          bgcolor: selectedItems.has(item.videoId)
                            ? alpha(theme.palette.primary.main, 0.1)
                            : currentlyPlaying === item.videoId
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
                            <Typography
                              variant="body2"
                              color={
                                currentlyPlaying === item.videoId
                                  ? "primary"
                                  : "text.secondary"
                              }
                              fontWeight={
                                currentlyPlaying === item.videoId
                                  ? "bold"
                                  : "normal"
                              }
                            >
                              {index + 1}
                            </Typography>
                          </Grid>

                          <Grid
                            item
                            xs={10}
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <ListItemAvatar>
                              <Box sx={{ position: "relative" }}>
                                <Avatar
                                  variant="rounded"
                                  src={
                                    item.thumbnails[0].url ||
                                    item.thumbnails[1].url
                                  }
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
                                  onClick={() => onTogglePlay(item.videoId)}
                                >
                                  {currentlyPlaying === item.videoId ? (
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
                                  fontWeight={500}
                                  color={
                                    currentlyPlaying === item.videoId
                                      ? "primary"
                                      : "text.primary"
                                  }
                                >
                                  {item.title}
                                </Typography>
                              }
                              secondary={
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxWidth: "100%",
                                  }}
                                >
                                  {item.artists
                                    .map((artist) => artist.name)
                                    .join(" & ")}{" "}
                                  • {item?.album?.name}
                                </Typography>
                              }
                            />
                          </Grid>

                          <Grid
                            item
                            xs={1}
                            sx={{ display: "flex", justifyContent: "center" }}
                          >
                            <Typography variant="body2" color="text.secondary">
                              {item.duration}
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
    );
  };

  return (
    <Paper variant="outlined" sx={{ overflow: "hidden", mb: 10 }}>
      {renderContent()}
    </Paper>
  );
};

export default TrackList;
