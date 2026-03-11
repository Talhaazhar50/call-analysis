import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    isActive: { type: Boolean, default: true },
    scorecard: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Scorecard",
      default: null,
    },
    otp: { type: String, default: null },
    otpExpiry: { type: Date, default: null },

    // Google OAuth
    googleId: { type: String, default: null },

    // Passkey fields
    passkeys: [
      {
        credentialID: { type: String, required: true },
        credentialPublicKey: { type: String, required: true }, // base64
        counter: { type: Number, default: 0 },
        transports: [{ type: String }],
      },
    ],
    currentChallenge: { type: String, default: null },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
