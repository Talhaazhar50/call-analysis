import Settings from "../models/Settings.model.js";

// GET /api/settings
export const getSettings = async (req, res) => {
  let settings = await Settings.findOne({ orgId: "default" });
  if (!settings) settings = await Settings.create({ orgId: "default" });
  res.json(settings);
};

// PATCH /api/settings
export const updateSettings = async (req, res) => {
  const allowed = [
    "emailOnScore", "emailOnFail", "emailOnUpload", "agentNotify",
    "weeklyDigest", "adminEmail",
    "webhookEnabled", "webhookUrl",
    "passThreshold", "autoAnalyze", "aiModel", "scoreRounding",
    "platformName", "companyName", "timezone", "dateFormat",
  ];

  const updates = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }

  const settings = await Settings.findOneAndUpdate(
    { orgId: "default" },
    { $set: updates },
    { new: true, upsert: true }
  );

  res.json(settings);
};

// POST /api/settings/test-webhook  — sends a sample payload
export const testWebhook = async (req, res) => {
  const { webhookUrl } = req.body;
  if (!webhookUrl) return res.status(400).json({ message: "webhookUrl is required" });

  const samplePayload = [{
    callId: "test-" + Date.now(),
    date: new Date().toISOString(),
    agentName: "Test Agent",
    agentEmail: "test@example.com",
    scorecard: "Sample Scorecard",
    score: 85,
    totalScore: 85,
    maxScore: 100,
    pass: "Pass",
    passBoolean: true,
    duration: "5:30",
    fileName: "test_call.mp3",
    overallFeedback: "This is a test webhook payload from CallAnalytics.",
    criteria_Greeting: 9,
    criteria_Greeting_max: 10,
    criteria_Greeting_pct: 90,
  }];

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(samplePayload),
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(400).json({ message: `Webhook returned ${response.status}: ${text}` });
    }

    res.json({ message: "Test webhook sent successfully!" });
  } catch (err) {
    res.status(400).json({ message: `Failed to reach webhook URL: ${err.message}` });
  }
};