import express from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import { adminOnly, protect } from "../middleware/auth.middleware.js";

import {
  uploadCall,
  getCallStatus,
  getCalls,
  getCall,
  toggleCoached,
  deleteCall,
  getAllCalls,
} from "../controllers/call.controller.js";

const router = express.Router();

const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (/\.(mp3|wav|m4a|ogg|flac|webm|mpeg)$/i.test(path.extname(file.originalname)))
    cb(null, true);
  else
    cb(new Error("Only audio files allowed (mp3, wav, m4a, ogg, flac, webm)"));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 },
});

router.use(protect);
router.get("/admin/all", adminOnly, getAllCalls);
router.post("/upload", upload.single("audio"), uploadCall);
router.get("/", getCalls);
router.get("/:id", getCall);
router.get("/:id/status", getCallStatus);
router.patch("/:id/coached", toggleCoached);
router.delete("/:id", deleteCall);

export default router;
