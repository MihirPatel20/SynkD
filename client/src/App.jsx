import React, { useState } from "react";
import { Container, Typography } from "@mui/material";
import SearchBar from "./components/SearchBar";
import VideoList from "./components/VideoList";
import MusicPlayer from "./components/MusicPlayer";
import { fetchVideos } from "./services/youtubeApi";

const App = () => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const handleSearch = async (searchTerm) => {
    const fetchedVideos = await fetchVideos(searchTerm);
    setVideos(fetchedVideos);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Music App
      </Typography>
      <SearchBar onSearch={handleSearch} />
      <VideoList videos={videos} onVideoSelect={setSelectedVideo} />
      <MusicPlayer video={selectedVideo} />
    </Container>
  );
};

export default App;
