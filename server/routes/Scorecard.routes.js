import express from "express";
import { adminOnly, protect } from "../middleware/auth.middleware.js";

import {
  getScorecards,
  getScorecard,
  createScorecard,
  updateScorecard,
  toggleScorecard,
  deleteScorecard,
} from "../controllers/Scorecard.controller.js";

const router = express.Router();

// All routes require login
router.use(protect);

router.get("/", getScorecards);
router.get("/:id", getScorecard);

// Write operations — admin only
router.post("/", adminOnly, createScorecard);
router.put("/:id", adminOnly, updateScorecard);
router.patch("/:id/toggle", adminOnly, toggleScorecard);
router.delete("/:id", adminOnly, deleteScorecard);

export default router;
