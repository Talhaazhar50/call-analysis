import User from "../models/User.model.js";
import jwt from "jsonwebtoken";
import { sendOTPEmail } from "../services/email.service.js";

const generateToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// ── Step 1: Send OTP ──────────────────────────────────────────────────────────
export const sendCode = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  // Find OR create — never duplicate
  let user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    user = await User.create({
      email: email.toLowerCase().trim(),
      name: email.split("@")[0],
      role: "user",
      isActive: true,
    });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min
  await user.save();

  await sendOTPEmail(user.email, otp);

  res.json({ message: "OTP sent" });
};

// ── Step 2: Verify OTP ────────────────────────────────────────────────────────
export const verifyCode = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp)
    return res.status(400).json({ message: "Email and OTP are required" });

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.otp !== otp) return res.status(401).json({ message: "Invalid OTP" });
  if (user.otpExpiry < new Date())
    return res.status(401).json({ message: "OTP expired" });

  // Clear OTP
  user.otp = null;
  user.otpExpiry = null;
  user.isActive = true;
  await user.save();

  const token = generateToken(user);

  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

// ── Get current user ──────────────────────────────────────────────────────────
export const getMe = async (req, res) => {
  const user = await User.findById(req.user.id).select(
    "-otp -otpExpiry -passkeys -currentChallenge",
  );
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};
