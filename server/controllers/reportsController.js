import { google } from "googleapis";
import User from "../models/User.js";
import express from "express";
import axios from "axios";

/**
 * Controller to fetch detailed bulk playlist analytics reports
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getPlaylistReports = async (req, res) => {
  try {
    // Get playlist ID from request parameters or query
    const playlistId = req.params.playlistId || req.query.playlistId;

    if (!playlistId) {
      return res.status(400).json({ error: "Playlist ID is required" });
    }

    // Find user and get access token
    const user = await User.findById(req.user.id);
    const accessToken = user.accessToken;

    if (!accessToken) {
      return res
        .status(401)
        .json({ error: "User not authenticated with YouTube" });
    }

    // Create OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    // Set credentials
    oauth2Client.setCredentials({ access_token: accessToken });

    // Initialize YouTube Reporting API
    const youtubeReporting = google.youtubereporting({
      version: "v1",
      auth: oauth2Client,
    });

    // Get available report types
    const reportTypes = await youtubeReporting.reportTypes.list();

    // Find the playlist report type
    const playlistReportType = reportTypes.data.reportTypes.find((type) =>
      type.name.toLowerCase().includes("playlist")
    );

    if (!playlistReportType) {
      // Fallback to YouTube Analytics API if no reporting job exists
      return getPlaylistAnalyticsReport(req, res, playlistId, oauth2Client);
    }

    // Check for existing reporting jobs
    const jobs = await youtubeReporting.jobs.list();
    let playlistJob = jobs.data.jobs?.find(
      (job) => job.reportTypeId === playlistReportType.id
    );

    // Create a new job if one doesn't exist
    if (!playlistJob) {
      const createJobResponse = await youtubeReporting.jobs.create({
        requestBody: {
          reportTypeId: playlistReportType.id,
          name: "Playlist Performance Report",
        },
      });
      playlistJob = createJobResponse.data;
    }

    // Get reports for this job
    const reports = await youtubeReporting.jobs.reports.list({
      jobId: playlistJob.id,
    });

    if (!reports.data.reports || reports.data.reports.length === 0) {
      return res.status(202).json({
        success: true,
        message:
          "Report job created. Reports will be available within 24-48 hours.",
        jobId: playlistJob.id,
      });
    }

    // Get the most recent report
    const latestReport = reports.data.reports[0];

    // Download the report
    const reportData = await downloadReport(
      latestReport.downloadUrl,
      accessToken
    );

    // Filter the report data for the specific playlist
    const playlistData = filterReportForPlaylist(reportData, playlistId);

    return res.status(200).json({
      success: true,
      data: playlistData,
      reportCreationTime: latestReport.createTime,
      startTime: latestReport.startTime,
      endTime: latestReport.endTime,
    });
  } catch (error) {
    console.error("Error fetching playlist reports:", error);

    // Fallback to YouTube Analytics API if Reporting API fails
    if (req.query.fallback !== "false") {
      try {
        return await getPlaylistAnalyticsReport(
          req,
          res,
          req.params.playlistId || req.query.playlistId
        );
      } catch (fallbackError) {
        console.error("Fallback also failed:", fallbackError);
      }
    }

    return res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch playlist reports",
    });
  }
};

/**
 * Check if a reporting job is complete and reports are available
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const checkReportStatus = async (req, res) => {
  try {
    // Get job ID from request parameters
    const jobId = req.params.jobId || req.query.jobId;

    if (!jobId) {
      return res.status(400).json({ error: "Job ID is required" });
    }

    // Find user and get access token
    const user = await User.findById(req.user.id);
    const accessToken = user.accessToken;

    if (!accessToken) {
      return res
        .status(401)
        .json({ error: "User not authenticated with YouTube" });
    }

    // Create OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    // Set credentials
    oauth2Client.setCredentials({ access_token: accessToken });

    // Initialize YouTube Reporting API
    const youtubeReporting = google.youtubereporting({
      version: "v1",
      auth: oauth2Client,
    });

    // Get reports for this job
    const reports = await youtubeReporting.jobs.reports.list({
      jobId: jobId,
    });

    if (!reports.data.reports || reports.data.reports.length === 0) {
      return res.status(202).json({
        success: true,
        status: "pending",
        message: "Reports are still being generated. Check back later.",
        jobId: jobId,
      });
    }

    // Reports are available
    const availableReports = reports.data.reports.map((report) => ({
      id: report.id,
      createTime: report.createTime,
      startTime: report.startTime,
      endTime: report.endTime,
      downloadUrl: report.downloadUrl,
    }));

    return res.status(200).json({
      success: true,
      status: "complete",
      message: "Reports are available for download",
      jobId: jobId,
      reports: availableReports,
    });
  } catch (error) {
    console.error("Error checking report status:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to check report status",
    });
  }
};

/**
 * Download a specific report by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const downloadReportById = async (req, res) => {
  try {
    const { jobId, reportId } = req.params;

    if (!jobId || !reportId) {
      return res.status(400).json({
        error: "Both Job ID and Report ID are required",
      });
    }

    // Find user and get access token
    const user = await User.findById(req.user.id);
    const accessToken = user.accessToken;

    if (!accessToken) {
      return res.status(401).json({
        error: "User not authenticated with YouTube",
      });
    }

    // Create OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    // Set credentials
    oauth2Client.setCredentials({ access_token: accessToken });

    // Initialize YouTube Reporting API
    const youtubeReporting = google.youtubereporting({
      version: "v1",
      auth: oauth2Client,
    });

    // Get the specific report to get its download URL
    const reportResponse = await youtubeReporting.jobs.reports.get({
      jobId: jobId,
      reportId: reportId,
    });

    if (!reportResponse.data || !reportResponse.data.downloadUrl) {
      return res.status(404).json({
        success: false,
        error: "Report download URL not found",
      });
    }

    // Download the report
    const response = await axios.get(reportResponse.data.downloadUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      responseType: "text",
    });

    // Parse CSV data
    const results = parseCSVData(response.data);

    return res.status(200).json({
      success: true,
      reportId: reportId,
      createTime: reportResponse.data.createTime,
      startTime: reportResponse.data.startTime,
      endTime: reportResponse.data.endTime,
      data: results,
    });
  } catch (error) {
    console.error("Error downloading report:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to download report",
    });
  }
};

/**
 * Download report from URL
 * @param {string} url - Report download URL
 * @param {string} accessToken - OAuth access token
 * @returns {Promise<Object>} Parsed report data
 */
