const BREVO_API = "https://api.brevo.com/v3/smtp/email";

const sendEmail = async (to, subject, htmlContent) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`\n📧 Email to ${to}: ${subject}\n`);
    return;
  }

  const response = await fetch(BREVO_API, {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": process.env.BREVO_API_KEY,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: { name: "CallAnalytics", email: process.env.EMAIL_FROM },
      to: [{ email: to }],
      subject,
      htmlContent,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Brevo error: ${error.message}`);
  }
};

// ── Shared layout wrapper ──────────────────────────────────────────────────
const emailLayout = (bodyHtml) => `
<div style="background:#f6f6f6; padding:40px 16px; font-family:'Segoe UI',sans-serif;">
  <div style="max-width:520px; margin:0 auto;">
    <div style="text-align:center; margin-bottom:24px;">
      <div style="display:inline-flex; align-items:center; gap:10px;">
        <div style="width:36px; height:36px; background:#16a34a; border-radius:9px; display:inline-flex; align-items:center; justify-content:center;">
          <span style="color:#fff; font-size:18px; font-weight:900;">C</span>
        </div>
        <span style="font-size:16px; font-weight:700; color:#111827; letter-spacing:-0.01em;">CallAnalytics</span>
      </div>
    </div>
    <div style="background:#fff; border-radius:20px; overflow:hidden; box-shadow:0 2px 20px rgba(0,0,0,0.06);">
      <div style="height:5px; background:linear-gradient(90deg,#16a34a,#22c55e);"></div>
      <div style="padding:36px 40px;">
        ${bodyHtml}
      </div>
      <div style="background:#f9fafb; border-top:1px solid #f3f4f6; padding:14px 40px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="font-size:12px; font-weight:700; color:#d1d5db; letter-spacing:0.06em;">CALLANALYTICS</td>
            <td style="text-align:right; font-size:12px; color:#d1d5db;">© ${new Date().getFullYear()}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</div>`;

// ── 1. OTP Email ───────────────────────────────────────────────────────────
export const sendOTPEmail = async (to, otp) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`\n🔐 OTP for ${to}: ${otp}\n`);
    return;
  }

  const digits = String(otp).split("");

  const html = emailLayout(`
    <h1 style="margin:0 0 8px; font-size:26px; font-weight:800; color:#111827; letter-spacing:-0.03em;">Your login code</h1>
    <p style="margin:0 0 32px; font-size:14px; color:#6b7280; line-height:1.6;">
      Use this one-time code to sign in to your CallAnalytics account.
    </p>
    <p style="margin:0 0 12px; font-size:11px; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; color:#9ca3af;">One-time passcode</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      <tr>
        ${digits.map(d => `
          <td style="padding:0 5px; text-align:center;">
            <div style="background:#f0fdf4; border:1.5px solid #86efac; border-radius:14px; padding:18px 0; font-size:30px; font-weight:800; color:#16a34a;">
              ${d}
            </div>
          </td>
        `).join("")}
      </tr>
    </table>
    <div style="background:#fefce8; border:1px solid #fef08a; border-radius:10px; padding:12px 16px; margin-bottom:28px;">
      <span style="font-size:13px; color:#854d0e;">
        ⏱ Expires in <strong>10 minutes</strong> — do not share this code with anyone.
      </span>
    </div>
    <p style="margin:0; font-size:13px; color:#9ca3af; line-height:1.7;">
      If you didn't request this code, you can safely ignore this email.
    </p>
  `);

  const response = await fetch(BREVO_API, {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": process.env.BREVO_API_KEY,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: { name: "CallAnalytics", email: process.env.EMAIL_FROM },
      to: [{ email: to }],
      subject: "Your CallAnalytics login code",
      htmlContent: html,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Brevo error: ${error.message}`);
  }
};

