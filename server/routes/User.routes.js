import User from "../models/User.model.js";
import express from "express";
import { adminOnly, protect } from "../middleware/auth.middleware.js";

const router = express.Router();
router.use(protect, adminOnly);

// GET /api/users
router.get("/", async (req, res) => {
  const users = await User.find()
    .select("-otp -otpExpiry -passkeys -currentChallenge")
    .sort({ createdAt: -1 });
  res.json(users);
});

// PATCH /api/users/:id/toggle — toggle isActive
router.patch("/:id/toggle", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  user.isActive = !user.isActive;
  await user.save();
  res.json({ isActive: user.isActive });
});

// DELETE /api/users/:id
router.delete("/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
});

export default router;
