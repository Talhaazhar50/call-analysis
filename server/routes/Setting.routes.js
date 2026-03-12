import express from "express";
import { getSettings, updateSettings, testWebhook } from "../controllers/Settings.controller.js";
import { protect, adminOnly } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protect, adminOnly, getSettings);
router.patch("/", protect, adminOnly, updateSettings);
router.post("/test-webhook", protect, adminOnly, testWebhook);

export default router;