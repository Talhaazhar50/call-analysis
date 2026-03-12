import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    // singleton — we always use orgId: "default"
    orgId: { type: String, default: "default", unique: true },

    // Notifications
    emailOnScore: { type: Boolean, default: true },
    emailOnFail: { type: Boolean, default: true },
    emailOnUpload: { type: Boolean, default: false },
    agentNotify: { type: Boolean, default: false },
    weeklyDigest: { type: Boolean, default: false },
    adminEmail: { type: String, default: "" },

    // Webhook / Integrations
    webhookEnabled: { type: Boolean, default: false },
    webhookUrl: { type: String, default: "" },

    // Scoring
    passThreshold: { type: Number, default: 70 },
    autoAnalyze: { type: Boolean, default: true },
    aiModel: { type: String, default: "groq" },
    scoreRounding: { type: String, default: "whole" },

    // General
    platformName: { type: String, default: "CallAnalytics" },
    companyName: { type: String, default: "" },
    timezone: { type: String, default: "UTC" },
    dateFormat: { type: String, default: "MM/DD/YYYY" },
  },
  { timestamps: true }
);

export default mongoose.model("Settings", settingsSchema);