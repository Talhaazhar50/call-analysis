export const sendOTPEmail = async (to, otp) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`\n🔐 OTP for ${to}: ${otp}\n`);
    return;
  }

  const digits = String(otp).split('');

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
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
  htmlContent: `
  <div style="background:#f6f6f6; padding:40px 16px; font-family:'Georgia','Times New Roman',serif;">
    <div style="max-width:480px; margin:0 auto;">

      <!-- Brand -->
      <div style="text-align:center; margin-bottom:24px;">
        <div style="display:inline-flex; align-items:center; gap:10px;">
          <div style="width:36px; height:36px; background:#16a34a; border-radius:9px; display:inline-flex; align-items:center; justify-content:center;">
            <span style="color:#ffffff; font-size:18px; font-weight:900; font-family:Georgia,serif;">C</span>
          </div>
          <span style="font-size:16px; font-weight:700; color:#111827; font-family:'Segoe UI',sans-serif; letter-spacing:-0.01em;">CallAnalytics</span>
        </div>
      </div>

      <!-- Card -->
      <div style="background:#ffffff; border-radius:20px; overflow:hidden; box-shadow:0 2px 20px rgba(0,0,0,0.06);">

        <!-- Green top bar -->
        <div style="height:5px; background:linear-gradient(90deg, #16a34a, #22c55e);"></div>

        <!-- Body -->
        <div style="padding:40px;">

          <h1 style="margin:0 0 8px; font-size:26px; font-weight:800; color:#111827; letter-spacing:-0.03em; font-family:'Segoe UI',sans-serif;">Your login code</h1>
          <p style="margin:0 0 32px; font-size:14px; color:#6b7280; line-height:1.6; font-family:'Segoe UI',sans-serif;">
            Use this one-time code to sign in to your CallAnalytics account.
          </p>

          <!-- OTP Label -->
          <p style="margin:0 0 12px; font-size:11px; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; color:#9ca3af; font-family:'Segoe UI',sans-serif;">One-time passcode</p>

          <!-- OTP Digits -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
            <tr>
              ${digits.map(d => `
                <td style="padding:0 5px; text-align:center;">
                  <div style="background:#f0fdf4; border:1.5px solid #86efac; border-radius:14px; padding:18px 0; font-size:30px; font-weight:800; color:#16a34a; font-family:'Segoe UI',sans-serif;">
                    ${d}
                  </div>
                </td>
              `).join('')}
            </tr>
          </table>

          <!-- Expiry -->
          <div style="background:#fefce8; border:1px solid #fef08a; border-radius:10px; padding:12px 16px; margin-bottom:32px;">
            <span style="font-size:13px; color:#854d0e; font-family:'Segoe UI',sans-serif;">
              ⏱ Expires in <strong style="font-weight:700;">10 minutes</strong> — do not share this code with anyone.
            </span>
          </div>

          <div style="height:1px; background:#f3f4f6; margin-bottom:24px;"></div>

          <p style="margin:0; font-size:13px; color:#9ca3af; line-height:1.7; font-family:'Segoe UI',sans-serif;">
            If you didn't request this code, you can safely ignore this email.<br/>
            Need help? <a href="mailto:support@callanalytics.com" style="color:#16a34a; font-weight:600; text-decoration:none;">Contact support →</a>
          </p>

        </div>

        <!-- Footer -->
        <div style="background:#f9fafb; border-top:1px solid #f3f4f6; padding:16px 40px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="font-size:12px; font-weight:700; color:#d1d5db; letter-spacing:0.06em; font-family:'Segoe UI',sans-serif;">CALLANALYTICS</td>
              <td style="text-align:right; font-size:12px; color:#d1d5db; font-family:'Segoe UI',sans-serif;">© ${new Date().getFullYear()}</td>
            </tr>
          </table>
        </div>

      </div>

      <p style="text-align:center; margin-top:20px; font-size:11px; color:#d1d5db; font-family:'Segoe UI',sans-serif;">
        You're receiving this because you requested a login code.
      </p>

    </div>
  </div>
`,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Brevo error: ${error.message}`);
  }
};