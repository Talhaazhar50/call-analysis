import User from "../models/User.model.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { sendOTPEmail } from "../services/email.service.js";

const generateOTP = () => crypto.randomInt(100000, 999999).toString();

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

// POST /api/auth/send-code
export const sendCode = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  let user = await User.findOne({ email });

  // Auto-create user if not found (first time login)
  if (!user) {
    const name = email.split("@")[0];
    user = await User.create({ name, email, role: "user" });
  }

  if (!user.isActive) {
    return res
      .status(403)
      .json({ message: "Your account has been deactivated" });
  }

  const otp = generateOTP();
  user.otp = otp;
  user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
  await user.save();

  await sendOTPEmail(email, otp);

  res.json({ message: "Code sent to your email" });
};

// POST /api/auth/verify-code
export const verifyCode = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp)
    return res.status(400).json({ message: "Email and code are required" });

  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ message: "User not found" });
  if (!user.otp || !user.otpExpiry)
    return res.status(400).json({ message: "No code requested" });
  if (new Date() > user.otpExpiry)
    return res.status(400).json({ message: "Code expired" });
  if (user.otp !== otp)
    return res.status(400).json({ message: "Invalid code" });

  // Clear OTP
  user.otp = null;
  user.otpExpiry = null;
  await user.save();

  const token = signToken(user);

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

// GET /api/auth/me
export const getMe = async (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
  });
};
