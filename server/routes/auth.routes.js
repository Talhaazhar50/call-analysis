import express from "express";
import { getMe, sendCode, verifyCode } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/send-code", sendCode);
router.post("/verify-code", verifyCode);
router.get("/me", protect, getMe);

export default router;
