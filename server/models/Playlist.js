import mongoose from "mongoose";

const PlaylistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  youtubePlaylistId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  thumbnail: {
    type: String,
  },
  itemCount: {
    type: Number,
    default: 0,
  },
  channelId: {
    type: String,
  },
  channelTitle: {
    type: String,
  },
  lastSynced: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Playlist = mongoose.model("Playlist", PlaylistSchema);
export default Playlist;
