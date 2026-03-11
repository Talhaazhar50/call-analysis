import mongoose from "mongoose";

const criterionResultSchema = new mongoose.Schema({
  label: { type: String, required: true },
  category: { type: String, default: "General" },
  score: { type: Number, required: true },
  max: { type: Number, required: true },
  feedback: { type: String, default: "" },
});

const transcriptLineSchema = new mongoose.Schema({
  speaker: { type: String, default: "Speaker" },
  time: { type: String, default: "0:00" },
  text: { type: String, required: true },
});

const callSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    scorecard: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Scorecard",
      required: true,
    },
    scorecardName: { type: String, required: true },
    fileName: { type: String, required: true },
    filePath: { type: String, required: true },
    duration: { type: String, default: "" },
    status: {
      type: String,
      enum: ["uploading", "transcribing", "scoring", "done", "failed"],
      default: "uploading",
    },
    errorMessage: { type: String, default: "" },
    transcript: [transcriptLineSchema],
    transcriptRaw: { type: String, default: "" },
    criteriaResults: [criterionResultSchema],
    totalScore: { type: Number, default: 0 },
    maxScore: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
    pass: { type: Boolean, default: false },
    passThreshold: { type: Number, default: 70 },
    overallFeedback: { type: String, default: "" },
    notes: { type: String, default: "" },
    coached: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.model("Call", callSchema);
