// middleware/ytmusicMiddleware.js

import User from "../models/User.js";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Middleware to handle YTMusic API authentication and execution
 * @param {string} functionName - The YTMusic function to call
 * @returns {Function} Express middleware
 * 
 * 
 * @examples
 * 
 * // In your route file ----
 * 
    import { ytmusicHandler } from "../middleware/ytmusicMiddleware.js";
    router.get('/', protect, ytmusicHandler('get_library_playlists'), getPlaylists);
 * 
 * // In your controller file ----
 * 
    export const getPlaylists = (req, res) => {
        res.json({
            message: "Playlists fetched successfully",
            playlists: req.ytmusicResult
        });
    };
 * 
 */
export const ytmusicHandler = (functionName) => {
  return async (req, res, next) => {
    try {
      // Fetch the user from the database
      const user = await User.findById(req.user.id);
      if (!user || !user.accessToken || !user.refreshToken) {
        return res
          .status(400)
          .json({ error: "User not authenticated or tokens missing" });
      }

      // Get additional arguments from request params or body
      const additionalArgs = req.params.id ? [req.params.id] : [];

      // Define the path to the Python script
      const pythonScriptPath = path.join(
        __dirname,
        "../scripts/ytmusicapi_scripts.py"
      );

      // Spawn a Python process to execute the script
      const pythonProcess = spawn("python", [
        pythonScriptPath,
        user.accessToken,
        user.refreshToken,
        functionName,
        ...additionalArgs,
      ]);

      let pythonOutput = "";
      let pythonError = "";

      // Collect data from the Python script's stdout
      pythonProcess.stdout.on("data", (data) => {
        pythonOutput += data.toString();
      });

      // Handle errors from the Python script
      pythonProcess.stderr.on("data", (data) => {
        pythonError += data.toString();
      });

      // Process the output once the Python script finishes execution
      pythonProcess.on("close", (code) => {
        if (code === 0) {
          try {
            const result = JSON.parse(pythonOutput.trim());

            if (result.success) {
              // Attach the result to the request object for use in the controller
              req.ytmusicResult = result.data;
              next();
            } else {
              res.status(500).json({ error: result.error });
            }
          } catch (parseError) {
            console.error(
              "Error parsing Python script output:",
              parseError.message
            );
            res
              .status(500)
              .json({ error: "Failed to parse data from YTMusic API" });
          }
        } else {
          res
            .status(500)
            .json({ error: `Python script execution failed: ${pythonError}` });
        }
      });

      // Handle errors during child process execution
      pythonProcess.on("error", (error) => {
        console.error("Error executing Python script:", error.message);
        res.status(500).json({ error: "Failed to execute Python script" });
      });
    } catch (error) {
      console.error("Error in YTMusic middleware:", error.message);
      res.status(500).json({
        error: "An unexpected error occurred in YTMusic middleware",
      });
    }
  };
};


/**
 * show usage
 * 
 */
