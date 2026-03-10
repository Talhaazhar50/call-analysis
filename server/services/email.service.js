export const sendOTPEmail = async (to, otp) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`\n🔐 OTP for ${to}: ${otp}\n`);
    return;
  }

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
        <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto; padding: 32px;">
          <h2 style="color: #111827;">Your login code</h2>
          <p style="color: #6b7280;">Use this code to sign in. It expires in 10 minutes.</p>
          <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; text-align: center;">
            <span style="font-size: 42px; font-weight: 800; letter-spacing: 10px; color: #16a34a;">${otp}</span>
          </div>
          <p style="color: #9ca3af; font-size: 13px; margin-top: 24px;">If you didn't request this, ignore this email.</p>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Brevo error: ${error.message}`);
  }
};
