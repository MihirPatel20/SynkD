import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Paper,
  Typography,
  CircularProgress,
  Divider,
} from "@mui/material";

const ShufflePlaylistModal = ({ open, onClose, onSubmit, defaultTitle }) => {
  const [form, setForm] = useState({
    title: `${defaultTitle} - Shuffled`,
    description: "",
    privacy_status: "PRIVATE",
    recentlyPlayedBehavior: "move_to_end", // default value
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await onSubmit(form);
      onClose();
    } catch (err) {
      console.error(err);
      // show some error UI
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Shuffle This Playlist</DialogTitle>
      <DialogContent dividers>
        <Typography variant="subtitle1">Playlist Details</Typography>

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

        <Box mt={2}>
          <Typography variant="subtitle1" mb={2}>
            Recently Played Songs
          </Typography>
          <FormControl fullWidth>
            <InputLabel>Choose Action</InputLabel>
            <Select
              name="recentlyPlayedBehavior"
              value={form.recentlyPlayedBehavior}
              onChange={handleChange}
              label="Choose Action"
            >
              <MenuItem value="include">Shuffle All Songs</MenuItem>
              <MenuItem value="skip">Skip Recently Played</MenuItem>
              <MenuItem value="move_to_end">
                Push Recently Played to Bottom
              </MenuItem>
            </Select>
          </FormControl>
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
