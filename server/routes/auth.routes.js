import express from "express";
import { getMe, sendCode, verifyCode } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import {
  getRegisterOptions,
  verifyRegistration,
  getLoginOptions,
  verifyLogin,
  deletePasskey ,getPasskeys 
} from "../controllers/passkey.controller.js";

const router = express.Router();

// OTP
router.post("/send-code", sendCode);
router.post("/verify-code", verifyCode);
router.get("/me", protect, getMe);

// Passkey
router.post("/passkey/register-options", getRegisterOptions);
router.post("/passkey/register-verify", verifyRegistration);
router.post("/passkey/login-options", getLoginOptions);
router.post("/passkey/login-verify", verifyLogin);
router.delete('/passkey/:credentialID', protect, deletePasskey)
router.get('/passkeys', protect, getPasskeys)

export default router;