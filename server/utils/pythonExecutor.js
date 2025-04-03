// utils/pythonExecutor.js

import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import User from "../models/User.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Authenticates user and executes the YouTube Music Python script
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {string} functionName - YTMusic function to call
 * @param {Array} additionalArgs - Additional arguments to pass to the Python script
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} - Result from the Python script or sends response directly
 */
export const executeYTMusicFunction = async (
  req,
  res,
  functionName,
  additionalArgs = [],
  options = {}
) => {
  try {

    const clientId = process.env.GOOGLE_TV_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_TV_CLIENT_SECRET;
  
    if (!clientId || !clientSecret) {
      return res.status(500).json({ error: "Missing API credentials" });
    }

    // Fetch the user from the database
    const user = await User.findById(req.user.id);
    if (!user || !user.accessToken || !user.refreshToken) {
      res
        .status(400)
        .json({ error: "User not authenticated or tokens missing" });
      return null;
    }

    // Execute the Python script with authentication tokens
    const result = await executePythonScript(
      "ytmusicapi_scripts.py", // Default script for all YTMusic operations
      [clientId, clientSecret, user.accessToken, user.refreshToken, functionName, ...additionalArgs],
      options
    );

    return result;
  } catch (error) {
    console.error(`Error executing YTMusic function: ${error.message}`);
    if (!res.headersSent) {
      res.status(500).json({
        error: `An unexpected error occurred: ${error.message}`,
      });
    }
    return null;
  }
};

/**
 * Executes a Python script with the provided arguments and returns the result
 *
 * @param {string} scriptName - Name of the Python script file (without path)
 * @param {Array} args - Arguments to pass to the Python script
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} - Result from the Python script
 */
export const executePythonScript = (scriptName, args = [], options = {}) => {
  return new Promise((resolve, reject) => {
    const scriptDir = options.scriptDir || "../scripts";
    const timeout = options.timeout || 30000;

    // Define the path to the Python script
    const pythonScriptPath = path.join(__dirname, scriptDir, scriptName);

    // Spawn a Python process to execute the script
    const pythonProcess = spawn("python", [pythonScriptPath, ...args]);

    let pythonOutput = "";
    let pythonError = "";
    let timeoutId = null;

    // Set timeout
    if (timeout > 0) {
      timeoutId = setTimeout(() => {
        pythonProcess.kill();
        reject(
          new Error(`Python script execution timed out after ${timeout}ms`)
        );
      }, timeout);
    }

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
      if (timeoutId) clearTimeout(timeoutId);

      if (code === 0) {
        try {
          const result = JSON.parse(pythonOutput.trim());
          resolve(result);
        } catch (parseError) {
          reject(
            new Error(`Failed to parse Python output: ${parseError.message}`)
          );
        }
      } else {
        reject(
          new Error(`Python script exited with code ${code}: ${pythonError}`)
        );
      }
    });

    // Handle errors during child process execution
    pythonProcess.on("error", (error) => {
      if (timeoutId) clearTimeout(timeoutId);
      reject(new Error(`Failed to execute Python script: ${error.message}`));
    });
  });
};