const downloadReport = async (url, accessToken) => {
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    responseType: "text",
  });

  return parseCSVData(response.data);
};

/**
 * Parse CSV data into array of objects
 * @param {string} csvData - Raw CSV data
 * @returns {Array} Parsed data as array of objects
 */
const parseCSVData = (csvData) => {
  const lines = csvData.split("\n");
  const headers = lines[0].split(",");

  const results = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i]) continue;

    const obj = {};
    const currentLine = lines[i].split(",");

    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentLine[j];
    }

    results.push(obj);
  }

  return results;
};

/**
 * Filter report data for a specific playlist
 * @param {Array} reportData - Full report data
 * @param {string} playlistId - Playlist ID to filter for
 * @returns {Array} Filtered report data
 */
const filterReportForPlaylist = (reportData, playlistId) => {
  return reportData.filter((row) => {
    // The exact field name may vary based on the report structure
    return row.playlist_id === playlistId || row.playlist === playlistId;
  });
};

/**
 * Fallback to YouTube Analytics API
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {string} playlistId - Playlist ID
 * @param {Object} oauth2Client - OAuth client (optional)
 */
const getPlaylistAnalyticsReport = async (
  req,
  res,
  playlistId,
  existingOauth2Client = null
) => {
  try {
    // Get date range from query parameters or use defaults
    const startDate = req.query.startDate || "2023-01-01";
    const endDate = req.query.endDate || new Date().toISOString().split("T")[0];

    // Find user and get access token if not already provided
    let oauth2Client = existingOauth2Client;
    if (!oauth2Client) {
      const user = await User.findById(req.user.id);
      const accessToken = user.accessToken;

      if (!accessToken) {
        return res
          .status(401)
          .json({ error: "User not authenticated with YouTube" });
      }

      // Create OAuth2 client
      oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
      );

      // Set credentials
      oauth2Client.setCredentials({ access_token: accessToken });
    }

    // Initialize YouTube Analytics API
    const youtubeAnalytics = google.youtubeAnalytics({
      version: "v2",
      auth: oauth2Client,
    });

    // Make API request to get detailed playlist analytics
    const response = await youtubeAnalytics.reports.query({
      ids: "channel==MINE",
      startDate,
      endDate,
      dimensions: "video,day",
      metrics:
        "views,estimatedMinutesWatched,playlistStarts,playlistViews,viewsPerPlaylistStart,averageViewDuration",
      filters: `playlist==${playlistId}`,
      sort: "day,video",
    });

    // Get video details to enhance the report
    const youtube = google.youtube({
      version: "v3",
      auth: oauth2Client,
    });

    // Extract video IDs from the analytics response
    const videoIds = [];
    if (response.data.rows) {
      response.data.rows.forEach((row) => {
        const videoId = row[0]; // Assuming video ID is the first dimension
        if (!videoIds.includes(videoId)) {
          videoIds.push(videoId);
        }
      });
    }

    // Get video details if there are any videos
    let videoDetails = {};
    if (videoIds.length > 0) {
      // Split into chunks of 50 (API limit)
      for (let i = 0; i < videoIds.length; i += 50) {
        const chunk = videoIds.slice(i, i + 50);
        const videosResponse = await youtube.videos.list({
          part: "snippet,contentDetails",
          id: chunk.join(","),
        });

        videosResponse.data.items.forEach((video) => {
          videoDetails[video.id] = {
            title: video.snippet.title,
            thumbnailUrl: video.snippet.thumbnails.default.url,
            duration: video.contentDetails.duration,
            publishedAt: video.snippet.publishedAt,
          };
        });
      }
    }

    // Enhance the analytics data with video details
    const enhancedData = {
      ...response.data,
      videoDetails,
    };

    return res.status(200).json({
      success: true,
      data: enhancedData,
      note: "Using YouTube Analytics API as fallback. For complete bulk data, check back in 24-48 hours.",
    });
  } catch (error) {
    console.error("Error in fallback analytics:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch analytics data",
    });
  }
};

export {
  getPlaylistReports,
  getPlaylistAnalyticsReport,
  checkReportStatus,
  downloadReportById,
};
