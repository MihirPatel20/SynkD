import express from "express";
import auth from "../middleware/auth.js";

import { getLibrary } from "../controllers/libraryController.js";

const router = express.Router();

// @route   GET /api/library
// @desc    Get user's YouTube library
// @access  Private
router.get("/", auth, getLibrary);

export default router;
