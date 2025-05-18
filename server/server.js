import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import errorHandler from "./middleware/errorHandler.js";
import authRoutes from "./routes/auth.js";
import youtubeRoutes from "./routes/youtube.js";
import musicRoutes from "./routes/music.js";
import playlistRoutes from "./routes/playlists.js";
import reportsRoutes from "./routes/reports.js";

// Load environment variables
dotenv.config();

// Init express app
const app = express();

// Connect to DB
connectDB();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/music", musicRoutes);
app.use("/api/playlists", playlistRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/youtube", youtubeRoutes);

// Serve React frontend in production
if (process.env.NODE_ENV === "production") {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const clientBuildPath = path.join(__dirname, "../client/dist");

  app.use(express.static(clientBuildPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
}

// Error handler (after all routes)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  const url = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
  console.log(`🚀 Server running on ${url}`);
});
