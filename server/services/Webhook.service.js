/**
 * Webhook / Power BI integration service
 *
 * Power BI Streaming Dataset expects a POST with body:
 *   [ { field: value, ... } ]
 *
 * To set up in Power BI (free):
 *   1. Go to a Dashboard → Add tile → Custom Streaming Data → New dataset
 *   2. Choose "API" as the source
 *   3. Define fields matching the payload below
 *   4. Copy the "Push URL" and save it in Settings as the webhook URL
 */

export const fireWebhook = async (webhookUrl, callData, agentData) => {
  if (!webhookUrl) return;

  const payload = buildPayload(callData, agentData);

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload), // Power BI expects an array
    });

    if (!res.ok) {
      console.error(`Webhook failed: ${res.status} ${await res.text()}`);
    } else {
      console.log(`✅ Webhook fired to ${webhookUrl}`);
    }
  } catch (err) {
    // Never throw — webhook failure should never break the main pipeline
    console.error(`Webhook error: ${err.message}`);
  }
};

const buildPayload = (call, agent) => {
  const base = {
    // Core fields
    callId: String(call._id),
    date: call.createdAt
      ? new Date(call.createdAt).toISOString()
      : new Date().toISOString(),
    agentName: agent?.name || "Unknown",
    agentEmail: agent?.email || "",
    scorecard: call.scorecardName || "",
    score: call.percentage ?? 0,
    totalScore: call.totalScore ?? 0,
    maxScore: call.maxScore ?? 0,
    pass: call.pass ? "Pass" : "Fail",          // Power BI text field
    passBoolean: call.pass ?? false,             // for boolean slicers
    duration: call.duration || "",
    fileName: call.fileName || "",
    overallFeedback: call.overallFeedback || "",
  };

  // Flatten each criterion as its own numeric field
  // e.g. { criteria_Greeting: 9, criteria_Needs_Discovery: 14 }
  if (Array.isArray(call.criteriaResults)) {
    call.criteriaResults.forEach((c) => {
      const key = "criteria_" + c.label.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "");
      base[key] = c.score ?? 0;
      base[key + "_max"] = c.max ?? 0;
      base[key + "_pct"] = c.max > 0 ? Math.round((c.score / c.max) * 100) : 0;
    });
  }

  // Power BI streaming datasets expect an array
  return [base];
};

/**
 * Returns the field definitions to show in the Settings UI
 * so the admin knows what fields to create in their Power BI dataset
 */
export const getWebhookFieldDefs = () => [
  { name: "callId",         type: "Text" },
  { name: "date",           type: "DateTime" },
  { name: "agentName",      type: "Text" },
  { name: "agentEmail",     type: "Text" },
  { name: "scorecard",      type: "Text" },
  { name: "score",          type: "Number" },
  { name: "totalScore",     type: "Number" },
  { name: "maxScore",       type: "Number" },
  { name: "pass",           type: "Text" },
  { name: "passBoolean",    type: "True/False" },
  { name: "duration",       type: "Text" },
  { name: "overallFeedback",type: "Text" },
  { name: "criteria_*",     type: "Number (one per criterion)" },
];