// ── 2. Call Scored — notify agent ─────────────────────────────────────────
export const sendCallScoredEmail = async (agentEmail, agentName, callData) => {
  const { scorecardName, percentage, pass, duration, fileName, criteriaResults, overallFeedback, _id } = callData;

  const passColor = pass ? "#16a34a" : "#dc2626";
  const passBg = pass ? "#f0fdf4" : "#fef2f2";
  const passBorder = pass ? "#bbf7d0" : "#fecaca";
  const passLabel = pass ? "PASSED ✓" : "NEEDS IMPROVEMENT";

  const criteriaRows = (criteriaResults || []).map(c => {
    const pct = c.max > 0 ? Math.round((c.score / c.max) * 100) : 0;
    const color = pct >= 80 ? "#16a34a" : pct >= 60 ? "#d97706" : "#dc2626";
    return `
      <tr>
        <td style="padding:10px 0; border-bottom:1px solid #f3f4f6; font-size:13px; color:#374151;">${c.label}</td>
        <td style="padding:10px 0; border-bottom:1px solid #f3f4f6; text-align:right; font-size:13px; font-weight:700; color:${color};">${c.score}/${c.max}</td>
      </tr>`;
  }).join("");

  const appUrl = process.env.CLIENT_URL || "http://localhost:5173";

  const html = emailLayout(`
    <h1 style="margin:0 0 6px; font-size:24px; font-weight:800; color:#111827; letter-spacing:-0.03em;">Your call has been scored</h1>
    <p style="margin:0 0 24px; font-size:14px; color:#6b7280;">Hi ${agentName}, here are your results for <strong>${fileName || "your recent call"}</strong>.</p>

    <div style="display:flex; gap:12px; margin-bottom:24px; flex-wrap:wrap;">
      <div style="flex:1; min-width:120px; background:${passBg}; border:1px solid ${passBorder}; border-radius:12px; padding:16px; text-align:center;">
        <div style="font-size:32px; font-weight:900; color:${passColor};">${percentage}%</div>
        <div style="font-size:11px; font-weight:700; letter-spacing:0.08em; color:${passColor}; margin-top:4px;">${passLabel}</div>
      </div>
      <div style="flex:1; min-width:120px; background:#f9fafb; border:1px solid #e5e7eb; border-radius:12px; padding:16px; text-align:center;">
        <div style="font-size:13px; color:#6b7280; margin-bottom:4px;">Scorecard</div>
        <div style="font-size:14px; font-weight:700; color:#111827;">${scorecardName}</div>
        ${duration ? `<div style="font-size:12px; color:#9ca3af; margin-top:4px;">Duration: ${duration}</div>` : ""}
      </div>
    </div>

    ${criteriaRows.length ? `
    <p style="margin:0 0 10px; font-size:12px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:#9ca3af;">Score Breakdown</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      ${criteriaRows}
    </table>` : ""}

    ${overallFeedback ? `
    <div style="background:#f9fafb; border-left:3px solid #16a34a; border-radius:0 8px 8px 0; padding:14px 16px; margin-bottom:24px;">
      <p style="margin:0; font-size:13px; color:#374151; line-height:1.65;">${overallFeedback}</p>
    </div>` : ""}

    <a href="${appUrl}/dashboard/calls/${_id}" style="display:inline-block; background:#16a34a; color:#fff; text-decoration:none; font-weight:700; font-size:14px; padding:12px 24px; border-radius:9px;">
      View Full Results →
    </a>
  `);

  await sendEmail(agentEmail, `Your call score is ready — ${percentage}% (${pass ? "Passed" : "Failed"})`, html);
};

