import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Box,
  CircularProgress,
  useTheme,
  alpha,
} from "@mui/material";
import { DragDropContext } from "@hello-pangea/dnd";
import PlaylistHeader, { SearchAndFilter } from "./PlaylistHeader";
import TrackList from "./TrackList";
import PlayerControls from "./PlayerControls";
import { getPlaylistDetailsWithTracks } from "../../api/playlistApi";

const PlaylistDetail = () => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const fetchPlaylistDetails = async () => {
      try {
        const playlistDetails = await getPlaylistDetailsWithTracks(id);
        console.log("Playlist details:", playlistDetails);
        setPlaylist(playlistDetails);

        setTracks(playlistDetails.tracks);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching playlist:", error);
        setIsLoading(false);
      }
    };

    fetchPlaylistDetails();
  }, [id]);

  // Rest of your component remains the same
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedItems = Array.from(tracks);
    const [reorderedItem] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, reorderedItem);
    setTracks(reorderedItems);
  };

  const toggleItemSelection = (itemId) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const togglePlay = (itemId) => {
    if (currentlyPlaying === itemId) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentlyPlaying(itemId);
      setIsPlaying(true);
    }
  };

  const handlePlayAll = () => {
    if (tracks.length > 0) {
      setCurrentlyPlaying(tracks[0].id);
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    if (!currentlyPlaying || tracks.length === 0) return;
    const currentIndex = tracks.findIndex(
      (item) => item.id === currentlyPlaying
    );
    if (currentIndex < tracks.length - 1) {
      setCurrentlyPlaying(tracks[currentIndex + 1].id);
      setIsPlaying(true);
    }
  };

  const handlePrevious = () => {
    if (!currentlyPlaying || tracks.length === 0) return;
    const currentIndex = tracks.findIndex(
      (item) => item.id === currentlyPlaying
    );
    if (currentIndex > 0) {
      setCurrentlyPlaying(tracks[currentIndex - 1].id);
      setIsPlaying(true);
    }
  };

  const filteredItems = tracks.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // if (isLoading) {
  //   return (
  //     <Box
  //       display="flex"
  //       justifyContent="center"
  //       alignItems="center"
  //       minHeight="80vh"
  //     >
  //       <CircularProgress />
  //     </Box>
  //   );
  // }

  const currentTrack = currentlyPlaying
    ? tracks.find((item) => item.id === currentlyPlaying)
    : null;

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        bgcolor:
          theme.palette.mode === "dark"
            ? alpha(theme.palette.background.default, 0.9)
            : alpha(theme.palette.grey[50], 0.9),
        minHeight: "100vh",
        pt: 3,
        pb: 10,
      }}
    >
      <Container maxWidth="lg">
        {/* Playlist Header */}
        <PlaylistHeader
          isLoading={isLoading}
          playlist={playlist}
          onPlayAll={handlePlayAll}
          onShare={() => console.log("Share clicked")}
        />

        {/* Search and Filter */}
        <SearchAndFilter
          isLoading={isLoading}
          searchQuery={searchQuery}
          onSearchChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Track List */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <TrackList
            isLoading={isLoading}
            tracks={filteredItems}
            currentlyPlaying={currentlyPlaying}
            onTogglePlay={togglePlay}
            onToggleSelect={toggleItemSelection}
            selectedItems={selectedItems}
          />
        </DragDropContext>

        {/* Player Controls */}
        {currentTrack && (
          <PlayerControls
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onPlayPause={() => setIsPlaying(!isPlaying)}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )}
      </Container>
    </Box>
  );
};

export default PlaylistDetail;
