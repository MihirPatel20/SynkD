import React, { useState } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  TextField,
  Paper,
  Divider,
  Chip,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Modal,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import ApiIcon from "@mui/icons-material/Api";
import CodeIcon from "@mui/icons-material/Code";
import api from "../../api";

const endpoints = {
  auth: [
    {
      method: "POST",
      path: "/auth/google/callback",
      description: "Handle Google OAuth callback",
    },
    {
      method: "POST",
      path: "/auth/youtube/callback",
      description: "Handle YouTube OAuth callback",
    },
    { method: "GET", path: "/auth/me", description: "Get current user" },
  ],
  reports: [
    {
      method: "GET",
      path: "reports/playlist/PL2Wu6wXw0ACgVb0vI1eogO8N40zvJeTCK",
      description: "Get user's YouTube Playlist Reports",
    },
    {
      method: "GET",
      path: "reports/status/fca7e0db-96da-4207-b925-cb236470cdd7",
      description: "Get report job status",
    },
    {
      method: "GET",
      path: "reports/download/fca7e0db-96da-4207-b925-cb236470cdd7/:reportId",
      description: "Download report",
    },
  ],
  playlists: [
    { method: "GET", path: "/playlists", description: "Get playlists" },
    {
      method: "GET",
      path: "/playlists/:id",
      description: "Get playlist details with tracks",
    },
    {
      method: "POST",
      path: "/playlists",
      description: "Create a new playlist",
      body: JSON.stringify({
        title: "Test 2",
        description: "A playlist created via API",
        privacy_status: "PRIVATE",
        videoIds: ["hHZqggIcTDU", "NWCG3MUDc0A", "D8X6XhKtUL0", "hUtBXoUzgaM"],
      }),
    },
    {
      method: "POST",
      path: "/playlists/shuffle",
      description: "Create a new playlist with shuffled tracks",
      body: JSON.stringify({
        title: "Shuffled Playlist",
        description: "A playlist created via API",
        privacy_status: "PRIVATE",
        playlistId: "PL2Wu6wXw0ACgVb0vI1eogO8N40zvJeTCK",
      }),
    },
  ],
  library: [
    {
      method: "GET",
      path: "/library",
      description: "Get user's YouTube library",
    },
  ],
  history: [
    {
      method: "GET",
      path: "/history",
      description: "Get user's play history",
    },
    {
      method: "POST",
      path: "/history/sync",
      description: "Sync play history from YouTube Music",
    },
    {
      method: "PUT",
      path: "/history/:videoId",
      description: "Update play count for a song",
    },
  ],
};

const TestPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [endpoint, setEndpoint] = useState("/playlists");
  const [method, setMethod] = useState("GET");
  const [body, setBody] = useState("");
  const [showEndpoints, setShowEndpoints] = useState(false);

  const handleTestApiClick = async () => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      let response;
      switch (method) {
        case "GET":
          response = await api.get(endpoint);
          break;
        case "POST":
          response = await api.post(endpoint, body);
          break;
        case "PUT":
          response = await api.put(endpoint, JSON.parse(body));
          break;
        case "DELETE":
          response = await api.delete(endpoint);
          break;
        default:
          throw new Error("Unsupported method");
      }
      setData(response.data);
    } catch (error) {
      console.error("Error testing API:", error);
      setError(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEndpointClick = (path, method, body) => {
    setEndpoint(path);
    setMethod(method);
    setBody(body);
    setShowEndpoints(false);
  };

  return (
    <Container maxWidth="xl">
      <Box elevation={1} sx={{ p: 4 }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Typography variant="h4">API Test Console</Typography>
          <Box>
            <Chip
              label="API Documentation"
              color="primary"
              component="a"
              href="#"
              clickable
            />
            <Chip
              label="Endpoints List"
              color="secondary"
              onClick={() => setShowEndpoints(true)}
              clickable
              sx={{ ml: 1 }}
            />
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel id="method-select-label">Method</InputLabel>
              <Select
                labelId="method-select-label"
                value={method}
                label="Method"
                onChange={(e) => setMethod(e.target.value)}
              >
                <MenuItem value="GET">GET</MenuItem>
                <MenuItem value="POST">POST</MenuItem>
                <MenuItem value="PUT">PUT</MenuItem>
                <MenuItem value="DELETE">DELETE</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={7}>
            <TextField
              label="API Endpoint"
              variant="outlined"
              fullWidth
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              InputProps={{
                startAdornment: <CodeIcon color="action" sx={{ mr: 1 }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ height: "100%" }}
              startIcon={
                loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <ApiIcon />
                )
              }
              onClick={handleTestApiClick}
              disabled={loading}
            >
              {loading ? "Testing..." : "Test API"}
            </Button>
          </Grid>
          {(method === "POST" || method === "PUT") && (
            <Grid item xs={12}>
              <TextField
                label="Request Body (JSON)"
                variant="outlined"
                fullWidth
                multiline
                minRows={4} // Minimum height
                maxRows={15} // Adjust as needed
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
            </Grid>
          )}
        </Grid>

        {error && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {error}
          </Alert>
        )}

        {data && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              API Response
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, backgroundColor: "#f5f5f5" }}>
              <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                {JSON.stringify(data, null, 2)}
              </pre>
            </Paper>
          </Box>
        )}
      </Box>

      <Modal
        open={showEndpoints}
        onClose={() => setShowEndpoints(false)}
        aria-labelledby="endpoints-modal-title"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <Typography
            id="endpoints-modal-title"
            variant="h6"
            component="h2"
            gutterBottom
          >
            Available Endpoints
          </Typography>
          {Object.entries(endpoints).map(([category, endpointList]) => (
            <List
              key={category}
              subheader={
                <ListSubheader component="div" id={`${category}-subheader`}>
                  {category.toUpperCase()}
                </ListSubheader>
              }
            >
              {endpointList.map((ep, index) => (
                <ListItem
                  key={index}
                  button
                  onClick={() =>
                    handleEndpointClick(ep.path, ep.method, ep.body)
                  }
                  sx={{ cursor: "pointer" }}
                >
                  <ListItemText
                    primary={`${ep.method} ${ep.path}`}
                    secondary={ep.description}
                  />
                </ListItem>
              ))}
            </List>
          ))}
        </Box>
      </Modal>
    </Container>
  );
};

export default TestPage;
