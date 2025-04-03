import mongoose from "mongoose";

const PlayHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  videoId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
  },
  thumbnail: {
    type: String,
  },
  playCount: {
    type: Number,
    default: 1,
  },
  lastPlayed: {
    type: Date,
    default: Date.now,
  },
  playlists: [
    {
      type: String, // YouTube playlist IDs this song belongs to
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index to ensure uniqueness of user+videoId combination
PlayHistorySchema.index({ user: 1, videoId: 1 }, { unique: true });

const PlayHistory = mongoose.model("PlayHistory", PlayHistorySchema);
export default PlayHistory;
