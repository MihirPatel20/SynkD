import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";

const ShufflePlaylistModal = ({ open, onClose, onSubmit, defaultTitle }) => {
  const [form, setForm] = useState({
    title: `${defaultTitle} - Shuffled`,
    description: "",
    privacy_status: "PRIVATE",
    prioritizeUnplayed: true,
    skipRecentlyPlayedSongs: false,
    pushRecentlyPlayedToEnd: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitch = (e) => {
    const { name, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: checked }));
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await onSubmit(form); // make sure `onSubmit` returns a Promise
      onClose();
    } catch (err) {
      console.error(err);
      // show some error UI (Snackbar maybe)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Shuffle This Playlist</DialogTitle>
      <DialogContent dividers>
        <TextField
          fullWidth
          margin="normal"
          name="title"
          label="Title"
          value={form.title}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          name="description"
          label="Description"
          value={form.description}
          onChange={handleChange}
          multiline
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Privacy</InputLabel>
          <Select
            name="privacy_status"
            value={form.privacy_status}
            onChange={handleChange}
            label="Privacy"
          >
            <MenuItem value="PUBLIC">Public</MenuItem>
            <MenuItem value="PRIVATE">Private</MenuItem>
            <MenuItem value="UNLISTED">Unlisted</MenuItem>
          </Select>
        </FormControl>
        <Box display="flex" flexDirection="column" gap={2} mt={2}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography variant="subtitle1">
                Start With Unplayed Songs
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Prioritize songs you've never played before
              </Typography>
            </Box>
            <Switch
              checked={form.prioritizeUnplayed}
              onChange={handleSwitch}
              name="prioritizeUnplayed"
            />
          </Paper>

          <Paper
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography variant="subtitle1">Skip Recently Played Songs</Typography>
              <Typography variant="body2" color="text.secondary">
                Avoid tracks you just listened to
              </Typography>
            </Box>
            <Switch
              checked={form.skipRecentlyPlayedSongs}
              onChange={handleSwitch}
              name="skipRecentlyPlayedSongs"
            />
          </Paper>

          <Paper
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              opacity: form.skipRecentlyPlayedSongs ? 0.4 : 1,
              pointerEvents: form.skipRecentlyPlayedSongs ? "none" : "auto",
            }}
          >
            <Box>
              <Typography variant="subtitle1">
                Move Recently Played Songs to End
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Shuffle but move heard songs to the bottom
              </Typography>
            </Box>
            <Switch
              checked={form.pushRecentlyPlayedToEnd}
              onChange={handleSwitch}
              name="pushRecentlyPlayedToEnd"
              disabled={form.skipRecentlyPlayedSongs}
            />
          </Paper>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : null}
        >
          {isLoading ? "Shuffling..." : "Shuffle & Create Playlist"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShufflePlaylistModal;