// ── 3. Call Failed — notify admin ─────────────────────────────────────────
export const sendCallFailedEmail = async (adminEmail, callData, agentName) => {
  const { fileName, errorMessage, _id, scorecardName } = callData;
  const appUrl = process.env.CLIENT_URL || "http://localhost:5173";

  const html = emailLayout(`
    <div style="background:#fef2f2; border:1px solid #fecaca; border-radius:12px; padding:16px 20px; margin-bottom:24px; display:flex; gap:12px; align-items:flex-start;">
      <span style="font-size:20px;">⚠️</span>
      <div>
        <p style="margin:0; font-size:14px; font-weight:700; color:#dc2626;">Call Processing Failed</p>
        <p style="margin:4px 0 0; font-size:13px; color:#991b1b; line-height:1.5;">A call could not be processed and requires your attention.</p>
      </div>
    </div>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr>
        <td style="padding:8px 0; border-bottom:1px solid #f3f4f6; font-size:13px; color:#6b7280; width:40%;">Agent</td>
        <td style="padding:8px 0; border-bottom:1px solid #f3f4f6; font-size:13px; font-weight:600; color:#111827;">${agentName || "Unknown"}</td>
      </tr>
      <tr>
        <td style="padding:8px 0; border-bottom:1px solid #f3f4f6; font-size:13px; color:#6b7280;">File</td>
        <td style="padding:8px 0; border-bottom:1px solid #f3f4f6; font-size:13px; font-weight:600; color:#111827;">${fileName}</td>
      </tr>
      <tr>
        <td style="padding:8px 0; border-bottom:1px solid #f3f4f6; font-size:13px; color:#6b7280;">Scorecard</td>
        <td style="padding:8px 0; border-bottom:1px solid #f3f4f6; font-size:13px; font-weight:600; color:#111827;">${scorecardName}</td>
      </tr>
      ${errorMessage ? `
      <tr>
        <td style="padding:8px 0; font-size:13px; color:#6b7280; vertical-align:top;">Error</td>
        <td style="padding:8px 0; font-size:12px; color:#dc2626; font-family:monospace; word-break:break-all;">${errorMessage}</td>
      </tr>` : ""}
    </table>

    <a href="${appUrl}/admin/calls" style="display:inline-block; background:#111827; color:#fff; text-decoration:none; font-weight:700; font-size:14px; padding:12px 24px; border-radius:9px;">
      View in Admin Dashboard →
    </a>
  `);

  await sendEmail(adminEmail, `⚠️ Call processing failed — ${fileName}`, html);
};

// ── 4. Admin notification: new call uploaded ──────────────────────────────
export const sendCallUploadedEmail = async (adminEmail, agentName, fileName, scorecardName) => {
  const appUrl = process.env.CLIENT_URL || "http://localhost:5173";

  const html = emailLayout(`
    <h1 style="margin:0 0 8px; font-size:22px; font-weight:800; color:#111827;">New call uploaded</h1>
    <p style="margin:0 0 24px; font-size:14px; color:#6b7280; line-height:1.6;">
      A new call has been submitted for QA review and is being processed.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr>
        <td style="padding:8px 0; border-bottom:1px solid #f3f4f6; font-size:13px; color:#6b7280; width:40%;">Agent</td>
        <td style="padding:8px 0; border-bottom:1px solid #f3f4f6; font-size:13px; font-weight:600; color:#111827;">${agentName}</td>
      </tr>
      <tr>
        <td style="padding:8px 0; border-bottom:1px solid #f3f4f6; font-size:13px; color:#6b7280;">File</td>
        <td style="padding:8px 0; border-bottom:1px solid #f3f4f6; font-size:13px; font-weight:600; color:#111827;">${fileName}</td>
      </tr>
      <tr>
        <td style="padding:8px 0; font-size:13px; color:#6b7280;">Scorecard</td>
        <td style="padding:8px 0; font-size:13px; font-weight:600; color:#111827;">${scorecardName}</td>
      </tr>
    </table>
    <a href="${appUrl}/admin/calls" style="display:inline-block; background:#16a34a; color:#fff; text-decoration:none; font-weight:700; font-size:14px; padding:12px 24px; border-radius:9px;">
      View Calls →
    </a>
  `);

  await sendEmail(adminEmail, `New call uploaded by ${agentName}`, html);
};