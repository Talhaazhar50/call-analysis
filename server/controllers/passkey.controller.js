import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from "@simplewebauthn/server";
import User from "../models/User.model.js";
import jwt from "jsonwebtoken";

const RP_NAME = "CallAnalytics"
const RP_ID = process.env.RP_ID || "localhost"
const ORIGIN = process.env.ORIGIN || "http://localhost:5173"
console.log("RP_ID:", process.env.RP_ID)
console.log("ORIGIN:", process.env.ORIGIN)


const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

// POST /api/auth/passkey/register-options
export const getRegisterOptions = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    let user = await User.findOne({ email });
    if (!user) {
      const name = email.split("@")[0];
      user = await User.create({ name, email, role: "user" });
    }

    if (!user.isActive)
      return res.status(403).json({ message: "Account deactivated" });

    const options = await generateRegistrationOptions({
      rpName: RP_NAME,
      rpID: RP_ID,
      userID: new TextEncoder().encode(user._id.toString()),
      userName: user.email,
      userDisplayName: user.name,
      attestationType: "none",
      excludeCredentials: user.passkeys.map((pk) => ({
        id: pk.credentialID,
        type: "public-key",
        transports: pk.transports,
      })),
      authenticatorSelection: {
        residentKey: "preferred",
        userVerification: "preferred",
      },
    });

    user.currentChallenge = options.challenge;
    await user.save();

    res.json(options);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/passkey/register-verify
export const verifyRegistration = async (req, res) => {
  try {
    const { email, registrationResponse } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const verification = await verifyRegistrationResponse({
      response: registrationResponse,
      expectedChallenge: user.currentChallenge,
      expectedOrigin: ORIGIN,
      expectedRPID: RP_ID,
    });

    if (!verification.verified)
      return res.status(400).json({ message: "Verification failed" });

    const { credential } = verification.registrationInfo;

    user.passkeys.push({
      credentialID: credential.id,
      credentialPublicKey: Buffer.from(credential.publicKey).toString("base64"),
      counter: credential.counter,
      transports: registrationResponse.response.transports ?? [],
    });

    user.currentChallenge = null;
    await user.save();

    res.json({ message: "Passkey registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/passkey/login-options
// POST /api/auth/passkey/login-options
export const getLoginOptions = async (req, res) => {
  try {
    const options = await generateAuthenticationOptions({
      rpID: RP_ID,
      userVerification: "preferred",
      // No allowCredentials = browser shows all saved passkeys for this site
    })

    // Store challenge in a temp cookie/session since we don't know user yet
    res.cookie('passkey_challenge', options.challenge, {
      httpOnly: true,
      maxAge: 5 * 60 * 1000, // 5 mins
      sameSite: 'lax',
    })

    res.json(options)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// POST /api/auth/passkey/login-verify
// POST /api/auth/passkey/login-verify
export const verifyLogin = async (req, res) => {
  try {
    const { authResponse } = req.body
    const challenge = req.cookies?.passkey_challenge

    console.log('challenge from cookie:', challenge)        // add
    console.log('authResponse.id:', authResponse?.id)       // add

    if (!challenge) return res.status(400).json({ message: 'Challenge expired, try again' })

    // Find user by credentialID — no email needed
    const user = await User.findOne({
      'passkeys.credentialID': authResponse.id
    })

    if (!user) return res.status(400).json({ message: 'No passkey found for this device' })

    const passkey = user.passkeys.find(pk => pk.credentialID === authResponse.id)

    const verification = await verifyAuthenticationResponse({
      response: authResponse,
      expectedChallenge: challenge,
      expectedOrigin: ORIGIN,
      expectedRPID: RP_ID,
      credential: {
        id: passkey.credentialID,
        publicKey: Buffer.from(passkey.credentialPublicKey, 'base64'),
        counter: passkey.counter,
        transports: passkey.transports,
      },
    })

    if (!verification.verified)
      return res.status(400).json({ message: 'Authentication failed' })

    passkey.counter = verification.authenticationInfo.newCounter
    await user.save()

    // Clear challenge cookie
    res.clearCookie('passkey_challenge')

    const token = signToken(user)
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// DELETE /api/auth/passkey/:credentialID
export const deletePasskey = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    const before = user.passkeys.length
    user.passkeys = user.passkeys.filter(pk => pk.credentialID !== req.params.credentialID)

    if (user.passkeys.length === before)
      return res.status(404).json({ message: 'Passkey not found' })

    await user.save()
    res.json({ message: 'Passkey deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/auth/passkeys
export const getPasskeys = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    const passkeys = user.passkeys.map((pk, i) => ({
      credentialID: pk.credentialID,
      label: `Passkey ${i + 1}`,
      createdAt: pk._id.getTimestamp(),
    }))
    res.json(passkeys)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}