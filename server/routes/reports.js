import express from "express";
import auth from "../middleware/auth.js";
import {
  getPlaylistReports,
  getPlaylistAnalyticsReport,
  checkReportStatus,
  downloadReportById,
} from "../controllers/reportsController.js";
import { getPlaylistVideoAnalytics } from "../controllers/analyticsController.js";

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// Routes for playlist analytics
router.get("/playlist/:playlistId", getPlaylistVideoAnalytics);

// Route to check if reports are available
router.get("/status/:jobId", checkReportStatus);

// Route to download a specific report
router.get("/download/:jobId/:reportId", downloadReportById);

export default router;
