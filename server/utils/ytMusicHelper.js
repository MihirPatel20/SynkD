import axios from "axios";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This is a helper function to interact with a Python script that uses ytmusicapi
// You'll need to create a Python script that uses ytmusicapi and exposes endpoints
export const getYTMusicHistory = async (cookies) => {
  return new Promise((resolve, reject) => {
    // Path to Python script
    const scriptPath = path.join(__dirname, "../scripts/get_history.py");

    // Create a temporary file to store the cookies
    const tempCookiesPath = path.join(__dirname, "../temp/cookies.json");

    // Ensure temp directory exists
    if (!fs.existsSync(path.join(__dirname, "../temp"))) {
      fs.mkdirSync(path.join(__dirname, "../temp"));
    }

    // Write cookies to temp file
    fs.writeFileSync(tempCookiesPath, JSON.stringify(cookies));

    // Spawn Python process
    const pythonProcess = spawn("python", [scriptPath, tempCookiesPath]);

    let dataString = "";

    // Collect data from script
    pythonProcess.stdout.on("data", (data) => {
      dataString += data.toString();
    });

    // Handle errors
    pythonProcess.stderr.on("data", (data) => {
      console.error(`Python Error: ${data}`);
      reject(`Error: ${data}`);
    });

    // Process complete
    pythonProcess.on("close", (code) => {
      // Clean up temp file
      fs.unlinkSync(tempCookiesPath);

      if (code !== 0) {
        reject(`Process exited with code ${code}`);
        return;
      }

      try {
        const result = JSON.parse(dataString);
        resolve(result);
      } catch (error) {
        reject(`Error parsing result: ${error.message}`);
      }
    });
  });
};

// Function to extract cookies from request headers
export const extractCookiesFromHeaders = (headers) => {
  const cookieHeader = headers.cookie;
  if (!cookieHeader) return {};

  return cookieHeader.split(";").reduce((cookies, cookie) => {
    const [name, value] = cookie.trim().split("=");
    cookies[name] = value;
    return cookies;
  }, {});
};

// Function to create a smart shuffle based on play counts
export const createSmartShuffle = (tracks, playHistory) => {
  // Create a map of videoId to play count
  const playCountMap = playHistory.reduce((map, item) => {
    map[item.videoId] = item.playCount || 0;
    return map;
  }, {});

  // Add play count to each track, default to 0 if not found
  const tracksWithPlayCount = tracks.map((track) => ({
    ...track,
    playCount: playCountMap[track.videoId] || 0,
  }));

  // Sort by play count (ascending) to prioritize least played songs
  const sortedTracks = [...tracksWithPlayCount].sort(
    (a, b) => a.playCount - b.playCount
  );

  // Add some randomness while still favoring least played songs
  // This divides the playlist into tiers based on play count
  const tieredShuffle = () => {
    // Group tracks by play count
    const tracksByPlayCount = sortedTracks.reduce((groups, track) => {
      const count = track.playCount;
      if (!groups[count]) groups[count] = [];
      groups[count].push(track);
      return groups;
    }, {});

    // Get unique play counts and sort them
    const playCounts = Object.keys(tracksByPlayCount)
      .map(Number)
      .sort((a, b) => a - b);

    // Create a shuffled playlist that prioritizes lower play counts
    const shuffled = [];

    // Shuffle each tier
    playCounts.forEach((count) => {
      const tier = tracksByPlayCount[count];
      // Fisher-Yates shuffle algorithm
      for (let i = tier.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tier[i], tier[j]] = [tier[j], tier[i]];
      }
      shuffled.push(...tier);
    });

    return shuffled;
  };

  return tieredShuffle();
};
