import Call from "../models/Call.model.js";
import Scorecard from "../models/Scorecard.model.js";
import ffprobe from "ffprobe-static";
import fs from "fs";
import { execSync } from "child_process";
import { scoreTranscript } from "../services/scoring.service.js";
import { transcribeAudio } from "../services/transcription.service.js";

const getAudioDuration = (filePath) => {
  try {
    const output = execSync(
      `"${ffprobe.path}" -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`,
    )
      .toString()
      .trim();
    const secs = parseFloat(output);
    if (isNaN(secs)) return "";
    const m = Math.floor(secs / 60);
    const s = Math.round(secs % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  } catch {
    return "";
  }
};

// POST /api/calls/upload
export const uploadCall = async (req, res) => {
  const { scorecardId, notes, passThreshold } = req.body;
  if (!req.file)
    return res.status(400).json({ message: "No audio file provided" });
  if (!scorecardId)
    return res.status(400).json({ message: "Scorecard is required" });

  const scorecard = await Scorecard.findById(scorecardId);
  if (!scorecard)
    return res.status(404).json({ message: "Scorecard not found" });

  const call = await Call.create({
    user: req.user._id,
    scorecard: scorecard._id,
    scorecardName: scorecard.name,
    fileName: req.file.originalname,
    filePath: req.file.path,
    notes: notes || "",
    passThreshold: parseInt(passThreshold) || 70,
    status: "transcribing",
  });

  res.status(202).json({ callId: call._id, message: "Processing started" });

  (async () => {
    try {
      const duration = getAudioDuration(req.file.path);
      await Call.findByIdAndUpdate(call._id, { duration });

      const { rawText, lines } = await transcribeAudio(req.file.path);
      await Call.findByIdAndUpdate(call._id, {
        transcriptRaw: rawText,
        transcript: lines,
        status: "scoring",
      });

      const {
        criteriaResults,
        overallFeedback,
        totalScore,
        maxScore,
        percentage,
      } = await scoreTranscript(rawText, scorecard.criteria);

      const threshold = parseInt(passThreshold) || 70;
      await Call.findByIdAndUpdate(call._id, {
        criteriaResults,
        overallFeedback,
        totalScore,
        maxScore,
        percentage,
        pass: percentage >= threshold,
        status: "done",
      });
    } catch (err) {
      console.error("Pipeline error:", err.message);
      await Call.findByIdAndUpdate(call._id, {
        status: "failed",
        errorMessage: err.message,
      });
    }
  })();
};

// GET /api/calls/:id/status
export const getCallStatus = async (req, res) => {
  const call = await Call.findOne({
    _id: req.params.id,
    user: req.user._id,
  }).select("status errorMessage percentage pass");
  if (!call) return res.status(404).json({ message: "Call not found" });
  res.json(call);
};

// GET /api/calls
export const getCalls = async (req, res) => {
  const calls = await Call.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .select("-transcript -transcriptRaw -criteriaResults");
  res.json(calls);
};

// GET /api/calls/:id
export const getCall = async (req, res) => {
  const call = await Call.findOne({ _id: req.params.id, user: req.user._id });
  if (!call) return res.status(404).json({ message: "Call not found" });
  res.json(call);
};

// PATCH /api/calls/:id/coached
export const toggleCoached = async (req, res) => {
  const call = await Call.findOne({ _id: req.params.id, user: req.user._id });
  if (!call) return res.status(404).json({ message: "Call not found" });
  call.coached = !call.coached;
  await call.save();
  res.json({ coached: call.coached });
};

// DELETE /api/calls/:id
export const deleteCall = async (req, res) => {
  const call = await Call.findOne({ _id: req.params.id, user: req.user._id });
  if (!call) return res.status(404).json({ message: "Call not found" });
  try {
    fs.unlinkSync(call.filePath);
  } catch {}
  await call.deleteOne();
  res.json({ message: "Call deleted" });
};

// GET /api/calls/admin/all
export const getAllCalls = async (req, res) => {
  const calls = await Call.find()
    .sort({ createdAt: -1 })
    .select("-transcript -transcriptRaw -criteriaResults")
    .populate("user", "name email");
  res.json(calls);
};
