import mongoose from "mongoose";

const criterionSchema = new mongoose.Schema({
  label: { type: String, required: true, trim: true },
  weight: { type: Number, required: true, min: 0 },
  category: { type: String, trim: true, default: "General" },
});

const scorecardSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: "" },
    team: { type: String, trim: true, default: "" },
    active: { type: Boolean, default: true },
    criteria: [criterionSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Scorecard", scorecardSchema);
